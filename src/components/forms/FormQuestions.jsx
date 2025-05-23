import { useContext, useEffect, useState } from "react";
import { AreaContext } from "../../context/AreaProvider";
import { QuestionContext } from "../../context/QuestionsProvider";
import { zodResolver } from "@hookform/resolvers/zod";
import { QuestionsSchema } from "../../models/schemas/QuestionsSchema";
import { useForm } from "react-hook-form";
import { postApi } from "../../services/axiosServices/ApiService";
import { closeFormModal, customAlert } from "../../utils/domHelper";
import { ContainerInput } from "../login/ContainerInput";
import { Input } from "../login/Input";
import { Validate } from "./components/Validate";
import { SelectInput } from "./components/SelectInput";
import { ContainerButton } from "../login/ContainerButton";
import { Button } from "../login/Button";
import CancelButton from "./components/CancelButon";

const arrayOption = [
  { value: "una opcion", text: "Una opción" },
  { value: "multiple", text: "Varias opciones" },
];

const arrayType = [
  { value: "text", text: "Sin Imagen" },
  { value: "image", text: "Con Imagen" },
];

const arrayDificulty = [
  { value: "facil", text: "Fácil" },
  { value: "medio", text: "Medio" },
  { value: "dificil", text: "Difícil" },
];

export const FormQuestions = () => {
  const { areas } = useContext(AreaContext);
  const { addQuestion } = useContext(QuestionContext);
  const [areaName, setAreaName] = useState("");
  const [response, setResponse] = useState(false);
  const [preview, setPreview] = useState(null);
  const [showImageUpload, setShowImageUpload] = useState(false); // Controla la visibilidad del input de imagen

  const { control, handleSubmit, reset, setValue, watch, formState: { errors }, setError } = useForm({
    resolver: zodResolver(QuestionsSchema),
  });
  // Monitorear el campo "question_type" y actualizar el estado
  const questionType = watch("question_type");
  useEffect(() => {
    setShowImageUpload(questionType === "image");
    if (questionType !== "image") {
      setPreview(null);
      setValue("image", null);
    }
  }, [questionType, setValue]);

  useEffect(() => {
    if (areas.length > 0) {
      const selectedArea = areas.find((area) => String(area.id) === String(areaName));
      if (selectedArea) {
        setAreaName(selectedArea.name);
        setValue("area_id", selectedArea.id);
      } else {
        setValue("area_id", "Área no encontrada");
      }
    }
  }, [areas, areaName, setValue]);

  const onSubmit = async (data) => {
    setResponse(true);

    const formData = new FormData();
    formData.append("area_id", data.area_id);
    formData.append("question", data.question);
    formData.append("description", data.description);
    formData.append("type", data.type);
    formData.append("question_type", data.question_type);
    if (data.image) {
      formData.append("image", data.image[0]);
    }
    formData.append("dificulty", data.dificulty);

    const response = await postApi("bank_questions/save", formData);
    setResponse(false);

    if (response.status === 422) {
      for (const key in response.data.errors) {
        setError(key, { type: "custom", message: response.data.errors[key][0] });
      }
      return;
    }

    addQuestion(response);
    customAlert("Pregunta Guardada", "success");
    closeFormModal("registroPregunta");
    resetForm();
  };

  const resetForm = () => {
    reset({
      area_id: "",
      question: "",
      description: "",
      type: "",
      question_type: "",
      image: null,
      dificulty: "",
    });
    setPreview(null);
    setShowImageUpload(false);
  };

  const handleCancel = () => {
    resetForm();
  };

  const onChange = (e) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      setValue("image", files);
      const objectURL = URL.createObjectURL(files[0]);
      setPreview(objectURL);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <ContainerInput>
        <Input name="question" control={control} type="text" placeholder="Ingrese una pregunta" />
        <Validate error={errors.question} />
      </ContainerInput>
      <ContainerInput>
        <Input name="description" control={control} type="text" placeholder="Ingrese una descripción" />
        <Validate error={errors.description} />
      </ContainerInput>
      <ContainerInput>
        <SelectInput name="type" options={arrayOption} control={control} label="Tipo" />
        <Validate error={errors.type} />
      </ContainerInput>
      <ContainerInput>
        <SelectInput name="question_type" options={arrayType} control={control} label="Tipo de pregunta" />
        <Validate error={errors.question_type} />
      </ContainerInput>
       {showImageUpload && (
        <ContainerInput>
          <input type="file" name="image" onChange={onChange} />
          {preview && <img src={preview} alt="Preview" width={100} height={50}/>}
          <Validate error={errors.image} />
        </ContainerInput>
      )}

      <ContainerInput>
        <SelectInput name="dificulty" options={arrayDificulty} control={control} label="Dificultad" />
        <Validate error={errors.dificulty} />
      </ContainerInput>
      
     
      <ContainerButton>
        <Button type="submit" name="submit">
          <span>{response ? "Guardando..." : "Guardar"}</span>
        </Button>
        <CancelButton disabled={response} onClick={handleCancel} />
      </ContainerButton>
    </form>
  );
};
