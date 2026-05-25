'use client';
import { setCookie } from 'cookies-next';

export default function LoginPage() {
  const handleLoginSimulado = (cargo: 'freela' | 'empresa') => {
    setCookie('auth_token', `token-teste-${cargo}`, { maxAge: 60 * 60 });
    
    window.location.href = '/dashboard';
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-slate-100">
      <div className="p-10 bg-white shadow-xl rounded-2xl border border-slate-200 text-center">
        <h1 className="text-2xl font-bold mb-2">Issue 08 - Login</h1>
        <p className="text-slate-500 mb-8">Como deseja entrar hoje?</p>
        
        <div className="flex gap-4">
          <button 
            onClick={() => handleLoginSimulado('freela')} 
            className="bg-blue-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-blue-700 transition-all"
          >
            SOU FREELA
          </button>
          
          <button 
            onClick={() => handleLoginSimulado('empresa')} 
            className="bg-emerald-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-emerald-700 transition-all"
          >
            SOU EMPRESA
          </button>
        </div>
      </div>
    </div>
  );
}