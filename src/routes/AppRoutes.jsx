import { Navigate, Outlet, Route, Routes } from "react-router-dom"
import { PrivateGuard } from "./PrivateGuard"
import { PublicGuard } from "./PublicGuard"
import { Inicio } from "../pages/Inicio"
import { Login } from "../pages/auth/Login"
import Layout from '../components/layouts/layout/Layout'
import { IndexUnit } from "../pages/units/IndexUnit"
import { IndexCareer } from "../pages/careers/IndexCareer"
import { IndexGestion } from "../pages/managements/IndexGestion"
import { IndexPeriod } from "../pages/periods/IndexPeriod"
import { NotFound404 } from "../pages/errors/NotFound404"
import { IndexCareerAssign } from "../pages/careers/careerAssign/IndexCareerAssign"
import { IndexResults } from "../pages/results management/IndexResults"
import { IndexExamns } from "../pages/examn management/IndexExamns"
import { IndexArea } from "../pages/careers/areas/IndexArea"
import { IndexImports } from "../pages/careers/questions/imports/IndexImports"
import { IndexQuestions } from "../pages/careers/questions/IndexQuestions"
import { Question } from "../pages/careers/questions/Question" // Asegúrate de importar el componente Question
import { IndexUser } from "../pages/users/IndexUser"
import { StudentLogin } from "../pages/auth/StudentLogin"
import { StudentsHome } from "../pages/StudentsHome"
import { IndexStudents } from "../pages/docentes/IndexStudents"
import { IndexRoles } from "../pages/roles/IndexRoles"
import RegisterRol from "../pages/roles/RegisterRol"
import EditRole from "../pages/roles/EditRole"
import AccessDenied from "../pages/errors/AccesDenied"
import PermissionsGuard from "./PermissionsGuard"
import { IndexAnswer } from "../pages/careers/questions/answers/IndexAnswer"
import { Answer } from "../pages/careers/questions/Answer"

export const AppRoutes = () => {
  return (
    <Routes
      future={{ v7_startTransition: true }}
    >
      <Route element={<PublicGuard />}>
        <Route path="/" element={<Navigate to={"/login"} />} ></Route>
        <Route path="/login" element={<Login />}></Route>
        <Route path="estudiantes" element={<StudentLogin />}></Route>
      </Route>

      <Route element={<PrivateGuard />}>
        <Route element={<Layout><Outlet /></Layout>}>
          <Route path="access-denied" element={<AccessDenied />} />
          <Route path="administracion/home" element={<Inicio />} />
          <Route path="administracion/unit" element={
            <PermissionsGuard requiredPermission={"ver-unidades-academicas"}>
              <IndexUnit />
            </PermissionsGuard>} />
          <Route path="administracion/careers" element={
            <PermissionsGuard requiredPermission={"ver-carreras"}>
              <IndexCareer />
            </PermissionsGuard>} />
          <Route path="administracion/careers/:id/assigns" element={
            <PermissionsGuard requiredPermission={"ver-gestiones-asignadas"}>
              <IndexCareerAssign />
            </PermissionsGuard>} />
          <Route path="administracion/gestion" element={
            <PermissionsGuard requiredPermission={"ver-gestiones"}>
              <IndexGestion />
            </PermissionsGuard>} />
          <Route path="administracion/periods" element={
            <PermissionsGuard requiredPermission={"ver-periodos"}>
              <IndexPeriod />
            </PermissionsGuard>} />
          <Route path="administracion/estudiantes" element={
            <PermissionsGuard requiredPermission={"ver-postulantes"}>
              <IndexStudents />
            </PermissionsGuard>} />
          <Route path="administracion/areas" element={
            <PermissionsGuard requiredPermission={"ver-areas"}>
              <IndexArea />
            </PermissionsGuard>} />
          <Route path="administracion/areas/:id/questions" element={
            <PermissionsGuard requiredPermission={"ver-preguntas"}>
              <Question />
            </PermissionsGuard>
          } />
          <Route path="administracion/questions" element={
            <PermissionsGuard requiredPermission={"ver-preguntas"}>
              <IndexQuestions />
            </PermissionsGuard>
          } />
          <Route path="administracion/imports" element={
            <PermissionsGuard requiredPermission={"ver-importaciones"}>
              <IndexImports />
            </PermissionsGuard>} />
          <Route path="administracion/questions" element={
            <PermissionsGuard requiredPermission={"ver-preguntas"}>
              <IndexQuestions />
            </PermissionsGuard>} />
          <Route path="administracion/answers" element={
            <PermissionsGuard requiredPermission={"ver-respuestas"}>
              <IndexAnswer />
            </PermissionsGuard>} />
          <Route path="administracion/questions/:id/answers" element={
            <PermissionsGuard requiredPermission={"ver-respuestas-por-pregunta"}>
              <Answer />
            </PermissionsGuard>} />
          <Route path="administracion/examns" element={
            <PermissionsGuard requiredPermission={"ver-examenes"}>
              <IndexExamns />
            </PermissionsGuard>} />
          <Route path="administracion/results" element={
            <PermissionsGuard requiredPermission={"ver-resultados"}>
              <IndexResults />
            </PermissionsGuard>} />
          <Route path="administracion/users" element={
            <PermissionsGuard requiredPermission={"ver-usuarios"}>
              <IndexUser />
            </PermissionsGuard>} />
          <Route path="administracion/roles" element={
            <PermissionsGuard requiredPermission={"ver-roles"}>
              <IndexRoles />
            </PermissionsGuard>} />
          <Route path="administracion/roles/crear" element={
            <PermissionsGuard requiredPermission={"crear-roles"}>
              <RegisterRol />
            </PermissionsGuard>}></Route>
          <Route path="administracion/roles/:id/editar" element={
            <PermissionsGuard requiredPermission={"editar-roles"}>
              <EditRole />
            </PermissionsGuard>}></Route>
          {/* Rutas de estudiantes */}
          <Route path="estudiantes/home" element={<StudentsHome />} />
          <Route path="estudiantes/examns" element={<IndexExamns />} />
          <Route path="estudiantes/results" element={<IndexResults />} />
        </Route>
      </Route>
      <Route path="404" element={<NotFound404 />}></Route>
    </Routes>
  )
}