const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const sqlite3 = require('sqlite3').verbose();
const { verificarToken } = require('../middleware/auth');

const router = express.Router();
const dbPath = path.join(__dirname, '../database/vida-mais.db');

// Configurar multer para upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../uploads');
    
    // Criar diretório se não existir
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    // Gerar nome único para o arquivo
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + ext);
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB
  },
  fileFilter: (req, file, cb) => {
    // Permitir apenas tipos específicos de arquivo
    const allowedTypes = [
      'image/jpeg',
      'image/png',
      'image/gif',
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    ];
    
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Tipo de arquivo não permitido'), false);
    }
  }
});

// ===== UPLOAD DE ARQUIVOS =====

// Upload de arquivo único
router.post('/arquivo', verificarToken, upload.single('arquivo'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Nenhum arquivo enviado' });
    }
    
    const { pagamento_id, pagamento_tipo } = req.body;
    
    if (!pagamento_id || !pagamento_tipo) {
      return res.status(400).json({ error: 'ID e tipo do pagamento são obrigatórios' });
    }
    
    // Salvar informações do arquivo no banco
    const db = new sqlite3.Database(dbPath);
    
    const query = `
      INSERT INTO anexos 
      (nome_arquivo, caminho_arquivo, tipo_arquivo, tamanho, pagamento_id, pagamento_tipo, criado_por)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;
    
    db.run(query, [
      req.file.originalname,
      req.file.filename,
      req.file.mimetype,
      req.file.size,
      pagamento_id,
      pagamento_tipo,
      req.usuario.id
    ], function(err) {
      db.close();
      
      if (err) {
        // Se der erro, remover arquivo
        fs.unlinkSync(req.file.path);
        return res.status(500).json({ error: 'Erro ao salvar informações do arquivo' });
      }
      
      res.json({
        message: 'Arquivo enviado com sucesso',
        anexo: {
          id: this.lastID,
          nome: req.file.originalname,
          tamanho: req.file.size,
          tipo: req.file.mimetype,
          caminho: req.file.filename
        }
      });
    });
    
  } catch (error) {
    // Se der erro, remover arquivo se existir
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    
    res.status(500).json({ error: 'Erro ao processar upload' });
  }
});

// Upload de múltiplos arquivos
router.post('/multiplos', verificarToken, upload.array('arquivos', 10), (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: 'Nenhum arquivo enviado' });
    }
    
    const { pagamento_id, pagamento_tipo } = req.body;
    
    if (!pagamento_id || !pagamento_tipo) {
      return res.status(400).json({ error: 'ID e tipo do pagamento são obrigatórios' });
    }
    
    const db = new sqlite3.Database(dbPath);
    const anexos = [];
    let erro = false;
    
    // Processar cada arquivo
    req.files.forEach((file, index) => {
      const query = `
        INSERT INTO anexos 
        (nome_arquivo, caminho_arquivo, tipo_arquivo, tamanho, pagamento_id, pagamento_tipo, criado_por)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `;
      
      db.run(query, [
        file.originalname,
        file.filename,
        file.mimetype,
        file.size,
        pagamento_id,
        pagamento_tipo,
        req.usuario.id
      ], function(err) {
        if (err) {
          erro = true;
          // Remover arquivo em caso de erro
          if (fs.existsSync(file.path)) {
            fs.unlinkSync(file.path);
          }
        } else {
          anexos.push({
            id: this.lastID,
            nome: file.originalname,
            tamanho: file.size,
            tipo: file.mimetype,
            caminho: file.filename
          });
        }
        
        // Se for o último arquivo, fechar conexão e responder
        if (index === req.files.length - 1) {
          db.close();
          
          if (erro) {
            res.status(500).json({ error: 'Erro ao processar alguns arquivos' });
          } else {
            res.json({
              message: `${anexos.length} arquivo(s) enviado(s) com sucesso`,
              anexos: anexos
            });
          }
        }
      });
    });
    
  } catch (error) {
    // Remover todos os arquivos em caso de erro
    if (req.files) {
      req.files.forEach(file => {
        if (fs.existsSync(file.path)) {
          fs.unlinkSync(file.path);
        }
      });
    }
    
    res.status(500).json({ error: 'Erro ao processar upload' });
  }
});

// ===== DOWNLOAD DE ARQUIVOS =====

// Download de arquivo
router.get('/download/:filename', verificarToken, (req, res) => {
  const { filename } = req.params;
  const filePath = path.join(__dirname, '../uploads', filename);
  
  // Verificar se arquivo existe
  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: 'Arquivo não encontrado' });
  }
  
  // Buscar informações do arquivo no banco
  const db = new sqlite3.Database(dbPath);
  
  db.get(
    'SELECT * FROM anexos WHERE caminho_arquivo = ?',
    [filename],
    (err, anexo) => {
      db.close();
      
      if (err || !anexo) {
        return res.status(404).json({ error: 'Arquivo não encontrado no banco' });
      }
      
      // Configurar headers para download
      res.setHeader('Content-Type', anexo.tipo_arquivo);
      res.setHeader('Content-Disposition', `attachment; filename="${anexo.nome_arquivo}"`);
      res.setHeader('Content-Length', anexo.tamanho);
      
      // Enviar arquivo
      res.sendFile(filePath);
    }
  );
});

// ===== LISTAR ANEXOS =====

// Listar anexos de um pagamento
router.get('/anexos/:pagamento_id/:tipo', verificarToken, (req, res) => {
  const { pagamento_id, tipo } = req.params;
  
  if (!['fixo', 'variavel'].includes(tipo)) {
    return res.status(400).json({ error: 'Tipo de pagamento inválido' });
  }
  
  const db = new sqlite3.Database(dbPath);
  
  db.all(
    'SELECT * FROM anexos WHERE pagamento_id = ? AND pagamento_tipo = ? ORDER BY criado_em DESC',
    [pagamento_id, tipo],
    (err, anexos) => {
      db.close();
      
      if (err) {
        return res.status(500).json({ error: 'Erro ao buscar anexos' });
      }
      
      res.json(anexos);
    }
  );
});

// ===== REMOVER ANEXOS =====

// Remover anexo
router.delete('/anexos/:id', verificarToken, (req, res) => {
  const { id } = req.params;
  
  const db = new sqlite3.Database(dbPath);
  
  // Buscar informações do anexo
  db.get(
    'SELECT * FROM anexos WHERE id = ?',
    [id],
    (err, anexo) => {
      if (err) {
        db.close();
        return res.status(500).json({ error: 'Erro ao buscar anexo' });
      }
      
      if (!anexo) {
        db.close();
        return res.status(404).json({ error: 'Anexo não encontrado' });
      }
      
      // Verificar se usuário pode remover (criador ou admin)
      if (anexo.criado_por !== req.usuario.id && req.usuario.perfil !== 'admin') {
        db.close();
        return res.status(403).json({ error: 'Acesso negado' });
      }
      
      // Remover arquivo físico
      const filePath = path.join(__dirname, '../uploads', anexo.caminho_arquivo);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
      
      // Remover registro do banco
      db.run(
        'DELETE FROM anexos WHERE id = ?',
        [id],
        function(err) {
          db.close();
          
          if (err) {
            return res.status(500).json({ error: 'Erro ao remover anexo' });
          }
          
          res.json({ message: 'Anexo removido com sucesso' });
        }
      );
    }
  );
});

// Middleware de erro para multer
router.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ error: 'Arquivo muito grande. Máximo: 10MB' });
    }
    return res.status(400).json({ error: 'Erro no upload do arquivo' });
  }
  
  if (error.message === 'Tipo de arquivo não permitido') {
    return res.status(400).json({ error: 'Tipo de arquivo não permitido' });
  }
  
  next(error);
});

module.exports = router;
