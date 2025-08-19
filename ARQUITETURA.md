# Arquitetura do Sistema de Controle de Pagamentos - Vida Mais

## Visão Geral da Arquitetura

O sistema segue uma arquitetura cliente-servidor com separação clara entre frontend e backend, utilizando padrões RESTful e autenticação baseada em JWT.

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │    Backend      │    │   Database      │
│   (React)       │◄──►│   (Node.js)     │◄──►│   (SQLite)      │
│                 │    │   (Express)     │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Material-UI   │    │   Middleware    │    │   Tabelas       │
│   Components    │    │   (Auth, CORS)  │    │   Relacionais   │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## Requisitos Funcionais

### RF01 - Gestão de Usuários e Autenticação
- **RF01.1**: Sistema de login com email e senha
- **RF01.2**: Controle de perfis de acesso (ariela, estagiario, sonia, ze, renata, admin)
- **RF01.3**: Alteração de senha pelo usuário
- **RF01.4**: Verificação de token JWT para sessões

### RF02 - Gestão de Pagamentos Fixos
- **RF02.1**: Cadastro de pagamentos fixos mensais (funcionários, aluguel, bolsas)
- **RF02.2**: Associação de pagamentos a projetos específicos
- **RF02.3**: Controle de vencimentos por dia do mês
- **RF02.4**: Anexo de notas fiscais e comprovantes
- **RF02.5**: Rateamento de salários entre projetos

### RF03 - Gestão de Pagamentos Variáveis
- **RF03.1**: Cadastro de pagamentos variáveis com data e valor
- **RF03.2**: Classificação por tipo de despesa
- **RF03.3**: Organização por mês e ano de referência
- **RF03.4**: Sistema de aprovação para valores altos
- **RF03.5**: Observações e justificativas

### RF04 - Sistema de Aprovações
- **RF04.1**: Aprovação automática para valores baixos
- **RF04.2**: Aprovação manual da Renata para valores altos
- **RF04.3**: Log de todas as aprovações e rejeições
- **RF04.4**: Notificações de status de aprovação

### RF05 - Relatórios e Exportação
- **RF05.1**: Relatórios mensais em Excel
- **RF05.2**: Relatórios anuais consolidados
- **RF05.3**: Exportação em formatos XLS e TXT
- **RF05.4**: Dashboard com estatísticas financeiras

### RF06 - Comunicação e Notificações
- **RF06.1**: Envio mensal de relatórios por email para Sonia e Zé
- **RF06.2**: Notificações de pagamentos pendentes
- **RF06.3**: Alertas de vencimentos próximos

### RF07 - Gestão de Arquivos
- **RF07.1**: Upload de múltiplos tipos de arquivo
- **RF07.2**: Download de anexos
- **RF07.3**: Organização de arquivos por pagamento
- **RF07.4**: Controle de versões de documentos

## Requisitos Não Funcionais

### RNF01 - Performance
- **RNF01.1**: Tempo de resposta da API < 2 segundos
- **RNF01.2**: Suporte a até 100 usuários simultâneos
- **RNF01.3**: Carregamento de dashboard < 3 segundos
- **RNF01.4**: Upload de arquivos até 10MB em < 30 segundos

### RNF02 - Segurança
- **RNF02.1**: Autenticação obrigatória para todas as operações
- **RNF02.2**: Senhas criptografadas com bcrypt (salt rounds: 12)
- **RNF02.3**: Tokens JWT com expiração de 24 horas
- **RNF02.4**: Controle de acesso baseado em perfis (RBAC)
- **RNF02.5**: Validação de entrada para prevenir SQL injection
- **RNF02.6**: Headers de segurança (Helmet, CORS configurado)

### RNF03 - Disponibilidade
- **RNF03.1**: Sistema disponível 99% do tempo (8.76 horas de downtime por ano)
- **RNF03.2**: Backup automático do banco de dados diário
- **RNF03.3**: Recuperação de falhas em < 15 minutos

### RNF04 - Usabilidade
- **RNF04.1**: Interface responsiva para desktop e tablet
- **RNF04.2**: Navegação intuitiva com máximo 3 cliques para operações principais
- **RNF04.3**: Feedback visual para todas as ações do usuário
- **RNF04.4**: Suporte a navegadores modernos (Chrome, Firefox, Safari, Edge)

### RNF05 - Escalabilidade
- **RNF05.1**: Arquitetura modular para fácil expansão
- **RNF05.2**: Suporte a múltiplos projetos simultâneos
- **RNF05.3**: Capacidade de processar até 10.000 pagamentos por mês
- **RNF05.4**: Sistema de cache para relatórios frequentes

### RNF06 - Manutenibilidade
- **RNF06.1**: Código documentado e seguindo padrões
- **RNF06.2**: Logs estruturados para auditoria
- **RNF06.3**: Testes automatizados para funcionalidades críticas
- **RNF06.4**: Versionamento semântico de releases

### RNF07 - Compatibilidade
- **RNF07.1**: Suporte a Windows 10+, macOS 10.15+, Linux Ubuntu 18.04+
- **RNF07.2**: Node.js versão 16+ e npm 8+
- **RNF07.3**: SQLite 3.x para persistência de dados
- **RNF07.4**: Compatibilidade com sistemas de email corporativos

## Arquitetura de Dados

### Modelo Entidade-Relacionamento

```
┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│  USUARIOS   │    │  PROJETOS   │    │PAGAMENTOS_ │
│             │    │             │    │   FIXOS    │
│ id (PK)     │    │ id (PK)     │    │             │
│ nome        │    │ nome        │    │ id (PK)     │
│ email       │    │ descricao   │    │ descricao   │
│ senha       │    │ orcamento   │    │ valor       │
│ perfil      │    │ ativo       │    │ tipo        │
│ ativo       │    └─────────────┘    │ projeto_id  │
└─────────────┘            │          │ vencimento  │
         │                 │          └─────────────┘
         │                 │                  │
         │                 │                  │
         │                 │                  ▼
         │                 │          ┌─────────────┐
         │                 │          │  ANEXOS     │
         │                 │          │             │
         │                 │          │ id (PK)     │
         │                 │          │ nome_arquivo│
         │                 │          │ caminho     │
         │                 │          │ pagamento_id│
         │                 │          └─────────────┘
         │                 │
         ▼                 ▼
┌─────────────┐    ┌─────────────┐
│PAGAMENTOS_  │    │LOGS_       │
│ VARIAVEIS   │    │APROVACAO   │
│             │    │             │
│ id (PK)     │    │ id (PK)     │
│ descricao   │    │ pagamento_id│
│ valor       │    │ status      │
│ data_pag    │    │ aprovado_por│
│ classificacao│   │ data_aprov  │
│ projeto_id  │    │ observacoes │
│ status      │    └─────────────┘
│ criado_por  │
└─────────────┘
```

## Padrões de Arquitetura

### 1. Padrão MVC (Model-View-Controller)
- **Model**: Lógica de negócio e acesso a dados
- **View**: Interface React com Material-UI
- **Controller**: Rotas Express.js e middleware

### 2. Padrão Repository
- Separação entre lógica de negócio e acesso a dados
- Facilita testes e manutenção

### 3. Padrão Middleware
- Autenticação e autorização centralizadas
- Validação de entrada
- Logging e monitoramento

### 4. Padrão Factory
- Criação de objetos de pagamento
- Geração de relatórios

## Tecnologias e Ferramentas

### Frontend
- **React 18**: Biblioteca para interfaces de usuário
- **Material-UI**: Componentes de design system
- **React Router**: Navegação entre páginas
- **Axios**: Cliente HTTP para APIs
- **Recharts**: Gráficos e visualizações

### Backend
- **Node.js**: Runtime JavaScript
- **Express.js**: Framework web
- **SQLite3**: Banco de dados relacional
- **JWT**: Autenticação stateless
- **Multer**: Upload de arquivos
- **Nodemailer**: Envio de emails
- **XLSX**: Geração de relatórios Excel

### DevOps e Qualidade
- **Git**: Controle de versão
- **npm**: Gerenciamento de dependências
- **ESLint**: Análise estática de código
- **Prettier**: Formatação de código

## Fluxo de Dados

### 1. Autenticação
```
Usuário → Login → Validação → Geração JWT → Acesso ao Sistema
```

### 2. Criação de Pagamento
```
Formulário → Validação → Persistência → Notificação → Aprovação
```

### 3. Geração de Relatório
```
Solicitação → Consulta BD → Processamento → Geração Excel → Download/Email
```

## Considerações de Segurança

### 1. Autenticação
- Senhas hasheadas com bcrypt
- Tokens JWT com expiração
- Refresh tokens para sessões longas

### 2. Autorização
- Controle de acesso baseado em perfis
- Validação de permissões em cada endpoint
- Auditoria de ações sensíveis

### 3. Validação
- Sanitização de entrada
- Prevenção de SQL injection
- Validação de tipos de arquivo

## Métricas e Monitoramento

### 1. Performance
- Tempo de resposta das APIs
- Uso de memória e CPU
- Tempo de carregamento das páginas

### 2. Negócio
- Número de pagamentos processados
- Tempo médio de aprovação
- Taxa de rejeição de pagamentos

### 3. Segurança
- Tentativas de login falhadas
- Acessos não autorizados
- Alterações em dados sensíveis

## Roadmap de Evolução

### Fase 1 (Atual)
- Sistema básico de pagamentos
- Autenticação e autorização
- Relatórios básicos

### Fase 2 (Próximos 3 meses)
- Integração com sistemas bancários
- Workflow de aprovação avançado
- Dashboard analítico

### Fase 3 (Próximos 6 meses)
- API pública para integrações
- Sistema de notificações push
- Relatórios em tempo real

### Fase 4 (Próximos 12 meses)
- Machine learning para detecção de fraudes
- Integração com sistemas ERP
- Aplicativo mobile nativo
