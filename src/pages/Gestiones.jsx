/* eslint-disable no-unused-vars */
import React, { useContext, useEffect } from 'react'
import { RegistrarGestion } from '../components/modal/RegistrarGestion'
import { EditarGestion } from '../components/modal/EditarGestion'
import { GestionContext } from '../context/GestionProvider'
import { useFetchGestion } from '../hooks/fetchGestion'

export const Gestiones = () => {
  const { gestions, setGestions } = useContext(GestionContext)
  const { getData } = useFetchGestion()
  useEffect(() => {
    getData()
  }, [])
  return (
    <>
      <div className="container-fluid justify-content-end mb-3">
        <RegistrarGestion />
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
                  <button className="btn btn-warning btn-sm me-2">Editar</button>
                  <button className="btn btn-info btn-sm">Ver</button>
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
    </>
  )
}
