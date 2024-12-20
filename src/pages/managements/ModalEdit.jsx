/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useState } from 'react'
import { Card } from '../../components/login/Card'
import { EditGestion } from '../../components/editForms/EditGestion'

export const ModalEdit = ({ idEditar, data }) => {
  const [showModal, setShowModal] = useState(false)
  const handleCloseModal = () => setShowModal(false)
  return (
    <div
      className="modal fade"
      id={idEditar}
      tabIndex="-1"
      aria-labelledby="exampleModalLabel"
      aria-hidden="true"
      data-bs-backdrop="static"
      style={{ zIndex: "1100" }}
    >
      <div className="modal-dialog">
        <div className="modal-content">
          <Card className="card align-items-center h-auto gap-3 p-3">
            <EditGestion data={data} closeModal={handleCloseModal}/>
          </Card>
        </div>
      </div>
    </div>
  )
}
