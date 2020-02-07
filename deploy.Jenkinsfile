pipeline {
  agent any
  options {
    skipDefaultCheckout()
    timeout(time: 5, unit: 'MINUTES')
  }

  environment {
    APP_NAME = 'freyraum-backend'
    DOCKER_REGISTRY = 'localhost:5000'
    SPRING_PROFILES_ACTIVE = 'prod'
    DB = credentials('db')
  }

  stages {
    stage('pull image') {
      input {
        message "Confirm update"
        ok "update container"
      }
      steps { sh 'docker pull ${DOCKER_REGISTRY}/${APP_NAME}' }
    }

    stage('stop and remove app') {
      steps {
        sh 'docker stop ${APP_NAME} || true'
        sh 'docker rm ${APP_NAME} || true'
      }
    }

    stage('run app') {
      steps {
        sh '''
          docker run -d \
            -p 80 \
            --restart=always \
            --name ${APP_NAME} \
            --network=freyraum \
            -e SPRING_PROFILES_ACTIVE=${SPRING_PROFILES_ACTIVE} \
            -e DB_USR=${DB_USR} \
            -e DB_PSW=${DB_PSW} \
            ${DOCKER_REGISTRY}/${APP_NAME}:ok
        '''
      }
    }

  }

  post {
    success {
      slackSend(
          color: "#BDFFC3",
          message: "${APP_NAME} started"
      )
    }
    failure {
      slackSend(
          color: "#FF9FA1",
          message: "${APP_NAME} - failed to update - app down!"
      )
    }
  }

}
