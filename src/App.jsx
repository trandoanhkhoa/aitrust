import { Fragment, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import { publicRoutes, privateRoutes } from './routes';
import DefaultLayout from './components/DefaultLayout';
import PrivateRoute from './routes/Privateroutes';

function App() {
  return (
    <Router>
      <Routes>
        {/* PUBLIC ROUTES */}
        {publicRoutes.map((route, idx) => {
          const Page = route.component;
          const Layout = route.layout === null ? Fragment : route.layout || DefaultLayout;

          return (
            <Route
              key={idx}
              path={route.path}
              element={
                <Layout>
                  <Page />
                </Layout>
              }
            />
          );
        })}

        {/* PRIVATE ROUTES */}
        {privateRoutes.map((route, idx) => {
          const Page = route.component;
          const Layout = route.layout === null ? Fragment : route.layout || DefaultLayout;

          return (
            <Route
              key={idx}
              path={route.path}
              element={
                <PrivateRoute>
                  <Layout>
                    <Page />
                  </Layout>
                </PrivateRoute>
              }
            />
          );
        })}
      </Routes>
    </Router>
  );
}

export default App;
