FROM openjdk:14-alpine as builder

WORKDIR /tmp

COPY gradlew .
COPY settings.gradle .
COPY build.gradle .
COPY gradle gradle

RUN sh gradlew deps

COPY src src
RUN sh gradlew bootJar

ENTRYPOINT gradle bootrun


FROM openjdk:14-alpine

COPY --from=builder /tmp/build/libs/socialnetwork-server.jar .

ENTRYPOINT java -jar socialnetwork-server.jar
