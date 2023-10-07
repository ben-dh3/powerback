import React, { useCallback, useState } from 'react';
import { ContinueBtn } from '@Components/buttons';
import { Props } from '@Types';
import Stack from 'react-bootstrap/esm/Stack';
import { SECURITY_BUTTONS } from '@CONSTANTS';
import Theater from './Theater';
import './style.css';

interface SecurityTheater {
  changePassword: boolean;
  deleteAccount: boolean;
}

const Security = ({
  showSecurityTheater,
  handleDeleteUser,
  securityTheater,
  ...props
}: Props) => {
  const [passwordChanged, setPasswordChanged] = useState(false),
    handleClick = useCallback(
      (btn: string) => {
        setPasswordChanged(false);
        showSecurityTheater(btn);
      },
      [showSecurityTheater]
    );

  return (
    <div className={'settings-security'}>
      <span className={'pb-1 fs-4'}>Security</span>
      <Stack
        className={'mx-lg-4 mx-3 mt-lg-2 mt-3 security-buttons'}
        direction={'horizontal'}
        gap={2}>
        {/* CHANGE PASSWORD, DELETE ACCOUNT */}
        {SECURITY_BUTTONS.map((btn) => (
          <ContinueBtn
            classProp={
              (securityTheater[
                (btn.substring(0, 1).toLowerCase() +
                  btn.slice(1).replace(' ', '')) as keyof SecurityTheater
              ]
                ? 'option-btn-active '
                : '') + 'button--continue'
            }
            handleClick={() => handleClick(btn)}
            key={'security-btn--' + btn}
            variant={'outline-dark'}
            label={btn}
            size={'sm'}
          />
        ))}
      </Stack>
      <Theater
        {...props}
        showSecurityTheater={showSecurityTheater}
        setPasswordChanged={setPasswordChanged}
        handleDeleteUser={handleDeleteUser}
        passwordChanged={passwordChanged}
        securityTheater={securityTheater}
      />
    </div>
  );
};

export default React.memo(Security);
