from pathlib import Path
from PIL import Image, ImageOps
import subprocess


def otsu_threshold(image):
    histogram = image.histogram()
    total = sum(histogram)

    sum_total = sum(i * histogram[i] for i in range(256))
    sum_background = 0
    weight_background = 0
    best_variance = -1
    threshold = 127

    for i in range(256):
        weight_background += histogram[i]

        if weight_background == 0:
            continue

        weight_foreground = total - weight_background

        if weight_foreground == 0:
            break

        sum_background += i * histogram[i]

        mean_background = sum_background / weight_background
        mean_foreground = (
            sum_total - sum_background
        ) / weight_foreground

        variance = (
            weight_background
            * weight_foreground
            * (mean_background - mean_foreground) ** 2
        )

        if variance > best_variance:
            best_variance = variance
            threshold = i

    return threshold


def image_to_svg(image_path, svg_path, pbm_path):
    image = Image.open(image_path).convert("RGB")

    if image.width < 32 or image.height < 32:
        raise ValueError("Image is too small")

    if image.width * image.height > 20_000_000:
        raise ValueError("Image resolution is too large")

    gray = ImageOps.grayscale(image)
    gray = ImageOps.autocontrast(gray)

    threshold = otsu_threshold(gray)

    mask = gray.point(
        lambda pixel: 0 if pixel < threshold else 255
    )

    border = (
        [mask.getpixel((x, 0)) for x in range(mask.width)]
        + [mask.getpixel((x, mask.height - 1)) for x in range(mask.width)]
        + [mask.getpixel((0, y)) for y in range(mask.height)]
        + [mask.getpixel((mask.width - 1, y)) for y in range(mask.height)]
    )

    if sum(border) / len(border) < 127:
        mask = ImageOps.invert(mask)

    mask = mask.convert("1")
    mask.save(pbm_path)

    result = subprocess.run(
        ["potrace", str(pbm_path), "-s", "-o", str(svg_path)],
        capture_output=True,
        text=True,
        timeout=60
    )

    if result.returncode != 0:
        raise RuntimeError(result.stderr or "Potrace failed")

    if not Path(svg_path).is_file():
        raise RuntimeError("SVG generation failed")

    return {
        "width": image.width,
        "height": image.height,
        "threshold": threshold
    }
