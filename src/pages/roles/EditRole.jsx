/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { EditRol } from "../../components/editForms/editRol"
import { useFetchRol } from "../../hooks/fetchRoles"

const EditRole = () => {
  const { id } = useParams(); // Obtén el id de la URL
  const { roles, getData } = useFetchRol(); // Hook para obtener los roles
  const [selectedRole, setSelectedRole] = useState(null);
  const navigate = useNavigate(); 

  useEffect(() => {
    getData(); // Obtener los roles
  }, [getData]);

  useEffect(() => {
    // Buscar el rol que corresponde al id pasado por la URL
    const role = roles.find(role => role.id === parseInt(id));
    if (role) {
      setSelectedRole(role);
    } else {
      navigate("roles"); // Si no se encuentra el rol, redirigir a la vista de roles
    }
  }, [id, roles, navigate]);

  return (
    <div className="container mt-5">
      <h2>Editar Rol: {selectedRole ? selectedRole.name : "Cargando..."}</h2>
      {selectedRole && (
        <EditRol data={selectedRole} />
      )}
    </div>
  );
}

export default EditRole;
