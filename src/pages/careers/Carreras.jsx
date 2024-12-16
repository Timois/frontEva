/* eslint-disable no-unused-vars */
import React, { useContext, useEffect, useState } from "react"
import { CareerContext } from '../../context/CareerProvider'
import { ButtonEdit } from "./ButtonEdit"
import { ModalEdit } from "./ModalEdit"
import { useFetchCareer } from "../../hooks/fetchCareers"
import { ButtonLink } from "./ButtonLink"

export const Carreras = () => {
  const { careers, setCareers } = useContext(CareerContext)
  const [selectedCareer, setSelectedCareer] = useState(null)

  const handleEditClick = (career) => {
    setSelectedCareer(career)
  }

  const { getDataCareer } = useFetchCareer()
  useEffect(() => {
    getDataCareer()
  }, [])
  const idEditar = "editarCarrera"
  return (
    <>
      <table className="table table-dark table-striped table-bordered table-responsive border border-warning">
        <thead>
          <tr>
            <th scope="col">N°</th>
            <th scope="col">Nombre</th>
            <th scope="col">Sigla</th>
            <th scope="col">Acción</th>
          </tr>
        </thead>
        <tbody>
          {careers.length > 0 ? (
            careers.map((career, index) => (
              <tr key={index}>
                <td>{index + 1}</td>
                <td><img className="p-2" src={career.logo} alt="logo" width={60} height={60} />{career.name}</td>
                <td>{career.initials}</td>
                <td>
                  <ButtonEdit idEditar={idEditar} onEditClick={() => handleEditClick(career)} />
                  <button className="btn btn-info btn-sm">Ver</button>
                  <ButtonLink
                    to={`/career/${career.id}/assigns`}
                  >
                    Ver Gestiones
                  </ButtonLink>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" className="text-center">
                No hay carreras registradas.
              </td>
            </tr>
          )}
        </tbody>
      </table>
      <ModalEdit idEditar={idEditar} data={selectedCareer} />
    </>
  )
}
