'use client';

import { useAuth } from "../context/AuthContext";
import Link from "next/link";
import { LayoutDashboard, User, Briefcase, Building2, LogOut } from "lucide-react";

export function Sidebar() {
  const { user, logout } = useAuth();

  if (!user) return null; 

  return (
    <aside className="w-64 h-screen bg-slate-900 text-white p-6 flex flex-col border-r border-slate-800">
      <div className="mb-10">
        <h1 className="text-xl font-bold text-blue-400 italic">DevGeos 📍</h1>
        <div className="mt-4 p-3 bg-slate-800 rounded-lg">
          <p className="text-sm font-medium">{user.name}</p>
          <span className="text-[10px] uppercase tracking-wider bg-blue-600 px-2 py-0.5 rounded-full">
            {user.role}
          </span>
        </div>
      </div>

      <nav className="flex-1 space-y-2">
        <Link href="/dashboard" className="flex items-center gap-3 p-2 hover:bg-slate-800 rounded transition">
          <LayoutDashboard size={20} /> Dashboard
        </Link>

        {}
        {user.role === 'Freela' ? (
          <>
            <Link href="/dashboard/vagas" className="flex items-center gap-3 p-2 hover:bg-slate-800 rounded transition">
              <Briefcase size={20} /> Buscar Vagas
            </Link>
            <Link href="/dashboard/perfil" className="flex items-center gap-3 p-2 hover:bg-slate-800 rounded transition">
              <User size={20} /> Meu Perfil
            </Link>
          </>
        ) : (
          <>
            <Link href="/dashboard/postar" className="flex items-center gap-3 p-2 hover:bg-slate-800 rounded transition">
              <Building2 size={20} /> Postar Oportunidade
            </Link>
            <Link href="/dashboard/talentos" className="flex items-center gap-3 p-2 hover:bg-slate-800 rounded transition">
              <User size={20} /> Gerenciar Freelas
            </Link>
          </>
        )}
      </nav>

      <button 
        onClick={logout}
        className="mt-auto flex items-center gap-3 p-2 text-red-400 hover:bg-red-950/30 rounded transition"
      >
        <LogOut size={20} /> Sair do Sistema
      </button>
    </aside>
  );
}