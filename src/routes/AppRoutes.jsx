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
import { IndexStudents } from "../pages/students/IndexStudents"
import { IndexResults } from "../pages/results management/IndexResults"
import { IndexExamns } from "../pages/examn management/IndexExamns"
import { IndexArea } from "../pages/careers/areas/IndexArea"
import { IndexImports } from "../pages/careers/areas/imports/IndexImports"
import { IndexQuestions } from "../pages/careers/questions/IndexQuestions"
import { IndexAnswers } from "../pages/careers/answers/IndexAnswers"
import { IndexUser } from "../pages/users/IndexUser"
import { StudentLogin } from "../pages/auth/StudentLogin"


export const AppRoutes = () => {
  return (
    <Routes
      future={{ v7_startTransition: true }}
    >
      <Route element={<PublicGuard />}>
        <Route path="/" element={<Navigate to={"/administracion"} />} ></Route>
        <Route path="administracion" element={<Login />}></Route>
        <Route path="students" element={<StudentLogin />}></Route>
      </Route>

      <Route element={<PrivateGuard />}>
        <Route element={<Layout><Outlet /></Layout>}>
          <Route path="home" element={<Inicio />}></Route>
          <Route path="unit" element={<IndexUnit />}></Route>
          <Route path="career" element={<IndexCareer />}></Route>
          <Route path="career/:id/assigns" element={<IndexCareerAssign />}></Route>
          <Route path="career/:career_id/areas" element={<IndexArea />}></Route>
          <Route path="gestion" element={<IndexGestion />}></Route>
          <Route path="periods" element={<IndexPeriod />} ></Route>
          <Route path="students" element={<IndexStudents />}></Route>
          <Route path="imports" element={<IndexImports />}></Route>
          <Route path="questions" element={<IndexQuestions />}></Route>
          <Route path="answers" element={<IndexAnswers />}></Route>
          <Route path="examns" element={<IndexExamns />}></Route>
          <Route path="results" element={<IndexResults />}></Route>
          <Route path="users" element={<IndexUser/>}></Route>
        </Route>
      </Route>
      <Route path="404" element={<NotFound404 />}></Route>
    </Routes>
  )
}
