const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const XLSX = require('xlsx');
const nodemailer = require('nodemailer');
const { verificarToken, verificarPerfil } = require('../middleware/auth');

const router = express.Router();
const dbPath = path.join(__dirname, '../database/vida-mais.db');

// ===== RELATÓRIOS EXCEL =====

// Gerar relatório mensal em Excel
router.get('/excel-mensal', verificarToken, verificarPerfil(['ze', 'admin', 'renata']), (req, res) => {
  const { mes, ano } = req.query;
  
  if (!mes || !ano) {
    return res.status(400).json({ error: 'Mês e ano são obrigatórios' });
  }
  
  const db = new sqlite3.Database(dbPath);
  
  // Buscar pagamentos fixos
  db.all(
    'SELECT * FROM pagamentos_fixos WHERE ativo = 1',
    [],
    (err, pagamentosFixos) => {
      if (err) {
        db.close();
        return res.status(500).json({ error: 'Erro ao buscar pagamentos fixos' });
      }
      
      // Buscar pagamentos variáveis aprovados
      db.all(
        'SELECT * FROM pagamentos_variaveis WHERE mes_referencia = ? AND ano_referencia = ? AND status = "aprovado"',
        [mes, ano],
        (err, pagamentosVariaveis) => {
          db.close();
          
          if (err) {
            return res.status(500).json({ error: 'Erro ao buscar pagamentos variáveis' });
          }
          
          // Preparar dados para Excel
          const dados = [];
          
          // Pagamentos fixos
          pagamentosFixos.forEach(pf => {
            dados.push({
              'Tipo': 'Fixo',
              'Descrição': pf.descricao,
              'Valor': pf.valor,
              'Classificação': pf.tipo,
              'Fornecedor': pf.fornecedor || '',
              'Dia Vencimento': pf.dia_vencimento,
              'Observações': pf.observacoes || ''
            });
          });
          
          // Pagamentos variáveis
          pagamentosVariaveis.forEach(pv => {
            dados.push({
              'Tipo': 'Variável',
              'Descrição': pv.descricao,
              'Valor': pv.valor,
              'Classificação': pv.classificacao,
              'Fornecedor': pv.fornecedor || '',
              'Data Pagamento': pv.data_pagamento,
              'NF': pv.numero_nf || '',
              'Observações': pv.observacoes || ''
            });
          });
          
          // Calcular totais
          const totalFixos = pagamentosFixos.reduce((sum, pf) => sum + parseFloat(pf.valor), 0);
          const totalVariaveis = pagamentosVariaveis.reduce((sum, pv) => sum + parseFloat(pv.valor), 0);
          const totalGeral = totalFixos + totalVariaveis;
          
          // Adicionar linha de totais
          dados.push({
            'Tipo': 'TOTAL',
            'Descrição': '',
            'Valor': totalGeral.toFixed(2),
            'Classificação': '',
            'Fornecedor': '',
            'Dia Vencimento': '',
            'Observações': ''
          });
          
          // Criar workbook
          const wb = XLSX.utils.book_new();
          const ws = XLSX.utils.json_to_sheet(dados);
          
          // Configurar colunas
          const colWidths = [
            { wch: 10 }, // Tipo
            { wch: 40 }, // Descrição
            { wch: 15 }, // Valor
            { wch: 20 }, // Classificação
            { wch: 25 }, // Fornecedor
            { wch: 15 }, // Dia/Data
            { wch: 30 }  // Observações
          ];
          ws['!cols'] = colWidths;
          
          // Adicionar planilha ao workbook
          XLSX.utils.book_append_sheet(wb, ws, `${mes}_${ano}`);
          
          // Gerar buffer
          const buffer = XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' });
          
          // Configurar headers para download
          res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
          res.setHeader('Content-Disposition', `attachment; filename=relatorio_${mes}_${ano}.xlsx`);
          res.setHeader('Content-Length', buffer.length);
          
          res.send(buffer);
        }
      );
    }
  );
});

// Gerar relatório anual consolidado
router.get('/excel-anual', verificarToken, verificarPerfil(['ze', 'admin', 'renata']), (req, res) => {
  const { ano } = req.query;
  
  if (!ano) {
    return res.status(400).json({ error: 'Ano é obrigatório' });
  }
  
  const db = new sqlite3.Database(dbPath);
  
  // Buscar todos os pagamentos do ano
  const query = `
    SELECT 
      pv.mes_referencia,
      pv.classificacao,
      SUM(pv.valor) as total_mes,
      COUNT(*) as quantidade
    FROM pagamentos_variaveis pv
    WHERE pv.ano_referencia = ? AND pv.status = 'aprovado'
    GROUP BY pv.mes_referencia, pv.classificacao
    ORDER BY 
      CASE pv.mes_referencia
        WHEN 'janeiro' THEN 1
        WHEN 'fevereiro' THEN 2
        WHEN 'março' THEN 3
        WHEN 'abril' THEN 4
        WHEN 'maio' THEN 5
        WHEN 'junho' THEN 6
        WHEN 'julho' THEN 7
        WHEN 'agosto' THEN 8
        WHEN 'setembro' THEN 9
        WHEN 'outubro' THEN 10
        WHEN 'novembro' THEN 11
        WHEN 'dezembro' THEN 12
      END,
      pv.classificacao
  `;
  
  db.all(query, [ano], (err, dados) => {
    db.close();
    
    if (err) {
      return res.status(500).json({ error: 'Erro ao gerar relatório anual' });
    }
    
    // Organizar dados por mês
    const meses = [
      'janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho',
      'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'
    ];
    
    const dadosOrganizados = [];
    let totalAnual = 0;
    
    meses.forEach(mes => {
      const dadosMes = dados.filter(d => d.mes_referencia === mes);
      
      if (dadosMes.length > 0) {
        const totalMes = dadosMes.reduce((sum, d) => sum + parseFloat(d.total_mes), 0);
        totalAnual += totalMes;
        
        dadosMes.forEach(d => {
          dadosOrganizados.push({
            'Mês': mes.charAt(0).toUpperCase() + mes.slice(1),
            'Classificação': d.classificacao,
            'Valor': parseFloat(d.total_mes).toFixed(2),
            'Quantidade': d.quantidade
          });
        });
        
        // Adicionar subtotal do mês
        dadosOrganizados.push({
          'Mês': mes.charAt(0).toUpperCase() + mes.slice(1),
          'Classificação': 'SUBTOTAL',
          'Valor': totalMes.toFixed(2),
          'Quantidade': ''
        });
        
        dadosOrganizados.push({
          'Mês': '',
          'Classificação': '',
          'Valor': '',
          'Quantidade': ''
        });
      }
    });
    
    // Adicionar total anual
    dadosOrganizados.push({
      'Mês': 'TOTAL ANUAL',
      'Classificação': '',
      'Valor': totalAnual.toFixed(2),
      'Quantidade': ''
    });
    
    // Criar workbook
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(dadosOrganizados);
    
    // Configurar colunas
    ws['!cols'] = [
      { wch: 15 }, // Mês
      { wch: 25 }, // Classificação
      { wch: 15 }, // Valor
      { wch: 12 }  // Quantidade
    ];
    
    XLSX.utils.book_append_sheet(wb, ws, `Relatorio_${ano}`);
    
    // Gerar buffer
    const buffer = XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' });
    
    // Configurar headers para download
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename=relatorio_anual_${ano}.xlsx`);
    res.setHeader('Content-Length', buffer.length);
    
    res.send(buffer);
  });
});

// ===== ENVIO DE E-MAIL =====

// Enviar relatório mensal por e-mail
router.post('/enviar-email', verificarToken, verificarPerfil(['ariela', 'admin']), (req, res) => {
  const { mes, ano, destinatarios } = req.body;
  
  if (!mes || !ano || !destinatarios || !Array.isArray(destinatarios)) {
    return res.status(400).json({ error: 'Mês, ano e destinatários são obrigatórios' });
  }
  
  // Configurar transporter de e-mail (exemplo com Gmail)
  const transporter = nodemailer.createTransporter({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER || 'vidamais@gmail.com',
      pass: process.env.EMAIL_PASS || 'sua-senha-app'
    }
  });
  
  // Gerar relatório
  const db = new sqlite3.Database(dbPath);
  
  db.all(
    'SELECT * FROM pagamentos_variaveis WHERE mes_referencia = ? AND ano_referencia = ? AND status = "aprovado"',
    [mes, ano],
    (err, pagamentos) => {
      db.close();
      
      if (err) {
        return res.status(500).json({ error: 'Erro ao gerar relatório' });
      }
      
      const total = pagamentos.reduce((sum, p) => sum + parseFloat(p.valor), 0);
      
      // Criar HTML do e-mail
      const html = `
        <h2>Relatório Mensal de Pagamentos - ${mes.charAt(0).toUpperCase() + mes.slice(1)}/${ano}</h2>
        <p>Prezados,</p>
        <p>Segue o relatório de pagamentos do mês de ${mes}/${ano}:</p>
        
        <h3>Resumo:</h3>
        <ul>
          <li>Total de pagamentos: ${pagamentos.length}</li>
          <li>Valor total: R$ ${total.toFixed(2)}</li>
        </ul>
        
        <h3>Detalhamento:</h3>
        <table border="1" style="border-collapse: collapse; width: 100%;">
          <tr style="background-color: #f0f0f0;">
            <th>Descrição</th>
            <th>Valor</th>
            <th>Classificação</th>
            <th>Fornecedor</th>
          </tr>
          ${pagamentos.map(p => `
            <tr>
              <td>${p.descricao}</td>
              <td>R$ ${parseFloat(p.valor).toFixed(2)}</td>
              <td>${p.classificacao}</td>
              <td>${p.fornecedor || '-'}</td>
            </tr>
          `).join('')}
        </table>
        
        <p>Atenciosamente,<br>Sistema Vida Mais</p>
      `;
      
      // Configurar e-mail
      const mailOptions = {
        from: process.env.EMAIL_USER || 'vidamais@gmail.com',
        to: destinatarios.join(', '),
        subject: `Relatório de Pagamentos - ${mes.charAt(0).toUpperCase() + mes.slice(1)}/${ano}`,
        html: html
      };
      
      // Enviar e-mail
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.error('Erro ao enviar e-mail:', error);
          return res.status(500).json({ error: 'Erro ao enviar e-mail' });
        }
        
        res.json({ 
          message: 'E-mail enviado com sucesso',
          messageId: info.messageId
        });
      });
    }
  );
});

module.exports = router;
