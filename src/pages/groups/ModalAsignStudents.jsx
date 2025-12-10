import React from 'react'
import { Card } from '../../components/login/Card'
import { FormAssignStudentsToGroup } from '../../components/forms/FormAssignStudentsToGroup'

export const ModalAsignStudents = ({modalId, title, groupId}) => {
    return (
        <div
            className="modal fade"
            id={modalId}
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
                        <FormAssignStudentsToGroup groupId={groupId} />
                    </Card>
                </div>
            </div>
        </div>
    )
}
