const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const { verificarToken, verificarPerfil } = require('../middleware/auth');

const router = express.Router();
const dbPath = path.join(__dirname, '../database/vida-mais.db');

// ===== PAGAMENTOS FIXOS =====

// Listar pagamentos fixos
router.get('/fixos', verificarToken, (req, res) => {
  const db = new sqlite3.Database(dbPath);
  
  const query = `
    SELECT pf.*, p.nome as projeto_nome, u.nome as criado_por_nome
    FROM pagamentos_fixos pf
    LEFT JOIN projetos p ON pf.projeto_id = p.id
    LEFT JOIN usuarios u ON pf.criado_por = u.id
    WHERE pf.ativo = 1
    ORDER BY pf.dia_vencimento, pf.descricao
  `;
  
  db.all(query, [], (err, pagamentos) => {
    db.close();
    
    if (err) {
      return res.status(500).json({ error: 'Erro ao buscar pagamentos fixos' });
    }
    
    res.json(pagamentos);
  });
});

// Criar pagamento fixo (Apenas Ariela e Admin)
router.post('/fixos', verificarToken, verificarPerfil(['ariela', 'admin']), (req, res) => {
  const {
    descricao,
    valor,
    tipo,
    projeto_id,
    fornecedor,
    conta_bancaria,
    dia_vencimento,
    observacoes
  } = req.body;
  
  if (!descricao || !valor || !tipo || !dia_vencimento) {
    return res.status(400).json({ error: 'Campos obrigatórios não preenchidos' });
  }
  
  const db = new sqlite3.Database(dbPath);
  
  const query = `
    INSERT INTO pagamentos_fixos 
    (descricao, valor, tipo, projeto_id, fornecedor, conta_bancaria, dia_vencimento, observacoes, criado_por)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;
  
  db.run(query, [
    descricao, valor, tipo, projeto_id || null, fornecedor, conta_bancaria, 
    dia_vencimento, observacoes, req.usuario.id
  ], function(err) {
    db.close();
    
    if (err) {
      return res.status(500).json({ error: 'Erro ao criar pagamento fixo' });
    }
    
    res.status(201).json({ 
      id: this.lastID,
      message: 'Pagamento fixo criado com sucesso' 
    });
  });
});

// Atualizar pagamento fixo
router.put('/fixos/:id', verificarToken, verificarPerfil(['ariela', 'admin']), (req, res) => {
  const { id } = req.params;
  const {
    descricao,
    valor,
    tipo,
    projeto_id,
    fornecedor,
    conta_bancaria,
    dia_vencimento,
    observacoes,
    ativo
  } = req.body;
  
  const db = new sqlite3.Database(dbPath);
  
  const query = `
    UPDATE pagamentos_fixos SET
    descricao = ?, valor = ?, tipo = ?, projeto_id = ?, fornecedor = ?,
    conta_bancaria = ?, dia_vencimento = ?, observacoes = ?, ativo = ?
    WHERE id = ?
  `;
  
  db.run(query, [
    descricao, valor, tipo, projeto_id || null, fornecedor, conta_bancaria,
    dia_vencimento, observacoes, ativo, id
  ], function(err) {
    db.close();
    
    if (err) {
      return res.status(500).json({ error: 'Erro ao atualizar pagamento fixo' });
    }
    
    if (this.changes === 0) {
      return res.status(404).json({ error: 'Pagamento fixo não encontrado' });
    }
    
    res.json({ message: 'Pagamento fixo atualizado com sucesso' });
  });
});

// ===== PAGAMENTOS VARIÁVEIS =====

// Listar pagamentos variáveis
router.get('/variaveis', verificarToken, (req, res) => {
  const { mes, ano, projeto_id, status } = req.query;
  const db = new sqlite3.Database(dbPath);
  
  let query = `
    SELECT pv.*, p.nome as projeto_nome, u1.nome as criado_por_nome, u2.nome as aprovado_por_nome
    FROM pagamentos_variaveis pv
    LEFT JOIN projetos p ON pv.projeto_id = p.id
    LEFT JOIN usuarios u1 ON pv.criado_por = u1.id
    LEFT JOIN usuarios u2 ON pv.aprovado_por = u2.id
    WHERE 1=1
  `;
  
  const params = [];
  
  if (mes) {
    query += ' AND pv.mes_referencia = ?';
    params.push(mes);
  }
  
  if (ano) {
    query += ' AND pv.ano_referencia = ?';
    params.push(ano);
  }
  
  if (projeto_id) {
    query += ' AND pv.projeto_id = ?';
    params.push(projeto_id);
  }
  
  if (status) {
    query += ' AND pv.status = ?';
    params.push(status);
  }
  
  query += ' ORDER BY pv.data_pagamento DESC, pv.descricao';
  
  db.all(query, params, (err, pagamentos) => {
    db.close();
    
    if (err) {
      return res.status(500).json({ error: 'Erro ao buscar pagamentos variáveis' });
    }
    
    res.json(pagamentos);
  });
});

// Criar pagamento variável (Apenas Estagiário, Ariela e Admin)
router.post('/variaveis', verificarToken, verificarPerfil(['estagiario', 'ariela', 'admin']), (req, res) => {
  const {
    descricao,
    valor,
    data_pagamento,
    mes_referencia,
    ano_referencia,
    classificacao,
    projeto_id,
    fornecedor,
    numero_nf,
    observacoes
  } = req.body;
  
  if (!descricao || !valor || !data_pagamento || !mes_referencia || !ano_referencia || !classificacao) {
    return res.status(400).json({ error: 'Campos obrigatórios não preenchidos' });
  }
  
  // Verificar se precisa de aprovação (valores acima de R$ 1000)
  const precisaAprovacao = parseFloat(valor) > 1000;
  const status = precisaAprovacao ? 'pendente' : 'aprovado';
  
  const db = new sqlite3.Database(dbPath);
  
  const query = `
    INSERT INTO pagamentos_variaveis 
    (descricao, valor, data_pagamento, mes_referencia, ano_referencia, classificacao,
     projeto_id, fornecedor, numero_nf, observacoes, status, criado_por)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;
  
  db.run(query, [
    descricao, valor, data_pagamento, mes_referencia, ano_referencia, classificacao,
    projeto_id || null, fornecedor, numero_nf, observacoes, status, req.usuario.id
  ], function(err) {
    db.close();
    
    if (err) {
      return res.status(500).json({ error: 'Erro ao criar pagamento variável' });
    }
    
    const message = precisaAprovacao 
      ? 'Pagamento variável criado e aguardando aprovação da Renata'
      : 'Pagamento variável criado com sucesso';
    
    res.status(201).json({ 
      id: this.lastID,
      message,
      precisaAprovacao
    });
  });
});

// Aprovar/rejeitar pagamento variável (Apenas Renata e Admin)
router.put('/variaveis/:id/status', verificarToken, verificarPerfil(['renata', 'admin']), (req, res) => {
  const { id } = req.params;
  const { status, observacoes } = req.body;
  
  if (!['aprovado', 'rejeitado'].includes(status)) {
    return res.status(400).json({ error: 'Status inválido' });
  }
  
  const db = new sqlite3.Database(dbPath);
  
  db.run(
    'UPDATE pagamentos_variaveis SET status = ?, aprovado_por = ? WHERE id = ?',
    [status, req.usuario.id, id],
    function(err) {
      if (err) {
        db.close();
        return res.status(500).json({ error: 'Erro ao atualizar status' });
      }
      
      if (this.changes === 0) {
        db.close();
        return res.status(404).json({ error: 'Pagamento não encontrado' });
      }
      
      // Registrar log de aprovação
      db.run(
        'INSERT INTO logs_aprovacao (pagamento_id, pagamento_tipo, acao, observacoes, aprovado_por) VALUES (?, ?, ?, ?, ?)',
        [id, 'variavel', status, observacoes, req.usuario.id],
        function(err) {
          db.close();
          
          if (err) {
            console.error('Erro ao registrar log:', err);
          }
          
          res.json({ 
            message: `Pagamento ${status === 'aprovado' ? 'aprovado' : 'rejeitado'} com sucesso` 
          });
        }
      );
    }
  );
});

// ===== RELATÓRIOS =====

// Relatório mensal de pagamentos
router.get('/relatorio-mensal', verificarToken, (req, res) => {
  const { mes, ano } = req.query;
  
  if (!mes || !ano) {
    return res.status(400).json({ error: 'Mês e ano são obrigatórios' });
  }
  
  const db = new sqlite3.Database(dbPath);
  
  const query = `
    SELECT 
      'Fixo' as tipo,
      pf.descricao,
      pf.valor,
      pf.tipo as classificacao,
      p.nome as projeto,
      pf.fornecedor,
      pf.observacoes
    FROM pagamentos_fixos pf
    LEFT JOIN projetos p ON pf.projeto_id = p.id
    WHERE pf.ativo = 1
    
    UNION ALL
    
    SELECT 
      'Variável' as tipo,
      pv.descricao,
      pv.valor,
      pv.classificacao,
      p.nome as projeto,
      pv.fornecedor,
      pv.observacoes
    FROM pagamentos_variaveis pv
    LEFT JOIN projetos p ON pv.projeto_id = p.id
    WHERE pv.mes_referencia = ? AND pv.ano_referencia = ? AND pv.status = 'aprovado'
    
    ORDER BY tipo, valor DESC
  `;
  
  db.all(query, [mes, ano], (err, pagamentos) => {
    db.close();
    
    if (err) {
      return res.status(500).json({ error: 'Erro ao gerar relatório' });
    }
    
    const total = pagamentos.reduce((sum, p) => sum + parseFloat(p.valor), 0);
    
    res.json({
      mes,
      ano,
      pagamentos,
      total: total.toFixed(2),
      quantidade: pagamentos.length
    });
  });
});

module.exports = router;
