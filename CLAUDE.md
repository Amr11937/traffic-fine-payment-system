# Traffic Fine Payment System

University group project (EC6208 / Software Architecture, University of Ruhuna).
Solo build via Claude Code.

## What we're building

A national traffic-fine payment system for Sri Lanka Police:

- Backend REST API (Spring Boot 4, JPA, JWT auth via Spring Security)
- Android app (Flutter): pay fines on-the-spot using fine reference number + category ID
- Public single-page web app (React): pay fines later via the same reference + category ID
- Admin web portal (React): monitor collections (district-wise totals, fine-category breakdowns)
- SMS sent to the traffic officer on successful payment (so driver can retrieve license)

## Stack (already installed on this machine)

- Backend: Spring Boot 4.0.6, Java 21, Spring Data JPA, Spring Security + JWT
- Database: MySQL (MySQL Shell is installed)
- Web apps: React (Node.js installed)
- Android: Flutter
- SMS: gateway TBD (Twilio or a Sri Lankan provider like Notify.lk / Text.lk)

## Conventions

- One single Git repo. Folders: /backend /web-payment /admin-portal /mobile-app /docs
- Commit regularly with meaningful messages (per-person commit history is graded)
- Build order: backend skeleton + DB → JWT auth → fine/payment endpoints → SMS → admin endpoints → public web app → admin web portal → Android app

## Status

- [x] Backend skeleton + database schema
- [x] JWT auth
- [ ] Fine + payment endpoints
- [ ] SMS integration
- [ ] Admin reporting endpoints
- [ ] Public web payment app
- [ ] Admin web portal
- [ ] Android app
