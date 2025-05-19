/* eslint-disable no-unused-vars */
import React, { useContext, useEffect, useState } from "react"
import ReactPaginate from "react-paginate"
import { UnitContext } from "../../context/UnitProvider"
import { useFetchUnit } from "../../hooks/fetchUnit"
import ButtonEdit from "./ButtonEdit"
import { ModalEdit } from "../careers/ModalEdit"
import CheckPermissions from "../../routes/CheckPermissions"
import { FaChevronLeft, FaChevronRight, FaUniversity } from "react-icons/fa"

export const Unidad = () => {
  const { units, setUnits } = useContext(UnitContext)
  const [selectedUnit, setSelectedUnit] = useState(null)

  const [currentPage, setCurrentPage] = useState(0)
  const itemsPerPage = 5

  const handlePageClick = (data) => {
    setCurrentPage(data.selected)
  }

  const offset = currentPage * itemsPerPage
  const currentItems = units.slice(offset, offset + itemsPerPage)
  const pageCount = Math.ceil(units.length / itemsPerPage)

  const handleEditClick = (unit) => {
    setSelectedUnit(unit)
  }

  const { getData } = useFetchUnit()

  useEffect(() => {
    getData()
  }, [])

  const idEditar = "editarCarrera"

  return (
    <div className="container-fluid p-4">
      <div className="card shadow-lg border-0 rounded-3 overflow-hidden">
        <div className="card-header bg-primary text-white py-3 rounded-top">
          <h3 className="mb-0">
            <FaUniversity className="me-2" />
            Unidades Académicas
          </h3>
        </div>

        <div className="table-responsive rounded-3">
          <table className="table table-hover align-middle mb-0">
            <thead className="bg-light">
              <tr className="text-center">
                <th scope="col" width="5%" className="fw-medium text-primary">N°</th>
                <th scope="col" width="40%" className="fw-medium text-primary">Nombre</th>
                <th scope="col" width="20%" className="fw-medium text-primary">Sigla</th>
                <th scope="col" width="20%" className="fw-medium text-primary">Tipo</th>
                <th scope="col" width="15%" className="fw-medium text-primary">Acción</th>
              </tr>
            </thead>
            <tbody>
              {currentItems.length > 0 ? (
                currentItems.map((unit, index) => (
                  <tr key={index} className="transition-all">
                    <td className="text-center fw-bold text-muted">{offset + index + 1}</td>
                    <td>
                      <div className="d-flex align-items-center">
                        <img 
                          className="rounded-circle me-3 shadow-sm" 
                          src={unit.logo} 
                          alt={`Logo de ${unit.name}`} 
                          width={50} 
                          height={50} 
                        />
                        <span className="fw-semibold">{unit.name}</span>
                      </div>
                    </td>
                    <td className="text-center text-muted">{unit.initials}</td>
                    <td className="text-center">
                      <span className="badge bg-primary bg-opacity-10 text-primary py-2 px-3">
                        {unit.type}
                      </span>
                    </td>
                    <td className="text-center">
                      <CheckPermissions requiredPermission="editar-unidades-academicas">
                        <ButtonEdit
                          idEditar={idEditar}
                          onEditClick={() => handleEditClick(unit)}
                          className="btn btn-sm btn-outline-primary d-flex align-items-center justify-content-center mx-auto"
                        >
                        </ButtonEdit>
                      </CheckPermissions>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="text-center py-5">
                    <div className="d-flex flex-column align-items-center text-muted">
                      <FaUniversity className="fs-1 mb-2" />
                      No hay unidades académicas registradas.
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

      <CheckPermissions requiredPermission="editar-unidades-academicas">
        <ModalEdit 
          idEditar={idEditar} 
          data={selectedUnit} 
          title="Editar Unidad Académica" 
        />
      </CheckPermissions>
    </div>
  );
};
