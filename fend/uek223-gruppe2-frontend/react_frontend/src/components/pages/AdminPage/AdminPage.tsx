import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import { useEffect, useState } from 'react';
import { User } from '../../../types/models/User.model';
import UserService from '../../../Services/UserService';
import { useNavigate } from 'react-router-dom';

/**
 * AdminPage - Admin-only page for user management
 * Displays all users and allows admins to edit or delete them.
 */
const AdminPage = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState<User[]>([]);

  const fetchUsers = () => {
    UserService.getAllUsers().then((data) => {
      setUsers(data.data);
    }).catch(() => {});
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleAdd = () => {
    navigate('/user/edit/');
  };

  const handleEdit = (id: string) => {
    navigate('/user/edit/' + id);
  };

  const handleDelete = async (id: string) => {
    const confirmed = window.confirm('Do you really want to delete this user?');
    if (confirmed) {
      try {
        await UserService.deleteUser(id);
        alert('User deleted successfully!');
        fetchUsers();
      } catch (error: any) {
        const status = error.response?.status;
        const message = error.response?.data?.message || error.message;
        if (status === 403) {
          alert('Access denied: You do not have permission to delete users (USER_DEACTIVATE required)');
        } else if (status === 401) {
          alert('Not authenticated. Please log in again.');
        } else {
          alert(`Failed to delete user: ${message}`);
        }
      }
    }
  };

  return (
    <>
      <h2>Admin - User Management</h2>
      {users.map((user) => (
        <div key={user.id}>
          <Card sx={{ minWidth: 275, marginBottom: 1 }}>
            <CardContent>
              {user.firstName} {user.lastName} - {user.email}
              <CardActions>
                <Button
                  size='small'
                  color='primary'
                  variant='contained'
                  onClick={() => handleEdit(user.id)}
                >
                  Edit
                </Button>
                <Button
                  size='small'
                  color='error'
                  variant='contained'
                  onClick={() => handleDelete(user.id)}
                >
                  Delete
                </Button>
              </CardActions>
            </CardContent>
          </Card>
        </div>
      ))}
      <Button
        size='small'
        color='success'
        variant='contained'
        onClick={handleAdd}
      >
        Add User
      </Button>
      <Button
        size='small'
        variant='outlined'
        onClick={() => navigate('/')}
        sx={{ marginLeft: 1 }}
      >
        Back to Home
      </Button>
    </>
  );
};

export default AdminPage;
