/* eslint-disable react/prop-types */
import ExamHeader from "./ExamHeader";
import QuestionCard from "./QuestionCard";
import SubmitSection from "./SubmitSection";
import { useState } from "react";

const ActiveExam = ({
  evaluationTitle,
  questionsData,
  socketTimeData,
  selectedAnswers,
  API_BASE_URL,
  handleAnswerSelection,
  handleSubmit,
  loading
}) => {

  const [activeTab, setActiveTab] = useState(0);
  const areas = questionsData?.questions_by_area || [];

  return (
    <div className="container-fluid p-4">

      <ExamHeader
        evaluationTitle={evaluationTitle}
        testCode={questionsData?.test_code}
        socketTimeData={socketTimeData}
      />

      <div className="card shadow-sm border-0 mb-4">
        <div className="card-body">

          <ul className="nav nav-pills justify-content-center gap-2">
            {areas.map((area, index) => (
              <li className="nav-item" key={index}>
                <button
                  className={`nav-link px-4 py-2 fw-semibold rounded-pill
                    ${activeTab === index
                      ? "active bg-success text-white shadow-sm"
                      : "bg-light text-dark"
                    }`}
                  onClick={() => setActiveTab(index)}
                >
                  {area.area.toUpperCase()}
                  
                </button>
              </li>
            ))}
          </ul>

        </div>
      </div>

      <div className="card border-0 shadow-sm">
        <div className="card-body">

          <div className="mb-4">
            <h5 className="fw-bold text-dark border-bottom pb-2 text-center">
              {areas[activeTab]?.area?.toUpperCase()}
            </h5>
            <small className="text-muted">
              {areas[activeTab]?.questions?.length || 0} preguntas en esta sección
            </small>
          </div>

          <div className="questions-container">
            {(areas[activeTab]?.questions || []).map((question, index) => (
              <QuestionCard
                key={question.question_id}
                question={question}
                index={index}
                API_BASE_URL={API_BASE_URL}
                selectedAnswers={selectedAnswers}
                examStarted={socketTimeData}
                handleAnswerSelection={handleAnswerSelection}
              />
            ))}
          </div>

        </div>
      </div>

      <SubmitSection
        loading={loading}
        socketTimeData={socketTimeData}
        handleSubmit={handleSubmit}
      />

    </div>
  );
};

export default ActiveExam;