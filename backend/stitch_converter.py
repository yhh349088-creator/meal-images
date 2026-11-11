import re
import math
from pathlib import Path

from svg.path import parse_path
from pyembroidery import EmbPattern, write_dst, read_dst
from pyembroidery.EmbEncoder import JUMP, STITCH


def convert_svg_to_dst(
    svg_path,
    dst_path,
    target_width_mm=150,
    max_sample_distance=16.0
):
    svg_path = Path(svg_path)
    dst_path = Path(dst_path)

    if not svg_path.is_file():
        raise FileNotFoundError("SVG input file not found")

    if target_width_mm <= 0:
        raise ValueError("Invalid target width")

    svg = svg_path.read_text(encoding="utf-8")

    paths = re.findall(
        r'<path\b[^>]*\bd="([^"]+)"',
        svg,
        re.S
    )

    if not paths:
        raise RuntimeError("No SVG paths found")

    contours = []

    for d in paths:
        parsed = parse_path(d)
        contour = []

        for segment in parsed:
            if type(segment).__name__ == "Move":
                if len(contour) > 1:
                    contours.append(contour)

                contour = [
                    (segment.end.real, segment.end.imag)
                ]
                continue

            length = segment.length(error=0.1)
            steps = max(
                1,
                math.ceil(length / max_sample_distance)
            )

            for i in range(1, steps + 1):
                point = segment.point(i / steps)
                xy = (point.real, point.imag)

                if not contour:
                    contour.append(xy)
                else:
                    old = contour[-1]
                    if math.hypot(
                        xy[0] - old[0],
                        xy[1] - old[1]
                    ) > 0.1:
                        contour.append(xy)

        if len(contour) > 1:
            contours.append(contour)

    if not contours:
        raise RuntimeError("No usable contours found")

    all_points = [
        point
        for contour in contours
        for point in contour
    ]

    min_x = min(p[0] for p in all_points)
    max_x = max(p[0] for p in all_points)
    min_y = min(p[1] for p in all_points)
    max_y = max(p[1] for p in all_points)

    design_width = max_x - min_x

    if design_width <= 0:
        raise RuntimeError("Invalid design width")

    scale = (target_width_mm * 10) / design_width

    pattern = EmbPattern()
    stitch_count = 0
    jump_count = 0

    for contour in contours:
        converted = []

        for x, y in contour:
            px = round((x - min_x) * scale)
            py = round((max_y - y) * scale)
            point = (px, py)

            if not converted or point != converted[-1]:
                converted.append(point)

        if len(converted) < 2:
            continue

        pattern.add_stitch_absolute(
            JUMP,
            converted[0][0],
            converted[0][1]
        )
        jump_count += 1

        for x, y in converted[1:]:
            pattern.add_stitch_absolute(STITCH, x, y)
            stitch_count += 1

    if stitch_count == 0:
        raise RuntimeError("No stitches generated")

    dst_path.parent.mkdir(parents=True, exist_ok=True)
    write_dst(pattern, str(dst_path))

    check = read_dst(str(dst_path))

    if not check.stitches:
        raise RuntimeError("DST verification failed")

    return {
        "svg_paths": len(paths),
        "contours": len(contours),
        "stitches": stitch_count,
        "jumps": jump_count,
        "dst_records": len(check.stitches),
        "output": str(dst_path)
    }
