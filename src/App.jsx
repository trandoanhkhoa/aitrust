import { Fragment, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import { publicRoutes, privateRoutes } from './routes';
import DefaultLayout from './components/DefaultLayout';
import PrivateRoute from './routes/Privateroutes';

function App() {
  useEffect(() => {
    const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);

    if (!isSafari) return;

    window.onerror = function (msg, url, line, col) {
      document.body.innerHTML = `
        <pre style="white-space:pre-wrap;padding:16px;font-size:14px;color:red">
JS ERROR:
${msg}

Line: ${line}:${col}
URL: ${url}
        </pre>
      `;
    };

    window.onunhandledrejection = function (e) {
      document.body.innerHTML = `
        <pre style="white-space:pre-wrap;padding:16px;font-size:14px;color:red">
PROMISE ERROR:
${String(e.reason)}
        </pre>
      `;
    };

    return () => {
      window.onerror = null;
      window.onunhandledrejection = null;
    };
  }, []);

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
