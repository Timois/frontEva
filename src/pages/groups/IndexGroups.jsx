import ButtonAdd from "./ButtonAdd"
import { Groups } from "./Groups"

export const IndexGroups = () => {
    return (
        <div className='m-3 p-3'>
            <div className="d-flex justify-content-center">
                <ButtonAdd />
            </div>
            <div className='w-100'>
                <Groups />
            </div>
        </div>
    )
}
