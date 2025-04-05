
import { Card } from "../../components/login/Card";
import PropTypes from 'prop-types';
import { UserCreate } from "../../components/forms/UserCreate";

const ModalRegister = ({ modalIdP, title }) => {
    return (
        <div
            className="modal fade"
            id={modalIdP}
            tabIndex="-1"
            aria-labelledby={`${modalIdP}Label`}
            data-bs-backdrop="static"
            style={{ zIndex: "1100" }}
        >
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title text-center text-success" id={`${modalIdP}Label`}>
                            {title}
                        </h5>
                    </div>
                    <Card className="card align-items-center h-auto gap-3 p-3">
                        <UserCreate />
                    </Card>
                </div>
            </div>
        </div>
    );
};

ModalRegister.propTypes = {
    modalIdP: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired
};

export default ModalRegister;