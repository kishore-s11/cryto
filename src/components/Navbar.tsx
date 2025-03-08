import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Layout, Menu, Button, Drawer } from 'antd';
import { useSelector } from 'react-redux';
import { selectBookmarks } from '../features/bookmarks/bookmarksSlice';
import { Home, CoinsIcon as CoinIcon, Star, Menu as MenuIcon, Sun, Moon } from 'lucide-react';

const { Header } = Layout;

interface NavbarProps {
  darkMode: boolean;
  toggleDarkMode: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ darkMode, toggleDarkMode }) => {
  const [visible, setVisible] = useState(false);
  const bookmarks = useSelector(selectBookmarks);

  const showDrawer = () => {
    setVisible(true);
  };

  const onClose = () => {
    setVisible(false);
  };

  const menuItems = [
    {
      key: 'home',
      icon: <Home size={16} />,
      label: <Link to="/">Home</Link>,
    },
    {
      key: 'cryptocurrencies',
      icon: <CoinIcon size={16} />,
      label: <Link to="/cryptocurrencies">Cryptocurrencies</Link>,
    },
    {
      key: 'bookmarks',
      icon: <Star size={16} className="text-yellow-400" />,
      label: 'Bookmarks',
      children: bookmarks.length > 0 ? bookmarks.map((bookmark) => ({
        key: `bookmark-${bookmark.id}`,
        label: <Link to={`/crypto/${bookmark.id}`}>{bookmark.name}</Link>,
      })) : [
        {
          key: 'no-bookmarks',
          label: 'No bookmarks yet',
          disabled: true,
        },
      ],
    },
  ];

  return (
    <Header className={`flex justify-between items-center px-4 sm:px-8 ${darkMode ? 'bg-gray-800' : 'bg-white'} sticky top-0 z-10 shadow-md`}>
      <div className="flex items-center">
        <Link to="/" className="flex items-center mr-8">
          <CoinIcon size={24} className="text-blue-500 mr-2" />
          <h1 className={`text-xl font-bold hidden sm:block ${darkMode ? 'text-white' : 'text-gray-800'}`}>
            CryptoVerse
          </h1>
        </Link>
        <div className="hidden md:block">
          <Menu
            theme={darkMode ? 'dark' : 'light'}
            mode="horizontal"
            items={menuItems}
            className={darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white'}
          />
        </div>
      </div>
      <div className="flex items-center">
        <Button
          type="text"
          icon={darkMode ? <Sun size={20} /> : <Moon size={20} />}
          onClick={toggleDarkMode}
          className="mr-2"
        />
        <Button
          type="text"
          icon={<MenuIcon size={20} />}
          onClick={showDrawer}
          className="md:hidden"
        />
      </div>
      <Drawer
        title="Menu"
        placement="right"
        onClose={onClose}
        open={visible}
        className={darkMode ? 'dark' : ''}
      >
        <Menu
          theme={darkMode ? 'dark' : 'light'}
          mode="inline"
          items={menuItems}
          className={darkMode ? 'bg-gray-800' : 'bg-white'}
        />
      </Drawer>
    </Header>
  );
};

export default Navbar;