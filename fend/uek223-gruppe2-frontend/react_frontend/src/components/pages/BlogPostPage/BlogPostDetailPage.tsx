import { useEffect, useState, useContext } from 'react';
import {
    Box,
    Button,
    Card,
    CardContent,
    Container,
    Typography,
    CircularProgress,
    Alert,
    Chip,
    Divider,
    Snackbar,
} from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import BlogPostService from '../../../Services/BlogPostService';
import { BlogPost } from '../../../types/models/BlogPost.model';
import ActiveUserContext from '../../../Contexts/ActiveUserContext';
import AuthorityService from '../../../Services/AuthorityService';
import authorities from '../../../config/Authorities';

/**
 * BlogPostDetailPage - Page component for viewing a single blog post (UC4)
 * Displays full blog post details including title, author, date, category, and content.
 * Shows edit button for post authors or admins with BLOGPOST_MODIFY authority.
 */
const BlogPostDetailPage = () => {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const { user } = useContext(ActiveUserContext);
    const [blogPost, setBlogPost] = useState<BlogPost | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string>('');
    const [success, setSuccess] = useState<string>('');

    useEffect(() => {
        if (id) {
            loadBlogPost();
        }
    }, [id]);

    const loadBlogPost = async () => {
        try {
            setLoading(true);
            const response = await BlogPostService.getBlogPostById(id!);
            setBlogPost(response.data);
            setError('');
        } catch (err: any) {
            setError(err.response?.data?.message || 'Error loading blog post');
        } finally {
            setLoading(false);
        }
    };

    const canModify = blogPost && user && (
        blogPost.author?.id === user.id ||
        AuthorityService.hasAuthority(authorities.BLOGPOST_MODIFY)
    );

    const canDelete = blogPost && user && (
        blogPost.author?.id === user.id ||
        AuthorityService.hasAuthority(authorities.BLOGPOST_DELETE)
    );

    const handleDelete = () => {
        const confirmed = window.confirm('Do you really want to delete this blog post?');
        if (confirmed && id) {
            BlogPostService.deleteBlogPost(id)
                .then(() => {
                    setSuccess('Blog post deleted successfully!');
                    setTimeout(() => {
                        navigate('/');
                    }, 1500);
                })
                .catch((err: any) => {
                    setError(err.response?.data?.message || 'Error deleting blog post');
                });
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
                <Button sx={{ mt: 2 }} onClick={() => navigate('/')}>
                    Back to Overview
                </Button>
            </Container>
        );
    }

    return (
        <Container maxWidth="md" sx={{ paddingTop: 4, paddingBottom: 4 }}>
            <Card>
                <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                        <Typography variant="h4" component="h1">
                            {blogPost.title}
                        </Typography>
                        <Chip label={blogPost.category} color="primary" />
                    </Box>

                    {blogPost.author && (
                        <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                            By {blogPost.author.firstName} {blogPost.author.lastName}
                        </Typography>
                    )}

                    {blogPost.createdAt && (
                        <Typography variant="caption" color="text.secondary" display="block" gutterBottom>
                            Created on {new Date(blogPost.createdAt).toLocaleDateString('en-US')}
                        </Typography>
                    )}

                    <Divider sx={{ my: 2 }} />

                    <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap', mt: 2 }}>
                        {blogPost.text}
                    </Typography>

                    <Box sx={{ display: 'flex', gap: 2, mt: 4 }}>
                        <Button variant="outlined" onClick={() => navigate('/')}>
                            Back to Overview
                        </Button>
                        {canModify && (
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={() => navigate(`/blogpost/edit/${id}`)}
                            >
                                Edit
                            </Button>
                        )}
                        {canDelete && (
                            <Button
                                variant="contained"
                                color="error"
                                onClick={handleDelete}
                            >
                                Delete
                            </Button>
                        )}
                    </Box>
                </CardContent>
            </Card>

            <Snackbar open={!!success} autoHideDuration={6000} onClose={() => setSuccess('')}>
                <Alert onClose={() => setSuccess('')} severity="success" sx={{ width: '100%' }}>
                    {success}
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

export default BlogPostDetailPage;
