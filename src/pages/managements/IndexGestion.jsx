/* eslint-disable no-unused-vars */
import React from 'react'
import { Gestiones } from './Gestiones'
import ButtonAdd from './ButtonAdd'
import { ModalRegister } from './ModalRegister'
import { ModalExtension } from './ModalExtension'
import ButtonAddExtension from './ButtonAddExtension'

export const IndexGestion = () => {
  const modalId = "resgistroGestion"
  const modalIdE = "registrarextension"
  return (
    <div className='p-3 m-3'>
      <ButtonAdd modalIdG={modalId} />
      <ButtonAddExtension modalIdE={modalIdE} />
      <div>
        <Gestiones />
      </div>
      <ModalRegister modalId={modalId} title="Registrar Gestion Academica"/>
      <div>
        <ModalExtension modalId={modalIdE} title="Crear Extension Academica"/>
      </div>
    </div>

  )
}
