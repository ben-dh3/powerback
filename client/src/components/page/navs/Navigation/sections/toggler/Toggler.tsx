import React from 'react';
import Image from 'react-bootstrap/esm/Image';
import MenuOpen from '@Images/icon/menu-x.svg';
import MenuClosed from '@Images/icon/hamburger.svg';
import NavbarToggle from 'react-bootstrap/esm/NavbarToggle';
import './style.css';

type Props = {
  showSideNav: boolean;
};

const NavToggler = ({ showSideNav }: Props) => {
  return (
    <NavbarToggle>
      <Image
        tabIndex={0}
        // height={60}
        // width={60}
        aria-label={'open menu icon'}
        aria-controls={'responsive-navbar-nav'}
        src={showSideNav ? MenuOpen : MenuClosed}
      />
    </NavbarToggle>
  );
};

export default React.memo(NavToggler);
