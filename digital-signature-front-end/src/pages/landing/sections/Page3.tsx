/**
 * Page3 Section - Dễ dàng tích hợp
 * Content section với scroll animations
 * Dựa trên template Ant Design 2.x landing page
 */

import type React from 'react';
import { Button } from 'antd';
import { RightOutlined } from '@ant-design/icons';
import { SafeScrollOverPack } from '../components/SafeScrollOverPack';

type Page3Props = {
  isMobile: boolean;
}

export const Page3: React.FC<Page3Props> = ({ isMobile: _isMobile }) => {
  return (
    <SafeScrollOverPack id="page3" className="content-wrapper page">
      <div className="image3 image-wrapper" />
      <div className="text-wrapper" style={{ top: '40%' }}>
        <h2>Dễ dàng tích hợp</h2>
        <p style={{ maxWidth: 280 }}>
          API đơn giản, SDK đầy đủ cho mọi nền tảng.
          Tích hợp vào hệ thống của bạn chỉ trong vài phút.
        </p>
        <div>
          <Button type="primary" size="large">
            Xem tài liệu API
            <RightOutlined />
          </Button>
        </div>
      </div>
    </SafeScrollOverPack>
  );
};

