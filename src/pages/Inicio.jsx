/* eslint-disable no-unused-vars */
import React from "react";
import { FaUniversity, FaBookOpen, FaCalendarAlt, FaRegClock } from "react-icons/fa";

export const Inicio = () => {
  return (
    <div className="container py-4">
      <div className="text-center mb-5">
        <h1 className="fw-bold">Bienvenido al Panel de Administración</h1>
        <p className="text-muted">Desde aquí puedes gestionar las unidades académicas, carreras, gestiones y periodos.</p>
      </div>

      <div className="row g-4">
        <div className="col-md-6 col-lg-3">
          <div className="card shadow-sm border-0 h-100">
            <div className="card-body text-center">
              <FaUniversity size={40} className="text-primary mb-3" />
              <h5 className="card-title">Unidades</h5>
              <p className="card-text text-muted">Administra las unidades académicas de tu institución.</p>
              <a href="/unidades" className="btn btn-sm btn-outline-primary">Gestionar</a>
            </div>
          </div>
        </div>

        <div className="col-md-6 col-lg-3">
          <div className="card shadow-sm border-0 h-100">
            <div className="card-body text-center">
              <FaBookOpen size={40} className="text-success mb-3" />
              <h5 className="card-title">Carreras</h5>
              <p className="card-text text-muted">Crea y gestiona las diferentes carreras profesionales.</p>
              <a href="/carreras" className="btn btn-sm btn-outline-success">Gestionar</a>
            </div>
          </div>
        </div>

        <div className="col-md-6 col-lg-3">
          <div className="card shadow-sm border-0 h-100">
            <div className="card-body text-center">
              <FaCalendarAlt size={40} className="text-warning mb-3" />
              <h5 className="card-title">Gestiones</h5>
              <p className="card-text text-muted">Organiza las gestiones académicas disponibles.</p>
              <a href="/gestiones" className="btn btn-sm btn-outline-warning">Gestionar</a>
            </div>
          </div>
        </div>

        <div className="col-md-6 col-lg-3">
          <div className="card shadow-sm border-0 h-100">
            <div className="card-body text-center">
              <FaRegClock size={40} className="text-danger mb-3" />
              <h5 className="card-title">Periodos</h5>
              <p className="card-text text-muted">Define los periodos dentro de cada gestión académica.</p>
              <a href="/periodos" className="btn btn-sm btn-outline-danger">Gestionar</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
