# Use an official OpenJDK image
FROM openjdk:8-jdk-alpine

# Create a new user 'appuser' and set home directory
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

# Set working directory
WORKDIR /app

# Copy Gradle wrapper and build files
COPY gradle gradle
COPY build.gradle.kts settings.gradle.kts gradlew ./

# Set executable permissions for gradlew
RUN chmod +x gradlew

# Copy Kotlin source code
COPY src /app/src

# Set ownership of the working directory to the new user
RUN chown -R appuser:appgroup /app

# Switch to the new user
USER appuser

# Install Gradle and build the Kotlin project
RUN ./gradlew build --no-daemon

# Expose the backend API port
EXPOSE 8080

# Run the application
CMD ["java", "-jar", "build/libs/ekonomicke-zhodnoceni-tc.jar"]
