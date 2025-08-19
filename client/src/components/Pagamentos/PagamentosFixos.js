import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  Chip
} from '@mui/material';
import { Add as AddIcon, Edit as EditIcon } from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../services/api';

const PagamentosFixos = () => {
  const { usuario } = useAuth();
  const [pagamentos, setPagamentos] = useState([]);
  const [projetos, setProjetos] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingPagamento, setEditingPagamento] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    descricao: '',
    valor: '',
    tipo: '',
    mes_ano: '',
    projeto_id: '',
    observacoes: ''
  });

  useEffect(() => {
    carregarPagamentos();
    carregarProjetos();
  }, []);

  const carregarPagamentos = async () => {
    try {
      setLoading(true);
      const response = await api.get('/pagamentos/fixos');
      setPagamentos(response.data);
    } catch (error) {
      setError('Erro ao carregar pagamentos');
      console.error('Erro:', error);
    } finally {
      setLoading(false);
    }
  };

  const carregarProjetos = async () => {
    try {
      const response = await api.get('/usuarios/projetos');
      setProjetos(response.data);
    } catch (error) {
      console.error('Erro ao carregar projetos:', error);
    }
  };

  const handleOpenDialog = (pagamento = null) => {
    if (pagamento) {
      setEditingPagamento(pagamento);
      setFormData({
        descricao: pagamento.descricao,
        valor: pagamento.valor,
        tipo: pagamento.tipo,
        mes_ano: pagamento.mes_ano,
        projeto_id: pagamento.projeto_id,
        observacoes: pagamento.observacoes || ''
      });
    } else {
      setEditingPagamento(null);
      setFormData({
        descricao: '',
        valor: '',
        tipo: '',
        mes_ano: '',
        projeto_id: '',
        observacoes: ''
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingPagamento(null);
    setFormData({
      descricao: '',
      valor: '',
      tipo: '',
      mes_ano: '',
      projeto_id: '',
      observacoes: ''
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      
      if (editingPagamento) {
        await api.put(`/pagamentos/fixos/${editingPagamento.id}`, formData);
      } else {
        await api.post('/pagamentos/fixos', formData);
      }
      
      handleCloseDialog();
      carregarPagamentos();
    } catch (error) {
      setError('Erro ao salvar pagamento');
      console.error('Erro:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'aprovado':
        return 'success';
      case 'pendente':
        return 'warning';
      case 'rejeitado':
        return 'error';
      default:
        return 'default';
    }
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1">
          Pagamentos Fixos
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
          disabled={!['ariela', 'admin'].includes(usuario?.perfil)}
        >
          Novo Pagamento
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Paper sx={{ width: '100%', overflow: 'hidden' }}>
        <TableContainer>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell>Descrição</TableCell>
                <TableCell>Valor</TableCell>
                <TableCell>Tipo</TableCell>
                <TableCell>Mês/Ano</TableCell>
                <TableCell>Projeto</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Ações</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {pagamentos.map((pagamento) => (
                <TableRow key={pagamento.id}>
                  <TableCell>{pagamento.descricao}</TableCell>
                  <TableCell>{formatCurrency(pagamento.valor)}</TableCell>
                  <TableCell>{pagamento.tipo}</TableCell>
                  <TableCell>{pagamento.mes_ano}</TableCell>
                  <TableCell>{pagamento.projeto?.nome || '-'}</TableCell>
                  <TableCell>
                    <Chip
                      label={pagamento.status}
                      color={getStatusColor(pagamento.status)}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <Button
                      size="small"
                      startIcon={<EditIcon />}
                      onClick={() => handleOpenDialog(pagamento)}
                      disabled={!['ariela', 'admin'].includes(usuario?.perfil)}
                    >
                      Editar
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          {editingPagamento ? 'Editar Pagamento Fixo' : 'Novo Pagamento Fixo'}
        </DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent>
            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2, mb: 2 }}>
              <TextField
                name="descricao"
                label="Descrição"
                value={formData.descricao}
                onChange={handleInputChange}
                required
                fullWidth
              />
              <TextField
                name="valor"
                label="Valor"
                type="number"
                value={formData.valor}
                onChange={handleInputChange}
                required
                fullWidth
                inputProps={{ step: "0.01", min: "0" }}
              />
            </Box>
            
            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2, mb: 2 }}>
              <FormControl fullWidth required>
                <InputLabel>Tipo</InputLabel>
                <Select
                  name="tipo"
                  value={formData.tipo}
                  onChange={handleInputChange}
                  label="Tipo"
                >
                  <MenuItem value="funcionario">Funcionário</MenuItem>
                  <MenuItem value="aluguel">Aluguel</MenuItem>
                  <MenuItem value="bolsa_estudo">Bolsa de Estudo</MenuItem>
                  <MenuItem value="outros">Outros</MenuItem>
                </Select>
              </FormControl>
              
              <TextField
                name="mes_ano"
                label="Mês/Ano"
                type="month"
                value={formData.mes_ano}
                onChange={handleInputChange}
                required
                fullWidth
                InputLabelProps={{ shrink: true }}
              />
            </Box>

            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr', gap: 2, mb: 2 }}>
              <FormControl fullWidth>
                <InputLabel>Projeto</InputLabel>
                <Select
                  name="projeto_id"
                  value={formData.projeto_id}
                  onChange={handleInputChange}
                  label="Projeto"
                >
                  {projetos.map((projeto) => (
                    <MenuItem key={projeto.id} value={projeto.id}>
                      {projeto.nome}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>

            <TextField
              name="observacoes"
              label="Observações"
              value={formData.observacoes}
              onChange={handleInputChange}
              multiline
              rows={3}
              fullWidth
            />
          </DialogContent>
          
          <DialogActions>
            <Button onClick={handleCloseDialog}>Cancelar</Button>
            <Button type="submit" variant="contained" disabled={loading}>
              {loading ? 'Salvando...' : (editingPagamento ? 'Atualizar' : 'Criar')}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
};

export default PagamentosFixos;
