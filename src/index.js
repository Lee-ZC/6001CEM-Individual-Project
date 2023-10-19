import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import {
  createBrowserRouter,
  createRoutesFromElements,
  RouterProvider,
  Route,
} from "react-router-dom";
import Protected from "./components/Protected";
import Signup from "./pages/SignUp";
import Login from "./pages/Login";
import Home from "./pages/Home";
import ForgotPassword from "./pages/ForgotPassword";
import Setting from "./pages/Setting";
import ErrorPage from "./pages/ErrorPage";
import ManageProduct from "./admin/ManageProduct";
import BMI from "./pages/BMI";
import AddProduct from "./admin/AddProduct";
import ProductDetail from "./pages/ProductDetail";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />}>
      <Route path="signup" element={<Signup />} />
      <Route path="login" element={<Login />} />
      <Route path="/" element={<Protected />}>
        <Route path="/" index element={<Home />} />
      </Route>
      <Route path="setting" element={<Setting />} />
      <Route path="forgotpassword" element={<ForgotPassword />} />
      <Route path="addproduct" element={<AddProduct />} />
      <Route path="manageproduct" element={<ManageProduct />} />
      <Route path="bmi" element={<BMI />} />
      <Route path="/product/:productId" element={<ProductDetail />} />

      {/* Catch-all route for 404 errors */}
      <Route path="*" element={<ErrorPage />} />
    </Route>
  )
);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<RouterProvider router={router} />);
