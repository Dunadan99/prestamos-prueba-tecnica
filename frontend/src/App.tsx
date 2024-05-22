import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import IndexCreate from './views/IndexCreate';
import IndexLogin from './views/IndexLogin';
import IndexSolicitudList from './views/IndexSolicitudList';
import IndexSolicitudView from './views/IndexSolicitudView';
import IndexSite from './views/IndexSite';

const router = createBrowserRouter([
  {
    path: '/',
    element: <IndexSite />,
    children: [
      { path: '/', element: <IndexCreate /> },
      { path: '/login', element: <IndexLogin /> },
      { path: '/solicitudes', element: <IndexSolicitudList /> },
      { path: '/solicitudes/:idSol', element: <IndexSolicitudView /> },
    ],
  },
]);

function App() {
  return (<RouterProvider router={router} />);
}

export default App;
