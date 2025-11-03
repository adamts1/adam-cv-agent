import React from "react";
import "./Portfolio.css";

const Portfolio: React.FC = () => {
  return (
    <div className="portfolio">
      <div className="portfolio-header">
        <div className="profile-section">
          <div className="profile-image-container">
            <img 
              src="/profile.jpg" 
              alt="Adam Tsityat" 
              className="profile-image"
              onError={(e) => {
                // Fallback to placeholder if image not found
                e.currentTarget.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200' viewBox='0 0 200 200'%3E%3Crect fill='%23667eea' width='200' height='200'/%3E%3Ctext x='50%25' y='50%25' font-size='60' fill='white' text-anchor='middle' dy='.3em' font-family='Arial'%3EAT%3C/text%3E%3C/svg%3E";
              }}
            />
          </div>
          <div className="profile-info">
            <h1>Adam Tsityat</h1>
            <h2>Full-Stack Software Developer</h2>
            <div className="contact-info">
              <a href="tel:+972525600493" className="contact-link">
                <span className="icon">📞</span> +972-52-5600493
              </a>
              <a href="mailto:adamtsityat@gmail.com" className="contact-link">
                <span className="icon">✉️</span> adamtsityat@gmail.com
              </a>
              <a 
                href="https://www.linkedin.com/in/adam-tsityat-05340a124/" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="contact-link linkedin"
              >
                <span className="icon">💼</span> LinkedIn Profile
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="portfolio-content">
        <section className="cv-section summary">
          <h3>Professional Summary</h3>
          <p>
            Full-stack software developer with six years of experience designing and implementing scalable web applications.
            Skilled in LangChain for AI-driven automation and workflow orchestration, combining strong backend logic with
            modern frontend technologies.
          </p>
          <p>
            Experienced in working with AI-powered code generation tools such as Cursor to accelerate development and
            improve productivity. Passionate about innovation, continuous learning, and building intelligent, automated systems
            that deliver real business value.
          </p>
        </section>

        <section className="cv-section competencies">
          <h3>Core Competencies</h3>
          <div className="competencies-grid">
            <div className="competency-card">
              <h4>💻 Technical Skills</h4>
              <p>NodeJS, TypeScript, React, Redux, MongoDB (Compass, Atlas, complex aggregations), Mongoose, Redis (Redis Insight), BullMQ, LangChain</p>
            </div>
            <div className="competency-card">
              <h4>🛠️ Environments & Tools</h4>
              <p>Github, Docker, AWS, MongoDB, MySQL, VSCode, Postman, JIRA, N8N</p>
            </div>
            <div className="competency-card">
              <h4>📚 Libraries Expertise</h4>
              <p>Leaflet, Axios, Formik, Yup, Vis-Timeline, React DnD, ESLint, Lodash, moment</p>
            </div>
            <div className="competency-card">
              <h4>🌍 Languages</h4>
              <p>Fluent in English, Hebrew and French</p>
            </div>
          </div>
        </section>

        <section className="cv-section experience">
          <h3>Professional Experience</h3>
          
          <div className="experience-item">
            <div className="experience-header">
              <div>
                <h4>Full-Stack Developer</h4>
                <p className="company">Moovex</p>
              </div>
              <span className="period">2021 - Present</span>
            </div>
            <p className="role-description">
              Key contributor to Fleet Manager, Moovex's enterprise solution for optimizing autonomous dispatch.
            </p>
            <ul className="achievements">
              <li>Responsible for developing both front-end and back-end (NodeJS, MongoDB)</li>
              <li>Developed responsive web applications and implemented back-end logic, including handling task queues for scalable systems and integrating with third-party APIs</li>
              <li>Continuously improved the system's performance by leveraging advanced MongoDB aggregation techniques and Redis for caching</li>
              <li>Developed responsive web applications from scratch</li>
              <li>Collaborated with a team of six developers to design and implement a highly scalable system for enhanced performance and efficiency</li>
            </ul>
          </div>

          <div className="experience-item">
            <div className="experience-header">
              <div>
                <h4>RPA Developer & Professional Services Expert</h4>
                <p className="company">Deloitte & Kryon</p>
              </div>
              <span className="period">2017 - 2020</span>
            </div>
            <ul className="achievements">
              <li>Delivery of RPA pilots and PoCs for large organizations worldwide onsite</li>
              <li>Support and train partners on process optimizations and best practices</li>
              <li>Planning, designing and implementing "Process Discovery" pilots to improve customers productivity by utilizing AI and automation</li>
            </ul>
          </div>

          <div className="experience-item">
            <div className="experience-header">
              <div>
                <h4>PHP Developer</h4>
                <p className="company">Alberto</p>
              </div>
              <span className="period">2016 - 2017</span>
            </div>
            <ul className="achievements">
              <li>Transforming the existing CRM system from MS Access to be web based</li>
              <li>Analyzing datasets using MySQL queries and developing new features</li>
            </ul>
          </div>
        </section>

        <section className="cv-section education">
          <h3>Education</h3>
          
          <div className="education-item">
            <div className="education-header">
              <div>
                <h4>B.Sc. Industrial Engineering</h4>
                <p className="institution">Jerusalem College of Engineering</p>
                <p className="specialization">Specialization in Information Technology</p>
              </div>
              <span className="period">2013 - 2017</span>
            </div>
          </div>

          <div className="education-item">
            <div className="education-header">
              <div>
                <h4>Web Application Development Course</h4>
                <p className="institution">Appleseeds Academy</p>
                <p className="specialization">React, Redux, JavaScript, HTML and CSS3</p>
              </div>
              <span className="period">2021</span>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Portfolio;

