import { useContext, useEffect } from 'react';
import { Card } from '../../../components/login/Card';
import { useFetchPeriod } from '../../../hooks/fetchPeriod';
import { PeriodContext } from '../../../context/PeriodProvider';
import { Link } from 'react-router-dom';

export const CareerPeriodsList = () => {
    const { getPeriodsByCareerId } = useFetchPeriod()
    const {periods} = useContext(PeriodContext)
    const user = JSON.parse(localStorage.getItem('user'));
    const career_id = user ? user.career_id : null;

    useEffect(() => {
        getPeriodsByCareerId(career_id)
    }, [career_id]);
    
    const getTitleByPeriodType = () => {
        if (periods && periods.length > 0) {
            return periods[0].period === 'semestre1' ? <h1>Sistema Semestral</h1> : <h1>Sistema Anual</h1>;
        }
        return <h1>Sistema de Períodos</h1>;
    };

    return (
        <div className="container py-4">
            <h5 className="text-center text-success mb-4">{getTitleByPeriodType()}</h5>
            <div className="row">
                {periods.length > 0 ? (
                    periods.map((period) => (
                        <div key={period.id} className="col-md-4 col-sm-6 mb-4">
                            <Card className={"card h-100"}>
                                <div className="card-body text-center">
                                    <h4 className="card-title">
                                        Periodo <br/>{period.level}<span className="text-muted">/</span>{period.gestion}
                                    </h4>
                                    <span className={`badge ${period.status === 'activo' ? 'bg-success' : 'bg-danger'}`}>
                                        {period.status}
                                    </span>
                                </div>
                                <div className="card-footer text-center">
                                    <p className="card-text">
                                        Cantidad de PSA {period.start_date}
                                    </p>
                                    <Link
                                        to={`${period.id}/examns`}
                                        className="btn btn-primary btn-sm"
                                    >
                                        Ver PSAS
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