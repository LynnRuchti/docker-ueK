import { useEffect, useState, useContext, useCallback } from 'react';
import {
    Button,
    Container,
    Typography,
    CircularProgress,
    Alert,
    Snackbar,
} from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import BlogPostForm from '../../molecules/BlogPostForm/BlogPostForm';
import BlogPostService from '../../../Services/BlogPostService';
import { BlogPost } from '../../../types/models/BlogPost.model';
import ActiveUserContext from '../../../Contexts/ActiveUserContext';
import AuthorityService from '../../../Services/AuthorityService';
import authorities from '../../../config/Authorities';

/**
 * EditBlogPostPage - Page component for editing existing blog posts (UC2, UC5.1)
 * Loads blog post data, validates user permissions, and handles form submission.
 * Accessible by post authors or users with BLOGPOST_MODIFY authority.
 */
const EditBlogPostPage = () => {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const { user } = useContext(ActiveUserContext);
    const [blogPost, setBlogPost] = useState<BlogPost | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string>('');
    const [success, setSuccess] = useState(false);

    const loadBlogPost = useCallback(async () => {
        if (!id) return;
        
        try {
            setLoading(true);
            const response = await BlogPostService.getBlogPostById(id);
            const post = response.data;

            // Check if current user is the author or admin
            const isAuthor = user && post.author?.id === user.id;
            const isAdmin = AuthorityService.hasAuthority(authorities.BLOGPOST_MODIFY);
            
            if (!isAuthor && !isAdmin) {
                setError('You do not have permission to edit this blog post.');
                setLoading(false);
                return;
            }

            setBlogPost(post);
            setError('');
        } catch (err: any) {
            setError(err.response?.data?.message || 'Error loading blog post');
        } finally {
            setLoading(false);
        }
    }, [id, user]);

    useEffect(() => {
        loadBlogPost();
    }, [loadBlogPost]);

    const handleSubmit = async (updatedBlogPost: BlogPost) => {
        try {
            await BlogPostService.updateBlogPost(id!, updatedBlogPost);
            setSuccess(true);
            setTimeout(() => {
                navigate('/');
            }, 1500);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Error updating blog post');
        }
    };

    if (loading) {
        return (
            <Container maxWidth="md" sx={{ paddingTop: 4, textAlign: 'center' }}>
                <CircularProgress />
            </Container>
        );
    }

    if (error || !blogPost) {
        return (
            <Container maxWidth="md" sx={{ paddingTop: 4 }}>
                <Alert severity="error">{error || 'Blog post not found'}</Alert>
                <Button variant="outlined" onClick={() => navigate('/')} sx={{ mt: 2 }}>
                    Back to Home
                </Button>
            </Container>
        );
    }

    return (
        <Container maxWidth="md" sx={{ paddingTop: 4, paddingBottom: 4 }}>
            <Typography variant="h4" component="h1" gutterBottom>
                Edit Blog Post
            </Typography>
            <BlogPostForm
                onSubmit={handleSubmit}
                initialValues={blogPost}
            />

            <Snackbar open={success} autoHideDuration={6000} onClose={() => setSuccess(false)}>
                <Alert onClose={() => setSuccess(false)} severity="success" sx={{ width: '100%' }}>
                    Blog post updated successfully!
                </Alert>
            </Snackbar>

            <Snackbar open={!!error} autoHideDuration={6000} onClose={() => setError('')}>
                <Alert onClose={() => setError('')} severity="error" sx={{ width: '100%' }}>
                    {error}
                </Alert>
            </Snackbar>
        </Container>
    );
};

export default EditBlogPostPage;
