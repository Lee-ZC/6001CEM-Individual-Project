import React, { useState } from "react";

function SideBar() {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleToggleSidebar = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className="sidebar">
      <button onClick={handleToggleSidebar}>
        {isExpanded ? "Collapse Sidebar" : "Expand Sidebar"}
      </button>
      <ul className={`nav flex-column ${isExpanded ? "expanded" : ""}`}>
        <li className="nav-item">
          <a className="nav-link active" href="/admindashboard">
            Dashboard
          </a>
        </li>
        <li className="nav-item">
          <a className="nav-link" href="#">
            Add Product
          </a>
        </li>
        <li className="nav-item">
          <a className="nav-link" href="/manageproduct">
            Manage Products
          </a>
        </li>
      </ul>
    </div>
  );
}

export default SideBar;
