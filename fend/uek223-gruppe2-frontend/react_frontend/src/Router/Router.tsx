import { Route, Routes } from 'react-router-dom';
import LoginPage from '../components/pages/LoginPage/LoginPage';
import PrivateRoute from './PrivateRoute';
import UserTable from '../components/pages/UserPage/UserTable';
import UserPage from '../components/pages/UserPage/UserPage';
import AdminPage from '../components/pages/AdminPage/AdminPage';
import CreateBlogPostPage from '../components/pages/BlogPostPage/CreateBlogPostPage';
import BlogPostListPage from '../components/pages/BlogPostPage/BlogPostListPage';
import BlogPostDetailPage from '../components/pages/BlogPostPage/BlogPostDetailPage';
import EditBlogPostPage from '../components/pages/BlogPostPage/EditBlogPostPage';
import authorities from '../config/Authorities';

/**
 * Router - Main routing component defining all application routes
 * 
 * Public routes: Homepage (/), Login (/login), Blog post detail (/blogpost/:id)
 * Protected routes: Create blog post, Edit blog post, User management
 * 
 * Use Cases:
 * - UC1: Create blog post (/blogpost/create)
 * - UC2 + UC5.1: Edit blog post (/blogpost/edit/:id)
 * - UC4: View blog posts (/ and /blogpost/:id)
 */
const Router = () => {
  return (
    <Routes>
      {/* UC4: Blog post list is now the homepage - public access */}
      <Route path={'/'} element={<BlogPostListPage />} />
      <Route path={'/login'} element={<LoginPage />} />

      {/* Admin Page - only accessible for admins */}
      <Route
        path='/admin'
        element={
          <PrivateRoute requiredAuths={[authorities.USER_READ]} element={<AdminPage />} />
        }
      />

      <Route
        path={'/user'}
        element={<PrivateRoute requiredAuths={[authorities.USER_READ]} element={<UserTable />} />}
      />
      <Route
        path='/user/edit'
        element={
          <PrivateRoute
            requiredAuths={[authorities.USER_CREATE]}
            element={<UserPage />}
          ></PrivateRoute>
        }
      />
      {/* User can edit own profile, admin can edit any profile - check done inside component */}
      <Route
        path='/user/edit/:userId'
        element={
          <PrivateRoute
            requiredAuths={[authorities.USER_CREATE]}
            element={<UserPage />}
          ></PrivateRoute>
        }
      />

      <Route
        path='/blogpost/create'
        element={
          <PrivateRoute requiredAuths={[authorities.BLOGPOST_CREATE]} element={<CreateBlogPostPage />} />
        }
      />

      <Route
        path='/blogpost/:id'
        element={<BlogPostDetailPage />}
      />

      {/* UC2 + UC5.1: Edit route - requires BLOGPOST_MODIFY authority */}
      <Route
        path='/blogpost/edit/:id'
        element={
          <PrivateRoute requiredAuths={[authorities.BLOGPOST_MODIFY]} element={<EditBlogPostPage />} />
        }
      />

      <Route path='/unauthorized' element={
        <div style={{ padding: '40px', textAlign: 'center' }}>
          <h1>Access Denied</h1>
          <p>You do not have permission to access this page.</p>
          <a href="/">Back to Home</a>
        </div>
      } />

      <Route path='*' element={<div>Not Found</div>} />
    </Routes>
  );
};

export default Router;
