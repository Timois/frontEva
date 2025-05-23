/* eslint-disable react/prop-types */

/* eslint-disable no-unused-vars */
import React, { useContext, useEffect, useState } from 'react'
import { Card } from '../../../components/login/Card'
import { PeriodAssignContext } from '../../../context/PeriodAssignProvider'
import { PeriodContext } from '../../../context/PeriodProvider'
import { useFetchPeriodAssign } from '../../../hooks/fetchPeriod'
import { AsignPeriod } from '../../../components/forms/AsignPeriod'
export const ModalAsign = ({ id }) => {
  const { academic_mangement_careers} = useContext(PeriodAssignContext)
  const {periods} = useContext(PeriodContext)
  const [data, setData] = useState([])
  const { getData } = useFetchPeriodAssign()
  
  useEffect(() => {
    if (periods.length === 0)
      return
    const transformedPeriods = periods.map((periodo) => ({
      value: periodo.id,
      text: periodo.period,
    }))
    
    setData((prevData) => ({
      ...prevData,
      periods: transformedPeriods,
    }))
  }, [])
  
  useEffect(() => {

    const transformedAcademicManagementCareers = academic_mangement_careers.map((academic_management_career) => ({
      value: academic_management_career.id,
      text: academic_management_career.id
    }))
  }, [])

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
          <Card className="card align-items-center h-auto gap-3 p-3">
            {data.careers && data.academic_managements && <AsignPeriod data={data} />}
          </Card>
        </div>
      </div>
    </div>
  )
}
