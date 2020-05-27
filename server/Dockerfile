FROM gradle:6.4.1-jdk14 as builder

WORKDIR /tmp
COPY . .
RUN gradle bootJar

ENTRYPOINT gradle bootrun


FROM openjdk:14-alpine

COPY --from=builder /tmp/build/libs/socialnetwork-server.jar .

ENTRYPOINT java -jar socialnetwork-server.jar
