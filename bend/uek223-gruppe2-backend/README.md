# Blog Post üK 223 (Group 5.2)

Spring Boot backend for blog post management.

---

## Prerequisites

- **Docker Desktop** installed ([Download here](https://www.docker.com/products/docker-desktop))

---

## Clone Repository:
```bash
git clone https://github.com/leon-prob/uek223-gruppe2-backend
```


## Running the Application

**Start everything:**

```bash
docker compose up -d
```

**Stop everything:**

```bash
docker compose down
```

First build takes 2-5 minutes. Subsequent starts are much faster.

**Access**

- Swagger UI: http://localhost:8080/swagger-ui/index.html

---

## Test Credentials

| Email               | Password | Role  |
| ------------------- | -------- | ----- |
| `user@example.com`  | `1234`   | USER  |
| `admin@example.com` | `1234`   | ADMIN |

---

## Running Postman Tests

**1. Import files into Postman:**

- Collection: `postman_test/BlogPost API Tests.postman_collection.json`
- Environment: `postman_test/BlogPost API Environment.postman_environment.json`

**2. Run the collection:**

- Ensure the application is running (`docker compose up -d`)
- Click "Run collection" in Postman
- All tests should pass



---

## Technology Stack

- Spring Boot 3.1.2 + Java 18
- PostgreSQL 15
- JWT Authentication
- Docker
