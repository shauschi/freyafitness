
pipeline {
  agent any
  options {
    skipDefaultCheckout()
  }

  environment{
    APP_NAME = 'freyraum-backend'
    DOCKER_REGISTRY = 'localhost:5000'
  }

  stages {
    stage('checkout') {
      steps { checkout scm }
    }

    stage('clean and build application') {
      steps { sh './gradlew clean build -x test' }
    }

    stage('test') {
      steps { sh './gradlew test' }
    }

    stage('build container') {
      steps {
          sh './gradlew bootJar'
          sh 'docker build . -f Dockerfile -t ${APP_NAME}'
          sh 'docker tag ${APP_NAME} ${DOCKER_REGISTRY}/${APP_NAME}:ok'
          sh 'docker push ${DOCKER_REGISTRY}/${APP_NAME}:ok'
      }
    }
  }

  post {
    success {
      slackSend(
        color: "#BDFFC3",
        message: "successfully build new container ${APP_NAME}"
      )
    }
    failure {
      slackSend(
        color: "#FF9FA1",
        message: "${APP_NAME} build failed - ${env.BRANCH} ${env.BUILD_NUMBER}"
      )
    }
  }
}
