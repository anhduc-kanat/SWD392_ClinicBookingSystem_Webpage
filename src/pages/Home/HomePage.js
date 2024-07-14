import React from 'react';
import { Layout, Menu, Button } from 'antd';
import { Link } from 'react-router-dom';
import TrustedBy from './components/TrustedBy'; // Import the new component
import './HomePage.css'; // Import the CSS file for custom styles
import Service from './components/Service';
import Dentist from './components/Dentist';
import Feedback from './components/Feedback';
import Footer from './components/Footer';
import { useInView } from 'react-intersection-observer'; // Import Intersection Observer
import Fade from 'react-reveal/Fade'; // Import the Fade effect from react-reveal

const { Header, Content } = Layout;

const Section = ({ children }) => {
  const { ref, inView } = useInView({
    triggerOnce: true, // Trigger only once
    threshold: 0.1, // Percentage of element visibility to trigger
  });

  return (
    <div ref={ref}>
      <Fade bottom when={inView}>
        {children}
      </Fade>
    </div>
  );
};

const HomePage = () => {
  return (
    <Layout>
      <Header className="fixed-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'white', height:'100px' }}>
        <div className="logo">
          <img src="/assets/Logo.png" alt="Duck Clinic Logo" style={{ height: '50px' }} />
        </div>
        <Menu style={{ width: '250px', display: 'flex', justifyContent: 'space-between' }}>
          <Menu.Item key="3">
            <Link to="/signup">
              <Button type="primary" style={{width:'100px', borderRadius:'20px', height:'35px'}}>Try Now</Button>
            </Link>
          </Menu.Item>
          <Menu.Item key="1">
            <Link to="/login">
              <Button type="primary" style={{width:'100px', borderRadius:'20px', height:'35px'}}>Login</Button>
            </Link>
          </Menu.Item>
        </Menu>

      </Header>
      <Content className="homepage-content">
        <div className="intro-section">
          <div className="intro-text">
            <h1 style={{ fontSize: '30px', fontWeight: 'bold', color: '#1677FF' }}>Vietnam now has a dental appointment booking solution.</h1>
            <p style={{ fontSize: '20px' }}>
              Duck Clinic is a convenient and efficient online scheduling platform for dental clinics. With Duck Clinic, patients can easily book appointments online from anywhere, anytime they need. Additionally, the platform offers additional features such as personal medical notes, appointment reminders, and updates on the latest dental services. Furthermore, Duck Clinic continuously evolves to provide the best user experience and enhance service quality for the community.
            </p>
            <Button type="primary" size="large">
              Booking Now!
            </Button>
            <Button type="primary" size="large" style={{marginLeft:'10px'}}>Call: 019-215-1510</Button>
          </div>
          <div className="intro-images">
            <img src="/images/Dentist1.png" alt="Dentist" className="main-image" />
            <img src="/images/Dentist2.png" alt="Patient" className="sub-image" />
          </div>
        </div>
        <Section className="trusted-by-section">
          <div style={{ marginTop: '7rem' }}>
            <TrustedBy />
          </div>
        </Section>
        <Section>
          <div style={{ marginTop: '7rem' }}>
            <Service />
          </div>
        </Section>
        <Section>
          <div style={{ marginTop: '7rem' }}>
            <Dentist />
          </div>
        </Section>
        <Section>
          <div style={{ marginTop: '7rem' }}>
            <Feedback />
          </div>
        </Section>
      </Content>
      <div >
        <Footer />
      </div>
    </Layout>
  );
};

export default HomePage;
