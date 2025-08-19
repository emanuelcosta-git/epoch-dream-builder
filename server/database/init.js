const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcryptjs');
const path = require('path');

console.log('🚀 Inicializando banco de dados SQLite...');

// Caminho para o banco
const dbPath = path.join(__dirname, 'vida_mais.db');
const db = new sqlite3.Database(dbPath);

// Função para criar tabelas
const criarTabelas = () => {
  return new Promise((resolve, reject) => {
    console.log('📋 Criando tabelas...');
    
    const tabelas = [
      `CREATE TABLE IF NOT EXISTS usuarios (
        id TEXT PRIMARY KEY,
        email TEXT UNIQUE NOT NULL,
        senha_hash TEXT NOT NULL,
        nome TEXT NOT NULL,
        perfil TEXT NOT NULL,
        ativo INTEGER DEFAULT 1,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )`,
      
      `CREATE TABLE IF NOT EXISTS projetos (
        id TEXT PRIMARY KEY,
        nome TEXT NOT NULL,
        descricao TEXT,
        orcamento_anual REAL,
        ativo INTEGER DEFAULT 1,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )`,
      
      `CREATE TABLE IF NOT EXISTS pagamentos_fixos (
        id TEXT PRIMARY KEY,
        descricao TEXT NOT NULL,
        valor REAL NOT NULL,
        tipo TEXT NOT NULL,
        mes_ano TEXT NOT NULL,
        projeto_id TEXT,
        status TEXT DEFAULT 'pendente',
        aprovado_por TEXT,
        data_aprovacao DATETIME,
        observacoes TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (projeto_id) REFERENCES projetos (id),
        FOREIGN KEY (aprovado_por) REFERENCES usuarios (id)
      )`,
      
      `CREATE TABLE IF NOT EXISTS pagamentos_variaveis (
        id TEXT PRIMARY KEY,
        descricao TEXT NOT NULL,
        valor REAL NOT NULL,
        classificacao TEXT NOT NULL,
        data_pagamento DATE NOT NULL,
        mes_ano TEXT NOT NULL,
        solicitante_id TEXT,
        status TEXT DEFAULT 'pendente',
        observacoes TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (solicitante_id) REFERENCES usuarios (id)
      )`
    ];

    let tabelasCriadas = 0;
    
    tabelas.forEach((sql, index) => {
      db.run(sql, (err) => {
        if (err) {
          console.error(`❌ Erro ao criar tabela ${index + 1}:`, err);
          reject(err);
          return;
        }
        
        tabelasCriadas++;
        console.log(`✅ Tabela ${index + 1} criada`);
        
        if (tabelasCriadas === tabelas.length) {
          resolve();
        }
      });
    });
  });
};

// Função para criar usuários
const criarUsuarios = () => {
  return new Promise((resolve, reject) => {
    console.log('👥 Criando usuários...');
    
    const usuarios = [
      {
        id: '550e8400-e29b-41d4-a716-446655440001',
        email: 'ariela@vidamais.com',
        senha_hash: bcrypt.hashSync('ariela123', 10),
        nome: 'Ariela',
        perfil: 'ariela',
        ativo: 1
      },
      {
        id: '550e8400-e29b-41d4-a716-446655440002',
        email: 'estagiario@vidamais.com',
        senha_hash: bcrypt.hashSync('estagiario123', 10),
        nome: 'Estagiário Ariela',
        perfil: 'estagiario',
        ativo: 1
      },
      {
        id: '550e8400-e29b-41d4-a716-446655440003',
        email: 'sonia@vidamais.com',
        senha_hash: bcrypt.hashSync('sonia123', 10),
        nome: 'Sonia',
        perfil: 'sonia',
        ativo: 1
      },
      {
        id: '550e8400-e29b-41d4-a716-446655440004',
        email: 'ze@vidamais.com',
        senha_hash: bcrypt.hashSync('ze123', 10),
        nome: 'Zé',
        perfil: 'ze',
        ativo: 1
      },
      {
        id: '550e8400-e29b-41d4-a716-446655440005',
        email: 'renata@vidamais.com',
        senha_hash: bcrypt.hashSync('renata123', 10),
        nome: 'Renata',
        perfil: 'renata',
        ativo: 1
      },
      {
        id: '550e8400-e29b-41d4-a716-446655440006',
        email: 'admin@vidamais.com',
        senha_hash: bcrypt.hashSync('admin123', 10),
        nome: 'Administrador',
        perfil: 'admin',
        ativo: 1
      }
    ];

    let usuariosCriados = 0;
    
    usuarios.forEach((usuario) => {
      const sql = `INSERT OR REPLACE INTO usuarios (id, email, senha_hash, nome, perfil, ativo) VALUES (?, ?, ?, ?, ?, ?)`;
      
      db.run(sql, [usuario.id, usuario.email, usuario.senha_hash, usuario.nome, usuario.perfil, usuario.ativo], (err) => {
        if (err) {
          console.error(`❌ Erro ao criar usuário ${usuario.nome}:`, err);
          reject(err);
          return;
        }
        
        usuariosCriados++;
        console.log(`✅ Usuário ${usuario.nome} criado`);
        
        if (usuariosCriados === usuarios.length) {
          resolve();
        }
      });
    });
  });
};

// Função para criar projetos
const criarProjetos = () => {
  return new Promise((resolve, reject) => {
    console.log('🏗️  Criando projetos...');
    
    const projetos = [
      {
        id: '550e8400-e29b-41d4-a716-446655440007',
        nome: 'Projeto Vida Mais',
        descricao: 'Projeto principal da organização',
        orcamento_anual: 500000.00,
        ativo: 1
      },
      {
        id: '550e8400-e29b-41d4-a716-446655440008',
        nome: 'Projeto Educacional',
        descricao: 'Projeto de bolsas de estudo',
        orcamento_anual: 200000.00,
        ativo: 1
      }
    ];

    let projetosCriados = 0;
    
    projetos.forEach((projeto) => {
      const sql = `INSERT OR REPLACE INTO projetos (id, nome, descricao, orcamento_anual, ativo) VALUES (?, ?, ?, ?, ?)`;
      
      db.run(sql, [projeto.id, projeto.nome, projeto.descricao, projeto.orcamento_anual, projeto.ativo], (err) => {
        if (err) {
          console.error(`❌ Erro ao criar projeto ${projeto.nome}:`, err);
          reject(err);
          return;
        }
        
        projetosCriados++;
        console.log(`✅ Projeto ${projeto.nome} criado`);
        
        if (projetosCriados === projetos.length) {
          resolve();
        }
      });
    });
  });
};

// Função principal
const inicializarBanco = async () => {
  try {
    await criarTabelas();
    await criarUsuarios();
    await criarProjetos();
    
    console.log('🎉 Banco de dados inicializado com sucesso!');
    console.log('📊 Usuários de teste criados:');
    console.log('   - ariela@vidamais.com / ariela123');
    console.log('   - estagiario@vidamais.com / estagiario123');
    console.log('   - sonia@vidamais.com / sonia123');
    console.log('   - ze@vidamais.com / ze123');
    console.log('   - renata@vidamais.com / renata123');
    console.log('   - admin@vidamais.com / admin123');
    
    db.close();
    process.exit(0);
  } catch (error) {
    console.error('❌ Erro na inicialização:', error);
    db.close();
    process.exit(1);
  }
};

// Executar se chamado diretamente
if (require.main === module) {
  inicializarBanco();
}

module.exports = { inicializarBanco };
