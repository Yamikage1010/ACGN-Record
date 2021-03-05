import { get, post, getImg } from './http';

export const getSakura = p => post('/acgnrecord/getSakura', p);
