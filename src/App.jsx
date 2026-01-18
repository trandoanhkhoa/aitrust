import { Fragment, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// import { publicRoutes } from './routes';
import { publicRoutes, privateRoutes } from './routes';
import DefaultLayout from './components/DefaultLayout';
import PrivateRoute from './routes/Privateroutes';
function App() {
  return (
    <Router>
      <Routes>
        {/* PUBLIC ROUTES (không cần login) */}
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

        {/* PRIVATE ROUTES (phải login) */}
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
