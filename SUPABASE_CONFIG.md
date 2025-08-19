# 🚀 **Configuração do Supabase para Sistema Vida Mais**

## 📋 **Variáveis de Ambiente Necessárias**

Crie um arquivo `.env` na raiz do projeto com:

```env
# Configurações do Servidor
PORT=5000
NODE_ENV=development

# JWT Secret
JWT_SECRET=vidamais-super-secret-key-change-in-production

# Configurações do Supabase
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here

# Configurações de Email (Gmail)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=seu-email@gmail.com
EMAIL_PASS=sua-senha-de-app

# Configurações de Upload
MAX_FILE_SIZE=10485760
UPLOAD_PATH=./uploads

# Configurações de Aprovação
VALOR_LIMITE_APROVACAO=5000
```

## 🗄️ **Estrutura do Banco de Dados**

### **1. Tabela `usuarios`**
```sql
CREATE TABLE usuarios (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  senha_hash VARCHAR(255) NOT NULL,
  nome VARCHAR(255) NOT NULL,
  perfil VARCHAR(50) NOT NULL CHECK (perfil IN ('ariela', 'estagiario', 'sonia', 'ze', 'renata', 'admin')),
  ativo BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### **2. Tabela `projetos`**
```sql
CREATE TABLE projetos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  nome VARCHAR(255) NOT NULL,
  descricao TEXT,
  orcamento_anual DECIMAL(15,2),
  ativo BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### **3. Tabela `pagamentos_fixos`**
```sql
CREATE TABLE pagamentos_fixos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  descricao VARCHAR(255) NOT NULL,
  valor DECIMAL(15,2) NOT NULL,
  tipo VARCHAR(100) NOT NULL,
  mes_ano VARCHAR(7) NOT NULL,
  projeto_id UUID REFERENCES projetos(id),
  status VARCHAR(50) DEFAULT 'pendente' CHECK (status IN ('pendente', 'aprovado', 'rejeitado')),
  aprovado_por UUID REFERENCES usuarios(id),
  data_aprovacao TIMESTAMP WITH TIME ZONE,
  observacoes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### **4. Tabela `pagamentos_variaveis`**
```sql
CREATE TABLE pagamentos_variaveis (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  descricao VARCHAR(255) NOT NULL,
  valor DECIMAL(15,2) NOT NULL,
  classificacao VARCHAR(100) NOT NULL,
  data_pagamento DATE NOT NULL,
  mes_ano VARCHAR(7) NOT NULL,
  solicitante_id UUID REFERENCES usuarios(id),
  status VARCHAR(50) DEFAULT 'pendente' CHECK (status IN ('pendente', 'aprovado', 'rejeitado')),
  observacoes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### **5. Tabela `anexos`**
```sql
CREATE TABLE anexos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  nome_arquivo VARCHAR(255) NOT NULL,
  caminho_arquivo VARCHAR(500) NOT NULL,
  tipo_arquivo VARCHAR(100),
  tamanho INTEGER,
  pagamento_id UUID NOT NULL,
  tipo_pagamento VARCHAR(20) NOT NULL CHECK (tipo_pagamento IN ('fixo', 'variavel')),
  usuario_id UUID REFERENCES usuarios(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### **6. Tabela `logs_aprovacao`**
```sql
CREATE TABLE logs_aprovacao (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  pagamento_id UUID NOT NULL,
  tipo_pagamento VARCHAR(20) NOT NULL CHECK (tipo_pagamento IN ('fixo', 'variavel')),
  acao VARCHAR(50) NOT NULL CHECK (acao IN ('criado', 'aprovado', 'rejeitado', 'alterado')),
  usuario_id UUID REFERENCES usuarios(id),
  observacoes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## 🔐 **Políticas de Segurança (RLS)**

### **1. Habilitar RLS em todas as tabelas**
```sql
ALTER TABLE usuarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE projetos ENABLE ROW LEVEL SECURITY;
ALTER TABLE pagamentos_fixos ENABLE ROW LEVEL SECURITY;
ALTER TABLE pagamentos_variaveis ENABLE ROW LEVEL SECURITY;
ALTER TABLE anexos ENABLE ROW LEVEL SECURITY;
ALTER TABLE logs_aprovacao ENABLE ROW LEVEL SECURITY;
```

### **2. Política para usuários (cada um vê apenas seus dados)**
```sql
CREATE POLICY "Usuarios podem ver apenas seus próprios dados" ON usuarios
  FOR SELECT USING (auth.uid()::text = id::text);
```

### **3. Política para pagamentos (baseada no perfil)**
```sql
-- Ariela e Admin podem ver tudo
CREATE POLICY "Ariela e Admin podem ver todos os pagamentos" ON pagamentos_fixos
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM usuarios 
      WHERE id = auth.uid()::uuid 
      AND perfil IN ('ariela', 'admin')
    )
  );

-- Outros usuários veem apenas pagamentos relacionados a eles
CREATE POLICY "Usuarios veem pagamentos relacionados" ON pagamentos_fixos
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM usuarios 
      WHERE id = auth.uid()::uuid 
      AND perfil IN ('sonia', 'ze', 'renata')
    )
  );
```

## 🚀 **Como Configurar**

### **1. Criar projeto no Supabase**
- Acesse [supabase.com](https://supabase.com)
- Crie uma nova conta/projeto
- Anote a URL e chaves

### **2. Executar scripts SQL**
- Copie os scripts acima
- Execute no SQL Editor do Supabase

### **3. Configurar variáveis**
- Copie `.env.example` para `.env`
- Preencha com suas credenciais

### **4. Instalar dependências**
```bash
cd server
npm install
```

### **5. Rodar o projeto**
```bash
npm run dev
```

## 📊 **Vantagens do Supabase**

✅ **PostgreSQL nativo** - Banco robusto e confiável  
✅ **Autenticação integrada** - JWT automático  
✅ **RLS nativo** - Segurança em nível de banco  
✅ **Interface web** - Fácil gerenciamento  
✅ **APIs automáticas** - REST e GraphQL  
✅ **Backups automáticos** - Sempre seguro  
✅ **Escalabilidade** - Cresce com o projeto  

## 🎯 **Próximos Passos**

1. **Configurar projeto Supabase**
2. **Executar scripts de criação**
3. **Configurar variáveis de ambiente**
4. **Testar conexão**
5. **Migrar dados existentes (se houver)**

**🚀 O Supabase vai tornar o sistema Vida Mais muito mais robusto e escalável!**
