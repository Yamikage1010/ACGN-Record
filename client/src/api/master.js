import { post } from './http'

export const getAcgnFileData = p => post('/acgnrecord/getAcgnFileData', p)
export const changeAcgnFileStatus = p => post('/acgnrecord/changeAcgnFileStatus', p)
export const getAcgnUserData = p => post('/acgnrecord/getAcgnUserData', p)
export const changeAcgnUserStatus = p => post('/acgnrecord/changeAcgnUserStatus', p)
export const getAcgnContentData = p => post('/acgnrecord/getAcgnContentData', p)
export const changeAcgnContentStatus = p => post('/acgnrecord/changeAcgnContentStatus', p)
