/* eslint-disable no-unused-vars */

import { useContext, useEffect, useState } from "react"
import { GestionContext } from '../../context/GestionProvider'
import { useFetchGestion } from '../../hooks/fetchGestion'
import ButtonEdit from "./ButtonEdit"
import { ModalEdit } from "./ModalEdit"
import CheckPermissions from "../../routes/CheckPermissions"

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
    <div className="container-fluid py-4">
      <div className="card shadow-sm">
        <div className="card-header bg-dark text-white py-3">
          <h5 className="card-title mb-0">
            <i className="fas fa-calendar-alt me-2"></i>
            Gestión Académica
          </h5>
        </div>
        <div className="card-body">
          <div className="table-responsive">
            <table className="table table-hover table-striped align-middle">
              <thead className="table-dark">
                <tr className="text-center">
                  <th scope="col" className="text-center">#</th>
                  <th scope="col">Año</th>
                  <th scope="col">Fecha de Inicio</th>
                  <th scope="col">Fecha de Fin</th>
                  <th scope="col">Acción</th>
                </tr>
              </thead>
              <tbody>
                {gestions.length > 0 ? (
                  gestions.map((gestion, index) => (
                    <tr key={index} className="text-center">
                      <td className="fw-bold">{index + 1}</td>
                      <td>{gestion.year}</td>
                      <td>{gestion.initial_date}</td>
                      <td>{gestion.end_date}</td>
                      <td>
                        <CheckPermissions requiredPermission="editar-gestiones">
                          <ButtonEdit 
                            idEditar={idEditar} 
                            onEditClick={() => handleEditClick(gestion)}
                            className="btn btn-primary btn-sm"
                          />
                        </CheckPermissions>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="text-center text-muted py-4">
                      <i className="fas fa-inbox fa-2x mb-3 d-block"></i>
                      No hay gestiones registradas.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <CheckPermissions requiredPermission="editar-gestiones">
        <ModalEdit idEditar={idEditar} data={selectedGestion} title="Editar Gestión" />
      </CheckPermissions>
    </div>
  );
};
