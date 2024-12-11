/* eslint-disable react/no-unknown-property */
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { LoginSchema } from "../../models/schemas/LoginSchema"
import { useNavigate } from "react-router-dom"
import { Button } from "../login/Button"
import { ContainerInput } from "../login/ContainerInput"
import { ContainerButton } from "../login/ContainerButton"
import { Input } from "../login/Input"
import { Validate } from "./components/Validate"
import { getToken, loginSystem } from "../../services/axiosServices/AuthServices"
import { useContext, useState } from "react"
import { UserContext } from "../../context/UserProvider"

const FormLogin = () => {
  const {storeUser} = useContext(UserContext)
  const [response, setResponse] = useState(false)
  const { control, handleSubmit, formState: { errors},setError } = useForm({ resolver: zodResolver(LoginSchema) })
  const navigate = useNavigate()

  const onSubmit = async (data) => {
    setResponse(true)
    await getToken('session/init/')
    const response = await loginSystem("login", data)
    setResponse(false)
    if (response?.status == "success"){
      storeUser(response.user)
      return navigate("/home")
    }
    setError("email", {type: "custom", message: response.data.email})
    setError("password", {type: "custom", message: response.data.password})
  }
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <ContainerInput>
        <Input type={"email"} placeholder={"Ingrese su correo"} name={"email"} control={control} />
        <Validate error={errors.email} />
      </ContainerInput>
      <ContainerInput>
        <Input type={"password"} placeholder={"Ingrese su contraseña"} name={"password"} control={control} />
        <Validate error={errors.password} />
      </ContainerInput>
      <ContainerButton>
        <Button type={"submit"} name={"submit"} disable={response}>
          <span>Iniciar Sesion</span>
        </Button>
      </ContainerButton>
    </form>
  )
}

export default FormLogin