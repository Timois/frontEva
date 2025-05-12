/* eslint-disable no-unused-vars */
import React, { useContext, useEffect, useState } from "react"
import ReactPaginate from "react-paginate"
import { UnitContext } from "../../context/UnitProvider"
import { useFetchUnit } from "../../hooks/fetchUnit"
import ButtonEdit from "./ButtonEdit"
import { ModalEdit } from "../careers/ModalEdit"
import CheckPermissions from "../../routes/CheckPermissions"

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
    <div className="container-fluid py-4">
      <div className="card shadow-sm">
        <div className="card-header bg-dark text-white py-3">
          <h5 className="card-title mb-0">
            <i className="fas fa-building me-2"></i>
            Unidades Académicas
          </h5>
        </div>
        <div className="card-body">
          <div className="table-responsive">
            <table className="table table-hover align-middle">
              <thead className="table-dark">
                <tr className="text-center">
                  <th scope="col" width="5%">N°</th>
                  <th scope="col" width="40%">Nombre</th>
                  <th scope="col" width="20%">Sigla</th>
                  <th scope="col" width="20%">Tipo</th>
                  <th scope="col" width="15%">Acción</th>
                </tr>
              </thead>
              <tbody>
                {currentItems.length > 0 ? (
                  currentItems.map((unit, index) => (
                    <tr key={index} className="align-middle">
                      <td className="text-center fw-bold">{offset + index + 1}</td>
                      <td>
                        <div className="d-flex align-items-center">
                          <img 
                            className="rounded-circle me-3" 
                            src={unit.logo} 
                            alt={`Logo de ${unit.name}`} 
                            width={50} 
                            height={50} 
                          />
                          <span className="fw-semibold">{unit.name}</span>
                        </div>
                      </td>
                      <td className="text-center">{unit.initials}</td>
                      <td className="text-center">
                        <span className="badge bg-primary">{unit.type}</span>
                      </td>
                      <td className="text-center">
                        <CheckPermissions requiredPermission="editar-unidades-academicas">
                          <ButtonEdit
                            idEditar={idEditar}
                            onEditClick={() => handleEditClick(unit)}
                            className="btn btn-primary btn-sm"
                          />
                        </CheckPermissions>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="text-center py-4">
                      <i className="fas fa-folder-open fa-2x text-muted mb-3 d-block"></i>
                      <p className="text-muted mb-0">No hay unidades registradas.</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          
          <div className="d-flex justify-content-center mt-4">
            <ReactPaginate
              previousLabel={<i className="fas fa-chevron-left"></i>}
              nextLabel={<i className="fas fa-chevron-right"></i>}
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
        <ModalEdit idEditar={idEditar} data={selectedUnit} title="Editar Unidad Académica" />
      </CheckPermissions>
    </div>
  );
};
