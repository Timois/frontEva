import { useEffect } from "react";
import { useFetchRol } from "../../hooks/fetchRoles";
import ButtonEdit from "./ButtonEdit"; // Asegúrate de que ButtonEdit está importado correctamente
import CheckPermissions from "../../routes/CheckPermissions";
import { FaEdit, FaLock, FaUserShield } from "react-icons/fa";

export const Roles = () => {
  const { roles, getData } = useFetchRol();

  useEffect(() => {
    getData(); // Obtener los roles al cargar el componente
  }, [getData]);

 return (
    <div className="container-fluid p-4">
      <div className="card shadow-lg border-0 rounded-3 overflow-hidden">
        <div className="card-header bg-primary text-white py-3 rounded-top">
          <h3 className="mb-0">
            <FaLock className="me-2" />
            Gestión de Roles
          </h3>
        </div>

        <div className="table-responsive rounded-3">
          <table className="table table-hover align-middle mb-0">
            <thead className="bg-light">
              <tr>
                <th scope="col" className="text-center fw-medium text-primary">#</th>
                <th scope="col" className="fw-medium text-primary">Nombre</th>
                <th scope="col" className="text-center fw-medium text-primary">Acción</th>
              </tr>
            </thead>
            <tbody>
              {roles.length > 0 ? (
                roles.map((permiso, index) => (
                  <tr key={index} className="transition-all">
                    <td className="text-center text-muted">{index + 1}</td>
                    <td className="fw-semibold">{permiso?.name}</td>
                    <td className="text-center">
                      <CheckPermissions requiredPermission="editar-roles">
                        <ButtonEdit
                          roleId={permiso?.id}
                          className="btn btn-sm btn-outline-primary d-flex align-items-center justify-content-center"
                        >
                          <FaEdit className="me-1" /> Editar
                        </ButtonEdit>
                      </CheckPermissions>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3" className="text-center py-5">
                    <div className="d-flex flex-column align-items-center text-muted">
                      <FaUserShield className="fs-1 mb-2" />
                      No hay roles registrados.
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
