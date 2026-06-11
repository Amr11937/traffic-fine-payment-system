# National Traffic Fine Payment System — Sri Lanka Police

**EC6208 Software Architecture | University of Ruhuna**

A full-stack national traffic fine payment system built as a software architecture group project. The system allows Sri Lanka Police traffic officers to record fines and accept on-the-spot payments via a Flutter mobile app, lets the general public pay outstanding fines through a public web portal, and gives senior police officials a live administrative dashboard to monitor nationwide collection statistics. The backend exposes a REST API secured with JWT authentication and backed by a MySQL database; an SMS notification is dispatched to the issuing officer upon every successful payment.

---

## System Architecture

```
┌──────────────────┐   GET /api/fines/lookup        ┌─────────────────────────┐
│   Flutter App    │──────────────────────────────→ │                         │
│  (Mobile – APK)  │   POST /api/payments           │   Spring Boot REST API  │
└──────────────────┘──────────────────────────────→ │       (Backend)         │
                                                     │   JWT · JPA · MySQL     │
┌──────────────────┐   GET /api/fines/lookup        │                         │
│  Public Web App  │──────────────────────────────→ │  Port 8080              │
│  (React / Vite)  │   POST /api/payments           │                         │
└──────────────────┘──────────────────────────────→ └─────────────────────────┘
                                                               ↑
┌──────────────────┐   POST /api/auth/login                   │
│  Admin Portal    │──────────────────────────────────────────┤
│  (React / Vite)  │   GET  /api/admin/reports/**             │
└──────────────────┘──────────────────────────────────────────┘
```

---

## Repository Structure

| Folder | Description |
|---|---|
| [`/backend`](#backend) | Spring Boot 4 REST API — fine lookup, payment processing, JWT auth, admin reporting, SMS notifications. Uses Spring Data JPA with MySQL. |
| [`/web-payment`](#web-payment-app) | React + Vite public payment portal. Citizens enter a fine reference number and category code to look up and pay an outstanding fine. No login required. |
| [`/admin-portal`](#admin-portal) | React + Vite JWT-protected admin dashboard. Displays nationwide collection statistics (summary cards + district and category bar charts) consumed from the admin reporting endpoints. |
| [`/mobile-app`](#mobile-app) | Flutter Android app used by traffic officers at the roadside. Same lookup-and-pay flow as the public web portal but optimised for mobile use on a shared local WiFi network. |

---

## Tech Stack

| Layer | Technology |
|---|---|
| Backend framework | Spring Boot 4.0.6 |
| Language | Java 21 |
| ORM / persistence | Spring Data JPA, Hibernate |
| Authentication | Spring Security + JWT (HMAC-SHA256) |
| Database | MySQL 8 |
| Public web app | React 18, Vite 5 |
| Admin web app | React 18, Vite 5, Recharts 2, React Router 6 |
| Mobile app | Flutter 3 (Android) |
| Mobile HTTP | Dart `http` package |
| SMS notifications | Swappable `NotificationService` interface (mock by default) |

---

## Prerequisites

Install the following before running any component:

| Tool | Version | Used by |
|---|---|---|
| Java JDK | 21+ | Backend |
| Maven | 3.9+ | Backend |
| MySQL | 8.0+ | Backend |
| Node.js | 18+ | Web Payment, Admin Portal |
| Flutter SDK | 3.x+ | Mobile App |
| Android device / emulator | Android 9+ | Mobile App |

---

## Setup & Run

### Database

Create the database once before starting the backend:

```sql
CREATE DATABASE traffic_fines_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

---

### Backend

```bash
cd backend
```

**1. Create the environment file:**

```bash
cp .env.example .env
```

Edit `backend/.env` and fill in your values:

```env
DB_USERNAME=root
DB_PASSWORD=your_mysql_password

# Generate a strong base-64 secret, e.g.:
#   openssl rand -base64 64
JWT_SECRET=<your-base64-secret>
JWT_EXPIRY_MS=86400000
```

**2. Run:**

```bash
mvn spring-boot:run
```

The API starts on **http://localhost:8080**. On first run, Hibernate creates all tables automatically (`ddl-auto=update`).

---

### Web Payment App

```bash
cd web-payment
npm install
```

**Optional** — override the API URL (defaults to `http://localhost:8080`):

```bash
cp .env.example .env.local
# Edit VITE_API_BASE if the backend is on a different host/port
```

**Run:**

```bash
npm run dev
```

Opens at **http://localhost:5173**

---

### Admin Portal

```bash
cd admin-portal
npm install
```

**Optional** — override the API URL:

```bash
cp .env.example .env.local
# Edit VITE_API_BASE if needed
```

**Run:**

```bash
npm run dev
```

Opens at **http://localhost:3000**

**Default credentials:**

| Username | Password  |
|----------|-----------|
| `admin`  | `admin123`|

---

### Mobile App

```bash
cd mobile-app
```

**1. Set the backend IP address.**

The phone connects to the backend over your local WiFi. Edit [`lib/config.dart`](mobile-app/lib/config.dart) and replace the IP with your computer's local address (run `ipconfig` on Windows to find it):

```dart
static const String apiBaseUrl = 'http://192.168.1.5:8080';
```

**2. Install dependencies:**

```bash
flutter pub get
```

**3. Run** (connect an Android phone via USB with USB debugging enabled, or start an emulator):

```bash
flutter run
```

> **Note:** The app uses `android:usesCleartextTraffic="true"` in `AndroidManifest.xml` so it can reach the `http://` backend on Android 9+.

---

## Running Everything Together

Start all four components in separate terminals in this order:

```
Terminal 1 → cd backend      && mvn spring-boot:run
Terminal 2 → cd web-payment  && npm run dev
Terminal 3 → cd admin-portal && npm run dev
Terminal 4 → cd mobile-app   && flutter run
```

| Component | URL / Target |
|---|---|
| Backend API | http://localhost:8080 |
| Public payment portal | http://localhost:5173 |
| Admin portal | http://localhost:3000 |
| Mobile app | Physical Android device or emulator |

---

## SMS Notifications

On successful payment, the system calls a `NotificationService` interface to send an SMS to the issuing traffic officer so the driver can retrieve their licence. The current implementation is a **mock** that logs to the console instead of sending a real SMS. To integrate a real provider (Twilio, Notify.lk, Text.lk, etc.), implement the `NotificationService` interface and register it as a Spring bean — no other code changes are needed.

---
