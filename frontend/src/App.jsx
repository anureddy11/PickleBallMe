
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
import EventsPage from '../Pages/EventsPage';
import EventDetailsPage from '../Pages/EventDetailsPage';
import CreateNewGroupForm from '../Pages/CreateNewGroupForm';
import CreateNewEventForm from '../Pages/CreateNewEventForm';
import UpdateGroupForm from '../Pages/UpdateGroupForm';

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
        path: '/groups/createGroup',
        element: <CreateNewGroupForm />
      },
      {
        path: '/groups/:groupId/update',
        element: <UpdateGroupForm />
      },
      {
        path: '/events',
        element: <EventsPage />
      },
      {
        path: '/events/:eventId',
        element: <EventDetailsPage />
      },
      {
        path: '/events/createEvent',
        element: <CreateNewEventForm />
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
