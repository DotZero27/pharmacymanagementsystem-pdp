import { API_URL } from '@/config';
import { AxiosWrapper } from '@/resources';

export const API = new AxiosWrapper(`${API_URL}/pms`)