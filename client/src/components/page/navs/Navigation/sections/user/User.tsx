import React, {
  Dispatch,
  KeyboardEvent,
  SetStateAction,
  MouseEventHandler,
  KeyboardEventHandler,
} from 'react';
import { ShowModal } from '@Interfaces';
import Col from 'react-bootstrap/esm/Col';
import Nav from 'react-bootstrap/esm/Nav';
import Row from 'react-bootstrap/esm/Row';
import { TabLink } from '@Components/interactive';
import './style.css';

type Props = {
  loggedIn: boolean;
  keyLogOut: KeyboardEventHandler;
  clickLogOut: MouseEventHandler<HTMLSpanElement>;
  setShowModal: Dispatch<SetStateAction<ShowModal>>;
};

const NavUser = ({
  setShowModal,
  clickLogOut,
  keyLogOut,
  loggedIn,
}: Props) => (
  <Col lg={3}>
    {loggedIn && (
      <Nav className='nav-links flex-row'>
        <Row className='account-logout--row'>
          <Col
            xs={'auto'}
            onKeyDown={(e: KeyboardEvent) => {
              if (
                !(
                  e.type === 'click' ||
                  (e.type === 'keydown' &&
                    (e.key === ' ' || e.key === 'Enter'))
                )
              )
                return;
              else setShowModal((s) => ({ ...s, account: true }));
            }}
            onClick={() => setShowModal((s) => ({ ...s, account: true }))}>
            <TabLink topic={'Account'} />
          </Col>
          <Col xs={'auto'}>
            <span
              tabIndex={0}
              id={'navbar-logout'}
              onClick={clickLogOut}
              className={'natural-link'}
              onKeyDown={(e: KeyboardEvent) => keyLogOut(e)}>
              Sign out
            </span>
          </Col>
        </Row>
      </Nav>
    )}
  </Col>
);

export default React.memo(NavUser);
