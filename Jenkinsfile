
pipeline {
  agent any

  environment {
    DOCKERHUB_REPO = 'kiran1975/nodejs-app'
    IMAGE_TAG = "${BUILD_NUMBER}"
  }

  stages {

    stage('Checkout') {
      steps {
        git branch: 'main', url: 'https://github.com/kiran20041975-crypto/nodejs-app.git'
      }
    }

    stage('Install and Test') {
      steps {
        sh 'npm install'
        sh 'npm test'
      }
    }

    stage('Docker Build') {
      steps {
        sh "docker build -t ${DOCKERHUB_REPO}:${IMAGE_TAG} ."
        sh "docker tag ${DOCKERHUB_REPO}:${IMAGE_TAG} ${DOCKERHUB_REPO}:latest"
      }
    }

    stage('Push to Docker Hub') {
      steps {
        withCredentials([usernamePassword(
          credentialsId: 'dockerhub-creds',
          usernameVariable: 'DOCKER_USER',
          passwordVariable: 'DOCKER_PASS'
        )]) {
          sh 'echo $DOCKER_PASS | docker login -u $DOCKER_USER --password-stdin'
          sh "docker push ${DOCKERHUB_REPO}:${IMAGE_TAG}"
          sh "docker push ${DOCKERHUB_REPO}:latest"
        }
      }
    }

    stage('Deploy to Kubernetes') {
      steps {
        withCredentials([file(credentialsId: 'kubeconfig', variable: 'KUBECONFIG')]) {
          sh "kubectl apply -f k8s/deployment.yaml --validate=false"
          sh "kubectl apply -f k8s/service.yaml --validate=false"
          sh "kubectl set image deployment/nodejs-app nodejs-app=${DOCKERHUB_REPO}:${IMAGE_TAG}"
          sh "kubectl rollout status deployment/nodejs-app"
        }
      }
    }

    stage('Canary Deploy') {
      steps {
        withCredentials([file(credentialsId: 'kubeconfig', variable: 'KUBECONFIG')]) {
          sh "docker tag ${DOCKERHUB_REPO}:${IMAGE_TAG} ${DOCKERHUB_REPO}:canary"
          sh "docker push ${DOCKERHUB_REPO}:canary"
          sh "kubectl apply -f k8s/canary-deployment.yaml --validate=false"
        }
      }
    }

  }

  post {
    success {
      echo 'Pipeline succeeded!'
    }
    failure {
      echo 'Pipeline failed!'
    }
  }
}
ENDOFFILE