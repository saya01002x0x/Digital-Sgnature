$env:SPRING_DATASOURCE_URL = "jdbc:postgresql://localhost:5432/miiao29"
$env:SPRING_DATASOURCE_USERNAME = "miiao29"
$env:SPRING_DATASOURCE_PASSWORD = "miiao29"
$env:JWT_SECRET = "THIS_IS_A_256_BIT_SECRET_KEY_FOR_JWT_1234567890ABCDE"
$env:JWT_EXPIRATION = "900000"
$env:SERVER_PORT = "5555"
$env:CORS_ALLOWED_ORIGIN = "http://localhost:5556"
$env:FRONTEND_URL = "http://localhost:5556"

Write-Host "=== STARTING BACKEND ===" -ForegroundColor Green
Write-Host "Database: $env:SPRING_DATASOURCE_URL"
Write-Host "Port: $env:SERVER_PORT"
Write-Host "CORS: $env:CORS_ALLOWED_ORIGIN"
Write-Host ""

mvn spring-boot:run

