import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import { useEffect, useState } from 'react';
import { User } from '../../../types/models/User.model';
import UserService from '../../../Services/UserService';
import { useNavigate } from 'react-router-dom';

/**
 * UserTable - Page component displaying all users in a list view
 * Allows adding, editing, and deleting users (admin functionality).
 */
const UserTable = () => {
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
    navigate('../user/edit/');
  };

  const handleEdit = (id: string) => {
    navigate('../user/edit/' + id);
  };

  const handleDelete = async (id: string) => {
    try {
      await UserService.deleteUser(id);
      fetchUsers();
    } catch {
      alert("Failed to delete user");
    }
  };

  return (
    <>
      {users.map((user) => (
        <div key={user.id}>
          <Card sx={{ minWidth: 275 }}>
            <CardContent>
              {user.firstName} {user.lastName} {user.email}
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
        Add
      </Button>
    </>
  );
};

export default UserTable;
