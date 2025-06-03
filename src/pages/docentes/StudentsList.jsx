/* eslint-disable no-unused-vars */
import React, { useContext, useEffect, useState } from 'react';
import { StudentContext } from '../../context/StudentProvider';
import { useFetchStudent } from '../../hooks/fetchStudent';
import ReactPaginate from 'react-paginate';
import { FaChevronLeft, FaChevronRight, FaPhone, FaUserGraduate, FaUserSlash } from 'react-icons/fa';
import { useParams } from 'react-router-dom';

export const StudentsList = () => {
  const {id} = useParams();
  const examnId = id;
  const { students, setStudents } = useContext(StudentContext);
  const { getStudentsByIdExmans } = useFetchStudent();
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 5;
  useEffect(() => {
    getStudentsByIdExmans(examnId);
  }, []);

  const totalPages = Math.ceil(students.length / itemsPerPage) || 1;
  const startIndex = currentPage * itemsPerPage;
  const currentStudents = students.slice(startIndex, startIndex + itemsPerPage);

  const handlePageClick = ({ selected }) => {
    setCurrentPage(selected);
  };

  return (
  <div className="container-fluid p-4">
    <div className="card shadow-lg border-0 rounded-3 overflow-hidden">
      <div className="card-header bg-primary text-white py-3 rounded-top">
        <h3 className="mb-0">
          <FaUserGraduate className="me-2" />
          Lista de Estudiantes
        </h3>
      </div>

      <div className="table-responsive rounded-3">
        <table className="table table-hover align-middle mb-0">
          <thead className="bg-light">
            <tr>
              <th scope="col" width="5%" className="text-center fw-medium text-primary">N°</th>
              <th scope="col" className="fw-medium text-primary">CI</th>
              <th scope="col" className="fw-medium text-primary">Nombre</th>
              <th scope="col" className="fw-medium text-primary">Apellido Paterno</th>
              <th scope="col" className="fw-medium text-primary">Apellido Materno</th>
              <th scope="col" className="fw-medium text-primary">Teléfono</th>
              <th scope="col" className="fw-medium text-primary">Fecha Nacimiento</th>
            </tr>
          </thead>
          <tbody>
            {currentStudents.length > 0 ? (
              currentStudents.map((student, index) => (
                <tr key={student.ci} className="transition-all">
                  <td className="text-center text-muted">{startIndex + index + 1}</td>
                  <td className="fw-semibold">{student.ci}</td>
                  <td className='text-capitalize'>{student.name}</td>
                  <td className='text-capitalize'>{student.paternal_surname}</td>
                  <td className='text-capitalize'>{student.maternal_surname}</td>
                  <td>
                    {student.phone_number && (
                      <a href={`tel:${student.phone_number}`} className="text-decoration-none">
                        <FaPhone className="me-1 text-primary" />
                        {student.phone_number}
                      </a>
                    )}
                  </td>
                  <td>{student.birthdate}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" className="text-center py-5">
                  <div className="d-flex flex-column align-items-center text-muted">
                    <FaUserSlash className="fs-1 mb-2" />
                    No hay estudiantes registrados.
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <div className="card-footer bg-transparent border-0">
        <div className="d-flex justify-content-center">
          <ReactPaginate
            previousLabel={<FaChevronLeft />}
            nextLabel={<FaChevronRight />}
            pageCount={totalPages}
            onPageChange={handlePageClick}
            containerClassName={"pagination pagination-sm"}
            pageClassName={"page-item"}
            pageLinkClassName={"page-link"}
            previousClassName={"page-item"}
            previousLinkClassName={"page-link"}
            nextClassName={"page-item"}
            nextLinkClassName={"page-link"}
            activeClassName={"active"}
            breakClassName={"page-item"}
            breakLinkClassName={"page-link"}
          />
        </div>
      </div>
    </div>
  </div>
);
};
