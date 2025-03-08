import React from 'react';
import { Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';

const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;

const Loader: React.FC = () => (
  <div className="flex justify-center items-center py-12">
    <Spin indicator={antIcon} />
  </div>
);

export default Loader;