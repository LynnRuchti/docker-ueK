import { useNavigate, useParams } from 'react-router-dom';
import { User } from '../../../types/models/User.model';
import { Role } from '../../../types/models/Role.model';
import UserService, { UserRegisterData } from '../../../Services/UserService';
import RoleService from '../../../Services/RoleService';
import UserForm from '../../molecules/UserForm/UserForm';
import { useEffect, useState } from 'react';
import AuthorityService from '../../../Services/AuthorityService';
import authorities from '../../../config/Authorities';
import { CircularProgress, Container } from '@mui/material';

const UserPage = () => {
  const navigate = useNavigate();
  const { userId } = useParams();
  const [user, setUser] = useState<User>({
    id: '',
    firstName: '',
    lastName: '',
    email: '',
    roles: [],
  });
  const [availableRoles, setAvailableRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);

  const isAdmin = AuthorityService.hasAuthority(authorities.USER_MODIFY);

  useEffect(() => {
    const loadData = async () => {
      try {
        if (isAdmin) {
          const roles = await RoleService.getAllRoles();
          setAvailableRoles(roles);
        }

        if (userId) {
          const userData = await UserService.getUser(userId);
          setUser(userData);
        }
      } catch (error) {
        alert('Error loading data');
        navigate('/admin');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [userId, navigate, isAdmin]);

  const submitActionHandler = (values: any) => {
    if (userId !== undefined) {
      UserService.updateUser(values)
        .then(() => {
          alert('User updated successfully!');
          navigate(isAdmin ? '/admin' : '/');
        })
        .catch((error: any) => {
          const message = error.response?.data?.message || error.response?.data?.errors || error.message;
          alert(`Error updating user: ${JSON.stringify(message)}`);
        });
    } else {
      const registerData: UserRegisterData = {
        firstName: values.firstName,
        lastName: values.lastName,
        email: values.email,
        password: values.password,
        roleIds: values.roleIds,
      };
      
      UserService.addUser(registerData)
        .then(() => {
          alert('User created successfully!');
          navigate('/admin');
        })
        .catch((error: any) => {
          const message = error.response?.data?.message || error.response?.data?.errors || error.message;
          alert(`Error creating user: ${JSON.stringify(message)}`);
        });
    }
  };

  if (loading) {
    return (
      <Container sx={{ display: 'flex', justifyContent: 'center', paddingTop: 4 }}>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <UserForm 
      user={user} 
      submitActionHandler={submitActionHandler} 
      isAdminMode={isAdmin}
      availableRoles={availableRoles}
    />
  );
};

export default UserPage;
