/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react'
import { useFetchExamns } from '../../hooks/fetchExamns'
import ButtonEdit from './ButtonEdit'
import ModalEdit from './ModalEdit'
import ButtonAssignQuestions from './ButtonAssignQuestions'
import { ButtonViewQuestionsAssigned } from './ButtonViewQuestionsAssigned'
import { ButtonOrderRandomQuestions } from './ButtonOrderRandomQuestions'
import { ButtonViewStudentsWithTest } from './ButtonViewStudentWithTest'
import { ModalStudentsWithTest } from './ModalStudentsWithTest'
import ReactPaginate from 'react-paginate'
import { FaChevronLeft, FaChevronRight, FaClipboardList, FaRegClock, FaUserGraduate } from 'react-icons/fa'
import CheckPermissions from '../../routes/CheckPermissions'
import { ButtonImport } from '../docentes/ButtonImport'
import { ModalImport } from '../docentes/ModalImport'
import ButtonAdd from '../docentes/ButtonAdd'
import ModalRegister from '../docentes/ModalRegister'

export const Examns = () => {
  const { examns, fetchExamsByCareer } = useFetchExamns()
  const [selectedExamn, setSelectedExamn] = useState(null)
  const handleEditClick = (examn) => setSelectedExamn(examn)

  const user = JSON.parse(localStorage.getItem('user'))
  const careerId = user ? user.career_id : null

  useEffect(() => {
    fetchExamsByCareer(careerId)
  }, [])

  const idEditar = "editarExamn"

  const [currentPage, setCurrentPage] = useState(0)
  const itemsPerPage = 5
  const offset = currentPage * itemsPerPage
  const currentItems = examns.slice(offset, offset + itemsPerPage)
  const pageCount = Math.ceil(examns.length / itemsPerPage)

  const handlePageClick = (data) => {
    setCurrentPage(data.selected)
  }
const modalImport = "importarEstudiantes"
const modalRegister = "registerStudent"
  return (
    <div className="container-fluid p-4">
      <div className="card shadow-lg border-0 rounded-3 overflow-hidden">
        <div className="card-header bg-primary text-white py-3 rounded-top">
          <h3 className="mb-0">
            <FaClipboardList className="me-2" />
            Evaluaciones
          </h3>
        </div>

        <div className="p-4">
          {currentItems.length > 0 ? (
            <div className="row g-4">
              {currentItems.map((examn, index) => (
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
                          <span className={`badge ${
                            examn.status === 'Activo' ? 'bg-success' : 'bg-secondary'
                          } bg-opacity-10 text-${examn.status === 'Activo' ? 'success' : 'secondary'}`}>
                            {examn.status}
                          </span>
                        </li>
                        <li className="list-group-item d-flex justify-content-between">
                          <strong>Periodo:</strong>
                          <span className={`badge ${
                            examn.period_name ? 'bg-primary text-primary' : 'bg-secondary text-secondary'
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
                        <CheckPermissions requiredPermission="ver-preguntas-asignadas">
                          <ButtonViewQuestionsAssigned examnId={examn.id} />
                        </CheckPermissions>
                        <CheckPermissions requiredPermission="ver-postulantes-por-evaluacion">
                          <ButtonOrderRandomQuestions examnId={examn.id} />
                        </CheckPermissions>
                        <ButtonViewStudentsWithTest examnId={examn.id} />
                        <ModalStudentsWithTest examnId={examn.id} />
                        <ButtonImport modalId={modalImport} />
                        <ButtonAdd modalIdP={modalRegister}/>
                        <ModalImport ModalId={modalImport} title={"Importar Estudiantes"} />
                        <ModalRegister modalId={modalRegister} title={"Registrar Estudiantes"} />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center text-muted py-5">
              <FaClipboardList className="fs-1 mb-2" />
              <p>No hay evaluaciones registradas</p>
            </div>
          )}
        </div>

        {/* Paginación */}
        <div className="card-footer bg-transparent border-0">
          <div className="d-flex justify-content-center">
            <ReactPaginate
              previousLabel={<FaChevronLeft />}
              nextLabel={<FaChevronRight />}
              breakLabel={"..."}
              pageCount={pageCount}
              marginPagesDisplayed={2}
              pageRangeDisplayed={3}
              onPageChange={handlePageClick}
              containerClassName={"pagination pagination-sm"}
              pageClassName={"page-item"}
              pageLinkClassName={"page-link"}
              previousClassName={"page-item"}
              previousLinkClassName={"page-link"}
              nextClassName={"page-item"}
              nextLinkClassName={"page-link"}
              breakClassName={"page-item"}
              breakLinkClassName={"page-link"}
              activeClassName={"active"}
            />
          </div>
        </div>
      </div>

      {/* Modal de edición */}
      <CheckPermissions requiredPermission="editar-evaluaciones">
        <ModalEdit examn={selectedExamn} idEditar={idEditar} title="Editar Evaluación" />
      </CheckPermissions>
    </div>
  )
}
  