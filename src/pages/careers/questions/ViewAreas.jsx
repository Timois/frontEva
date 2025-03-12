import { useContext } from "react";
import { AreaContext } from "../../../context/AreaProvider";
import { Question } from "./Question";
import { QuestionContext } from "../../../context/QuestionsProvider";

export const ViewAreas = () => {
  const { areas } = useContext(AreaContext);
  const { questions } = useContext(QuestionContext); // Obtener todas las preguntas

  return (
    <div className="p-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {areas?.map((area) => (
        <div key={area.id} className="bg-white shadow-md rounded-lg p-4 border">
          <h2 className="text-lg font-semibold text-align-center" >{area.name}</h2>
          <div className="mt-2">
            <Question areaId={area.id} questions={questions.filter(q => q.area_id === area.id)} />
          </div>
        </div>
      ))}
    </div>
  );
};
