# Imagens e Diagramas Visuais - Sistema Vida Mais

## 🎨 **Visão Geral do Sistema - Diagrama de Arquitetura**

```mermaid
graph TB
    subgraph "🌐 Frontend (React + Material-UI)"
        A[📱 Interface do Usuário]
        B[🔐 Autenticação]
        C[📊 Dashboard]
        D[💰 Gestão de Pagamentos]
        E[📁 Upload de Arquivos]
        F[📈 Relatórios]
    end
    
    subgraph "⚙️ Backend (Node.js + Express)"
        G[🛡️ Middleware de Segurança]
        H[🔑 Autenticação JWT]
        I[📋 Validação de Dados]
        J[📧 Serviço de Email]
        K[📊 Geração de Relatórios]
        L[💾 Persistência de Dados]
    end
    
    subgraph "🗄️ Banco de Dados (SQLite)"
        M[👥 Usuários]
        N[📁 Projetos]
        O[💳 Pagamentos Fixos]
        P[💸 Pagamentos Variáveis]
        Q[📎 Anexos]
        R[📝 Logs de Aprovação]
    end
    
    subgraph "☁️ Serviços Externos"
        S[📧 Email (Gmail/SMTP)]
        T[💾 Backup Cloud]
        U[📱 Notificações]
    end
    
    A --> G
    B --> H
    C --> L
    D --> I
    E --> L
    F --> K
    
    G --> M
    H --> M
    I --> N
    J --> S
    K --> P
    L --> Q
    
    K --> S
    L --> T
    H --> U
```

## 🔐 **Fluxo de Login - Diagrama Visual**

```mermaid
flowchart TD
    A[🚪 Usuário Acessa Sistema] --> B{🔍 Token Existe?}
    
    B -->|✅ Sim| C[🔐 Verifica JWT]
    B -->|❌ Não| D[📝 Tela de Login]
    
    C --> E{🔑 Token Válido?}
    E -->|✅ Sim| F[🏠 Dashboard]
    E -->|❌ Não| D
    
    D --> G[📧 Digita Email]
    G --> H[🔒 Digita Senha]
    H --> I[🚀 Clica em Login]
    
    I --> J[⚙️ Validação Backend]
    J --> K{🔍 Credenciais Corretas?}
    
    K -->|✅ Sim| L[🎫 Gera JWT]
    K -->|❌ Não| M[❌ Erro de Login]
    
    L --> N[💾 Armazena Token]
    N --> F
    
    M --> D
    
    style A fill:#e1f5fe
    style F fill:#c8e6c9
    style M fill:#ffcdd2
```

## 💰 **Fluxo de Pagamentos - Workflow Visual**

```mermaid
flowchart LR
    subgraph "📝 Criação"
        A[✍️ Preenche Formulário]
        B[📎 Anexa Comprovante]
        C[💾 Salva Dados]
    end
    
    subgraph "🔍 Validação"
        D[✅ Validação Frontend]
        E[🛡️ Validação Backend]
        F[👤 Verifica Perfil]
    end
    
    subgraph "💳 Aprovação"
        G{💰 Valor > Limite?}
        H[✅ Aprovação Automática]
        I[⏳ Aguarda Aprovação]
        J[👩‍💼 Renata Analisa]
    end
    
    subgraph "📊 Finalização"
        K[📈 Atualiza Dashboard]
        L[📧 Envia Notificações]
        M[📝 Registra Logs]
    end
    
    A --> B --> C
    C --> D --> E --> F
    F --> G
    G -->|❌ Não| H
    G -->|✅ Sim| I
    I --> J
    H --> K
    J --> K
    K --> L --> M
    
    style A fill:#e3f2fd
    style H fill:#c8e6c9
    style I fill:#fff3e0
    style K fill:#e8f5e8
```

## 📊 **Dashboard - Layout Visual**

```mermaid
graph TB
    subgraph "🎯 Cabeçalho"
        A[🏢 Vida Mais - Sistema de Pagamentos]
        B[👤 Menu do Usuário]
        C[🔔 Notificações]
    end
    
    subgraph "📱 Sidebar de Navegação"
        D[🏠 Dashboard]
        E[💳 Pagamentos Fixos]
        F[💸 Pagamentos Variáveis]
        G[📊 Relatórios]
        H[👥 Usuários]
        I[⚙️ Configurações]
    end
    
    subgraph "📊 Área Principal - Dashboard"
        J[💰 Total de Pagamentos]
        K[📈 Gráfico de Evolução]
        L[📋 Pagamentos Recentes]
        M[🚨 Alertas e Notificações]
    end
    
    subgraph "📊 Cards de Estatísticas"
        N[💵 R$ 125.000,00<br/>Total Processado]
        O[📅 45<br/>Pagamentos este Mês]
        P[⏳ 12<br/>Pendentes de Aprovação]
        Q[✅ 89%<br/>Taxa de Aprovação]
    end
    
    A --> B --> C
    D --> E --> F --> G --> H --> I
    J --> K --> L --> M
    N --> O --> P --> Q
    
    style A fill:#1976d2,color:#fff
    style D fill:#4caf50,color:#fff
    style J fill:#ff9800,color:#fff
    style N fill:#2196f3,color:#fff
    style O fill:#4caf50,color:#fff
    style P fill:#ff9800,color:#fff
    style Q fill:#9c27b0,color:#fff
```

## 🔄 **Sistema de Aprovação - Fluxograma**

```mermaid
flowchart TD
    A[📝 Pagamento Criado] --> B{💰 Valor > R$ 5.000?}
    
    B -->|❌ Não| C[✅ Aprovação Automática]
    B -->|✅ Sim| D[⏳ Status: Pendente]
    
    C --> E[📧 Email para Ariela]
    C --> F[📝 Log: Aprovação Automática]
    
    D --> G[📧 Email para Renata]
    G --> H[👩‍💼 Renata Analisa]
    
    H --> I{🔍 Aprova?}
    I -->|✅ Sim| J[✅ Status: Aprovado]
    I -->|❌ Não| K[❌ Status: Rejeitado]
    I -->|🤔 Dúvida| L[📝 Solicita Mais Informações]
    
    J --> M[📧 Email para Ariela]
    J --> N[📝 Log: Aprovado por Renata]
    
    K --> O[📧 Email para Ariela]
    K --> P[📝 Log: Rejeitado por Renata]
    
    L --> H
    
    E --> Q[🏁 Processo Finalizado]
    F --> Q
    M --> Q
    N --> Q
    O --> Q
    P --> Q
    
    style A fill:#e3f2fd
    style C fill:#c8e6c9
    style D fill:#fff3e0
    style J fill:#c8e6c9
    style K fill:#ffcdd2
    style Q fill:#e8f5e8
```

## 📁 **Gestão de Arquivos - Diagrama de Upload**

```mermaid
sequenceDiagram
    participant U as 👤 Usuário
    participant F as 🖥️ Frontend
    participant S as ⚙️ Servidor
    participant DB as 🗄️ Banco
    participant FS as 💾 Sistema de Arquivos

    Note over U,FS: 📤 PROCESSO DE UPLOAD
    
    U->>F: 🖱️ Clica em "Selecionar Arquivo"
    F->>F: 🔍 Valida tipo e tamanho
    F->>F: 📏 Verifica limite (10MB)
    
    alt ✅ Arquivo Válido
        F->>S: 📤 POST /upload/arquivo
        S->>S: 🛡️ Verifica permissões
        S->>S: 🔒 Valida tipo permitido
        S->>FS: 💾 Salva com nome único
        FS-->>S: ✅ Confirma salvamento
        S->>DB: 💾 INSERT INTO anexos
        DB-->>S: 🆔 ID do anexo
        S-->>F: ✅ Upload realizado
        F->>F: 🎉 Mostra sucesso
        F->>F: 📋 Atualiza lista
    else ❌ Arquivo Inválido
        F->>F: ❌ Mostra erro
        F->>F: 🔄 Permite nova seleção
    end
    
    Note over U,FS: 📥 PROCESSO DE DOWNLOAD
    
    U->>F: 🖱️ Clica em arquivo
    F->>S: 📥 GET /upload/download/{filename}
    S->>S: 🛡️ Verifica permissões
    S->>FS: 📖 Lê arquivo
    FS-->>S: 📄 Conteúdo do arquivo
    S-->>F: 📥 Arquivo para download
    F->>F: 💾 Inicia download
```

## 📊 **Geração de Relatórios - Workflow Visual**

```mermaid
flowchart TD
    A[👨‍💼 Zé Acessa Relatórios] --> B{📊 Que Tipo?}
    
    B -->|📅 Mensal| C[📅 Seleciona Mês/Ano]
    B -->|📆 Anual| D[📆 Seleciona Ano]
    
    C --> E[🚀 Clica "Gerar Relatório"]
    D --> E
    
    E --> F[⚙️ Backend Processa]
    F --> G[🗄️ Consulta Banco de Dados]
    G --> H[📊 Agrupa por Classificação]
    H --> I[🧮 Calcula Totais]
    
    I --> J{📧 Enviar por Email?}
    J -->|✅ Sim| K[📧 Envia para Sonia]
    J -->|✅ Sim| L[📧 Envia para Zé]
    J -->|❌ Não| M[💾 Download Direto]
    
    K --> N[📝 Log de Envio]
    L --> N
    M --> O[📁 Arquivo Disponível]
    
    N --> P[🎉 Relatório Enviado]
    O --> P
    
    style A fill:#e3f2fd
    style E fill:#ff9800,color:#fff
    style K fill:#4caf50,color:#fff
    style L fill:#4caf50,color:#fff
    style M fill:#2196f3,color:#fff
    style P fill:#c8e6c9
```

## 🔔 **Sistema de Notificações - Timeline Visual**

```mermaid
gantt
    title 📅 Cronograma de Notificações Automáticas
    dateFormat  HH:mm
    axisFormat %H:%M
    
    section 🌅 Manhã (8h)
    Vencimentos Próximos    :08:00, 08:05
    Backup Diário          :08:30, 09:00
    
    section 🌞 Tarde (14h)
    Pagamentos Pendentes   :14:00, 14:05
    Verificação de Sistema :14:30, 15:00
    
    section 🌙 Noite (20h)
    Logs de Auditoria      :20:00, 20:10
    Limpeza de Arquivos    :20:30, 21:00
    
    section 📅 Mensal (1º dia)
    Relatório Mensal       :09:00, 10:00
    Backup Mensal          :10:30, 12:00
```

## 🎨 **Interface do Usuário - Mockup Visual**

```mermaid
graph TB
    subgraph "🖥️ Tela Principal"
        A[🏢 Header: Vida Mais]
        B[👤 Ariela Silva | Logout]
    end
    
    subgraph "📱 Menu Lateral"
        C[🏠 Dashboard]
        D[💳 Pagamentos Fixos]
        E[💸 Pagamentos Variáveis]
        F[📊 Relatórios]
        G[👥 Usuários]
    end
    
    subgraph "📊 Área de Conteúdo"
        H[💰 Total: R$ 125.000,00]
        I[📈 Gráfico de Barras]
        J[📋 Tabela de Pagamentos]
        K[🚨 3 Pagamentos Pendentes]
    end
    
    subgraph "🔔 Notificações"
        L[📧 2 emails não lidos]
        M[⏰ 5 vencimentos próximos]
        N[✅ 12 aprovados hoje]
    end
    
    A --> B
    C --> D --> E --> F --> G
    H --> I --> J --> K
    L --> M --> N
    
    style A fill:#1976d2,color:#fff
    style C fill:#4caf50,color:#fff
    style H fill:#ff9800,color:#fff
    style L fill:#f44336,color:#fff
```

## 🚀 **Fluxo de Desenvolvimento - Pipeline Visual**

```mermaid
flowchart LR
    subgraph "💻 Desenvolvimento"
        A[📝 Código]
        B[🧪 Testes]
        C[🔍 Code Review]
    end
    
    subgraph "🚀 Deploy"
        D[📦 Build]
        E[🚀 Deploy Staging]
        F[✅ Testes Staging]
        G[🚀 Deploy Produção]
    end
    
    subgraph "📊 Monitoramento"
        H[👀 Logs]
        I[📈 Métricas]
        J[🚨 Alertas]
        K[📊 Dashboard]
    end
    
    A --> B --> C
    C --> D --> E --> F --> G
    G --> H --> I --> J --> K
    
    style A fill:#e3f2fd
    style C fill:#fff3e0
    style G fill:#c8e6c9
    style K fill:#e8f5e8
```

## 🎯 **Resumo Visual dos Fluxos**

### 🔐 **Autenticação**
```
👤 Usuário → 🌐 Sistema → 🔑 JWT → 🏠 Dashboard
```

### 💰 **Pagamentos**
```
📝 Formulário → ✅ Validação → 💳 Aprovação → 📊 Registro
```

### 📊 **Relatórios**
```
📅 Seleção → 🗄️ Consulta → 📊 Processamento → 📧 Envio/💾 Download
```

### 🔔 **Notificações**
```
⏰ Cron Job → 📧 Email → 👤 Destinatário → 📝 Log
```

### 📁 **Arquivos**
```
📤 Upload → 💾 Armazenamento → 📥 Download → 🗑️ Exclusão
```

## 🎨 **Paleta de Cores do Sistema**

```mermaid
graph LR
    A[🔵 Azul Primário<br/>#1976d2] --> B[🔷 Azul Secundário<br/>#2196f3]
    C[🟢 Verde Sucesso<br/>#4caf50] --> D[🟡 Amarelo Aviso<br/>#ff9800]
    E[🔴 Vermelho Erro<br/>#f44336] --> F[🟣 Roxo Info<br/>#9c27b0]
    G[⚪ Branco Fundo<br/>#ffffff] --> H[⚫ Texto<br/>#212121]
    
    style A fill:#1976d2,color:#fff
    style B fill:#2196f3,color:#fff
    style C fill:#4caf50,color:#fff
    style D fill:#ff9800,color:#fff
    style E fill:#f44336,color:#fff
    style F fill:#9c27b0,color:#fff
    style G fill:#ffffff,color:#000
    style H fill:#212121,color:#fff
```

## 📱 **Responsividade - Breakpoints Visuais**

```mermaid
graph TB
    subgraph "💻 Desktop (1200px+)"
        A[📊 Dashboard Completo]
        B[📱 Sidebar Visível]
        C[📋 Tabelas Expandidas]
    end
    
    subgraph "📱 Tablet (768px-1199px)"
        D[📊 Dashboard Adaptado]
        E[📱 Sidebar Colapsável]
        F[📋 Tabelas Responsivas]
    end
    
    subgraph "📱 Mobile (< 768px)"
        G[📊 Dashboard Stack]
        H[📱 Menu Hambúrguer]
        I[📋 Tabelas Scroll]
    end
    
    A --> D --> G
    B --> E --> H
    C --> F --> I
    
    style A fill:#e3f2fd
    style D fill:#fff3e0
    style G fill:#ffcdd2
```

## 🎉 **Conclusão Visual**

O sistema Vida Mais é uma **solução completa e integrada** que oferece:

- 🔐 **Segurança robusta** com JWT e RBAC
- 💰 **Gestão eficiente** de pagamentos fixos e variáveis
- 📊 **Relatórios automáticos** com Excel e email
- 📁 **Gestão de arquivos** com upload/download
- 🔔 **Notificações inteligentes** baseadas em cron jobs
- 📱 **Interface responsiva** para todos os dispositivos
- 🚀 **Arquitetura escalável** para crescimento futuro

**🎯 Resultado**: Sistema profissional que atende todas as necessidades da Vida Mais com **usabilidade**, **segurança** e **eficiência**! 🚀
