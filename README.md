# 🎮 Super Mario Bros – Browser Game  
**An End‑to‑End Project Guide**

A **browser‑based Super Mario Bros clone** built with **TypeScript, HTML5 Canvas, and modern web technologies**.  
This project demonstrates not only **game development** but also **DevOps practices** like containerization, CI/CD, code quality checks, and monitoring.

---

## ✨ Features
- ⚡ Physics‑based Mario movement (running, jumping, momentum)  
- 👾 Enemy AI (Goombas patrol and can be stomped)  
- 💰 Collectible coins with animations  
- ❤️ Score & lives system (3 lives, game over screen)  
- 🎵 Retro sound effects (Web Audio API)  
- 📱 Responsive design for all screen sizes  
- 🐳 Dockerized for deployment  
- ☸️ Kubernetes manifests for scalable deployment  
- 🔄 CI/CD pipeline with Jenkins  
- ✅ Code quality with SonarQube  
- 📊 Monitoring with Prometheus & Grafana  

---

## 🏗️ Project Structure
```bash
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
```

---

## 🚀 Getting Started

### ✅ Prerequisites
- Node.js 18+  
- npm or yarn  
- Docker  
- Kubernetes cluster (for deployment)  
- SonarQube (for code quality)  
- Prometheus & Grafana (for monitoring)  

### 🖥️ Local Development
```bash
git clone https://github.com/likhitha-ux/super-mario.git
cd super-mario
npm install
npm run dev
```
Open browser → [http://localhost:5173](http://localhost:5173)

### 📦 Build for Production
```bash
npm run build
npm run preview
```

---

## 🐳 Docker Setup
```bash
docker build -t super-mario-game .
docker run -p 8080:8080 super-mario-game
```
Access → [http://localhost:8080](http://localhost:8080)

---

## ☸️ Kubernetes Deployment
```bash
kubectl apply -f deploy.yaml
kubectl apply -f deployment-service.yaml
kubectl get pods
```

---

## 📊 SonarQube Setup
```bash
docker run -d --name sonarqube -p 9000:9000 sonarqube:lts
```
Access → [http://localhost:9000](http://localhost:9000) (admin/admin)

`sonar-project.properties`
```properties
sonar.projectKey=super-mario-game
sonar.projectName=Super Mario Game
sonar.sources=src
sonar.language=ts
sonar.sourceEncoding=UTF-8
```

Run analysis:
```bash
sonar-scanner \
  -Dsonar.projectKey=super-mario-game \
  -Dsonar.sources=./src \
  -Dsonar.host.url=http://localhost:9000 \
  -Dsonar.login=<your-token>
```

---

## 📈 Monitoring Setup (Prometheus + Grafana)

**Prometheus**
```bash
tar xvfz prometheus-*.tar.gz
cd prometheus-*
./prometheus --config.file=prometheus.yml
```
→ [http://localhost:9090](http://localhost:9090)

**Grafana**
```bash
tar -zxvf grafana-*.tar.gz
cd grafana-*
./bin/grafana-server web
```
→ [http://localhost:3000](http://localhost:3000) (admin/admin)

Connect Prometheus in Grafana → Data Sources → `http://localhost:9090`

---

## ⚙️ Jenkins CI/CD Pipeline

pipeline {
    agent any
    
    tools {
        jdk 'jdk17'
        maven 'maven3'
    }

    enviornment {
        SCANNER_HOME= tool 'sonar-scanner'
    }

    stages {
        stage('Git Checkout') {
            steps {
               git branch: 'main', credentialsId: 'git-cred', url: 'https://github.com/likhitha-ux/super-mario.git'
            }
        }
        
        stage('Compile') {
            steps {
                sh "mvn compile"
            }
        }
        
        stage('Test') {
            steps {
                sh "mvn test"
            }
        }
        
        stage('File System Scan') {
            steps {
                sh "trivy fs --format table -o trivy-fs-report.html ."
            }
        }
        
        stage('SonarQube Analsyis') {
            steps {
                withSonarQubeEnv('sonar') {
                    sh ''' $SCANNER_HOME/bin/sonar-scanner -Dsonar.projectName=BoardGame -Dsonar.projectKey=BoardGame \
                            -Dsonar.java.binaries=. '''
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
        
        stage('Build') {
            steps {
               sh "mvn package"
            }
        }
        
        stage('Publish To Nexus') {
            steps {
               withMaven(globalMavenSettingsConfig: 'global-settings', jdk: 'jdk17', maven: 'maven3', mavenSettingsConfig: '', traceability: true) {
                    sh "mvn deploy"
                }
            }
        }
        
        stage('Build & Tag Docker Image') {
            steps {
               script {
                   withDockerRegistry(credentialsId: 'docker-cred', toolName: 'docker') {
                            sh "docker build -t likhithaa/supermario:latest ."
                    }
               }
            }
        }
        
        stage('Docker Image Scan') {
            steps {
                sh "trivy image --format table -o trivy-image-report.html adijaiswal/boardshack:latest "
            }
        }
        
        stage('Push Docker Image') {
            steps {
               script {
                   withDockerRegistry(credentialsId: 'docker-cred', toolName: 'docker') {
                            sh "docker push likhithaa/supermario:latest"
                    }
               }
            }
        }
        stage('Deploy To Kubernetes') {
            steps {
               withKubeConfig(caCertificate: '', clusterName: 'kubernetes', contextName: '', credentialsId: 'k8-cred', namespace: 'webapps', restrictKubeConfigAccess: false, serverUrl: 'https://172.31.8.146:6443') {
                        sh "kubectl apply -f deployment-service.yaml"
                }
            }
        }
        
        stage('Verify the Deployment') {
            steps {
               withKubeConfig(caCertificate: '', clusterName: 'kubernetes', contextName: '', credentialsId: 'k8-cred', namespace: 'webapps', restrictKubeConfigAccess: false, serverUrl: 'https://172.31.8.146:6443') {
                        sh "kubectl get pods -n webapps"
                        sh "kubectl get svc -n webapps"
                }
            }
        }
        
        
    }
    post {
    always {
        script {
            def jobName = env.JOB_NAME
            def buildNumber = env.BUILD_NUMBER
            def pipelineStatus = currentBuild.result ?: 'UNKNOWN'
            def bannerColor = pipelineStatus.toUpperCase() == 'SUCCESS' ? 'green' : 'red'

            def body = """
                <html>
                <body>
                <div style="border: 4px solid ${bannerColor}; padding: 10px;">
                <h2>${jobName} - Build ${buildNumber}</h2>
                <div style="background-color: ${bannerColor}; padding: 10px;">
                <h3 style="color: white;">Pipeline Status: ${pipelineStatus.toUpperCase()}</h3>
                </div>
                <p>Check the <a href="${BUILD_URL}">console output</a>.</p>
                </div>
                </body>
                </html>
            """

            emailext (
                subject: "${jobName} - Build ${buildNumber} - ${pipelineStatus.toUpperCase()}",
                body: body,
                to: 'nallurilikhithaa@gmail.com',
                from: 'jenkins@example.com',
                replyTo: 'jenkins@example.com',
                mimeType: 'text/html',
                attachmentsPattern: 'trivy-image-report.html'
            )
        }
    }
}
}
```
