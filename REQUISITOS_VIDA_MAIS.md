# 📋 **REQUISITOS DO PROJETO VIDA MAIS**

## 📅 **Informações do Projeto**
- **Data de Resposta**: Semana do dia 22/08
- **Reunião**: Terceira semana de agosto de 2025
- **Participantes**: Aldemar, Nathalia, Emanuel e Ariela (vida+)
- **Data da Reunião**: Quinta-feira, 7 de agosto de 2025

---

## 1. 🎯 **VISÃO GERAL DO SISTEMA**

### **Descrição**
Sistema web para gestão completa de pagamentos da organização Vida Mais, incluindo controle de pagamentos fixos mensais, gastos variáveis, aprovações, relatórios e comunicação por email.

### **Escopo**
- Gestão de pagamentos fixos (funcionários, aluguel, bolsas de estudo)
- Controle de pagamentos variáveis (gastos operacionais)
- Sistema de aprovação para valores altos
- Geração de relatórios Excel e envio por email
- Gestão de usuários com diferentes níveis de acesso
- Controle de projetos e orçamentos

---

## 2. 🚀 **OBJETIVOS DO PROJETO**

### **Objetivo Principal**
Automatizar e centralizar o controle de pagamentos da Vida Mais, substituindo planilhas manuais e melhorando a eficiência operacional.

### **Objetivos Específicos**
- **O1**: Centralizar controle de pagamentos fixos mensais
- **O2**: Implementar sistema de aprovação para valores altos
- **O3**: Automatizar envio de relatórios mensais por email
- **O4**: Controlar gastos variáveis com classificações
- **O5**: Facilitar geração de relatórios para gestão
- **O6**: Implementar controle de acesso por perfil de usuário
- **O7**: Suportar rateio de salários entre projetos

---

## 3. ✅ **REQUISITOS FUNCIONAIS (RF)**

### **3.1 Gestão de Usuários e Acesso**
- **RF01**: O sistema deve permitir cadastro de usuários com perfis específicos
- **RF02**: O sistema deve controlar acesso baseado no perfil do usuário
- **RF03**: O sistema deve permitir alteração de senha pelo usuário
- **RF04**: O sistema deve manter histórico de atividades dos usuários

### **3.2 Gestão de Projetos**
- **RF05**: O sistema deve permitir cadastro de projetos
- **RF06**: O sistema deve controlar orçamento anual por projeto
- **RF07**: O sistema deve permitir rateio de pagamentos entre projetos

### **3.3 Pagamentos Fixos**
- **RF08**: O sistema deve permitir cadastro de pagamentos fixos mensais
- **RF09**: O sistema deve classificar pagamentos por tipo (funcionário, aluguel, bolsa)
- **RF10**: O sistema deve associar pagamentos a projetos específicos
- **RF11**: O sistema deve permitir anexar notas fiscais aos pagamentos
- **RF12**: O sistema deve controlar status de aprovação dos pagamentos

### **3.4 Pagamentos Variáveis**
- **RF13**: O sistema deve permitir cadastro de pagamentos variáveis
- **RF14**: O sistema deve classificar gastos por categoria
- **RF15**: O sistema deve permitir observações detalhadas
- **RF16**: O sistema deve controlar data de pagamento e mês/ano

### **3.5 Sistema de Aprovação**
- **RF17**: O sistema deve identificar pagamentos que precisam de aprovação
- **RF18**: O sistema deve notificar Renata sobre valores altos
- **RF19**: O sistema deve permitir aprovação/rejeição com justificativa
- **RF20**: O sistema deve manter histórico de aprovações

### **3.6 Relatórios**
- **RF21**: O sistema deve gerar relatórios em formato Excel
- **RF22**: O sistema deve permitir filtros por período, tipo e projeto
- **RF23**: O sistema deve enviar relatórios mensais por email
- **RF24**: O sistema deve gerar relatórios anuais consolidados

### **3.7 Comunicação por Email**
- **RF25**: O sistema deve enviar relatórios mensais para Sonia e Zé
- **RF26**: O sistema deve notificar sobre pagamentos pendentes de aprovação
- **RF27**: O sistema deve enviar confirmações de aprovação/rejeição

---

## 4. ⚡ **REQUISITOS NÃO FUNCIONAIS (RNF)**

### **4.1 Performance**
- **RNF01**: O sistema deve responder em até 2 segundos para operações básicas
- **RNF02**: O sistema deve suportar até 100 usuários simultâneos
- **RNF03**: O sistema deve processar até 10.000 pagamentos por mês

### **4.2 Disponibilidade**
- **RNF04**: O sistema deve estar disponível 99% do tempo
- **RNF05**: O sistema deve fazer backup diário dos dados
- **RNF06**: O sistema deve ter recuperação automática de falhas

### **4.3 Usabilidade**
- **RNF07**: A interface deve ser responsiva para desktop e mobile
- **RNF08**: O sistema deve ser intuitivo para usuários não técnicos
- **RNF09**: O sistema deve ter navegação clara e consistente
- **RNF10**: O sistema deve fornecer feedback visual para todas as ações

### **4.4 Segurança**
- **RNF11**: O sistema deve usar autenticação JWT segura via Supabase
- **RNF12**: O sistema deve criptografar senhas com bcrypt
- **RNF13**: O sistema deve implementar controle de acesso por perfil via RLS
- **RNF14**: O sistema deve prevenir ataques de SQL injection via Supabase
- **RNF15**: O sistema deve registrar logs de auditoria
- **RNF16**: O sistema deve implementar políticas de segurança em nível de banco

### **4.5 Compatibilidade**
- **RNF16**: O sistema deve funcionar nos navegadores Chrome, Firefox, Safari e Edge
- **RNF17**: O sistema deve ser compatível com Windows, macOS e Linux
- **RNF18**: O sistema deve funcionar em dispositivos móveis

### **4.6 Banco de Dados (Supabase)**
- **RNF19**: O sistema deve usar Supabase como plataforma de banco de dados
- **RNF20**: O sistema deve implementar Row Level Security (RLS) para controle de acesso
- **RNF21**: O sistema deve usar autenticação integrada do Supabase
- **RNF22**: O sistema deve implementar backup automático via Supabase
- **RNF23**: O sistema deve usar APIs REST do Supabase para operações CRUD

---

## 5. 📋 **REGRAS DE NEGÓCIO (RN)**

### **5.1 Controle de Acesso**
- **RN01**: Apenas usuários com perfil "ariela" ou "admin" podem criar pagamentos fixos
- **RN02**: Apenas usuários com perfil "ariela", "estagiario" ou "admin" podem criar pagamentos variáveis
- **RN03**: Apenas usuários com perfil "admin" podem excluir registros
- **RN04**: Cada usuário só pode visualizar dados do seu perfil e nível de acesso

### **5.2 Aprovação de Pagamentos**
- **RN05**: Pagamentos acima de R$ 5.000,00 precisam de aprovação da Renata
- **RN06**: Pagamentos menores que R$ 5.000,00 são aprovados automaticamente
- **RN07**: Renata deve ser notificada por email sobre todos os pagamentos
- **RN08**: Pagamentos rejeitados não podem ser processados

### **5.3 Gestão de Orçamento**
- **RN09**: O sistema deve alertar quando gastos ultrapassarem 80% do orçamento anual
- **RN10**: Pagamentos não podem ser criados se ultrapassarem o orçamento disponível
- **RN11**: Salários podem ser rateados entre múltiplos projetos

### **5.4 Relatórios e Comunicação**
- **RN12**: Relatórios mensais devem ser enviados automaticamente no primeiro dia útil
- **RN13**: Zé deve receber relatórios completos para análise
- **RN14**: Sonia deve receber relatórios de pagamentos pendentes
- **RN15**: Relatórios devem incluir totais por projeto e classificação

---

## 6. ✅ **CRITÉRIOS DE ACEITAÇÃO (CA)**

### **6.1 Gestão de Usuários**
- **CA01**: Usuário consegue fazer login com email e senha válidos
- **CA02**: Sistema redireciona usuário para tela apropriada baseada no perfil
- **CA03**: Usuário consegue alterar sua senha com validação da senha atual
- **CA04**: Sistema impede acesso a funcionalidades não autorizadas

### **6.2 Pagamentos Fixos**
- **CA05**: Usuário autorizado consegue criar pagamento fixo com todos os campos obrigatórios
- **CA06**: Sistema valida valores e datas antes de salvar
- **CA07**: Sistema associa pagamento ao projeto correto
- **CA08**: Sistema permite anexar arquivos (NFs) aos pagamentos
- **CA09**: Sistema identifica automaticamente pagamentos que precisam de aprovação

### **6.3 Pagamentos Variáveis**
- **CA10**: Usuário autorizado consegue criar pagamento variável
- **CA11**: Sistema classifica corretamente o tipo de gasto
- **CA12**: Sistema registra data de pagamento e mês/ano
- **CA13**: Sistema permite observações detalhadas

### **6.4 Sistema de Aprovação**
- **CA14**: Sistema notifica Renata sobre pagamentos pendentes de aprovação
- **CA15**: Renata consegue aprovar/rejeitar pagamentos com justificativa
- **CA16**: Sistema atualiza status do pagamento após aprovação/rejeição
- **CA17**: Sistema envia confirmação por email após decisão

### **6.5 Relatórios**
- **CA18**: Sistema gera relatório Excel com dados filtrados
- **CA19**: Sistema envia relatório mensal por email para Sonia e Zé
- **CA20**: Relatório inclui totais, classificações e observações
- **CA21**: Sistema permite download de relatórios em diferentes formatos

### **6.6 Comunicação**
- **CA22**: Emails são enviados automaticamente no horário configurado
- **CA23**: Emails contêm informações completas e formatação adequada
- **CA24**: Sistema registra logs de envio de emails

---

## 7. 🚫 **RESTRIÇÕES TÉCNICAS**

### **7.1 Tecnologias**
- **R01**: O sistema deve usar React para o frontend
- **R02**: O sistema deve usar Node.js para o backend
- **R03**: O sistema deve usar Supabase como banco de dados PostgreSQL
- **R04**: O sistema deve usar JWT para autenticação
- **R05**: O sistema deve ser responsivo e mobile-first

### **7.2 Infraestrutura**
- **R06**: O sistema deve rodar em ambiente cloud
- **R07**: O sistema deve ter backup automático diário via Supabase
- **R08**: O sistema deve ter monitoramento de performance
- **R09**: O sistema deve ter logs de auditoria
- **R10**: O sistema deve usar infraestrutura gerenciada do Supabase
- **R11**: O sistema deve implementar políticas de RLS para segurança dos dados

### **7.3 Segurança**
- **R10**: O sistema deve usar HTTPS em produção
- **R11**: O sistema deve implementar rate limiting
- **R12**: O sistema deve validar todos os inputs do usuário
- **R13**: O sistema deve ter timeout de sessão configurável
- **R14**: O sistema deve usar políticas de RLS do Supabase para segurança
- **R15**: O sistema deve implementar autenticação multi-fator via Supabase

---

## 8. 📊 **MÉTRICAS DE SUCESSO**

### **8.1 Performance**
- Tempo de resposta médio < 2 segundos
- Disponibilidade > 99%
- Suporte a 100+ usuários simultâneos
- Latência do banco de dados < 100ms (Supabase)
- Throughput de consultas > 1000 req/seg

### **8.2 Usabilidade**
- Usuários conseguem criar pagamentos em < 3 minutos
- Taxa de erro < 1%
- Satisfação do usuário > 4.5/5

### **8.3 Negócio**
- Redução de 50% no tempo de processamento de pagamentos
- Eliminação de erros manuais em planilhas
- Melhoria na visibilidade dos gastos por projeto

---

## 9. 🗓️ **CRONOGRAMA**

### **Fase 1 (Semana 1-2)**
- Configuração do ambiente de desenvolvimento
- Implementação da estrutura base do sistema
- Configuração do Supabase e banco de dados PostgreSQL

### **Fase 2 (Semana 3-4)**
- Desenvolvimento do sistema de autenticação
- Implementação da gestão de usuários
- Criação das funcionalidades básicas

### **Fase 3 (Semana 5-6)**
- Implementação do sistema de pagamentos
- Desenvolvimento do sistema de aprovação
- Criação dos relatórios

### **Fase 4 (Semana 7-8)**
- Implementação do sistema de email
- Testes e validação
- Deploy em produção

---

## 10. 📝 **NOTAS ADICIONAIS**

### **Prioridades**
1. **Alta**: Sistema de pagamentos fixos e variáveis
2. **Alta**: Sistema de aprovação para valores altos
3. **Média**: Relatórios e comunicação por email
4. **Média**: Gestão de usuários e projetos
5. **Baixa**: Funcionalidades avançadas de relatórios

### **Riscos Identificados**
- Complexidade na integração com sistemas externos
- Volume de dados pode impactar performance
- Necessidade de treinamento dos usuários
- Dependência de serviços de email externos
- Dependência da infraestrutura do Supabase
- Limitações de rate limiting do plano gratuito
- Necessidade de configuração adequada de RLS

### **Considerações Futuras**
- Integração com sistemas contábeis
- API para integração com outros sistemas
- Dashboard executivo com KPIs
- Sistema de notificações push
- App mobile nativo

### **Vantagens do Supabase**
- **V1**: Banco PostgreSQL nativo com alta performance
- **V2**: Autenticação integrada e JWT automático
- **V3**: Row Level Security (RLS) nativo para segurança
- **V4**: APIs REST e GraphQL automáticas
- **V5**: Backup automático e recuperação de desastres
- **V6**: Escalabilidade automática conforme demanda
- **V7**: Interface web para gerenciamento do banco
- **V8**: Integração com serviços de email e storage

---

**📋 Documento criado em: Janeiro de 2025**  
**👨‍💻 Responsável: Sistema Vida Mais**  
**📧 Contato: vida-mais@organizacao.com**
