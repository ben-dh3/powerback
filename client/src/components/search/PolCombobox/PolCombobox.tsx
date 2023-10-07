import React, {
  KeyboardEventHandler,
  MouseEventHandler,
  SetStateAction,
  useCallback,
  Dispatch,
  useState,
  useMemo,
} from 'react';
import { HouseMember, OptionCategory, RepState } from '@Interfaces';
import FormCheckInput from 'react-bootstrap/esm/FormCheckInput';
import { UseComboboxStateChange, useCombobox } from 'downshift';
import { ComboboxItem, Props, UserEvent } from '@Types';
import InputGroup from 'react-bootstrap/esm/InputGroup';
import Spinner from 'react-bootstrap/esm/Spinner';
import Form from 'react-bootstrap/esm/Form';
import { DROPDOWN } from './tuples';
import API from '@API';
import './style.css';
import InputGroupText from 'react-bootstrap/esm/InputGroupText';
import FormCheckLabel from 'react-bootstrap/esm/FormCheckLabel';

const PolCombobox = ({
  searchPolsByLocation,
  restorePolsOnParade,
  searchPolsByState,
  handleCosponsors,
  searchPolsByName,
  setShowClearBtn,
  optionCategory,
  setInputItems,
  itemToString,
  showClearBtn,
  inputItems,
  isDesktop,
}: Props) => {
  const [selectedItem] = useState(null),
    [isFinding, setIsFinding] = useState(false);

  const handleInputValueChange: (
    changes: UseComboboxStateChange<ComboboxItem>
  ) => void = useCallback(
    ({ inputValue }) => {
      if (inputValue === '') (restorePolsOnParade as () => void)();
      else
        (setInputItems as (value: ComboboxItem[]) => void)(
          inputValue as unknown as ComboboxItem[]
        );
      (setShowClearBtn as Dispatch<SetStateAction<string>>)(
        inputValue ? inputValue : ''
      );
    },
    [setInputItems, setShowClearBtn, restorePolsOnParade]
  );

  const handleSelectedItemChange: (
      changes: UseComboboxStateChange<ComboboxItem>
    ) => void = useCallback(
      ({ selectedItem }) => {
        if ((optionCategory as OptionCategory).name === 'NAME')
          (searchPolsByName as (selectedItem: HouseMember) => void)(
            selectedItem as HouseMember
          );
        else if ((optionCategory as OptionCategory).name === 'STATE')
          (searchPolsByState as (selectedItem: RepState) => void)(
            selectedItem as RepState
          );
      },
      [searchPolsByName, searchPolsByState, optionCategory]
    ),
    {
      isOpen,
      getItemProps,
      getMenuProps,
      getInputProps,
      getLabelProps,
      highlightedIndex,
    } = useCombobox({
      itemToString,
      selectedItem,
      items: inputItems as ComboboxItem[],
      onInputValueChange: handleInputValueChange,
      onSelectedItemChange: handleSelectedItemChange as (
        changes: UseComboboxStateChange<ComboboxItem>
      ) => void,
    });

  const searchOptionIsNotLocation = useMemo(() => {
    return (optionCategory as OptionCategory).name !== 'DISTRICT';
  }, [optionCategory]);

  const handlePlaceholder = useMemo(() => {
    return searchOptionIsNotLocation
      ? isDesktop
        ? ''
        : (optionCategory as OptionCategory).label
      : isDesktop
      ? 'Type address+/zipcode then click "Find" or press ENTER.'
      : 'Search by zipcode.';
  }, [isDesktop, searchOptionIsNotLocation, optionCategory]);

  const [previousLocation, setPreviousLocation] = useState({
    address: '',
    ocd_id: '',
  });

  const handleSearchByLocation = useCallback(
    (e: UserEvent) => {
      if (e.type === 'keydown' && e.key !== 'Enter') {
        return;
      } else {
        let addressInput = (
          (e.target as HTMLSpanElement).previousSibling as HTMLInputElement
        ).value as string;
        if (addressInput.length < 5) {
          alert(
            'Please try again with a complete 5-digit ZIP code in your query.'
          );
          return;
        } else if (
          previousLocation.address !== '' &&
          previousLocation.address === addressInput
        )
          (searchPolsByLocation as (ocd_id: string) => void)(
            previousLocation.ocd_id
          );
        else {
          let ignore = false;
          setIsFinding(true);
          API.getPolsByLocation(addressInput)
            .then((res) => {
              const ocd_id = res.data;
              return ocd_id;
            })
            .then((ocd_id) => {
              if (!ignore)
                setPreviousLocation((loc) => ({
                  ...loc,
                  ocd_id: ocd_id,
                  address: addressInput,
                }));
              (searchPolsByLocation as (ocd_id: string) => void)(ocd_id);
              setIsFinding(false);
            })
            .catch(() => {
              setIsFinding(false);
              alert(
                'District not found. Please try again with more information.'
              );
            });
          return () => {
            ignore = true;
          };
        }
      }
    },
    [setIsFinding, previousLocation, searchPolsByLocation]
  );

  return (
    <div className='dropdown-combobox'>
      <InputGroup>
        {isDesktop && (
          <Form.Label className='pol-search-label' {...getLabelProps()}>
            {(optionCategory as OptionCategory).label}
          </Form.Label>
        )}
        <InputGroup.Text>
          <i className='bi bi-search' />
        </InputGroup.Text>

        <Form.Control
          {...getInputProps()}
          aria-label={'politician search bar'}
          placeholder={handlePlaceholder}
          aria-autocomplete={'none'}
          className={'pol-search'}
          value={showClearBtn}
          type={'search'}
        />
        {isFinding ? (
          <>
            <InputGroup.Text className='find-location--btn'>
              <Spinner
                className={'pol-combobox-spinner'}
                animation={'border'}
                role={'status'}>
                <span className='visually-hidden'>
                  Finding local rep(s)...
                </span>
              </Spinner>
            </InputGroup.Text>
          </>
        ) : (
          <InputGroup.Text
            tabIndex={0}
            aria-label={'submit location'}
            className={'find-location--btn'}
            onClick={
              handleSearchByLocation as unknown as MouseEventHandler<HTMLSpanElement>
            }
            onKeyDown={
              handleSearchByLocation as unknown as KeyboardEventHandler<HTMLSpanElement>
            }
            hidden={searchOptionIsNotLocation}>
            Find
          </InputGroup.Text>
        )}
        {isDesktop && (
          <InputGroupText className='checkbox-label'>
            <FormCheckInput
              type={'checkbox'}
              id={'show-cosponsors-lg'}
              onChange={handleCosponsors}
            />
            <FormCheckLabel htmlFor='show-cosponsors-lg'>
              &nbsp;Cosponsors Only
            </FormCheckLabel>
          </InputGroupText>
        )}
      </InputGroup>

      <ul {...getMenuProps()}>
        {isOpen &&
          inputItems &&
          showClearBtn !== '' &&
          inputItems.map((item, index) => (
            <li
              style={
                highlightedIndex !== index
                  ? index % 2 === 0
                    ? DROPDOWN.ODD
                    : DROPDOWN.EVEN
                  : DROPDOWN.SELECTED
              }
              key={`${item}${index}`}
              {...getItemProps({ item, index })}>
              {(itemToString as (item: ComboboxItem | null) => string)(
                item
              )}
            </li>
          ))}
      </ul>
    </div>
  );
};

export default React.memo(PolCombobox);
