import {post} from './http'


export const login = p => post('/acgnrecord/login', p)
export const register = p => post('/acgnrecord/register', p)
