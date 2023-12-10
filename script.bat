@ECHO OFF
cd sample-api/
./gradlew.bat bootJar
cd ../cicd/
docker-compose up -d
