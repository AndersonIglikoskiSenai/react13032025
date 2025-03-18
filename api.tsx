import axios from "axios";

const API_URL = "http://localhost:5000/usuarios"

export interface Usuario{
    id?: string | number;
    nome: string,
    sobrenome: string,
    email : string,
    cpf: string
}

export const getUsuarios = async () => {
    const response = await axios.get(API_URL)
    return response.data
}

export const addUsuario = async (usuario: Usuario) => {
    const response = await axios.post(API_URL,usuario)
    return response.data
}

export const deleteUsuario = async (id: string | number) =>{
    const response = await axios.delete(`${API_URL}/${id}`) 
    return response.data
}

export const updateUsuario = async (id: string | number, usuario: Usuario) =>{
    const response = await axios.put(`${API_URL}/${id}`, usuario) 
    return response.data
}