# Setup and Configuration

This guide will help you set up the DevCamper API project locally.

## Prerequisites
- Node.js (v20.15.0 or higher)
- NPM (v10.2.4 or higher)
- MongoDB (Local or Atlas)

## Installation

1.  **Clone the repository**
    ```bash
    git clone <repository-url>
    cd apiNodeJS
    ```

2.  **Install dependencies**
    ```bash
    npm install
    ```

3.  **Configure Environment Variables**
    Create a `config/config.env` file (or `.env` in the root) and add the following variables:

    ```env
    NODE_ENV=development
    PORT=5000
    
    # Database Connection
    MONGO_URI=<your_mongodb_uri>
    
    # Geocoder (MapQuest, Google, etc.)
    GEOCODER_PROVIDER=mapquest
    GEOCODER_API_KEY=<your_api_key>
    
    # File Upload
    FILE_UPLOAD_PATH=./public/uploads
    MAX_FILE_UPLOAD=1000000
    
    # JWT Authentication
    JWT_SECRET=<your_jwt_secret>
    JWT_EXPIRE=30d
    
    # Cookie
    JWT_COOKIE_EXPIRE=30
    
    # Email (SMTP)
    SMTP_HOST=smtp.mailtrap.io
    SMTP_PORT=2525
    SMTP_EMAIL=<your_smtp_email>
    SMTP_PASSWORD=<your_smtp_password>
    FROM_EMAIL=noreply@devcamper.io
    FROM_NAME=DevCamper
    ```

4.  **Run the server**
    - **Development mode** (with nodemon):
      ```bash
      npm run dev
      ```
    - **Production mode**:
      ```bash
      npm start
      ```

## Database Seeding
To seed the database with dummy data, you can use the seeder script (if available).
*(Check `seeder.js` in the root directory if it exists)*

```bash
# Import data
node seeder.js -i

# Destroy data
node seeder.js -d
```
