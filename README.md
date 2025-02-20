<p align="center">
  <a href="https://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

# Image Processing App

A NestJS-based application for user authentication, file uploads to AWS S3, and advanced image transformations (resize, crop, rotate, flip, mirror, filters, compression, and watermarking).

---

## Table of Contents

- [Live Demo](#live-demo)
- [Features](#features)
- [Endpoints](#endpoints)
- [Installation](#installation)
- [Running the App](#running-the-app)
- [Environment Variables](#environment-variables)
- [Image Transformations](#image-transformations)
- [Author](#author)

---

## Live Demo

You can access the live version of this application here:
**[https://image-processing-app-v6ju.onrender.com/](https://image-processing-app-v6ju.onrender.com/)**

---

## Features

1. **User Management & Authentication**

   - Sign up, sign in, verify email, reset password, resend verification email.
   - Secure password handling with validation and error handling.

2. **AWS S3 File Operations**

   - Single and multiple file uploads (`upload-image`, `upload-many`).
   - Single and multiple file retrieval (`get-image`, `get-many`).
   - Single and multiple file deletions (`delete-image`, `delete-many`).

3. **Image Transformations**

   - Resize, crop, rotate, flip, mirror.
   - Format conversion (e.g., PNG, JPEG, WebP).
   - Apply filters (grayscale, sepia, etc.).
   - Compress images with adjustable quality.
   - Watermarking (position, size).

4. **Access Control & Error Handling**
   - Proper validations for invalid requests or unauthorized operations.
   - Batch operations for file retrieval and deletion.
   - Optimized logic to ensure efficiency and maintainability.

---

## Endpoints

Below is a brief overview of the key endpoints (all requests should be prefixed by the base URL: `https://image-processing-app-v6ju.onrender.com`):

### Auth & Users

- **`[POST] /sign-up`**  
  Create a new user.

- **`[POST] /verify-email`**  
  Verify user email via token.

- **`[POST] /request-reset-password`**  
  Request a password reset link.

- **`[POST] /resend-verify-email`**  
  Resend the email verification link.

- **`[POST] /reset-password`**  
  Reset password.

- **`[POST] /sign-in`**  
  Sign in with email and password.

- **`[GET] /current-user`**  
  Get the currently logged-in user (requires authentication).

### File Operations

- **`[POST] /upload-image`**  
  Upload a single file to AWS S3.

- **`[POST] /upload-many`**  
  Upload multiple files to AWS S3.

- **`[POST] /delete-image`**  
  Delete a single file from AWS S3.

- **`[POST] /delete-many`**  
  Delete multiple files from AWS S3.

- **`[POST] /get-image`**  
  Retrieve a single file from AWS S3 (returns a base64 string).

- **`[POST] /get-many`**  
  Retrieve multiple files from AWS S3 (returns an array of base64 strings).

### Image Transformations

- **`[POST] /:id/transform`**  
  Apply image transformations (resize, crop, rotate, flip, mirror, filters, compress, watermark, etc.) to an already uploaded image identified by `:id`.

---

## Installation

1. **Clone the Repository**

   ```bash
   git clone https://github.com/mariamkhutuashvili/image-processing-app.git
   cd image-processing-app
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

---

## Running the App

### Development

```bash
npm run start
```

### Watch Mode

```bash
npm run start:dev
```

### Production

```bash
npm run start:prod
```

---

## Environment Variables

Create a `.env` file at the root of the project (or use your preferred method for environment variables). The following variables are typically required:

```ini
AWS_ACCESS_KEY=YOUR_AWS_ACCESS_KEY
AWS_SECRET_ACCESS_KEY=YOUR_AWS_SECRET_ACCESS_KEY
AWS_REGION=YOUR_AWS_REGION
AWS_BUCKET_NAME=YOUR_AWS_S3_BUCKET_NAME

# Example
# AWS_ACCESS_KEY=AKIA...
# AWS_SECRET_ACCESS_KEY=123abc...
# AWS_REGION=us-east-1
# AWS_BUCKET_NAME=image-processing-bucket
```

---

## Image Transformations

You can apply various transformations by sending a POST request to `/:id/transform` with a JSON body containing a transformations object. Below are some examples:

### Resize

```json
{
  "transformations": {
    "resize": {
      "width": 500,
      "height": 300
    }
  }
}
```

### Crop

```json
{
  "transformations": {
    "crop": {
      "width": 200,
      "height": 200,
      "x": 50,
      "y": 50
    }
  }
}
```

### Rotate

```json
{
  "transformations": {
    "rotate": 90
  }
}
```

### Format Conversion

```json
{
  "transformations": {
    "format": "png"
  }
}
```

### Filters

```json
{
  "transformations": {
    "filter": {
      "grayscale": true,
      "sepia": false
    }
  }
}
```

### Flip

```json
{
  "transformations": {
    "flip": true
  }
}
```

### Mirror

```json
{
  "transformations": {
    "mirror": true
  }
}
```

### Compression

```json
{
  "transformations": {
    "compress": 80
  }
}
```

### Watermark

```json
{
  "transformations": {
    "watermark": {
      "watermarkPath": "C:/path/to/watermark.png",
      "position": "center",
      "watermarkWidth": 150,
      "watermarkHeight": 200
    }
  }
}
```

**Note:** Watermark paths may vary by environment and file system. Ensure the path is accessible by the server.

---

## Author

- [Mariam Khutuashvili](https://github.com/mariamkhutuashvili)
- [Luka Gobechia](https://github.com/lukagobechia)
