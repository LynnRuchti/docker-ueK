import { useContext, useEffect, useState } from 'react';
import {
    Box,
    Button,
    Typography,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Pagination,
    SelectChangeEvent,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import BlogPostService, { BlogPostQueryParams } from '../../../Services/BlogPostService';
import { BlogPost } from '../../../types/models/BlogPost.model';
import AuthorityService from '../../../Services/AuthorityService';
import authorities from '../../../config/Authorities';
import ActiveUserContext from '../../../Contexts/ActiveUserContext';
import PersonIcon from '@mui/icons-material/Person';
import LoginIcon from '@mui/icons-material/Login';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';

/**
 * BlogPostListPage - Main page component displaying all blog posts (UC4)
 * Features pagination, sorting, and filtering functionality.
 * Supports edit/delete actions for post authors and admins with corresponding permissions.
 */
const BlogPostListPage = () => {
    const navigate = useNavigate();
    const { user } = useContext(ActiveUserContext);
    const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string>('');

    // Pagination state
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [totalElements, setTotalElements] = useState(0);

    // Sorting state
    const [sortBy, setSortBy] = useState<'date' | 'title' | 'category'>('date');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

    // Filtering state
    const [selectedCategory, setSelectedCategory] = useState<string>('');
    const [selectedAuthorId, setSelectedAuthorId] = useState<string>('');
    const [availableCategories, setAvailableCategories] = useState<string[]>([]);
    const [availableAuthors, setAvailableAuthors] = useState<{ id: string; name: string }[]>([]);

    useEffect(() => {
        loadBlogPosts();
    }, [currentPage, sortBy, sortOrder, selectedCategory, selectedAuthorId]);

    const loadBlogPosts = async () => {
        try {
            setLoading(true);
            const params: BlogPostQueryParams = {
                page: currentPage,
                size: 5,
                sortBy,
                sortOrder,
            };

            if (selectedCategory) params.category = selectedCategory;
            if (selectedAuthorId) params.authorId = selectedAuthorId;

            const response = await BlogPostService.getAllBlogPosts(params);

            setBlogPosts(response.data.content);
            setTotalPages(response.data.totalPages);
            setTotalElements(response.data.totalElements);

            // Extract unique categories and authors for filter dropdowns
            const categories = new Set<string>();
            const authors = new Map<string, string>();

            response.data.content.forEach((post) => {
                if (post.category) categories.add(post.category);
                if (post.author?.id && post.author?.firstName && post.author?.lastName) {
                    authors.set(post.author.id, `${post.author.firstName} ${post.author.lastName}`);
                }
            });

            setAvailableCategories(Array.from(categories).sort());
            setAvailableAuthors(
                Array.from(authors.entries()).map(([id, name]) => ({ id, name }))
            );

            setError('');
        } catch (err: any) {
            setError(err.response?.data?.message || 'Error loading blog posts');
        } finally {
            setLoading(false);
        }
    };

    const handleSortChange = (event: SelectChangeEvent) => {
        const value = event.target.value;
        const [newSortBy, newSortOrder] = value.split('-') as ['date' | 'title' | 'category', 'asc' | 'desc'];
        setSortBy(newSortBy);
        setSortOrder(newSortOrder);
        setCurrentPage(0);
    };

    const handleCategoryChange = (event: SelectChangeEvent) => {
        setSelectedCategory(event.target.value);
        setCurrentPage(0);
    };

    const handleAuthorChange = (event: SelectChangeEvent) => {
        setSelectedAuthorId(event.target.value);
        setCurrentPage(0);
    };

    const handlePageChange = (_event: React.ChangeEvent<unknown>, value: number) => {
        setCurrentPage(value - 1);
    };

    const clearFilters = () => {
        setSelectedCategory('');
        setSelectedAuthorId('');
        setCurrentPage(0);
    };

    const handleDelete = (postId: string) => {
        const confirmed = window.confirm('Do you really want to delete this blog post?');

        if (confirmed) {
            BlogPostService.deleteBlogPost(postId)
                .then(() => {
                    alert('Blog post deleted successfully!');
                    loadBlogPosts();
                })
                .catch(() => {
                    alert('Error deleting blog post!');
                });
        }
    };

    const canCreateBlogPost = AuthorityService.hasAuthority(authorities.BLOGPOST_CREATE);
    const isAdmin = AuthorityService.hasAuthority(authorities.USER_READ);

    return (
        <Box
            sx={{
                minHeight: '100vh',
                background: 'linear-gradient(135deg, #0f0fcf, #00d4ff)',
                color: '#fff',
                position: 'relative',
            }}
        >
            {/* Top Navigation Bar */}
            <Box
                sx={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '16px 24px',
                    zIndex: 1000,
                }}
            >
                {/* Left: My Profile and Admin */}
                <Box sx={{ display: 'flex', gap: 1 }}>
                    {user && (
                        <Button
                            variant="text"
                            startIcon={<PersonIcon />}
                            onClick={() => navigate(`/user/edit/${user.id}`)}
                            sx={{
                                color: '#fff',
                                textTransform: 'none',
                                fontSize: '1rem',
                                '&:hover': {
                                    backgroundColor: 'rgba(255,255,255,0.1)',
                                },
                            }}
                        >
                            My Profile
                        </Button>
                    )}
                    {user && isAdmin && (
                        <Button
                            variant="text"
                            startIcon={<AdminPanelSettingsIcon />}
                            onClick={() => navigate('/admin')}
                            sx={{
                                color: '#fff',
                                textTransform: 'none',
                                fontSize: '1rem',
                                '&:hover': {
                                    backgroundColor: 'rgba(255,255,255,0.1)',
                                },
                            }}
                        >
                            Admin
                        </Button>
                    )}
                </Box>

                {/* Right: Login button or Welcome message */}
                <Box>
                    {!user ? (
                        <Button
                            variant="text"
                            endIcon={<LoginIcon />}
                            onClick={() => navigate('/login')}
                            sx={{
                                color: '#fff',
                                textTransform: 'none',
                                fontSize: '1rem',
                                '&:hover': {
                                    backgroundColor: 'rgba(255,255,255,0.1)',
                                },
                            }}
                        >
                            Login
                        </Button>
                    ) : (
                        <Typography sx={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.9rem' }}>
                            Welcome, {user.firstName}!
                        </Typography>
                    )}
                </Box>
            </Box>

            {/* Main Content */}
            <Box
                sx={{
                    paddingTop: '80px',
                    paddingX: '24px',
                    paddingBottom: '40px',
                }}
            >
                {/* Header */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', maxWidth: '800px', margin: '0 auto', marginBottom: '40px' }}>
                    <Typography
                        variant="h3"
                        sx={{
                            fontWeight: 'bold',
                            textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
                        }}
                    >
                        Blog Posts
                    </Typography>
                    {canCreateBlogPost && (
                        <Button
                            variant="outlined"
                            onClick={() => navigate('/blogpost/create')}
                            sx={{
                                color: '#fff',
                                borderColor: '#fff',
                                '&:hover': {
                                    borderColor: '#fff',
                                    backgroundColor: 'rgba(255,255,255,0.1)',
                                },
                            }}
                        >
                            Create New Post
                        </Button>
                    )}
                </Box>

                {/* Error Message */}
                {error && (
                    <Box sx={{ maxWidth: '800px', margin: '0 auto 20px' }}>
                        <Typography sx={{ color: '#ff6b6b', backgroundColor: 'rgba(255,107,107,0.2)', padding: '12px', borderRadius: '4px' }}>
                            {error}
                        </Typography>
                    </Box>
                )}

                {/* Sorting and Filtering Controls */}
                <Box sx={{
                    mb: 3,
                    display: 'flex',
                    gap: 2,
                    flexWrap: 'wrap',
                    alignItems: 'center',
                    maxWidth: '800px',
                    margin: '0 auto 30px',
                }}>
                    <FormControl sx={{ minWidth: 200 }}>
                        <InputLabel
                            id="sort-select-label"
                            sx={{
                                color: 'rgba(255,255,255,0.7)',
                                '&.Mui-focused': { color: '#fff' }
                            }}
                        >
                            Sort by
                        </InputLabel>
                        <Select
                            labelId="sort-select-label"
                            id="sort-select"
                            value={`${sortBy}-${sortOrder}`}
                            label="Sort by"
                            onChange={handleSortChange}
                            sx={{
                                color: '#fff',
                                '.MuiOutlinedInput-notchedOutline': {
                                    borderColor: 'rgba(255,255,255,0.5)',
                                },
                                '&:hover .MuiOutlinedInput-notchedOutline': {
                                    borderColor: 'rgba(255,255,255,0.8)',
                                },
                                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                    borderColor: '#fff',
                                },
                                '.MuiSvgIcon-root': {
                                    color: '#fff',
                                },
                            }}
                        >
                            <MenuItem value="date-desc">Date (Newest first)</MenuItem>
                            <MenuItem value="date-asc">Date (Oldest first)</MenuItem>
                            <MenuItem value="title-asc">Title (A-Z)</MenuItem>
                            <MenuItem value="title-desc">Title (Z-A)</MenuItem>
                            <MenuItem value="category-asc">Category (A-Z)</MenuItem>
                            <MenuItem value="category-desc">Category (Z-A)</MenuItem>
                        </Select>
                    </FormControl>

                    <FormControl sx={{ minWidth: 200 }}>
                        <InputLabel
                            id="category-filter-label"
                            sx={{
                                color: 'rgba(255,255,255,0.7)',
                                '&.Mui-focused': { color: '#fff' }
                            }}
                        >
                            Filter by Category
                        </InputLabel>
                        <Select
                            labelId="category-filter-label"
                            id="category-filter"
                            value={selectedCategory}
                            label="Filter by Category"
                            onChange={handleCategoryChange}
                            sx={{
                                color: '#fff',
                                '.MuiOutlinedInput-notchedOutline': {
                                    borderColor: 'rgba(255,255,255,0.5)',
                                },
                                '&:hover .MuiOutlinedInput-notchedOutline': {
                                    borderColor: 'rgba(255,255,255,0.8)',
                                },
                                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                    borderColor: '#fff',
                                },
                                '.MuiSvgIcon-root': {
                                    color: '#fff',
                                },
                            }}
                        >
                            <MenuItem value="">All Categories</MenuItem>
                            {availableCategories.map((category) => (
                                <MenuItem key={category} value={category}>
                                    {category}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    <FormControl sx={{ minWidth: 200 }}>
                        <InputLabel
                            id="author-filter-label"
                            sx={{
                                color: 'rgba(255,255,255,0.7)',
                                '&.Mui-focused': { color: '#fff' }
                            }}
                        >
                            Filter by Author
                        </InputLabel>
                        <Select
                            labelId="author-filter-label"
                            id="author-filter"
                            value={selectedAuthorId}
                            label="Filter by Author"
                            onChange={handleAuthorChange}
                            sx={{
                                color: '#fff',
                                '.MuiOutlinedInput-notchedOutline': {
                                    borderColor: 'rgba(255,255,255,0.5)',
                                },
                                '&:hover .MuiOutlinedInput-notchedOutline': {
                                    borderColor: 'rgba(255,255,255,0.8)',
                                },
                                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                    borderColor: '#fff',
                                },
                                '.MuiSvgIcon-root': {
                                    color: '#fff',
                                },
                            }}
                        >
                            <MenuItem value="">All Authors</MenuItem>
                            {availableAuthors.map((author) => (
                                <MenuItem key={author.id} value={author.id}>
                                    {author.name}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    {(selectedCategory || selectedAuthorId) && (
                        <Button
                            variant="outlined"
                            onClick={clearFilters}
                            sx={{
                                color: '#fff',
                                borderColor: 'rgba(255,255,255,0.5)',
                                '&:hover': {
                                    borderColor: '#fff',
                                    backgroundColor: 'rgba(255,255,255,0.1)',
                                },
                            }}
                        >
                            Reset Filters
                        </Button>
                    )}
                </Box>

                {/* Results Info */}
                <Typography
                    sx={{
                        textAlign: 'center',
                        fontSize: '0.9rem',
                        color: 'rgba(255,255,255,0.7)',
                        mb: 3,
                        maxWidth: '800px',
                        margin: '0 auto 30px',
                    }}
                >
                    {totalElements > 0
                        ? `${totalElements} ${totalElements === 1 ? 'blog post' : 'blog posts'} found - Page ${currentPage + 1} of ${totalPages}`
                        : 'No blog posts found'}
                </Typography>

                {/* Blog Posts */}
                {loading ? (
                    <Typography sx={{ textAlign: 'center', fontSize: '1.2rem' }}>
                        Loading...
                    </Typography>
                ) : blogPosts.length === 0 ? (
                    <Typography sx={{ textAlign: 'center', fontSize: '1.2rem' }}>
                        No blog posts available.
                    </Typography>
                ) : (
                    <>
                        <Box
                            sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '32px',
                                maxWidth: '800px',
                                margin: '0 auto',
                            }}
                        >
                            {blogPosts.map((post) => (
                                <Box
                                    key={post.id}
                                    sx={{
                                        borderBottom: '1px solid rgba(255,255,255,0.3)',
                                        paddingBottom: '24px',
                                        cursor: 'pointer',
                                    }}
                                    onClick={() => navigate(`/blogpost/${post.id}`)}
                                >
                                    {/* Category */}
                                    <Typography
                                        sx={{
                                            fontSize: '0.85rem',
                                            textTransform: 'uppercase',
                                            letterSpacing: '2px',
                                            color: 'rgba(255,255,255,0.7)',
                                            marginBottom: '8px',
                                        }}
                                    >
                                        {post.category}
                                    </Typography>

                                    {/* Title */}
                                    <Typography
                                        variant="h5"
                                        sx={{
                                            fontWeight: 'bold',
                                            marginBottom: '12px',
                                            textShadow: '1px 1px 2px rgba(0,0,0,0.2)',
                                        }}
                                    >
                                        {post.title}
                                    </Typography>

                                    {/* Text Preview */}
                                    <Typography
                                        sx={{
                                            fontSize: '1rem',
                                            lineHeight: 1.7,
                                            color: 'rgba(255,255,255,0.9)',
                                            marginBottom: '16px',
                                        }}
                                    >
                                        {post.text?.substring(0, 200)}
                                        {post.text && post.text.length > 200 ? '...' : ''}
                                    </Typography>

                                    {/* Author & Date */}
                                    <Box
                                        sx={{
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'center',
                                            fontSize: '0.85rem',
                                            color: 'rgba(255,255,255,0.6)',
                                        }}
                                    >
                                        <Typography sx={{ fontSize: 'inherit' }}>
                                            by {post.author?.firstName} {post.author?.lastName}
                                        </Typography>
                                        <Typography sx={{ fontSize: 'inherit' }}>
                                            {post.createdAt ? new Date(post.createdAt).toLocaleDateString('en-US', {
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric',
                                            }) : ''}
                                        </Typography>
                                    </Box>

                                    {/* Edit & Delete Buttons */}
                                    {user && (post.author?.id === user.id || AuthorityService.hasAuthority(authorities.BLOGPOST_MODIFY) || AuthorityService.hasAuthority(authorities.BLOGPOST_DELETE)) && (
                                        <Box sx={{ display: 'flex', gap: 1, marginTop: '12px' }}>
                                            {/* Edit Button - own posts or admin */}
                                            {(post.author?.id === user.id || AuthorityService.hasAuthority(authorities.BLOGPOST_MODIFY)) && (
                                                <Button
                                                    variant="text"
                                                    startIcon={<EditIcon />}
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        navigate(`/blogpost/edit/${post.id}`);
                                                    }}
                                                    sx={{
                                                        color: '#4dabf5',
                                                        '&:hover': {
                                                            backgroundColor: 'rgba(77,171,245,0.1)',
                                                        },
                                                    }}
                                                >
                                                    Edit
                                                </Button>
                                            )}
                                            {/* Delete Button - own posts or admin with BLOGPOST_DELETE */}
                                            {(post.author?.id === user.id || AuthorityService.hasAuthority(authorities.BLOGPOST_DELETE)) && (
                                                <Button
                                                    variant="text"
                                                    startIcon={<DeleteIcon />}
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleDelete(post.id!);
                                                    }}
                                                    sx={{
                                                        color: '#ff6b6b',
                                                        '&:hover': {
                                                            backgroundColor: 'rgba(255,107,107,0.1)',
                                                        },
                                                    }}
                                                >
                                                    Delete
                                                </Button>
                                            )}
                                        </Box>
                                    )}
                                </Box>
                            ))}
                        </Box>

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 5 }}>
                                <Pagination
                                    count={totalPages}
                                    page={currentPage + 1}
                                    onChange={handlePageChange}
                                    sx={{
                                        '& .MuiPaginationItem-root': {
                                            color: '#fff',
                                            borderColor: 'rgba(255,255,255,0.5)',
                                        },
                                        '& .MuiPaginationItem-root.Mui-selected': {
                                            backgroundColor: 'rgba(255,255,255,0.2)',
                                            borderColor: '#fff',
                                        },
                                        '& .MuiPaginationItem-root:hover': {
                                            backgroundColor: 'rgba(255,255,255,0.1)',
                                        },
                                    }}
                                    showFirstButton
                                    showLastButton
                                />
                            </Box>
                        )}
                    </>
                )}
            </Box>
        </Box>
    );
};

export default BlogPostListPage;
