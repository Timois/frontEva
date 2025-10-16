/* eslint-disable react/prop-types */
import ExamHeader from "./ExamHeader";
import QuestionCard from "./QuestionCard";
import SubmitSection from "./SubmitSection";

const ActiveExam = ({
  evaluationTitle,
  questionsData,
  socketTimeData,
  selectedAnswers,
  API_BASE_URL,
  handleAnswerSelection,
  handleSubmit,
  loading,
}) => (
  <div className="container-fluid p-4">
    <ExamHeader
      evaluationTitle={evaluationTitle}
      testCode={questionsData?.test_code}
      socketTimeData={socketTimeData}
      examStarted={socketTimeData.started}
    />

    <div className="questions-container">
      {questionsData.questions.map((question, index) => (
        <QuestionCard
          key={question.question_id}
          question={question}
          index={index}
          API_BASE_URL={API_BASE_URL}
          selectedAnswers={selectedAnswers}
          examStarted={socketTimeData.started}
          handleAnswerSelection={handleAnswerSelection}
        />
      ))}
    </div>

    <SubmitSection
      loading={loading}
      socketTimeData={socketTimeData}
      examStarted={socketTimeData.started}
      handleSubmit={handleSubmit}
    />
  </div>
);

export default ActiveExam;
