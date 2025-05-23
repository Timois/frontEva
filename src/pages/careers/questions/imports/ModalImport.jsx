/* eslint-disable react/prop-types */
import { FileUpload } from "../../../../components/forms/FileUpload"
import { Card } from "../../../../components/login/Card"

export const ModalImport = ({ modalIdImp, title }) => {
  return (
    <div
      className="modal fade"
      id={modalIdImp}
      tabIndex="-1"
      aria-labelledby="exampleModalLabel"
      aria-hidden="true"
      data-bs-backdrop="static"
      style={{ zIndex: "1100" }}
    >
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title text-center text-success" id="exampleModalLabel">{title}</h5>
          </div>
          <Card className="card align-items-center h-auto gap-3 p-3">
            <FileUpload />
          </Card>
        </div>
      </div>
    </div>
  )
}