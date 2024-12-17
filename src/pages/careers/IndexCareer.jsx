/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
import React from 'react'
import { ButtonAdd } from './ButtonAdd'
import { Carreras } from './Carreras'
import { ModalRegister } from './ModalRegister'
import { ButtonAddGestion } from './ButtonAddGestion'


export const IndexCareer = () => {
    const modalId = "registroCarrera"
    const modalIdGestio = "Asiganrgestion"
  return (
    <div className='m-3 p-3 '>
        <ButtonAdd modalIdCareer={modalId}/>
        <div className='w-100 d-flex justify-content-center'>
            <Carreras/>
        </div>
        <ModalRegister ModalId={modalId} title="Registrar Carrera"/>
    </div>
  ) 
}
