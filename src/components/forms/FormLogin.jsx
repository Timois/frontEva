import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoginSchema } from "../../models/schemas/LoginSchema";
import { useNavigate } from "react-router-dom";
import { Button } from "../login/Button";
import { ContainerInput } from "../login/ContainerInput";
import { ContainerButton } from "../login/ContainerButton";
import { Input } from "../login/Input";
import { Validate } from "./components/Validate";
import { loginSystem } from "../../services/axiosServices/AuthServices"; // Actualiza la importación
import { useContext, useState } from "react";
import { UserContext } from "../../context/UserProvider";

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
      // Envía las credenciales al nuevo endpoint de login
      const response = await loginSystem(data); // Usa la función actualizada

      if (response?.token) {
        // Si el login es exitoso, guarda el token y la información del usuario
        storeUser(response.user); // Guarda el usuario en el contexto
        localStorage.setItem("jwt_token", response.token); // Guarda el token JWT
        navigate("/home"); // Redirige al usuario
      } else {
        // Si hay errores, muestra los mensajes de error
        setError("email", { type: "custom", message: response.data.email });
        setError("password", { type: "custom", message: response.data.password });
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
          type={"email"}
          placeholder={"Ingrese su correo"}
          name={"email"}
          control={control}
        />
        <Validate error={errors.email} />
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
      {errors.root && <p>{errors.root.message}</p>} {/* Muestra errores generales */}
    </form>
  );
};

export default FormLogin;