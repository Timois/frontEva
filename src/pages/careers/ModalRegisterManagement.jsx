/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import { useContext, useEffect, useState } from "react";
import { RegisterManagement } from "../../components/forms/RegisterManagement";
import { Card } from "../../components/login/Card";
import PropTypes from 'prop-types';
import { CareerContext } from "../../context/CareerProvider";
import { GestionContext } from '../../context/GestionProvider';
import { useFetchGestion } from "../../hooks/fetchGestion";

export const ModalRegisterManagement = ({ id, title }) => {
    const { careers } = useContext(CareerContext);
    const { gestions } = useContext(GestionContext);
    const [data, setData] = useState({});
    const { getData } = useFetchGestion();
    const [hasFetched, setHasFetched] = useState(false);

    useEffect(() => {
        if (careers.length === 0) return;

        const transformedCareers = careers.map((career) => ({
            value: career.id,
            text: career.name,
        }));

        setData((prevData) => ({
            ...prevData,
            careers: transformedCareers,
        }));
    }, [careers]);

    useEffect(() => {
        if (gestions.length === 0 && !hasFetched) {
            setHasFetched(true); // Evita que la petición se haga más de una vez
            getData();
        } else if (gestions.length > 0) {
            const transformedGestions = gestions.map((gestion) => ({
                value: gestion.id,
                text: `${gestion.year} - ${gestion.initial_date} - ${gestion.end_date}`,
            }));

            setData((prevData) => ({
                ...prevData,
                academic_managements: transformedGestions
            }));
        }
    }, [gestions, hasFetched]); // Se asegura de ejecutar la lógica una sola vez

    return (
        <div
            className="modal fade"
            id={id}
            tabIndex="-1"
            aria-labelledby="exampleModalLabel"
            aria-hidden="true"
            data-bs-backdrop="static"
            style={{ zIndex: "1100" }}
        >
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title text-center text-success" id="exampleModalLabel">{title}</h5>
                    </div>
                    <Card className="card align-items-center h-auto gap-3 p-3">
                        {data.careers && data.academic_managements && <RegisterManagement data={data} />}
                    </Card>
                </div>
            </div>
        </div>
    );
};

ModalRegisterManagement.propTypes = {
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
};
