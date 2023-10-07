import React, { KeyboardEventHandler, MouseEventHandler } from 'react';
import Col from 'react-bootstrap/esm/Col';
import Nav from 'react-bootstrap/esm/Nav';
import Row from 'react-bootstrap/esm/Row';
import Tab from 'react-bootstrap/esm/Tab';
import { ShowModal } from '@Interfaces';
import './style.css';

type Props = {
  handleLogOut: KeyboardEventHandler & MouseEventHandler;
  showLinkedModal: (modal: keyof ShowModal) => void;
  username: string;
};

const BottomPanel = ({
  showLinkedModal,
  handleLogOut,
  username,
}: Props) => {
  return (
    <Tab.Container id='side-nav-tabs'>
      <Row
        id='account-slide-row'
        className={'side-menu-profile-row flex-row'}
        style={{ fontFamily: 'Red Hat Text' }}>
        <Col>
          <Nav className='flex-column pt-2'>
            <Nav.Link
              // eventKey='profile'
              tabIndex={0}
              onClick={() => showLinkedModal('faq')}>
              FAQ
            </Nav.Link>
            <Nav.Link
              // eventKey='profile'
              tabIndex={0}
              onClick={() => showLinkedModal('eligibility')}>
              Eligibility
            </Nav.Link>
            <Nav.Link
              // eventKey='profile'
              tabIndex={0}
              onClick={() => showLinkedModal('terms')}>
              Terms
            </Nav.Link>
            <Nav.Link
              // eventKey='account'
              tabIndex={0}
              onClick={() => {
                showLinkedModal('account');
              }}>
              <i className='bi-person-circle iconic-pink' />
              &nbsp;Account
            </Nav.Link>
            <Nav.Link
              tabIndex={0}
              className={'py-4'}
              onClick={handleLogOut}>
              <i className='bi bi-box-arrow-left iconic-pink' />
              &nbsp;Sign out
            </Nav.Link>
            <span className='signedin-info'>
              {'Signed in as ' + username}
            </span>
          </Nav>
        </Col>
      </Row>
    </Tab.Container>
  );
};

export default React.memo(BottomPanel);
