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
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Favorites from "./pages/Favorites";
import OrderHistory from "./pages/OrderHistory";
import FitnessLocationsNearby from "./pages/FitnessLocationsNearby";
import AddFitnessLocation from "./admin/AddFitnessLocation";
import EnrollmentsHistory from "./pages/EnrollmentsHistory";
import UpdateEnrollments from "./admin/UpdateEnrollments";
import Dashboard from "./admin/Dashboard";
import ContactUs from "./pages/ContactUs";

import {
  FirebaseAuthProvider,
  AuthenticatedRoute,
} from "./contexts/AuthenticatedRoute"; // Import your AuthenticatedRoute
import ManageFitness from "./admin/ManageFitness";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />}>
      <Route path="signup" element={<Signup />} />
      <Route path="login" element={<Login />} />

      <Route path="/" element={<Protected />}>
        <Route
          index
          element={<AuthenticatedRoute>{<Home />}</AuthenticatedRoute>}
        />
        <Route
          path="setting"
          element={<AuthenticatedRoute>{<Setting />}</AuthenticatedRoute>}
        />
        <Route
          path="addproduct"
          element={<AuthenticatedRoute>{<AddProduct />}</AuthenticatedRoute>}
        />
        <Route
          path="manageproduct"
          element={<AuthenticatedRoute>{<ManageProduct />}</AuthenticatedRoute>}
        />
        <Route
          path="bmi"
          element={<AuthenticatedRoute>{<BMI />}</AuthenticatedRoute>}
        />
        <Route
          path="/product/:productId"
          element={<AuthenticatedRoute>{<ProductDetail />}</AuthenticatedRoute>}
        />
        <Route
          path="cart"
          element={<AuthenticatedRoute>{<Cart />}</AuthenticatedRoute>}
        />
        <Route
          path="checkout"
          element={<AuthenticatedRoute>{<Checkout />}</AuthenticatedRoute>}
        />
        <Route
          path="favorites"
          element={<AuthenticatedRoute>{<Favorites />}</AuthenticatedRoute>}
        />
        <Route
          path="orderhistory"
          element={<AuthenticatedRoute>{<OrderHistory />}</AuthenticatedRoute>}
        />
        <Route
          path="fitness"
          element={
            <AuthenticatedRoute>
              {<FitnessLocationsNearby />}
            </AuthenticatedRoute>
          }
        />
        <Route
          path="addfitness"
          element={
            <AuthenticatedRoute>{<AddFitnessLocation />}</AuthenticatedRoute>
          }
        />
        <Route
          path="managefitness"
          element={<AuthenticatedRoute>{<ManageFitness />}</AuthenticatedRoute>}
        />
        <Route
          path="enrollments"
          element={
            <AuthenticatedRoute>{<EnrollmentsHistory />}</AuthenticatedRoute>
          }
        />
        <Route
          path="fitnessStatus"
          element={
            <AuthenticatedRoute>{<UpdateEnrollments />}</AuthenticatedRoute>
          }
        />
        <Route
          path="dashboard"
          element={<AuthenticatedRoute>{<Dashboard />}</AuthenticatedRoute>}
        />
        <Route
          path="contact"
          element={<AuthenticatedRoute>{<ContactUs />}</AuthenticatedRoute>}
        />
      </Route>
      <Route path="forgotpassword" element={<ForgotPassword />} />

      {/* Catch-all route for 404 errors */}
      <Route path="*" element={<ErrorPage />} />
    </Route>
  )
);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <FirebaseAuthProvider>
    <RouterProvider router={router} />
  </FirebaseAuthProvider>
);
