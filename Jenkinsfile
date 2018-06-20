pipeline {
  agent none
  options {
    skipDefaultCheckout()
  }
  stages {
    stage('checkout') {
      agent any
      steps {
        checkout scm
      }
    }
    stage('build'){
      failFast true
      parallel{
        stage('react webapp'){
          agent {
            docker { image 'node:9-alpine' }
          }
          stages{
            stage('npm install') {
              steps {
                sh 'npm install'
              }
            }
            stage('npm test') {
              steps {
                sh 'npm test'
              }
            }
            stage('npm build production') {
              steps {
                sh 'npm run build_production'
              }
            }
          }
        }
        stage('spring boot application'){
          agent {
            docker { image 'openjdk:8-jdk-alpine' }
          }
          stages{
            stage('build application') {
              steps {
                sh 'ls -ll'
                sh './gradlew clean build'
              }
            }
            stage('test application') {
              steps {
                sh './gradlew test'
              }
            }
          }
        }
      }
    }
    stage('build jar') {
      agent {
        docker { image 'openjdk:8-jdk-alpine' }
      }
      steps {
        sh './gradlew bootJar'
      }
    }
    stage('containerize') {
      agent {
        docker { image 'docker' }
      }
      steps {
        sh 'docker build . -f Dockerfile -t freyafitness'
      }
    }
    stage('run container') {
      agent {
        docker { image 'docker' }
      }
      environment {
        DB = credentials('db')
        DB_URL = 'jdbc:postgresql://93.90.205.170/freyafitness'
        MONGO      = credentials('mongo')
        MONGO_HOST = '93.90.205.170'
        MONGO_PORT = 27017
      }
      steps {
        sh '''
          docker run --rm -d \
          -e DB_URL=${DB_URL} \
          -e DB_USR=${DB_USR} \
          -e DB_PSW=${DB_PSW} \
          -e MONGO_USR=${MONGO_USR} \
          -e MONGO_PSW=${MONGO_PSW} \
          -e MONGO_HOST=${MONGO_HOST} \
          -e MONGO_PORT=${MONGO_PORT} \
          freyafitness:latest -p 9000:9000
        '''
      }
    }
  }
}
