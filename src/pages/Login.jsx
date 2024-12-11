/* eslint-disable no-unused-vars */
import React from 'react'
import FormLogin from '../components/forms/FormLogin'
import { Logo } from '../components/Login/Logo'
import { Card } from '../components/login/Card'

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
