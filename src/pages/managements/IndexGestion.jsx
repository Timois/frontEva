/* eslint-disable no-unused-vars */
import React from 'react'
import { Gestiones } from './Gestiones'
import ButtonAdd from './ButtonAdd'
import { ModalRegister } from './ModalRegister'
import CheckPermissions from '../../routes/CheckPermissions'

export const IndexGestion = () => {
  const modalId = "resgistroGestion"
  
  return (
    <div className='p-3 m-3'>
      <CheckPermissions requiredPermission="crear-gestiones">
        <div className="d-flex justify-content-center">
          <ButtonAdd modalIdG={modalId} />
        </div>
      </CheckPermissions>
      <div>
        <Gestiones />
      </div>
      <CheckPermissions requiredPermission="crear-gestiones">
        <div>
          <ModalRegister modalId={modalId} title="Registrar Gestion" />
        </div>
      </CheckPermissions>
    </div>

  )
}
