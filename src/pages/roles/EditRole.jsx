import { useState, useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { EditRol } from "../../components/editForms/editRol"
import { getApi } from "../../services/axiosServices/ApiService"

const EditRole = () => {
  const { id } = useParams();
  const [selectedRole, setSelectedRole] = useState(null);
  const navigate = useNavigate(); 

  useEffect(() => {
    const fetchRoleWithPermissions = async () => {
      try {
        const response = await getApi(`roles/find/${id}`);
        if (response) {
          setSelectedRole(response);
        } else {
          navigate("/administracion/roles");
        }
      } catch (error) {
        console.error("Error al obtener el rol:", error);
        navigate("/administracion/roles");
      }
    };

    if (id) {
      fetchRoleWithPermissions();
    }
  }, [id, navigate]);

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
