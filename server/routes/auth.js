const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const { verificarToken } = require('../middleware/auth');

const router = express.Router();

// Caminho para o banco
const dbPath = path.join(__dirname, '../database/vida_mais.db');
const db = new sqlite3.Database(dbPath);

// POST /api/auth/login
router.post('/login', (req, res) => {
  try {
    const { email, senha } = req.body;

    if (!email || !senha) {
      return res.status(400).json({ error: 'Email e senha são obrigatórios' });
    }

    // Buscar usuário no SQLite
    const sql = `SELECT * FROM usuarios WHERE email = ? AND ativo = 1`;
    
    db.get(sql, [email.toLowerCase()], async (err, usuario) => {
      if (err) {
        console.error('❌ Erro ao buscar usuário:', err);
        return res.status(500).json({ error: 'Erro interno do servidor' });
      }

      if (!usuario) {
        return res.status(401).json({ error: 'Credenciais inválidas' });
      }

      // Verificar senha
      const senhaValida = await bcrypt.compare(senha, usuario.senha_hash);
      if (!senhaValida) {
        return res.status(401).json({ error: 'Credenciais inválidas' });
      }

      // Gerar JWT
      const token = jwt.sign(
        { 
          id: usuario.id, 
          email: usuario.email, 
          perfil: usuario.perfil,
          nome: usuario.nome
        },
        process.env.JWT_SECRET || 'vidamais-secret-key',
        { expiresIn: '24h' }
      );

      // Retornar dados do usuário (sem senha)
      const { senha_hash, ...usuarioSemSenha } = usuario;

      res.json({
        message: 'Login realizado com sucesso',
        token,
        usuario: usuarioSemSenha
      });
    });

  } catch (error) {
    console.error('❌ Erro no login:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// GET /api/auth/verificar
router.get('/verificar', verificarToken, (req, res) => {
  try {
    const { id } = req.usuario;

    // Buscar usuário atualizado
    const sql = `SELECT id, email, nome, perfil, ativo FROM usuarios WHERE id = ? AND ativo = 1`;
    
    db.get(sql, [id], (err, usuario) => {
      if (err) {
        console.error('❌ Erro ao buscar usuário:', err);
        return res.status(500).json({ error: 'Erro interno do servidor' });
      }

      if (!usuario) {
        return res.status(401).json({ error: 'Usuário não encontrado ou inativo' });
      }

      res.json({
        message: 'Token válido',
        usuario: usuario
      });
    });

  } catch (error) {
    console.error('❌ Erro ao verificar token:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// PUT /api/auth/alterar-senha
router.put('/alterar-senha', verificarToken, (req, res) => {
  try {
    const { id } = req.usuario;
    const { senhaAtual, novaSenha } = req.body;

    if (!senhaAtual || !novaSenha) {
      return res.status(400).json({ error: 'Senha atual e nova senha são obrigatórias' });
    }

    if (novaSenha.length < 6) {
      return res.status(400).json({ error: 'Nova senha deve ter pelo menos 6 caracteres' });
    }

    // Buscar usuário atual
    const sql = `SELECT senha_hash FROM usuarios WHERE id = ?`;
    
    db.get(sql, [id], async (err, usuario) => {
      if (err || !usuario) {
        console.error('❌ Erro ao buscar usuário:', err);
        return res.status(404).json({ error: 'Usuário não encontrado' });
      }

      // Verificar senha atual
      const senhaAtualValida = await bcrypt.compare(senhaAtual, usuario.senha_hash);
      if (!senhaAtualValida) {
        return res.status(401).json({ error: 'Senha atual incorreta' });
      }

      // Hash da nova senha
      const novaSenhaHash = await bcrypt.hash(novaSenha, 10);

      // Atualizar senha
      const updateSql = `UPDATE usuarios SET senha_hash = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?`;
      
      db.run(updateSql, [novaSenhaHash, id], (err) => {
        if (err) {
          console.error('❌ Erro ao atualizar senha:', err);
          return res.status(500).json({ error: 'Erro ao atualizar senha' });
        }

        res.json({ message: 'Senha alterada com sucesso' });
      });
    });

  } catch (error) {
    console.error('❌ Erro ao alterar senha:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

module.exports = router;
