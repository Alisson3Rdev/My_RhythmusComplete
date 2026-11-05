# My Rhythmus — front-end e back-end

Este diretório reúne o app Expo em `frontend/` e a API Spring Boot em `backend/`.
O cadastro e o login do app usam a API; os dados do perfil e dos esportes ficam no PostgreSQL.

## Pré-requisitos

- Java 21
- Node.js e npm
- PostgreSQL iniciado com o banco definido em `backend/.env`
- Expo Go no celular ou um emulador Android/iOS

## Configuração inicial

1. Configure o banco local e copie `backend/.env.example` para `backend/.env`.
2. Preencha `DB_PASSWORD` e defina um `JWT_SECRET` aleatório com pelo menos 32 bytes. Gere um com `openssl rand -base64 48`.
3. Instale as dependências do app:

   ```bash
   cd frontend
   npm ci
   ```

O Spring carrega `backend/.env` quando é iniciado dentro da pasta `backend`. Os arquivos `.env` são locais e ignorados pelo Git.

## Iniciar os dois juntos

Na raiz deste diretório:

```bash
./run-dev.sh
```

O script inicia a API na porta `8080` e o Expo. Para executar separadamente, abra dois terminais: `cd backend && sh mvnw spring-boot:run` e `cd frontend && npm start`.

O app tenta usar o host do servidor Expo como host da API. Se precisar configurar manualmente, copie `frontend/.env.example` para `frontend/.env` e defina `EXPO_PUBLIC_API_URL`, por exemplo `http://192.168.0.123:8080`. Celular e computador precisam estar na mesma rede Wi-Fi.

## Rotas usadas pelo app

- `POST /api/usuarios/cadastrar` — cria o perfil e os esportes e inicia a sessão.
- `POST /api/auth/login` — autentica e guarda o access token em memória para chamadas protegidas.
- `GET /api/usuarios/me` — carrega o perfil autenticado.
- `PUT /api/usuarios/me` — salva as alterações do perfil autenticado.

O cadastro envia a data como `yyyy-MM-dd`, normaliza o telefone e traduz o sexo para os valores aceitos pela API.

## Verificação

Na raiz, compile a API com `cd backend && sh mvnw -DskipTests compile`. Para verificar os tipos do app, use `cd frontend && npx tsc --noEmit`.
