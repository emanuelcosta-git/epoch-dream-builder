# 🏗️ **ARQUITETURA SIMPLIFICADA - SISTEMA DE PAGAMENTOS VIDA MAIS**

## 🎯 **FOCO: APENAS SISTEMA DE PAGAMENTOS**

Este documento define a **Arquitetura Simplificada** para o Sistema de Pagamentos Vida Mais, usando **APENAS LOVABLE (Frontend) + SUPABASE (Backend)**.

---

## 🚀 **STACK TECNOLÓGICO SIMPLIFICADO**

### **1. FRONTEND - LOVABLE**
- **Framework**: LOVABLE (Low-Code Visual Application Builder)
- **Funcionalidades**: Apenas sistema de pagamentos
- **Interface**: Componentes visuais drag-and-drop
- **Responsividade**: Mobile-first design

### **2. BACKEND - SUPABASE**
- **Banco de Dados**: PostgreSQL (gerenciado)
- **Autenticação**: Supabase Auth
- **API**: REST automático
- **Storage**: Apenas para anexos de pagamentos

---

## 🎨 **COMPONENTES LOVABLE - SISTEMA DE PAGAMENTOS**

### **1. Dashboard Principal**
- **Métricas**: Total de pagamentos, pendentes, aprovados
- **Gráficos**: Pagamentos por mês, status
- **Alertas**: Pagamentos que precisam de aprovação

### **2. Formulário de Pagamento**
- **Campos**: Descrição, valor, tipo, projeto, anexos
- **Validação**: Valor mínimo/máximo, campos obrigatórios
- **Upload**: Anexar notas fiscais e documentos

### **3. Lista de Pagamentos**
- **Tabela**: Todos os pagamentos com filtros
- **Status**: Pendente, Aprovado, Rejeitado
- **Ações**: Editar, aprovar, rejeitar

### **4. Sistema de Aprovação**
- **Interface**: Aprovar/rejeitar pagamentos
- **Justificativa**: Campo obrigatório para rejeição
- **Notificação**: Email automático após decisão

---

## 🗄️ **BANCO DE DADOS SUPABASE - TABELAS ESSENCIAIS**

### **1. Tabela: usuarios**
```sql
CREATE TABLE usuarios (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT UNIQUE NOT NULL,
    nome TEXT NOT NULL,
    perfil TEXT NOT NULL CHECK (perfil IN ('ariela', 'estagiario', 'sonia', 'ze', 'renata', 'admin')),
    ativo BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### **2. Tabela: projetos**
```sql
CREATE TABLE projetos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nome TEXT NOT NULL,
    orcamento_anual DECIMAL(12,2),
    ativo BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### **3. Tabela: pagamentos**
```sql
CREATE TABLE pagamentos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    descricao TEXT NOT NULL,
    valor DECIMAL(10,2) NOT NULL,
    tipo TEXT NOT NULL CHECK (tipo IN ('fixo', 'variavel')),
    projeto_id UUID REFERENCES projetos(id),
    solicitante_id UUID REFERENCES usuarios(id),
    status TEXT DEFAULT 'pendente' CHECK (status IN ('pendente', 'aprovado', 'rejeitado')),
    aprovado_por UUID REFERENCES usuarios(id),
    data_aprovacao TIMESTAMP WITH TIME ZONE,
    justificativa_rejeicao TEXT,
    mes_ano TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### **4. Tabela: anexos**
```sql
CREATE TABLE anexos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    pagamento_id UUID REFERENCES pagamentos(id) ON DELETE CASCADE,
    nome_arquivo TEXT NOT NULL,
    tipo_arquivo TEXT NOT NULL,
    url_arquivo TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

---

## 🔐 **AUTENTICAÇÃO SIMPLIFICADA - SUPABASE AUTH**

### **1. Perfis de Usuário**
- **ariela**: Criar/editar pagamentos, anexar arquivos
- **estagiario**: Criar pagamentos variáveis
- **sonia**: Visualizar relatórios
- **ze**: Visualizar e baixar relatórios
- **renata**: Aprovar/rejeitar pagamentos > R$ 5.000
- **admin**: Configurações do sistema

### **2. Row Level Security (RLS)**
```sql
-- Usuários veem apenas seus próprios dados
CREATE POLICY "Usuários veem apenas seus dados" ON usuarios
FOR SELECT USING (auth.uid()::text = id::text);

-- Pagamentos baseados no perfil
CREATE POLICY "Pagamentos por perfil" ON pagamentos
FOR ALL USING (
    CASE 
        WHEN auth.jwt() ->> 'perfil' = 'admin' THEN true
        WHEN auth.jwt() ->> 'perfil' = 'renata' THEN true
        WHEN auth.jwt() ->> 'perfil' = 'ariela' THEN solicitante_id::text = auth.uid()::text
        WHEN auth.jwt() ->> 'perfil' = 'estagiario' THEN solicitante_id::text = auth.uid()::text
        WHEN auth.jwt() ->> 'perfil' IN ('sonia', 'ze') THEN true
        ELSE false
    END
);
```

---

## 🔄 **FLUXO DE APROVAÇÃO - REGRAS DE NEGÓCIO**

### **1. Criação de Pagamento**
1. **Ariela/Estagiário** cria pagamento via LOVABLE
2. **Sistema valida** campos obrigatórios
3. **Sistema verifica** se valor > R$ 5.000
4. **Se ≤ R$ 5.000**: Aprovação automática
5. **Se > R$ 5.000**: Aguarda aprovação de Renata

### **2. Aprovação Automática**
- **Status**: "aprovado"
- **Timestamp**: Data/hora automática
- **Email**: Notificação para Sonia e Zé
- **Log**: Registro automático no sistema

### **3. Aprovação Manual**
- **Status**: "pendente"
- **Email**: Sistema envia para Renata
- **Resposta**: Renata aprova/rejeita via interface
- **Justificativa**: Obrigatória para rejeição
- **Notificação**: Email para Sonia e Zé

---

## 📧 **SISTEMA DE EMAIL - SUPABASE EDGE FUNCTIONS**

### **1. Função: Enviar Email de Aprovação**
```javascript
// supabase/functions/enviar-email-aprovacao/index.js
export async function handler(event) {
    const { pagamento_id } = JSON.parse(event.body);
    
    // Buscar dados do pagamento
    const { data: pagamento } = await supabase
        .from('pagamentos')
        .select('*')
        .eq('id', pagamento_id)
        .single();
    
    // Enviar email baseado no status
    if (pagamento.status === 'aprovado') {
        await enviarEmail('sonia@vidamais.com, ze@vidamais.com', 
            'Pagamento Aprovado', 
            templatePagamentoAprovado(pagamento));
    } else if (pagamento.status === 'pendente') {
        await enviarEmail('renata@vidamais.com', 
            'Pagamento Pendente de Aprovação', 
            templatePagamentoPendente(pagamento));
    }
    
    return { success: true };
}
```

### **2. Templates de Email**
- **Email para Renata**: Detalhes do pagamento + botões aprovar/rejeitar
- **Email para Sonia/Zé**: Relatório de pagamentos aprovados
- **Formato**: HTML responsivo com dados dinâmicos

---

## 📱 **INTERFACE LOVABLE - COMPONENTES PRINCIPAIS**

### **1. Página de Login**
- **Campo**: Email e senha
- **Validação**: Supabase Auth
- **Redirecionamento**: Dashboard após login

### **2. Dashboard Principal**
- **Cards**: Total pagamentos, pendentes, aprovados
- **Gráfico**: Pagamentos por mês
- **Tabela**: Últimos pagamentos
- **Botão**: "Novo Pagamento"

### **3. Formulário de Pagamento**
- **Campos**: Descrição, valor, tipo, projeto, mes_ano
- **Upload**: Anexar arquivos (PDF, imagens)
- **Validação**: Campos obrigatórios, valor mínimo
- **Botões**: Salvar, Cancelar

### **4. Lista de Pagamentos**
- **Filtros**: Status, mês, projeto, valor
- **Tabela**: Paginação, ordenação
- **Ações**: Editar, aprovar, rejeitar
- **Export**: Excel/PDF

### **5. Tela de Aprovação**
- **Detalhes**: Informações completas do pagamento
- **Anexos**: Visualizar arquivos
- **Decisão**: Aprovar ou Rejeitar
- **Justificativa**: Campo obrigatório para rejeição

---

## 🔒 **SEGURANÇA SIMPLIFICADA**

### **1. Autenticação**
- **Supabase Auth**: Login com email/senha
- **JWT Tokens**: Sessões seguras
- **Logout**: Limpeza automática de tokens

### **2. Autorização**
- **Perfis**: Controle de acesso por usuário
- **RLS**: Dados filtrados automaticamente
- **Validação**: Campos obrigatórios no frontend e backend

### **3. Dados**
- **Criptografia**: HTTPS automático do Supabase
- **Backup**: Automático e diário
- **Logs**: Histórico de todas as ações

---

## 📊 **RELATÓRIOS SIMPLES**

### **1. Relatório Mensal**
- **Dados**: Pagamentos do mês
- **Formato**: Excel (CSV)
- **Filtros**: Status, projeto, tipo
- **Download**: Botão direto na interface

### **2. Dashboard Executivo**
- **Métricas**: Totais e percentuais
- **Gráficos**: Pagamentos por status, mês
- **Tempo real**: Atualização automática
- **Responsivo**: Funciona em mobile

---

## 🚀 **IMPLEMENTAÇÃO - PASSOS SIMPLES**

### **Fase 1: Configuração (1 semana)**
1. **Criar projeto Supabase**
2. **Configurar tabelas** com SQL fornecido
3. **Configurar RLS** e políticas
4. **Criar projeto LOVABLE**

### **Fase 2: Funcionalidades Core (2 semanas)**
1. **Interface de login** com Supabase Auth
2. **Dashboard principal** com métricas
3. **Formulário de pagamento** com validação
4. **Lista de pagamentos** com filtros

### **Fase 3: Sistema de Aprovação (1 semana)**
1. **Interface de aprovação** para Renata
2. **Sistema de email** com Edge Functions
3. **Fluxo automático** vs manual
4. **Logs e auditoria**

### **Fase 4: Relatórios e Finalização (1 semana)**
1. **Relatórios em Excel**
2. **Dashboard executivo**
3. **Testes e ajustes**
4. **Deploy em produção**

---

## 💰 **CUSTOS ESTIMADOS - MENSAL**

### **Supabase**
- **Plano Pro**: $25/mês
- **Storage**: ~$5/mês (para anexos)
- **Total**: ~$30/mês

### **LOVABLE**
- **Licença**: $99/mês
- **Hosting**: $29/mês
- **Total**: ~$128/mês

### **Total Geral**: ~$158/mês

---

## ⚠️ **LIMITAÇÕES E CONSIDERAÇÕES**

### **1. LOVABLE**
- **Dependência**: Plataforma proprietária
- **Customização**: Limitada às funcionalidades disponíveis
- **Escalabilidade**: Depende do plano contratado

### **2. Supabase**
- **Rate Limiting**: Plano gratuito tem limitações
- **Storage**: Limite de 1GB no plano gratuito
- **Edge Functions**: Limite de execuções

### **3. Mitigações**
- **Plano Pro**: Supabase para produção
- **Otimização**: Queries eficientes
- **Cache**: Dados frequentes em cache local

---

## 🎯 **VANTAGENS DA ARQUITETURA SIMPLIFICADA**

### **1. Desenvolvimento Rápido**
- ✅ **LOVABLE**: Interface visual em poucos dias
- ✅ **Supabase**: Backend pronto para uso
- ✅ **Integração**: Simples e direta

### **2. Custo-Efetivo**
- ✅ **Sem equipe**: Desenvolvimento low-code
- ✅ **Infraestrutura**: Gerenciada pelo Supabase
- ✅ **Manutenção**: Mínima

### **3. Funcionalidade Focada**
- ✅ **Sistema de pagamentos**: Completo
- ✅ **Aprovação**: Automática e manual
- ✅ **Relatórios**: Básicos mas funcionais

---

## 🎉 **CONCLUSÃO**

Esta arquitetura simplificada permite implementar o **Sistema de Pagamentos Vida Mais** em **4 semanas** usando apenas:

🚀 **LOVABLE** para interface visual rápida  
☁️ **Supabase** para backend robusto e seguro  
📧 **Edge Functions** para emails automáticos  
🔒 **RLS** para controle de acesso granular  

**🎯 Foco total no sistema de pagamentos, sem complexidades desnecessárias!**

---

**📋 Documento criado em: Janeiro de 2025**  
**🏗️ Responsável: Arquitetura Simplificada Vida Mais**  
**📧 Contato: architecture@vidamais.com**
