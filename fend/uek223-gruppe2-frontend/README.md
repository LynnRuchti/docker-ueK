# OurSpace Blogpost Gruppe 2

### Autoren:
- Jan Ludwig
- Leon Probst
- Lynn Ruchti
- Thomas Stern

---

### Projekt Componenten:

- Web: [`http://localhost:3000/`](http://localhost:3000/)
- Frontend: [`https://github.com/BusyJan/uek223-gruppe2-frontend`](https://github.com/BusyJan/uek223-gruppe2-frontend)
- Backend: [`https://github.com/leon-prob/uek223-gruppe2-backend`](https://github.com/leon-prob/uek223-gruppe2-backend)
- DB
- Test:
  - Swagger: [`http://localhost:8080/swagger-ui/index.html`](http://localhost:8080/swagger-ui/index.html)
  - Postman: [`https://github.com/leon-prob/uek223-gruppe2-backend/tree/main/postman_test`](https://github.com/leon-prob/uek223-gruppe2-backend/tree/main/postman_test)
  - Cypress
- Dokumentation:
  - Abgabe 16.1.26: [`./Dokumentation-üK223-group-2.pdf`](./Dokumentation-üK223-group-2.pdf)
  - Arbeitsdoku: [`https://docs.google.com/document/d/1eARUo0NPK_GrqjgFKg4elsxNBgBibNOybZ-ggXhsKf0/edit?usp=sharing`](https://docs.google.com/document/d/1eARUo0NPK_GrqjgFKg4elsxNBgBibNOybZ-ggXhsKf0/edit?usp=sharing)
  - README: [`https://github.com/BusyJan/uek223-gruppe2-frontend/blob/main/README.md`](https://github.com/BusyJan/uek223-gruppe2-frontend/blob/main/README.md)

## Technologie Stack

### Frontend:

- React 18.2.0
- TypeScript 4.8.3
- Vite (Build Tool)
- Material-UI (MUI) 5.x
- React Router 6
- Axios (HTTP Client)
- Formik & Yup (Form Management)
- Cypress (E2E Testing)

### Backend:

- Spring Boot
- Java 18
- PostgreSQL (Database)
- JWT Authentication
- Swagger/OpenAPI Documentation

## Voraussetzungen

Bevor Sie starten, stellen Sie sicher, dass folgende Software installiert ist:

- **Node.js** (Version 16 oder höher)
  - Download: [`https://nodejs.org/`](https://nodejs.org/)
  - Überprüfen: `node --version`
- **Yarn** (Package Manager)
  - Installation: `npm install -g yarn`
  - Überprüfen: `yarn --version`
- **Docker & Docker Compose**
  - Download: [`https://www.docker.com/products/docker-desktop`](https://www.docker.com/products/docker-desktop)
  - Überprüfen: `docker --version` und `docker-compose --version`

## Installation und Setup

### 1. Repositories klonen:

```bash
# Frontend klonen
git clone https://github.com/BusyJan/uek223-gruppe2-frontend
cd uek223-gruppe2-frontend/react_frontend

# Backend klonen
git clone https://github.com/leon-prob/uek223-gruppe2-backend
```

### 2. Frontend-Dependencies installieren:

```bash
cd react_frontend
yarn install
```

### 3. Backend & Datenbank starten:

```bash
# Im Backend-Verzeichnis
cd uek223-gruppe2-backend
docker-compose up -d
```

Warten Sie, bis die Container vollständig.

### 4. Frontend starten:

```bash
# Im Frontend-Verzeichnis
cd react_frontend
yarn dev
```

Die Applikation ist nun verfügbar unter: [`http://localhost:3000`](http://localhost:3000)

## Starten der Applikation

**Voraussetzung**: Docker und Docker Compose sind installiert<br>

#### Im Backend-Terminal (Backend + DB):<br>

```bash
docker compose up -d
```

Mehr: [`https://github.com/leon-prob/uek223-gruppe2-backend#readme`](https://github.com/leon-prob/uek223-gruppe2-backend#readme)<br>

#### Im Frontend-Terminal (Frontend):<br>

```bash
yarn run dev
```

## Ausführen von Tests

### Swagger:

Backend und DB müssen laufen.<br>
[`http://localhost:8080/swagger-ui/index.html`](http://localhost:8080/swagger-ui/index.html)<br>

### Postman:

Backend und DB müssen laufen.<br>
Postman öffnen und Files importieren:<br>
Folder: [`https://github.com/leon-prob/uek223-gruppe2-backend/tree/main/postman_test`](https://github.com/leon-prob/uek223-gruppe2-backend/tree/main/postman_test)<br>
Files:

- [`BlogPost API Environment.postman_environment.json`](https://github.com/leon-prob/uek223-gruppe2-backend/blob/main/postman_test/BlogPost%20API%20Environment.postman_environment.json)<br>
- [`BlogPost API Tests.postman_collection.json`](https://github.com/leon-prob/uek223-gruppe2-backend/blob/main/postman_test/BlogPost%20API%20Tests.postman_collection.json)<br>

Environment auswählen<br>
Test starten<br>

### Cypress:

Backend und DB müssen laufen.<br>
Im Frontend-Terminal:<br>

```bash
yarn add --dev cypress
```

```bash
yarn cypress open
```

E2E Testing auswählen und in einem beliebigen Browser starten<br>
uc1-create-blogpost.cy.ts öffnen

## Login und Rollen

- ### Guest:
  Anonymer User (nicht eingeloggt, hat nur Read-Berechtigung auf veröffentlichte Blogposts)<br>
  [`http://localhost:3000/`](http://localhost:3000/)<br>
- ### User:
  Normaler User (eingeloggt, hat alle CRUD-Berechtigungen auf eigene Blogposts)<br>
  `user@example.com : 1234`<br>
- ### Admin:
  Admin User (eingeloggt, hat alle CRUD-Berechtigungen auf alle Blogposts)<br>
  `admin@example.com : 1234`<br>

## URLs

(Vorausgesetzt die Rollen habe entsprechende Berechtigungen)

- ### Home:
  [`http://localhost:3000/`](http://localhost:3000/)<br>
  Alle Rollen, 2 Versionen für nicht eingeloggte User und eingeloggte User/Admin<br>
  Homepage von OurSpace, Blogposts anzeigen/löschen<br>
- ### Login:
  [`http://localhost:3000/login`](http://localhost:3000/login)<br>
  Alle Rollen<br>
  Einloggen in einen Account<br>
- ### User all/Admin:
  [`http://localhost:3000/user`](http://localhost:3000/user)<br>
  [`http://localhost:3000/admin`](http://localhost:3000/admin)<br>
  Admin<br>
  Übersich/Bearbeitung/Löschung aller User<br>
- ### User erstellen:
  [`http://localhost:3000/user/edit/`](http://localhost:3000/user/edit/)<br>
  Admin<br>
  Erstellen von User<br>
- ### User:
  [`http://localhost:3000/user/edit/{id}`](http://localhost:3000/user/edit/{id})<br>
  User/Admin<br>
  Anzeigen/Bearbeiten eines Users<br>
- ### Blogpost erstellen:
  [`http://localhost:3000/blogpost/create`](http://localhost:3000/blogpost/create)<br>
  User/Admin<br>
  Blogpost erstellen<br>
- ### Blogpost:
  [`http://localhost:3000/blogpost/{id}`](http://localhost:3000/blogpost/{id})<br>
  Alle Rollen<br>
  Blogpost einzeln und detailliert anzeigen<br>
- ### Blogpost bearbeiten:
  [`http://localhost:3000/blogpost/edit/{id}`](http://localhost:3000/blogpost/edit/{id})<br>
  User/Admin<br>
  Blogpost bearbeiten<br>

## Nützliche Befehle

```bash
# Frontend
yarn dev              # Development Server starten
yarn build            # Production Build erstellen
yarn preview          # Production Build testen
yarn test             # Unit Tests ausführen

# Cypress
yarn cypress open     # Cypress UI öffnen
yarn cypress run      # Cypress Tests im Headless-Modus

# Docker
docker-compose up -d           # Container starten
docker-compose down            # Container stoppen
docker-compose logs -f         # Logs anzeigen
docker-compose restart         # Container neustarten
```

