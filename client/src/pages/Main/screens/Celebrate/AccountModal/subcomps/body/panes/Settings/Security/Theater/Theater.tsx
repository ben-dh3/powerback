import React, { SetStateAction, Dispatch, useState } from 'react';
import Container from 'react-bootstrap/esm/Container';
import { Props } from '@Types';
import Col from 'react-bootstrap/esm/Col';
import Row from 'react-bootstrap/esm/Row';
import ChangePassword from '../ChangePass';
import DeleteAcct from '../DeleteAcct';
// import { INIT } from '@Constants';
import './style.css';

type TheaterTypes = {
  setPasswordChanged: Dispatch<SetStateAction<boolean>>;
  handleDeleteUser: () => void;
  passwordChanged: boolean;
};

interface ChangePasswordForm {
  confirmNewPassword: string;
  newPassword: string;
  err: string;
}

const initChangePasswordForm = {
  newPassword: '',
  confirmNewPassword: '',
  err: '',
};

const Theater = ({
  secureUserPassFeedback,
  setPasswordChanged,
  handleDeleteUser,
  passwordChanged,
  securityTheater,
  user,
  ...props
}: Props & TheaterTypes) => {
  const [passFormObject, setPassFormObject] = useState(
    initChangePasswordForm as ChangePasswordForm
  ); // input state of change pw form

  const [prevSecurityTheater, setPrevSecurityTheater] =
    useState(securityTheater);
  if (prevSecurityTheater !== securityTheater) {
    setPrevSecurityTheater(securityTheater);
    if (securityTheater.deleteAccount)
      setPassFormObject(initChangePasswordForm);
  }

  return (
    <Container
      className={
        'pt-1 pt-lg-0' + (securityTheater.deleteAccount ? ' delete' : '')
      }>
      <Row>
        <Col>
          {((securityTheater.changePassword && !passwordChanged) ||
            (passwordChanged &&
              !securityTheater.changePassword &&
              !securityTheater.deleteAccount)) && (
            <ChangePassword
              cnpValue={
                passFormObject ? passFormObject.confirmNewPassword : ''
              }
              npValue={passFormObject ? passFormObject.newPassword : ''}
              secureUserPassFeedback={secureUserPassFeedback}
              key={user.id + '-change-password-pane'}
              setPasswordChanged={setPasswordChanged}
              setPassFormObject={setPassFormObject}
              cnpFeedback={secureUserPassFeedback}
              handleDeleteUser={handleDeleteUser}
              passwordChanged={passwordChanged}
              securityTheater={securityTheater}
              passFormObject={passFormObject}
              user={user}
              {...props}
            />
          )}
          {securityTheater.deleteAccount && (
            <DeleteAcct
              secureUserPassFeedback={secureUserPassFeedback}
              handleDeleteUser={handleDeleteUser}
              securityTheater={securityTheater}
              user={user}
              {...props}
            />
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default React.memo(Theater);
