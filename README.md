# A SOCIAL NETWORK?


### With Docker

```shell script
docker-compose up
```

Server will be listening on http://localhost:80 and https://localhost:443 unless you use Docker Toolbox

### Without Docker

##### Configuring the Database

By default, the server will connect to a postgres database as such:

```
DATABASE:   socialnetwork
HOST:       localhost
PORT:       5432
USERNAME:   postgres
PASSWORD:   password
```

This can be change using those environment variables:

```
SN_DATABASE_NAME
SN_DATABASE_HOST
SN_DATABASE_PORT
SN_DATABASE_USERNAME
SN_DATABASE_PASSWORD
```

#### Starting the api server

```shell script
cd server
./gradlew bootRun
```
By default, run on port 9000, this can be changed using `SN_API_PORT` variable

#### Starting the webapp

```shell script
cd webapp
npm install
npm run start
```

Run on  http://localhost:8080, unless the port is already in use
