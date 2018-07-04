
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

def mapBranchToNpm(branch) {
  if (branch == 'master') {
    return 'build_production'
  }
  if (branch == 'develop') {
    return 'build_int'
  }
  return 'build_tst'
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

pipeline {
  agent none
  options {
    skipDefaultCheckout()
  }
  environment{
    APP_NAME = mapBranchToAppName("${BRANCH_NAME}")
    NPM_CMD = mapBranchToNpm("${BRANCH_NAME}")
    BRANCH = "${BRANCH_NAME}"
  }
  stages {
    stage('checkout') {
      agent any
      steps {
        checkout scm
      }
    }

    stage('npm install') {
      agent {
        docker { image 'node:9-alpine' }
      }
      steps {
        sh 'npm install'
      }
    }

    stage('npm test') {
      agent {
        docker { image 'node:9-alpine' }
      }
      steps {
        sh 'npm test'
      }
    }

    stage('npm build production') {
      agent {
        docker { image 'node:9-alpine' }
      }
      steps {
        sh 'npm run ${NPM_CMD}'
      }
    }

    stage('build application') {
      agent {
        docker { image 'openjdk:8-jdk-alpine' }
      }
      steps {
        sh './gradlew clean build'
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
      }
    }

    stage('run container') {
      agent any
      environment {
        DB = credentials('db')
        DB_URL = "jdbc:postgresql://93.90.205.170/${APP_NAME}"
        MONGO      = credentials('mongo')
        MONGO_HOST = '93.90.205.170'
        MONGO_PORT = 27017
        APP_PORT   = mapBranchToPort("${BRANCH_NAME}")
        APP_PORT_S = mapBranchToPortHttps("${BRANCH_NAME}")
        MAIL       = credentials('mail')
        MAIL_HOST  = "smtp.1und1.de"
        MAIL_PORT  = 587
      }
      steps {
        withCredentials(bindings: [certificate(credentialsId: 'freyafitness-ssl-certificat', \
                                               keystoreVariable: 'SSL_CERTIFICATE', \
                                               passwordVariable: 'SSL_PSW')]) {
          sh 'docker stop ${APP_NAME} || true && docker rm ${APP_NAME} || true'
          sh '''
            docker run --rm  -d \
            -e SSL_PSW=${SSL_PSW} \
            -e DB_URL=${DB_URL} \
            -e DB_USR=${DB_USR} \
            -e DB_PSW=${DB_PSW} \
            -e MONGO_DB_NAME=${APP_NAME} \
            -e MONGO_USR=${MONGO_USR} \
            -e MONGO_PSW=${MONGO_PSW} \
            -e MONGO_HOST=${MONGO_HOST} \
            -e MONGO_PORT=${MONGO_PORT} \
            -e BRANCH=${BRANCH} \
            -e MAIL_HOST=${MAIL_HOST} \
            -e MAIL_PORT=${MAIL_PORT} \
            -e MAIL_USR=${MAIL_USR} \
            -e MAIL_PSW=${MAIL_PSW} \
            -p ${APP_PORT}:9000 \
            -p ${APP_PORT_S}:9443 \
            --name ${APP_NAME} \
            ${APP_NAME}:latest
          '''
        }
      }
    }
  }
}
