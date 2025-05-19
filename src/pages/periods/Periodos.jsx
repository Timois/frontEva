/* eslint-disable no-unused-vars */
import React, { useContext, useEffect, useState } from 'react'
import { PeriodContext } from '../../context/PeriodProvider'
import { useFetchPeriod } from '../../hooks/fetchPeriod'
import ButtonEdit from './ButtonEdit'
import ModalEdit from './ModalEdit'
import CheckPermissions from '../../routes/CheckPermissions'
import { FaCalendarAlt, FaCalendarTimes } from 'react-icons/fa'


export const Periodos = () => {
  const { periods, setPeriods } = useContext(PeriodContext)
  const [selectedPeriod, setSelectedPeriod] = useState(null)

  const handleEditClick = (periodo) => {
    setSelectedPeriod(periodo)
  }

  const { getData } = useFetchPeriod()
  useEffect(() => {
    getData()
  }, [])
  const idEditar = "editarPeriodo"
  return (
    <div className="container-fluid p-4">
      <div className="card shadow-lg border-0 rounded-3 overflow-hidden">
        <div className="card-header bg-primary text-white py-3 rounded-top">
          <h3 className="mb-0">
            <FaCalendarAlt className="me-2" />
            Gestión de Periodos
          </h3>
        </div>

        <div className="table-responsive rounded-3">
          <table className="table table-hover align-middle mb-0">
            <thead className="bg-light">
              <tr>
                <th scope="col" width="10%" className="text-center fw-medium text-primary">N°</th>
                <th scope="col" className="fw-medium text-primary">Periodo</th>
                <th scope="col" className="fw-medium text-primary">Nivel</th>
                <th scope="col" width="20%" className="text-center fw-medium text-primary">Acción</th>
              </tr>
            </thead>
            <tbody>
              {periods.length > 0 ? (
                periods.map((period, index) => (
                  <tr key={index} className="transition-all">
                    <td className="text-center text-muted">{index + 1}</td>
                    <td className="fw-semibold">{period.period}</td>
                    <td>
                      <span className="badge bg-info bg-opacity-10 text-info py-2 px-3">
                        {period.level}
                      </span>
                    </td>
                    <td className="text-center">
                      <CheckPermissions requiredPermission="editar-periodos">
                        <ButtonEdit
                          idEditar={idEditar}
                          onEditClick={() => handleEditClick(period)}
                          className="btn btn-sm btn-outline-primary d-flex align-items-center justify-content-center mx-auto"
                        >
                        </ButtonEdit>
                      </CheckPermissions>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="text-center py-5">
                    <div className="d-flex flex-column align-items-center text-muted">
                      <FaCalendarTimes className="fs-1 mb-2" />
                      No hay periodos registrados.
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <CheckPermissions requiredPermission="editar-periodos">
        <ModalEdit 
          idEditar={idEditar} 
          data={selectedPeriod} 
          title="Editar Periodo" 
        />
      </CheckPermissions>
    </div>
  );
}
