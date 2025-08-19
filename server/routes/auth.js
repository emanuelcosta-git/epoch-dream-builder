const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const { verificarToken } = require('../middleware/auth');

const router = express.Router();
const dbPath = path.join(__dirname, '../database/vida-mais.db');

// Login
router.post('/login', (req, res) => {
  const { email, senha } = req.body;

  if (!email || !senha) {
    return res.status(400).json({ error: 'Email e senha são obrigatórios' });
  }

  const db = new sqlite3.Database(dbPath);
  
  db.get(
    'SELECT id, nome, email, senha, perfil FROM usuarios WHERE email = ? AND ativo = 1',
    [email],
    (err, usuario) => {
      db.close();
      
      if (err) {
        return res.status(500).json({ error: 'Erro interno do servidor' });
      }
      
      if (!usuario) {
        return res.status(401).json({ error: 'Usuário não encontrado ou inativo' });
      }
      
      const senhaValida = bcrypt.compareSync(senha, usuario.senha);
      
      if (!senhaValida) {
        return res.status(401).json({ error: 'Senha incorreta' });
      }
      
      const token = jwt.sign(
        { 
          id: usuario.id, 
          email: usuario.email, 
          perfil: usuario.perfil 
        },
        process.env.JWT_SECRET || 'vidamais-secret-key',
        { expiresIn: '24h' }
      );
      
      res.json({
        token,
        usuario: {
          id: usuario.id,
          nome: usuario.nome,
          email: usuario.email,
          perfil: usuario.perfil
        }
      });
    }
  );
});

// Verificar token
router.get('/verificar', verificarToken, (req, res) => {
  const db = new sqlite3.Database(dbPath);
  
  db.get(
    'SELECT id, nome, email, perfil FROM usuarios WHERE id = ? AND ativo = 1',
    [req.usuario.id],
    (err, usuario) => {
      db.close();
      
      if (err) {
        return res.status(500).json({ error: 'Erro interno do servidor' });
      }
      
      if (!usuario) {
        return res.status(401).json({ error: 'Usuário não encontrado' });
      }
      
      res.json({ usuario });
    }
  );
});

// Alterar senha
router.put('/alterar-senha', verificarToken, (req, res) => {
  const { senhaAtual, novaSenha } = req.body;
  
  if (!senhaAtual || !novaSenha) {
    return res.status(400).json({ error: 'Senha atual e nova senha são obrigatórias' });
  }
  
  if (novaSenha.length < 6) {
    return res.status(400).json({ error: 'Nova senha deve ter pelo menos 6 caracteres' });
  }
  
  const db = new sqlite3.Database(dbPath);
  
  db.get(
    'SELECT senha FROM usuarios WHERE id = ?',
    [req.usuario.id],
    (err, usuario) => {
      if (err) {
        db.close();
        return res.status(500).json({ error: 'Erro interno do servidor' });
      }
      
      const senhaValida = bcrypt.compareSync(senhaAtual, usuario.senha);
      
      if (!senhaValida) {
        db.close();
        return res.status(401).json({ error: 'Senha atual incorreta' });
      }
      
      const novaSenhaHash = bcrypt.hashSync(novaSenha, 10);
      
      db.run(
        'UPDATE usuarios SET senha = ? WHERE id = ?',
        [novaSenhaHash, req.usuario.id],
        function(err) {
          db.close();
          
          if (err) {
            return res.status(500).json({ error: 'Erro ao alterar senha' });
          }
          
          res.json({ message: 'Senha alterada com sucesso' });
        }
      );
    }
  );
});

module.exports = router;
