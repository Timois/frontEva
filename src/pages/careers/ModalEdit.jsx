/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React from 'react'
import { Card } from '../../components/login/Card'
import { EditCareer } from '../../components/editForms/EditCareer'

export const ModalEdit = ({ idEditar, data }) => {
    return (
      <div
        className="modal fade"
        id={idEditar}
        tabIndex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
        style={{ zIndex: "1100" }}
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <Card className="card align-items-center h-auto gap-3 p-3">
              <EditCareer data={data}/>
            </Card>
          </div>
        </div>
      </div>
    )
  }
