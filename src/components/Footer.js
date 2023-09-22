// FooterWithLogo.js
import { Footer } from 'flowbite-react';
import {home} from "../pages/Home"
import { Link, useNavigate } from 'react-router-dom';
import healthhub from '../assets/Health-Hub-logo.png'



export default function FooterWithLogo() {
    const navigate = useNavigate();

  return (
    <Footer container>
      <div className="w-full text-center">
        <div className="w-full justify-between sm:flex sm:items-center sm:justify-between">
          <Footer.Brand
            alt="HealthHub Logo"
            href="https://flowbite.com"
            name="Flowbite"
            src="https://flowbite.com/docs/images/logo.svg"
          />
          <Footer.LinkGroup>
            <Footer.Link href="#">
              About
            </Footer.Link>
            <Footer.Link href="#">
              Privacy Policy
            </Footer.Link>
            <Footer.Link href="#">
              Licensing
            </Footer.Link>
            <Footer.Link href="#">
              Contact
            </Footer.Link>
          </Footer.LinkGroup>
        </div>
        <Footer.Divider />
        <Footer.Copyright
          by="Flowbite™"
          href="#"
          year={2022}
        />
      </div>
    </Footer>
  );
}
