// src/pages/VistaCrearRol.jsx

import { Card } from "../../components/login/Card";
import { FormRol } from "../../components/forms/FormRol";

const RegisterRol = () => {
    return (
        <div className="p-6 max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold mb-4 text-center text-green-600">Registrar nuevo rol</h2>
            <Card className="p-6 shadow-md rounded">
                <FormRol />
            </Card>
        </div>
    );
};

export default RegisterRol;
