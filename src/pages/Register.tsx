"use client"

import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { addUsuario } from "../../api";

function Register() {
    const [nome, setNome] = useState("");
    const [sobrenome, setSobrenome] = useState("");
    const [email, setEmail] = useState("");
    const [cpf, setCpf] = useState("");
    const[isSubmitting, setIsSubmitting] = useState(false)



    const navigate = useNavigate();

    const handleSubmit =async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true)
        try {
            const usuario = {
                nome, sobrenome, email, cpf
            }

            await addUsuario(usuario)
        } catch (error) {
            console.log("Erro ao adicionar o usuario", error)
            setIsSubmitting(false)
        }

        navigate(`/perfil/${nome}`, {
            state: { nome, sobrenome, email, cpf }
        });
    };

    return (
        <div className="h-screen flex flex-col items-center justify-center bg-blue-900">
            <h1 className="mb-6 text-lg font-bold text-center text-gray-400">
                CADASTRE-SE
            </h1>
            <hr className="w-screen" />
            <p className="mt-4 text-sm text-center text-white">
                Faça seu cadastro e aproveite nosso conteúdo
            </p>
            <form className="mt-4 p-4 bg-cyan-200" onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Digite seu nome"
                    className="p-2"
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                />
                <input
                    type="text"
                    placeholder="Digite seu sobrenome"
                    className="p-2 mt-2"
                    value={sobrenome}
                    onChange={(e) => setSobrenome(e.target.value)}
                />
                <input
                    type="email"
                    placeholder="Digite seu e-mail"
                    className="p-2 mt-2"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <input
                    type="text"
                    placeholder="Digite seu CPF"
                    className="p-2 mt-2"
                    value={cpf}
                    onChange={(e) => setCpf(e.target.value)}
                />
                <button className="ml-2 p-1 bg-blue-900 text-white rounded mt-4" type="submit"
                disabled={isSubmitting}
                >
                    {isSubmitting? "Cadastrando..." : "Cadastrar"}
                </button>
            </form>
            <Link
                className="mt-4 mr-4 text-blue-600 bg-gray-300 rounded px-4 hover:bg-gray-500"
                to="/"
            >
                Voltar
            </Link>
        </div>
    );
}

export default Register;
