import { createContext, useState, useEffect, useContext } from 'react';
import api from '@/services/api';
import { toast } from 'react-toastify';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const checkAuth = async () => {
    setLoading(true);
    const accessToken = localStorage.getItem('access_token');
    if (accessToken) {
      api.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
      try {
        const userResponse = await api.get('/users/profile/');
        setUser(userResponse.data);
        setIsAuthenticated(true);
      } catch (error) {
        console.error("Token inválido ou expirado. Desconectando...", error);
        logout(false);
      }
    } else {
      setIsAuthenticated(false);
      setUser(null);
      delete api.defaults.headers.common['Authorization'];
    }
    setLoading(false);
  };

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (token) {
      checkAuth();
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (username, password) => {
    setLoading(true);
    try {
      const response = await api.post('/token/', { username, password });
      const { access, refresh } = response.data;

      localStorage.setItem('access_token', access);
      localStorage.setItem('refresh_token', refresh);
      api.defaults.headers.common['Authorization'] = `Bearer ${access}`;

      toast.info("Só um momento, estamos buscando seus dados...", { autoClose: 2000 });
      await new Promise(resolve => setTimeout(resolve, 2000));
      await checkAuth();

      return true; // sucesso
    } catch (error) {
      console.error("Erro no login:", error.response?.data || error.message);
      toast.error("Erro no login. Por favor, verifique suas credenciais e tente novamente.");
      setIsAuthenticated(false);
      setUser(null);
      delete api.defaults.headers.common['Authorization'];
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = (showToast = true) => {
    setLoading(true);
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    delete api.defaults.headers.common['Authorization'];
    setIsAuthenticated(false);
    setUser(null);
    if (showToast) {
      toast.info("Você foi desconectado.");
    }
    setLoading(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
