import { post } from './http'

export const login = p => post('/acgnrecord/login', p)
export const register = p => post('/acgnrecord/register', p)
export const sendEmail = p => post('/acgnrecord/sendEmail', p)
export const token = p => post('/acgnrecord/token', p)
