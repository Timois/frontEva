/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React from 'react'

export const Button = ({ type, name, children, disable=false, onClick }) => {
    return (
        <button onClick={onClick} type={type} name={name} disabled={disable} className="btn rounded-0 w-100" style={{backgroundColor: '#070785', color: 'white'}}>{children}</button>
    )
}
