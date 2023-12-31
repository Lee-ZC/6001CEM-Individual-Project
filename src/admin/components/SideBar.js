import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "../css/SideBar.css";
import $ from "jquery";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import healthhub from "../../assets/Health-Hub-logo.png";
import { auth } from "../../firebase";
import { useNavigate, useLocation } from "react-router-dom";

function SideBar(props) {
  const navigate = useNavigate();
  const location = useLocation();

  const [isExpanded, setIsExpanded] = useState(false);

  const handleToggleSidebar = () => {
    setIsExpanded(!isExpanded);
  };

  useEffect(() => {
    $(".sidebar ul li").on("click", function () {
      $(".sidebar ul li.active").removeClass("active");
      $(this).addClass("active");
    });

    $(".open-btn").on("click", function () {
      $(".sidebar").addClass("active");
    });

    $(".close-btn").on("click", function () {
      $(".sidebar").removeClass("active");
    });
  }, []);

  const handleSignOut = () => {
    auth.signOut().then(() => {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      localStorage.removeItem("bmi");
      localStorage.removeItem("height");
      localStorage.removeItem("weight");
      navigate("/login");
    });
  };

  return (
    <div
      className={`main-container d-flex flex-wrap flex-md-nowrap ${
        isExpanded ? "expanded" : ""
      }`}
    >
      <div className="sidebar" id="side_nav">
        <div className="header-box px-2 pt-3 pb-4 d-flex justify-content-between">
          <h1 className="fs-4">
            <span className="bg-white text-dark rounded shadow px-2 me-2">
              <img
                src={healthhub}
                width="35"
                height="30"
                className="d-inline-block align-top"
              />
            </span>{" "}
            <span className="text-white">Health Hub</span>
          </h1>
          <button
            className="btn d-md-none d-block close-btn px-1 py-0 text-white"
            onClick={handleToggleSidebar}
          >
            <i className={`fal ${isExpanded ? "fa-times" : "fa-stream"}`}></i>
          </button>
        </div>
        <ul className="list-unstyled px-2">
          <li className={location.pathname === "/dashboard" ? "active" : ""}>
            <a
              href="/dashboard"
              className="text-decoration-none px-3 py-2 d-block"
            >
              <i className="fal fa-home"></i> Dashboard
            </a>
          </li>
          <li className={location.pathname === "/addproduct" ? "active" : ""}>
            <a
              href="/addproduct"
              className="text-decoration-none px-3 py-2 d-block"
            >
              <i className="fal fa-list"></i> Diet Product
            </a>
          </li>
          <li
            className={location.pathname === "/manageproduct" ? "active" : ""}
          >
            <a
              href="/manageproduct"
              className="text-decoration-none px-3 py-2 d-block"
            >
              <i className="fal fa-envelope-open-text"></i> Manage Product
            </a>
          </li>
        </ul>
        <hr className="h-color mx-2" />
        <ul className="list-unstyled px-2">
          <li className={location.pathname === "/addfitness" ? "active" : ""}>
            <a
              href="/addfitness"
              className="text-decoration-none px-3 py-2 d-block"
            >
              <i className="fal fa-bell"></i> Fitness
            </a>
          </li>
          <li
            className={location.pathname === "/managefitness" ? "active" : ""}
          >
            <a
              href="/managefitness"
              className="text-decoration-none px-3 py-2 d-block"
            >
              <i className="fal fa-bell"></i> Manage Fitness
            </a>
          </li>
          <li
            className={location.pathname === "/fitnessStatus" ? "active" : ""}
          >
            <a
              href="/fitnessStatus"
              className="text-decoration-none px-3 py-2 d-block"
            >
              <i className="fal fa-bars"></i> Enrollments Status Update
            </a>
          </li>
        </ul>
      </div>
      <div className="content">
        <nav className="navbar navbar-expand-md navbar-light bg-light">
          <div className="container-fluid">
            <div className="d-flex justify-content-between d-md-none d-block">
              <button
                className="btn px-1 py-0 open-btn me-2"
                onClick={handleToggleSidebar}
              >
                <i
                  className={`fal ${isExpanded ? "fa-times" : "fa-stream"}`}
                ></i>
              </button>
              <a className="navbar-brand fs-4" href="#">
                <span className="bg-dark rounded px-2 py-0 text-white">CL</span>
              </a>
            </div>
            <button
              className="navbar-toggler p-0 border-0"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#navbarSupportedContent"
              aria-controls="navbarSupportedContent"
              aria-expanded="false"
              aria-label="Toggle navigation"
            >
              <i className="fal fa-bars"></i>
            </button>
            <div
              className="collapse navbar-collapse justify-content-end"
              id="navbarSupportedContent"
            >
              <ul className="navbar-nav mb-2 mb-lg-0">
                <li className="nav-item">
                  <a
                    className="nav-link active"
                    aria-current="page"
                    href="/login"
                    onClick={handleSignOut}
                  >
                    Logout
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </nav>
        <div className="dashboard-content px-3 pt-4"> {props.children}</div>
      </div>
    </div>
  );
}

export default SideBar;
