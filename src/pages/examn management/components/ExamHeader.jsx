/* eslint-disable react/prop-types */
import { FaQuestionCircle } from "react-icons/fa";
import TimerDisplay from "./TimerDisplay";

const ExamHeader = ({ evaluationTitle, testCode, socketTimeData, examStarted }) => (
  <div className="card shadow-lg border-0 rounded-3 mb-4 overflow-hidden">
    <div className="card-header bg-primary text-white py-3 rounded-top d-flex justify-content-between align-items-center">
      <div>
        <h3 className="mb-1 d-flex align-items-center">
          <FaQuestionCircle className="me-2" />Evaluación: {evaluationTitle}
        </h3>
        {testCode && <span className="mb-1">Código de Examen: {testCode}</span>}
      </div>
      {socketTimeData?.timeFormatted && examStarted && (
        <TimerDisplay socketTimeData={socketTimeData} />
      )}
    </div>
  </div>
);

export default ExamHeader;
