import React, { lazy } from "react";
import {
  Route,
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements,
} from "react-router-dom";
import { Suspense } from "./components/Suspense/Suspense";
import { ErrorPageRoute } from "./routes/ErrorPageRoute";
import "./App.scss";

const ErrorPage = lazy(() => import("./components/ErrorPage/ErrorPage"));

const App: React.FC = () => {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path="/" element={<div />}>
        <Route path="error">
          <Route
            path="404"
            element={
              <ErrorPageRoute>
                <Suspense>
                  <ErrorPage errorCode="404" />
                </Suspense>
              </ErrorPageRoute>
            }
          />
          <Route
            path="403"
            element={
              <ErrorPageRoute>
                <Suspense>
                  <ErrorPage errorCode="403" />
                </Suspense>
              </ErrorPageRoute>
            }
          />
          <Route
            path="500"
            element={
              <ErrorPageRoute>
                <Suspense>
                  <ErrorPage errorCode="500" />
                </Suspense>
              </ErrorPageRoute>
            }
          />
          <Route
            path=""
            element={
              <ErrorPageRoute>
                <Suspense>
                  <ErrorPage />
                </Suspense>
              </ErrorPageRoute>
            }
          />
        </Route>
        <Route
          path="*"
          element={
            <ErrorPageRoute>
              <Suspense>
                <ErrorPage errorCode="404" />
              </Suspense>
            </ErrorPageRoute>
          }
        />
      </Route>
    )
  );

  return <RouterProvider router={router} />;
};

export default App;
