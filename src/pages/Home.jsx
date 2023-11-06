import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import Nav from "../components/Nav";
import Footer from "../components/Footer";
import location_logo from "../assets/location_logo.avif";
import bmi_logo from "../assets/bmi_logo.png";
import "./css/Home.css"; // Import your custom CSS for styling
import { Link } from "react-router-dom"; // Import Link from react-router-dom

const Home = () => {
  const [news, setNews] = useState([]);
  const [articlesToShow, setArticlesToShow] = useState(6);

  useEffect(() => {
    // Fetch health news when the component mounts
    fetchHealthNews();
  }, []);

  const fetchHealthNews = async () => {
    const apiKey = "b5d91466301044ceb91fef30afb719d2"; // Replace with your News API key
    const healthNewsUrl = `https://newsapi.org/v2/top-headlines?country=us&category=health&apiKey=${apiKey}`;

    try {
      const response = await fetch(healthNewsUrl);

      if (!response.ok) {
        throw new Error(
          `Network response was not ok (HTTP status: ${response.status})`
        );
      }

      const data = await response.json();

      if (data.status === "ok") {
        setNews(data.articles);
      } else {
        throw new Error("API response status is not 'ok'");
      }
    } catch (error) {
      console.error("Error fetching health news:", error);
    }
  };

  const loadMoreArticles = () => {
    setArticlesToShow(articlesToShow + 3);
  };

  return (
    <div>
      <Nav />
      <br />
      <div className="home-container">
        {/* Container 1: Fitness Nearby */}
        <Link to="/fitness" className="home-section">
          <h3>Fitness Nearby</h3>
          <img src={location_logo} alt="Location Logo" className="home-image" />
          <p>
            Discover fitness centers, gyms, and outdoor workout spots in your
            area. Stay active and healthy by finding convenient fitness options
            near you.
          </p>
        </Link>

        {/* Container 2: BMI Recommendation Food */}
        <Link to="/bmi" className="home-section">
          <h3>BMI Recommendation Food</h3>
          <img src={bmi_logo} alt="BMI Logo" className="home-image" />
          <p>
            Get personalized food recommendations based on your BMI. Maintain a
            balanced diet and make informed food choices for your health goals.
          </p>
        </Link>
      </div>
      <br />
      <center>
        <h2>Health News</h2>
      </center>
      <div
        className="news-container"
        style={{ display: "flex", justifyContent: "center" }}
      >
        <div className="news-articles">
          {news.slice(0, articlesToShow).map((article, index) => (
            <div key={index} className="news-article">
              <img
                src={article.urlToImage}
                alt="Article Image"
                className="article-image"
              />
              <div className="article-content">
                <h3>{article.title}</h3>
                <p>{article.description}</p>
                <a href={article.url} target="_blank" rel="noopener noreferrer">
                  Read more
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
      <br />
      <center>
        {articlesToShow < news.length && (
          <button className="more-news-button" onClick={loadMoreArticles}>
            Load More News
          </button>
        )}
      </center>
      <br /> <br /> <br />
      <Footer />
    </div>
  );
};

export default Home;
