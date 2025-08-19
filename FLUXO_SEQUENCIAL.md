# Fluxo Sequencial do Sistema - Vida Mais Pagamentos

## 1. Fluxo Completo de Autenticação e Navegação

```mermaid
sequenceDiagram
    participant U as Usuário
    participant B as Browser
    participant F as Frontend React
    participant S as Backend Server
    participant DB as SQLite Database
    participant FS as File System

    Note over U,FS: === INÍCIO DA SESSÃO ===
    U->>B: Acessa http://localhost:3000
    B->>F: Carrega React App
    F->>F: Verifica localStorage (token)
    
    alt Token existe e válido
        F->>S: GET /auth/verificar
        S->>S: Valida JWT
        S->>DB: Consulta usuário
        DB-->>S: Dados do usuário
        S-->>F: Usuário autenticado
        F->>F: Redireciona para Dashboard
    else Sem token ou inválido
        F->>F: Mostra tela de Login
        U->>F: Digita email e senha
        F->>S: POST /auth/login
        S->>DB: Verifica credenciais
        DB-->>S: Hash da senha
        S->>S: Compara com bcrypt
        S->>S: Gera JWT
        S-->>F: Token + dados do usuário
        F->>F: Armazena no localStorage
        F->>F: Redireciona para Dashboard
    end

    Note over U,FS: === NAVEGAÇÃO NO SISTEMA ===
    F->>F: Renderiza Layout com Sidebar
    F->>F: Mostra menu baseado no perfil
    
    alt Perfil: Ariela
        F->>F: Mostra: Dashboard, Pagamentos Fixos, Pagamentos Variáveis, Relatórios
    else Perfil: Estagiário
        F->>F: Mostra: Dashboard, Pagamentos Variáveis
    else Perfil: Sonia
        F->>F: Mostra: Dashboard, Solicitações de Pagamento
    else Perfil: Zé
        F->>F: Mostra: Dashboard, Relatórios, Downloads
    else Perfil: Renata
        F->>F: Mostra: Dashboard, Aprovações, Relatórios
    end
```

## 2. Fluxo de Criação de Pagamento Fixo

```mermaid
sequenceDiagram
    participant A as Ariela
    participant F as Frontend
    participant S as Backend
    participant DB as Database
    participant FS as File System

    Note over A,FS: === CRIAÇÃO DE PAGAMENTO FIXO ===
    A->>F: Clica em "Pagamentos Fixos"
    F->>F: Mostra lista de pagamentos fixos
    A->>F: Clica em "Novo Pagamento"
    F->>F: Abre formulário de pagamento fixo
    
    A->>F: Preenche: descrição, valor, tipo, projeto, fornecedor, dia vencimento
    F->>F: Validação frontend
    A->>F: Clica em "Salvar"
    
    F->>S: POST /pagamentos/fixos
    S->>S: Validação backend
    S->>S: Verifica perfil (deve ser ariela)
    S->>DB: INSERT INTO pagamentos_fixos
    DB-->>S: ID do pagamento criado
    S-->>F: Confirmação de criação
    
    F->>F: Mostra mensagem de sucesso
    F->>F: Redireciona para lista
    F->>F: Atualiza lista de pagamentos fixos
```

## 3. Fluxo de Criação de Pagamento Variável com Aprovação

```mermaid
sequenceDiagram
    participant A as Ariela/Estagiário
    participant F as Frontend
    participant S as Backend
    participant DB as Database
    participant R as Renata
    participant E as Email Service

    Note over A,E: === CRIAÇÃO DE PAGAMENTO VARIÁVEL ===
    A->>F: Clica em "Pagamentos Variáveis"
    F->>F: Mostra lista de pagamentos variáveis
    A->>F: Clica em "Novo Pagamento"
    F->>F: Abre formulário de pagamento variável
    
    A->>F: Preenche: descrição, valor, data, classificação, projeto, fornecedor
    A->>F: Anexa comprovante/NF
    F->>S: POST /upload/arquivo
    S->>FS: Salva arquivo
    FS-->>S: Caminho do arquivo
    S-->>F: Confirmação do upload
    
    A->>F: Clica em "Salvar"
    F->>S: POST /pagamentos/variaveis
    S->>S: Validação backend
    S->>S: Verifica perfil (ariela ou estagiario)
    S->>DB: INSERT INTO pagamentos_variaveis
    DB-->>S: ID do pagamento criado
    
    Note over A,E: === SISTEMA DE APROVAÇÃO ===
    S->>S: Verifica valor do pagamento
    
    alt Valor > Limite de Aprovação Automática
        S->>DB: Status = 'pendente'
        S->>E: Envia email para Renata
        E->>R: Notificação de aprovação necessária
        S-->>F: Pagamento criado - aguardando aprovação
        
        Note over R: Renata analisa o pagamento
        R->>F: Acessa sistema
        F->>S: GET /pagamentos/variaveis (filtro: pendentes)
        S->>DB: Consulta pagamentos pendentes
        DB-->>S: Lista de pagamentos
        S-->>F: Pagamentos pendentes
        
        R->>F: Clica em pagamento para aprovar
        F->>F: Mostra detalhes + botões aprovar/rejeitar
        R->>F: Clica em "Aprovar"
        F->>S: PUT /pagamentos/variaveis/{id}/status
        S->>S: Status = 'aprovado'
        S->>DB: UPDATE status + INSERT logs_aprovacao
        S->>E: Envia email para Ariela (aprovado)
        S-->>F: Confirmação de aprovação
        
    else Valor <= Limite de Aprovação Automática
        S->>DB: Status = 'aprovado'
        S->>DB: INSERT logs_aprovacao (aprovacao_automatica)
        S-->>F: Pagamento criado e aprovado automaticamente
    end
    
    F->>F: Mostra mensagem de sucesso
    F->>F: Redireciona para lista
    F->>F: Atualiza lista de pagamentos variáveis
```

## 4. Fluxo de Geração e Envio de Relatórios

```mermaid
sequenceDiagram
    participant Z as Zé
    participant F as Frontend
    participant S as Backend
    participant DB as Database
    participant XLS as Excel Generator
    participant E as Email Service
    participant S2 as Sonia

    Note over Z,S2: === GERAÇÃO DE RELATÓRIO MENSAL ===
    Z->>F: Clica em "Relatórios"
    F->>F: Mostra opções: Mensal, Anual
    Z->>F: Seleciona "Mensal"
    F->>F: Mostra seletor de mês/ano
    Z->>F: Seleciona mês/ano
    Z->>F: Clica em "Gerar Relatório"
    
    F->>S: GET /relatorios/excel-mensal?mes=12&ano=2025
    S->>S: Verifica perfil (deve ser ze)
    S->>DB: Consulta pagamentos do mês
    DB-->>S: Dados de pagamentos fixos e variáveis
    S->>S: Agrupa por classificação
    S->>S: Calcula totais
    S->>XLS: Gera arquivo Excel
    XLS-->>S: Buffer do arquivo Excel
    
    S-->>F: Arquivo Excel para download
    F->>F: Inicia download automático
    
    Note over Z,S2: === ENVIO AUTOMÁTICO POR EMAIL ===
    Z->>F: Clica em "Enviar por Email"
    F->>S: POST /relatorios/enviar-email
    S->>S: Verifica perfil (deve ser ze)
    S->>E: Envia email para Sonia
    E->>S2: Relatório mensal anexado
    S->>E: Envia email para Zé (cópia)
    E->>Z: Cópia do relatório enviado
    S-->>F: Confirmação de envio
    
    F->>F: Mostra mensagem "Relatório enviado com sucesso"
```

## 5. Fluxo de Upload e Gestão de Arquivos

```mermaid
sequenceDiagram
    participant U as Usuário
    participant F as Frontend
    participant S as Backend
    participant FS as File System
    participant DB as Database

    Note over U,DB: === UPLOAD DE ARQUIVO ===
    U->>F: Seleciona arquivo para upload
    F->>F: Valida tipo e tamanho
    F->>S: POST /upload/arquivo
    S->>S: Valida permissões
    S->>S: Verifica tipo de arquivo permitido
    S->>FS: Salva arquivo com nome único
    FS-->>S: Confirmação de salvamento
    S->>DB: INSERT INTO anexos
    DB-->>S: ID do anexo
    S-->>F: Confirmação de upload
    
    F->>F: Mostra arquivo na lista de anexos
    F->>F: Atualiza interface
    
    Note over U,DB: === DOWNLOAD DE ARQUIVO ===
    U->>F: Clica em arquivo para download
    F->>S: GET /upload/download/{filename}
    S->>S: Verifica permissões
    S->>FS: Lê arquivo
    FS-->>S: Conteúdo do arquivo
    S-->>F: Arquivo para download
    F->>F: Inicia download
    
    Note over U,DB: === EXCLUSÃO DE ARQUIVO ===
    U->>F: Clica em "Excluir" do arquivo
    F->>F: Confirma exclusão
    F->>S: DELETE /upload/anexos/{id}
    S->>S: Verifica permissões
    S->>DB: DELETE FROM anexos
    S->>FS: Remove arquivo físico
    FS-->>S: Confirmação de remoção
    S-->>F: Confirmação de exclusão
    
    F->>F: Remove arquivo da interface
    F->>F: Atualiza lista de anexos
```

## 6. Fluxo de Dashboard e Estatísticas

```mermaid
sequenceDiagram
    participant U as Usuário
    participant F as Frontend
    participant S as Backend
    participant DB as Database

    Note over U,DB: === CARREGAMENTO DO DASHBOARD ===
    U->>F: Acessa Dashboard
    F->>S: GET /usuarios/dashboard
    S->>S: Verifica autenticação
    S->>DB: Consulta estatísticas gerais
    DB-->>S: Total pagamentos fixos
    DB-->>S: Total pagamentos variáveis
    DB-->>S: Total aprovados/rejeitados
    DB-->>S: Valor total processado
    
    S->>DB: Consulta pagamentos recentes
    DB-->>S: Últimos 10 pagamentos variáveis
    
    S->>DB: Consulta evolução mensal
    DB-->>S: Valores por mês (últimos 12 meses)
    
    S-->>F: Dados do dashboard
    F->>F: Renderiza cards de estatísticas
    F->>F: Renderiza gráfico de evolução
    F->>F: Renderiza tabela de pagamentos recentes
    
    Note over U,DB: === ATUALIZAÇÃO EM TEMPO REAL ===
    F->>F: Inicia timer de atualização (5 min)
    F->>S: GET /usuarios/dashboard (atualização)
    S->>DB: Consulta dados atualizados
    DB-->>S: Dados mais recentes
    S-->>F: Dados atualizados
    F->>F: Atualiza interface sem recarregar
```

## 7. Fluxo de Gestão de Usuários e Projetos

```mermaid
sequenceDiagram
    participant A as Admin
    participant F as Frontend
    participant S as Backend
    participant DB as Database

    Note over A,DB: === CRIAÇÃO DE USUÁRIO ===
    A->>F: Acessa "Usuários"
    F->>F: Mostra lista de usuários
    A->>F: Clica em "Novo Usuário"
    F->>F: Abre formulário de usuário
    
    A->>F: Preenche: nome, email, perfil
    A->>F: Define senha inicial
    F->>S: POST /usuarios
    S->>S: Verifica perfil (deve ser admin)
    S->>S: Hash da senha com bcrypt
    S->>DB: INSERT INTO usuarios
    DB-->>S: ID do usuário criado
    S-->>F: Confirmação de criação
    
    F->>F: Mostra mensagem de sucesso
    F->>F: Redireciona para lista
    F->>F: Atualiza lista de usuários
    
    Note over A,DB: === CRIAÇÃO DE PROJETO ===
    A->>F: Acessa "Projetos"
    F->>F: Mostra lista de projetos
    A->>F: Clica em "Novo Projeto"
    F->>F: Abre formulário de projeto
    
    A->>F: Preenche: nome, descrição, orçamento anual
    A->>F: Clica em "Salvar"
    F->>S: POST /usuarios/projetos
    S->>S: Verifica perfil (deve ser admin)
    S->>DB: INSERT INTO projetos
    DB-->>S: ID do projeto criado
    S-->>F: Confirmação de criação
    
    F->>F: Mostra mensagem de sucesso
    F->>F: Redireciona para lista
    F->>F: Atualiza lista de projetos
```

## 8. Fluxo de Alteração de Senha

```mermaid
sequenceDiagram
    participant U as Usuário
    participant F as Frontend
    participant S as Backend
    participant DB as Database

    Note over U,DB: === ALTERAÇÃO DE SENHA ===
    U->>F: Clica no menu do usuário
    F->>F: Mostra opções: Perfil, Alterar Senha, Logout
    U->>F: Clica em "Alterar Senha"
    F->>F: Abre modal de alteração de senha
    
    U->>F: Digita senha atual
    U->>F: Digita nova senha
    U->>F: Confirma nova senha
    F->>F: Validação frontend (força da senha)
    U->>F: Clica em "Alterar"
    
    F->>S: PUT /auth/alterar-senha
    S->>S: Verifica autenticação
    S->>DB: Consulta usuário atual
    DB-->>S: Hash da senha atual
    S->>S: Compara senha atual com bcrypt
    
    alt Senha atual correta
        S->>S: Hash da nova senha com bcrypt
        S->>DB: UPDATE usuarios SET senha = nova_senha_hash
        DB-->>S: Confirmação de atualização
        S-->>F: Senha alterada com sucesso
        F->>F: Mostra mensagem de sucesso
        F->>F: Fecha modal
        F->>F: Redireciona para login
    else Senha atual incorreta
        S-->>F: Erro: senha atual incorreta
        F->>F: Mostra mensagem de erro
        F->>F: Mantém modal aberto
    end
```

## 9. Fluxo de Logout e Fim de Sessão

```mermaid
sequenceDiagram
    participant U as Usuário
    participant F as Frontend
    participant S as Backend
    participant LS as LocalStorage

    Note over U,LS: === LOGOUT DO SISTEMA ===
    U->>F: Clica no menu do usuário
    F->>F: Mostra opções: Perfil, Alterar Senha, Logout
    U->>F: Clica em "Logout"
    
    F->>F: Confirma logout
    F->>LS: Remove token JWT
    F->>LS: Remove dados do usuário
    F->>F: Limpa estado da aplicação
    F->>F: Redireciona para tela de login
    
    Note over U,LS: === EXPIRAÇÃO DE TOKEN ===
    F->>F: Timer verifica token a cada 5 minutos
    F->>S: GET /auth/verificar
    S->>S: Verifica JWT
    
    alt Token expirado
        S-->>F: 401 Unauthorized
        F->>LS: Remove token expirado
        F->>F: Mostra mensagem "Sessão expirada"
        F->>F: Redireciona para login
    else Token válido
        S-->>F: 200 OK
        F->>F: Mantém sessão ativa
    end
```

## 10. Fluxo de Notificações e Alertas

```mermaid
sequenceDiagram
    participant S as Sistema
    participant DB as Database
    participant E as Email Service
    participant R as Renata
    participant A as Ariela
    participant Z as Zé

    Note over S,Z: === NOTIFICAÇÕES AUTOMÁTICAS ===
    
    Note over S,Z: --- Vencimentos Próximos ---
    S->>S: Cron job diário (8h)
    S->>DB: Consulta pagamentos fixos vencendo em 3 dias
    DB-->>S: Lista de vencimentos próximos
    S->>E: Envia email para Ariela
    E->>A: Lista de vencimentos próximos
    
    Note over S,Z: --- Pagamentos Pendentes ---
    S->>S: Cron job diário (14h)
    S->>DB: Consulta pagamentos variáveis pendentes > 48h
    DB-->>S: Lista de pagamentos pendentes
    S->>E: Envia email para Renata
    E->>R: Lista de pagamentos pendentes
    
    Note over S,Z: --- Relatório Mensal Automático ---
    S->>S: Cron job mensal (1º dia, 9h)
    S->>DB: Gera relatório do mês anterior
    S->>E: Envia relatório para Sonia
    E->>S: Relatório mensal anexado
    S->>E: Envia relatório para Zé
    E->>Z: Relatório mensal anexado
    
    Note over S,Z: --- Alertas de Sistema ---
    S->>S: Monitoramento contínuo
    alt Erro crítico detectado
        S->>E: Envia alerta para admin
        E->>A: Alerta de sistema
    else Backup falhou
        S->>E: Envia alerta para admin
        E->>A: Alerta de backup
    end
```

## Resumo dos Fluxos Principais

### 🔐 **Autenticação e Sessão**
1. Usuário acessa sistema
2. Verificação de token existente
3. Login com credenciais
4. Geração e armazenamento de JWT
5. Navegação baseada em perfil

### 💰 **Gestão de Pagamentos**
1. Criação de pagamentos (fixos/variáveis)
2. Upload de comprovantes
3. Sistema de aprovação automática/manual
4. Notificações por email
5. Logs de auditoria

### 📊 **Relatórios e Exportação**
1. Geração de relatórios Excel
2. Envio automático por email
3. Download direto de arquivos
4. Estatísticas em tempo real

### 👥 **Gestão de Usuários**
1. Controle de perfis e permissões
2. Criação e edição de usuários
3. Alteração de senhas
4. Gestão de projetos

### 🔔 **Notificações e Alertas**
1. Vencimentos próximos
2. Pagamentos pendentes
3. Relatórios automáticos
4. Alertas de sistema

### 📁 **Gestão de Arquivos**
1. Upload de múltiplos tipos
2. Organização por pagamento
3. Download e exclusão
4. Controle de versões
