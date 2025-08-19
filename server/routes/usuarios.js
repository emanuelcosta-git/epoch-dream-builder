const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const { verificarToken, verificarPerfil } = require('../middleware/auth');

const router = express.Router();
const dbPath = path.join(__dirname, '../database/vida-mais.db');

// ===== USUÁRIOS =====

// Listar usuários (Apenas Admin)
router.get('/', verificarToken, verificarPerfil(['admin']), (req, res) => {
  const db = new sqlite3.Database(dbPath);
  
  db.all(
    'SELECT id, nome, email, perfil, ativo, criado_em FROM usuarios ORDER BY nome',
    [],
    (err, usuarios) => {
      db.close();
      
      if (err) {
        return res.status(500).json({ error: 'Erro ao buscar usuários' });
      }
      
      res.json(usuarios);
    }
  );
});

// Obter perfil do usuário logado
router.get('/perfil', verificarToken, (req, res) => {
  const db = new sqlite3.Database(dbPath);
  
  db.get(
    'SELECT id, nome, email, perfil, ativo, criado_em FROM usuarios WHERE id = ?',
    [req.usuario.id],
    (err, usuario) => {
      db.close();
      
      if (err) {
        return res.status(500).json({ error: 'Erro ao buscar perfil' });
      }
      
      if (!usuario) {
        return res.status(404).json({ error: 'Usuário não encontrado' });
      }
      
      res.json(usuario);
    }
  );
});

// Criar usuário (Apenas Admin)
router.post('/', verificarToken, verificarPerfil(['admin']), (req, res) => {
  const { nome, email, senha, perfil } = req.body;
  
  if (!nome || !email || !senha || !perfil) {
    return res.status(400).json({ error: 'Todos os campos são obrigatórios' });
  }
  
  if (!['ariela', 'estagiario', 'sonia', 'ze', 'renata', 'admin'].includes(perfil)) {
    return res.status(400).json({ error: 'Perfil inválido' });
  }
  
  const bcrypt = require('bcryptjs');
  const senhaHash = bcrypt.hashSync(senha, 10);
  
  const db = new sqlite3.Database(dbPath);
  
  db.run(
    'INSERT INTO usuarios (nome, email, senha, perfil) VALUES (?, ?, ?, ?)',
    [nome, email, senhaHash, perfil],
    function(err) {
      db.close();
      
      if (err) {
        if (err.code === 'SQLITE_CONSTRAINT_UNIQUE') {
          return res.status(400).json({ error: 'Email já cadastrado' });
        }
        return res.status(500).json({ error: 'Erro ao criar usuário' });
      }
      
      res.status(201).json({ 
        id: this.lastID,
        message: 'Usuário criado com sucesso' 
      });
    }
  );
});

// Atualizar usuário (Apenas Admin ou próprio usuário)
router.put('/:id', verificarToken, (req, res) => {
  const { id } = req.params;
  const { nome, email, perfil, ativo } = req.body;
  
  // Verificar se é admin ou se está editando próprio perfil
  if (req.usuario.perfil !== 'admin' && req.usuario.id !== parseInt(id)) {
    return res.status(403).json({ error: 'Acesso negado' });
  }
  
  const db = new sqlite3.Database(dbPath);
  
  let query = 'UPDATE usuarios SET nome = ?, email = ?';
  const params = [nome, email];
  
  if (req.usuario.perfil === 'admin') {
    query += ', perfil = ?, ativo = ?';
    params.push(perfil, ativo);
  }
  
  query += ' WHERE id = ?';
  params.push(id);
  
  db.run(query, params, function(err) {
    db.close();
    
    if (err) {
      return res.status(500).json({ error: 'Erro ao atualizar usuário' });
    }
    
    if (this.changes === 0) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }
    
    res.json({ message: 'Usuário atualizado com sucesso' });
  });
});

// ===== PROJETOS =====

// Listar projetos
router.get('/projetos', verificarToken, (req, res) => {
  const db = new sqlite3.Database(dbPath);
  
  db.all(
    'SELECT id, nome, descricao, orcamento_anual, ativo, criado_em FROM projetos WHERE ativo = 1 ORDER BY nome',
    [],
    (err, projetos) => {
      db.close();
      
      if (err) {
        return res.status(500).json({ error: 'Erro ao buscar projetos' });
      }
      
      res.json(projetos);
    }
  );
});

// Criar projeto (Apenas Admin)
router.post('/projetos', verificarToken, verificarPerfil(['admin']), (req, res) => {
  const { nome, descricao, orcamento_anual } = req.body;
  
  if (!nome) {
    return res.status(400).json({ error: 'Nome do projeto é obrigatório' });
  }
  
  const db = new sqlite3.Database(dbPath);
  
  db.run(
    'INSERT INTO projetos (nome, descricao, orcamento_anual) VALUES (?, ?, ?)',
    [nome, descricao, orcamento_anual],
    function(err) {
      db.close();
      
      if (err) {
        return res.status(500).json({ error: 'Erro ao criar projeto' });
      }
      
      res.status(201).json({ 
        id: this.lastID,
        message: 'Projeto criado com sucesso' 
      });
    }
  );
});

// Atualizar projeto (Apenas Admin)
router.put('/projetos/:id', verificarToken, verificarPerfil(['admin']), (req, res) => {
  const { id } = req.params;
  const { nome, descricao, orcamento_anual, ativo } = req.body;
  
  const db = new sqlite3.Database(dbPath);
  
  db.run(
    'UPDATE projetos SET nome = ?, descricao = ?, orcamento_anual = ?, ativo = ? WHERE id = ?',
    [nome, descricao, orcamento_anual, ativo, id],
    function(err) {
      db.close();
      
      if (err) {
        return res.status(500).json({ error: 'Erro ao atualizar projeto' });
      }
      
      if (this.changes === 0) {
        return res.status(404).json({ error: 'Projeto não encontrado' });
      }
      
      res.json({ message: 'Projeto atualizado com sucesso' });
    }
  );
});

// ===== DASHBOARD =====

// Estatísticas do dashboard
router.get('/dashboard', verificarToken, (req, res) => {
  const db = new sqlite3.Database(dbPath);
  
  const mesAtual = new Date().toLocaleString('pt-BR', { month: 'long' });
  const anoAtual = new Date().getFullYear();
  
  // Total de pagamentos fixos mensais
  db.get(
    'SELECT SUM(valor) as total FROM pagamentos_fixos WHERE ativo = 1',
    [],
    (err, fixos) => {
      if (err) {
        db.close();
        return res.status(500).json({ error: 'Erro ao buscar estatísticas' });
      }
      
      // Total de pagamentos variáveis do mês atual
      db.get(
        'SELECT SUM(valor) as total FROM pagamentos_variaveis WHERE mes_referencia = ? AND ano_referencia = ? AND status = "aprovado"',
        [mesAtual, anoAtual],
        (err, variaveis) => {
          if (err) {
            db.close();
            return res.status(500).json({ error: 'Erro ao buscar estatísticas' });
          }
          
          // Pagamentos pendentes de aprovação
          db.get(
            'SELECT COUNT(*) as total FROM pagamentos_variaveis WHERE status = "pendente"',
            [],
            (err, pendentes) => {
              db.close();
              
              if (err) {
                return res.status(500).json({ error: 'Erro ao buscar estatísticas' });
              }
              
              res.json({
                mesAtual,
                anoAtual,
                totalFixos: parseFloat(fixos.total || 0).toFixed(2),
                totalVariaveis: parseFloat(variaveis.total || 0).toFixed(2),
                totalGeral: (parseFloat(fixos.total || 0) + parseFloat(variaveis.total || 0)).toFixed(2),
                pendentesAprovacao: pendentes.total
              });
            }
          );
        }
      );
    }
  );
});

module.exports = router;
