import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { Button } from "../login/Button";
import { ContainerInput } from "../login/ContainerInput";
import { ContainerButton } from "../login/ContainerButton";
import { Input } from "../login/Input";
import { Validate } from "./components/Validate";
import { loginStudent } from "../../services/axiosServices/AuthServices";
import { useContext, useState } from "react";
import { StudentContext } from "../../context/StudentProvider";
import { StudentLoginSchema } from "../../models/schemas/StudentLoginSchema";

const FormStudentLogin = () => {
  const { storeStudent } = useContext(StudentContext);
  const [response, setResponse] = useState(false);
  const {
    control,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm({ resolver: zodResolver(StudentLoginSchema) });
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    setResponse(true);
    try {
      const response = await loginStudent(data);

      if (response?.token) {
        storeStudent(response.student);
        localStorage.setItem("jwt_token", response.token);
        // 👉 Navegar directamente al examen sin confirmar
        navigate("/estudiantes/home");
        window.location.reload();
      } else {
        setError("root", {
          type: "custom",
          message: response?.message || "Credenciales incorrectas",
        });
      }
    } catch (error) {
      console.error("Error en el login:", error);
      setError("root", {
        type: "custom",
        message: error.response?.data?.message || "Error en el servidor",
      });
    } finally {
      setResponse(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <ContainerInput>
        <Input
          type="text"
          placeholder="Ingrese su CI"
          name="ci"
          control={control}
        />
        <Validate error={errors.ci} />
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
      {errors.root && (
        <p className="text-danger text-center mt-2">{errors.root.message}</p>
      )}
    </form>
  );
};

export default FormStudentLogin;
