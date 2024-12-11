/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React from 'react'
import { Card } from '../../components/login/Card'
import { FormExtensionAcademic } from '../../components/forms/FormExtensionAcademic'


export const ModalExtension = ({ modalId }) => {
    return (
      <div
        className="modal fade"
        id={modalId}
        tabIndex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
        style={{ zIndex: "1100" }}
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <Card className="card align-items-center h-auto gap-3 p-3">
              <FormExtensionAcademic/>
            </Card>
          </div>
        </div>
      </div>
    )
  }