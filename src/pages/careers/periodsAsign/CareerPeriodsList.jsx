import { useEffect } from 'react';
import { Card } from '../../../components/login/Card';
import { useFetchPeriod } from '../../../hooks/fetchPeriod';
import { Link } from 'react-router-dom';

export const CareerPeriodsList = () => {
    const { periods, getPeriodsByCareerId } = useFetchPeriod();
    const user = JSON.parse(localStorage.getItem('user'));
    const career_id = user ? user.career_id : null;

    useEffect(() => {
        if (career_id) {
            getPeriodsByCareerId(career_id);
        }
    }, [career_id]);

    const getTitleByPeriodType = () => {
        const period = periods?.[0]?.periodo?.period;

        switch (period) {
            case 'semestre1':
            case 'semestre2':
                return <h1>Sistema Semestral</h1>;
            case 'anualizado':
                return <h1>Sistema Anual</h1>;
            default:
                return <h1>Sistema de Períodos</h1>;
        }
    };

    return (
        <div className="container py-4">
            <div className="text-center text-success mb-4">{getTitleByPeriodType()}</div>
            <div className="row">
                {periods.length > 0 ? (
                    periods
                        .filter((period) => period?.periodo) // evitar que se rendericen periodos inválidos
                        .map((period) => (
                            <div key={period.academic_management_period_id} className="col-md-4 col-sm-6 mb-4">
                                <Card className={"card h-100"}>
                                    <div className="card-body text-center">
                                        <h4 className="card-title">
                                            Periodos Academicos<br />
                                            {period.periodo.level || '—'} <span className="text-muted">/</span> {period.year}
                                        </h4>
                                    </div>
                                    <div className="card-footer text-center">
                                        <p className="card-text">Cantidad de PSA: {period.evaluations?.length || 0}</p>
                                        <Link
                                            to={`${period.academic_management_period_id}/examns`}
                                            className="btn btn-primary btn-sm"
                                        >
                                            Ver Exámenes
                                        </Link>
                                    </div>
                                </Card>
                            </div>
                        ))
                ) : (
                    <div className="col-12">
                        <div className="alert alert-info text-center">
                            <p className="mb-0">No hay períodos asignados para esta carrera.</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
