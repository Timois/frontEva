/* eslint-disable react/prop-types */

import { FaClipboardList } from "react-icons/fa";
import { Link } from "react-router-dom";

const ButtonAssignQuestions = ({ examnId }) => {
  return (
   <Link to={`/administracion/examns/${examnId}/assignQuestions`}
        className="btn btn-primary btn-sm ms-2"
   >
      <FaClipboardList />
    </Link>
  );
};

export default ButtonAssignQuestions;
