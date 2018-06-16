FROM openjdk:8-jdk-alpine
MAINTAINER Stefan Hauschildt <stefan.h@uschildt.de>
ARG JAR_FILE
RUN echo "jar: ${JAR_FILE}"
ADD ${JAR_FILE} app.jar
ENTRYPOINT ["java","-Djava.security.egd=file:/dev/./urandom","-jar","/app.jar"]