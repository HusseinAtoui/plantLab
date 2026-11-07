# plantLab
A plant identification web app that helps users identify plant species from photos using the Pl@ntNet API. Built with Next.js, TypeScript, FastAPI, and Python.

**An intelligent plant identification and monitoring platform.**

PlantLab is a web application designed to help users identify plants through images. The initial version focuses on plant species identification, with plans to expand into plant health analysis, growth tracking, and personalized plant monitoring.

## Features

### Current MVP: Plant Identification

- Upload a plant image or take a photo using a mobile device.
- Identify plant species using the Pl@ntNet API.
- Display the top 3 predicted species with confidence scores.
- Handle invalid images and uncertain identification results.

### Future Features

- Plant health and disease detection.
- Leaf detection and image segmentation.
- Plant growth tracking through image comparisons.
- Personal plant collections and journals.
- Custom machine learning models for plant classification.

## Architecture

PlantLab follows a client-server architecture:

1. **Frontend:** Users interact with the website and upload plant images.
2. **Backend:** FastAPI receives and validates images, then communicates with the Pl@ntNet API.
3. **Identification:** Pl@ntNet processes the image and returns possible plant species.
4. **Results:** The backend formats the predictions and sends them to the frontend for display.

