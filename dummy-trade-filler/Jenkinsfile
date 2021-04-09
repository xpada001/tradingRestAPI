def openshiftName = 'demo-trade-api'
def projectName = 'dummy-trade-filler'
def version = "0.0.${currentBuild.number}"
def dockerImageTag = "${projectName}:${version}"

pipeline {
  agent any

  stages {

    stage('Test') {
      steps {
        sh 'chmod a+x gradlew'
        sh './gradlew test'
      }
    }

    stage('Build') {
      steps {
        sh './gradlew build'
      }
    }

    stage('Build Container') {
      steps {
        sh "docker build -t ${dockerImageTag} ."
      }
    }

    stage('Deploy Container To Openshift') {
      steps {
        sh "oc project ${openshiftName} || oc new-project ${openshiftName}"
        sh "oc get service mongo || oc new-app mongo"
        sh "oc delete all --selector app=${projectName} || echo 'Unable to delete all previous openshift resources'"
        sh "oc new-app ${dockerImageTag} -l version=${version} -e DB_HOST=mongo"
      }
    }
  }

  post {
    always {
      archiveArtifacts artifacts: 'build/libs/**/*.jar', fingerprint: true
      archiveArtifacts 'build/reports/**/*'
    }
  }
}