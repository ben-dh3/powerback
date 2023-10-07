import React, { useCallback } from 'react';
import Col from 'react-bootstrap/esm/Col';
import Row from 'react-bootstrap/esm/Row';
import Image from 'react-bootstrap/esm/Image';
import Container from 'react-bootstrap/esm/Container';
import './style.css';

const GG_SEAL_URI = 'https://my.greengeeks.com/seal/',
  GG_IMG_SRC = 'https://static.greengeeks.com/ggseal/Green_14.png';

const Footer = () => {
  const ggs_ggseal = useCallback(() => {
    window.open(GG_SEAL_URI, '_blank');
  }, []);
  const getYear = useCallback(() => {
    return new Date().getFullYear();
  }, []);
  return (
    <Container fluid className='footer'>
      <Row>
        <Col className='paid-for mb-1'>
          <p className='mt-2 mb-1'>
            Paid for by <span className='powerback'>POWERBACK</span> (
            <span className='link-appearance'>powerback.me</span>) and not
            authorized by any candidate or candidate's committee.
            <br />
            <br />
            Contributions of gifts to political candidates via{' '}
            <span className='powerback'>POWERBACK</span> as a conduit are
            not deductible as charitable contributions for Federal income
            tax purposes.
          </p>
        </Col>
      </Row>
      <Row className='footer-links pt-1'>
        {/* GreenGeeks seal of green energy */}
        <Col className='gg'>
          <Image src={GG_IMG_SRC} onClick={ggs_ggseal} />
        </Col>
        <Col className='donation-politics'>donation politics</Col>
        <Col>
          ©{getYear() + ' '}
          <a href={window.location.pathname === '/' ? undefined : '/'}>
            POWERBACK
          </a>
        </Col>
      </Row>
    </Container>
  );
};

export default React.memo(Footer);
