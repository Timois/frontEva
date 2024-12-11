/* eslint-disable no-unused-vars */

import { useContext, useEffect, useState } from "react"
import { GestionContext } from '../../context/GestionProvider'
import { useFetchGestion } from '../../hooks/fetchGestion'
import ButtonEdit from "./ButtonEdit"
import { ModalEdit } from "./ModalEdit"

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
    <>
      <div className="container-fluid justify-content-end mb-3">
      </div>
      <table className="table table-dark table-striped table-bordered table-responsive border border-warning">
        <thead>
          <tr>
            <th scope="col">N°</th>
            <th scope="col">Año</th>
            <th scope="col">Fecha de Inicio</th>
            <th scope="col">Fecha de Fin</th>
            <th scope="col">Acción</th>
          </tr>
        </thead>
        <tbody>
          {gestions.length > 0 ? (
            gestions.map((gestion, index) => (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>{gestion.year}</td>
                <td>{gestion.initial_date}</td>
                <td>{gestion.end_date}</td>
                <td>
                  <ButtonEdit idEditar={idEditar} onEditClick={() => handleEditClick(gestion)}/>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" className="text-center">
                No hay gestiones registradas.
              </td>
            </tr>
          )}
        </tbody>
      </table>
      <ModalEdit idEditar={idEditar} data={selectedGestion}/>
    </>
  )
}
