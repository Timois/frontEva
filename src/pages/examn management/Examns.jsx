/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react'
import ButtonEdit from './ButtonEdit'
import ModalEdit from './ModalEdit'
import ButtonAssignQuestions from './ButtonAssignQuestions'
import { ButtonViewGroups } from './ButtonViewGroups'
import { FaClipboardList, FaRegClock } from 'react-icons/fa'
import CheckPermissions from '../../routes/CheckPermissions'
import { ButtonImport } from '../docentes/ButtonImport'
import { ModalImport } from '../docentes/ModalImport'
import ButtonAdd from '../docentes/ButtonAdd'
import ModalRegister from '../docentes/ModalRegister'
import { ButtonViewStudents } from '../docentes/ButtonViewStudents'
import { useNavigate, useParams } from 'react-router-dom'
import { useExamns } from '../../hooks/fetchExamns'

export const Examns = () => {
  const navigate = useNavigate()
  const [selectedExamn, setSelectedExamn] = useState(null)
  const { examns, getExamnsByCareer } = useExamns() // Obtener las evaluaciones desde el contexto o desde una API, por ejemplo, fetchExamsByCareer() o useFetchExamsByCareer()
  const handleEditClick = (examn) => setSelectedExamn(examn)
  const { id: periodId } = useParams()
  const user = JSON.parse(localStorage.getItem('user'))
  const careerId = user ? user.career_id : null
  
  useEffect(() => {
    if (careerId) {
      getExamnsByCareer(careerId)
    }
  }, [careerId])

  if (examns.length === 0) {
    return <div>Loading...</div>
  }

  const currentPeriod = examns.find(p => p.academic_management_period_id == periodId)
  
  const examnsByPeriod = currentPeriod?.evaluations?.map(e => ({
    ...e,
    period_name: currentPeriod.periodo.period
  })) || []  

  const idEditar = "editarExamn"
  const modalRegister = "registerStudent"
  const year = currentPeriod?.year
  const periodName = currentPeriod?.periodo?.level
  
  return (
    <div className="container-fluid p-4">
      <button className="btn btn-dark mb-3" onClick={() => navigate(-1)}>Atras</button>
      <div className="card shadow-lg border-0 rounded-3 overflow-hidden">
        <div className="card-header bg-primary text-white py-3 rounded-top">
          <h1>
            <span className='text-white'>
              Gestión {periodName}/{year}
            </span>
          </h1>

          <h3 className="mb-0">
            <FaClipboardList className="me-2" />
            Evaluaciones
          </h3>

        </div>

        <div className="p-4"> 
          {examnsByPeriod.length > 0 ? (
            <div className="row g-4">
              {examnsByPeriod.map((examn) => (
                <div className="col-md-6 col-lg-4" key={examn.id}>
                  <div className="card border-0 shadow-sm h-100">
                    <div className="card-body d-flex flex-column border border-secondary rounded">
                      <h5 className="card-title fw-bold text-primary">{examn.title}</h5>
                      <p className="card-text text-muted">{examn.description || 'Sin descripción'}</p>

                      <ul className="list-group list-group-flush mb-3">
                        <li className="list-group-item d-flex justify-content-between">
                          <strong>Puntaje:</strong> {examn.total_score}
                        </li>
                        <li className="list-group-item d-flex justify-content-between">
                          <strong>Aprobación:</strong> {examn.passing_score}
                        </li>
                        <li className="list-group-item d-flex justify-content-between">
                          <strong>Fecha:</strong> {examn.date_of_realization}
                        </li>
                        <li className="list-group-item d-flex justify-content-between">
                          <strong><FaRegClock className="me-1" />Tiempo:</strong> {examn.time}
                        </li>
                        <li className="list-group-item d-flex justify-content-between">
                          <strong>Estado:</strong>
                          <span className={`badge ${examn.status === 'Activo' ? 'bg-success' : 'bg-secondary'
                            } bg-opacity-10 text-${examn.status === 'Activo' ? 'success' : 'secondary'}`}>
                            {examn.status}
                          </span>
                        </li>
                        <li className="list-group-item d-flex justify-content-between">
                          <strong>Periodo:</strong>
                          <span className={`badge ${examn.period_name ? 'bg-primary text-primary' : 'bg-secondary text-secondary'
                            } bg-opacity-10`}>
                            {examn.period_name || 'No asignado'}
                          </span>
                        </li>
                      </ul>

                      <div className="mt-auto d-flex flex-wrap gap-1 justify-content-center">
                        <CheckPermissions requiredPermission="editar-evaluaciones">
                          <ButtonEdit idEditar={idEditar} onEditClick={() => handleEditClick(examn)} />
                        </CheckPermissions>
                        <CheckPermissions requiredPermission="asignar-cantidad-preguntas">
                          <ButtonAssignQuestions examnId={examn.id} />
                        </CheckPermissions>
                        <ButtonViewGroups examnId={examn.id} />
                        <ButtonImport modalId={`importarEstudiantes-${examn.id}`} />
                        <ButtonAdd modalIdP={modalRegister} />
                        <ModalImport ModalId={`importarEstudiantes-${examn.id}`} title={"Importar Estudiantes"} examnID={examn.id} />
                        <ModalRegister modalId={modalRegister} title={"Registrar Estudiantes"} examId={examn.id} />
                        <ButtonViewStudents examnId={examn.id} />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center text-muted py-5">
              <FaClipboardList className="fs-1 mb-2" />
              <p>No hay evaluaciones registradas en este Periodo</p>
            </div>
          )}
        </div>
      </div>
      <CheckPermissions requiredPermission="editar-evaluaciones">
        <ModalEdit examn={selectedExamn} idEditar={idEditar} title="Editar Evaluación" />
      </CheckPermissions>
    </div>
  )
}
