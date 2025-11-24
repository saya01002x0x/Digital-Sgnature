import React from 'react';
import { Row, Col, Typography, Steps } from 'antd';
import { UserAddOutlined, FileTextOutlined, SafetyCertificateOutlined } from '@ant-design/icons';

const { Title, Paragraph } = Typography;

export const HowItWorks: React.FC = () => {
    return (
        <section id="how-it-works" style={{ padding: '100px 24px', background: '#F9FAFB' }}>
            <div style={{ maxWidth: 1000, margin: '0 auto' }}>
                <div style={{ textAlign: 'center', marginBottom: 64 }}>
                    <Title level={2} style={{ fontSize: 36, marginBottom: 16 }}>Quy trình đơn giản</Title>
                    <Paragraph style={{ fontSize: 18, color: '#666', maxWidth: 600, margin: '0 auto' }}>
                        Chỉ với 3 bước đơn giản để bắt đầu ký số điện tử
                    </Paragraph>
                </div>

                <Row justify="center">
                    <Col span={24}>
                        <Steps
                            current={-1}
                            labelPlacement="vertical"
                            items={[
                                {
                                    title: 'Đăng ký tài khoản',
                                    description: 'Tạo tài khoản miễn phí chỉ trong 1 phút.',
                                    icon: <UserAddOutlined style={{ fontSize: 32 }} />,
                                },
                                {
                                    title: 'Tải lên tài liệu',
                                    description: 'Upload tài liệu cần ký (PDF, Word, Excel...).',
                                    icon: <FileTextOutlined style={{ fontSize: 32 }} />,
                                },
                                {
                                    title: 'Ký và Gửi',
                                    description: 'Thêm chữ ký của bạn và gửi cho người khác.',
                                    icon: <SafetyCertificateOutlined style={{ fontSize: 32 }} />,
                                },
                            ]}
                        />
                    </Col>
                </Row>
            </div>
        </section>
    );
};
