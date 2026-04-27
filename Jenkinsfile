stage('Deploy to Kubernetes') {
  steps {
    sh "export KUBECONFIG=/var/lib/jenkins/jenkins-kubeconfig.yaml && kubectl apply -f k8s/deployment.yaml --validate=false"
    sh "export KUBECONFIG=/var/lib/jenkins/jenkins-kubeconfig.yaml && kubectl apply -f k8s/service.yaml --validate=false"
    sh "export KUBECONFIG=/var/lib/jenkins/jenkins-kubeconfig.yaml && kubectl set image deployment/nodejs-app nodejs-app=${DOCKERHUB_REPO}:${IMAGE_TAG}"
    sh "export KUBECONFIG=/var/lib/jenkins/jenkins-kubeconfig.yaml && kubectl rollout status deployment/nodejs-app"
  }
}
