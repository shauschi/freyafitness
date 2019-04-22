pipeline {
  agent any
  options {
    skipDefaultCheckout()
    timeout(time: 5, unit: 'MINUTES')
  }
  parameters {
    choice(name: 'TAG', choices: ['ok', 'rc'], description: 'docker image tag')
    string(name: 'APP_NAME', defaultValue: 'freyafitness', description: 'container name')
    string(name: 'APP_PORT', defaultValue: '433', description: 'container port')
  }
  environment {
    SPRING_PROFILES_ACTIVE = "prod"
    DOCKER_REGISTRY = "localhost:5000"
    APP_PORT = "80"
    APP_PORT_S = "443"
    DB = credentials('db')
  }
  stages {
    stage('pull image') {
      input {
        message "Confirm update"
        ok "update container"
      }
      steps { sh 'docker pull ${DOCKER_REGISTRY}/${APP_NAME}:${TAG}' }
    }
    stage('stop app') {
      steps { sh 'docker stop ${APP_NAME} || true' }
    }
    stage('remove app') {
      steps { sh 'docker rm ${APP_NAME} || true' }
    }
    stage('run app') {
      steps {
        withCredentials(bindings: [certificate(credentialsId: 'freyafitness-ssl-certificat', \
                                               keystoreVariable: 'SSL_CERTIFICATE', \
                                               passwordVariable: 'SSL_PSW')]) {
          sh '''
            docker run -d \
              -p ${APP_PORT}:9000 \
              -p ${APP_PORT_S}:9443 \
              --restart=always \
              --name ${APP_NAME} \
              -e SPRING_PROFILES_ACTIVE=${SPRING_PROFILES_ACTIVE} \
              -e SSL_PSW=${SSL_PSW} \
              -e DB_USR=${DB_USR} \
              -e DB_PSW=${DB_PSW} \
              ${DOCKER_REGISTRY}/${APP_NAME}:${TAG}
          '''
        }
      }
    }

  }
  post {
    success {
      slackSend(color: "#BDFFC3", message: "${APP_NAME}:${TAG} started")
    }
    failure {
      slackSend(color: "#FF9FA1", message: "${APP_NAME}:${TAG} - failed to update - app down!")
    }
  }

}
