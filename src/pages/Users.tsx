import { useEffect, useState } from "react";
import { getUsuarios, deleteUsuario, updateUsuario, type Usuario } from "../../api";
import { FaEdit, FaTimes, FaTrash, FaSave } from "react-icons/fa";
import Swal from 'sweetalert2'


function Users() {
  const [usuarios, setUsuarios] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [editingId, setEditingId] = useState<string | number | null>(null)
  const [editedUser, setEditedUser] = useState<Usuario | null>(null)
  const [isUpdating, setIsUpdating] = useState(false)

  const fetchUsuarios = async () => { 
    try{
      setLoading(true)
      const data = await getUsuarios()
      setUsuarios(data)
    }catch(error){
      console.log("Erro ao buscar os usuários", error)
    }finally{
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUsuarios();
  }, []);

  const handleDelete = async (id: string | number | undefined) => {
    if (!id) return;
    const result = await Swal.fire({
      title: "Tem certeza que deseja excluir? ",
      text: "Essa ação não poderá ser desfeita",
      icon: 'warning',
      showCancelButton: true,
      cancelButtonColor: "#d33",
      confirmButtonText: "Sim, excluir",
      cancelButtonText: "Não, cancelar"
    })
    if (result.isConfirmed) {
      try {
        await deleteUsuario(id)
        setUsuarios(prev => prev.filter(user => user.id !== id))
        Swal.fire("Excluído", "O usuário foi removido com sucesso", "success")
      } catch (error) {
        console.log("Erro ao excluir o usuário", error)
        Swal.fire("Erro!", "Não foi possível remover o usuário", "error")
      }
    }
  }

  const handleEdit = (usuario: Usuario) => {
    setEditingId(usuario.id || null)
    setEditedUser({ ...usuario })
  }

  const handleChanges = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!editedUser) return;
    const { name, value } = e.target
    setEditedUser(prev => ({ 
      ...prev!, 
      [name]: value 
    }))
  }

  const handleSave = async () => {
    if (!editedUser || !editingId) return
    setIsUpdating(true)
    try {
      setIsUpdating(true)
      await updateUsuario(editingId, editedUser)
      setUsuarios(prev => prev.map(user => user.id === editedUser.id ? editedUser : user))
      setEditingId(null)
      Swal.fire("Atualizado", "O usuário foi atualizado com sucesso", "success")
    } catch (error) {
      console.log("Erro ao atualizar o usuário", error)
      Swal.fire("Erro!", "Não foi possível atualizar o usuário", "error")
    } finally {
      setEditedUser(null)
      setEditedUser(null)
      setIsUpdating(false)
    }
  }

  const handleCancel = () => {
    setEditingId(null) 
    setEditedUser(null)
  }

  const renderInputField = (fieldname: keyof Usuario, value: string) => {
    return(
    <input
    type="text"
    name={fieldname}
    value={value}
    onChange={handleChanges}
    className="p-2"
    />
    )
  }

  const renderActions = (usuario: Usuario) => {
    if (usuario.id === editingId) {
      return (
        <div className="flex justify-center gap-3">
          <button onClick={handleSave} disabled={isUpdating}>
            <FaSave />
            <span> Salvar </span>
          </button>
          <button onClick={handleCancel} disabled={isUpdating}>
            <FaTimes />
            <span> Cancelar </span>
          </button>
        </div>
      )
    } else {
      return (
        <>
        <button onClick={() => handleEdit(usuario)}>
          <FaEdit />
          <span> Editar </span>
        </button>  
        <button onClick={() => handleDelete(usuario.id)}>
          <FaTrash className="text-red-500" />
          <span> Excluir </span>
        </button>
        </>
      )
    }
  }

  return (
    <div className="h-screen flex flex-col items-center justify-center bg-blue-900">
      <h1 className="text-2xl font-bold text-center text-gray-400">
        LISTA DE USUÁRIOS CADASTRADOS
      </h1>
      <hr className="w-full" />
      {loading ?  (
        <p className="text-white"> Carregando usuários ... </p>
      ) : usuarios.length === 0 ? (
       <p className="text-white"> Nenhum usuário cadastratado </p>
      ) : (
      <table className="w-full">
        <thead className="bg-gray-400">
          <tr>
            <th className="border px-2 py-2 text-left"> Nome </th>
            <th className="px-2 py-2 text-left"> Sobrenome </th>
            <th className="px-2 py-2 text-left"> Email </th>
            <th className="px-2 py-2 text-left"> CPF </th>
            <th className="px-2 py-2 text-center"> Ação </th>
          </tr>
        </thead>
        <tbody className="bg-gray-200">
          
          {usuarios.map((usuario) => (
            <tr>
              <td className="px-2">
                {editingId === usuario.id ? 
                  renderInputField("nome", editedUser?.nome || "") : usuario.nome}
              </td>
              <td className="px-2"> 
                {editingId === usuario.id ? 
                  renderInputField("sobrenome", editedUser?.sobrenome || "") : usuario.sobrenome}
              </td>
              <td className="px-2">
                {editingId === usuario.id ? 
                  renderInputField("email", editedUser?.email || "") : usuario.email}
              </td>
              <td className="px-2"> 
                {editingId === usuario.id ? 
                  renderInputField("cpf", editedUser?.cpf || "") : usuario.cpf}
              </td>
              <td className="px-2 text-center flex justify-center gap-3">
                {renderActions(usuario)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      )}
    </div>
  );
}

export default Users;
