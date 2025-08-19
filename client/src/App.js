import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Box, CircularProgress, Alert, Snackbar } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { ptBR } from 'date-fns/locale';

// Componentes
import Layout from './components/Layout/Layout';
import Login from './components/Auth/Login';
import Dashboard from './components/Dashboard/Dashboard';
import PagamentosFixos from './components/Pagamentos/PagamentosFixos';
import PagamentosVariaveis from './components/Pagamentos/PagamentosVariaveis';
import Relatorios from './components/Relatorios/Relatorios';
import Usuarios from './components/Usuarios/Usuarios';
import Perfil from './components/Perfil/Perfil';

// Context
import { AuthProvider, useAuth } from './contexts/AuthContext';

// Serviços
import api from './services/api';

// Componente de rota protegida
const ProtectedRoute = ({ children, allowedProfiles = [] }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress />
      </Box>
    );
  }
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  if (allowedProfiles.length > 0 && !allowedProfiles.includes(user.perfil)) {
    return <Navigate to="/dashboard" replace />;
  }
  
  return children;
};

// Componente principal da aplicação
const AppContent = () => {
  const { user } = useAuth();
  const [notification, setNotification] = useState({ open: false, message: '', severity: 'info' });

  // Configurar interceptor do axios para mostrar erros
  useEffect(() => {
    const interceptor = api.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          // Token expirado, redirecionar para login
          window.location.href = '/login';
        } else if (error.response?.data?.error) {
          setNotification({
            open: true,
            message: error.response.data.error,
            severity: 'error'
          });
        }
        return Promise.reject(error);
      }
    );

    return () => api.interceptors.response.eject(interceptor);
  }, []);

  const handleCloseNotification = () => {
    setNotification({ ...notification, open: false });
  };

  if (!user) {
    return (
      <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ptBR}>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </LocalizationProvider>
    );
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ptBR}>
      <Layout>
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } />
          
          {/* Pagamentos Fixos - Ariela e Admin */}
          <Route path="/pagamentos-fixos" element={
            <ProtectedRoute allowedProfiles={['ariela', 'admin']}>
              <PagamentosFixos />
            </ProtectedRoute>
          } />
          
          {/* Pagamentos Variáveis - Estagiário, Ariela e Admin */}
          <Route path="/pagamentos-variaveis" element={
            <ProtectedRoute allowedProfiles={['estagiario', 'ariela', 'admin']}>
              <PagamentosVariaveis />
            </ProtectedRoute>
          } />
          
          {/* Relatórios - Zé, Renata e Admin */}
          <Route path="/relatorios" element={
            <ProtectedRoute allowedProfiles={['ze', 'renata', 'admin']}>
              <Relatorios />
            </ProtectedRoute>
          } />
          
          {/* Usuários - Apenas Admin */}
          <Route path="/usuarios" element={
            <ProtectedRoute allowedProfiles={['admin']}>
              <Usuarios />
            </ProtectedRoute>
          } />
          
          {/* Perfil - Usuário logado */}
          <Route path="/perfil" element={
            <ProtectedRoute>
              <Perfil />
            </ProtectedRoute>
          } />
          
          {/* Rota padrão */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </Layout>
      
      {/* Notificações */}
      <Snackbar
        open={notification.open}
        autoHideDuration={6000}
        onClose={handleCloseNotification}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert 
          onClose={handleCloseNotification} 
          severity={notification.severity}
          variant="filled"
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </LocalizationProvider>
  );
};

// App principal com providers
const App = () => {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
};

export default App;
