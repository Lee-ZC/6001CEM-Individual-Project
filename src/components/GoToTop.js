import React, { useEffect, useState } from "react";
import styled, { ThemeProvider } from "styled-components";
import { FaArrowUp } from "react-icons/fa";

const GoToTop = () => {
  const [isVisible, setIsVisible] = useState(false);

  const goToBtn = () => {
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  };

  const listenToScroll = () => {
    let heightToHidden = 20;
    const winScroll =
      document.body.scrollTop || document.documentElement.scrollTop;

    if (winScroll > heightToHidden) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", listenToScroll);
    return () => window.removeEventListener("scroll", listenToScroll);
  }, []);

  // Define a simple theme object
  const theme = {
    colors: {
      btn: "#007bff", // Example color value
    },
  };

  return (
    <ThemeProvider theme={theme}>
      <Wrapper>
        {isVisible && (
          <div className="top-btn" onClick={goToBtn}>
            <FaArrowUp className="top-btn--icon" />
          </div>
        )}
      </Wrapper>
    </ThemeProvider>
  );
};

const Wrapper = styled.section`
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;

  .top-btn {
    font-size: 1.3rem; /* Reduced font size */
    width: 3rem; /* Reduced width */
    height: 3rem; /* Reduced height */
    color: #fff;
    background-color: ${({ theme }) => theme.colors.btn || "#007bff"};
    box-shadow: ${({ theme }) => theme.colors.shadow};
    border-radius: 50%;
    position: fixed;
    bottom: 5rem;
    right: 5rem;
    z-index: 999;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;

    &--icon {
      animation: gototop 1.2s linear infinite alternate-reverse;
    }

    @keyframes gototop {
      0% {
        transform: translateY(-0.5rem);
      }
      100% {
        transform: translateY(1rem);
      }
    }
  }

  @media (max-width: ${({ theme }) => theme.media?.mobile || "768px"}) {
    .top-btn {
      right: 0;
      left: 80%;
    }
  }
`;

export default GoToTop;
