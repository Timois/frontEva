import { removeGroup, removePermissionsStudent, removeStudent, removeTokenStudent } from "./storageStudent"
import { removePermissions, removeRolesPermissions, removeToken, removeUser } from "./storageUser"

export const clearStorage = () => {
    removeToken()
    removeUser()
    removePermissions()
    removeRolesPermissions()
}

export const clearStorageStudent = () => {
    removeGroup()
    removeTokenStudent()
    removeStudent()
    removePermissionsStudent()
}
