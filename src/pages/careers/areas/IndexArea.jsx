
/* eslint-disable no-unused-vars */
import React from 'react'
import ButtonAdd from './ButtonAdd'
import { Area } from './Area'
import ModalRegister from './ModalRegister'
import CheckPermissions from '../../../routes/CheckPermissions'
import { ViewAreas } from '../questions/ViewAreas'


export const IndexArea = () => {
  const modalId = "registroArea"
  return (
    <div className='m-3 p-3'>
      <CheckPermissions requiredPermission="crear-areas">
        <div className="d-flex justify-content-center gap-2">
          <ButtonAdd modalId={modalId} />
        </div>
      </CheckPermissions>
      <div className=''>
        <ViewAreas />
      </div>
      <CheckPermissions requiredPermission="crear-areas">
        <ModalRegister modalId={modalId} title="Registrar Area de Conocimiento" />
      </CheckPermissions>
    </div>
  )
}
