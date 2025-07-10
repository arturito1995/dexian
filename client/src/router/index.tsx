import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { Home } from "../pages/Home";
import { CarProfile } from "../pages/CarProfile";
import { PageWrapper } from "../components/PageWrapper";
import { Register } from "../pages/Register";

const routes = [
  { path: "/", element: <Home /> },
  { path: "/car/:id", element: <CarProfile /> },
  { path: "/register", element: <Register /> },
  { path: "/*", element: <Navigate to="/" replace /> },
];

export const Router = () => (
  <BrowserRouter>
    <Routes>
      {routes.map((route) => (
        <Route key={route.path} path={route.path} element={<PageWrapper>{route.element}</PageWrapper>} />
      ))}
    </Routes>
  </BrowserRouter>
);
