

import { Card } from '../../components/login/Card';

export const Error422 = () => {
  return (
    <div className="container mt-5">
      <Card className="p-4">
        <div className="alert alert-danger text-center">
          <h2 className="alert-heading">
            <i className="fas fa-exclamation-triangle me-2"></i>
            Error 422: Entidad no procesable
          </h2>
          <hr />
          <div className="mt-3">
            <p className="mb-3">
              Lo sentimos, no se pudo procesar su solicitud debido a datos inválidos.
            </p>
            <p className="mb-3">
              Por favor, verifique la información proporcionada e intente nuevamente.
            </p>
          </div>
          <div className="mt-4">
            <button 
              className="btn btn-primary"
              onClick={() => window.history.back()}
            >
              Volver atrás
            </button>
          </div>
        </div>
      </Card>
    </div>
  );
};
