/* eslint-disable no-unused-vars */
import React, { useContext, useEffect, useState } from "react"
import { getApi } from "../services/axiosServices/ApiService"
import { CareerContext } from "../context/CareerProvider"
import { RegistrarCarrera } from "../components/modal/RegistrarCarrera"
export const Carreras = () => {
  const {careers, setCareers} = useContext(CareerContext)
  const fetchCarrera = async () => {
    try {
      const response = await getApi("career/list")
      setCareers(response) 
    } catch (error) {
      console.error("Error al cargar las carreras:", error)
    }
  }
  useEffect(() => {
    fetchCarrera()
  }, [])
  return (
    <>
      <div className="container-fluid justify-content-end mb-3">
        <RegistrarCarrera />
      </div>
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
                <td>{career.name}</td>
                <td>{career.initials}</td>
                <td>
                  <button className="btn btn-warning btn-sm me-2">Editar</button>
                  <button className="btn btn-info btn-sm">Ver</button>
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
    </>
  )
}
