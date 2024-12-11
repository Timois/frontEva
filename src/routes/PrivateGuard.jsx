/* eslint-disable no-unused-vars */
import React from 'react'
import { getDaylyToken } from '../services/storage/storage'
import { Navigate, Outlet } from 'react-router-dom'

export const PrivateGuard = () => {
    const token = getDaylyToken()
    return token ? <Outlet/> : <Navigate to={"/"}/>
}
