/* eslint-disable no-unused-vars */
import React from 'react'
import { getDaylyToken } from '../services/storage/storage'
import { Navigate, Outlet } from 'react-router-dom'

export const PublicGuard = () => {
    const token = getDaylyToken()
    return token ? <Navigate to={"/home"}/>: <Outlet/>
}
