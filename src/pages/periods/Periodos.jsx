/* eslint-disable no-unused-vars */
import React, { useContext, useEffect, useState } from 'react'
import { PeriodContext } from '../../context/PeriodProvider'
import { useFetchPeriod } from '../../hooks/fetchPeriod'
import ButtonEdit from './ButtonEdit'
import ModalEdit from './ModalEdit'


export const Periodos = () => {
  const { periods, setPeriods } = useContext(PeriodContext)
  const [selectedPeriod, setSelectedPeriod] =useState(null)

  const handleEditClick = (periodo) => {
    setSelectedPeriod(periodo)
  }

  const { getData } = useFetchPeriod()
  useEffect(() => {
    getData()
  }, [])
  const idEditar = "editarperiodo"
  return (
    <>
      <table className="table table-dark table-striped table-bordered table-responsive border border-warning">
        <thead>
          <tr>
            <th scope="col">N°</th>
            <th scope="col">Nivel</th>
            <th scope="col">Periodo</th>
            <th scope="col">Acción</th>
          </tr>
        </thead>
        <tbody>
          {periods.length > 0 ? (
            periods.map((period, index) => (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>{period.period}</td>
                <td>{period.level}</td>
                <td>
                  <ButtonEdit idEditar={idEditar} onEditClick={() => handleEditClick(period)}/>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" className="text-center">
                No hay Periodos registrados.
              </td>
            </tr>
          )}
        </tbody>
      </table>
      <ModalEdit idEditar={idEditar} data={selectedPeriod}/>
    </>
  )
}
