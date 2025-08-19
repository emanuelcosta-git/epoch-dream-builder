import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Button,
  Grid,
  Card,
  CardContent,
  CardActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Alert,
  CircularProgress
} from '@mui/material';
import {
  Download as DownloadIcon,
  Email as EmailIcon,
  Assessment as AssessmentIcon,
  TrendingUp as TrendingUpIcon
} from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../services/api';

const Relatorios = () => {
  const { usuario } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const [filtros, setFiltros] = useState({
    mes_ano: '',
    tipo: 'todos',
    projeto_id: ''
  });

  const [projetos, setProjetos] = useState([]);

  useEffect(() => {
    carregarProjetos();
  }, []);

  const carregarProjetos = async () => {
    try {
      const response = await api.get('/usuarios/projetos');
      setProjetos(response.data);
    } catch (error) {
      console.error('Erro ao carregar projetos:', error);
    }
  };

  const handleFiltroChange = (e) => {
    const { name, value } = e.target;
    setFiltros(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const gerarRelatorioExcel = async () => {
    try {
      setLoading(true);
      setError('');
      setSuccess('');

      const params = new URLSearchParams();
      if (filtros.mes_ano) params.append('mes_ano', filtros.mes_ano);
      if (filtros.tipo !== 'todos') params.append('tipo', filtros.tipo);
      if (filtros.projeto_id) params.append('projeto_id', filtros.projeto_id);

      const response = await api.get(`/relatorios/excel?${params}`, {
        responseType: 'blob'
      });

      // Criar link para download
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `relatorio_${filtros.mes_ano || 'geral'}.xlsx`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      setSuccess('Relatório gerado com sucesso!');
    } catch (error) {
      setError('Erro ao gerar relatório');
      console.error('Erro:', error);
    } finally {
      setLoading(false);
    }
  };

  const enviarRelatorioEmail = async () => {
    try {
      setLoading(true);
      setError('');
      setSuccess('');

      const params = new URLSearchParams();
      if (filtros.mes_ano) params.append('mes_ano', filtros.mes_ano);
      if (filtros.tipo !== 'todos') params.append('tipo', filtros.tipo);
      if (filtros.projeto_id) params.append('projeto_id', filtros.projeto_id);

      await api.post(`/relatorios/email?${params}`);

      setSuccess('Relatório enviado por email com sucesso!');
    } catch (error) {
      setError('Erro ao enviar relatório por email');
      console.error('Erro:', error);
    } finally {
      setLoading(false);
    }
  };

  const getMesAtual = () => {
    const hoje = new Date();
    return `${hoje.getFullYear()}-${String(hoje.getMonth() + 1).padStart(2, '0')}`;
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" component="h1" sx={{ mb: 3 }}>
        Relatórios
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert severity="success" sx={{ mb: 2 }}>
          {success}
        </Alert>
      )}

      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Filtros do Relatório
        </Typography>
        
        <Grid container spacing={2}>
          <Grid item xs={12} md={4}>
            <TextField
              name="mes_ano"
              label="Mês/Ano"
              type="month"
              value={filtros.mes_ano}
              onChange={handleFiltroChange}
              fullWidth
              InputLabelProps={{ shrink: true }}
              defaultValue={getMesAtual()}
            />
          </Grid>
          
          <Grid item xs={12} md={4}>
            <FormControl fullWidth>
              <InputLabel>Tipo de Pagamento</InputLabel>
              <Select
                name="tipo"
                value={filtros.tipo}
                onChange={handleFiltroChange}
                label="Tipo de Pagamento"
              >
                <MenuItem value="todos">Todos</MenuItem>
                <MenuItem value="fixos">Pagamentos Fixos</MenuItem>
                <MenuItem value="variaveis">Pagamentos Variáveis</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <FormControl fullWidth>
              <InputLabel>Projeto</InputLabel>
              <Select
                name="projeto_id"
                value={filtros.projeto_id}
                onChange={handleFiltroChange}
                label="Projeto"
              >
                <MenuItem value="">Todos os Projetos</MenuItem>
                {projetos.map((projeto) => (
                  <MenuItem key={projeto.id} value={projeto.id}>
                    {projeto.nome}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Paper>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <AssessmentIcon sx={{ mr: 1, color: 'primary.main' }} />
                <Typography variant="h6">
                  Relatório Excel
                </Typography>
              </Box>
              <Typography variant="body2" color="text.secondary">
                Gera relatório completo em formato Excel com todos os pagamentos filtrados.
              </Typography>
            </CardContent>
            <CardActions>
              <Button
                variant="contained"
                startIcon={<DownloadIcon />}
                onClick={gerarRelatorioExcel}
                disabled={loading}
                fullWidth
              >
                {loading ? 'Gerando...' : 'Gerar Excel'}
              </Button>
            </CardActions>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <EmailIcon sx={{ mr: 1, color: 'primary.main' }} />
                <Typography variant="h6">
                  Relatório por Email
                </Typography>
              </Box>
              <Typography variant="body2" color="text.secondary">
                Envia relatório mensal por email para Sonia e Zé automaticamente.
              </Typography>
            </CardContent>
            <CardActions>
              <Button
                variant="outlined"
                startIcon={<EmailIcon />}
                onClick={enviarRelatorioEmail}
                disabled={loading}
                fullWidth
              >
                {loading ? 'Enviando...' : 'Enviar por Email'}
              </Button>
            </CardActions>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <TrendingUpIcon sx={{ mr: 1, color: 'primary.main' }} />
                <Typography variant="h6">
                  Relatório Anual
                </Typography>
              </Box>
              <Typography variant="body2" color="text.secondary">
                Relatório consolidado anual com análise de gastos e orçamento.
              </Typography>
            </CardContent>
            <CardActions>
              <Button
                variant="outlined"
                startIcon={<DownloadIcon />}
                disabled={loading}
                fullWidth
              >
                Gerar Anual
              </Button>
            </CardActions>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <AssessmentIcon sx={{ mr: 1, color: 'primary.main' }} />
                <Typography variant="h6">
                  Relatório de Aprovações
                </Typography>
              </Box>
              <Typography variant="body2" color="text.secondary">
                Lista de pagamentos pendentes de aprovação pela Renata.
              </Typography>
            </CardContent>
            <CardActions>
              <Button
                variant="outlined"
                startIcon={<DownloadIcon />}
                disabled={loading}
                fullWidth
              >
                Gerar Aprovações
              </Button>
            </CardActions>
          </Card>
        </Grid>
      </Grid>

      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
          <CircularProgress />
        </Box>
      )}
    </Box>
  );
};

export default Relatorios;
