# Instruções de Instalação - Sistema Vida Mais

## Pré-requisitos

- Node.js 16+ 
- npm ou yarn
- Git

## Passo a Passo

### 1. Clone o repositório
```bash
git clone <url-do-repositorio>
cd vida-mais-pagamentos
```

### 2. Instale todas as dependências
```bash
npm run install-all
```

### 3. Configure as variáveis de ambiente
```bash
# No servidor
cd server
cp env.example .env
# Edite o arquivo .env com suas configurações
```

### 4. Inicialize o banco de dados
```bash
cd server
npm run init-db
```

### 5. Inicie o desenvolvimento
```bash
# Na raiz do projeto
npm run dev
```

## Configurações

### Banco de Dados
O sistema usa SQLite por padrão. O arquivo será criado em `server/database/vida-mais.db`.

### E-mail
Para usar o envio de e-mail, configure no arquivo `.env`:
- EMAIL_USER: Seu e-mail Gmail
- EMAIL_PASS: Senha de aplicativo do Gmail (não sua senha normal)

### JWT
Altere o JWT_SECRET no arquivo `.env` para uma chave segura em produção.

## Usuários Padrão

Após inicializar o banco, os seguintes usuários estarão disponíveis:

| Nome | E-mail | Perfil | Senha |
|------|---------|---------|-------|
| Ariela Silva | ariela@vidamais.com | ariela | 123456 |
| Estagiário Ariela | estagiario@vidamais.com | estagiario | 123456 |
| Sonia Costa | sonia@vidamais.com | sonia | 123456 |
| Zé Santos | ze@vidamais.com | ze | 123456 |
| Renata Oliveira | renata@vidamais.com | renata | 123456 |
| Admin Sistema | admin@vidamais.com | admin | 123456 |

## Acessos

- **Frontend**: http://localhost:3000
- **Backend**: http://localhost:5000
- **API Health**: http://localhost:5000/api/health

## Funcionalidades por Perfil

### Ariela
- Criar/editar pagamentos fixos
- Anexar NF's
- Acesso completo ao sistema

### Estagiário
- Criar pagamentos variáveis
- Visualizar dados

### Sonia
- Visualizar pedidos de pagamento
- Acesso limitado

### Zé
- Visualizar relatórios
- Baixar arquivos Excel
- Acesso limitado

### Renata
- Aprovar/rejeitar pagamentos
- Gerar relatórios
- Acesso administrativo

### Admin
- Acesso total ao sistema
- Gerenciar usuários
- Todas as funcionalidades

## Estrutura de Arquivos

```
vida-mais-pagamentos/
├── client/                 # Frontend React
│   ├── src/
│   │   ├── components/    # Componentes React
│   │   ├── contexts/      # Contextos (Auth)
│   │   ├── services/      # Serviços de API
│   │   └── App.js         # Componente principal
│   └── package.json
├── server/                 # Backend Node.js
│   ├── routes/            # Rotas da API
│   ├── middleware/        # Middlewares
│   ├── database/          # Banco SQLite
│   ├── uploads/           # Arquivos enviados
│   └── index.js           # Servidor principal
├── database/               # Arquivos do banco
└── package.json            # Scripts principais
```

## Comandos Úteis

```bash
# Desenvolvimento
npm run dev              # Inicia servidor e cliente
npm run server           # Apenas servidor
npm run client           # Apenas cliente

# Produção
npm run build            # Constrói frontend
npm start                # Inicia servidor de produção

# Banco de dados
npm run init-db          # Inicializa banco
```

## Solução de Problemas

### Erro de porta em uso
```bash
# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Linux/Mac
lsof -i :5000
kill -9 <PID>
```

### Erro de dependências
```bash
# Limpar cache
npm cache clean --force
rm -rf node_modules
npm install
```

### Erro de banco
```bash
# Remover banco e recriar
rm server/database/vida-mais.db
npm run init-db
```

## Deploy

### Frontend
```bash
cd client
npm run build
# Copiar pasta build para servidor web
```

### Backend
```bash
cd server
npm install --production
npm start
```

## Suporte

Para dúvidas ou problemas, consulte:
- README.md
- Documentação das APIs
- Logs do servidor
