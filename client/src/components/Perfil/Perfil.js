import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Button,
  TextField,
  Alert,
  Grid,
  Card,
  CardContent,
  Avatar,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import {
  Edit as EditIcon,
  Lock as LockIcon,
  Person as PersonIcon,
  Security as SecurityIcon
} from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../services/api';

const Perfil = () => {
  const { usuario, logout } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const [openSenhaDialog, setOpenSenhaDialog] = useState(false);
  const [openPerfilDialog, setOpenPerfilDialog] = useState(false);
  
  const [senhaData, setSenhaData] = useState({
    senha_atual: '',
    nova_senha: '',
    confirmar_senha: ''
  });

  const [perfilData, setPerfilData] = useState({
    nome: usuario?.nome || '',
    email: usuario?.email || ''
  });

  const handleSenhaChange = (e) => {
    const { name, value } = e.target;
    setSenhaData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePerfilChange = (e) => {
    const { name, value } = e.target;
    setPerfilData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAlterarSenha = async (e) => {
    e.preventDefault();
    
    if (senhaData.nova_senha !== senhaData.confirmar_senha) {
      setError('As senhas não coincidem');
      return;
    }

    try {
      setLoading(true);
      setError('');
      setSuccess('');

      await api.post('/auth/alterar-senha', {
        senha_atual: senhaData.senha_atual,
        nova_senha: senhaData.nova_senha
      });

      setSuccess('Senha alterada com sucesso!');
      setOpenSenhaDialog(false);
      setSenhaData({
        senha_atual: '',
        nova_senha: '',
        confirmar_senha: ''
      });
    } catch (error) {
      setError('Erro ao alterar senha');
      console.error('Erro:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAtualizarPerfil = async (e) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      setError('');
      setSuccess('');

      await api.put(`/usuarios/${usuario.id}`, perfilData);

      setSuccess('Perfil atualizado com sucesso!');
      setOpenPerfilDialog(false);
    } catch (error) {
      setError('Erro ao atualizar perfil');
      console.error('Erro:', error);
    } finally {
      setLoading(false);
    }
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

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" component="h1" sx={{ mb: 3 }}>
        Meu Perfil
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

      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Avatar
                sx={{
                  width: 100,
                  height: 100,
                  mx: 'auto',
                  mb: 2,
                  bgcolor: 'primary.main',
                  fontSize: '2rem'
                }}
              >
                {usuario?.nome?.charAt(0)?.toUpperCase() || 'U'}
              </Avatar>
              
              <Typography variant="h5" component="h2" sx={{ mb: 1 }}>
                {usuario?.nome}
              </Typography>
              
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                {usuario?.email}
              </Typography>
              
              <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
                <Button
                  variant="outlined"
                  startIcon={<EditIcon />}
                  onClick={() => setOpenPerfilDialog(true)}
                  size="small"
                >
                  Editar Perfil
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={8}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Paper sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <PersonIcon sx={{ mr: 1, color: 'primary.main' }} />
                  <Typography variant="h6">
                    Informações Pessoais
                  </Typography>
                </Box>
                
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2" color="text.secondary">
                      Nome Completo
                    </Typography>
                    <Typography variant="body1">
                      {usuario?.nome}
                    </Typography>
                  </Grid>
                  
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2" color="text.secondary">
                      Email
                    </Typography>
                    <Typography variant="body1">
                      {usuario?.email}
                    </Typography>
                  </Grid>
                  
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2" color="text.secondary">
                      Perfil
                    </Typography>
                    <Typography variant="body1">
                      {getPerfilLabel(usuario?.perfil)}
                    </Typography>
                  </Grid>
                  
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2" color="text.secondary">
                      Status
                    </Typography>
                    <Typography variant="body1" color="success.main">
                      Ativo
                    </Typography>
                  </Grid>
                </Grid>
              </Paper>
            </Grid>

            <Grid item xs={12}>
              <Paper sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <SecurityIcon sx={{ mr: 1, color: 'primary.main' }} />
                  <Typography variant="h6">
                    Segurança
                  </Typography>
                </Box>
                
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  Gerencie suas credenciais de acesso
                </Typography>
                
                <Button
                  variant="outlined"
                  startIcon={<LockIcon />}
                  onClick={() => setOpenSenhaDialog(true)}
                >
                  Alterar Senha
                </Button>
              </Paper>
            </Grid>

            <Grid item xs={12}>
              <Paper sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <SecurityIcon sx={{ mr: 1, color: 'error.main' }} />
                  <Typography variant="h6" color="error.main">
                    Sair do Sistema
                  </Typography>
                </Box>
                
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  Clique no botão abaixo para sair do sistema
                </Typography>
                
                <Button
                  variant="contained"
                  color="error"
                  onClick={logout}
                >
                  Sair
                </Button>
              </Paper>
            </Grid>
          </Grid>
        </Grid>
      </Grid>

      {/* Dialog para alterar senha */}
      <Dialog open={openSenhaDialog} onClose={() => setOpenSenhaDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Alterar Senha</DialogTitle>
        <form onSubmit={handleAlterarSenha}>
          <DialogContent>
            <TextField
              name="senha_atual"
              label="Senha Atual"
              type="password"
              value={senhaData.senha_atual}
              onChange={handleSenhaChange}
              required
              fullWidth
              sx={{ mb: 2 }}
            />
            
            <TextField
              name="nova_senha"
              label="Nova Senha"
              type="password"
              value={senhaData.nova_senha}
              onChange={handleSenhaChange}
              required
              fullWidth
              sx={{ mb: 2 }}
            />
            
            <TextField
              name="confirmar_senha"
              label="Confirmar Nova Senha"
              type="password"
              value={senhaData.confirmar_senha}
              onChange={handleSenhaChange}
              required
              fullWidth
            />
          </DialogContent>
          
          <DialogActions>
            <Button onClick={() => setOpenSenhaDialog(false)}>Cancelar</Button>
            <Button type="submit" variant="contained" disabled={loading}>
              {loading ? 'Alterando...' : 'Alterar Senha'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* Dialog para editar perfil */}
      <Dialog open={openPerfilDialog} onClose={() => setOpenPerfilDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Editar Perfil</DialogTitle>
        <form onSubmit={handleAtualizarPerfil}>
          <DialogContent>
            <TextField
              name="nome"
              label="Nome"
              value={perfilData.nome}
              onChange={handlePerfilChange}
              required
              fullWidth
              sx={{ mb: 2 }}
            />
            
            <TextField
              name="email"
              label="Email"
              type="email"
              value={perfilData.email}
              onChange={handlePerfilChange}
              required
              fullWidth
            />
          </DialogContent>
          
          <DialogActions>
            <Button onClick={() => setOpenPerfilDialog(false)}>Cancelar</Button>
            <Button type="submit" variant="contained" disabled={loading}>
              {loading ? 'Salvando...' : 'Salvar'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
};

export default Perfil;
