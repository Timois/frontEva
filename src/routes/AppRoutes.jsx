import { Navigate, Outlet, Route, Routes } from "react-router-dom"
import { Login } from "../pages/Login"
import { NotFound404 } from "../pages/NotFound404"
import { PrivateGuard } from "./PrivateGuard"
import Layout from "../components/layouts/layout/Layout"
import { Inicio } from "../pages/Inicio"
import { Unidad } from "../pages/Unidad"
import { Carreras } from "../pages/Carreras"
import { ExtensionGestion } from "../pages/ExtensionGestion"
import { Gestiones } from "../pages/Gestiones"
import { Periodos } from "../pages/Periodos"
import { ExtensionPeriodos } from "../pages/ExtensionPeriodos"
import { PublicGuard } from "./PublicGuard"


export const AppRoutes = () => {
  return (
    <Routes>
      <Route element={<PublicGuard />}>
        <Route path="/" element={<Navigate to={"/login"} />} ></Route>
        <Route path="login" element={<Login />}></Route>
      </Route>

      <Route element={<PrivateGuard />}>
        <Route element={<Layout><Outlet /></Layout>}>
          <Route path="home" element={<Inicio />}></Route>
          <Route path="unit" element={<Unidad />}></Route>
          <Route path="career" element={<Carreras />}></Route>
          <Route path="academic_management_extension" element={<ExtensionGestion />}></Route>
          <Route path="gestion" element={<Gestiones />}></Route>
          <Route path="periods" element={<Periodos />} ></Route>
          <Route path="period_extension" element={<ExtensionPeriodos />}></Route>
        </Route>
      </Route>
      <Route path="404" element={<NotFound404 />}></Route>
    </Routes>
  )
}
