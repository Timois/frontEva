/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getApi } from "../../services/axiosServices/ApiService";
import { Card } from "../../components/login/Card";

export const GeneratePrueba = () => {
    const { id } = useParams();
    const [examn, setExamn] = useState(null);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        const fetchExamn = async () => {
            try {
                const response = await getApi(`evaluations/find/${id}`);
                setExamn(response);
            }catch (error) {
                console.error("Error fetching examn",error);
            }finally {
                setLoading(false);
            }
        } 
        fetchExamn();
    }, [id])
    if (loading) {
        return <div>Loading...</div>;
    }
  return (
    <div className="p-6 max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold mb-4 text-center text-green-600">
                Asignar Preguntas a Evaluación
            </h2>
            <Card className="p-6 shadow-md rounded">
                
            </Card>
        </div>
  )
}
