FROM openjdk:14-alpine as builder

WORKDIR /api

COPY gradlew .
COPY gradle gradle

RUN dos2unix gradlew
RUN sh gradlew --version

COPY settings.gradle .
COPY build.gradle .

#cache dependencies
RUN sh gradlew build || return 0

COPY src src

RUN sh gradlew bootJar


FROM openjdk:14-alpine

COPY --from=builder /api/build/libs/socialnetwork-server.jar .

ENTRYPOINT java -jar socialnetwork-server.jar
