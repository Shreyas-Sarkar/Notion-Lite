import Header from '../components/Header';
import Footer from '../components/Footer';
import './Landing.css';

const Landing = () => {
  return (
    <div className="landing-container">
      <Header />
      
      <section className="hero-section">
        <div className="hero-content">
          <h1>Your Connected Workspace for Everything</h1>
          <p className="hero-subtitle">Capture ideas, manage tasks, and stay organized with NotionLite</p>
          <a href="/auth" className="cta-button">Get Started</a>
        </div>
      </section>

      <section className="features-section">
        <h2>All-in-one workspace</h2>
        <div className="feature-grid">
          <div className="feature-card">
            <div className="feature-icon">📝</div>
            <h3>Notes & Docs</h3>
            <p>Write, plan, and get organized in one place</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">✓</div>
            <h3>Tasks & Projects</h3>
            <p>Track tasks and manage projects effortlessly</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">📅</div>
            <h3>Calendar</h3>
            <p>Keep track of events and deadlines</p>
          </div>
        </div>
      </section>

      <section className="how-it-works">
        <h2>How NotionLite Works</h2>
        <div className="steps-container">
          <div className="step">
            <div className="step-number">1</div>
            <h3>Create</h3>
            <p>Start with a blank page or choose from templates</p>
          </div>
          <div className="step">
            <div className="step-number">2</div>
            <h3>Organize</h3>
            <p>Structure your content your way</p>
          </div>
          <div className="step">
            <div className="step-number">3</div>
            <h3>Collaborate</h3>
            <p>Share and work together seamlessly</p>
          </div>
        </div>
      </section>

      <section className="cta-section">
        <h2>Ready to get started?</h2>
        <p>Join thousands of users who trust NotionLite for their productivity needs</p>
        <a href="/auth" className="cta-button">Try NotionLite Free</a>
      </section>

      <Footer />
    </div>
  );
};
  
  export default Landing;
  
