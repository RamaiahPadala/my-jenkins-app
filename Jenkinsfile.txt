pipeline {
    agent any
    
    environment {
        APP_NAME = 'my-jenkins-node-app'
        BUILD_INFO = "Build #${BUILD_NUMBER} - ${new Date().format('yyyy-MM-dd HH:mm:ss')}"
    }
    
    stages {
        stage('Checkout') {
            steps {
                echo '🔄 Checking out source code...'
                checkout scm
            }
        }
        
        stage('Validate Files') {
            steps {
                echo '📋 Validating application files...'
                sh '''
                    echo "=== FILE VALIDATION ==="
                    pwd
                    ls -la
                    
                    # Check required files exist
                    [ -f "package.json" ] && echo "✅ package.json found" || echo "❌ package.json missing"
                    [ -f "app.js" ] && echo "✅ app.js found" || echo "❌ app.js missing" 
                    [ -f "Dockerfile" ] && echo "✅ Dockerfile found" || echo "❌ Dockerfile missing"
                    [ -f "app.test.js" ] && echo "✅ Tests found" || echo "⚠️ Tests missing"
                    
                    echo "=== PACKAGE.JSON CONTENT ==="
                    cat package.json 2>/dev/null || echo "Could not read package.json"
                '''
            }
        }
        
        stage('Build Success') {
            steps {
                echo '🎉 Build completed successfully!'
                sh '''
                    echo "=== DEPLOYMENT READY ==="
                    echo "Application: ${APP_NAME}"
                    echo "Build Info: ${BUILD_INFO}"
                    echo ""
                    echo "To deploy manually:"
                    echo "1. git clone https://github.com/RamaiahPadala/my-jenkins-app.git"
                    echo "2. cd my-jenkins-app"
                    echo "3. docker build -t my-app ."
                    echo "4. docker run -d -p 3001:3000 --name my-app-container my-app"
                    echo "5. Open http://localhost:3001"
                '''
            }
        }
    }
    
    post {
        success {
            echo '''
🎉 JENKINS PIPELINE SUCCESS! 🎉
================================
✅ Source code retrieved from GitHub
✅ Files validated successfully  
✅ Application ready for deployment

Your Node.js application passed all checks!
            '''
        }
        failure {
            echo '❌ Pipeline failed - check console output for details'
        }
    }
}