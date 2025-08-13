import React from "react";
import "./Home.css";

const Home: React.FC = () => (
  <div className="home-hero">
    <h1>Welcome to SatMathWeb</h1>
    <p>
      Free SAT Maths resources, practice questions, and revision notes.<br />
      Prepare for your SAT with expertly crafted materials and interactive tools.
    </p>
    <a className="home-cta" href="/dashboard">
      Start Practicing
    </a>
    <div className="home-features">
      <div>
        <h2>Practice Questions</h2>
        <p>Hundreds of SAT-style questions with instant feedback.</p>
      </div>
      <div>
        <h2>Revision Notes</h2>
        <p>Concise notes covering all SAT Maths topics.</p>
      </div>
      <div>
        <h2>Progress Tracking</h2>
        <p>Monitor your improvement and focus on weak areas.</p>
      </div>
    </div>
  </div>
);

export default Home;