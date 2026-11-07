
import os

import httpx
from dotenv import load_dotenv
from fastapi import FastAPI, File, HTTPException, UploadFile
from fastapi.middleware.cors import CORSMiddleware

load_dotenv()

app = FastAPI(
    title="PlantLab API",
    description="Backend API for identifying plants.",
    version="1.0.0"
)

# Allow our Next.js frontend to communicate with this backend.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def home():
    return {"message": "Welcome to PlantLab API!"}


@app.get("/health")
def health_check():
    return {"status": "healthy"}


@app.post("/identify")
async def identify_plant(image: UploadFile = File(...)):

    # 1. Get the API key from our private .env file.
    api_key = os.getenv("PLANTNET_API_KEY")

    if not api_key:
        raise HTTPException(
            status_code=500,
            detail="Pl@ntNet API key is missing."
        )

    # 2. Validate the uploaded image.
    if image.content_type not in ["image/jpeg", "image/png"]:
        raise HTTPException(
            status_code=400,
            detail="Please upload a JPEG or PNG image."
        )

    image_data = await image.read()

    if not image_data:
        raise HTTPException(
            status_code=400,
            detail="The uploaded image is empty."
        )

    if len(image_data) > 50 * 1024 * 1024:
        raise HTTPException(
            status_code=400,
            detail="Image must be smaller than 50 MB."
        )

    # 3. Prepare the request for Pl@ntNet.
    url = "https://my-api.plantnet.org/v2/identify/all"

    params = {
        "api-key": api_key,
        "nb-results": 3,
        "lang": "en"
    }

    files = {
        "images": (
            image.filename or "plant-image.jpg",
            image_data,
            image.content_type
        )
    }

    # 4. Send the image to Pl@ntNet.
    try:
        async with httpx.AsyncClient(timeout=60.0) as client:
            response = await client.post(
                url,
                params=params,
                files=files
            )

        if response.status_code == 404:
            raise HTTPException(
                status_code=404,
                detail="No plant species could be identified in this image."
            )

        if response.status_code != 200:
            raise HTTPException(
                status_code=502,
                detail=f"Pl@ntNet returned an error: {response.text}"
            )

        # 5. Return the identification results.
        return response.json()

    except httpx.RequestError:
        raise HTTPException(
            status_code=503,
            detail="Could not connect to Pl@ntNet. Please try again."
        )
