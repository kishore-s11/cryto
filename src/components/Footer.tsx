import React from 'react';
import { Layout, Typography } from 'antd';
import { Github, Twitter } from 'lucide-react';

const { Footer: AntFooter } = Layout;
const { Text, Link } = Typography;

const Footer: React.FC = () => {
  return (
    <AntFooter className="text-center py-6 mt-auto">
      <div className="flex flex-col items-center">
        <Text className="mb-2">CryptoVerse © {new Date().getFullYear()}</Text>
        <Text className="mb-4">All rights reserved</Text>
        <div className="flex space-x-4">
          <Link href="https://github.com" target="_blank" rel="noopener noreferrer">
            <Github size={20} />
          </Link>
          <Link href="https://twitter.com" target="_blank" rel="noopener noreferrer">
            <Twitter size={20} />
          </Link>
        </div>
      </div>
    </AntFooter>
  );
};

export default Footer;