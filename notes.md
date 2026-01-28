## version: '3.8'
Specifies the Docker Compose format version. 3.8 is modern and supports all the features we need.

## services section
Contains the three main services your app needs.

### postgres (Database)
- **image: postgres:15-alpine** - Uses PostgreSQL version 15 with Alpine Linux (lightweight, ~80MB)
- **container_name: postgres_db** - Names the container so you can reference it easily
- **environment** - Sets up the database:
    - `POSTGRES_DB: postgres` - Creates a database named "postgres"
    - `POSTGRES_USER: postgres` - Admin username
    - `POSTGRES_PASSWORD: postgres` - Admin password
- **ports** - Maps port 5432 inside the container to your machine's port 5432 (for connecting tools like pgAdmin or IDE clients)
- **volumes: postgres_data** - Persists database data even if the container stops/restarts (stored in `postgres_data` volume)
- **networks: app-network** - Connects it to a custom network so services can communicate by name
- **healthcheck** - Checks if the database is ready before other services start (prevents race conditions)

### spring-backend (Your API)
- **build** - Instead of pulling a pre-built image, it builds from your Dockerfile:
    - `context: ./bend/uek223-gruppe2-backend/spring_backend` - Where your backend code is
    - `dockerfile: Dockerfile` - Uses the Dockerfile in that directory
- container_name: uek223-backend - Names the container
- environment - Passes Spring Boot configuration:
    - `SPRING_DATASOURCE_URL: jdbc:postgresql://postgres:5432/postgres` - Tells Spring to connect to the `postgres` container (by service name, not IP!)
    - Username/password for database connection
- ports - Maps port 8080 inside container to your machine's port 8080 (for API calls)
- depends_on - Waits for postgres to be healthy before starting
- networks - Joins the same network so it can reach the postgres service

### react-frontend (Your UI)
- build - Builds from your frontend Dockerfile
    - `context: ./fend/uek223-gruppe2-frontend/react_frontend` - Where your frontend code is
- container_name: uek223-frontend - Names the container
- ports - Maps port 80 (inside) to port 3000 (your machine) - this is the typical web server port in the container
- depends_on - Waits for backend to start first
- networks - Joins the same network

### networks section
```yaml
networks:
  app-network:
    driver: bridge
```
Creates a custom bridge network called app-network so all three services can communicate with each other using service names (postgres, spring-backend, react-frontend).

### volumes section
```yaml
volumes:
  postgres_data:
```
Creates a named volume to persist database data. Without this, your database would be wiped every time the container stops!
