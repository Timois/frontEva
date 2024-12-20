import { useContext, useEffect, useState } from "react";
import { Card } from "../../components/login/Card";
import PropTypes from 'prop-types';
import { PeriodContext } from "../../context/PeriodProvider";
import { FormManagementPeriod } from "../../components/forms/FormManagementPeriod";
import { useFetchPeriod } from "../../hooks/fetchPeriod";

export const ModalRegisterManagementPeriod = ({ id }) => {
    const { periods } = useContext(PeriodContext);
    const [data, setData] = useState([]);
    const { getData } = useFetchPeriod();

    useEffect(() => {
        if (periods.length === 0) {
            getData();
            return;
        }

        const transformedPeriods = periods.map((career) => ({
            value: career.id,
            text: career.period,
        }));

        setData((prevData) => ({
            ...prevData,
            periods: transformedPeriods,
        }));
    }, [periods]);

    return (
        <div
            className="modal fade"
            id={id}
            tabIndex="-1"
            aria-labelledby="exampleModalLabel"
            aria-hidden="true"
            data-bs-backdrop="static"
            data-academic_management_career_id={id} 
            style={{ zIndex: "1100" }}
        >
            <div className="modal-dialog">
                <div className="modal-content">
                    <Card className="card align-items-center h-auto gap-3 p-3">
                        {data.periods && <FormManagementPeriod data={data} />}
                    </Card>
                </div>
            </div>
        </div>
    );
};

ModalRegisterManagementPeriod.propTypes = {
    id: PropTypes.string.isRequired,
};
