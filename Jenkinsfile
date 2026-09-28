pipeline {
    agent any

    options {
        timestamps()
        disableConcurrentBuilds()
    }

    environment {
        IMAGE_NAME = 'cartwish-frontend'
        DEPLOYMENT_NAME = 'cartwish-frontend'
    }

    stages {
        stage('Checkout') {
            steps {
                git branch: 'main',
                    url: 'https://github.com/asritha-peddi/Cartwish.git'
            }
        }

        stage('Verify Tools') {
            steps {
                bat 'docker --version'
                bat 'kubectl version --client'
                bat 'minikube version'
            }
        }

        stage('Install and Build Frontend') {
            steps {
                bat 'npm ci'
                bat 'npm run build'
            }
        }

        stage('Build Docker Image') {
            steps {
                bat 'docker build -t %IMAGE_NAME%:latest .'
            }
        }

        stage('Load Image into Minikube') {
            steps {
                bat 'minikube image load %IMAGE_NAME%:latest'
            }
        }

        stage('Deploy to Kubernetes') {
            steps {
                bat 'kubectl rollout restart deployment/%DEPLOYMENT_NAME%'
                bat 'kubectl rollout status deployment/%DEPLOYMENT_NAME% --timeout=120s'
            }
        }
    }

    post {
        success {
            echo 'Frontend pipeline completed successfully.'
        }

        failure {
            echo 'Frontend pipeline failed. Review the stage logs.'
        }

        always {
            bat 'kubectl get pods || exit 0'
        }
    }
}