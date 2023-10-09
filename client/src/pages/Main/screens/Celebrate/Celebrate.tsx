import React, {
  SetStateAction,
  useCallback,
  useEffect,
  Dispatch,
  Suspense,
  useState,
  useMemo,
  ReactNode,
} from 'react';
import { AccordionSelectCallback } from 'react-bootstrap/esm/AccordionContext';
import { PolDonations, ShowAlert, UserData } from '@Interfaces';
import TabContainer from 'react-bootstrap/esm/TabContainer';
import Container from 'react-bootstrap/esm/Container';
import { useMediaQuery } from 'react-responsive';
import { ALERT_TIMEOUT } from '@CONSTANTS';
import AccountModal from './AccountModal';
import { Props } from '@Types';
import {
  AlertLoginLogout,
  AlertDonationRejected,
} from '@Components/alerts';
import API from '@API';
import './style.css';

const TabContents = React.lazy(() => import('./TabContents'));

const Celebrate = ({
  rejectedDonationReasons,
  switchToErrorScreen,
  polsOnParade,
  setShowAlert,
  setSettings,
  selectPol,
  setTabKey,
  showAlert,
  loggedIn,
  userData,
  tabKey,
  ...props
}: Props) => {
  const [totalCelebrations, setTotalCelebrations] = useState<
    PolDonations | []
  >([]);

  const isShortMobile = useMediaQuery({
    query: '((max-height: 640px) and (orientation: portrait))',
  });

  const getEscrow = useCallback(() => {
    API.getWhatPolsHaveInEscrow()
      .then((res) => {
        const { data: escrow } = res;
        return escrow;
      })
      .then((escrow) =>
        (setTotalCelebrations as Dispatch<SetStateAction<PolDonations>>)(
          escrow
        )
      )
      .catch((err) => {
        if (err.response.status === 500)
          (switchToErrorScreen as (err: Error) => void)(err);
        else console.error(err);
      });
  }, [setTotalCelebrations, switchToErrorScreen]);

  useEffect(() => {
    let ignore = false;
    if (!ignore) getEscrow();
    return () => {
      ignore = true;
    };
  }, [getEscrow, userData]);

  const alerts = useMemo(() => {
    return [
      { key: 'logio', element: AlertLoginLogout },
      {
        key: 'rejected',
        element: AlertDonationRejected,
      },
    ];
  }, []);

  return (
    <>
      <AccountModal
        {...props}
        tabKey={tabKey}
        loggedIn={loggedIn}
        userData={userData}
        setTabKey={setTabKey}
        showAlert={showAlert}
        setSettings={setSettings}
        setShowAlert={setShowAlert}
        polsOnParade={polsOnParade}
        isShortMobile={isShortMobile}
        switchToErrorScreen={switchToErrorScreen}
        key={(userData as UserData).id + '-account-modal'}
      />
      <Container id='celebrate--page'>
        <Suspense fallback={<></>}>
          <TabContainer
            onSelect={setTabKey as AccordionSelectCallback}
            defaultActiveKey={'pol-donation'}
            id={'celebrate-tab-container'}
            activeKey={tabKey}>
            {alerts.map((alert) => {
              const CustomAlert = alert.element;
              return (
                <CustomAlert
                  setShow={setShowAlert}
                  key={'alert-' + alert.key}
                  {...rejectedDonationReasons}
                  loggedIn={loggedIn as boolean}
                  show={showAlert as ShowAlert & boolean}
                  timeout={
                    ALERT_TIMEOUT[
                      `${
                        (
                          (
                            alert as unknown as {
                              key: string;
                              element: ReactNode;
                            }
                          )['key' as keyof object] as string
                        ).toUpperCase() as keyof {
                          LOGIO: number;
                          UPDATE: number;
                          REJECTED: number;
                        }
                      }`
                    ] as number
                  }
                />
              );
            })}

            <TabContents
              {...props}
              switchToErrorScreen={switchToErrorScreen}
              totalCelebrations={totalCelebrations}
              isShortMobile={isShortMobile}
              polsOnParade={polsOnParade}
              setShowAlert={setShowAlert}
              setSettings={setSettings}
              getEscrow={getEscrow}
              selectPol={selectPol}
              showAlert={showAlert}
              setTabKey={setTabKey}
              loggedIn={loggedIn}
              userData={userData}
              tabKey={tabKey}
            />
          </TabContainer>
        </Suspense>
      </Container>
    </>
  );
};

export default React.memo(Celebrate);
