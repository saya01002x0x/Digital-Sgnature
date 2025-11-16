/**
 * Page1 Section - Tính năng nổi bật
 * Content section với scroll animations
 * Dựa trên template Ant Design 2.x landing page
 */

import type React from 'react';
import { Button } from 'antd';
import { RightOutlined } from '@ant-design/icons';
import { SafeScrollOverPack } from '../components/SafeScrollOverPack';

type Page1Props = {
  isMobile: boolean;
}

export const Page1: React.FC<Page1Props> = ({ isMobile }) => {
  return (
    <SafeScrollOverPack id="page1" className="content-wrapper page">
      <div className="image1 image-wrapper" />
      <div className="text-wrapper">
        <h2>Tính năng nổi bật</h2>
        <p style={{ maxWidth: 310 }}>
          Ký số điện tử nhanh chóng, an toàn với công nghệ mã hóa tiên tiến.
          Hỗ trợ đầy đủ các loại tài liệu và chứng thư số.
        </p>
        <div>
          <Button type="primary" size="large">
            Tìm hiểu thêm
            <RightOutlined />
          </Button>
        </div>
      </div>
    </SafeScrollOverPack>
  );
};

