/* eslint-disable no-unused-vars */

import { useContext, useEffect, useState } from "react"
import { GestionContext } from '../../context/GestionProvider'
import { useFetchGestion } from '../../hooks/fetchGestion'
import ButtonEdit from "./ButtonEdit"
import { ModalEdit } from "./ModalEdit"
import CheckPermissions from "../../routes/CheckPermissions"
import { FaCalendarAlt, FaCalendarCheck, FaCalendarDay, FaCalendarTimes } from "react-icons/fa"

export const Gestiones = () => {
  const { gestions, setGestions } = useContext(GestionContext)
  const [selectedGestion, setSelectedGestion] = useState(null)
  const handleEditClick = (gestion) => {
    setSelectedGestion(gestion)
  }

  const { getData } = useFetchGestion()
  useEffect(() => {
    getData()
  }, [])
  const idEditar = "editarGestion"
  return (
    <div className="container-fluid p-4">
      <div className="card shadow-lg border-0 rounded-3 overflow-hidden">
        <div className="card-header bg-primary text-white py-3 rounded-top">
          <h3 className="mb-0">
            <FaCalendarDay className="me-2" />
            Gestión Académica
          </h3>
        </div>

        <div className="table-responsive rounded-3">
          <table className="table table-hover align-middle mb-0">
            <thead className="bg-light">
              <tr>
                <th scope="col" width="8%" className="text-center fw-medium text-primary">#</th>
                <th scope="col" className="fw-medium text-primary">Año</th>
                <th scope="col" className="fw-medium text-primary">Fecha de Inicio</th>
                <th scope="col" className="fw-medium text-primary">Fecha de Fin</th>
                <th scope="col" width="15%" className="text-center fw-medium text-primary">Acción</th>
              </tr>
            </thead>
            <tbody>
              {gestions.length > 0 ? (
                gestions.map((gestion, index) => (
                  <tr key={index} className="transition-all">
                    <td className="text-center fw-bold text-muted">{index + 1}</td>
                    <td>
                      <span className="badge bg-primary bg-opacity-10 text-primary py-2 px-3">
                        {gestion.year}
                      </span>
                    </td>
                    <td className="text-muted">
                      <FaCalendarCheck className="me-2 text-primary" />
                      {gestion.initial_date}
                    </td>
                    <td className="text-muted">
                      <FaCalendarTimes className="me-2 text-primary" />
                      {gestion.end_date}
                    </td>
                    <td className="text-center">
                      <CheckPermissions requiredPermission="editar-gestiones">
                        <ButtonEdit
                          idEditar={idEditar}
                          onEditClick={() => handleEditClick(gestion)}
                          className="btn btn-sm btn-outline-primary d-flex align-items-center justify-content-center mx-auto"
                        >
                        </ButtonEdit>
                      </CheckPermissions>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="text-center py-5">
                    <div className="d-flex flex-column align-items-center text-muted">
                      <FaCalendarAlt className="fs-1 mb-2" />
                      No hay gestiones académicas registradas.
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <CheckPermissions requiredPermission="editar-gestiones">
        <ModalEdit
          idEditar={idEditar}
          data={selectedGestion}
          title="Editar Gestión Académica"
        />
      </CheckPermissions>
    </div>
  );
};
