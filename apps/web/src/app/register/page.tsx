"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";

import axios from "axios";

type FormData = {
  role: string;

  email: string;
  password: string;
  confirmPassword: string;
  
  name: string;
  cpf?: string;
  cnpj?: string;
  razaoSocial?: string;
  nomeFantasia?: string;
  phone: string;

  bairro: string;
  cep: string;
  street: string;
  number: string;
  city: string;
  state: string;
};

export default function RegisterPage() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const {
    register,
    handleSubmit,
    watch,    
    formState: { errors },
  } = useForm<FormData>();

  const role = watch("role", "user_freela");  

  async function onSubmit(data: FormData) {
    if (data.password !== data.confirmPassword) {
      setMessage("As senhas são diferentes");
      return;
    }

    try {
      setLoading(true);
      setMessage("");

      const payload = {
          role: data.role,
          email: data.email,
          password: data.password,
          passwordConfirm: data.confirmPassword,
          nome: role === "user_freela" ? data.name : undefined,
          razaoSocial: role === "user_empresa" ? data.razaoSocial : undefined,
          nomeFantasia: role === "user_empresa" ? data.nomeFantasia: undefined,

          cpf: data.cpf?.replace(
            /\D/g,
            ""
          ),

          cnpj: data.cnpj?.replace(
            /\D/g,
            ""
          ),

          address: {
            cep: data.cep.replace(
              /\D/g,
              ""
            ),

          logradouro: data.street,
          numero: data.number,
          cidade: data.city,
          uf: data.state,
          bairro: data.bairro,
  },
};

    const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";
      await axios.post(`${apiUrl}/auth/register`, payload);

      setMessage("Cadastro realizado com sucesso!");

      setTimeout(() => {
        window.location.href = "/login";
      }, 2000);
    } catch (error: any) {
      setMessage(
        error.response?.data?.message || "Erro ao cadastrar usuário"
      );
    } finally {
      setLoading(false);
    }
  }
  
  return (
    <div className="min-h-screen bg-[#f1f7f8] flex justify-center items-center p-8">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-3xl border border-[#a4b8c5] space-y-2"
      >
        <h1 className="text-3xl font-bold mb-6 text-[#2b4466]">Cadastro</h1>

        {/* ROLE */}
        <div className="mb-6">
          <label className="font-semibold text-[#2b4466] ">Tipo de conta</label>

          <div className="flex gap-4 mt-2">
            <label>
              <input
                type="radio"
                value="user_freela"
                className="accent-[#2b4466] w-4 h-4"
                {...register("role")}
                defaultChecked
              />
              <span className="ml-2 text-[#2b4466] font-medium">Freela</span>
            </label>

            <label>
              <input
                type="radio"
                value="user_empresa"
                className="accent-[#2b4466] w-4 h-4"
                {...register("role")}
              />
              <span className="ml-2 text-[#2b4466] font-medium">Empresa</span>
            </label>
          </div>
        </div>

        {/* DADOS DE ACESSO */}
        <h2 className="text-xl font-bold mb-4 text-[#2b4466]">Dados de acesso</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <input
              placeholder="Email"
              className="bg-[#f1f7f8] border border-[#04b8c5] p-3 rounded-lg w-full outline-none text-[#2b4466] focus:ring-2 focus:ring-[#2b4466] focus:border-[#2b4466] transition"
              {...register("email", {
                required: "Email obrigatório",
              })}
            />

            {errors.email && (
              <p className="text-red-500 text-sm">
                {errors.email.message}
              </p>
            )}
          </div>

          <div>
            <input
              type="password"
              placeholder="Senha"
              className="bg-[#f1f7f8] border border-[#04b8c5] p-3 rounded-lg w-full outline-none text-[#2b4466] focus:ring-2 focus:ring-[#2b4466] focus:border-[#2b4466] transition"
              {...register("password", {
                required: "Senha obrigatória",
              })}
            />
          </div>

          <div>
            <input
              type="password"
              placeholder="Confirmar senha"
              className="bg-[#f1f7f8] border border-[#04b8c5] p-3 rounded-lg w-full outline-none text-[#2b4466] focus:ring-2 focus:ring-[#2b4466] focus:border-[#2b4466] transition"
              {...register("confirmPassword", {
                required: "Confirme sua senha",
              })}
            />
          </div>
        </div>

        {/* PERFIL */}
        <h2 className="text-xl font-bold mb-4 text-[#2b4466]">Dados do perfil</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {role === "user_freela" && (
            <input
            placeholder="Nome"
            className="bg-[#f1f7f8] border border-[#04b8c5] p-3 rounded-lg w-full outline-none text-[#2b4466] focus:ring-2 focus:ring-[#2b4466] focus:border-[#2b4466] transition"
            {...register("name", {
            required: "Nome obrigatório",
            })}
            />
          )}

          <input
            placeholder="Telefone"
            className="bg-[#f1f7f8] border border-[#04b8c5] p-3 rounded-lg w-full outline-none text-[#2b4466] focus:ring-2 focus:ring-[#2b4466] focus:border-[#2b4466] transition"
            {...register("phone", {
              required: "Telefone obrigatório",
            })}
          />

          {role === "user_freela" && (
            <input
                placeholder="CPF"
                className="bg-[#f1f7f8] border border-[#04b8c5] p-3 rounded-lg w-full outline-none text-[#2b4466] focus:ring-2 focus:ring-[#2b4466] focus:border-[#2b4466] transition"
                {...register("cpf", {
                    required: "CPF obrigatório",
                })}
            />
          )}

          {role === "user_empresa" && (
          <>
            <input
              placeholder="CNPJ"
              className="bg-[#f1f7f8] border border-[#04b8c5] p-3 rounded-lg w-full outline-none text-[#2b4466] focus:ring-2 focus:ring-[#2b4466] focus:border-[#2b4466] transition"
              {...register("cnpj", {
                required: "CNPJ obrigatório",
              })}
            />

            <input
              placeholder="Razão Social"
              className="bg-[#f1f7f8] border border-[#04b8c5] p-3 rounded-lg w-full outline-none text-[#2b4466] focus:ring-2 focus:ring-[#2b4466] focus:border-[#2b4466] transition"
              {...register("razaoSocial")}
            />

            <input
              placeholder="Nome Fantasia"
              className="bg-[#f1f7f8] border border-[#04b8c5] p-3 rounded-lg w-full outline-none text-[#2b4466] focus:ring-2 focus:ring-[#2b4466] focus:border-[#2b4466] transition"
              {...register("nomeFantasia")}
            />
          </>
        )}
        </div>

        {/* ENDEREÇO */}
        <h2 className="text-xl font-bold mb-4 text-[#2b4466]">Endereço</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <input 
                placeholder="CEP"
                className="bg-[#f1f7f8] border border-[#04b8c5] p-3 rounded-lg w-full outline-none text-[#2b4466] focus:ring-2 focus:ring-[#2b4466] focus:border-[#2b4466] transition"            
            {...register("cep", {
              required: "CEP obrigatório",
            })}            
          />
                      
          <input
            placeholder="Rua"
            className="bg-[#f1f7f8] border border-[#04b8c5] p-3 rounded-lg w-full outline-none text-[#2b4466] focus:ring-2 focus:ring-[#2b4466] focus:border-[#2b4466] transition"
            {...register("street", {
              required: "Rua obrigatória",
            })}
          />

          <input
            placeholder="Número"
            className="bg-[#f1f7f8] border border-[#04b8c5] p-3 rounded-lg w-full outline-none text-[#2b4466] focus:ring-2 focus:ring-[#2b4466] focus:border-[#2b4466] transition"
            {...register("number", {
              required: "Número obrigatório",
            })}
          />

          <input
            placeholder="Cidade"
            className="bg-[#f1f7f8] border border-[#04b8c5] p-3 rounded-lg w-full outline-none text-[#2b4466] focus:ring-2 focus:ring-[#2b4466] focus:border-[#2b4466] transition"
            {...register("city", {
              required: "Cidade obrigatória",
            })}
          />

          <input
            placeholder="Estado"
            className="bg-[#f1f7f8] border border-[#04b8c5] p-3 rounded-lg w-full outline-none text-[#2b4466] focus:ring-2 focus:ring-[#2b4466] focus:border-[#2b4466] transition"
            {...register("state", {
              required: "Estado obrigatório",
            })}
          />

          <input
            placeholder="Bairro"
            className="bg-[#f1f7f8] border border-[#04b8c5] p-3 rounded-lg w-full outline-none text-[#2b4466]"
            {...register("bairro", {
            required: "Bairro obrigatório",
            })}
          />
        </div>

        {/* MENSAGENS */}
        {message && (
          <div className="mb-4 text-center font-semibold text-[#986f7b]">
            {message}
          </div>
        )}

        {/* BOTÃO */}
        <button
          type="submit"
          disabled={loading}
          className="bg-[#d5ac89] hover:bg-[#c89a72] text-[#2b4466] w-full p-3 rounded-lg font-bold transition duration-300 shadow-md"
        >
          {loading ? "Cadastrando..." : "Cadastrar"}
        </button>
      </form>
    </div>
  );
}