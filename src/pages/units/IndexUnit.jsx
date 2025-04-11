/* eslint-disable no-unused-vars */
import React from 'react'
import { Unidad } from './Unidad'
import ModalRegister from './ModalRegister'
import ButtonAdd from './ButtonAdd'
import CheckPermissions from '../../routes/CheckPermissions'


export const IndexUnit = () => {
  const modalId = "registroCarrera"

  return (
    <div className='m-3 p-3'>
      <CheckPermissions requiredPermission={"crear-unidades"}>
        <div className="d-flex justify-content-center">
          <ButtonAdd modalId={modalId} />
        </div>
      </CheckPermissions>
      <div className='d-flex justify-content-center'>
        <Unidad />
      </div>
      <CheckPermissions requiredPermission={"crear-unidades"}>
        <ModalRegister modalId={modalId} title="Registrar Carrera" />
      </CheckPermissions>
    </div>
  )
}
