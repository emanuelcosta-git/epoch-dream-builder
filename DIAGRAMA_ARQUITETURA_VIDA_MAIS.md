# 🎨 **DIAGRAMAS DE ARQUITETURA - SISTEMA VIDA MAIS**

## 🏗️ **VISÃO GERAL DA ARQUITETURA**

Este documento contém diagramas visuais da arquitetura do Sistema Vida Mais, mostrando a integração entre **LOVABLE** (Frontend) e **Supabase** (Backend).

---

## 🔄 **DIAGRAMA 1: ARQUITETURA GERAL DO SISTEMA**

```mermaid
graph TB
    subgraph "🌐 FRONTEND - LOVABLE"
        A[📱 Interface Web Responsiva]
        B[🎨 Componentes Visuais]
        C[📊 Dashboard Executivo]
        D[📝 Formulários de Pagamento]
        E[📋 Tabelas de Dados]
    end
    
    subgraph "🔗 CAMADA DE INTEGRAÇÃO"
        F[🔌 Supabase Client]
        G[📧 Email Service]
        H[📁 File Upload Service]
        I[🔔 Notification Service]
    end
    
    subgraph "☁️ BACKEND - SUPABASE"
        J[🗄️ PostgreSQL Database]
        K[🔐 Authentication]
        L[📡 REST/GraphQL APIs]
        M[💾 Storage Buckets]
        N[⚡ Edge Functions]
    end
    
    subgraph "🔒 SEGURANÇA E COMPLIANCE"
        O[🛡️ Row Level Security]
        P[📝 Audit Logs]
        Q[🔐 MFA]
        R[🔒 SSL/TLS]
    end
    
    subgraph "📱 DISPOSITIVOS"
        S[📱 Mobile]
        T[💻 Desktop]
        U[📱 Tablet]
    end
    
    A --> F
    B --> F
    C --> F
    D --> F
    E --> F
    
    F --> L
    G --> N
    H --> M
    I --> N
    
    L --> J
    K --> J
    M --> J
    N --> J
    
    J --> O
    J --> P
    K --> Q
    L --> R
    
    S --> A
    T --> A
    U --> A
    
    style A fill:#e1f5fe
    style J fill:#f3e5f5
    style O fill:#fff3e0
    style S fill:#e8f5e8
    style T fill:#e8f5e8
    style U fill:#e8f5e8
```

---

## 🗄️ **DIAGRAMA 2: ESTRUTURA DO BANCO DE DADOS**

```mermaid
erDiagram
    USUARIOS {
        uuid id PK
        string email UK
        string nome
        string perfil
        boolean ativo
        timestamp created_at
        timestamp updated_at
    }
    
    PROJETOS {
        uuid id PK
        string nome
        text descricao
        decimal orcamento_anual
        boolean ativo
        timestamp created_at
        timestamp updated_at
    }
    
    PAGAMENTOS_FIXOS {
        uuid id PK
        text descricao
        decimal valor
        string tipo
        string mes_ano
        uuid projeto_id FK
        string status
        uuid aprovado_por FK
        timestamp data_aprovacao
        text observacoes
        timestamp created_at
        timestamp updated_at
    }
    
    PAGAMENTOS_VARIAVEIS {
        uuid id PK
        text descricao
        decimal valor
        string classificacao
        date data_pagamento
        string mes_ano
        uuid solicitante_id FK
        string status
        text observacoes
        timestamp created_at
        timestamp updated_at
    }
    
    ANEXOS {
        uuid id PK
        uuid pagamento_id FK
        string arquivo
        string tipo
        string url
        timestamp created_at
    }
    
    LOGS_APROVACAO {
        uuid id PK
        uuid pagamento_id FK
        uuid usuario_id FK
        string acao
        text justificativa
        timestamp timestamp
        string ip_address
    }
    
    CONFIGURACOES {
        uuid id PK
        string chave
        text valor
        text descricao
        timestamp created_at
        timestamp updated_at
    }
    
    USUARIOS ||--o{ PAGAMENTOS_FIXOS : "aprova"
    USUARIOS ||--o{ PAGAMENTOS_VARIAVEIS : "solicita"
    USUARIOS ||--o{ LOGS_APROVACAO : "executa"
    PROJETOS ||--o{ PAGAMENTOS_FIXOS : "contem"
    PAGAMENTOS_FIXOS ||--o{ ANEXOS : "possui"
    PAGAMENTOS_VARIAVEIS ||--o{ ANEXOS : "possui"
    PAGAMENTOS_FIXOS ||--o{ LOGS_APROVACAO : "registra"
    PAGAMENTOS_VARIAVEIS ||--o{ LOGS_APROVACAO : "registra"
```

---

## 🔄 **DIAGRAMA 3: FLUXO DE APROVAÇÃO DE PAGAMENTOS**

```mermaid
flowchart TD
    A[🚀 Ariela Cria Pagamento] --> B{💰 Valor > R$ 5.000?}
    
    B -->|❌ Não| C[✅ Aprovação Automática]
    B -->|✅ Sim| D[⏳ Aguarda Aprovação Renata]
    
    C --> E[📧 Email para Sonia e Zé]
    
    D --> F[📧 Sistema Envia Email para Renata]
    F --> G[📝 Renata Responde por Email]
    G --> H{🔍 Aprovou?}
    
    H -->|✅ Sim| I[✅ Pagamento Aprovado]
    H -->|❌ Não| J[❌ Pagamento Rejeitado]
    
    I --> E
    J --> K[📝 Aguarda Ajustes por Ariela]
    K --> L[🔄 Novo Ciclo de Aprovação]
    
    E --> M[📊 Relatório Final]
    M --> N[💾 Sistema de Logs]
    
    style A fill:#e1f5fe
    style B fill:#000000,color:#ffffff
    style C fill:#e8f5e8
    style D fill:#fff3e0
    style E fill:#f3e5f5
    style I fill:#e8f5e8
    style J fill:#ffebee
    style M fill:#f3e5f5
    style N fill:#f3e5f5
```

---

## 🔐 **DIAGRAMA 4: SISTEMA DE AUTENTICAÇÃO E AUTORIZAÇÃO**

```mermaid
graph TB
    subgraph "🔐 AUTENTICAÇÃO"
        A[👤 Usuário Acessa Sistema]
        B[📧 Login com Email/Senha]
        C[🔐 Supabase Auth]
        D[✅ Validação de Credenciais]
        E[🎫 Geração de JWT Token]
    end
    
    subgraph "🔒 AUTORIZAÇÃO"
        F[👮‍♀️ Verificação de Perfil]
        G{🔍 Qual o Perfil?}
        G -->|ariela| H[📝 Criar/Editar Pagamentos]
        G -->|estagiario| I[📝 Criar Pagamentos Variáveis]
        G -->|sonia| J[👀 Visualizar Relatórios]
        G -->|ze| K[📥 Baixar Relatórios]
        G -->|renata| L[✅ Aprovar/Rejeitar Pagamentos]
        G -->|admin| M[⚙️ Configurações do Sistema]
    end
    
    subgraph "🛡️ ROW LEVEL SECURITY"
        N[🔒 Políticas RLS]
        O[👤 Usuário só vê seus dados]
        P[🏗️ Projetos associados]
        Q[💰 Pagamentos do projeto]
    end
    
    A --> B
    B --> C
    C --> D
    D --> E
    E --> F
    F --> G
    
    H --> N
    I --> N
    J --> N
    K --> N
    L --> N
    M --> N
    
    N --> O
    N --> P
    N --> Q
    
    style A fill:#e1f5fe
    style C fill:#f3e5f5
    style E fill:#e8f5e8
    style N fill:#fff3e0
```

---

## 📱 **DIAGRAMA 5: ARQUITETURA RESPONSIVA E PWA**

```mermaid
graph TB
    subgraph "📱 DISPOSITIVOS"
        A[📱 Mobile < 768px]
        B[📱 Tablet 768-1024px]
        C[💻 Desktop > 1024px]
        D[🖥️ Large > 1440px]
    end
    
    subgraph "🎨 LOVABLE COMPONENTS"
        E[📊 Dashboard Cards]
        F[📝 Formulários]
        G[📋 Tabelas]
        H[📈 Gráficos]
    end
    
    subgraph "🔄 RESPONSIVIDADE"
        I[📱 Mobile-First Design]
        J[🔄 Breakpoints Adaptativos]
        K[📱 Menu Hambúrguer]
        L[📱 Scroll Horizontal]
    end
    
    subgraph "⚡ PWA FEATURES"
        M[📱 Instalação na Tela]
        N[🔄 Funcionalidade Offline]
        O[🔔 Push Notifications]
        P[🔄 Background Sync]
    end
    
    A --> I
    B --> I
    C --> I
    D --> I
    
    I --> J
    J --> K
    J --> L
    
    E --> J
    F --> J
    G --> J
    H --> J
    
    I --> M
    I --> N
    I --> O
    I --> P
    
    style A fill:#e8f5e8
    style B fill:#e8f5e8
    style C fill:#e8f5e8
    style D fill:#e8f5e8
    style I fill:#e1f5fe
    style M fill:#f3e5f5
```

---

## 🔄 **DIAGRAMA 6: FLUXO DE DADOS EM TEMPO REAL**

```mermaid
sequenceDiagram
    participant U as 👤 Usuário
    participant L as 🎨 LOVABLE Frontend
    participant S as ☁️ Supabase
    participant DB as 🗄️ PostgreSQL
    participant N as 📧 Email Service
    
    U->>L: 📝 Cria Pagamento
    L->>S: 🔄 POST /pagamentos
    S->>DB: 💾 Insere Dados
    DB-->>S: ✅ Confirmação
    S-->>L: ✅ Resposta
    
    alt Valor > R$ 5.000
        S->>N: 📧 Email para Renata
        N-->>S: ✅ Email Enviado
        S->>DB: 📝 Log de Ação
    else Valor <= R$ 5.000
        S->>DB: ✅ Aprovação Automática
        S->>N: 📧 Email para Sonia e Zé
        N-->>S: ✅ Email Enviado
    end
    
    S->>L: 🔄 Real-time Update
    L->>U: 📊 Dashboard Atualizado
    
    Note over S,DB: Row Level Security (RLS) aplicado
    Note over S,N: Edge Functions para emails
    Note over S,L: WebSocket para tempo real
```

---

## 🚀 **DIAGRAMA 7: PIPELINE DE DEPLOYMENT**

```mermaid
graph LR
    subgraph "📝 DESENVOLVIMENTO"
        A[💻 Código Local]
        B[🔧 LOVABLE Dev Server]
        C[🐳 Supabase Local]
    end
    
    subgraph "🔄 CI/CD"
        D[📤 Push para GitHub]
        E[🤖 GitHub Actions]
        F[🧪 Testes Automáticos]
        G[🏗️ Build de Produção]
    end
    
    subgraph "🌐 STAGING"
        H[📋 Supabase Staging]
        I[🎨 LOVABLE Staging]
        J[🧪 Testes de Integração]
    end
    
    subgraph "🚀 PRODUÇÃO"
        K[☁️ Supabase Cloud]
        L[🎨 LOVABLE Production]
        M[📊 Monitoring]
        N[📈 Analytics]
    end
    
    A --> B
    B --> C
    A --> D
    D --> E
    E --> F
    F --> G
    G --> H
    G --> I
    H --> J
    I --> J
    J --> K
    J --> L
    K --> M
    L --> N
    
    style A fill:#e1f5fe
    style E fill:#f3e5f5
    style K fill:#e8f5e8
    style L fill:#e8f5e8
```

---

## 💰 **DIAGRAMA 8: ESTRUTURA DE CUSTOS**

```mermaid
pie title Custo Mensal Estimado - Sistema Vida Mais
    "Supabase Pro" : 25
    "LOVABLE Licença" : 99
    "LOVABLE Hosting" : 29
    "LOVABLE Support" : 49
    "Storage & Bandwidth" : 15
    "Serviços Externos" : 20
```

---

## 📊 **DIAGRAMA 9: MÉTRICAS DE PERFORMANCE**

```mermaid
graph TB
    subgraph "📱 FRONTEND - LOVABLE"
        A[⚡ Core Web Vitals]
        B[📦 Bundle Size]
        C[⏱️ Load Time]
        D[❌ Error Rate]
    end
    
    subgraph "☁️ BACKEND - SUPABASE"
        E[🔍 Query Performance]
        F[🔗 Connection Pool]
        G[💾 Storage Usage]
        H[📡 API Latency]
    end
    
    subgraph "🎯 METAS"
        I[📊 LCP < 2.5s]
        J[📊 FID < 100ms]
        K[📊 CLS < 0.1]
        L[📊 API < 200ms]
    end
    
    A --> I
    B --> I
    C --> I
    D --> I
    
    E --> L
    F --> L
    G --> L
    H --> L
    
    style I fill:#e8f5e8
    style J fill:#e8f5e8
    style K fill:#e8f5e8
    style L fill:#e8f5e8
```

---

## 🔒 **DIAGRAMA 10: CAMADAS DE SEGURANÇA**

```mermaid
graph TB
    subgraph "🌐 CAMADA DE APLICAÇÃO"
        A[🔐 Autenticação JWT]
        B[🔒 Controle de Acesso]
        C[📝 Validação de Input]
    end
    
    subgraph "🗄️ CAMADA DE DADOS"
        D[🛡️ Row Level Security]
        E[🔒 Criptografia AES-256]
        F[📝 Logs de Auditoria]
    end
    
    subgraph "🌍 CAMADA DE REDE"
        G[🔒 HTTPS/TLS 1.3]
        H[🛡️ Rate Limiting]
        I[🔒 CORS Policies]
    end
    
    subgraph "☁️ CAMADA DE INFRAESTRUTURA"
        J[🔒 SSL Certificates]
        K[🛡️ DDoS Protection]
        L[🔒 Backup Criptografado]
    end
    
    A --> D
    B --> E
    C --> F
    
    D --> G
    E --> H
    F --> I
    
    G --> J
    H --> K
    I --> L
    
    style A fill:#e1f5fe
    style D fill:#f3e5f5
    style G fill:#fff3e0
    style J fill:#e8f5e8
```

---

## 🎯 **RESUMO DOS DIAGRAMAS**

### **1. Arquitetura Geral** - Visão macro do sistema
### **2. Estrutura do Banco** - Modelo de dados completo
### **3. Fluxo de Aprovação** - Processo de negócio principal
### **4. Autenticação** - Sistema de segurança e permissões
### **5. Responsividade** - Adaptação para diferentes dispositivos
### **6. Fluxo de Dados** - Comunicação em tempo real
### **7. Pipeline de Deploy** - Processo de desenvolvimento
### **8. Estrutura de Custos** - Análise financeira
### **9. Métricas de Performance** - Indicadores de qualidade
### **10. Camadas de Segurança** - Proteção em múltiplas camadas

---

## 🎨 **COMO USAR OS DIAGRAMAS**

1. **Copie o código Mermaid** de cada diagrama
2. **Cole em ferramentas que suportam Mermaid**:
   - GitHub (Markdown)
   - GitLab
   - Notion
   - Mermaid Live Editor
   - VS Code com extensão Mermaid

3. **Personalize cores e estilos** conforme necessário
4. **Exporte como imagem** para apresentações

---

**📋 Documento criado em: Janeiro de 2025**  
**🎨 Responsável: Diagramas de Arquitetura Vida Mais**  
**📧 Contato: architecture@vidamais.com**
