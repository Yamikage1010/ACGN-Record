import { post } from './http';

export const getSakura = p => post('/acgnrecord/getSakura', p);
