/* eslint-disable no-unused-vars */

import { useContext, useEffect, useState } from "react"
import { getApi } from "../services/axiosServices/ApiService"
import { CareerContext } from "../context/CareerProvider"
import { CareerAssignContext } from "../context/CareerAssignProvider"
import { PeriodAssignContext } from "../context/PeriodAssignProvider"

export const useFetchCareer = () => {
  const { careers, setCareers } = useContext(CareerContext);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const getDataCareer = async () => {

    try {
      const response = await getApi("careers/list");
      setCareers(response);
    } catch (err) {
      console.error("Error al obtener las carreras:", err);
      setError("Error al conectar con el servidor.");
    } finally {
      setLoading(false);
    }

  };

  useEffect(() => {
    getDataCareer();
  }, []); // Se ejecuta una vez al montar el componente

  return { careers, getDataCareer, loading, error };
};
export const useFetchCareerAssign = (id) => {
  const { careerAssignments, setCareerAssignments } = useContext(CareerAssignContext)
  const getDataCareerAssignments = async () => {
    const response = await getApi(`careers/findByAssignId/${id}`)
    setCareerAssignments(response)
  }
  return { careerAssignments, getDataCareerAssignments }
}

export const useFetchCareerAssignPeriod = () => {
  const { careerAssignmentsPeriods, setCareerAssignmentsPeriods } = useContext(CareerAssignContext);

  const getDataCareerAssignmentPeriods = async (academic_management_career_id) => {
    try {
      if (!academic_management_career_id) return;

      const response = await getApi(`careers/findPeriodByIdAssign/${academic_management_career_id}`);
      if (Array.isArray(response)) {
        setCareerAssignmentsPeriods(response);
      } else {
        setCareerAssignmentsPeriods([]);
      }
    } catch (error) {
      setCareerAssignmentsPeriods([]);
    }
  };

  return { careerAssignmentsPeriods, getDataCareerAssignmentPeriods };
};


export const useFetchPeriodAssign = (id) => {
  const { periodAssignments, setPeriodAssignments } = useContext(PeriodAssignContext)
  const getDataPeriodAssignments = async () => {
    const response = await getApi(`academic_management_period/find/${id}`)
    setPeriodAssignments(response)
  }
  return { periodAssignments, getDataPeriodAssignments }
}