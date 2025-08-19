import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  CircularProgress,
  Alert,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Button,
} from '@mui/material';
import {
  TrendingUp,
  Payment,
  Receipt,
  Warning,
  Download,
  Email,
} from '@mui/icons-material';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../services/api';

const Dashboard = () => {
  const { user, canGenerateReports } = useAuth();
  const [stats, setStats] = useState(null);
  const [recentPayments, setRecentPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      
      // Carregar estatísticas
      const statsResponse = await api.get('/api/usuarios/dashboard');
      setStats(statsResponse.data);
      
      // Carregar pagamentos recentes
      const paymentsResponse = await api.get('/api/pagamentos/variaveis?limit=5');
      setRecentPayments(paymentsResponse.data);
      
    } catch (err) {
      setError('Erro ao carregar dados do dashboard');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadReport = async () => {
    try {
      const mesAtual = new Date().toLocaleString('pt-BR', { month: 'long' });
      const anoAtual = new Date().getFullYear();
      
      const response = await api.get(`/api/relatorios/excel-mensal?mes=${mesAtual}&ano=${anoAtual}`, {
        responseType: 'blob'
      });
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `relatorio_${mesAtual}_${anoAtual}.xlsx`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      console.error('Erro ao baixar relatório:', err);
    }
  };

  const handleSendEmail = async () => {
    try {
      const mesAtual = new Date().toLocaleString('pt-BR', { month: 'long' });
      const anoAtual = new Date().getFullYear();
      
      await api.post('/api/relatorios/enviar-email', {
        mes: mesAtual,
        ano: anoAtual,
        destinatarios: ['sonia@vidamais.com', 'ze@vidamais.com']
      });
      
      // Mostrar mensagem de sucesso
      alert('Relatório enviado por e-mail com sucesso!');
    } catch (err) {
      console.error('Erro ao enviar e-mail:', err);
      alert('Erro ao enviar e-mail');
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mb: 2 }}>
        {error}
      </Alert>
    );
  }

  // Dados para o gráfico
  const chartData = [
    { mes: 'Jan', fixos: parseFloat(stats?.totalFixos || 0), variaveis: parseFloat(stats?.totalVariaveis || 0) },
    { mes: 'Fev', fixos: parseFloat(stats?.totalFixos || 0), variaveis: parseFloat(stats?.totalVariaveis || 0) },
    { mes: 'Mar', fixos: parseFloat(stats?.totalFixos || 0), variaveis: parseFloat(stats?.totalVariaveis || 0) },
    { mes: 'Abr', fixos: parseFloat(stats?.totalFixos || 0), variaveis: parseFloat(stats?.totalVariaveis || 0) },
    { mes: 'Mai', fixos: parseFloat(stats?.totalFixos || 0), variaveis: parseFloat(stats?.totalVariaveis || 0) },
    { mes: 'Jun', fixos: parseFloat(stats?.totalFixos || 0), variaveis: parseFloat(stats?.totalVariaveis || 0) },
  ];

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Dashboard
      </Typography>
      
      <Typography variant="body1" color="textSecondary" sx={{ mb: 4 }}>
        Bem-vindo, {user?.nome}! Aqui está um resumo das atividades financeiras.
      </Typography>

      {/* Cards de estatísticas */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography color="textSecondary" gutterBottom>
                    Total Fixos
                  </Typography>
                  <Typography variant="h4" component="div">
                    R$ {parseFloat(stats?.totalFixos || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </Typography>
                </Box>
                <Payment color="primary" sx={{ fontSize: 40 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography color="textSecondary" gutterBottom>
                    Total Variáveis
                  </Typography>
                  <Typography variant="h4" component="div">
                    R$ {parseFloat(stats?.totalVariaveis || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </Typography>
                </Box>
                <Receipt color="secondary" sx={{ fontSize: 40 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography color="textSecondary" gutterBottom>
                    Total Geral
                  </Typography>
                  <Typography variant="h4" component="div">
                    R$ {parseFloat(stats?.totalGeral || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </Typography>
                </Box>
                <TrendingUp color="success" sx={{ fontSize: 40 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography color="textSecondary" gutterBottom>
                    Pendentes
                  </Typography>
                  <Typography variant="h4" component="div">
                    {stats?.pendentesAprovacao || 0}
                  </Typography>
                </Box>
                <Warning color="warning" sx={{ fontSize: 40 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Gráfico */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Evolução dos Pagamentos
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="mes" />
                  <YAxis />
                  <Tooltip formatter={(value) => `R$ ${value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`} />
                  <Bar dataKey="fixos" fill="#1976d2" name="Fixos" />
                  <Bar dataKey="variaveis" fill="#dc004e" name="Variáveis" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Ações Rápidas
              </Typography>
              
              {canGenerateReports() && (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <Button
                    variant="outlined"
                    startIcon={<Download />}
                    onClick={handleDownloadReport}
                    fullWidth
                  >
                    Baixar Relatório
                  </Button>
                  
                  <Button
                    variant="outlined"
                    startIcon={<Email />}
                    onClick={handleSendEmail}
                    fullWidth
                  >
                    Enviar por E-mail
                  </Button>
                </Box>
              )}
              
              <Typography variant="body2" color="textSecondary" sx={{ mt: 2 }}>
                Mês de referência: {stats?.mesAtual} {stats?.anoAtual}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Pagamentos recentes */}
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Pagamentos Variáveis Recentes
              </Typography>
              
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Descrição</TableCell>
                      <TableCell>Valor</TableCell>
                      <TableCell>Classificação</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Data</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {recentPayments.map((payment) => (
                      <TableRow key={payment.id}>
                        <TableCell>{payment.descricao}</TableCell>
                        <TableCell>
                          R$ {parseFloat(payment.valor).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </TableCell>
                        <TableCell>{payment.classificacao}</TableCell>
                        <TableCell>
                          <Chip
                            label={payment.status === 'aprovado' ? 'Aprovado' : 'Pendente'}
                            color={payment.status === 'aprovado' ? 'success' : 'warning'}
                            size="small"
                          />
                        </TableCell>
                        <TableCell>
                          {new Date(payment.data_pagamento).toLocaleDateString('pt-BR')}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
              
              {recentPayments.length === 0 && (
                <Typography variant="body2" color="textSecondary" sx={{ textAlign: 'center', py: 3 }}>
                  Nenhum pagamento variável encontrado
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;
