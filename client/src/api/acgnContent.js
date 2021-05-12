import { post } from './http'

export const addAcgnContent = p => post('/acgnrecord/addAcgnContent', p)
export const editAcgnContent = p => post('/acgnrecord/editAcgnContent', p)
export const getAcgnContentList = p => post('/acgnrecord/getAcgnContentList', p)
export const getAcgnCharacters = p => post('/acgnrecord/getAcgnCharacters', p)
export const delectAcgnContent = p => post('/acgnrecord/delectAcgnContent', p)
