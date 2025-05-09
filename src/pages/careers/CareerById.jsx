

import { useEffect, useState } from 'react';
import { getApi } from '../../services/axiosServices/ApiService';
import { Card } from '../../components/login/Card';
import { ButtonVerGestion } from './ButtonVerGestion';
import CheckPermissions from '../../routes/CheckPermissions';

export const CareerById = () => {
    const [career, setCareer] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const user = JSON.parse(localStorage.getItem('user'));
    const careerId = user ? user.career_id : null;

    useEffect(() => {
        const fetchCareer = async () => {
            if (!careerId) {
                setError('No pertenece a ninguna unidad');
                setLoading(false);
                return;
            }

            try {
                const response = await getApi(`careers/find/${careerId}`);
                setCareer(response);
            } catch (err) {
                setError('Error al cargar los datos de la carrera', err);
            } finally {
                setLoading(false);
            }
        };

        fetchCareer();
    }, [careerId]);

    if (loading) return <div className="text-center">Cargando...</div>;
    if (error) return (
        <div className="container mt-4">
            <Card className="p-4">
                <div className="alert alert-warning text-center">
                    <h4 className="alert-heading">¡Atención!</h4>
                    <p>{error}</p>
                    <hr />
                    <p className="mb-0">
                        Por favor, contacte con el administrador para ser asignado a una unidad académica.
                    </p>
                </div>
            </Card>

        </div>
    );
    if (!career) return <div className="alert alert-warning">No se encontró la carrera</div>;

    return (
        <div className="container mt-4">
            <Card className="p-4">
                <div className="row">
                    <div className="col-md-4 text-center">
                        <img
                            src={career.logo}
                            alt={`Logo de ${career.name}`}
                            className="img-fluid rounded mb-3"
                            style={{ maxHeight: '200px' }}
                        />
                    </div>
                    <div className="col-md-8">
                        <h2 className="text-capitalize mb-4">{career.name}</h2>
                        <div className="row">
                            <div className="col-md-6">
                                <p><strong>Sigla:</strong> {career.initials}</p>
                                <p><strong>Tipo:</strong> {career.type}</p>
                            </div>
                            <div className="col-md-6">
                                <p><strong>Fecha de Creación:</strong> {new Date(career.created_at).toLocaleDateString()}</p>
                            </div>
                        </div>
                        <CheckPermissions requiredPermission="ver-gestiones-asignadas-por-id">
                            <ButtonVerGestion 
                                to={`/administracion/careers/${careerId}/assigns`} 
                                careerId={careerId}  // Pasamos el ID explícitamente
                            />
                        </CheckPermissions>
                    </div>
                </div>
            </Card>
        </div>
    );
};
