import { post } from './http'

export const saveAcgnConfig = p => post('/acgnrecord/saveAcgnConfig', p)
