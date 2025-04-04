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
import { IndexAnswers } from "../pages/careers/answers/IndexAnswers"
import { IndexUser } from "../pages/users/IndexUser"
import { StudentLogin } from "../pages/auth/StudentLogin"
import { StudentsHome } from "../pages/StudentsHome"
import { IndexStudents} from "../pages/docentes/IndexStudents"
import { IndexRoles } from "../pages/roles/IndexRoles"

export const AppRoutes = () => {
  return (
    <Routes
      future={{ v7_startTransition: true }}
    >
      <Route element={<PublicGuard />}>
        <Route path="/" element={<Navigate to={"/administracion"} />} ></Route>
        <Route path="administracion" element={<Login />}></Route>
        <Route path="estudiantes" element={<StudentLogin />}></Route>
      </Route>

      <Route element={<PrivateGuard />}>
        <Route element={<Layout><Outlet /></Layout>}>
          <Route path="administracion/home" element={<Inicio />} />
          <Route path="administracion/unit" element={<IndexUnit />} />
          <Route path="administracion/careers" element={<IndexCareer />} />
          <Route path="administracion/careers/:id/assigns" element={<IndexCareerAssign />} />
          <Route path="administracion/careers/:career_id/areas" element={<IndexArea />} />
          {/* Nueva ruta para ver preguntas por área */}
          <Route path="administracion/careers/:career_id/areas/:areaId/questions" element={<Question />} />
          <Route path="administracion/gestion" element={<IndexGestion />} />
          <Route path="administracion/periods" element={<IndexPeriod />} />
          <Route path="administracion/estudiantes" element={<IndexStudents />} />
          <Route path="administracion/imports" element={<IndexImports />} />
          <Route path="administracion/questions" element={<IndexQuestions />} />
          <Route path="administracion/answers" element={<IndexAnswers />} />
          <Route path="administracion/examns" element={<IndexExamns />} />
          <Route path="administracion/results" element={<IndexResults />} />
          <Route path="administracion/users" element={<IndexUser />} />
          <Route path="administracion/roles" element={<IndexRoles/>}/>
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