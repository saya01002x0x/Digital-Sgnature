/**
 * LandingFooter Component
 * Dark theme footer với 4 cột links
 * Dựa trên template Ant Design 2.x landing page
 */

import type React from 'react';
import { Row, Col } from 'antd';

export const LandingFooter: React.FC = () => {
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
                <a href="/">Trang chủ</a>
              </div>
              <div>
                <a href="/about">Về chúng tôi</a>
              </div>
              <div>
                <a href="/pricing">Bảng giá</a>
              </div>
            </div>
          </Col>
          <Col lg={6} sm={24} xs={24}>
            <div className="footer-center">
              <h2>Tài nguyên</h2>
              <div>
                <a href="/docs">Tài liệu API</a>
              </div>
              <div>
                <a target="_blank" rel="noopener noreferrer" href="/sdk">
                  SDK & Tích hợp
                </a>
              </div>
              <div>
                <a target="_blank" rel="noopener noreferrer" href="/tutorials">
                  Hướng dẫn
                </a>
              </div>
              <div>
                <a target="_blank" rel="noopener noreferrer" href="/blog">
                  Blog
                </a>
              </div>
              <div>
                <a target="_blank" rel="noopener noreferrer" href="/faq">
                  Câu hỏi thường gặp
                </a>
              </div>
            </div>
          </Col>
          <Col lg={6} sm={24} xs={24}>
            <div className="footer-center">
              <h2>Cộng đồng</h2>
              <div>
                <a href="/changelog">
                  Lịch sử cập nhật
                </a>
              </div>
              <div>
                <a target="_blank" rel="noopener noreferrer" href="https://github.com/miiao29/digital-signature-web/issues">
                  Báo lỗi
                </a>
              </div>
              <div>
                <a target="_blank" rel="noopener noreferrer" href="/community">
                  Diễn đàn thảo luận
                </a>
              </div>
              <div>
                <a target="_blank" rel="noopener noreferrer" href="/support">
                  Hỗ trợ
                </a>
              </div>
            </div>
          </Col>
          <Col lg={6} sm={24} xs={24}>
            <div className="footer-center">
              <h2>Công ty</h2>
              <div>
                <a target="_blank" rel="noopener noreferrer" href="/about">
                  Giới thiệu
                </a>
              </div>
              <div>
                <a target="_blank" rel="noopener noreferrer" href="/careers">
                  Tuyển dụng
                </a>
              </div>
              <div>
                <a target="_blank" rel="noopener noreferrer" href="/contact">
                  Liên hệ
                </a>
              </div>
              <div>
                <a target="_blank" rel="noopener noreferrer" href="/partners">
                  Đối tác
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
              Chính sách bảo mật
            </a>
          </span>
          <span style={{ marginRight: 24 }}>
            <a
              href="/terms"
              rel="noopener noreferrer"
              target="_blank"
            >
              Điều khoản dịch vụ
            </a>
          </span>
          <span style={{ marginRight: 12 }}>© {new Date().getFullYear()} E-Signature Platform</span>
        </Col>
      </Row>
    </footer>
  );
};

