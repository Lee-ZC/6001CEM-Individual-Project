import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import 'bootstrap/dist/css/bootstrap.min.css';
import healthhub from '../assets/Health-Hub-logo.png'



function NavScrollExample() {
  return (
    <Navbar expand="lg" className="bg-body-tertiary">
      <Container fluid>
        <Navbar.Brand href="/">
        <img
           src={healthhub}  // Replace with the path to your logo image
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
            style={{ maxHeight: '100px' }}
            navbarScroll
          >
            <Nav.Link href="/">Home</Nav.Link>
            <Nav.Link href="#action2">Explore</Nav.Link>
            <NavDropdown title="Health-Care" id="navbarScrollingDropdown">
              <NavDropdown.Item href="#action3">BMI</NavDropdown.Item>
              <NavDropdown.Item href="#action4">
                Shop
              </NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item href="/setting">
                Setting
              </NavDropdown.Item>
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
            />
            <Button variant="outline-success">Search</Button>
          </Form>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default NavScrollExample;