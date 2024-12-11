/* eslint-disable no-unused-vars */
import React from 'react'
import { Navigate, Outlet, Route } from 'react-router-dom'
import Layout from '../components/layouts/layout/Layout'
import { Inicio } from '../pages/Inicio'
import { Unidad } from '../pages/Unidad'
import { Carreras } from '../pages/Carreras'
import { ExtensionGestion } from '../pages/ExtensionGestion'
import { Gestiones } from '../pages/Gestiones'
import { Periodos } from '../pages/Periodos'
import { ExtensionPeriodos } from '../pages/ExtensionPeriodos'


export const PrivateRoutes = () => {


    return (
        <Route element={<Layout><Outlet /></Layout>}>
            <Route path="home" element={<Inicio />} index></Route>
            <Route path="unit" element={<Unidad />}></Route>
            <Route path="career" element={<Carreras />}></Route>
            <Route path="academic_management_extension" element={<ExtensionGestion />}></Route>
            <Route path="gestion" element={<Gestiones />}></Route>
            <Route path="periods" element={<Periodos />} ></Route>
            <Route path="period_extension" element={<ExtensionPeriodos />}></Route>
        </Route>
    )
}
