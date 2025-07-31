# 🌐 Photo Sharing Platform - Frontend

This is the **React-based frontend** for the Photo Sharing Platform, a social application where users can register, follow others, upload images, and view personalized photo feeds. The frontend interacts with a backend system built using Spring Boot microservices and communicates through a central API Gateway.

---

## 📁 Project Structure

```

photo-frontend/
├── public/                 # Static files (HTML template, favicon, etc.)
├── src/
│   ├── assets/             # Images, icons, and static design assets
│   ├── components/         # Reusable UI components (Navbar, Sidebar, Cards)
│   ├── pages/              # Main route pages (Timeline, Profile, Login, etc.)
│   ├── services/           # API logic to communicate with backend services
│   ├── utils/              # Helper functions (e.g., token parsing)
│   ├── App.js              # Main application component with route definitions
│   ├── index.js            # React entry point
│   └── styles.css          # Global styles
├── .env                    # Environment variables
├── package.json            # Project metadata and dependencies
└── README.md               # This file

```

---

## 🧩 Key Features

- 🖼️ View and upload image posts
- 🔐 User authentication via JWT
- 🧑‍🤝‍🧑 Follow/unfollow users
- 📰 Personalized timeline feed
- 📷 Profile management with bio and avatar
- 🔎 User search with suggestions

---

## ▶️ How to Run the Frontend Locally

> **Prerequisites**:
>
> - Node.js (v18 or higher)
> - Backend and API Gateway running (required)

1. **Install dependencies**:
   ```bash
   npm install
   ```

````

2. **Run the app**:

   ```bash
   npm start
   ```

---

## 🧰 Tech Stack

| Layer          | Technology                      |
| -------------- | ------------------------------- |
| Framework      | React.js                        |
| State Handling | useState, useEffect             |
| HTTP Client    | Axios                           |
| Auth           | JWT          |
| Styling        | CSS Modules / Custom            |
| Media Handling | MinIO via presigned URLs        |
| Pagination     | react-infinite-scroll-component |

---

## 📦 Notable Dependencies

* `react-router-dom` – Routing between pages
* `axios` – HTTP requests
* `jwt-decode` – Decode JWT tokens from local storage
* `react-icons` – UI icons
* `react-infinite-scroll-component` – Infinite feed scroll

---

## 🧠 Notes

* Avatar and post images are uploaded using **MinIO presigned URLs**.
* Works in tandem with backend microservices via **Spring Cloud Gateway**.

---
````
