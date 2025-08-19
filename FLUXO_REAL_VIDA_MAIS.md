# 🎯 **Sistema Vida Mais - Como Funciona**

## 📅 **Contexto**
**Reunião**: 7 de agosto de 2025  
**Participantes**: Aldemar, Nathalia, Emanuel e Ariela  
**Prazo**: Semana de 22/08

---

## 🚀 **1. Pagamentos Fixos - Fluxo Principal**

### **O que é:**
- **Funcionários**: Salários mensais
- **Aluguel**: Escritório e depósito  
- **Bolsas**: Benefícios educacionais
- **Reembolsos**: Lanches, transporte (valores baixos)

### **Como Funciona:**
```mermaid
flowchart TD
    A[Ariela atualiza planilha] --> B{Valor > R$ 5.000?}
    B -->|Nao| C[Aprovacao Automatica]
    B -->|Sim| D[Aguarda Renata]
    C --> E[Email para Sonia e Ze]
    D --> F[Email para Renata]
    F --> G[Renata responde por email]
    G --> H{Aprovou?}
    H -->|Sim| I[Aprovado]
    H -->|Nao| J[Rejeitado]
    I --> E
    J --> K[Aguarda ajustes]
    
    style A fill:#e3f2fd
    style C fill:#c8e6c9
    style D fill:#fff3e0
    style I fill:#c8e6c9
    style J fill:#ffcdd2
```

---

## 🔄 **2. Gastos Variáveis - Google Drive**

### **O que é:**
- Gastos que mudam todo mês
- Alimentação, transporte, material, manutenção

### **Como Funciona:**
```mermaid
flowchart LR
    subgraph "Tabela Google Drive"
        A[Mes/Ano]
        B[Classificacao]
        C[Valor]
        D[Observacoes]
    end
    
    subgraph "Ariela"
        E[Acessa conta Vida Mais]
        F[Pega comprovantes]
        G[Atualiza tabela]
    end
    
    subgraph "Ze"
        H[Analisa dados]
        I[Gera relatorio]
        J[Envia para todos]
    end
    
    A --> E
    B --> E
    C --> E
    D --> E
    E --> F --> G
    G --> H --> I --> J
    
    style A fill:#e3f2fd
    style E fill:#c8e6c9
    style H fill:#ff9800,color:#fff
```

---

## 👥 **3. Níveis de Acesso**

```mermaid
graph TB
    subgraph "ARIELA (Admin)"
        A[Pagamentos Fixos]
        B[Anexar NFs]
        C[Controle total]
    end
    
    subgraph "ESTAGIARIO"
        E[Pagamentos Variaveis]
        F[Comprovantes]
    end
    
    subgraph "SONIA"
        I[Ver pedidos]
        J[Receber relatorios]
    end
    
    subgraph "ZE"
        M[Ver dados]
        N[Baixar XLS/TXT]
        O[Relatorios]
    end
    
    subgraph "RENATA"
        Q[Aprovar valores altos]
        R[Responder por email]
    end
    
    style A fill:#e3f2fd
    style E fill:#fff3e0
    style I fill:#c8e6c9
    style M fill:#ff9800,color:#fff
    style Q fill:#f44336,color:#fff
```

---

## 📧 **4. Comunicação por Email**

### **📅 Relatórios Automáticos:**
- **Dia 15**: Pagamentos fixos → Sonia e Zé
- **Dia 30**: Gastos variáveis → Todos

### **💰 Aprovações:**
- Sistema identifica pagamentos > R$ 5.000
- Envia email para Renata
- Renata responde por email
- Sistema confirma para Ariela

---

## 📅 **5. Cronograma Mensal**

```mermaid
gantt
    title Cronograma Mensal
    dateFormat  DD/MM
    
    section Pagamentos Fixos
    Coleta de Dados        :01/08, 05/08
    Aprovacao Renata       :08/08, 12/08
    Relatorio              :15/08, 16/08
    
    section Gastos Variaveis
    Atualizacao Tabela     :01/08, 31/08
    Informar Ze            :25/08, 28/08
    Relatorio Final        :28/08, 31/08
```

---

## 🔄 **6. Exemplos Práticos**

### **Cenário 1: Salário R$ 4.000**
```mermaid
sequenceDiagram
    participant A as Ariela
    participant S as Sistema
    participant S2 as Sonia
    participant Z as Ze

    A->>S: Cria pagamento R$ 4.000
    S->>S: R$ 4.000 > R$ 5.000? Nao
    S->>S: Aprovacao automatica
    S->>S2: Email automatico
    S->>Z: Email automatico
    S-->>A: Confirmado!
```

### **Cenário 2: Aluguel R$ 6.000**
```mermaid
sequenceDiagram
    participant A as Ariela
    participant S as Sistema
    participant R as Renata
    participant S2 as Sonia
    participant Z as Ze

    A->>S: Cria pagamento R$ 6.000
    S->>S: R$ 6.000 > R$ 5.000? Sim
    S->>R: Precisa aprovar
    R->>S: Aprovado
    S->>A: Confirmado!
    S->>S2: Email
    S->>Z: Email
```

---

## 🎯 **7. Resumo - Como Funciona**

### **📅 Todo Mês (Pagamentos Fixos):**
1. **Ariela** coloca na planilha
2. **Sistema** identifica aprovações
3. **Renata** responde por email
4. **Sistema** envia relatório

### **📊 Durante o Mês (Variáveis):**
1. **Ariela/Estagiário** atualiza tabela
2. **Ariela** pega comprovantes
3. **Zé** gera relatório
4. **Sistema** envia para todos

### **🔐 Acesso:**
- **Ariela**: Tudo
- **Estagiário**: Só variáveis
- **Sonia**: Ver + relatórios
- **Zé**: Ver + baixar + relatórios
- **Renata**: Aprovar valores altos

---

## 🎉 **Conclusão**

✅ **Pagamentos Fixos**: Planilha Excel + Renata por email + relatório mensal  
✅ **Gastos Variáveis**: Google Drive + comprovantes + Zé faz relatório  
✅ **Aprovações**: Renata responde por email  
✅ **Relatórios**: Automáticos mensais + manuais por Zé  
✅ **Acesso**: Cada um faz o que precisa  
✅ **Comunicação**: Email para tudo (como hoje)  

**🎯 Resultado**: Sistema que digitaliza o que já funciona, sem complicar!

---

## ❓ **Perguntas Frequentes**

**Q: Renata precisa entrar no sistema?**  
A: Não! Só responde por email.

**Q: Como fica a planilha Excel?**  
A: Continua igual! Sistema só organiza melhor.

**Q: E se Renata não responder?**  
A: Sistema envia lembretes automáticos.

**Q: Posso continuar usando Google Drive?**  
A: Sim! Sistema integra com o que já usa.
