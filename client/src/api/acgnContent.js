import { post } from './http'

export const addAcgnContent = p => post('/acgnrecord/addAcgnContent', p)
export const getAcgnContentList = p => post('/acgnrecord/getAcgnContentList', p)
export const getAcgnCharacters = p => post('/acgnrecord/getAcgnCharacters', p)
