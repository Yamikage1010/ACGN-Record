import { post } from './http'

export const searchTomo = p => post('/acgnrecord/searchTomo', p)
export const addTomo = p => post('/acgnrecord/addTomo', p)
export const requestHandle = p => post('/acgnrecord/requestHandle', p)
export const getTomoList = p => post('/acgnrecord/getTomoList', p)
export const delectTomoList = p => post('/acgnrecord/delectTomoList', p)
export const getTomoRequestList = p => post('/acgnrecord/getTomoRequestList', p)
export const getTomoAcgnContentList = p => post('/acgnrecord/getTomoAcgnContentList', p)
export const getTomoAcgnCharacters = p => post('/acgnrecord/getTomoAcgnCharacters', p)
