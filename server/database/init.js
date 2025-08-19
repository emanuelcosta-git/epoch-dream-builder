const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const bcrypt = require('bcryptjs');

const dbPath = path.join(__dirname, 'vida-mais.db');
const db = new sqlite3.Database(dbPath);

console.log('🗄️ Inicializando banco de dados...');

// Criar tabelas
db.serialize(() => {
  // Tabela de usuários
  db.run(`
    CREATE TABLE IF NOT EXISTS usuarios (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nome TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      senha TEXT NOT NULL,
      perfil TEXT NOT NULL CHECK(perfil IN ('ariela', 'estagiario', 'sonia', 'ze', 'renata', 'admin')),
      ativo BOOLEAN DEFAULT 1,
      criado_em DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Tabela de projetos
  db.run(`
    CREATE TABLE IF NOT EXISTS projetos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nome TEXT NOT NULL,
      descricao TEXT,
      orcamento_anual DECIMAL(15,2),
      ativo BOOLEAN DEFAULT 1,
      criado_em DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Tabela de pagamentos fixos
  db.run(`
    CREATE TABLE IF NOT EXISTS pagamentos_fixos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      descricao TEXT NOT NULL,
      valor DECIMAL(15,2) NOT NULL,
      tipo TEXT NOT NULL CHECK(tipo IN ('funcionario', 'aluguel', 'bolsa_estudo', 'outros')),
      projeto_id INTEGER,
      fornecedor TEXT,
      conta_bancaria TEXT,
      dia_vencimento INTEGER CHECK(dia_vencimento >= 1 AND dia_vencimento <= 31),
      ativo BOOLEAN DEFAULT 1,
      observacoes TEXT,
      criado_em DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (projeto_id) REFERENCES projetos (id)
    )
  `);

  // Tabela de pagamentos variáveis
  db.run(`
    CREATE TABLE IF NOT EXISTS pagamentos_variaveis (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      descricao TEXT NOT NULL,
      valor DECIMAL(15,2) NOT NULL,
      data_pagamento DATE NOT NULL,
      mes_referencia TEXT NOT NULL,
      ano_referencia INTEGER NOT NULL,
      classificacao TEXT NOT NULL,
      projeto_id INTEGER,
      fornecedor TEXT,
      numero_nf TEXT,
      comprovante_path TEXT,
      observacoes TEXT,
      status TEXT DEFAULT 'pendente' CHECK(status IN ('pendente', 'aprovado', 'rejeitado')),
      aprovado_por INTEGER,
      criado_por INTEGER NOT NULL,
      criado_em DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (projeto_id) REFERENCES projetos (id),
      FOREIGN KEY (aprovado_por) REFERENCES usuarios (id),
      FOREIGN KEY (criado_por) REFERENCES usuarios (id)
    )
  `);

  // Tabela de anexos
  db.run(`
    CREATE TABLE IF NOT EXISTS anexos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nome_arquivo TEXT NOT NULL,
      caminho_arquivo TEXT NOT NULL,
      tipo_arquivo TEXT NOT NULL,
      tamanho INTEGER,
      pagamento_id INTEGER,
      pagamento_tipo TEXT CHECK(pagamento_tipo IN ('fixo', 'variavel')),
      criado_por INTEGER NOT NULL,
      criado_em DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (criado_por) REFERENCES usuarios (id)
    )
  `);

  // Tabela de logs de aprovação
  db.run(`
    CREATE TABLE IF NOT EXISTS logs_aprovacao (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      pagamento_id INTEGER NOT NULL,
      pagamento_tipo TEXT NOT NULL CHECK(pagamento_tipo IN ('fixo', 'variavel')),
      acao TEXT NOT NULL CHECK(acao IN ('aprovado', 'rejeitado', 'pendente')),
      observacoes TEXT,
      aprovado_por INTEGER NOT NULL,
      data_aprovacao DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (aprovado_por) REFERENCES usuarios (id)
    )
  `);

  console.log('✅ Tabelas criadas com sucesso!');

  // Inserir dados iniciais
  const senhaHash = bcrypt.hashSync('123456', 10);
  
  // Usuários padrão
  const usuarios = [
    ['Ariela Silva', 'ariela@vidamais.com', senhaHash, 'ariela'],
    ['Estagiário Ariela', 'estagiario@vidamais.com', senhaHash, 'estagiario'],
    ['Sonia Costa', 'sonia@vidamais.com', senhaHash, 'sonia'],
    ['Zé Santos', 'ze@vidamais.com', senhaHash, 'ze'],
    ['Renata Oliveira', 'renata@vidamais.com', senhaHash, 'renata'],
    ['Admin Sistema', 'admin@vidamais.com', senhaHash, 'admin']
  ];

  const stmt = db.prepare('INSERT OR IGNORE INTO usuarios (nome, email, senha, perfil) VALUES (?, ?, ?, ?)');
  usuarios.forEach(usuario => stmt.run(usuario));
  stmt.finalize();

  // Projetos padrão
  const projetos = [
    ['Projeto Vida+', 'Projeto principal da Vida Mais', 500000.00],
    ['Projeto Educacional', 'Bolsas de estudo e capacitação', 200000.00],
    ['Projeto Comunitário', 'Ações sociais e comunitárias', 150000.00]
  ];

  const stmtProjetos = db.prepare('INSERT OR IGNORE INTO projetos (nome, descricao, orcamento_anual) VALUES (?, ?, ?)');
  projetos.forEach(projeto => stmtProjetos.run(projeto));
  stmtProjetos.finalize();

  console.log('✅ Dados iniciais inseridos!');
  console.log('🔑 Usuários padrão criados com senha: 123456');
});

db.close((err) => {
  if (err) {
    console.error('❌ Erro ao fechar banco:', err.message);
  } else {
    console.log('✅ Banco de dados inicializado com sucesso!');
    console.log('📁 Arquivo: vida-mais.db');
  }
});
