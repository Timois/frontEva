/* eslint-disable no-unused-vars */
import React, { useContext, useEffect, useState } from 'react'
import { AreaContext } from '../../../context/AreaProvider'
import { useFetchAreasByCareer } from '../../../hooks/fetchAreas';
import ButtonEdit from './ButtonEdit';
import { ModalEdit } from './ModalEdit';
import { useParams } from 'react-router-dom';

export const Area = () => {
  const { career_id } = useParams();
  const { areas, setAreas } = useContext(AreaContext);
  const [selectedArea, setSelectedArea] = useState(null);
  const { getData } = useFetchAreasByCareer();

  const handleEditClick = (area) => {
    setSelectedArea(area);
  };

  useEffect(() => {
    if (!career_id) return;

    const fetchData = async () => {
      const data = await getData(career_id);
      setAreas(data);
    };

    fetchData();
  }, [career_id, getData, setAreas])

  const idEditar = "editarArea"
  return (
    <div className="row">
      <div className="col-12">
        <table className="table table-dark table-striped table-bordered table-responsive border border-warning">
          <thead>
            <tr>
              <th scope="col">N°</th>
              <th scope="col">Nombre</th>
              <th scope="col">Descripcion</th>
              <th scope="col">Acción</th>
            </tr>
          </thead>
          <tbody>
            {areas.length > 0 ? (
              areas.map((area, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{area.name}</td>
                  <td>{area.description}</td>
                  <td>
                    <ButtonEdit idEditar={idEditar} onEditClick={() => handleEditClick(area)} />
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="text-center">
                  No hay Areas registrados.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <div className="col-12"></div>
      <ModalEdit></ModalEdit>
    </div>
  )
}

