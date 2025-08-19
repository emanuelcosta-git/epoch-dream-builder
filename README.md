# Sistema de Controle de Pagamentos - Vida Mais

Sistema web para controle de pagamentos fixos e variáveis da Vida Mais, desenvolvido conforme especificações da reunião de 7 de agosto de 2025.

## Funcionalidades

### 1. Pagamentos Mensais Fixos
- Controle de funcionários, aluguel e bolsas de estudo
- Envio mensal por e-mail para Sonia e Zé
- Classificações e controle de NF's
- Aprovação da Renata para valores altos
- Rateamento de salários entre projetos

### 2. Controle de Pagamentos Variáveis
- Tabela organizada por mês e classificações
- Observações sobre cada pagamento
- Relatórios gerados pelo Zé
- Acesso aos comprovantes da conta

## Níveis de Acesso

- **Ariela**: Lança pagamentos fixos e anexa NF's
- **Estagiário Ariela**: Lança pagamentos variáveis
- **Sonia**: Acesso aos pedidos de pagamentos
- **Zé**: Visualiza e baixa relatórios em XLS/TXT

## Tecnologias

- **Frontend**: React + Material-UI
- **Backend**: Node.js + Express
- **Banco de Dados**: SQLite
- **Autenticação**: JWT

## Instalação

1. Clone o repositório
2. Execute `npm run install-all` para instalar todas as dependências
3. Execute `npm run dev` para iniciar o desenvolvimento
4. Acesse `http://localhost:3000` no navegador

## Estrutura do Projeto

```
vida-mais-pagamentos/
├── client/          # Frontend React
├── server/          # Backend Node.js
├── database/        # Arquivos do banco SQLite
└── docs/           # Documentação
```

## Scripts Disponíveis

- `npm run dev`: Inicia servidor e cliente em modo desenvolvimento
- `npm run build`: Constrói o projeto para produção
- `npm start`: Inicia o servidor de produção
