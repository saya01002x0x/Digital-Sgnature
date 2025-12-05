/**
 * Banner Section
 * Hero banner với animations và CTA buttons
 * Dựa trên template Ant Design 2.x landing page
 */

import type React from 'react';
import { useEffect, useRef } from 'react';
import { DownOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { APP_ROUTES } from '@/app/config/constants';

type BannerProps = {
  onEnterChange: (mode: string) => void;
}

export const Banner: React.FC<BannerProps> = ({ onEnterChange }) => {
  const navigate = useNavigate();
  const bannerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const mode = entry.isIntersecting ? 'enter' : 'leave';
          onEnterChange(mode);
        });
      },
      {
        threshold: 0.9,
        rootMargin: '0px'
      }
    );

    const currentRef = bannerRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [onEnterChange]);

  return (
    <section className="page banner-wrapper">
      <div
        ref={bannerRef}
        className="page"
        id="banner"
      >
        <div className="banner-text-wrapper">
          <h2>
            KÝ SỐ <p>ĐIỆN TỬ</p>
          </h2>
          <p>Nền tảng ký số hiện đại và bảo mật</p>
          <span className="line" />
          <div className="start-button clearfix">
            <a onClick={() => navigate(APP_ROUTES.REGISTER)}>
              Đăng ký ngay
            </a>
            <a onClick={() => navigate(APP_ROUTES.LOGIN)}>
              Đăng nhập
            </a>
          </div>
        </div>
        <DownOutlined className="down" />
      </div>
    </section>
  );
};

