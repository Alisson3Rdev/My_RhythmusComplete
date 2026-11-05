# Backend Spring Boot

## Configuração local

1. Copie `.env.example` para `.env`.
2. Preencha `DB_PASSWORD` e gere `JWT_SECRET` com `openssl rand -base64 48`.
3. Inicie com `./mvnw spring-boot:run`.

O Spring carrega `.env` automaticamente. Esse arquivo é local e está no `.gitignore`; nunca o envie ao repositório.
