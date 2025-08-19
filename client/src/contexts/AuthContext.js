import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(localStorage.getItem('token'));

  // Verificar token ao inicializar
  useEffect(() => {
    const verifyToken = async () => {
      if (token) {
        try {
          api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          const response = await api.get('/api/auth/verificar');
          setUser(response.data.usuario);
        } catch (error) {
          console.error('Token inválido:', error);
          localStorage.removeItem('token');
          setToken(null);
          setUser(null);
        }
      }
      setLoading(false);
    };

    verifyToken();
  }, [token]);

  // Login
  const login = async (email, senha) => {
    try {
      const response = await api.post('/api/auth/login', { email, senha });
      const { token: newToken, usuario } = response.data;
      
      localStorage.setItem('token', newToken);
      api.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
      
      setToken(newToken);
      setUser(usuario);
      
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.error || 'Erro ao fazer login' 
      };
    }
  };

  // Logout
  const logout = () => {
    localStorage.removeItem('token');
    delete api.defaults.headers.common['Authorization'];
    setToken(null);
    setUser(null);
  };

  // Alterar senha
  const changePassword = async (senhaAtual, novaSenha) => {
    try {
      await api.put('/api/auth/alterar-senha', { senhaAtual, novaSenha });
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.error || 'Erro ao alterar senha' 
      };
    }
  };

  // Verificar permissões
  const hasPermission = (perfisPermitidos) => {
    if (!user) return false;
    return perfisPermitidos.includes(user.perfil);
  };

  // Verificar se é admin
  const isAdmin = () => {
    return user?.perfil === 'admin';
  };

  // Verificar se pode aprovar pagamentos
  const canApprovePayments = () => {
    return ['renata', 'admin'].includes(user?.perfil);
  };

  // Verificar se pode criar pagamentos fixos
  const canCreateFixedPayments = () => {
    return ['ariela', 'admin'].includes(user?.perfil);
  };

  // Verificar se pode criar pagamentos variáveis
  const canCreateVariablePayments = () => {
    return ['estagiario', 'ariela', 'admin'].includes(user?.perfil);
  };

  // Verificar se pode gerar relatórios
  const canGenerateReports = () => {
    return ['ze', 'renata', 'admin'].includes(user?.perfil);
  };

  const value = {
    user,
    loading,
    login,
    logout,
    changePassword,
    hasPermission,
    isAdmin,
    canApprovePayments,
    canCreateFixedPayments,
    canCreateVariablePayments,
    canGenerateReports,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
