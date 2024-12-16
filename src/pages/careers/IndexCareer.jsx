
/* eslint-disable no-unused-vars */
import React from 'react'
import { ButtonAdd } from './ButtonAdd'
import { Carreras } from './Carreras'
import { ModalRegister } from './ModalRegister'
import { AssignManagement } from './AssignManagement'
import { ModalRegisterManagement } from './ModalRegisterManagement'
import { Outlet } from 'react-router-dom'
import PropTypes from 'prop-types'


export const IndexCareer = () => {
  const modalId = "registroCarrera"
  const modalIdManagement = "asignarGestion"
  return (
    <div className='m-3 p-3 '>
      <div className='d-flex gap-2'>
        <ButtonAdd modalIdCareer={modalId} />
        <AssignManagement />
      </div>
      <div className='w-100 d-flex justify-content-center'>
        <Carreras />
      </div>
      <ModalRegister ModalId={modalId} title="Registrar Carrera" />
      <ModalRegisterManagement id={modalIdManagement} />
    </div>
  )
}

IndexCareer.propTypes = {
  children: PropTypes.node,
}