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
  phone: string;

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

  const role = watch("role", "freela");

  async function onSubmit(data: FormData) {
    if (data.password !== data.confirmPassword) {
      setMessage("As senhas não coincidem");
      return;
    }

    try {
      setLoading(true);
      setMessage("");

      const payload = {
        role: data.role,
        email: data.email,
        password: data.password,

        profile: {
          name: data.name,
          cpf: data.cpf?.replace(/\D/g, ""),
          cnpj: data.cnpj?.replace(/\D/g, ""),
          phone: data.phone,
        },

        address: {
          cep: data.cep.replace(/\D/g, ""),
          street: data.street,
          number: data.number,
          city: data.city,
          state: data.state,
        },
      };

      await axios.post("http://localhost:8080/auth/register", payload);

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
    <div className="min-h-screen bg-black-100 flex justify-center items-center p-8">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-black p-8 rounded-xl shadow-lg w-full max-w-3xl"
      >
        <h1 className="text-3xl font-bold mb-6">Cadastro</h1>

        {/* ROLE */}
        <div className="mb-6">
          <label className="font-semibold">Tipo de conta</label>

          <div className="flex gap-4 mt-2">
            <label>
              <input
                type="radio"
                value="freela"
                {...register("role")}
                defaultChecked
              />
              <span className="ml-2">Freela</span>
            </label>

            <label>
              <input
                type="radio"
                value="empresa"
                {...register("role")}
              />
              <span className="ml-2">Empresa</span>
            </label>
          </div>
        </div>

        {/* DADOS DE ACESSO */}
        <h2 className="text-xl font-bold mb-4">Dados de acesso</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <input
              placeholder="Email"
              className="border p-3 rounded w-full"
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
              className="border p-3 rounded w-full"
              {...register("password", {
                required: "Senha obrigatória",
              })}
            />
          </div>

          <div>
            <input
              type="password"
              placeholder="Confirmar senha"
              className="border p-3 rounded w-full"
              {...register("confirmPassword", {
                required: "Confirme sua senha",
              })}
            />
          </div>
        </div>

        {/* PERFIL */}
        <h2 className="text-xl font-bold mb-4">Dados do perfil</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <input
            placeholder="Nome"
            className="border p-3 rounded w-full"
            {...register("name", {
              required: "Nome obrigatório",
            })}
          />

          <input
            placeholder="Telefone"
            className="border p-3 rounded w-full"
            {...register("phone", {
              required: "Telefone obrigatório",
            })}
          />

          {role === "freela" && (
            <input
                placeholder="CPF"
                className="border p-3 rounded w-full"
                {...register("cpf", {
                    required: "CPF obrigatório",
                })}
            />
          )}

          {role === "empresa" && (
            <input
                placeholder="CNPJ"
                className="border p-3 rounded w-full"
              {...register("cnpj", {
                required: "CNPJ obrigatório",
              })}
            />            
          )}
        </div>

        {/* ENDEREÇO */}
        <h2 className="text-xl font-bold mb-4">Endereço</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <input 
                placeholder="CEP"
                className="border p-3 rounded w-full"            
            {...register("cep", {
              required: "CEP obrigatório",
            })}
          />
            
          <input
            placeholder="Rua"
            className="border p-3 rounded w-full"
            {...register("street", {
              required: "Rua obrigatória",
            })}
          />

          <input
            placeholder="Número"
            className="border p-3 rounded w-full"
            {...register("number", {
              required: "Número obrigatório",
            })}
          />

          <input
            placeholder="Cidade"
            className="border p-3 rounded w-full"
            {...register("city", {
              required: "Cidade obrigatória",
            })}
          />

          <input
            placeholder="Estado"
            className="border p-3 rounded w-full"
            {...register("state", {
              required: "Estado obrigatório",
            })}
          />
        </div>

        {/* MENSAGENS */}
        {message && (
          <div className="mb-4 text-center font-semibold text-red-500">
            {message}
          </div>
        )}

        {/* BOTÃO */}
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700 text-white w-full p-3 rounded font-bold"
        >
          {loading ? "Cadastrando..." : "Cadastrar"}
        </button>
      </form>
    </div>
  );
}