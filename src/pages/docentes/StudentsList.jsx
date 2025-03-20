/* eslint-disable no-unused-vars */
import React, { useContext, useEffect } from 'react'
import { StudentContext } from '../../context/StudentProvider';
import { useFetchStudent } from '../../hooks/fetchStudent';

export const StudentsList = () => {
  const { students, setStudents }= useContext(StudentContext);
  const { getData } = useFetchStudent();
  
  useEffect(() => {
    getData();
  }, []);

  return (
    <div className="row">
      <div className="col-12">
        <table className="table table-dark table-striped table-bordered table-responsive border border-warning">
          <thead>
            <tr>
              <th scope="col">N°</th>
              <th scope="col">Ci</th>
              <th scope="col">Nombre</th>
              <th scope="col">Apellido Paterno</th>
              <th scope="col">Apellido Materno</th>
              <th scope="col">Telefono</th>
              <th scope="col">Fecha de Nacimiento</th>
            </tr>
          </thead>
          <tbody>
            {students.length > 0 ? (
              students.map((student, index) => (
                <tr key={student}>
                  <td>{index + 1}</td>
                  <td>{student.ci}</td>
                  <td>{student.name}</td>
                  <td>{student.paternal_surname}</td>
                  <td>{student.maternal_surname}</td>
                  <td>{student.phone_number}</td>
                  <td>{student.birthdate}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="text-center">
                  No hay Usuarios registrados.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
