import React, {
  useLayoutEffect,
  SetStateAction,
  useCallback,
  useEffect,
  Dispatch,
  useState,
} from 'react';
import { useComboboxItems, useParade } from '@Hooks';
import { ComboboxItem, Props } from '@Types';
import { Celebrate, ServerDown } from './screens';
import { AxiosResponse } from 'axios';
import { M4A } from '@CONSTANTS';
import API from '@API';
import {
  Bill,
  UserData,
  RepState,
  HouseMember,
  OptionCategory,
} from '@Interfaces';

const Main = ({
  rejectedDonationReasons,
  sessionStoredDonation,
  showRefreshAppSpinner,
  setTotalCelebrations,
  sessionStorageNames,
  switchToErrorScreen,
  externalAPIisDown,
  setShowClearBtn,
  optionCategory,
  handleOptions,
  setLinksClass,
  setShowAlert,
  selectedPol,
  appRefresh,
  linksClass,
  setTabKey,
  showAlert,
  selectPol,
  loggedIn,
  userData,
  polData,
  tabKey,
  ...props
}: Props) => {
  // pol carousel hook
  const [
    polsOnParade,
    {
      setPolsOnParade,
      searchPolsByName,
      searchPolsByState,
      restorePolsOnParade,
      searchPolsByLocation,
    },
  ] = useParade();

  // selecting/de-selecting pols (?)
  const // [prevSelectedPol, setPrevSelectedPol] = useState(selectedPol),
    // trigged by app reset from end state
    [prevShowRefreshAppSpinner, setPrevShowRefreshAppSpinner] = useState(
      showRefreshAppSpinner
    );
  if (
    // prevSelectedPol !== selectedPol ||
    prevShowRefreshAppSpinner !== showRefreshAppSpinner
  ) {
    // if (prevSelectedPol !== selectedPol) {
    //   setPrevSelectedPol(selectedPol);
    //   if (selectedPol)
    //     if (selectedPol.length)
    //       sessionStorage.setItem(
    //         (sessionStorageNames as SessionStorage).selectedPol,
    //         JSON.stringify(polData)
    //       );
    // }
    if (prevShowRefreshAppSpinner !== showRefreshAppSpinner) {
      setPrevShowRefreshAppSpinner(showRefreshAppSpinner);
      if (appRefresh) setPolsOnParade(polsOnParade.houseMembers);
    }
  }

  useLayoutEffect(() => {
    // if (
    //   !(
    //     sessionStorage.getItem(
    //       (sessionStorageNames as SessionStorage).selectedPol
    //     ) &&
    //     Object.values(polData as PolData).every((v) => v === '') &&
    //     polsOnParade &&
    //     sessionStoredDonation
    //   )
    // ) {
    //   return;
    // } else
    if (!polsOnParade.houseMembers.length) {
      return;
    } else {
      if (String(sessionStoredDonation) === '0')
        (setTabKey as Dispatch<SetStateAction<string>>)('pol-donation');
      // else {
      //   (selectPol as (pol: PolData) => void)(
      //     transformPolData(
      //       polsOnParade.houseMembers.filter(
      //         (pol) =>
      //           pol.id ===
      //           sessionStorage.getItem(
      //             (sessionStorageNames as SessionStorage).selectedPol
      //           )
      //       )[0]
      //     )
      //   );
      // }
    }
  }, [
    sessionStoredDonation,
    sessionStorageNames,
    polsOnParade,
    selectPol,
    setTabKey,
    polData,
  ]);

  //  => combobox option items
  const itemToString = useCallback(
    (item: ComboboxItem | null) => {
      if (!item) return;
      else {
        switch ((optionCategory as OptionCategory).name) {
          case 'NAME':
            if (!(item as HouseMember).last_name) return '';
            else
              return (
                (item as HouseMember).last_name +
                ', ' +
                (item as HouseMember).first_name
              );
          case 'STATE':
            if (!(item as RepState).full) return '';
            else return (item as RepState).full;
          case 'DISTRICT':
            return '';
          default:
            // return '';
            throw new Error();
        }
      }
    },
    [optionCategory]
  );

  // search bar combobox dropdown options
  const [inputItems, { setInputItems, resetSearchBar }] = useComboboxItems(
    itemToString as (item: ComboboxItem | null) => string,
    polsOnParade.houseMembers,
    (optionCategory as OptionCategory).name
  );

  const [bill, setBill] = useState({} as Bill);
  const [cosponsors, setCosponsors] = useState<string[] | []>([]);

  useEffect(() => {
    let ignore = false;
    // hardcoded M4A bill
    API.getBill(M4A)
      .then((res) => {
        if (!ignore) setBill(res.data);
      })
      .then(() => {
        API.getCosponsors(M4A)
          .then((res: AxiosResponse) => {
            const cosponsors = res.data;
            return cosponsors;
          })
          .then((cosponsors: string[]) => {
            if (!ignore) setCosponsors(cosponsors as string[]);
            API.getPolsByIds([])
              .then((res) => {
                const houseMembers = (res as AxiosResponse).data;
                return houseMembers;
              })
              .then((houseMembers) => {
                if (!ignore) {
                  setPolsOnParade(houseMembers);
                }
              });
          });
      })
      .catch((err: Error) =>
        (switchToErrorScreen as (err: Error) => void)(err)
      );
    return () => {
      ignore = true;
    };
  }, [setPolsOnParade, switchToErrorScreen]);

  return (
    (externalAPIisDown && <ServerDown />) || (
      <Celebrate
        {...props}
        cosponsors={cosponsors}
        key={(userData as UserData).id + '-main-page'}
        itemToString={
          itemToString as (item: ComboboxItem | null) => string
        }
        rejectedDonationReasons={rejectedDonationReasons}
        sessionStoredDonation={sessionStoredDonation}
        showRefreshAppSpinner={showRefreshAppSpinner}
        searchPolsByLocation={searchPolsByLocation}
        setTotalCelebrations={setTotalCelebrations}
        restorePolsOnParade={restorePolsOnParade}
        sessionStorageNames={sessionStorageNames}
        switchToErrorScreen={switchToErrorScreen}
        externalAPIisDown={externalAPIisDown}
        searchPolsByState={searchPolsByState}
        searchPolsByName={searchPolsByName}
        setShowClearBtn={setShowClearBtn}
        optionCategory={optionCategory}
        resetSearchBar={resetSearchBar}
        handleOptions={handleOptions}
        setInputItems={setInputItems}
        setLinksClass={setLinksClass}
        polsOnParade={polsOnParade}
        setShowAlert={setShowAlert}
        selectedPol={selectedPol}
        appRefresh={appRefresh}
        inputItems={inputItems}
        linksClass={linksClass}
        selectPol={selectPol}
        setTabKey={setTabKey}
        showAlert={showAlert}
        loggedIn={loggedIn}
        userData={userData}
        polData={polData}
        tabKey={tabKey}
        bill={bill}
      />
    )
  );
};

export default React.memo(Main);
