# MediCompare 🏥

AI-powered healthcare service comparison and appointment platform built with Java, Spring Boot, React, PostgreSQL, and AI/ML technologies.

MediCompare helps users discover hospitals, compare healthcare services and prices, view hospital information, get recommendations, and manage appointments through a modern full-stack web application.

---

## 🚀 Features

### 🏥 Hospital Discovery
- Browse hospitals
- Search hospitals by name, city, and specialty
- View hospital details
- Filter and sort hospital results
- View hospital images
- Explore hospitals on a map

### ⚖️ Hospital Comparison
- Compare multiple hospitals
- Compare ratings
- Compare services
- Compare service pricing
- Compare hospital information

### 👨‍⚕️ Healthcare Services
- Browse available hospital services
- View service pricing
- Search services across hospitals
- Compare treatment/service costs

### 📅 Appointment Management
- Book appointments
- View appointment status
- Cancel appointments
- View available appointment slots
- Manage bookings through the admin dashboard

### 👤 User Management
- User registration
- User login
- JWT-based authentication
- User profile
- Favourite hospitals
- User history

### 🔐 Admin Management
- Admin authentication
- Hospital management
- Hospital image management
- Service management
- Booking management
- Administrative dashboard

### 🤖 AI Features
- AI-powered healthcare conversations
- Natural-language healthcare queries
- AI hospital recommendations
- AI-assisted explanations and recommendations

### ⭐ Reviews
- Submit hospital reviews
- View hospital reviews
- Review summaries
- Hospital rating information

### 🧠 Recommendation & ML
- Hospital recommendation engine
- Hospital prediction engine
- Recommendation scoring
- Distance, rating, pricing, and other factors used for recommendations

---

## 🛠️ Technology Stack

### Backend

- Java 21
- Spring Boot
- Spring Web
- Spring Data JPA
- Hibernate
- Spring Security
- JWT
- Spring AI
- PostgreSQL
- Maven

### Frontend

- React
- JavaScript
- Vite
- HTML5
- CSS3

### Infrastructure

- Docker
- Docker Compose
- PostgreSQL

### AI / ML

- Spring AI
- AI-powered recommendation services
- Machine-learning recommendation architecture

---

## 🏗️ Architecture

```text
                    ┌──────────────────────┐
                    │      React Client    │
                    │      Vite + JS       │
                    └──────────┬───────────┘
                               │
                               │ REST API
                               ▼
                    ┌──────────────────────┐
                    │    Spring Boot API   │
                    │                      │
                    │ Controllers          │
                    │ Services             │
                    │ Repositories         │
                    │ Security / JWT       │
                    │ AI / Recommendations │
                    └───────┬───────┬──────┘
                            │       │
                    ┌───────▼───┐   │
                    │ PostgreSQL│   │
                    │ Database  │   │
                    └───────────┘   │
                                    ▼
                              ┌─────────────┐
                              │ AI / ML     │
                              │ Components  │
                              └─────────────┘