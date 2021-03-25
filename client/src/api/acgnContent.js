import { post } from './http'

export const addAcgnContent = p => post('/acgnrecord/addAcgnContent', p)
