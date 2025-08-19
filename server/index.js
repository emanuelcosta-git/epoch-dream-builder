const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const path = require('path');
require('dotenv').config();

// Importar configuração do Supabase
const supabase = require('./config/supabase');

// Importar rotas
const authRoutes = require('./routes/auth');
const pagamentosRoutes = require('./routes/pagamentos');
const usuariosRoutes = require('./routes/usuarios');
const relatoriosRoutes = require('./routes/relatorios');
const uploadRoutes = require('./routes/upload');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware de segurança
app.use(helmet());

// CORS
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://vidamais.com'] 
    : ['http://localhost:3000', 'http://127.0.0.1:3000'],
  credentials: true
}));

// Parser para JSON
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Servir arquivos estáticos (uploads)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Rota de health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    database: 'Supabase',
    environment: process.env.NODE_ENV || 'development'
  });
});

// Rotas da API
app.use('/api/auth', authRoutes);
app.use('/api/pagamentos', pagamentosRoutes);
app.use('/api/usuarios', usuariosRoutes);
app.use('/api/relatorios', relatoriosRoutes);
app.use('/api/upload', uploadRoutes);

// Middleware de tratamento de erros
app.use((err, req, res, next) => {
  console.error('❌ Erro:', err);
  
  if (err.type === 'entity.parse.failed') {
    return res.status(400).json({ error: 'Dados inválidos enviados' });
  }
  
  res.status(err.status || 500).json({ 
    error: err.message || 'Erro interno do servidor' 
  });
});

// Rota 404
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Rota não encontrada' });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log('🚀 Servidor rodando na porta', PORT);
  console.log('📊 Sistema de Pagamentos Vida Mais');
  console.log('🗄️ Banco de dados: Supabase');
  console.log('🌐 http://localhost:' + PORT);
  console.log('📱 Frontend: http://localhost:3000');
});

// Tratamento de erros não capturados
process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
});

process.on('uncaughtException', (error) => {
  console.error('❌ Uncaught Exception:', error);
  process.exit(1);
});
