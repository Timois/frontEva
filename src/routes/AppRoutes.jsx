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
import { IndexExamns } from "../pages/examn management/IndexExamns"
import { IndexQuestions } from "../pages/careers/questions/IndexQuestions"
import { Question } from "../pages/careers/questions/Question" // Asegúrate de importar el componente Question
import { IndexUser } from "../pages/users/IndexUser"
import { StudentLogin } from "../pages/auth/StudentLogin"
import { InicioDocente } from "../pages/docentes/InicioDocente"
import { IndexRoles } from "../pages/roles/IndexRoles"
import RegisterRol from "../pages/roles/RegisterRol"
import EditRole from "../pages/roles/EditRole"
import AccessDenied from "../pages/errors/AccesDenied"
import PermissionsGuard from "./PermissionsGuard"
import { Answer } from "../pages/careers/questions/Answer"
import { AssignQuestions } from "../pages/examn management/AssignQuestions"
import { ViewQuestionsAssigned } from "../pages/examn management/ViewQuestionsAssigned"
import ViewQuestionsAndAnswers from "../pages/examn management/ViewQuestionsAndAnswers"
import ViewQuestionsForStudent from "../pages/examn management/ViewQuestionsForStudent"
import { CareerById } from "../pages/careers/CareerById"
import IndexResults from "../pages/results management/IndexResults"
import LayoutStudent from "../components/layouts/layout/LayoutStudent"
import { ImportQuestions } from "../pages/careers/questions/imports/ImportQuestions"
import { CareerPeriodsList } from "../pages/careers/periodsAsign/CareerPeriodsList"
import { IndexArea } from "../pages/careers/areas/IndexArea"
import { IndexStudents } from "../pages/docentes/IndexStudents"
import { Groups } from "../pages/groups/Groups"
export const AppRoutes = () => {
  return (
    <Routes
      future={{ v7_startTransition: true }}
    >
      <Route element={<PublicGuard />}>
        <Route path="/" element={<Navigate to={"/login"} />} ></Route>
        <Route path="/login" element={<Login />}></Route>
        <Route path="/estudiantes" element={<StudentLogin />}></Route>
      </Route>

      <Route element={<PrivateGuard />}>
        <Route element={<Layout><Outlet /></Layout>}>
          <Route path="access-denied" element={<AccessDenied />} />
          <Route path="administracion/home" element={<Inicio />} />
          <Route path="administracion/homeDocente" element={<InicioDocente />} />
          <Route path="administracion/unit" element={
            <PermissionsGuard requiredPermission={"ver-unidades-academicas"}>
              <IndexUnit />
            </PermissionsGuard>} />
          <Route path="administracion/careers" element={
            <PermissionsGuard requiredPermission={"ver-carreras"}>
              <IndexCareer />
            </PermissionsGuard>} />
          <Route path="administracion/career" element={
            <PermissionsGuard requiredPermission={"ver-unidades-por-id"}>
              <CareerById />
            </PermissionsGuard>} />
          <Route path="administracion/careers/:id/assigns" element={
            <PermissionsGuard requiredPermission={"ver-gestiones-asignadas-por-id"}>
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
          <Route path="administracion/periodsByCareer" element={
            <PermissionsGuard requiredPermission={"ver-periodos-asignados"}>
              <CareerPeriodsList />
            </PermissionsGuard>} />
          <Route path="administracion/areas" element={
            <PermissionsGuard requiredPermission={"ver-areas"}>
              <IndexArea />
            </PermissionsGuard>} />
          <Route path="administracion/areas/:id/imports" element={
            <PermissionsGuard requiredPermission={"ver-preguntas"}>
              <ImportQuestions />
            </PermissionsGuard>
          } />
          <Route path="administracion/imports/:id/questions" element={
            <PermissionsGuard requiredPermission={"ver-preguntas"}>
              <Question />
            </PermissionsGuard>} />
          <Route path="administracion/questions" element={
            <PermissionsGuard requiredPermission={"ver-preguntas"}>
              <IndexQuestions />
            </PermissionsGuard>} />
          <Route path="administracion/questions/:id/answers" element={
            <PermissionsGuard requiredPermission={"ver-respuestas-por-pregunta"}>
              <Answer />
            </PermissionsGuard>} />
          <Route path="administracion/periodsByCareer/:id/examns" element={
            <PermissionsGuard requiredPermission={"ver-evaluaciones"}>
              <IndexExamns />
            </PermissionsGuard>} />
          <Route path="administracion/examns/:id/assignQuestions" element={
            <PermissionsGuard requiredPermission={"asignar-preguntas-evaluaciones"}>
              <AssignQuestions />
            </PermissionsGuard>} />
          <Route path="administracion/examns/:id/students" element={
            <PermissionsGuard requiredPermission={"ver-postulantes"}>
              <IndexStudents />
            </PermissionsGuard>} />
          <Route path="administracion/examns/:id/groups" element={
            <PermissionsGuard requiredPermission={"ver-grupos-por-evaluacion"}>
              <Groups />
            </PermissionsGuard>} />
          <Route path="administracion/examns/:id/prueba" element={
            <PermissionsGuard requiredPermission={"ver-preguntas-asignadas"}>
              <ViewQuestionsForStudent />
            </PermissionsGuard>} />
          <Route path="administracion/examns/:id/questionsAssigned" element={
            <PermissionsGuard requiredPermission={"ver-preguntas-asignadas"}>
              <ViewQuestionsAssigned />
            </PermissionsGuard>
          } />
          <Route path="administracion/examns/:id/results" element={
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
        </Route>
      </Route>
      <Route element={<PrivateGuard />}>
        <Route element={<LayoutStudent><Outlet /></LayoutStudent>}>
          <Route path="estudiantes/exams" element={<ViewQuestionsAndAnswers />} />
        </Route>
      </Route>
      <Route path="404" element={<NotFound404 />}></Route>
    </Routes>
  )
}