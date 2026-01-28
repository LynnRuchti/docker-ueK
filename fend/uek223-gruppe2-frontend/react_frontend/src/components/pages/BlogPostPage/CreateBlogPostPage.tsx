import { Box, Button, Container, Typography } from '@mui/material';
import BlogPostForm from '../../molecules/BlogPostForm/BlogPostForm';
import { BlogPost } from '../../../types/models/BlogPost.model';
import BlogPostService from '../../../Services/BlogPostService';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { Alert, Snackbar } from '@mui/material';

/**
 * CreateBlogPostPage - Page component for creating new blog posts (UC1)
 * Displays a form for entering blog post data and handles submission to the API.
 */
const CreateBlogPostPage = () => {
  const navigate = useNavigate();
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (blogPost: BlogPost) => {
    try {
      await BlogPostService.createBlogPost(blogPost);
      setSuccess(true);
      setTimeout(() => {
        navigate('/');
      }, 1500);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error creating blog post');
    }
  };

  return (
    <Container maxWidth='md'>
      <Box sx={{ paddingTop: 4, paddingBottom: 4 }}>
        <Typography variant='h4' component='h1' gutterBottom>
          Create New Blog Post
        </Typography>
        <BlogPostForm onSubmit={handleSubmit} />
        
        <Snackbar open={success} autoHideDuration={6000} onClose={() => setSuccess(false)}>
          <Alert onClose={() => setSuccess(false)} severity="success" sx={{ width: '100%' }}>
            Blog post created successfully!
          </Alert>
        </Snackbar>
        
        <Snackbar open={!!error} autoHideDuration={6000} onClose={() => setError('')}>
          <Alert onClose={() => setError('')} severity="error" sx={{ width: '100%' }}>
            {error}
          </Alert>
        </Snackbar>

        {error && (
          <Button variant="outlined" onClick={() => navigate('/')} sx={{ mt: 2 }}>
            Back to Home
          </Button>
        )}
      </Box>
    </Container>
  );
};

export default CreateBlogPostPage;

