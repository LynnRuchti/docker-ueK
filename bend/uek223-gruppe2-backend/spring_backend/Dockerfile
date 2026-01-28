# Set up the build environment using Eclipse Temurin JDK 18
FROM eclipse-temurin:18-jdk AS build
# Copy the project files to the /app directory
COPY . /app
# Set the working directory to /app
WORKDIR /app
# Make gradlew executable
RUN chmod +x ./gradlew
# Build the Spring Boot application using Gradle wrapper
RUN ./gradlew --no-daemon bootJar
# Create a new image with Eclipse Temurin JRE 18 (smaller runtime image)
FROM eclipse-temurin:18-jre
# Create a directory named /app
RUN mkdir /app
# Copy the built JAR file from the build stage to /app in the new image
COPY --from=build /app/build/libs/*.jar /app/spring-boot-application.jar
# Expose port 8080 for the Spring Boot application
EXPOSE 8080
# Run the Spring Boot application as a Java application with specified memory options
CMD ["java", "-jar", "-Xmx4g", "/app/spring-boot-application.jar"]
