A modern TypeScript-based Super Mario platformer built using HTML5 Canvas, featuring smooth gameplay, animations, physics, and collision detection — with Dockerized deployment, Kubernetes orchestration, SonarQube analysis, and Prometheus/Grafana monitoring.

--------------------------------------------------------------------------------

## Table of Contents
- Project Overview
- Project Structure
- Features
- Prerequisites
- Local Development
- Build for Production
- Docker Setup
- Kubernetes Deployment
- SonarQube Setup
- Monitoring (Prometheus + Grafana)
- Jenkins CI/CD Pipeline
- Author
- License

--------------------------------------------------------------------------------

## Project Overview
This project recreates the classic Super Mario experience using modern web technologies.
It’s built in TypeScript, runs on a Vite development server, and is fully containerized for cloud deployment.

--------------------------------------------------------------------------------

## Project Structure
super-mario/
├── src/
│   ├── game/
│   │   ├── entities/
│   │   │   ├── Player.ts
│   │   │   ├── Enemy.ts
│   │   │   ├── Coin.ts
│   │   │   └── Platform.ts
│   │   ├── Game.ts
│   │   ├── GameRenderer.ts
│   │   ├── InputHandler.ts
│   │   ├── SoundManager.ts
│   │   └── CollisionDetector.ts
│   ├── styles/game.css
│   └── main.ts
├── index.html
├── Dockerfile
├── deploy.yaml / deployment-service.yaml
├── sonar-project.properties
├── package.json
└── README.md

--------------------------------------------------------------------------------

## Features
- Playable Mario character with animations
- Platforms, coins, and enemies with real collision physics
- Sound effects and background music
- Dockerized build and deployment
- Kubernetes-ready manifests
- SonarQube static code analysis
- Prometheus + Grafana metrics integration
- End-to-end CI/CD with Jenkins

--------------------------------------------------------------------------------

## Prerequisites
- Node.js 18+
- npm or yarn
- Docker
- Kubernetes cluster
- SonarQube (for static analysis)
- Prometheus & Grafana (for monitoring)

--------------------------------------------------------------------------------

## Local Development
git clone https://github.com/likhitha-ux/super-mario.git
cd super-mario
npm install
npm run dev
Access at http://localhost:5173

--------------------------------------------------------------------------------

## Build for Production
npm run build
npm run preview

--------------------------------------------------------------------------------

## Docker Setup
docker build -t super-mario-game .
docker run -p 8080:8080 super-mario-game
Access at http://localhost:8080

--------------------------------------------------------------------------------

## Kubernetes Deployment
kubectl apply -f deploy.yaml
kubectl apply -f deployment-service.yaml
kubectl get pods

--------------------------------------------------------------------------------

## SonarQube Setup
docker run -d --name sonarqube -p 9000:9000 sonarqube:lts
Access at http://localhost:9000
Credentials: admin / admin

sonar-project.properties:
sonar.projectKey=super-mario-game
sonar.projectName=Super Mario Game
sonar.sources=src
sonar.language=ts
sonar.sourceEncoding=UTF-8

Run scanner:
sonar-scanner -Dsonar.projectKey=super-mario-game -Dsonar.sources=./src -Dsonar.host.url=http://localhost:9000 -Dsonar.login=<your-token>

--------------------------------------------------------------------------------

## Monitoring Setup (Prometheus + Grafana)
Prometheus:
./prometheus --config.file=prometheus.yml
Access at http://localhost:9090

Grafana:
./bin/grafana-server web
Access at http://localhost:3000
Credentials: admin / admin
Add Prometheus data source: http://localhost:9090

--------------------------------------------------------------------------------

## Jenkins CI/CD Pipeline
Example Jenkins pipeline for build → test → scan → deploy workflow.
(See repository Jenkinsfile for full details.)

--------------------------------------------------------------------------------
