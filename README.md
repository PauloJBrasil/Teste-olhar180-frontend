# Teste-olhar180-frontend (Vite + React + TypeScript)

Frontend separado para o Gerenciador de Tarefas, conectando à API .NET.

## Tecnologias utilizadas
- `React 18` + `TypeScript`
- `Vite` (dev server, build)
- `axios` para chamadas HTTP
- `react-router-dom` para rotas
- `Nginx` para servir artefatos em produção (Docker)

## Como rodar o projeto localmente
1) Instale Node.js LTS
2) Na pasta `Teste-olhar180-frontend`: `npm install`
3) Dev server: `npm run dev` (abre em `http://localhost:5173`)

### Configuração de API (local)
- Proxy de desenvolvimento: por padrão `/api` é encaminhado para `http://localhost:5052`.
- Base URL direta: defina `VITE_API_BASE_URL` no `.env` se quiser apontar diretamente para a API (ex.: `VITE_API_BASE_URL=http://localhost:5052/api/v1`).

### Variáveis de ambiente
- `VITE_API_BASE_URL`: base da API (default `/api/v1`).
- `VITE_API_PROXY_TARGET`: alvo do proxy de `/api` (default `http://localhost:5052`).

## Decisões de arquitetura e deploy
- Cliente usa `/api/v1/*` e injeta `Authorization: Bearer <token>` automaticamente após login/registro.
- Em produção via Docker, os artefatos construídos são servidos por `nginx` com um reverse proxy para `/api` apontando para o serviço `api` do `docker-compose`.
- Separação clara entre build (Node/Vite) e runtime (Nginx).

## Como acessar a aplicação (deploy)
- Local (dev): `http://localhost:5173`
- Docker Compose: `http://localhost:8081` (frontend), `http://localhost:8080/swagger` (API)

## Fluxo funcional
- Registro: `POST /api/v1/auth/register` retorna `{ token, user }`
- Login: `POST /api/v1/auth/login` retorna `{ token, user }`
- Perfil: `PUT /api/v1/users/{id}` (autenticado)
- Tarefas: CRUD em `/api/v1/tasks` (autenticado)

## Build
`npm run build` gera arquivos em `dist/`.
