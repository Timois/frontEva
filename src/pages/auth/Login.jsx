/* eslint-disable no-unused-vars */
import React from 'react'
import { Card } from '../../components/login/Card'
import { Logo } from '../../components/login/Logo'
import FormLogin from '../../components/forms/FormLogin'

export const Login = () => {
    return (
        <div className="w-100 h-100 d-flex justify-content-center align-items-center">
            <div style={{maxWidth: "360px"}}>
                <Card className={" card align-items-center h-auto gap-3 p-3"}>
                    <Logo />
                    <FormLogin />
                </Card>
            </div>

        </div>
    )
}
