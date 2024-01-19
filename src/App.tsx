import React from 'react';

import ChartPage from './pages/ChartPage';
import { Link, Outlet, RouterProvider, createHashRouter } from 'react-router-dom';
import SimpleChart from './components/SimpleChart';
import { Button } from '@mui/material';

const Layout: React.FC = (props) => {
  return (
    <div>
      <Button component={Link} to="/">
        React
      </Button>
      <Button component={Link} to="/jsonly">
        JS only
      </Button>
      <Outlet />
    </div>
  );
};
const router = createHashRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        path: '/',
        element: <ChartPage />,
      },
      {
        path: '/jsonly',
        element: <SimpleChart />,
      },
    ],
  },
]);

const App: React.FC = (props) => {
  return (
    <div>
      <RouterProvider router={router}></RouterProvider>
    </div>
  );
};

export default App;
