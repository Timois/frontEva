

import { ViewAreas } from "./ViewAreas";
import { useFetchAreasByCareer } from "../../../hooks/fetchAreas";
import { useEffect, useRef } from "react";

export const IndexQuestions = () => {
  const { areas, getData } = useFetchAreasByCareer();
  const isLoading = useRef(false);

  useEffect(() => {
    const loadAreas = async () => {
      if (isLoading.current) return;
      
      const user = JSON.parse(localStorage.getItem('user'));
      const careerIdFromStorage = user ? user.career_id : null;
      
      if (careerIdFromStorage) {
        try {
          isLoading.current = true;
          await getData(careerIdFromStorage);
        } finally {
          isLoading.current = false;
        }
      }
    };
    
    loadAreas();
  }, []);

  return (
    <div className="m-3 p-3">
      <div className="d-flex justify-content-center">
        <ViewAreas areas={areas} />
      </div>
    </div>
  );
};
