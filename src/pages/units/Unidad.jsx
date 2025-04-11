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
    <div className="row">
      <div className="col-12">
        <table className="table table-dark table-striped table-bordered table-responsive border border-warning">
          <thead>
            <tr>
              <th scope="col">N°</th>
              <th scope="col">Nombre</th>
              <th scope="col">Sigla</th>
              <th scope="col">Tipo</th>
              <th scope="col">Acción</th>
            </tr>
          </thead>
          <tbody>
            {currentItems.length > 0 ? (

              currentItems.map((unit, index) => (
                <tr key={index}>
                  <td>{offset + index + 1}</td>
                  <td>
                    <img className="p-2" src={unit.logo} alt="logo" width={60} height={60} />
                    {unit.name}
                  </td>
                  <td>{unit.initials}</td>
                  <td>{unit.type}</td>
                  <td>
                    <CheckPermissions requiredPermission={"editar_unidad"}>
                      <ButtonEdit
                        idEditar={idEditar}
                        onEditClick={() => handleEditClick(unit)}
                      />
                    </CheckPermissions>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="text-center">
                  No hay unidades registradas.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <div className="col-12">
        <div className="d-flex justify-content-center mt-3 ">
          <ReactPaginate previousLabel={"Anterior"} nextLabel={"Siguiente"} breakLabel={"..."} pageCount={pageCount}
            marginPagesDisplayed={2} pageRangeDisplayed={3} onPageChange={handlePageClick} containerClassName={"pagination justify-content-center mt-3"}
            pageClassName={"page-item"} pageLinkClassName={"page-link"} previousClassName={"page-item"}
            previousLinkClassName={"page-link"} nextClassName={"page-item"} nextLinkClassName={"page-link"}
            breakClassName={"page-item"} breakLinkClassName={"page-link"} activeClassName={"active"} />
        </div>
      </div>
      <CheckPermissions requiredPermission={"editar_unidad"}>
        <ModalEdit idEditar={idEditar} data={selectedUnit} title="Editar Unidad Academica" />
      </CheckPermissions>
    </div>
  )
}
