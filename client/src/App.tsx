import React, {
  useMemo,
  Dispatch,
  Suspense,
  useState,
  useEffect,
  useReducer,
  ChangeEvent,
  useCallback,
  useTransition,
  SetStateAction,
  useLayoutEffect,
  FormEvent,
} from 'react';
import {
  useSpinner,
  useFormPaths,
  useDonationLimit,
  useButtonErrorSwapper,
} from '@Hooks';
import {
  entry,
  login,
  logOut,
  signup,
  clearForm,
  activation,
  deleteUser,
  refreshToken,
  regexMatchURI,
  userFormChange,
} from '@Utils';
import {
  PolData,
  Settings,
  UserData,
  ShowAlert,
  UserEntryForm,
  ServerConstants,
} from '@Interfaces';
import API from '@API';
import { ObjectId } from 'mongodb';
import { AxiosResponse } from 'axios';
import { APP, INIT } from '@CONSTANTS';
import { Page } from '@Components/page';
import { SessionOpts } from 'type-route';
import { CelebrationRejection } from '@Types';
import { useMediaQuery } from 'react-responsive';
import { routes, useRoute, session } from './router';
import './App.css';

let didInit = false;
const init = INIT.INIT;

const App = () => {
  const [serverConstants, setServerConstants] = useState<ServerConstants>(
      {} as any
    ),
    LEGAL_LIMIT = useMemo(() => {
      return (
        (serverConstants &&
          Object.keys(serverConstants).length &&
          serverConstants.FEC &&
          serverConstants.FEC.LEGAL_LIMIT) || [0, 0]
      );
    }, [serverConstants]);

  // notifications, alerts, modals, overlays, etc
  const [showAlert, setShowAlert] = useState(init.alerts),
    [showModal, setShowModal] = useState(init.modals),
    [showOverlay, setShowOverlay] = useState({
      resetPass: false,
    }),
    [prevShowModal, setPrevShowModal] = useState(showModal),
    [showSideNav, setShowSideNav] = useState<boolean>(false), // mobile only
    [prevShowSideNav, setPrevShowSideNav] = useState(showSideNav);

  if (prevShowModal !== showModal) {
    setPrevShowModal(showModal);
    if (showAlert.login)
      setShowAlert((s: ShowAlert) => ({ ...s, login: false }));
  }
  if (prevShowSideNav !== showSideNav) {
    setPrevShowSideNav(showSideNav);
    if (showAlert.login)
      setShowAlert((s: ShowAlert) => ({ ...s, login: false }));
  }

  const [externalAPIisDown, setExternalAPIisDown] = useReducer((state) => {
      return !state;
    }, false),
    switchToErrorScreen = useCallback((err: Error) => {
      console.error(err);
      setShowModal(init.modals);
      setShowSideNav(false);
      setExternalAPIisDown();
    }, []);

  const [userData, setUserData] = useState<UserData>(init.userData); // account

  const [loggedIn, setLoggedIn] = useReducer((state) => {
    return !state;
  }, false);

  const sessionStorageNames = useMemo(() => {
    return {
      refreshToken: 'powerback_refresh-token',
      selectedPol: 'powerback_selected-pol',
      donation: 'powerback_donation',
      settings: 'powerback_settings',
    };
  }, []);

  // const sessionStoredDonation = Number(
  //   sessionStorage.getItem(sessionStorageNames.donation)
  // );

  // const sessionStoredPol = sessionStorage.getItem(
  //   sessionStorageNames.selectedPol
  // );

  const [selectedPol, setSelectedPol] = useState<string>(
    null as unknown as string
  ); // Politician-donee

  // init app
  useEffect(() => {
    if (!didInit) {
      didInit = true;
      const importConstants = () => {
          API.getConstants()
            .then((res: AxiosResponse) => {
              const response = res;
              return response;
            })
            .then((response: AxiosResponse) =>
              setServerConstants(response.data)
            )
            .catch((err: Error) => switchToErrorScreen(err));
        },
        checkToken = () => {
          try {
            refreshToken(
              setLoggedIn,
              setUserData,
              sessionStorageNames,
              switchToErrorScreen
            );
          } catch (err) {
            switchToErrorScreen(err as Error);
          }
        };

      importConstants();
      checkToken();
    }
  }, [serverConstants, sessionStorageNames, switchToErrorScreen]);

  const localStoredSettings = localStorage.getItem(
    sessionStorageNames.settings
  );

  // user preferences
  const [settings, setSettings] = useState(
    localStoredSettings ?? init.defaultSettings
  );

  const [prevSettings, setPrevSettings] = useState(settings);
  if (prevSettings !== settings) {
    setPrevSettings(settings);
    localStorage.setItem(
      sessionStorageNames.settings,
      JSON.stringify(settings)
    );
  }

  useEffect(() => {
    let ignore = false;
    if (!userData) {
      if (!serverConstants) {
        return;
      } else if (!serverConstants.APP) {
        return;
      } else if (!serverConstants.APP.SETTINGS) {
        return;
      } else if (!ignore) setSettings(serverConstants.APP.SETTINGS);
    } else {
      if (!ignore) {
        if (localStoredSettings) setSettings(localStoredSettings);
        if (userData.settings) setSettings(userData.settings);
      }
    }
    return () => {
      ignore = true;
    };
  }, [userData, serverConstants, localStoredSettings]);

  const [userFormValidated, setUserFormValidated] = useState(false),
    [checkedTerms, setCheckedTerms] = useState(false); // user checked t&c box

  // UI is based on bootstrap Tabs for process flow
  const [tabKey, setTabKey] = useState(
      // sessionStoredDonation && sessionStoredPol
      //   ? 'payment'
      //   :
      'pol-donation'
    ),
    [donation, setDonation] = useState<Number>(
      // sessionStoredDonation ? Number(sessionStoredDonation) :
      0
    );
  // resetting app to init/logged-in state
  const stageNewProcess = useCallback(() => setTabKey('pol-donation'), []),
    [showRefreshAppSpinner, setShowRefreshAppSpinner] = useState(false),
    [appRefresh, startAppRefresh] = useTransition();

  // when user is tricky
  const [rejectedDonationReasons, setRejectedDonationReasons] =
      useState<CelebrationRejection>(null),
    [prevRejectedDonationReasons, setPrevRejectedDonationReasons] =
      useState(rejectedDonationReasons);
  if (prevRejectedDonationReasons !== rejectedDonationReasons) {
    setPrevRejectedDonationReasons(rejectedDonationReasons);
    setShowAlert((s: ShowAlert) => ({ ...s, rejected: true }));
  }
  // yay
  const [paymentProcessed, setPaymentProcessed] = useState(false),
    [paymentError, setPaymentError] = useState<Error>(
      null as unknown as Error
    ),
    [prevPaymentError, setPrevPaymentError] = useState(paymentError);
  if (prevPaymentError !== paymentError) {
    console.error(paymentError);
    setPrevPaymentError(paymentError);
    setRejectedDonationReasons({
      message: paymentError?.message,
      variant: 'danger',
    });
  }
  // sync session storage with donation state
  const [prevDonation, setPrevDonation] = useState(donation);
  if (prevDonation !== donation) {
    setPrevDonation(donation);
    // if ((donation as number) > 0)
    //   sessionStorage.setItem(
    //     sessionStorageNames.donation,
    //     donation.toString()
    //   );
    if (
      tabKey === 'support' &&
      donation === 0 &&
      !paymentProcessed &&
      !appRefresh
    )
      stageNewProcess();
  }
  // styles for search bar category links
  const [linksClass, setLinksClass] = useState(init.activeSearchOption);

  const [showClearBtn, setShowClearBtn] = useState(''); // despite the name, this String is in fact the text content of the search bar. the "clear" button shows/hides when there is/isn't text

  // sets politician as the Donee
  const [polData, setPolData] = useState<PolData>(
      // (sessionStoredPol as unknown as PolData)
      //   ? (sessionStoredPol as unknown as PolData)
      //   :
      init.honestPol
    ),
    [isSelectingPol, startSelectingPol] = useTransition(),
    [suggestedDonations, { setDonationLimit }] = useDonationLimit(
      LEGAL_LIMIT as number[],
      {
        ...((userData as UserData) ?? init.userData),
        donations: userData ? userData.donations : [],
      },
      polData as PolData
    ),
    selectPol = useCallback(
      (pol: PolData) => {
        if (
          Object.keys(pol).length !== Object.keys(init.honestPol).length ||
          !Object.keys(pol).every((v) =>
            Object.keys(init.honestPol).includes(v)
          ) ||
          isSelectingPol
        ) {
          return;
        } else {
          startSelectingPol(() => {
            setPolData(pol);
            setSelectedPol(pol.id);
            setDonationLimit();
            // if (pol)
            //   if (pol.id.length)
            //     sessionStorage.setItem(
            //       sessionStorageNames.selectedPol,
            //       JSON.stringify(pol)
            //     );
          });
        }
      },
      [
        setPolData,
        isSelectingPol,
        setSelectedPol,
        setDonationLimit,
        // sessionStorageNames,
      ]
    );

  // top search bar "search-by" type links
  const [optionCategory, setOptionCategory] = useState(
      init.optionCategory
    ),
    [prevOptionCategory, setPrevOptionCategory] = useState(optionCategory);

  // selecting/de-selecting pols (?)
  if (optionCategory)
    if (prevOptionCategory.name !== optionCategory.name) {
      setPrevOptionCategory(optionCategory);
      if (selectedPol) selectPol(init.honestPol);
    }

  const [isSelectingOption, startSelectingOption] = useTransition(),
    handleOptions = useCallback(
      (e: KeyboardEvent & MouseEvent) => {
        if (
          optionCategory.name ===
            (
              (e.target as HTMLSpanElement).textContent as string
            ).toUpperCase() ||
          isSelectingOption
        )
          return;
        else {
          const LINKS = [
            {
              name: 'NAME',
              value: 'Name',
              label: 'Search by name.',
            },
            {
              name: 'STATE',
              value: 'State',
              label: 'Search by state.',
            },
            {
              name: 'DISTRICT',
              value: 'District',
              label: '(Your address/zipcode)',
            },
          ];
          startSelectingOption(() => {
            setOptionCategory(
              LINKS.filter((link) => {
                return (
                  link.value ===
                  ((e.target as HTMLSpanElement).textContent as string)
                );
              })[0]
            );

            setLinksClass(() => ({
              ...{ NAME: '', STATE: '', DISTRICT: '' },
              [(
                (e.target as HTMLSpanElement).textContent as string
              ).toUpperCase()]: 'options-link-active',
            }));
            if (!showClearBtn) return;
            else if (showClearBtn.length) setShowClearBtn('');
          });
        }
      },
      [
        isSelectingOption,
        setOptionCategory,
        setShowClearBtn,
        optionCategory,
        setLinksClass,
        showClearBtn,
      ]
    );

  const [tip, setTip] = useState<number>(0);

  const [activeKey, setActiveKey] = useState('Profile');

  const refreshAppState = useCallback(() => {
    if (!userData.id || !userData.understands) return;
    else
      startAppRefresh(() => {
        const priv = async () => {
          return await API.checkPrivilege(
            (userData as UserData).id as ObjectId
          )
            .then((res: AxiosResponse) => {
              const understands = res.data;
              return understands;
            })
            .then((understands: boolean) => {
              setShowRefreshAppSpinner(false);
              setPaymentProcessed(false); // resetting to init value. not necessarily an indicator of payment failure.
              if (understands !== userData.understands)
                setUserData((s) => ({ ...s, understands: understands }));
            })
            .catch((err: Error) => switchToErrorScreen(err));
        };
        setTip(0);
        setShowClearBtn('');
        setSelectedPol(null as unknown as string);
        setPolData(init.honestPol);
        setLinksClass(init.activeSearchOption);
        priv();
      });
  }, [
    setPaymentProcessed,
    switchToErrorScreen,
    setShowClearBtn,
    setLinksClass,
    setUserData,
    userData,
    setTip,
  ]);

  // refreshes app process after donation on "Celebrate again!" event
  const [prevShowRefreshAppSpinner, setPrevShowRefreshAppSpinner] =
      useState(showRefreshAppSpinner),
    [prevPaymentProcessed, setPrevPaymentProcessed] =
      useState(paymentProcessed);
  if (prevShowRefreshAppSpinner !== showRefreshAppSpinner) {
    setPrevShowRefreshAppSpinner(showRefreshAppSpinner);
    if (showRefreshAppSpinner) {
      setOptionCategory(init.optionCategory);
      refreshAppState();
    } else setDonation(0);
  }
  if (prevPaymentProcessed !== paymentProcessed) {
    setPrevPaymentProcessed(paymentProcessed);
    if (!paymentProcessed) setShowRefreshAppSpinner(false);
  }

  // process 'routing"
  useLayoutEffect(() => {
    if (tabKey === 'pol-donation')
      setShowRefreshAppSpinner((s) => {
        return (s = false);
      });
    else if (tabKey !== 'tips') {
      return;
    } else if (paymentProcessed) setTabKey('support');
  }, [tabKey, paymentProcessed, setTabKey]);

  // responsive screens hook
  const isDesktop = useMediaQuery({
      query: '((min-width: 900px) and (orientation: landscape))',
    }),
    isMobile = useMediaQuery({
      query: '((max-width: 599px) and (orientation: portrait))',
    });
  // mobile form path control
  const route = useRoute(),
    FORM_PATHS = ['Sign Up', 'Sign In'],
    // custom hook
    [formPath, { setFormPath, swapFormPath, resetFormPath }] =
      useFormPaths(isDesktop, FORM_PATHS),
    [userEntryForm, setUserEntryForm] = useState<UserEntryForm>(
      init.credentials
    ),
    // user entry feedback displayed on top of submit button for various forms
    [userEntryError, { swapToError, swapToButton }] =
      useButtonErrorSwapper(),
    controlMobileEntryFormBackNavigation = useCallback(() => {
      const endOfHistory = ((window as Window).onpopstate = (
        e: PopStateEvent
      ) => {
        if (!e || typeof e.currentTarget === 'undefined') {
          return;
        } else if (!e.currentTarget) {
          return;
        } else if (!(e.currentTarget as any).navigation) {
          return;
        } else if (!(e.currentTarget as any).navigation.canGoForward) {
          return;
        } else if (e.state.idx) {
          session.back(e.state.idx);
        }
      });
      const unblock = session.block((update) => {
        if (update.route.action === 'pop') {
          if (tabKey === 'pol-donation') {
            if (loggedIn) {
              session.reset({} as SessionOpts);
              unblock();
            } else if (formPath)
              if (formPath.length) {
                route.replace();
                resetFormPath();
                unblock();
              }
            (endOfHistory as () => void)();
          } else if (tabKey === 'payment') {
            // route.replace();
            setTabKey('pol-donation');
            unblock();
          }
        } else if (update.route.action === 'replace') unblock();
      });
      if (formPath.length === 0) unblock();
      else
        clearForm({
          setShowAlert,
          swapToButton,
          setShowOverlay,
          setCheckedTerms,
          setUserEntryForm,
        });
    }, [route, tabKey, formPath, loggedIn, swapToButton, resetFormPath]);

  // browser back button
  useLayoutEffect(() => {
    let ignore = false;
    if (!ignore) controlMobileEntryFormBackNavigation();
    return () => {
      ignore = true;
    };
  }, [controlMobileEntryFormBackNavigation]);

  // redirects from expired or fautly reset password hash-URIs
  const badResetRedirect = useCallback(() => routes.main().replace(), []);

  const [accountActivated, setAccountActivated] = useReducer((state) => {
      return (state = true);
    }, false),
    handleActivateAccount = useCallback(
      async (hash: string) => {
        return await activation(hash, switchToErrorScreen);
      },
      [switchToErrorScreen]
    ),
    [userIsAssumedValid, setUserIsAssumedValid] = useState(true); // prereq for reset pw etc;

  const activateAccount = useCallback(
    async (ignore: boolean) => {
      if (window.location.href.includes('reset')) return;
      const matchObj = regexMatchURI('signup');
      if (matchObj === null) return;
      else {
        const activated = await handleActivateAccount(matchObj[0]);
        if (!activated.data.isHashConfirmed) setUserIsAssumedValid(false);
        else if (
          !ignore &&
          activated.data.isHashConfirmed &&
          !showAlert.delete
        )
          setAccountActivated();
      }
    },
    [showAlert.delete, handleActivateAccount]
  );

  // checks for signup link activation
  useEffect(() => {
    let ignore = false;
    activateAccount(ignore);
    return () => {
      ignore = true;
      badResetRedirect();
    };
  }, [activateAccount, badResetRedirect]);

  const [
    loggingIn,
    { start: startLoggingInSpinner, stop: stopLoggingInSpinner },
  ] = useSpinner();

  // no bad state
  const setters = useMemo(() => {
      return {
        login,
        signup,
        formPath,
        userData,
        setTabKey,
        loggingIn,
        setDonation,
        setLoggedIn,
        setSettings,
        swapToError,
        setUserData,
        setShowAlert,
        setShowModal,
        swapToButton,
        userEntryForm,
        resetFormPath,
        setSelectedPol,
        setShowOverlay,
        setShowSideNav,
        setCheckedTerms,
        setUserEntryForm,
        setAccountActivated,
        sessionStorageNames,
        switchToErrorScreen,
        setUserFormValidated,
        stopLoggingInSpinner,
        startLoggingInSpinner,
      };
    }, [
      startLoggingInSpinner,
      stopLoggingInSpinner,
      sessionStorageNames,
      switchToErrorScreen,
      userEntryForm,
      resetFormPath,
      swapToButton,
      swapToError,
      loggingIn,
      formPath,
      userData,
    ]),
    handlers = useMemo(() => {
      return {
        handleUserEntry: (e: FormEvent) => entry(e, { ...setters }),
        handleDeleteUser: () => deleteUser({ ...setters }),
        handleSettings: ({
          setting,
          value,
        }: {
          setting: string;
          value: boolean;
        }) =>
          (setSettings as Dispatch<SetStateAction<Settings>>)(
            (s: Settings) => ({ ...s, [setting]: value })
          ),
        handleLogOut: (e: KeyboardEvent & MouseEvent) => {
          if (e.type === 'keydown' && e.key !== 'Enter') return;
          else logOut({ ...setters });
        },
        handleUserFormChange: (e: ChangeEvent) =>
          userFormChange(e, { ...setters }),
      };
    }, [setters]);

  const [prevFormPath, setPrevFormPath] = useState(
    formPath.length ? formPath : 'Sign In'
  );
  if (formPath.length && prevFormPath !== formPath) {
    setPrevFormPath(formPath);
    clearForm({ ...setters });
  }

  return (
    <div className='App'>
      <span
        aria-label={APP.BG_ARIA_LABEL}
        className={'background-image'}
        role={'img'}
      />
      <Suspense fallback={<></>}>
        <Page
          {...handlers}
          setSettings={setSettings as Dispatch<SetStateAction<Settings>>}
          setRejectedDonationReasons={setRejectedDonationReasons}
          setShowRefreshAppSpinner={setShowRefreshAppSpinner}
          rejectedDonationReasons={rejectedDonationReasons}
          // sessionStoredDonation={sessionStoredDonation}
          setUserIsAssumedValid={setUserIsAssumedValid}
          showRefreshAppSpinner={showRefreshAppSpinner}
          setUserFormValidated={setUserFormValidated}
          sessionStorageNames={sessionStorageNames}
          setPaymentProcessed={setPaymentProcessed}
          switchToErrorScreen={switchToErrorScreen}
          suggestedDonations={suggestedDonations}
          userIsAssumedValid={userIsAssumedValid}
          externalAPIisDown={externalAPIisDown}
          userFormValidated={userFormValidated}
          accountActivated={accountActivated}
          badResetRedirect={badResetRedirect}
          paymentProcessed={paymentProcessed}
          setDonationLimit={setDonationLimit}
          serverConstants={serverConstants}
          setCheckedTerms={setCheckedTerms}
          setPaymentError={setPaymentError}
          setShowClearBtn={setShowClearBtn}
          optionCategory={optionCategory}
          setShowOverlay={setShowOverlay}
          setShowSideNav={setShowSideNav}
          settings={settings as Settings}
          userEntryError={userEntryError}
          donation={donation as number}
          handleOptions={handleOptions}
          setLinksClass={setLinksClass}
          userEntryForm={userEntryForm}
          setActiveKey={setActiveKey}
          checkedTerms={checkedTerms}
          paymentError={paymentError}
          setShowAlert={setShowAlert}
          setShowModal={setShowModal}
          showClearBtn={showClearBtn}
          swapFormPath={swapFormPath}
          swapToButton={swapToButton}
          LEGAL_LIMIT={LEGAL_LIMIT}
          selectedPol={selectedPol}
          setDonation={setDonation}
          setFormPath={setFormPath}
          setLoggedIn={setLoggedIn}
          setUserData={setUserData}
          showOverlay={showOverlay}
          showSideNav={showSideNav}
          appRefresh={appRefresh}
          FORM_PATHS={FORM_PATHS}
          linksClass={linksClass}
          activeKey={activeKey}
          isDesktop={isDesktop}
          loggingIn={loggingIn}
          selectPol={selectPol}
          setTabKey={setTabKey}
          showAlert={showAlert}
          showModal={showModal}
          formPath={formPath}
          isMobile={isMobile}
          loggedIn={loggedIn}
          userData={userData}
          polData={polData}
          setTip={setTip}
          tabKey={tabKey}
          route={route}
          tip={tip}
        />
      </Suspense>
    </div>
  );
};

export default App;
