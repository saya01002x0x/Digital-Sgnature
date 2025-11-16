/**
 * Page4 Section - Được tin dùng
 * Content section với scroll animations
 * Dựa trên template Ant Design 2.x landing page
 */

import type React from 'react';
import { SafeScrollOverPack } from '../components/SafeScrollOverPack';

export const Page4: React.FC = () => {
  return (
    <SafeScrollOverPack id="page4" className="content-wrapper page">
      <div className="text-wrapper-bottom">
        <h2>
          Nhanh · An toàn · Tin cậy
        </h2>
        <p>
          Nền tảng ký số điện tử được tin dùng bởi hàng nghìn doanh nghiệp.
          Giúp bạn số hóa quy trình ký kết một cách chuyên nghiệp và hiệu quả.
        </p>
      </div>
      <div className="image4 bottom-wrapper" />
    </SafeScrollOverPack>
  );
};

