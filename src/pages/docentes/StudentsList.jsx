/* eslint-disable no-unused-vars */
import React, { useContext, useEffect, useState } from 'react';
import { StudentContext } from '../../context/StudentProvider';
import { useFetchStudent } from '../../hooks/fetchStudent';
import ReactPaginate from 'react-paginate';

export const StudentsList = () => {
  const { students, setStudents } = useContext(StudentContext);
  const { getData } = useFetchStudent();
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 5;

  useEffect(() => {
    getData();
  }, []);

  const totalPages = Math.ceil(students.length / itemsPerPage) || 1;
  const startIndex = currentPage * itemsPerPage;
  const currentStudents = students.slice(startIndex, startIndex + itemsPerPage);

  const handlePageClick = ({ selected }) => {
    setCurrentPage(selected);
  };

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
              <th scope="col">Teléfono</th>
              <th scope="col">Fecha de Nacimiento</th>
            </tr>
          </thead>
          <tbody>
            {currentStudents.length > 0 ? (
              currentStudents.map((student, index) => (
                <tr key={student.ci}>
                  <td>{startIndex + index + 1}</td>
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
                <td colSpan="7" className="text-center">
                  No hay Estudiantes importados.
                </td>
              </tr>
            )}
          </tbody>
        </table>
        <div className="d-flex justify-content-center align-items-center bg-dark text-warning p-2 rounded">
          <ReactPaginate
            previousLabel={'⏪'}
            nextLabel={'⏩'}
            pageCount={totalPages}
            onPageChange={handlePageClick}
            containerClassName={'pagination justify-content-center'}
            pageClassName={'page-item'}
            pageLinkClassName={'page-link text-warning bg-dark border-warning'}
            previousClassName={'page-item'}
            previousLinkClassName={'page-link text-warning bg-dark border-warning'}
            nextClassName={'page-item'}
            nextLinkClassName={'page-link text-warning bg-dark border-warning'}
            activeClassName={'active'}
            breakClassName={''}
            breakLinkClassName={''}
          />
        </div>
      </div>
    </div>
  );
};
