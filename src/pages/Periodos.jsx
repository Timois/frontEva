/* eslint-disable no-unused-vars */
import React, { useContext, useEffect } from 'react'
import {RegistrarPeriodo} from '../components/modal/RegistrarPeriodo'
import { PeriodContext } from '../context/PeriodProvider'
import { useFetchPeriod } from '../hooks/fetchPeriod'

export const Periodos = () => {
  const { periods, setPeriods } = useContext(PeriodContext)
  const { getData } = useFetchPeriod()
  useEffect(() => {
    getData()
  }, [])
  return (
    <>
      <div className="container-fluid justify-content-end mb-3">
        <RegistrarPeriodo />
      </div>
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
                <td>{period.level}</td>
                <td>{period.period}</td>
                <td>
                  <button className="btn btn-warning btn-sm me-2">Editar</button>
                  <button className="btn btn-info btn-sm">Ver</button>
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
    </>
  )
}
