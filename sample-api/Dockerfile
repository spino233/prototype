FROM eclipse-temurin:17-jdk-alpine
VOLUME /tmp
ARG JAR_FILE
COPY ./build/libs/sample-api-0.0.1-SNAPSHOT.jar app.jar
ENTRYPOINT ["java","-Dspring.data.mongodb.host=mongo_db","-jar","/app.jar"]

#sample-api-0.0.1-SNAPSHOT-plain.jar