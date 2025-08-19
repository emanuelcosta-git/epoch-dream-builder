# 📋 **REGRAS DE NEGÓCIO - SISTEMA VIDA MAIS**

## 🎯 **VISÃO GERAL**

Este documento define as **Regras de Negócio (RN)** que regem o funcionamento do Sistema Vida Mais, especificamente o processo de aprovação de pagamentos. Estas regras são baseadas no fluxograma de aprovação e devem ser implementadas no sistema para garantir consistência, controle e compliance.

---

## 🔄 **REGRA PRINCIPAL: PROCESSO DE APROVAÇÃO**

### **RN001 - Início do Processo**
- **Descrição**: Todo pagamento deve ser iniciado através da atualização da planilha por Ariela
- **Responsável**: Ariela (vida+)
- **Frequência**: Conforme necessidade (diária/semanal)
- **Validação**: Sistema deve verificar se Ariela está logada e tem permissão para atualizar planilhas
- **Exceção**: Nenhuma

### **RN002 - Critério de Decisão Automática**
- **Descrição**: Sistema deve avaliar automaticamente se o pagamento precisa de aprovação manual
- **Critério**: Valor do pagamento > R$ 5.000,00
- **Limite**: R$ 5.000,00 (configurável pelo administrador)
- **Validação**: Sistema deve calcular o valor total considerando impostos e taxas
- **Exceção**: Pagamentos de emergência podem ter limite reduzido temporariamente

---

## 🟢 **CAMINHO 1: APROVAÇÃO AUTOMÁTICA (Valores ≤ R$ 5.000)**

### **RN003 - Aprovação Automática**
- **Descrição**: Pagamentos com valor ≤ R$ 5.000,00 são aprovados automaticamente
- **Status**: Sistema deve marcar como "APROVADO AUTOMATICAMENTE"
- **Timestamp**: Data e hora da aprovação automática
- **Log**: Sistema deve registrar a aprovação automática no histórico
- **Validação**: Verificar se o valor está dentro do orçamento mensal disponível

### **RN004 - Notificação Automática**
- **Descrição**: Após aprovação automática, sistema deve enviar email para Sonia e Zé
- **Destinatários**: sonia@vidamais.com, ze@vidamais.com
- **Conteúdo**: Relatório de pagamentos aprovados automaticamente
- **Frequência**: Imediato após aprovação
- **Template**: Email padronizado com detalhes do pagamento

---

## 🟡 **CAMINHO 2: APROVAÇÃO MANUAL (Valores > R$ 5.000)**

### **RN005 - Aguardar Aprovação**
- **Descrição**: Pagamentos com valor > R$ 5.000,00 devem aguardar aprovação de Renata
- **Status**: Sistema deve marcar como "PENDENTE DE APROVAÇÃO"
- **Responsável**: Renata
- **Prazo**: Sem limite definido (conforme disponibilidade da Renata)
- **Validação**: Sistema deve verificar se Renata está ativa no sistema

### **RN006 - Email para Renata**
- **Descrição**: Sistema deve enviar email automático para Renata com detalhes do pagamento
- **Destinatário**: renata@vidamais.com
- **Conteúdo**: 
  - Descrição do pagamento
  - Valor solicitado
  - Justificativa apresentada
  - Anexos (notas fiscais, documentos)
  - Link para aprovação/rejeição no sistema
- **Urgência**: Alta (valores significativos)
- **Template**: Email de urgência com destaque visual

### **RN007 - Resposta por Email**
- **Descrição**: Renata deve responder por email com decisão
- **Formato**: Resposta ao email do sistema
- **Opções**: Aprovar ou Rejeitar
- **Justificativa**: Obrigatória para rejeição
- **Validação**: Sistema deve processar a resposta por email

---

## ✅ **SUBCAMINHO 2A: APROVADO POR RENATA**

### **RN008 - Aprovação Manual**
- **Descrição**: Pagamento aprovado por Renata deve ser marcado como aprovado
- **Status**: Sistema deve marcar como "APROVADO MANUALMENTE"
- **Responsável**: Renata
- **Data**: Data da aprovação
- **Justificativa**: Documentada no sistema
- **Log**: Sistema deve registrar quem aprovou, quando e por quê

### **RN009 - Notificação Final (Aprovado)**
- **Descrição**: Após aprovação manual, sistema deve enviar email para Sonia e Zé
- **Destinatários**: sonia@vidamais.com, ze@vidamais.com
- **Conteúdo**: Pagamento aprovado com detalhes e justificativa da Renata
- **Observação**: Incluir justificativa da Renata
- **Template**: Email de confirmação com detalhes da aprovação

---

## ❌ **SUBCAMINHO 2B: REJEITADO POR RENATA**

### **RN010 - Rejeição**
- **Descrição**: Pagamento rejeitado por Renata deve ser marcado como rejeitado
- **Status**: Sistema deve marcar como "REJEITADO"
- **Responsável**: Renata
- **Data**: Data da rejeição
- **Justificativa**: Obrigatória e documentada no sistema
- **Log**: Sistema deve registrar quem rejeitou, quando e por quê

### **RN011 - Aguardar Ajustes**
- **Descrição**: Pagamento rejeitado deve aguardar ajustes por Ariela
- **Status**: Sistema deve marcar como "PENDENTE DE AJUSTES"
- **Ação**: Ariela deve ajustar o pagamento conforme orientação da Renata
- **Prazo**: Conforme orientação da Renata
- **Resultado**: Novo ciclo de aprovação
- **Notificação**: Sistema deve notificar Ariela sobre a rejeição

---

## 🔄 **PONTOS DE CONVERGÊNCIA**

### **RN012 - Notificação Final**
- **Descrição**: Todos os pagamentos aprovados (automática ou manual) resultam em email para Sonia e Zé
- **Quando**: Após aprovação (automática ou manual)
- **Para**: Sonia e Zé
- **Conteúdo**: Relatório consolidado dos pagamentos
- **Frequência**: Imediato após aprovação

### **RN013 - Sistema de Logs**
- **Descrição**: Sistema deve registrar todas as ações e decisões
- **Registro**: Todas as ações e decisões
- **Auditoria**: Histórico completo de aprovações
- **Rastreabilidade**: Quem aprovou, quando e por quê
- **Retenção**: Logs devem ser mantidos por 7 anos (compliance)

---

## ⚠️ **EXCEÇÕES E TRATAMENTOS**

### **RN014 - Renata Indisponível**
- **Descrição**: Se Renata não responder em 3 dias úteis
- **Ação**: Sistema deve enviar lembretes automáticos
- **Frequência**: Diário após o 3º dia
- **Escalação**: Após 7 dias, notificar administrador do sistema
- **Validação**: Verificar se Renata está de férias ou indisponível

### **RN015 - Valores Extremamente Altos**
- **Descrição**: Pagamentos acima de R$ 50.000,00
- **Critério**: Valor > R$ 50.000,00
- **Ação**: Aprovação em duas etapas
- **Responsáveis**: Renata + Comitê Executivo
- **Validação**: Sistema deve identificar automaticamente e aplicar regra especial

### **RN016 - Urgências**
- **Descrição**: Pagamentos críticos para operação
- **Critério**: Marcado como "URGENTE" por Ariela
- **Ação**: Aprovação acelerada
- **Responsável**: Renata + Ariela
- **Prazo**: < 4 horas
- **Validação**: Apenas para situações realmente críticas

---

## 📊 **MÉTRICAS E CONTROLES**

### **RN017 - Tempo de Aprovação**
- **Automática**: < 1 minuto
- **Manual**: < 24 horas (média)
- **Urgente**: < 4 horas
- **Validação**: Sistema deve calcular e reportar tempos médios

### **RN018 - Taxa de Aprovação**
- **Automática**: 100% (por definição)
- **Manual**: Meta de 85%
- **Rejeição**: Meta de 15%
- **Validação**: Sistema deve calcular taxas mensalmente

### **RN019 - Eficiência**
- **Redução de tempo**: Meta de 70% vs processo manual
- **Eliminação de erros**: Meta de 95%
- **Visibilidade**: 100% dos pagamentos rastreados
- **Validação**: Relatórios mensais de eficiência

---

## 🔧 **CONFIGURAÇÕES DO SISTEMA**

### **RN020 - Limite de Aprovação Automática**
- **Valor**: R$ 5.000,00
- **Configuração**: Administrador pode alterar
- **Validação**: Alteração deve ser aprovada por Renata
- **Log**: Todas as alterações devem ser registradas
- **Notificação**: Usuários devem ser notificados sobre mudanças

### **RN021 - Templates de Email**
- **Configuração**: Administrador pode personalizar
- **Variáveis**: Nome, valor, descrição, responsável
- **Formato**: HTML responsivo
- **Validação**: Teste obrigatório antes de publicação

### **RN022 - Regras de Escalação**
- **Configuração**: Administrador pode definir
- **Validação**: Regras devem ser testadas
- **Log**: Todas as escalações devem ser registradas
- **Notificação**: Stakeholders devem ser notificados

---

## 🚫 **RESTRIÇÕES E VALIDAÇÕES**

### **RN023 - Validação de Valores**
- **Descrição**: Sistema deve validar valores antes de processar
- **Valor mínimo**: R$ 0,01
- **Valor máximo**: R$ 1.000.000,00
- **Validação**: Verificar se valor está dentro de limites
- **Exceção**: Valores acima do máximo precisam de aprovação especial

### **RN024 - Validação de Usuários**
- **Descrição**: Sistema deve validar permissões dos usuários
- **Ariela**: Pode atualizar planilhas e criar pagamentos
- **Renata**: Pode aprovar/rejeitar pagamentos > R$ 5.000
- **Sonia**: Pode visualizar relatórios
- **Zé**: Pode visualizar e baixar relatórios
- **Validação**: Verificar perfil do usuário antes de cada ação

### **RN025 - Validação de Orçamento**
- **Descrição**: Sistema deve verificar se pagamento está dentro do orçamento
- **Orçamento mensal**: Definido por projeto
- **Orçamento anual**: Definido por projeto
- **Validação**: Verificar disponibilidade antes de aprovar
- **Exceção**: Pagamentos urgentes podem exceder orçamento

---

## 📋 **FORMULÁRIOS E CAMPOS**

### **RN026 - Formulário de Pagamento**
- **Campos obrigatórios**:
  - Descrição
  - Valor
  - Tipo (fixo/variável)
  - Projeto
  - Data de vencimento
  - Anexos (obrigatório para valores > R$ 1.000)
- **Validação**: Todos os campos obrigatórios devem ser preenchidos
- **Formato**: Interface web responsiva

### **RN027 - Formulário de Aprovação**
- **Campos obrigatórios**:
  - Decisão (aprovar/rejeitar)
  - Justificativa (obrigatória para rejeição)
  - Data de decisão
- **Validação**: Decisão e justificativa obrigatórias
- **Formato**: Interface web + email

---

## 🔒 **SEGURANÇA E COMPLIANCE**

### **RN028 - Controle de Acesso**
- **Descrição**: Sistema deve implementar controle de acesso granular
- **Método**: Row Level Security (RLS) com Supabase
- **Validação**: Usuário só pode acessar dados de seu projeto
- **Log**: Todas as tentativas de acesso devem ser registradas
- **Auditoria**: Relatórios de acesso mensais

### **RN029 - Auditoria**
- **Descrição**: Sistema deve manter histórico completo de todas as ações
- **Retenção**: 7 anos (compliance)
- **Acesso**: Apenas administradores e auditores
- **Exportação**: Relatórios de auditoria em PDF
- **Validação**: Logs não podem ser alterados

### **RN030 - Backup e Recuperação**
- **Descrição**: Sistema deve fazer backup automático
- **Frequência**: Diário
- **Retenção**: 30 dias
- **Validação**: Teste de recuperação mensal
- **Notificação**: Falhas de backup devem ser reportadas

---

## 📊 **RELATÓRIOS E DASHBOARDS**

### **RN031 - Relatório Mensal**
- **Descrição**: Sistema deve gerar relatório mensal automaticamente
- **Conteúdo**: Todos os pagamentos do mês
- **Formato**: Excel e PDF
- **Destinatários**: Sonia e Zé
- **Frequência**: Último dia útil do mês

### **RN032 - Dashboard Executivo**
- **Descrição**: Interface visual com métricas em tempo real
- **Métricas**: Pagamentos pendentes, aprovados, rejeitados
- **Atualização**: Tempo real
- **Acesso**: Apenas usuários autorizados
- **Validação**: Dados devem ser consistentes com relatórios

---

## 🔄 **PROCESSOS DE EXCEÇÃO**

### **RN033 - Pagamentos Rejeitados**
- **Descrição**: Processo para pagamentos rejeitados
- **Ação**: Ariela deve ajustar conforme orientação
- **Prazo**: Conforme orientação da Renata
- **Validação**: Novo pagamento deve ser criado
- **Histórico**: Pagamento original deve ser mantido para auditoria

### **RN034 - Pagamentos Urgentes**
- **Descrição**: Processo para pagamentos urgentes
- **Critério**: Marcado como urgente por Ariela
- **Aprovação**: Renata + Ariela
- **Prazo**: < 4 horas
- **Validação**: Apenas para situações realmente críticas
- **Documentação**: Justificativa obrigatória

---

## 📋 **RESUMO DAS REGRAS**

| **Regra** | **Descrição** | **Responsável** | **Prazo** |
|-----------|---------------|-----------------|-----------|
| **RN001** | Início do processo | Ariela | Conforme necessidade |
| **RN002** | Critério de decisão | Sistema | Automático |
| **RN003** | Aprovação automática | Sistema | < 1 minuto |
| **RN004** | Notificação automática | Sistema | Imediato |
| **RN005** | Aguardar aprovação | Renata | Sem limite |
| **RN006** | Email para Renata | Sistema | Imediato |
| **RN007** | Resposta por email | Renata | Conforme disponibilidade |
| **RN008** | Aprovação manual | Renata | Conforme disponibilidade |
| **RN009** | Notificação final | Sistema | Imediato |
| **RN010** | Rejeição | Renata | Conforme disponibilidade |
| **RN011** | Aguardar ajustes | Ariela | Conforme orientação |
| **RN012** | Notificação final | Sistema | Imediato |
| **RN013** | Sistema de logs | Sistema | Contínuo |

---

## 🎯 **IMPLEMENTAÇÃO**

### **Fase 1 - Regras Básicas**
- RN001 a RN013 (processo principal)
- RN020 a RN022 (configurações)
- RN023 a RN025 (validações)

### **Fase 2 - Regras Avançadas**
- RN014 a RN016 (exceções)
- RN017 a RN019 (métricas)
- RN026 a RN027 (formulários)

### **Fase 3 - Regras de Segurança**
- RN028 a RN030 (segurança)
- RN031 a RN032 (relatórios)
- RN033 a RN034 (processos de exceção)

---

## ⚠️ **IMPORTANTE**

- **Todas as regras devem ser implementadas no sistema**
- **Regras não podem ser contornadas sem autorização**
- **Alterações nas regras devem ser aprovadas por Renata**
- **Sistema deve validar todas as regras automaticamente**
- **Logs devem registrar todas as violações das regras**

---

**📋 Documento criado em: Janeiro de 2025**  
**📋 Responsável: Regras de Negócio Vida Mais**  
**📧 Contato: business@vidamais.com**
