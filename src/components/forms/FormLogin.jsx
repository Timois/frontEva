/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { Button } from "../login/Button";
import { ContainerInput } from "../login/ContainerInput";
import { ContainerButton } from "../login/ContainerButton";
import { Input } from "../login/Input";
import { Validate } from "./components/Validate";
import { loginSystem } from "../../services/axiosServices/AuthServices";
import { useContext, useState } from "react";
import { UserContext } from "../../context/UserProvider";
import { LoginSchema } from "../../models/schemas/LoginSchema";

const FormLogin = () => {
  const { storeUser } = useContext(UserContext);
  const [response, setResponse] = useState(false);
  const {
    control,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm({ resolver: zodResolver(LoginSchema) });
  const navigate = useNavigate();

  const onSubmit = async (data) => {
     setResponse(true);
  try {
    const response = await loginSystem(data);
    if (response?.token) {
      const { role } = response.user;

      storeUser(response.user);
      localStorage.setItem("jwt_token", response.token);

      if (role.includes("admin")) {
        navigate("/administracion/home");
      } else if (role.includes("docente")) {
        navigate("/administracion/homeDocente");
      } 
      window.location.reload();
    } else {
      setError("root", {
        type: "custom",
        message: "Credenciales incorrectas",
      });
    }
  } catch (error) {
    //console.error("Error en el login:", error);
    setError("root", {
      type: "custom",
      message: "Error en el servidor",
    });
  } finally {
    setResponse(false);
  }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <ContainerInput>
        <Input
          type="email"
          placeholder="Ingrese su correo"
          name="email"
          control={control}
        />
        <Validate error={errors.email} />
      </ContainerInput>
      <ContainerInput>
        <Input
          type="password"
          placeholder="Ingrese su contraseña"
          name="password"
          control={control}
        />
        <Validate error={errors.password} />
      </ContainerInput>
      <ContainerButton>
        <Button type="submit" name="submit" disable={response}>
          <span>{response ? "Iniciando..." : "Iniciar Sesión"}</span>
        </Button>
      </ContainerButton>
      {errors.root && <p className="text-danger text-center mt-2">{errors.root.message}</p>}
    </form>
  );
};

export default FormLogin;