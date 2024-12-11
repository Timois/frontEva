/* eslint-disable no-unused-vars */
import React, { useContext, useEffect, useState } from "react"
import { UnitContext } from "../../context/UnitProvider"
import { useFetchUnit } from "../../hooks/fetchUnit"
import ButtonEdit from "./ButtonEdit"
import ModalEdit from "./modalEdit"
export const Unidad = () => {
  const { units, setUnits } = useContext(UnitContext)
  const [selectedUnit, setSelectedUnit] = useState(null)

  const handleEditClick = (unit) => {
    setSelectedUnit(unit) // Establece los datos de la unidad seleccionada
   
  }
  const { getData } = useFetchUnit()
  useEffect(() => {
    getData()
  }, [])
  const idEditar = "editarUnidad"
  return (
    
    <>
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
                <td><img className="p-2" src={unit.logo} alt="logo" width={60} height={60} />{unit.name}</td>
                <td>{unit.initials}</td>
                <td>{unit.type}</td>
                <td>
                  <ButtonEdit idEditar={idEditar} onEditClick={() => handleEditClick(unit)} />
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
      <ModalEdit idEditar={idEditar} data={selectedUnit} />
    </>
  )
}
