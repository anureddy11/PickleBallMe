
import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { createBrowserRouter, RouterProvider, Outlet } from 'react-router-dom';
import Navigation from '../componenets/Navigation/Navigation';
import * as sessionActions from './store/session';
import SplashPage from '../Pages/SplashPage'
import Groups from '../Pages/GroupsPage';
import GroupsEventsLandingPage from '../componenets/Navigation/Groups-Events-LandingPage';
import GroupDetailPage from '../Pages/GroupDetailPage';
import EventsByGroupPage from '../Pages/EventsByGroupPage';

function Layout() {
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    dispatch(sessionActions.restoreUser()).then(() => {
      setIsLoaded(true)
    });
  }, [dispatch]);

  return (
    <div className="app-container">
    <Navigation isLoaded={isLoaded} />
    {isLoaded && <div className="content"><Outlet /></div>}
  </div>
  );
}

const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      {
        path: '/',
        element: <SplashPage />
      },
      {
        path:'/groups',
        element:<Groups />
      },
      {
        path: '/groups/:groupId',
        element: <GroupDetailPage />
      },
      {
        path: '/groups/:groupId/events',
        element: <EventsByGroupPage />
      },
      {
        path: '*',
        element: <h1>404 - Not Found</h1>
      },

    ]
  }
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
