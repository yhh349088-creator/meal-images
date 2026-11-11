from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from pathlib import Path
from starlette.background import BackgroundTask
import tempfile
import shutil
import uuid

from backend.stitch_converter import convert_svg_to_dst

app = FastAPI(
    title="YAZOO DST AI",
    description="Embroidery Digitizing API",
    version="1.1.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

BASE_DIR = Path(__file__).resolve().parent.parent
MAX_UPLOAD_SIZE = 10 * 1024 * 1024


@app.get("/")
def home():
    return {
        "name": "YAZOO DST AI",
        "status": "online",
        "conversion_api": "/convert/svg"
    }


@app.get("/health")
def health():
    return {
        "status": "healthy",
        "engine_exists": (BASE_DIR / "backend/stitch_converter.py").exists()
    }


@app.post("/convert/svg")
async def convert_svg(file: UploadFile = File(...)):
    if not file.filename or Path(file.filename).suffix.lower() != ".svg":
        raise HTTPException(400, "Please upload an SVG file")

    job_dir = Path(tempfile.mkdtemp(prefix="yazoo_"))
    input_path = job_dir / "design.svg"
    output_path = job_dir / "design.dst"

    try:
        size = 0

        with input_path.open("wb") as destination:
            while True:
                chunk = await file.read(1024 * 1024)
                if not chunk:
                    break

                size += len(chunk)

                if size > MAX_UPLOAD_SIZE:
                    raise HTTPException(413, "File exceeds 10 MB limit")

                destination.write(chunk)

        result = convert_svg_to_dst(input_path, output_path)

        return FileResponse(
            path=str(output_path),
            media_type="application/octet-stream",
            filename=f"YAZOO-{uuid.uuid4().hex[:10]}.dst",
            headers={
                "X-YAZOO-Stitches": str(result["stitches"]),
                "X-YAZOO-Contours": str(result["contours"])
            },
            background=BackgroundTask(shutil.rmtree, job_dir, True)
        )

    except HTTPException:
        shutil.rmtree(job_dir, ignore_errors=True)
        raise
    except Exception as error:
        shutil.rmtree(job_dir, ignore_errors=True)
        raise HTTPException(422, f"Conversion failed: {str(error)}")
    finally:
        await file.close()


@app.post("/convert/image")
async def convert_image(file: UploadFile = File(...)):
    from backend.image_pipeline import image_to_svg

    allowed = {".png", ".jpg", ".jpeg"}

    if not file.filename or Path(file.filename).suffix.lower() not in allowed:
        raise HTTPException(400, "Upload PNG or JPG image")

    job_dir = Path(tempfile.mkdtemp(prefix="yazoo_image_"))
    input_path = job_dir / ("design" + Path(file.filename).suffix.lower())
    svg_path = job_dir / "design.svg"
    pbm_path = job_dir / "design.pbm"
    output_path = job_dir / "design.dst"

    try:
        size = 0

        with input_path.open("wb") as destination:
            while True:
                chunk = await file.read(1024 * 1024)
                if not chunk:
                    break

                size += len(chunk)
                if size > MAX_UPLOAD_SIZE:
                    raise HTTPException(413, "File exceeds 10 MB limit")

                destination.write(chunk)

        image_info = image_to_svg(input_path, svg_path, pbm_path)
        result = convert_svg_to_dst(svg_path, output_path)

        return FileResponse(
            path=str(output_path),
            media_type="application/octet-stream",
            filename=f"YAZOO-{uuid.uuid4().hex[:10]}.dst",
            headers={
                "X-YAZOO-Stitches": str(result["stitches"]),
                "X-YAZOO-Contours": str(result["contours"]),
                "X-YAZOO-Image-Width": str(image_info["width"]),
                "X-YAZOO-Image-Height": str(image_info["height"])
            },
            background=BackgroundTask(shutil.rmtree, job_dir, True)
        )

    except HTTPException:
        shutil.rmtree(job_dir, ignore_errors=True)
        raise
    except Exception as error:
        shutil.rmtree(job_dir, ignore_errors=True)
        raise HTTPException(422, f"Image conversion failed: {str(error)}")
    finally:
        await file.close()
