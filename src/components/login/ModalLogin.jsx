/* eslint-disable no-unused-vars */
import React from 'react'
import FormLogin from '../forms/FormLogin'
import { Card } from './Card'
import { Logo } from './Logo'

export const ModalLogin = () => {
    return (
        <>
            <button
                type="button"
                className="btn btn-primary"
                data-bs-toggle="modal"
                data-bs-target="#exampleModal"
            >
                Login
            </button>

            {/* Modal */}
            <div
                className="modal fade"
                id="exampleModal"
                tabIndex="-1"
                aria-labelledby="exampleModalLabel"
                aria-hidden="true"
            >
                <div className="modal-dialog">
                    <div className="modal-content">
                        <Card className={"card align-items-center h-auto gap-3 p-3"}>
                            <Logo />
                            <FormLogin />
                        </Card>
                    </div>
                </div>
            </div>
        </>
    )
}
