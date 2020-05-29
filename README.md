# A SOCIAL NETWORK?

### With Docker

```shell script
docker-compose up
```

### Without Docker

##### Configuring the Database

```
HOST:       localhost
PORT:       5432
USERNAME:   postgres
PASSWORD:   password
```

Those environment variables can be used to change how the server connect to the database:

```
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
By default run on port 9000, this can be changed using `SN_API_PORT` variable

#### Starting the webapp

```shell script
cd webapp
npm install
npm run start
```
