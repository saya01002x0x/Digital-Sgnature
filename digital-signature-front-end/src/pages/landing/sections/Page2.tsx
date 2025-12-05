/**
 * Page2 Section - Bảo mật tuyệt đối
 * Content section với scroll animations
 * Dựa trên template Ant Design 2.x landing page
 */

import type React from 'react';
import { Button } from 'antd';
import { RightOutlined } from '@ant-design/icons';
import { SafeScrollOverPack } from '../components/SafeScrollOverPack';

export const Page2: React.FC = () => {
  return (
    <SafeScrollOverPack
      id="page2"
      className="content-wrapper page"
    >
      <div className="text-wrapper left-text">
        <h2>Bảo mật tuyệt đối</h2>
        <p style={{ maxWidth: 260 }}>
          Mã hóa end-to-end với chuẩn AES-256 và RSA-2048.
          Tuân thủ ISO 27001, đảm bảo an toàn tối đa cho mọi giao dịch.
        </p>
        <div>
          <Button type="primary" size="large">
            Tìm hiểu thêm
            <RightOutlined />
          </Button>
        </div>
      </div>
      <div className="image2 image-wrapper" />
    </SafeScrollOverPack>
  );
};

