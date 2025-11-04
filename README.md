# 🕹️ Super Mario Game

A modern **TypeScript-based Super Mario platformer** built using **HTML5 Canvas**, featuring smooth gameplay, animations, physics, and collision detection — with **Dockerized deployment**, **Kubernetes orchestration**, **SonarQube analysis**, and **Prometheus/Grafana monitoring**.

---

## 📑 Table of Contents
- [Project Overview](#-project-overview)
- [Project Structure](#-project-structure)
- [Features](#-features)
- [Prerequisites](#-prerequisites)
- [Local Development](#️-local-development)
- [Build for Production](#-build-for-production)
- [Docker Setup](#-docker-setup)
- [Kubernetes Deployment](#️-kubernetes-deployment)
- [SonarQube Setup](#-sonarqube-setup)
- [Monitoring (Prometheus + Grafana)](#-monitoring-setup-prometheus--grafana)
- [Jenkins CI/CD Pipeline](#️-jenkins-cicd-pipeline)
- [Game Architecture](#-game-architecture)
- [Author](#-author)
- [License](#-license)

---

## 🎮 Project Overview

This project recreates the **classic Super Mario** experience using modern web technologies.  
It’s built in **TypeScript**, runs on a **Vite** development server, and is fully **containerized** for cloud deployment.

---

## 📁 Project Structure

├── src/
│ ├── game/
│ │ ├── entities/
│ │ │ ├── Player.ts
│ │ │ ├── Enemy.ts
│ │ │ ├── Coin.ts
│ │ │ └── Platform.ts
│ │ ├── Game.ts
│ │ ├── GameRenderer.ts
│ │ ├── InputHandler.ts
│ │ ├── SoundManager.ts
│ │ └── CollisionDetector.ts
│ ├── styles/game.css
│ └── main.ts
├── index.html
├── Dockerfile
├── deploy.yaml / deployment-service.yaml
├── sonar-project.properties
├── package.json
└── README.md

---

## ✨ Features

* 👨‍🚀 **Playable Mario character** with animations
* 🧱 **Platforms, coins, and enemies** with real collision physics
* 🔊 **Sound effects and background music**
* ⚙️ **Dockerized build and deployment**
* ☸️ **Kubernetes-ready manifests**
* 🧪 **SonarQube static code analysis**
* 📊 **Prometheus + Grafana metrics integration**
* 🔁 **End-to-end CI/CD with Jenkins**

---

## ✅ Prerequisites

Before starting, make sure you have installed:

* **Node.js 18+**
* **npm** or **yarn**
* **Docker**
* **Kubernetes cluster**
* **SonarQube** (for static analysis)
* **Prometheus & Grafana** (for monitoring)

---

## 🖥️ Local Development

```bash
git clone https://github.com/likhitha-ux/super-mario.git
cd super-mario
npm install
npm run dev
Open your browser → http://localhost:5173

📦 Build for Production

npm run build
npm run preview
🐳 Docker Setup
docker build -t super-mario-game .
docker run -p 8080:8080 super-mario-game


Access → http://localhost:8080

☸️ Kubernetes Deployment
kubectl apply -f deploy.yaml
kubectl apply -f deployment-service.yaml
kubectl get pods


This will:

Deploy your Super Mario game as a pod.

Expose it as a service through a LoadBalancer or NodePort.

📊 SonarQube Setup
1️⃣ Run SonarQube locally
docker run -d --name sonarqube -p 9000:9000 sonarqube:lts


Access → http://localhost:9000

Credentials → admin / admin

2️⃣ sonar-project.properties
sonar.projectKey=super-mario-game
sonar.projectName=Super Mario Game
sonar.sources=src
sonar.language=ts
sonar.sourceEncoding=UTF-8

3️⃣ Run Sonar Scanner
sonar-scanner \
  -Dsonar.projectKey=super-mario-game \
  -Dsonar.sources=./src \
  -Dsonar.host.url=http://localhost:9000 \
  -Dsonar.login=<your-token>

📈 Monitoring Setup (Prometheus + Grafana)
🧩 Prometheus
tar xvfz prometheus-*.tar.gz
cd prometheus-*
./prometheus --config.file=prometheus.yml


Access → http://localhost:9090

📊 Grafana
tar -zxvf grafana-*.tar.gz
cd grafana-*
./bin/grafana-server web


Access → http://localhost:3000

Credentials → admin / admin

Then, in Grafana:
Data Sources → Add Prometheus → URL: http://localhost:9090

⚙️ Jenkins CI/CD Pipeline

Below is a sample Jenkins pipeline to automate build → test → scan → deploy:

pipeline {
    agent any
    
    tools {
        jdk 'jdk17'
        maven 'maven3'
    }

    environment {
        SCANNER_HOME = tool 'sonar-scanner'
    }

    stages {
        stage('Git Checkout') {
            steps {
               git branch: 'main', credentialsId: 'git-cred', url: 'https://github.com/likhitha-ux/super-mario.git'
            }
        }
        stage('Compile') { steps { sh "mvn compile" } }
        stage('Test') { steps { sh "mvn test" } }
        stage('File System Scan') { steps { sh "trivy fs --format table -o trivy-fs-report.html ." } }
        stage('SonarQube Analysis') {
            steps {
                withSonarQubeEnv('sonar') {
                    sh ''' $SCANNER_HOME/bin/sonar-scanner \
                           -Dsonar.projectName=SuperMario \
                           -Dsonar.projectKey=SuperMario \
                           -Dsonar.sources=./src '''
                }
            }
        }
        stage('Quality Gate') {
            steps {
                script {
                    waitForQualityGate abortPipeline: false, credentialsId: 'sonar-token'
                }
            }
        }
        stage('Build Docker Image') {
            steps {
                sh "docker build -t super-mario-game:latest ."
            }
        }
        stage('Docker Image Scan') {
            steps {
                sh "trivy image --format table -o trivy-image-report.html super-mario-game:latest"
            }
        }
        stage('Push Docker Image') {
            steps {
                withDockerRegistry(credentialsId: 'docker-cred', toolName: 'docker') {
                    sh "docker push super-mario-game:latest"
                }
            }
        }
        stage('Deploy To Kubernetes') {
            steps {
                withKubeConfig(credentialsId: 'k8-cred', namespace: 'games', serverUrl: 'https://<your-k8s-url>') {
                    sh "kubectl apply -f deployment-service.yaml"
                }
            }
        }
        stage('Verify Deployment') {
            steps {
                sh "kubectl get pods -n games"
                sh "kubectl get svc -n games"
            }
        }
    }

    post {
        always {
            emailext (
                subject: "${env.JOB_NAME} - Build ${env.BUILD_NUMBER} - ${currentBuild.result}",
                to: 'team@example.com',
                from: 'jenkins@example.com',
                mimeType: 'text/html',
                attachmentsPattern: 'trivy-image-report.html'
            )
        }
    }
}
