import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Layout, ConfigProvider, theme } from 'antd';
import Navbar from './components/Navbar';
import Homepage from './pages/Homepage';
import Cryptocurrencies from './pages/Cryptocurrencies';
import CryptoDetails from './pages/CryptoDetails';
import Footer from './components/Footer';
import './App.css';

const { Content } = Layout;

function App() {
  const [darkMode, setDarkMode] = useState(() => {
    const savedMode = localStorage.getItem('darkMode');
    return savedMode ? JSON.parse(savedMode) : false;
  });

  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return (
    <Router>
      <ConfigProvider
        theme={{
          algorithm: darkMode ? theme.darkAlgorithm : theme.defaultAlgorithm,
          token: {
            colorPrimary: '#1677ff',
          },
        }}
      >
        <div className={`min-h-screen ${darkMode ? 'dark bg-gray-900' : 'bg-gray-50'}`}>
          <Layout className="min-h-screen">
            <Navbar darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
            <Content className="px-4 sm:px-8 py-6">
              <div className="container mx-auto">
                <Routes>
                  <Route path="/" element={<Homepage />} />
                  <Route path="/cryptocurrencies" element={<Cryptocurrencies />} />
                  <Route path="/crypto/:coinId" element={<CryptoDetails />} />
                </Routes>
              </div>
            </Content>
            <Footer />
          </Layout>
        </div>
      </ConfigProvider>
    </Router>
  );
}

export default App;