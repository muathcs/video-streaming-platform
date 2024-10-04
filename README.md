# Celebrity Shoutout Platform

## Table of Contents
- [Introduction](#introduction)
- [Features](#features)
- [Demo](#demo)
- [Tech Stack](#tech-stack)
- [Installation](#installation)
- [Usage](#usage)
- [API Documentation](#api-documentation) (optional)
- [Contributing](#contributing)
- [License](#license)
- [Contact](#contact)
- [Roadmap](#roadmap) (optional)

---

## Introduction

Welcome to **Celebrity Shoutout Platform**, an application where fans can request personalized video shoutouts from their favorite celebrities, influencers, and creators!the app offers an intuitive experience for both celebrities and users, with secure payments and a seamless video delivery process.

Whether you want a birthday greeting, motivational speech, or custom shoutout, this app connects fans with their idols in just a few clicks.

---

## Features

- **Browse Celebrities**: Users can explore a diverse collection of celebrities, influencers, and content creators.
- **Request Shoutouts**: Fans can request personalized video shoutouts for themselves or as gifts for others.
- **Secure Payment Gateway**: Process payments securely via Stripe/PayPal or other integrated services.
- **Automatic refund**: If a shoutout request remains unfulfilled for more than one week, an automated cron job tracks the request and triggers an automatic refund for the user. This ensures that fans are not left waiting indefinitely and helps maintain a positive user experience.
- **Video Delivery**: Celebrities can record and upload videos using either the webstie or mobile app built in react native, which are delivered directly to users via email or platform notification.
- **Rating System**: Users can rate their experience and provide feedback on completed shoutouts.
- **Recommender System**: The platform features an AI-powered recommender system built using Python and PyTorch, It works by tracking user's preferences and behavior and suggests celebrites that may fit that preference.
- **Notification System**: A notification system that alerts users via in-app messages when their requested shoutouts are ready or when important updates occur.
- **Live Search**: The platform features a dynamic live search bar built with React and PostgreSQL's full-text search, delivering real-time, accurate search results as users type.
- **Dynamic onboarding**: The platform offers a complex onboarding experience for celebrities that dynamically adapts based on wether they sign-up manually or used an invite code.
- **Authentication**: Complex Auth system, with ability to verifiy email, and retrieve forgotten password
- **Setting Page**: Allows users to change personal information like email & password, bio, price, etc.
  


## Demo

use the link below to try it:

user test login:

email: mm1@gmail.com  
password: 123456

for celebrity login, just use the firstName plus secondName @gmail.com for email, and 123456 for password for e.g.

email:first-second@gmail.com
password:123456

(wait 30 secs for server to boot up)
https://vid-stream-cl.onrender.com/

**Screenshots**  
![image](https://github.com/user-attachments/assets/8053ad1f-a8a0-4fe6-a5ff-687ef9202879)
![image](https://github.com/user-attachments/assets/0ba427e1-7b3e-4742-9fd3-3053f915d858)
![image](https://github.com/user-attachments/assets/4f717de3-ccea-47d3-8042-2c5a14ae2371)


## Tech Stack

- **Frontend**: React / TypeScript/Jest
- **Backend**: Node.js / Express / Python /
- **Database**: PostgreSQL / Supabase / Prisma
- **Payment Integration**: Stripe / PayPal
- **File Handling**: AWS S3 for images and videos
- **Authentication**: Firebase

---

## Installation

### Prerequisites

### Clone the Repository

```bash
git clone https://github.com/muathcs/video-streaming-platform.git
cd video-streaming-platform
```

### Install Dependencies

```bash
npm install
```

or if you use yarn:

```bash
yarn install
```

### Configure Environment Variables

Create a `.env` file in the root directory of the client folder and add the following variables:
```bash
VITE_AWS_ACCESS_KEY_ID=<your_aws_access_key_id>
VITE_AWS_SECRET_ACCESS_KEY=<your_aws_secret_access_key>
VITE_FIREBASE_API_KEY=<your_firebase_api_key>
VITE_FIREBASE_AUTH_DOMAIN=<your_firebase_auth_domain>
VITE_FIREBASE_PROJECT_ID=<your_firebase_project_id>
VITE_FIREBASE_STORAGE_BUCKET=<your_firebase_storage_bucket>
VITE_FIREBASE_MESSAGING_SENDER_ID=<your_firebase_messaging_sender_id>
VITE_FIREBASE_APP_ID=<your_firebase_app_id>
# VITE_API_BASE_URL=https://video-streaming-server-z2fg.onrender.com (you can comment this out if you want to run on localhost)
```

Create a `.env` file in the root directory of the server folder and add the following variables:

```bash
STRIPE_PUBLISHABLE_KEY=<your_stripe_publishable_key>
STRIPE_SECRET_KEY=<your_stripe_secret_key>
AMAZON_ACCESS_KEY_ID=<your_amazon_access_key_id>
AMAZON_SECRET_ACCESS_KEY=<your_amazon_secret_access_key>

PG_USER=<your_postgres_user>
PG_HOST=<your_postgres_host>
PG_DATABASE=<your_postgres_database>
PG_PASSWORD=<your_postgres_password>
PG_PORT=<your_postgres_port>

AWS_ACCESS_KEY_ID=<your_aws_access_key_id>
AWS_SECRET_ACCESS_KEY=<your_aws_secret_access_key>
AWS_REGION=<your_aws_region>
S3_BUCKET=<your_s3_bucket>

DATABASE_URL=<your_database_url>
DIRECT_URL=<your_direct_url>
```

### Running Locally


1. **Start the client Server**:

    ```bash
    cd client
    npm install
    npm run dev
    ```
2. **Start the Server**:

    ```bash
    cd server
    npm install
    npm start
    ```

3. **Access the app at `http://localhost:5173/`**

---

## Usage

### For Users
1. **Sign Up / Log In**: Create an account or log in using email:mm1@gmail.com password:123456
2. **Browse Celebrities**: Search for your favorite celebrity and check their availability.
3. **Request a Shoutout**: Fill in the required details for the shoutout, make a payment, and wait for your video to be delivered.
4. **Receive Your Video**: Once the celebrity uploads the video, you can signup to the celeb profile to see how it can be fulfilled (check above to see how to login to celeb profile).


### Bug Reports & Feature Requests

Feel free to open an [issue](https://github.com/muathcs/video-streaming-platform/issues) for any bugs or feature suggestions.

---

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## Contact

If you have any questions, feel free to reach out: muath.csx@gmail.com

---

## Roadmap (optional)

### Planned Features:
- **Subscription Model**: Celebrities can offer subscription services for regular shoutouts.
- **Live Video Feature**: Real-time video interactions for premium users.
- **Expanded Payment Options**: Support for more payment gateways like cryptocurrency.
- **Mobile App**: Exists for celebs only at the moment, user features are almost complete. 
