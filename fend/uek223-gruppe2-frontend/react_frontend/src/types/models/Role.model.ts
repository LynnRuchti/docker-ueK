import { Authority } from './Authority.model';

export type Role = {
  id: string;
  name: string;
  authorities: Authority[];
};
