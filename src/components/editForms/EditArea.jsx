/* eslint-disable no-unused-vars */

import { useContext, useState } from "react"
import { AreaContext } from "../../context/AreaProvider"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { AreaSchema } from "../../models/schemas/AreaSchema"



export const EditArea = (data, closeModal) => {
    const { response, setResponse } = useState (false)
    const { updateArea } = useContext(AreaContext)

    const { control, handleSubmit, reset, setValue, 
        formState: { errors }, setError } = useForm({ resolver: zodResolver(AreaSchema) })
        
  return (
    <div>EditArea</div>
  )
}
