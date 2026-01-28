import {
  Paper,
  Grid,
  TextField,
  Button,
  Typography,
  Link,
  Box,
} from '@mui/material';
import {useContext, useEffect} from 'react';

import { Form, Formik } from 'formik';
import { useNavigate } from 'react-router-dom';
import * as Yup from 'yup';
import ActiveUserContext from '../../../Contexts/ActiveUserContext';

/**
 * Validation schema for login form
 * Email and password are required fields
 */
const validationSchema = Yup.object().shape({
  email: Yup.string().required('Email is required').email('Please enter a valid email'),
  password: Yup.string().required('Password is required'),
});

/**
 * Login - Page component for user authentication
 * Handles user login via email and password.
 * On successful login, redirects to the homepage.
 */
const Login = () => {
  const paperStyle = {
    padding: 20,
    width: 280,
  };
  const btnstyle = { margin: '8px 0' };
  const navigate = useNavigate();
  const { login, logout } = useContext(ActiveUserContext);

  useEffect(() => {
   logout()
  }, []);

  const handleSubmit = (values: { email: string; password: string }) => {
    login(values.email.toLowerCase(), values.password)
      .then(() => {
        navigate('/');
      })
      .catch((error) => {
        if (
          error.response &&
          (error.response.status === 401 || error.response.status === 403)
        ) {
          alert('Invalid email or password. Please try again.');
        } else {
          alert('Connection error. Please check your internet connection.');
        }
      });
  };
  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #0f0fcf, #00d4ff)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Paper elevation={10} style={paperStyle}>
        <Grid>
          <h2>Sign In</h2>
          <p>Default login:</p>
          <p>email: admin@example.com</p>
          <p>pw: 1234</p>
        </Grid>

        <Formik
          initialValues={{
            email: '',
            password: '',
          }}
          enableReinitialize
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
          validateOnChange
          isInitialValid
        >
          {(props) => (
            <Form onSubmit={props.handleSubmit}>
              <TextField
                label='email'
                id='email'
                placeholder='Enter username'
                fullWidth
                required
                autoFocus
                onChange={props.handleChange}
                onBlur={props.handleBlur}
                value={props.values.email}
              />
              {props.errors.email && (
                <div id='feedback'>{props.errors.email}</div>
              )}

              <TextField
                id='password'
                label='password'
                placeholder='Enter password'
                type='password'
                fullWidth
                required
                onChange={props.handleChange}
                onBlur={props.handleBlur}
                value={props.values.password}
              />
              {props.errors.password && (
                <div id='feedback'>{props.errors.password}</div>
              )}

              <Button
                type='submit'
                color='primary'
                variant='contained'
                style={btnstyle}
                fullWidth
              >
                Sign in
              </Button>
            </Form>
          )}
        </Formik>
        <Typography>
          <Link href='#'>Forgot password ?</Link>
        </Typography>
        <Typography>
          {' '}
          Do you have an account ?<Link href='#'>Sign Up</Link>
        </Typography>
      </Paper>
    </Box>
  );
};

export default Login;
