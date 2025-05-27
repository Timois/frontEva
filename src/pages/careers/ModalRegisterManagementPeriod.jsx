import { useEffect } from "react";
import { Card } from "../../components/login/Card";
import PropTypes from 'prop-types';
import { FormManagementPeriod } from "../../components/forms/FormManagementPeriod";
import { useFetchPeriod } from "../../hooks/fetchPeriod";

export const ModalRegisterManagementPeriod = ({ id }) => {
    const { getData } = useFetchPeriod();
    useEffect(() => {
        getData();
    }, []);
    
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
                        <FormManagementPeriod  />
                    </Card>
                </div>
            </div>
        </div>
    );
};

ModalRegisterManagementPeriod.propTypes = {
    id: PropTypes.string.isRequired,
};
