# MediCompare 🏥

**AI-powered healthcare service comparison and appointment booking platform.**

MediCompare helps users discover hospitals, compare healthcare services and pricing, view detailed hospital information, get AI-driven recommendations, and manage appointments — all through a modern full-stack web application with a dedicated admin dashboard for hospital and booking management.

![Java](https://img.shields.io/badge/Java-21-orange)
![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3-brightgreen)
![React](https://img.shields.io/badge/React-Vite-blue)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Database-blue)
![License](https://img.shields.io/badge/License-MIT-lightgrey)

---

## 🔗 Live Demo

- **Frontend:** [client-iota-one-53.vercel.app](https://client-iota-one-53.vercel.app)
- **Backend API:** [medicompare-ai.onrender.com](https://medicompare-ai.onrender.com)

---

## 📋 Table of Contents

- [Features](#-features)
- [Technology Stack](#️-technology-stack)
- [Architecture](#️-architecture)
- [Getting Started](#-getting-started)
- [Environment Variables](#-environment-variables)
- [API Documentation](#-api-documentation)
- [Project Structure](#-project-structure)
- [Screenshots](#-screenshots)
- [Roadmap](#-roadmap)

---

## 🚀 Features

### 🏥 Hospital Discovery
- Browse and search hospitals by name, city, and specialty
- View detailed hospital profiles, images, and information
- Filter and sort hospital results
- Explore hospitals on an interactive map

### ⚖️ Hospital Comparison
- Compare multiple hospitals side by side
- Compare ratings, services, pricing, and general information

### 👨‍⚕️ Healthcare Services
- Browse available services across hospitals
- View and compare service pricing
- Search treatments/services by cost and hospital

### 📅 Appointment Management
- Book appointments with real-time slot availability
- Track appointment status (pending, approved, rejected)
- Cancel appointments
- Admin-side booking management and approval workflow

### 👤 User Management
- Secure registration and login with JWT authentication
- User profile management
- Favourite hospitals and booking history

### 🔐 Admin Management
- Separate admin authentication and dashboard
- Hospital, image, and service management (CRUD)
- Booking approval/rejection workflow
- Centralized administrative controls

### 🤖 AI Features
- AI-powered conversational healthcare assistant
- Natural-language queries about hospitals and services
- AI-driven hospital recommendations

### ⭐ Reviews & Ratings
- Submit and view hospital reviews
- Aggregated review summaries and rating breakdowns

### 🧠 Recommendation Engine
- Custom hospital recommendation and prediction engine
- Scoring based on distance, rating, pricing, and other weighted factors

---

## 🛠️ Technology Stack

| Layer | Technologies |
|---|---|
| **Backend** | Java 21, Spring Boot, Spring Web, Spring Data JPA, Hibernate, Spring Security, JWT, Spring AI, Maven |
| **Frontend** | React, Vite, JavaScript, HTML5, CSS3, Tailwind CSS |
| **Database** | PostgreSQL |
| **Infrastructure** | Docker, Docker Compose |
| **AI / ML** | Spring AI, OpenRouter integration, custom recommendation engine |
| **Deployment** | Render (backend), Vercel (frontend) |

---

## 🏗️ Architecture

```text
                    ┌───────────────────────┐
                    │      React Client      │
                    │      (Vite + JS)       │
                    └───────────┬─────────────┘
                                │  REST API
                                ▼
                    ┌───────────────────────┐
                    │     Spring Boot API    │
                    │  ───────────────────   │
                    │  Controllers           │
                    │  Services               │
                    │  Repositories           │
                    │  Security / JWT         │
                    │  AI / Recommendations   │
                    └──────┬─────────┬────────┘
                           │         │
                 ┌─────────▼───┐   ┌─▼──────────────┐
                 │ PostgreSQL   │   │  AI / ML         │
                 │ Database     │   │  Components      │
                 └──────────────┘   │  (via Spring AI  │
                                     │   + OpenRouter)  │
                                     └──────────────────┘
```

---

## ⚡ Getting Started

### Prerequisites
- Java 21+
- Node.js 20+
- PostgreSQL 14+
- Maven (or use the included `mvnw` wrapper)

### Backend Setup

```bash
cd server
cp .env.example .env
# Fill in DB_PASSWORD, OPENROUTER_API_KEY, ADMIN_DEFAULT_EMAIL, ADMIN_DEFAULT_PASSWORD

./mvnw spring-boot:run
```

The API will start on `http://localhost:8080`.

### Frontend Setup

```bash
cd client
npm install
npm run dev
```

The app will start on `http://localhost:5173`.

### Running with Docker

```bash
docker-compose up --build
```

---

## 🔑 Environment Variables

Create a `.env` file inside `server/` based on `.env.example`:

```env
DB_PASSWORD=your_postgres_password
OPENROUTER_API_KEY=your_openrouter_api_key
ADMIN_DEFAULT_EMAIL=admin@medicompare.com
ADMIN_DEFAULT_PASSWORD=admin123
```

> ⚠️ Never commit your real `.env` file. Only `.env.example` (with placeholder values) should be tracked in version control.

---

## 📖 API Documentation

Once the backend is running, interactive API documentation is available via Swagger UI: