import api from '../config/Api';
import { Role } from '../types/models/Role.model';

const RoleService = {
  getAllRoles: async (): Promise<Role[]> => {
    const { data } = await api.get<Role[]>('/roles');
    return data;
  },
};

export default RoleService;
