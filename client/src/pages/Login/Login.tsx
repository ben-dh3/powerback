import React, {
  useMemo,
  useState,
  useEffect,
  useCallback,
  useTransition,
  Dispatch,
  SetStateAction,
} from 'react';
import {
  COPY,
  SLOGAN,
  IMG_HEIGHT,
  ALERT_TIMEOUT,
  EASTER_EGG_URI,
  EXT_URI_SETTINGS,
} from './tuples';
import {
  AlertSignup,
  AlertDeleteAcct,
  AlertLoginLogout,
  AlertResetLinkSent,
  AlertAcctActivated,
} from '@Components/alerts';
import LoginForm from './form';
import { handleSecret } from './fn';
import Row from 'react-bootstrap/esm/Row';
import Col from 'react-bootstrap/esm/Col';
import Image from 'react-bootstrap/esm/Image';
import Stack from 'react-bootstrap/esm/Stack';
import Logo from '@Images/logo/cable-nav.png';
import { MobileFormBtn } from '@Components/buttons';
import { ShowAlert, ShowOverlay } from '@Interfaces';
import Container from 'react-bootstrap/esm/Container';
import { UserEvent, Props } from '@Types';
import { ForgotPasswordOverlay } from '@Components/modals';
import './style.css';

const Login = ({
  accountActivated,
  loggedIn = false,
  setShowOverlay,
  setShowAlert,
  setFormPath,
  showOverlay,
  FORM_PATHS,
  isDesktop,
  showAlert,
  formPath,
  route,
  ...props
}: Props) => {
  const [isPendingValidation, startValidationTransition] = useTransition();

  const handleOnPressMobileFormPathButton = useCallback(
    (e: UserEvent) => {
      setShowAlert((s) => ({ ...s, activate: false })); // alert overlaps and covers userform
      startValidationTransition(() =>
        (setFormPath as (action: string) => void)(
          (e.target as HTMLInputElement).textContent as string
        )
      );
    },
    [setFormPath, setShowAlert]
  );

  const [emailToSendPasswordLink, setEmailToSendPasswordLink] =
    useState('');

  useEffect(() => {
    // replace with a "prev" ? or useLayoutEffect?
    if (accountActivated)
      setShowAlert((s) => ({
        ...s,
        activate: accountActivated,
      }));
  }, [setShowAlert, accountActivated]);

  const alertArr = useMemo(() => {
    return [
      { element: AlertSignup, key: 'signup' },
      { element: AlertDeleteAcct, key: 'delete' },
      { element: AlertLoginLogout, key: 'signio' },
      { element: AlertResetLinkSent, key: 'reset' },
      { element: AlertAcctActivated, key: 'activate' },
    ];
  }, []);

  const [overlayTarget, setOverlayTarget] = useState(null);
  return (
    <>
      {alertArr.map((alert) => {
        const Alert = alert.element;
        const alertKey = 'alert-' + alert.key;
        return (
          <Alert
            timeout={ALERT_TIMEOUT[alert.key] as number}
            show={showAlert as ShowAlert & true}
            setShow={setShowAlert}
            loggedIn={loggedIn}
            key={alertKey}
          />
        );
      })}
      <ForgotPasswordOverlay
        {...props}
        setShow={setShowOverlay as Dispatch<SetStateAction<ShowOverlay>>}
        show={(showOverlay && showOverlay.resetPass) as boolean}
        setEmail={setEmailToSendPasswordLink}
        email={emailToSendPasswordLink}
        setShowAlert={setShowAlert}
        target={overlayTarget}
      />
      <Container id='login' className='p-4 p-xxl-0 pt-3 pt-xxl-0'>
        <h1 className='mission-statement'>{SLOGAN}</h1>
        <Row className='cta-row'>
          {(isDesktop || (formPath as string | []).length === 0) && (
            <>
              <p className='intro'>
                <span className='powerback'>POWERBACK</span>
                {COPY.intro}
              </p>
              <Col lg={'auto'} />
              {/* Sign Up/Sign In buttons on mobile UI */}
              {!isDesktop && (
                <Col className='mobile-signio-btns'>
                  <Stack direction='horizontal' gap={3}>
                    {(FORM_PATHS as string[]).map((path) => {
                      return (
                        <MobileFormBtn
                          onPress={handleOnPressMobileFormPathButton}
                          key={'mobile-btn-' + path}
                          value={path}
                          size={'lg'}
                        />
                      );
                    })}
                  </Stack>
                </Col>
              )}
              <Col lg={3} className='cta-w-icon mt-4'>
                {COPY.cta}
                <Image
                  onClick={() =>
                    handleSecret(EASTER_EGG_URI, EXT_URI_SETTINGS)
                  }
                  className={'splash-icon pt-1'}
                  height={IMG_HEIGHT}
                  src={Logo}
                />
              </Col>
            </>
          )}
          {(isDesktop || (formPath as string | []).length) && (
            <LoginForm
              {...props}
              isPendingValidation={isPendingValidation}
              accountActivated={accountActivated}
              setOverlayTarget={setOverlayTarget}
              setShowOverlay={setShowOverlay}
              setShowAlert={setShowAlert}
              setFormPath={setFormPath}
              showOverlay={showOverlay}
              FORM_PATHS={FORM_PATHS}
              isDesktop={isDesktop}
              showAlert={showAlert}
              formPath={formPath}
              loggedIn={loggedIn}
              BTNS={FORM_PATHS}
              route={route}
            />
          )}
        </Row>
      </Container>
    </>
  );
};

export default React.memo(Login);
