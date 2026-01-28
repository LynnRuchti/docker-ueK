import { useFormik } from 'formik';
import { BlogPost } from '../../../types/models/BlogPost.model';
import {
  Box,
  Button,
  TextField,
  MenuItem,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { object, string } from 'yup';

/**
 * BlogPostFormProps - Props interface for BlogPostForm component
 */
interface BlogPostFormProps {
  onSubmit?: (values: BlogPost) => void;
  initialValues?: BlogPost;
}

/**
 * Validation rules for blog post form:
 * - Title: Required, minimum 5 characters
 * - Text: Required, minimum 20 characters
 * - Category: Required, must be selected from dropdown
 */
const defaultCategories = ['Technology', 'Lifestyle', 'Travel', 'Sports', 'Other'];

/**
 * BlogPostForm - Reusable form component for creating and editing blog posts
 * Handles form validation using Yup schema and submission via Formik.
 * Used by CreateBlogPostPage and EditBlogPostPage.
 */
const BlogPostForm = ({ onSubmit, initialValues }: BlogPostFormProps) => {
  const navigate = useNavigate();
  const isEditMode = !!initialValues;

  // Include initial category in dropdown if it's not in the default list (for old data)
  const categories = initialValues?.category && !defaultCategories.includes(initialValues.category)
    ? [...defaultCategories, initialValues.category]
    : defaultCategories;

  const formik = useFormik({
    initialValues: {
      title: initialValues?.title || '',
      text: initialValues?.text || '',
      category: initialValues?.category || '',
    },
    enableReinitialize: true,
    validationSchema: object({
      title: string()
        .required('Title is required')
        .min(5, 'Title must be at least 5 characters'),
      text: string()
        .required('Text is required')
        .min(20, 'Text must be at least 20 characters'),
      category: string().required('Category is required'),
    }),
    onSubmit: (values, { resetForm }) => {
      const blogPost: BlogPost = {
        title: values.title,
        text: values.text,
        category: values.category,
      };

      if (onSubmit) {
        onSubmit(blogPost);
      }

      // Only reset form in create mode
      if (!isEditMode) {
        resetForm();
      }
    },
  });

  return (
    <form onSubmit={formik.handleSubmit}>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <TextField
          id='title'
          name='title'
          label='Title'
          variant='outlined'
          fullWidth
          onBlur={formik.handleBlur}
          onChange={formik.handleChange}
          error={Boolean(formik.touched.title && formik.errors.title)}
          helperText={formik.touched.title && formik.errors.title}
          value={formik.values.title}
        />

        <TextField
          id='text'
          name='text'
          label='Text'
          variant='outlined'
          fullWidth
          multiline
          rows={6}
          onBlur={formik.handleBlur}
          onChange={formik.handleChange}
          error={Boolean(formik.touched.text && formik.errors.text)}
          helperText={formik.touched.text && formik.errors.text}
          value={formik.values.text}
        />

        <TextField
          id='category'
          name='category'
          label='Category'
          variant='outlined'
          fullWidth
          select
          onBlur={formik.handleBlur}
          onChange={formik.handleChange}
          error={Boolean(formik.touched.category && formik.errors.category)}
          helperText={formik.touched.category && formik.errors.category}
          value={formik.values.category}
        >
          {categories.map((cat) => (
            <MenuItem key={cat} value={cat}>
              {cat}
            </MenuItem>
          ))}
        </TextField>

        <Box sx={{ display: 'flex', gap: 2, marginTop: 2 }}>
          <Button
            variant='contained'
            color='primary'
            type='submit'
            disabled={!(formik.dirty && formik.isValid)}
          >
            {isEditMode ? 'Update' : 'Create'}
          </Button>
          <Button
            variant='outlined'
            color='secondary'
            onClick={() => navigate('/')}
          >
            Cancel
          </Button>
        </Box>
      </Box>
    </form>
  );
};

export default BlogPostForm;
