# Diagramas da Arquitetura - Sistema Vida Mais

## 1. Arquitetura de Alto Nível

```mermaid
graph TB
    subgraph "Cliente"
        A[Usuário] --> B[Navegador Web]
        B --> C[React App]
    end
    
    subgraph "Servidor"
        D[Express.js] --> E[Middleware]
        E --> F[Rotas]
        F --> G[Controladores]
        G --> H[Serviços]
    end
    
    subgraph "Persistência"
        I[SQLite Database]
        J[File System]
        K[Email Service]
    end
    
    C --> D
    H --> I
    H --> J
    H --> K
```

## 2. Fluxo de Autenticação

```mermaid
sequenceDiagram
    participant U as Usuário
    participant F as Frontend
    participant B as Backend
    participant DB as Database
    
    U->>F: Login (email/senha)
    F->>B: POST /auth/login
    B->>DB: Verificar credenciais
    DB-->>B: Dados do usuário
    B->>B: Gerar JWT
    B-->>F: Token JWT + dados
    F->>F: Armazenar token
    F-->>U: Redirecionar para Dashboard
```

## 3. Fluxo de Criação de Pagamento

```mermaid
sequenceDiagram
    participant A as Ariela
    participant F as Frontend
    participant B as Backend
    participant DB as Database
    participant R as Renata
    
    A->>F: Criar pagamento
    F->>B: POST /pagamentos/variaveis
    B->>B: Validar dados
    B->>DB: Salvar pagamento
    DB-->>B: Confirmação
    
    alt Valor > Limite
        B->>R: Notificar aprovação necessária
        R->>B: Aprovar/Rejeitar
        B->>DB: Atualizar status
    else Valor <= Limite
        B->>DB: Aprovação automática
    end
    
    B-->>F: Confirmação
    F-->>A: Pagamento criado
```

## 4. Estrutura de Banco de Dados

```mermaid
erDiagram
    USUARIOS {
        int id PK
        string nome
        string email UK
        string senha
        string perfil
        boolean ativo
        datetime criado_em
    }
    
    PROJETOS {
        int id PK
        string nome
        string descricao
        decimal orcamento_anual
        boolean ativo
        datetime criado_em
    }
    
    PAGAMENTOS_FIXOS {
        int id PK
        string descricao
        decimal valor
        string tipo
        int projeto_id FK
        string fornecedor
        string conta_bancaria
        int dia_vencimento
        boolean ativo
        string observacoes
        datetime criado_em
    }
    
    PAGAMENTOS_VARIAVEIS {
        int id PK
        string descricao
        decimal valor
        date data_pagamento
        string mes_referencia
        int ano_referencia
        string classificacao
        int projeto_id FK
        string fornecedor
        string numero_nf
        string comprovante_path
        string observacoes
        string status
        int aprovado_por FK
        int criado_por FK
        datetime criado_em
    }
    
    ANEXOS {
        int id PK
        string nome_arquivo
        string caminho_arquivo
        string tipo_arquivo
        int tamanho
        int pagamento_id FK
        string pagamento_tipo
        int criado_por FK
        datetime criado_em
    }
    
    LOGS_APROVACAO {
        int id PK
        int pagamento_id FK
        string status
        int aprovado_por FK
        datetime data_aprovacao
        string observacoes
    }
    
    USUARIOS ||--o{ PAGAMENTOS_VARIAVEIS : "criado_por"
    USUARIOS ||--o{ PAGAMENTOS_VARIAVEIS : "aprovado_por"
    USUARIOS ||--o{ ANEXOS : "criado_por"
    USUARIOS ||--o{ LOGS_APROVACAO : "aprovado_por"
    PROJETOS ||--o{ PAGAMENTOS_FIXOS : "projeto_id"
    PROJETOS ||--o{ PAGAMENTOS_VARIAVEIS : "projeto_id"
    PAGAMENTOS_FIXOS ||--o{ ANEXOS : "pagamento_id"
    PAGAMENTOS_VARIAVEIS ||--o{ ANEXOS : "pagamento_id"
    PAGAMENTOS_VARIAVEIS ||--o{ LOGS_APROVACAO : "pagamento_id"
```

## 5. Arquitetura de Segurança

```mermaid
graph TB
    subgraph "Frontend"
        A[React App] --> B[Auth Context]
        B --> C[Protected Routes]
    end
    
    subgraph "Backend"
        D[Express App] --> E[Helmet Middleware]
        E --> F[CORS Middleware]
        F --> G[Auth Middleware]
        G --> H[Role Middleware]
        H --> I[Route Handlers]
    end
    
    subgraph "Database"
        J[SQLite] --> K[Prepared Statements]
        L[File System] --> M[Path Validation]
    end
    
    A --> D
    I --> J
    I --> L
```

## 6. Fluxo de Relatórios

```mermaid
flowchart TD
    A[Usuário solicita relatório] --> B{Que tipo?}
    B -->|Mensal| C[Relatório Mensal]
    B -->|Anual| D[Relatório Anual]
    
    C --> E[Consultar BD]
    D --> E
    
    E --> F[Processar dados]
    F --> G[Gerar Excel]
    G --> H{Enviar por email?}
    
    H -->|Sim| I[Enviar para Sonia e Zé]
    H -->|Não| J[Download direto]
    
    I --> K[Log de envio]
    J --> L[Arquivo disponível]
```

## 7. Estrutura de Componentes React

```mermaid
graph TD
    A[App.js] --> B[AuthContext]
    A --> C[Layout]
    A --> D[ProtectedRoute]
    
    C --> E[Sidebar]
    C --> F[AppBar]
    C --> G[Main Content]
    
    G --> H[Dashboard]
    G --> I[Fixed Payments]
    G --> J[Variable Payments]
    G --> K[Reports]
    G --> L[Users]
    G --> M[Profile]
    
    H --> N[Stats Cards]
    H --> O[Charts]
    H --> P[Recent Payments]
    
    I --> Q[Payment Form]
    I --> R[Payment List]
    
    J --> S[Variable Form]
    J --> T[Variable List]
    J --> U[Approval Workflow]
```

## 8. Padrões de Middleware

```mermaid
graph LR
    A[Request] --> B[Helmet]
    B --> C[CORS]
    C --> D[Body Parser]
    D --> E[Auth Check]
    E --> F[Role Check]
    F --> G[Route Handler]
    G --> H[Response]
    
    E --> I{Token válido?}
    I -->|Não| J[401 Unauthorized]
    I -->|Sim| F
    
    F --> K{Perfil permitido?}
    K -->|Não| L[403 Forbidden]
    K -->|Sim| G
```

## 9. Estratégia de Backup

```mermaid
graph TD
    A[Database] --> B[Daily Backup]
    B --> C[SQLite File]
    C --> D[Compressed Archive]
    D --> E[Cloud Storage]
    
    F[File Uploads] --> G[Daily Sync]
    G --> H[Cloud Backup]
    
    I[Configuration] --> J[Version Control]
    J --> K[Git Repository]
    
    L[Recovery Process] --> M[Restore Database]
    M --> N[Restore Files]
    N --> O[Verify Integrity]
```

## 10. Monitoramento e Métricas

```mermaid
graph TB
    subgraph "Application Metrics"
        A[Response Time]
        B[Error Rate]
        C[Throughput]
        D[Memory Usage]
    end
    
    subgraph "Business Metrics"
        E[Payments Processed]
        F[Approval Time]
        G[User Activity]
        H[Report Generation]
    end
    
    subgraph "Security Metrics"
        I[Login Attempts]
        J[Unauthorized Access]
        K[File Uploads]
        L[Data Changes]
    end
    
    A --> M[Monitoring Dashboard]
    B --> M
    C --> M
    D --> M
    E --> M
    F --> M
    G --> M
    H --> M
    I --> M
    J --> M
    K --> M
    L --> M
```

## 11. Fluxo de Aprovação

```mermaid
stateDiagram-v2
    [*] --> Pendente
    Pendente --> EmAnalise : Renata visualiza
    EmAnalise --> Aprovado : Renata aprova
    EmAnalise --> Rejeitado : Renata rejeita
    EmAnalise --> Pendente : Retorna para análise
    Aprovado --> [*]
    Rejeitado --> [*]
    
    note right of Pendente
        Pagamento criado
        Status inicial
    end note
    
    note right of EmAnalise
        Renata analisa
        Pode solicitar ajustes
    end note
    
    note right of Aprovado
        Pagamento liberado
        Log registrado
    end note
    
    note right of Rejeitado
        Pagamento cancelado
        Motivo registrado
    end note
```

## 12. Estrutura de Arquivos

```
vida-mais-pagamentos/
├── client/                          # Frontend React
│   ├── public/
│   │   ├── index.html
│   │   └── favicon.ico
│   ├── src/
│   │   ├── components/              # Componentes reutilizáveis
│   │   │   ├── Auth/               # Autenticação
│   │   │   ├── Layout/             # Layout principal
│   │   │   ├── Dashboard/          # Dashboard
│   │   │   ├── Payments/           # Pagamentos
│   │   │   ├── Reports/            # Relatórios
│   │   │   └── Users/              # Gestão de usuários
│   │   ├── contexts/               # Contextos React
│   │   ├── services/               # Serviços de API
│   │   ├── utils/                  # Utilitários
│   │   ├── App.js                  # Componente principal
│   │   └── index.js                # Ponto de entrada
│   ├── package.json
│   └── README.md
├── server/                          # Backend Node.js
│   ├── database/                    # Banco de dados
│   │   ├── init.js                  # Inicialização
│   │   └── vida-mais.db            # Arquivo SQLite
│   ├── middleware/                  # Middleware
│   │   └── auth.js                  # Autenticação
│   ├── routes/                      # Rotas da API
│   │   ├── auth.js                  # Autenticação
│   │   ├── pagamentos.js            # Pagamentos
│   │   ├── usuarios.js              # Usuários
│   │   ├── relatorios.js            # Relatórios
│   │   └── upload.js                # Upload de arquivos
│   ├── uploads/                     # Arquivos enviados
│   ├── index.js                     # Servidor principal
│   ├── package.json
│   └── README.md
├── docs/                            # Documentação
│   ├── ARQUITETURA.md               # Este arquivo
│   ├── DIAGRAMAS.md                 # Diagramas
│   └── INSTALACAO.md                # Guia de instalação
├── .env.example                     # Variáveis de ambiente
├── .gitignore                       # Arquivos ignorados pelo Git
├── package.json                     # Configuração principal
└── README.md                        # Documentação principal
```
