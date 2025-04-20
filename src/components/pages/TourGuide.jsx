import React, { useEffect, useRef } from "react";
import introJs from "intro.js";
import "intro.js/introjs.css";

const TourGuide = ({ forceRestart = false }) => {
  const introRef = useRef(null);

  useEffect(() => {
    let styleSheet;

    try {
      // Initialize intro.js
      introRef.current = introJs();

      // Custom styling
      const customStyles = `
        .introjs-tooltip {
          background: linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%);
          color: white;
          border-radius: 8px;
          padding: 1.5rem;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          max-width: 350px;
        }
        
        .introjs-tooltip-title {
          font-size: 1.2rem;
          font-weight: 600;
          margin-bottom: 0.5rem;
          color: #fff;
        }
        
        .introjs-button {
          background-color: #ffffff;
          color: #1e3a8a;
          border: none;
          padding: 0.5rem 1rem;
          border-radius: 4px;
          font-weight: 500;
          transition: all 0.2s ease;
        }
        
        .introjs-button:hover {
          background-color: #f0f0f0;
          transform: translateY(-1px);
        }
        
        .introjs-progressbar {
          background: rgba(255, 255, 255, 0.2);
          height: 4px;
          border-radius: 2px;
        }
        
        .introjs-progressbar-container {
          margin: 1rem 0;
        }
        
        .introjs-skipbutton {
          color: #fff;
          opacity: 0.7;
        }
        
        .introjs-skipbutton:hover {
          opacity: 1;
        }
      `;

      // Add custom styles to document
      styleSheet = document.createElement("style");
      styleSheet.textContent = customStyles;
      document.head.appendChild(styleSheet);

      // Configure intro.js options
      introRef.current.setOptions({
        steps: [
          {
            element: document.querySelector("#step1") || document.body,
            intro: "Welcome to your Dashboard! This is your central hub for monitoring key metrics and activities.",
            position: "right",
            title: "Dashboard Overview"
          },
          {
            element: document.querySelector("#step2") || document.body,
            intro: "Add new items quickly using this button. It opens a form to input all necessary details.",
            position: "bottom",
            title: "Add New Item"
          },
          {
            element: document.querySelector("#step3") || document.body,
            intro: "Access and customize your preferences here. Adjust settings to match your workflow.",
            position: "left",
            title: "Settings"
          }
        ],
        showProgress: true,
        showBullets: false,
        exitOnOverlayClick: true,
        doneLabel: "Complete Tour",
        skipLabel: "Skip",
        nextLabel: "Next →",
        prevLabel: "← Back",
        tooltipClass: "custom-tooltip",
        highlightClass: "custom-highlight",
        scrollToElement: true,
        scrollPadding: 20,
        overlayOpacity: 0.6,
        disableInteraction: true
      });

      // Event handlers
      introRef.current.oncomplete(() => {
        console.log("Tour completed!");
        localStorage.setItem("hasSeenTour", "true");
      });

      introRef.current.onexit(() => {
        console.log("Tour exited");
      });

      // Start tour based on conditions
      if (forceRestart || !localStorage.getItem("hasSeenTour")) {
        introRef.current.start();
      }
    } catch (error) {
      console.error("Tour initialization failed:", error);
    }

    // Cleanup
    return () => {
      if (introRef.current) {
        introRef.current.exit();
      }
      if (styleSheet && document.head.contains(styleSheet)) {
        document.head.removeChild(styleSheet);
      }
    };
  }, [forceRestart]);

  return null;
};

export default TourGuide;