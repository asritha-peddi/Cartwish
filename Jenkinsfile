pipeline {
    agent any

    environment {
        IMAGE_NAME = "cartwish-frontend"
        DOCKER = "C:\\Program Files\\Docker\\Docker\\resources\\bin\\docker.exe"
        KUBECTL = "C:\\Program Files\\Docker\\Docker\\resources\\bin\\kubectl.exe"
        MINIKUBE = "C:\\Program Files\\Kubernetes\\Minikube\\minikube.exe"
        KUBECONFIG = "C:\\Users\\VENU MADHAVI\\.kube\\config"
        MINIKUBE_HOME = "C:\\Users\\VENU MADHAVI"
        USERPROFILE = "C:\\Users\\VENU MADHAVI"
    }

    stages {
        stage('Checkout') {
            steps {
                git branch: 'main', url: 'https://github.com/asritha-peddi/Cartwish.git'
            }
        }

        stage('Build Docker Image') {
            steps {
                bat "\"%DOCKER%\" build -t %IMAGE_NAME%:latest ."
            }
        }

        stage('Load Image into Minikube') {
            steps {
                bat "\"%MINIKUBE%\" image load %IMAGE_NAME%:latest"
            }
        }

        stage('Deploy to Kubernetes') {
            steps {
                bat "\"%KUBECTL%\" rollout restart deployment/cartwish-frontend"
            }
        }
    }

    post {
        success {
            echo 'Frontend pipeline completed successfully!'
        }
        failure {
            echo 'Pipeline failed. Check logs above.'
        }
    }
}
