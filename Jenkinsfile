pipeline {
  agent none
  options {
    skipDefaultCheckout()
  }
  environment{
    APP_NAME = 'freyafitness'
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
        sh 'npm run build_production'
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
        DB_URL = 'jdbc:postgresql://93.90.205.170/freyafitness'
        MONGO      = credentials('mongo')
        MONGO_HOST = '93.90.205.170'
        MONGO_PORT = 27017
      }
      steps {
        withCredentials(bindings: [certificate(credentialsId: 'freyafitness-ssl-certificat', \
                                               keystoreVariable: 'SSL_CERTIFICATE', \
                                               passwordVariable: 'SSL_PSW')]) {
          sh 'docker stop ${APP_NAME} || true && docker rm ${APP_NAME} || true'
          sh '''
            docker run --rm -d \
            -e SSL_PSW=${SSL_PSW} \
            -e DB_URL=${DB_URL} \
            -e DB_USR=${DB_USR} \
            -e DB_PSW=${DB_PSW} \
            -e MONGO_USR=${MONGO_USR} \
            -e MONGO_PSW=${MONGO_PSW} \
            -e MONGO_HOST=${MONGO_HOST} \
            -e MONGO_PORT=${MONGO_PORT} \
            -p 80:9000 \
            -p 443:9443 \
            --name ${APP_NAME} \
            ${APP_NAME}:latest
          '''
        }
      }
    }
  }
}
