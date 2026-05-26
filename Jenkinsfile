pipeline {
    agent any

    triggers {
        githubPush()
    }

    tools {
        // Asegúrate de que este nombre coincida con el que pusiste en 'Global Tool Configuration'
        nodejs 'node20' 
    }

    environment {
        DOCKER_USER = 'jose196'
        // Jenkins inyecta automáticamente DOCKER_HUB_AUTH_USR y DOCKER_HUB_AUTH_PSW
        DOCKER_HUB_AUTH = credentials('docker-hub-credentials')
    }

    stages {
        stage('Preparación') {
            steps {
                echo 'Limpiando entorno y descargando código...'
                checkout scm
            }
        }

        stage('Instalación pnpm') {
            steps {
                echo 'Instalando dependencias del monorepo...'
                sh 'pnpm install'
            }
        }

        stage('Construir Imágenes Docker') {
            steps {
                script {
                    echo 'Construyendo imágenes con argumentos de microservicio...'
                    
                    // 1. Client Gateway
                    sh "docker build -t ${DOCKER_USER}/tito-gateway:latest --build-arg MICROSERVICIO=ms-client-gateway -f apps/ms-client-gateway/deploy/Dockerfile ."
                    
                    // 2. Microservicio de Usuarios
                    sh "docker build -t ${DOCKER_USER}/tito-ms-usuarios:latest --build-arg MICROSERVICIO=ms-usuarios -f apps/ms-usuarios/deploy/Dockerfile ."
                    
                    // 3. Microservicio de Productos
                    sh "docker build -t ${DOCKER_USER}/tito-ms-productos:latest --build-arg MICROSERVICIO=ms-productos -f apps/ms-productos/deploy/Dockerfile ."

                    // 4. Microservicio de Auth
                    sh "docker build -t ${DOCKER_USER}/tito-ms-auth:latest --build-arg MICROSERVICIO=ms-auth -f apps/ms-auth/deploy/Dockerfile ."
                }
            }
        }

        stage('Subir a Docker Hub') {
            steps {
                echo 'Iniciando sesión en Docker Hub y subiendo imágenes...'
                sh "echo $DOCKER_HUB_AUTH_PSW | docker login -u $DOCKER_HUB_AUTH_USR --password-stdin"
                
                sh "docker push ${DOCKER_USER}/tito-gateway:latest"
                sh "docker push ${DOCKER_USER}/tito-ms-usuarios:latest"
                sh "docker push ${DOCKER_USER}/tito-ms-productos:latest"
                sh "docker push ${DOCKER_USER}/tito-ms-auth:latest"
            }
        }
    }
    
    post {
        success {
            echo '¡Pipeline finalizado con éxito! Imágenes disponibles en Docker Hub.'
        }
        failure {
            echo 'Algo ha fallado en el proceso. Revisa los logs de arriba.'
        }
    }
}