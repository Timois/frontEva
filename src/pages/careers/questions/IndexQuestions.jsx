import ButtonAdd from "./ButtonAdd";
import { ModalRegister } from "./ModalRegister";
import { ViewAreas } from "./ViewAreas";

export const IndexQuestions = () => {
  const modalId = "registroPregunta";

  return (
    <div className="m-3 p-3">
      <div className="d-flex justify-content-center">
        <ButtonAdd modalId={modalId} />
      </div>
      <ViewAreas />
      <ModalRegister modalId={modalId} title="Registrar Pregunta" />
    </div>
  );
};
