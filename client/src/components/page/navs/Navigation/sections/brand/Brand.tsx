import React, { SetStateAction, useCallback, Dispatch } from 'react';
import { useMediaQuery } from 'react-responsive';
import Navbar from 'react-bootstrap/esm/Navbar';
import { Props } from '@Types';
import Cable from '@Images/logo/cable-nav.png';
import Image from 'react-bootstrap/esm/Image';
import Col from 'react-bootstrap/esm/Col';
import Row from 'react-bootstrap/esm/Row';
import { LOGO_DIMS } from '@CONSTANTS';
import './style.css';

const NavBrand = ({ loggedIn, setShowSideNav }: Props) => {
  const isDesktop = useMediaQuery({
    query: '((min-width: 900px) and (orientation: landscape))',
  });

  const handleClick = useCallback(() => {
    if (isDesktop || !loggedIn) return;
    else {
      (setShowSideNav as Dispatch<SetStateAction<boolean>>)(true);
    }
  }, [loggedIn, isDesktop, setShowSideNav]);
  return (
    <Row className={'nav-right'}>
      <Col xs={2} lg={1} className='mt-1'>
        <Navbar.Brand>
          <Image
            src={Cable}
            onClick={handleClick}
            alt={'powerback cable icon'}
            width={LOGO_DIMS.default.width}
            height={LOGO_DIMS.default.height}
          />
        </Navbar.Brand>
      </Col>
      {isDesktop && <Col lg={'auto'}></Col>}
      <Col xs={10} lg={10} className='navbar-text'>
        <Navbar.Text>
          <span className='powerback'>POWERBACK</span>
          <i className='donation-politics'> donation politics</i>
        </Navbar.Text>
      </Col>
    </Row>
  );
};

export default React.memo(NavBrand);
