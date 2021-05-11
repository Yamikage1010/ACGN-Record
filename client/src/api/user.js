import { post } from './http'

export const login = p => post('/acgnrecord/login', p)
export const register = p => post('/acgnrecord/register', p)
export const sendEmail = p => post('/acgnrecord/sendEmail', p)
export const sendEmail2 = p => post('/acgnrecord/sendEmail2', p)
export const modifyPassword = p => post('/acgnrecord/modifyPassword', p)
export const forgetPassword = p => post('/acgnrecord/forgetPassword', p)
export const token = p => post('/acgnrecord/token', p)
