import StaffDashboard from '@/pages/StaffDashboard';
import StaffLayout from '@/components/Layouts/StaffLayout';
import StaffProfile from '@/pages/StaffProfile';
import AdminLayout from '@/layouts/AdminLayout/AdminLayout';
import Dashboard from '@/components/AdminComponents/Dashboard/Dashboard';
import Books from '@/components/AdminComponents/Books/Books';
import Users from '@/components/AdminComponents/Users/Users';
import User from '@/components/AdminComponents/User/User';
import Book from '@/components/AdminComponents/Book/Book';
import CustomerLayout from '@/layouts/CustomerLayout/CustomerLayout';
import HomePage from '@/components/HomePage/HomePage';
import Auth from '@/components/Auth/Auth';
import ErrorPage from '@/components/ErrorPage/ErrorPage';

const routes = [
  {
    layout: CustomerLayout,
    data: [
      {
        path: '/',
        component: HomePage,
        title: 'Home Page',
      },
      {
        path: 'login',
        component: Auth,
        title: 'Login',
      },
    ],
  },
  {
    layout: AdminLayout,
    data: [
      {
        path: 'admin/dashboard',
        component: Dashboard,
        title: 'Admin Dashboard',
      },
      {
        path: 'admin/users',
        component: Users,
        title: 'Users',
      },
      {
        path: 'admin/users/:id',
        component: User,
        title: 'User Details',
      },
      {
        path: 'admin/books',
        component: Books,
        title: 'Books',
      },
      {
        path: 'admin/books/:id',
        component: Book,
        title: 'Book Details',
      },
    ],
  },
  {
    layout: StaffLayout,
    data: [
      {
        path: 'staff/dashboard',
        component: StaffDashboard,
        title: 'Staff Dashboard',
      },
      {
        path: 'staff/profile',
        component: StaffProfile,
        title: 'Staff Profile',
      },
    ],
  },
];

export default routes;
