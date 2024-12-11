/* eslint-disable no-unused-vars */
import React, { useContext, useEffect, useState } from "react"
import { RegistrarUnidad } from "../components/modal/RegistrarUnidad"
import { UnitContext } from "../context/UnitProvider"
import { useFetchUnit } from "../hooks/fetchUnit"
import { EditarUnidad } from "../components/modal/EditarUnidad"
export const Unidad = () => {
  const { units, setUnits } = useContext(UnitContext)
  const { getData } = useFetchUnit()
  useEffect(() => {
    getData()
  }, [])
  return (
    <>
      <div className="container-fluid justify-content-end mb-3">
        <RegistrarUnidad />
        <EditarUnidad/>
      </div>
      <table className="table table-dark table-striped table-bordered table-responsive border border-warning">
        <thead>
          <tr>
            <th scope="col">N°</th>
            <th scope="col">Nombre</th>
            <th scope="col">Sigla</th>
            <th scope="col">Tipo</th>
            <th scope="col">Acción</th>
          </tr>
        </thead>
        <tbody>
          {units.length > 0 ? (
            units.map((unit, index) => (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>{unit.name}</td>
                <td>{unit.initials}</td>
                <td>{unit.type}</td>
                <td>
                  <button className="btn btn-warning btn-sm me-2">Editar</button>
                  <button className="btn btn-info btn-sm">Ver</button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" className="text-center">
                No hay unidades registradas.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </>
  )
}
