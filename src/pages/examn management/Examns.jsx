/* eslint-disable no-unused-vars */
import React, { useContext, useEffect, useState } from 'react'
import { ExamnsContext } from '../../context/ExamnsProvider'
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

export const Examns = () => {
  const { examns } = useContext(ExamnsContext)
  const [selectedExamn, setSelectedExamn] = useState(null)
  const handleEditClick = (examn) => {
    setSelectedExamn(examn)
  }
  const { getDataExamns } = useFetchExamns()
  useEffect(() => {
    getDataExamns()
  }, [])

  const idEditar = "editarExamn"
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 5;
  const offset = currentPage * itemsPerPage;
  const currentItems = examns.slice(offset, offset + itemsPerPage);
  const pageCount = Math.ceil(examns.length / itemsPerPage);

  const handlePageClick = (data) => {
    setCurrentPage(data.selected);
  };

  return (
    <div className="container-fluid p-4">
      <div className="card shadow-lg border-0 rounded-3 overflow-hidden">
        {/* Encabezado */}
        <div className="card-header bg-primary text-white py-3 rounded-top">
          <h3 className="mb-0">
            <FaClipboardList className="me-2" />
            Evaluaciones
          </h3>
        </div>

        {/* Tabla */}
        <div className="table-responsive rounded-3">
          <table className="table table-hover align-middle mb-0">
            <thead className="bg-light">
              <tr className="text-center">
                <th scope="col" width="3%" className="fw-medium text-primary">N°</th>
                <th scope="col" width="15%" className="fw-medium text-primary">Título</th>
                <th scope="col" width="12%" className="fw-medium text-primary">Descripción</th>
                <th scope="col" width="5%" className="fw-medium text-primary">Puntaje</th>
                <th scope="col" width="5%" className="fw-medium text-primary">Aprobación</th>
                <th scope="col" width="8%" className="fw-medium text-primary">Fecha</th>
                <th scope="col" width="7%" className="fw-medium text-primary">Tipo</th>
                <th scope="col" width="7%" className="fw-medium text-primary">
                  <FaRegClock className="me-1" /> Tiempo
                </th>
                <th scope="col" width="7%" className="fw-medium text-primary">Estado</th>
                <th scope="col" width="7%" className="fw-medium text-primary">
                  <FaUserGraduate className="me-1" /> Postulantes
                </th>
                <th scope="col" width="7%" className="fw-medium text-primary">Periodo</th>
                <th scope="col" width="10%" className="fw-medium text-primary">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {currentItems.length > 0 ? (
                currentItems.map((examn, index) => (
                  <tr key={examn.id} className="transition-all">
                    <td className="text-center fw-bold text-muted">{offset + index + 1}</td>
                    <td className="fw-semibold">{examn.title}</td>
                    <td className="text-muted">{examn.description || '-'}</td>
                    <td className="text-center fw-bold">{examn.total_score}</td>
                    <td className="text-center fw-bold text-success">{examn.passing_score}</td>
                    <td className="text-center">{examn.date_of_realization}</td>
                    <td className="text-center">
                      <span className="badge bg-info bg-opacity-10 text-info py-2 px-3">
                        {examn.type}
                      </span>
                    </td>
                    <td className="text-center">{examn.time}</td>
                    <td className="text-center">
                      <span className={`badge ${
                        examn.status === 'Activo' ? 'bg-success' : 'bg-secondary'
                      } bg-opacity-10 ${
                        examn.status === 'Activo' ? 'text-success' : 'text-secondary'
                      } py-2 px-3`}>
                        {examn.status}
                      </span>
                    </td>
                    <td className="text-center fw-bold">{examn.qualified_students || 0}</td>
                    <td className="text-center">
                      {examn.period_name ? (
                        <span className="badge bg-primary bg-opacity-10 text-primary py-2 px-3">
                          {examn.period_name}
                        </span>
                      ) : (
                        <span className="badge bg-secondary bg-opacity-10 text-secondary py-2 px-3">
                          No asignado
                        </span>
                      )}
                    </td>
                    <td className="text-center">
                      <div className="d-flex flex-wrap justify-content-center gap-1">
                        <CheckPermissions requiredPermission="editar-evaluaciones">
                          <ButtonEdit 
                            idEditar={idEditar} 
                            onEditClick={() => handleEditClick(examn)}
                          />
                        </CheckPermissions>
                        <CheckPermissions requiredPermission="asignar-cantidad-preguntas">
                          <ButtonAssignQuestions examnId={examn.id}/>
                        </CheckPermissions>
                        <CheckPermissions requiredPermission="ver-preguntas-asignadas">
                          <ButtonViewQuestionsAssigned examnId={examn.id}/>
                        </CheckPermissions>
                        <CheckPermissions requiredPermission="ver-postulantes-por-evaluacion">
                          <ButtonOrderRandomQuestions examnId={examn.id}/>
                        </CheckPermissions>
                          <ButtonViewStudentsWithTest examnId={examn.id} />
                        <ModalStudentsWithTest examnId={examn.id} />
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="13" className="text-center py-5">
                    <div className="d-flex flex-column align-items-center text-muted">
                      <FaClipboardList className="fs-1 mb-2" />
                      No hay evaluaciones registradas
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
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
        <ModalEdit 
          examn={selectedExamn} 
          idEditar={idEditar} 
          title="Editar Evaluación" 
        />
      </CheckPermissions>
    </div>
  );
}
