pipeline {
    agent any
    
    environment {
        APP_NAME = 'my-jenkins-node-app'
        DOCKER_IMAGE = "${APP_NAME}:${BUILD_NUMBER}"
        PORT = '3001'  // Use different port to avoid conflicts
    }
    
    stages {
        stage('Checkout') {
            steps {
                echo '🔄 Checking out source code...'
                checkout scm
            }
        }
        
        stage('Install Dependencies') {
            steps {
                echo '📦 Installing Node.js dependencies...'
                script {
                    // Create a temporary container to install dependencies and run tests
                    sh '''
                        docker run --rm -v ${WORKSPACE}:/app -w /app node:18-alpine sh -c "
                            npm install
                            echo '✅ Dependencies installed successfully'
                        "
                    '''
                }
            }
        }
        
        stage('Run Tests') {
            steps {
                echo '🧪 Running tests...'
                script {
                    sh '''
                        docker run --rm -v ${WORKSPACE}:/app -w /app node:18-alpine sh -c "
                            npm install
                            npm test
                            echo '✅ All tests passed'
                        "
                    '''
                }
            }
        }
        
        stage('Build Docker Image') {
            steps {
                echo '🏗️ Building Docker image...'
                script {
                    sh "docker build -t ${DOCKER_IMAGE} ."
                    echo "✅ Docker image ${DOCKER_IMAGE} built successfully"
                }
            }
        }
        
        stage('Deploy Application') {
            steps {
                echo '🚀 Deploying application...'
                script {
                    // Stop and remove existing container if running
                    sh '''
                        docker stop my-node-app-container || true
                        docker rm my-node-app-container || true
                        echo "🧹 Cleaned up existing containers"
                    '''
                    
                    // Run new container
                    sh """
                        docker run -d \\
                            --name my-node-app-container \\
                            -p ${PORT}:3000 \\
                            --restart unless-stopped \\
                            ${DOCKER_IMAGE}
                        echo "🎉 Application deployed on port ${PORT}"
                    """
                }
            }
        }
        
        stage('Health Check & Verification') {
    steps {
        echo '🔍 Performing health check...'
        script {
            // Wait for application to start
            echo '⏳ Waiting for application to start...'
            sleep 15

            // Check if container is running
            sh '''
                if docker ps | grep -q my-node-app-container; then
                    echo "✅ Container is running"
                else
                    echo "❌ Container failed to start"
                    docker logs my-node-app-container
                    exit 1
                fi
            '''

            // Test health endpoint using the container name for network resolution
            echo '🏥 Testing health endpoint...'
            sh """
                curl -f http://my-node-app-container:3000/health || exit 1
                echo "✅ Health check passed"
            """

            // Test main application using the container name for network resolution
            echo '🌐 Testing main application...'
            sh """
                curl -f http://my-node-app-container:3000/ | grep -q "Hello from Jenkins" || exit 1
                echo "✅ Application is responding correctly"
            """
        }
    }
}
        
        stage('Display Access Information') {
            steps {
                echo '📋 Deployment Complete! Access Information:'
                script {
                    sh """
                        echo "🌐 Application URL: http://localhost:${PORT}"
                        echo "🏥 Health Check: http://localhost:${PORT}/health"
                        echo "📊 API Info: http://localhost:${PORT}/api/info"
                        echo "🐳 Docker Container: my-node-app-container"
                        echo "📦 Docker Image: ${DOCKER_IMAGE}"
                    """
                }
            }
        }
    }
    
    post {
        success {
            echo '''
                🎉 PIPELINE SUCCESS! 🎉
                ================================
                ✅ Code checked out successfully
                ✅ Dependencies installed
                ✅ All tests passed
                ✅ Docker image built
                ✅ Application deployed
                ✅ Health checks passed
                
                Your Node.js application is now running!
            '''
        }
        failure {
            echo '''
                ❌ PIPELINE FAILED! ❌
                ========================
                Check the console output above for detailed error information.
                Common issues:
                - Docker service not running
                - Port conflicts
                - Test failures
                - Network connectivity issues
            '''
            script {
                // Show container logs if deployment failed
                sh '''
                    echo "🔍 Checking container logs..."
                    docker logs my-node-app-container || true
                '''
            }
        }
        always {
            echo '🧹 Cleaning up build artifacts...'
            script {
                // Clean up old Docker images to save space (keep last 3)
                sh '''
                    docker images ${APP_NAME} --format "table {{.Tag}}" | tail -n +2 | sort -nr | tail -n +4 | xargs -r docker rmi ${APP_NAME}: || true
                    echo "✅ Cleanup completed"
                '''
            }
        }
    }
}
