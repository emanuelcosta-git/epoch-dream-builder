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
  Chip,
  IconButton,
  Tooltip
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon
} from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../services/api';

const Usuarios = () => {
  const { usuario } = useAuth();
  const [usuarios, setUsuarios] = useState([]);
  const [projetos, setProjetos] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingUsuario, setEditingUsuario] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    perfil: '',
    projeto_id: '',
    ativo: true
  });

  useEffect(() => {
    carregarUsuarios();
    carregarProjetos();
  }, []);

  const carregarUsuarios = async () => {
    try {
      setLoading(true);
      const response = await api.get('/usuarios');
      setUsuarios(response.data);
    } catch (error) {
      setError('Erro ao carregar usuários');
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

  const handleOpenDialog = (user = null) => {
    if (user) {
      setEditingUsuario(user);
      setFormData({
        nome: user.nome,
        email: user.email,
        perfil: user.perfil,
        projeto_id: user.projeto_id || '',
        ativo: user.ativo
      });
    } else {
      setEditingUsuario(null);
      setFormData({
        nome: '',
        email: '',
        perfil: '',
        projeto_id: '',
        ativo: true
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingUsuario(null);
    setFormData({
      nome: '',
      email: '',
      perfil: '',
      projeto_id: '',
      ativo: true
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      
      if (editingUsuario) {
        await api.put(`/usuarios/${editingUsuario.id}`, formData);
      } else {
        await api.post('/usuarios', formData);
      }
      
      handleCloseDialog();
      carregarUsuarios();
    } catch (error) {
      setError('Erro ao salvar usuário');
      console.error('Erro:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const getPerfilLabel = (perfil) => {
    const labels = {
      ariela: 'Ariela',
      estagiario: 'Estagiário',
      sonia: 'Sonia',
      ze: 'Zé',
      renata: 'Renata',
      admin: 'Administrador'
    };
    return labels[perfil] || perfil;
  };

  const getPerfilColor = (perfil) => {
    const colors = {
      ariela: 'primary',
      estagiario: 'info',
      sonia: 'success',
      ze: 'warning',
      renata: 'error',
      admin: 'secondary'
    };
    return colors[perfil] || 'default';
  };

  const canEdit = (user) => {
    if (usuario?.perfil === 'admin') return true;
    if (usuario?.perfil === 'ariela' && user.perfil !== 'admin') return true;
    return false;
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1">
          Usuários e Projetos
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
          disabled={!['ariela', 'admin'].includes(usuario?.perfil)}
        >
          Novo Usuário
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
                <TableCell>Nome</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Perfil</TableCell>
                <TableCell>Projeto</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Ações</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {usuarios.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>{user.nome}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <Chip
                      label={getPerfilLabel(user.perfil)}
                      color={getPerfilColor(user.perfil)}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>{user.projeto?.nome || '-'}</TableCell>
                  <TableCell>
                    <Chip
                      label={user.ativo ? 'Ativo' : 'Inativo'}
                      color={user.ativo ? 'success' : 'default'}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Tooltip title="Visualizar">
                        <IconButton
                          size="small"
                          onClick={() => handleOpenDialog(user)}
                        >
                          <ViewIcon />
                        </IconButton>
                      </Tooltip>
                      
                      {canEdit(user) && (
                        <Tooltip title="Editar">
                          <IconButton
                            size="small"
                            onClick={() => handleOpenDialog(user)}
                          >
                            <EditIcon />
                          </IconButton>
                        </Tooltip>
                      )}
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          {editingUsuario ? 'Editar Usuário' : 'Novo Usuário'}
        </DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent>
            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2, mb: 2 }}>
              <TextField
                name="nome"
                label="Nome"
                value={formData.nome}
                onChange={handleInputChange}
                required
                fullWidth
              />
              <TextField
                name="email"
                label="Email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                fullWidth
              />
            </Box>
            
            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2, mb: 2 }}>
              <FormControl fullWidth required>
                <InputLabel>Perfil</InputLabel>
                <Select
                  name="perfil"
                  value={formData.perfil}
                  onChange={handleInputChange}
                  label="Perfil"
                >
                  <MenuItem value="ariela">Ariela</MenuItem>
                  <MenuItem value="estagiario">Estagiário</MenuItem>
                  <MenuItem value="sonia">Sonia</MenuItem>
                  <MenuItem value="ze">Zé</MenuItem>
                  <MenuItem value="renata">Renata</MenuItem>
                  <MenuItem value="admin">Administrador</MenuItem>
                </Select>
              </FormControl>
              
              <FormControl fullWidth>
                <InputLabel>Projeto</InputLabel>
                <Select
                  name="projeto_id"
                  value={formData.projeto_id}
                  onChange={handleInputChange}
                  label="Projeto"
                >
                  <MenuItem value="">Sem Projeto</MenuItem>
                  {projetos.map((projeto) => (
                    <MenuItem key={projeto.id} value={projeto.id}>
                      {projeto.nome}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <input
                type="checkbox"
                name="ativo"
                checked={formData.ativo}
                onChange={handleInputChange}
                id="ativo"
              />
              <label htmlFor="ativo">Usuário Ativo</label>
            </Box>
          </DialogContent>
          
          <DialogActions>
            <Button onClick={handleCloseDialog}>Cancelar</Button>
            <Button type="submit" variant="contained" disabled={loading}>
              {loading ? 'Salvando...' : (editingUsuario ? 'Atualizar' : 'Criar')}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
};

export default Usuarios;
