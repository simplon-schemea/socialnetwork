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

Those environment variables can be used to configure how the server connect to the database:

```
SN_DATABASE_HOST
SN_DATABASE_PORT
SN_DATABASE_USERNAME
SN_DATABASE_PASSWORD
```

#### Starting the api server

```shell script
./gradlew bootRun
```

port can be changed using `SN_API_PORT` variable

#### Starting the webapp

```shell script
npm run start
```
