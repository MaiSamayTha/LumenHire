FROM --platform=linux/amd64 openjdk:17-jdk-slim as build
WORKDIR /app
COPY target/restservices-0.0.1-SNAPSHOT.jar app.jar
EXPOSE 8080

ENTRYPOINT ["java", "-jar", "app.jar"]
