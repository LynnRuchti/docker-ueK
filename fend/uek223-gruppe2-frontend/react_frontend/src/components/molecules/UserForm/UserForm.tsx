import { useFormik } from 'formik';
import { User } from '../../../types/models/User.model';
import { Role } from '../../../types/models/Role.model';
import { Box, Button, TextField, FormControl, InputLabel, Select, MenuItem, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { object, string } from 'yup';

interface UserFormProps {
  user: User;
  submitActionHandler: (values: any) => void;
  isAdminMode?: boolean;
  availableRoles?: Role[];
}

const UserForm = ({ user, submitActionHandler, isAdminMode = false, availableRoles = [] }: UserFormProps) => {
  const navigate = useNavigate();
  const isCreateMode = !user.id;

  const getInitialRoleId = (): string => {
    if (user.roles && user.roles.length > 0) {
      return user.roles[0].id;
    }
    const defaultRole = availableRoles.find(r => r.name === 'USER');
    return defaultRole?.id || (availableRoles[0]?.id ?? '');
  };

  const formik = useFormik({
    initialValues: {
      id: user.id,
      lastName: user.lastName || '',
      firstName: user.firstName || '',
      email: user.email || '',
      roles: user.roles || [],
      password: '',
      selectedRoleId: getInitialRoleId(),
    },
    validationSchema: object({
      firstName: string()
        .required('First name is required')
        .min(2, 'Must be at least 2 characters')
        .max(50, 'Must be 50 characters or less'),
      lastName: string()
        .required('Last name is required')
        .min(2, 'Must be at least 2 characters')
        .max(50, 'Must be 50 characters or less'),
      email: string()
        .required('Email is required')
        .email('Invalid email format'),
      password: isCreateMode 
        ? string()
            .required('Password is required')
            .min(4, 'Password must be at least 4 characters')
        : string(),
    }),
    onSubmit: (values) => {
      if (isCreateMode) {
        const newUserData = {
          firstName: values.firstName,
          lastName: values.lastName,
          email: values.email,
          password: values.password,
          roleIds: values.selectedRoleId ? [values.selectedRoleId] : [],
        };
        submitActionHandler(newUserData);
      } else {
        const selectedRole = availableRoles.find(r => r.id === values.selectedRoleId);
        const updatedRoles = isAdminMode && selectedRole
          ? [selectedRole]
          : values.roles;
        
        const userData = {
          id: values.id,
          firstName: values.firstName,
          lastName: values.lastName,
          email: values.email,
          roles: updatedRoles,
        };
        submitActionHandler(userData);
      }
    },
    enableReinitialize: true,
  });

  return (
    <Box sx={{ maxWidth: 400, padding: 2, margin: '0 auto' }}>
      <Typography variant="h5" sx={{ mb: 3 }}>
        {isCreateMode ? 'Create New User' : 'Edit User'}
      </Typography>
      
      <form onSubmit={formik.handleSubmit}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField
            id='firstName'
            name='firstName'
            label='First Name'
            variant='outlined'
            fullWidth
            onBlur={formik.handleBlur}
            onChange={formik.handleChange}
            error={Boolean(formik.touched.firstName && formik.errors.firstName)}
            helperText={formik.touched.firstName && formik.errors.firstName}
            value={formik.values.firstName}
          />

          <TextField
            id='lastName'
            name='lastName'
            label='Last Name'
            variant='outlined'
            fullWidth
            onBlur={formik.handleBlur}
            onChange={formik.handleChange}
            error={Boolean(formik.touched.lastName && formik.errors.lastName)}
            helperText={formik.touched.lastName && formik.errors.lastName}
            value={formik.values.lastName}
          />

          <TextField
            id='email'
            name='email'
            label='Email'
            type='email'
            variant='outlined'
            fullWidth
            onBlur={formik.handleBlur}
            onChange={formik.handleChange}
            error={Boolean(formik.touched.email && formik.errors.email)}
            helperText={formik.touched.email && formik.errors.email}
            value={formik.values.email}
          />

          {isCreateMode && (
            <TextField
              id='password'
              name='password'
              label='Password'
              type='password'
              variant='outlined'
              fullWidth
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              error={Boolean(formik.touched.password && formik.errors.password)}
              helperText={formik.touched.password && formik.errors.password}
              value={formik.values.password}
            />
          )}

          {isAdminMode && availableRoles.length > 0 && (
            <FormControl fullWidth>
              <InputLabel id="role-label">Role</InputLabel>
              <Select
                labelId="role-label"
                id="selectedRoleId"
                name="selectedRoleId"
                value={formik.values.selectedRoleId || ''}
                label="Role"
                onChange={formik.handleChange}
              >
                {availableRoles.map((role) => (
                  <MenuItem key={role.id} value={role.id}>
                    {role.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )}

          <Box sx={{ display: 'flex', gap: 2, marginTop: 2 }}>
            <Button
              variant='contained'
              color='primary'
              type='submit'
              disabled={!(formik.dirty && formik.isValid)}
              fullWidth
            >
              {isCreateMode ? 'Create User' : 'Save Changes'}
            </Button>
            <Button
              variant='outlined'
              color='inherit'
              onClick={() => navigate(-1)}
              fullWidth
            >
              Cancel
            </Button>
          </Box>
        </Box>
      </form>
    </Box>
  );
};

export default UserForm;
