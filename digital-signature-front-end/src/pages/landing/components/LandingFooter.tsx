/**
 * LandingFooter Component
 * Dark theme footer với 4 cột links
 * Dựa trên template Ant Design 2.x landing page
 */

import type React from 'react';
import { Row, Col } from 'antd';
import { useTranslation } from 'react-i18next';

export const LandingFooter: React.FC = () => {
  const { t } = useTranslation('landing');

  return (
    <footer id="footer" className="dark">
      <div className="footer-wrap">
        <Row>
          <Col lg={6} sm={24} xs={24}>
            <div className="footer-center">
              <h2>E-Signature</h2>
              <div>
                <a target="_blank" rel="noopener noreferrer" href="https://github.com/miiao29/digital-signature-web">
                  GitHub
                </a>
              </div>
              <div>
                <a href="/">{t('footer.home', 'Trang chủ')}</a>
              </div>
              <div>
                <a href="/about">{t('footer.about', 'Về chúng tôi')}</a>
              </div>
              <div>
                <a href="/pricing">{t('footer.pricing', 'Bảng giá')}</a>
              </div>
            </div>
          </Col>
          <Col lg={6} sm={24} xs={24}>
            <div className="footer-center">
              <h2>{t('footer.resources', 'Tài nguyên')}</h2>
              <div>
                <a href="/docs">{t('footer.apiDocs', 'Tài liệu API')}</a>
              </div>
              <div>
                <a target="_blank" rel="noopener noreferrer" href="/sdk">
                  {t('footer.sdk', 'SDK & Tích hợp')}
                </a>
              </div>
              <div>
                <a target="_blank" rel="noopener noreferrer" href="/tutorials">
                  {t('footer.tutorials', 'Hướng dẫn')}
                </a>
              </div>
              <div>
                <a target="_blank" rel="noopener noreferrer" href="/blog">
                  Blog
                </a>
              </div>
              <div>
                <a target="_blank" rel="noopener noreferrer" href="/faq">
                  {t('footer.faq', 'Câu hỏi thường gặp')}
                </a>
              </div>
            </div>
          </Col>
          <Col lg={6} sm={24} xs={24}>
            <div className="footer-center">
              <h2>{t('footer.community', 'Cộng đồng')}</h2>
              <div>
                <a href="/changelog">
                  {t('footer.changelog', 'Lịch sử cập nhật')}
                </a>
              </div>
              <div>
                <a target="_blank" rel="noopener noreferrer" href="https://github.com/miiao29/digital-signature-web/issues">
                  {t('footer.reportBug', 'Báo lỗi')}
                </a>
              </div>
              <div>
                <a target="_blank" rel="noopener noreferrer" href="/community">
                  {t('footer.forum', 'Diễn đàn thảo luận')}
                </a>
              </div>
              <div>
                <a target="_blank" rel="noopener noreferrer" href="/support">
                  {t('footer.support', 'Hỗ trợ')}
                </a>
              </div>
            </div>
          </Col>
          <Col lg={6} sm={24} xs={24}>
            <div className="footer-center">
              <h2>{t('footer.company', 'Công ty')}</h2>
              <div>
                <a target="_blank" rel="noopener noreferrer" href="/about">
                  {t('footer.introduction', 'Giới thiệu')}
                </a>
              </div>
              <div>
                <a target="_blank" rel="noopener noreferrer" href="/careers">
                  {t('footer.careers', 'Tuyển dụng')}
                </a>
              </div>
              <div>
                <a target="_blank" rel="noopener noreferrer" href="/contact">
                  {t('footer.contact', 'Liên hệ')}
                </a>
              </div>
              <div>
                <a target="_blank" rel="noopener noreferrer" href="/partners">
                  {t('footer.partners', 'Đối tác')}
                </a>
              </div>
            </div>
          </Col>
        </Row>
      </div>
      <Row className="bottom-bar">
        <Col lg={4} sm={24} />
        <Col lg={20} sm={24}>
          <span
            style={{
              lineHeight: '16px',
              paddingRight: 12,
              marginRight: 11,
              borderRight: '1px solid rgba(255, 255, 255, 0.55)',
            }}
          >
            <a
              href="/privacy"
              rel="noopener noreferrer"
              target="_blank"
            >
              {t('footer.privacyPolicy', 'Chính sách bảo mật')}
            </a>
          </span>
          <span style={{ marginRight: 24 }}>
            <a
              href="/terms"
              rel="noopener noreferrer"
              target="_blank"
            >
              {t('footer.termsOfService', 'Điều khoản dịch vụ')}
            </a>
          </span>
          <span style={{ marginRight: 12 }}>© {new Date().getFullYear()} E-Signature Platform</span>
        </Col>
      </Row>
    </footer>
  );
};
