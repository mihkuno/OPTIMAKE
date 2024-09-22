

## Project Structure

```
C:.
├───client
│   ├───public
│   └───src
│       └───components
├───docs
│   ├───cert
│   └───mock
└───server
    ├───lib
    ├───src
    └───test
```


## Development

### Prerequisites
- Install `Docker`
- Install `Visual Studio Code` 
- Enable `Prettier` extension for client
- Disable `Prettier` extension for server

### Environment

Navigate to the project's root directory
```
cd CRAFT
```

<hr>

> The command in this section clears existing cache, should only be run once 

Setup containers
```
docker compose down
docker system prune --all
docker volume remove craft_server_modules
docker volume remove craft_client_modules
docker compose up --build --force-recreate
```

<hr>

> These commands can be run anytime after the previous section


Create containers
```
docker compose up
```

```
Client: http://localhost:5000
Server: http://localhost:5010
```

Remove containers
```
docker compose down
```

Check the status
```
docker compose ps
```

Adding custom packages to Client or Server (target service should be up)
```
docker compose exec client pnpm install <package>
docker compose exec server pnpm install <package>
```