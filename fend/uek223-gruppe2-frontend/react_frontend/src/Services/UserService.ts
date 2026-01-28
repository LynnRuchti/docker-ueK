import api from '../config/Api';
import { User } from '../types/models/User.model';

export interface UserRegisterData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  roleIds?: string[];
}

const UserService = {
  getUser: async (userID: string): Promise<User> => {
    const { data } = await api.get<User>(`/user/${userID}`);
    return data;
  },

  updateUser: (user: User) => {
    return api.put(`/user/${user.id}`, user);
  },

  addUser: (userData: UserRegisterData) => {
    return api.post('/user/register', userData).then((res) => {
      return res.data;
    });
  },

  getAllUsers: () => {
    return api.get(`/user`);
  },

  deleteUser: (id: string) => {
    return api.delete(`/user/${id}`);
  },
};

export default UserService;
