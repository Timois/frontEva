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
  return (
    <>
      <table className="table table-striped table-bordered">
        <thead>
          <tr>
            <th scope="col">N°</th>
            <th scope="col">Titulo</th>
            <th scope="col">Descripcion</th>
            <th scope="col">Puntaje total</th>
            <th scope="col">Puntaje de aprobacion</th>
            <th scope="col">Codigo</th>
            <th scope="col">Fecha de realizacion</th>
            <th scope="col">Tipo</th>
            <th scope="col">Estado</th>
            <th scope="col">Cantidad de postulantes</th>
            <th scope="col">Periodo</th>
            <th scope="col">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {examns.length > 0 ? (
            examns.map((examn, index) => (
              <tr key={examn.id}>
                <th scope="row">{index + 1}</th>
                <td>{examn.title}</td>
                <td>{examn.description}</td>
                <td>{examn.total_score}</td>
                <td>{examn.passing_score}</td>
                <td>{examn.code}</td>
                <td>{examn.date_of_realization}</td>
                <td>{examn.type}</td>
                <td>{examn.status}</td>
                <td>{examn.qualified_students}</td>
                <td>{examn.period_name || 'No asignado'}</td>
                <td>
                  <ButtonEdit idEditar={idEditar} onEditClick={() => handleEditClick(examn)} />
                  <ButtonAssignQuestions examnId={examn.id} />
                  <ButtonViewQuestionsAssigned examnId={examn.id} />
                  <ButtonOrderRandomQuestions examnId={examn.id} />
                  <ButtonViewStudentsWithTest examnId={examn.id} />
                  <ModalStudentsWithTest examnId={examn.id} />
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="11">No hay examenes registrados</td>
            </tr>
          )}
        </tbody>
      </table>
      <ModalEdit examn={selectedExamn} idEditar={idEditar} title="Editar Evaluacion" />
      
      </>
  )
}
