/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React from 'react'

export const Validate = ({ error }) => {
    return (
        <>
            {error && <div className='invalid-feedback d-block'>{error.message} </div>}
        </>
    )
}
