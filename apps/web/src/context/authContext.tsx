'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { getCookie, deleteCookie } from 'cookies-next';
import { jwtDecode } from 'jwt-decode';
import { useRouter } from 'next/navigation';

interface User {
  name: string;
  role: 'Freela' | 'Empresa';
}

interface AuthContextType {
  user: User | null;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  useEffect(() => {
    const token = getCookie('auth_token');

    if (token && typeof token === 'string') {
      try {
        if (token.startsWith('ey')) {
          const decoded: any = jwtDecode(token);
          setUser({ name: decoded.name, role: decoded.role });
        } else {
          setUser({
            name: "Usuário de Teste",
            role: token.includes('freela') ? 'Freela' : 'Empresa'
          });
        }
      } catch (error) {
        console.error("Erro ao processar token");
        logout();
      }
    }
  }, []);

  const logout = () => {
    deleteCookie('auth_token');
    setUser(null);
    window.location.href = '/login'; 
  };

  return (
    <AuthContext.Provider value={{ user, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  return context;
};