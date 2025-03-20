/* eslint-disable react/prop-types */
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { Button } from "../login/Button";
import { ContainerInput } from "../login/ContainerInput";
import { ContainerButton } from "../login/ContainerButton";
import { Input } from "../login/Input";
import { Validate } from "./components/Validate";
import { loginSystem, loginStudent } from "../../services/axiosServices/AuthServices";
import { useContext, useState } from "react";
import { UserContext } from "../../context/UserProvider";
import { StudentContext } from "../../context/StudentProvider";
import { StudentLoginSchema } from "../../models/schemas/StudentLoginSchema";
import { LoginSchema } from "../../models/schemas/LoginSchema";

const FormLogin = ({ isStudentLogin = false }) => {
  const { storeUser } = useContext(UserContext);
  const { storeStudent } = useContext(StudentContext);
  const [response, setResponse] = useState(false);
  const {
    control,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm({ resolver: zodResolver(isStudentLogin ? StudentLoginSchema : LoginSchema) });
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    setResponse(true);

    try {
      let response;
      if (isStudentLogin) {
      response = await loginStudent(data); // Login para estudiantes con CI y contraseña
      if (response?.access_token) {
        storeStudent(response.student);
        localStorage.setItem("jwt_token", response.access_token);
        navigate("/students/home");
      }
      } else {
        response = await loginSystem(data); // Login para usuarios con email y contraseña
        if (response?.token) {
          storeUser(response.user);
          localStorage.setItem("jwt_token", response.token);
          navigate("/administracion/home");
        }
      }

      if (!response?.token) {
        setError("root", { type: "custom", message: "Credenciales incorrectas" });
      }
    } catch (error) {
      console.error("Error en el login:", error);
      setError("root", { type: "custom", message: "Error en el servidor" });
    } finally {
      setResponse(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <ContainerInput>
        <Input
          type={isStudentLogin ? "text" : "email"}
          placeholder={isStudentLogin ? "Ingrese su CI" : "Ingrese su correo"}
          name={isStudentLogin ? "ci" : "email"}
          control={control}
        />
        <Validate error={isStudentLogin ? errors.ci : errors.email} />
      </ContainerInput>
      <ContainerInput>
        <Input
          type={"password"}
          placeholder={"Ingrese su contraseña"}
          name={"password"}
          control={control}
        />
        <Validate error={errors.password} />
      </ContainerInput>
      <ContainerButton>
        <Button type={"submit"} name={"submit"} disable={response}>
          <span>Iniciar Sesion</span>
        </Button>
      </ContainerButton>
      {errors.root && <p>{errors.root.message}</p>}
    </form>
  );
};

export default FormLogin;