import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import healthhub from "../assets/Health-Hub-logo.png";
import React, { useState } from "react";

function NavScrollExample() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearchInput = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleSearchButtonClick = () => {
    // Implement logic to redirect to the appropriate page based on the search term
    switch (searchTerm.toLowerCase()) {
      case "home":
        navigate("/");
        break;
      case "explore":
        navigate("#action2");
        break;
      case "bmi":
        navigate("/bmi");
        break;
      case "shop":
        navigate("#action4");
        break;
      case "setting":
        navigate("/setting");
        break;
      default:
        navigate("/*");
    }
  };

  return (
    <Navbar expand="lg" className="bg-body-tertiary">
      <Container fluid>
        <Navbar.Brand href="/">
          <img
            src={healthhub} // Replace with the path to your logo image
            width="35"
            height="30"
            className="d-inline-block align-top"
          />
          HealthHub
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="navbarScroll" />
        <Navbar.Collapse id="navbarScroll">
          <Nav
            className="me-auto my-2 my-lg-0"
            style={{ maxHeight: "100px" }}
            navbarScroll
          >
            <Nav.Link href="/">Home</Nav.Link>
            <Nav.Link href="/fitness">Explore</Nav.Link>
            <NavDropdown title="Health-Care" id="navbarScrollingDropdown">
              <NavDropdown.Item href="/bmi">BMI</NavDropdown.Item>
              <NavDropdown.Item href="/favorites">Favorites</NavDropdown.Item>
              <NavDropdown.Item href="/cart">Cart</NavDropdown.Item>
              <NavDropdown.Item href="/orderhistory">
                Order history
              </NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item href="/setting">Setting</NavDropdown.Item>
            </NavDropdown>
            <Nav.Link href="#" enable>
              Contact Us
            </Nav.Link>
          </Nav>
          <Form className="d-flex">
            <Form.Control
              type="search"
              placeholder="Search"
              className="me-2"
              aria-label="Search"
              value={searchTerm}
              onChange={handleSearchInput}
            />
            <Button variant="outline-success" onClick={handleSearchButtonClick}>
              Search
            </Button>
          </Form>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default NavScrollExample;
