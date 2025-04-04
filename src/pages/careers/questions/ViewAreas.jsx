import { useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AreaContext } from "../../../context/AreaProvider";

export const ViewAreas = () => {
  const { areas } = useContext(AreaContext);
  const navigate = useNavigate();
  const { career_id } = useParams(); // Obtenemos el career_id de los parámetros
  
  return (
    <div className="container-fluid p-0">
      <div className="row g-0 w-100 m-0">
        {areas?.map((area) => (
          <div key={area.id} className="col-12 col-sm-6 col-md-4 col-lg-3 p-2">
            <div className="card h-100">
              <div className="card-header">
                <h2 className="mb-0">
                  <button 
                    className="btn btn-primary w-100 text-white" 
                    type="button" 
                    onClick={() => navigate(`/administracion/careers/${career_id}/areas/${area.id}/questions`)}
                  >
                    {area.name}
                  </button>
                </h2>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};