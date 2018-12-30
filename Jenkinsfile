
def mapBranchToEnvironment(branch) {
  def appName = 'freyafitness'
  if (branch == 'master') {
    return '[PRODUCTION]'
  }
  if (branch == 'develop') {
    return '[TEST]'
  }
  return '[DEVELOPMENT]'
}

def mapBranchToAppName(branch) {
  def appName = 'freyafitness'
  if (branch == 'master') {
    return appName
  }
  if (branch == 'develop') {
    return appName + '_int'
  }
  return appName + '_tst'
}

def mapBranchToPort(branch) {
  if (branch == 'master') {
    return 80
  }
  if (branch == 'develop') {
    return 9080
  }
  return 7080
}

def mapBranchToPortHttps(branch) {
  if (branch == 'master') {
    return 443
  }
  if (branch == 'develop') {
    return 9443
  }
  return 7443
}

def mapBranchToDockerImage(branch) {
  def appName = 'freyafitness'
  if (branch == 'master') {
    return appName + ':latest'
  }
  if (branch == 'develop') {
    return appName + ':next'
  }
  return appName + ':snapshot'
}

def mapBranchToMailUrl(branch) {
  if (branch == 'master') {
    return 'http://freya.fitness:7700'
  }
  return 'http://freya.fitness:9700'
}

def mapBranchToFrontendUrl(branch) {
  if (branch == 'master') {
    return 'http://freya.fitness:3333'
  }
  if (branch == 'develop') {
    return 'http://freya.fitness:3334'
  }
  return 'http://freya.fitness:3335'
}

pipeline {
  agent none
  options {
    skipDefaultCheckout()
  }
  environment{
    ENV_NAME = mapBranchToEnvironment("${BRANCH_NAME}")
    APP_NAME = mapBranchToAppName("${BRANCH_NAME}")
    DOCKER_IMAGE = mapBranchToDockerImage("${BRANCH_NAME}")
    BRANCH = "${BRANCH_NAME}"
    DB = credentials('db')
    DB_URL = "jdbc:postgresql://93.90.205.170/${APP_NAME}"

    MAIL_URL   = mapBranchToMailUrl("${BRANCH_NAME}")
    FRONTEND_URL = mapBranchToFrontendUrl("${BRANCH_NAME}")
    APP_PORT   = mapBranchToPort("${BRANCH_NAME}")
    APP_PORT_S = mapBranchToPortHttps("${BRANCH_NAME}")
  }
  stages {
    stage('checkout') {
      agent any
      steps {
        checkout scm
      }
    }

    stage('build application') {
      agent {
        docker { image 'openjdk:8-jdk-alpine' }
      }
      steps {
        sh './gradlew clean build -x test'
      }
    }

    stage('test application') {
      agent {
        docker { image 'openjdk:8-jdk-alpine' }
      }
      steps {
        sh './gradlew test'
      }
    }

    stage('build jar') {
      agent {
        docker { image 'openjdk:8-jdk-alpine' }
      }

      steps {
        withCredentials(bindings: [certificate(credentialsId: 'freyafitness-ssl-certificat', \
                                               keystoreVariable: 'SSL_CERTIFICATE', \
                                               passwordVariable: 'SSL_PSW')]) {

          sh 'cp ${SSL_CERTIFICATE} src/main/resources/my.p12'
          sh './gradlew bootJar'
        }
      }
    }

    stage('containerize') {
      agent any
      steps {
        sh 'docker build . -f Dockerfile -t ${APP_NAME}'
        sh 'docker tag ${APP_NAME} localhost:5000/${DOCKER_IMAGE}'
        sh 'docker push localhost:5000/${DOCKER_IMAGE}'
      }
    }

    stage('run container') {
      agent any
      steps {
        withCredentials(bindings: [certificate(credentialsId: 'freyafitness-ssl-certificat', \
                                               keystoreVariable: 'SSL_CERTIFICATE', \
                                               passwordVariable: 'SSL_PSW')]) {
          sh 'docker stop ${APP_NAME} || true && docker rm ${APP_NAME} || true'
          sh '''
            docker run -d \
            -e APP_PORT_S=${APP_PORT_S} \
            -e SSL_PSW=${SSL_PSW} \
            -e DB_URL=${DB_URL} \
            -e DB_USR=${DB_USR} \
            -e DB_PSW=${DB_PSW} \
            -e BRANCH=${BRANCH} \
            -e MAIL_URL=${MAIL_URL} \
            -e FRONTEND_URL=${FRONTEND_URL} \
            -p ${APP_PORT}:9000 \
            -p ${APP_PORT_S}:${APP_PORT_S} \
            --restart=always \
            --name ${APP_NAME} \
            ${APP_NAME}:latest
          '''
        }
      }
    }
  }

  post {
    success {
      slackSend(color: "#BDFFC3", message: "${ENV_NAME} Started docker container successfully - ${env.BRANCH} <https://freya.fitness:${APP_PORT_S}|freya.fitness>")
    }
    failure {
      slackSend(color: "#FF9FA1", message: "${ENV_NAME} build failed - ${env.BRANCH} ${env.BUILD_NUMBER}")
    }
  }
}
