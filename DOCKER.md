# Docker Setup for DGPL Courses Admin

## Prerequisites
- Docker installed and running
- Docker Compose (optional, but recommended)

## Building the Docker Image

```bash
docker build -t dgpl_courses_admin .
```

Or with sudo if needed:
```bash
sudo docker build -t dgpl_courses_admin .
```

## Running the Container

### Using Docker directly:
```bash
docker run -p 5009:5009 --name dgpl_courses_admin dgpl_courses_admin:latest
```

### Using Docker Compose (recommended):
```bash
docker-compose up -d
```

To stop:
```bash
docker-compose down
```

To rebuild and start:
```bash
docker-compose up -d --build
```

## Environment Variables

Add your environment variables to the `docker-compose.yml` file or create a `.env` file:

```env
DATABASE_URL=your_database_url
FIREBASE_CONFIG=your_firebase_config
# Add other environment variables as needed
```

## Accessing the Application

Once running, access the application at:
- http://localhost:5009

## Useful Docker Commands

View running containers:
```bash
docker ps
```

View logs:
```bash
docker logs dgpl_courses_admin
```

Or with Docker Compose:
```bash
docker-compose logs -f
```

Stop container:
```bash
docker stop dgpl_courses_admin
```

Remove container:
```bash
docker rm dgpl_courses_admin
```

Remove image:
```bash
docker rmi dgpl_courses_admin:latest
```

## Multi-stage Build Benefits

The Dockerfile uses a multi-stage build which:
- Reduces final image size (only ~303MB)
- Separates build dependencies from runtime
- Uses Next.js standalone output for optimal performance
- Runs as non-root user for security

## Troubleshooting

If you get "permission denied" errors, either:
1. Add your user to the docker group: `sudo usermod -aG docker $USER` (then log out/in)
2. Use sudo with docker commands

If build fails, clear Docker cache:
```bash
docker builder prune
```
