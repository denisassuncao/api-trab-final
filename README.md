# API TCC (REST + GraphQL + JWT)

## Requisitos
- Node.js >= 18

## Configuração
```bash
cp .env.example .env
npm ci
npm run dev
```

API: `http://localhost:3000`
- REST: `/api/auth/register`, `/api/auth/login`, `/api/items`
- GraphQL: `POST /graphql` (GraphiQL habilitado)

## Testes
```bash
npm test
```

## Rotas
### Auth
- **POST** `/api/auth/register` { email, password }
- **POST** `/api/auth/login` { email, password } -> { token }

### Items (JWT Bearer)
- **GET** `/api/items`
- **POST** `/api/items` { name }
- **DELETE** `/api/items/:id`

## GraphQL (JWT Bearer)
- `mutation { addItem(name: "Teste") { id name } }`
- `query { myItems { id name } }`
- `mutation { deleteItem(id: "...") }`
