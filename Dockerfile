FROM openjdk:8-jdk-alpine
MAINTAINER Stefan Hauschildt <stefan.h@uschildt.de>
ADD build/libs/freyafitness.jar app.jar

EXPOSE 80/tcp

ENTRYPOINT ["java","-Djava.security.egd=file:/dev/./urandom","-jar","/app.jar"]
