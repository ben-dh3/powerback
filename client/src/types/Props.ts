import {
  Dispatch,
  FormEvent,
  RefObject,
  ChangeEvent,
  SetStateAction,
  MutableRefObject,
  FormEventHandler,
} from 'react';
import { FormCheckInputProps } from 'react-bootstrap/esm/FormCheckInput';
import { FormControlProps } from 'react-bootstrap/esm/FormControl';
import { routes } from '../../../router';
import { Route } from 'type-route';
import {
  View,
  Celebration,
  ComboboxItem,
  SessionStorage,
  CelebrationRejection,
} from '@Types';
import {
  Bill,
  Payload,
  PolData,
  RepState,
  Settings,
  UserData,
  ShowAlert,
  ShowModal,
  LinksClass,
  ContactInfo,
  HouseMember,
  ShowOverlay,
  UpdatedInfo,
  PolDonations,
  PolsOnParade,
  UserEntryForm,
  OptionCategory,
  ServerConstants,
  ValidatingFields,
} from '@Interfaces';

export type Props = {
  setDonationsEvents?: (action: { type: string; payload: string }) => void;
  handleUpdateUser?: (user: UserData, info: UpdatedInfo) => void;
  setTotalCelebrations?: Dispatch<SetStateAction<PolDonations>>;
  setOptionCategory?: Dispatch<SetStateAction<OptionCategory>>;
  setSecureUserPassFeedback?: Dispatch<SetStateAction<string>>;
  setShowRefreshAppSpinner?: Dispatch<SetStateAction<boolean>>;
  setUserEntryForm?: Dispatch<SetStateAction<UserEntryForm>>;
  validateField?: (e: ChangeEvent<HTMLInputElement>) => void;
  setUserIsAssumedValid?: Dispatch<SetStateAction<boolean>>;
  setUserFormValidated?: Dispatch<SetStateAction<boolean>>;
  setAccountActivated?: Dispatch<SetStateAction<boolean>>;
  setPaymentProcessed?: Dispatch<SetStateAction<boolean>>;
  setPolsOnParade?: (houseMembers: string[]) => void;
  searchPolsByName?: (selectedItem: HouseMember) => void;
  setActiveProfileTab?: Dispatch<SetStateAction<string>>;
  handleLogOut?: (e: KeyboardEvent & MouseEvent) => void;
  setShowOverlay?: Dispatch<SetStateAction<ShowOverlay>>;
  onChange?: (
    e: FormEvent<FormCheckInputProps & FormControlProps>
  ) => void;
  setShowCosponsors?: Dispatch<SetStateAction<boolean>>;
  itemToString?: (item: ComboboxItem | null) => string;
  searchPolsByState?: (selectedItem: RepState) => void;
  setLinksClass?: Dispatch<SetStateAction<LinksClass>>;
  handleUserEntry?: FormEventHandler<HTMLFormElement>;
  setCheckedTerms?: Dispatch<SetStateAction<boolean>>;
  setContactInfo?: ({ name, value }: Payload) => void;
  handleOptions?: (
    e: {
      target: { textContent: string; value: string };
    } & MouseEvent &
      KeyboardEvent
  ) => void;
  setModalMessage?: Dispatch<SetStateAction<string>>;
  setShowClearBtn?: Dispatch<SetStateAction<string>>;
  setShowModal?: Dispatch<SetStateAction<ShowModal>>;
  setShowSideNav?: Dispatch<SetStateAction<boolean>>;
  setShowAlert: Dispatch<SetStateAction<ShowAlert>>;
  setOverlayTarget?: Dispatch<SetStateAction<null>>;
  setPaymentError?: Dispatch<SetStateAction<Error>>;
  setSettings?: Dispatch<SetStateAction<Settings>>;
  setUserData?: Dispatch<SetStateAction<UserData>>;
  handleUserFormChange?: (e: ChangeEvent) => void;
  searchPolsByLocation?: (ocd_id: string) => void;
  setActiveKey?: Dispatch<SetStateAction<string>>;
  setInputItems?: (value: ComboboxItem[]) => void;
  setLoggedIn?: Dispatch<SetStateAction<boolean>>;
  setDonation?: Dispatch<SetStateAction<Number>>;
  rejectedDonationReasons?: CelebrationRejection;
  showSecurityTheater?: (type: string) => void;
  setTabKey?: Dispatch<SetStateAction<string>>;
  handleCosponsors?: (e: ChangeEvent) => void;
  getFieldMap?: () => MutableRefObject<null>;
  sessionStoredDonation?: number | undefined;
  switchToErrorScreen?: (err: Error) => void;
  textInputRef?: RefObject<HTMLInputElement>;
  setTip?: Dispatch<SetStateAction<number>>;
  handleChange?: (e: ChangeEvent) => void;
  setFormPath?: (action: string) => void;
  totalCelebrations?: PolDonations | [];
  setRejectedDonationReasons?: Dispatch<
    SetStateAction<CelebrationRejection>
  >;
  sessionStorageNames?: SessionStorage;
  selectPol?: (pol: PolData) => void;
  serverConstants?: ServerConstants;
  closeSecurityCurtain?: () => void;
  handleAccountUpdate?: () => void;
  restorePolsOnParade?: () => void;
  optionCategory?: OptionCategory;
  secureUserPassFeedback?: string;
  showRefreshAppSpinner?: boolean;
  userEntryForm?: UserEntryForm;
  badResetRedirect?: () => void;
  handleDeleteUser?: () => void;
  isPendingValidation?: boolean;
  setDonationLimit?: () => void;
  suggestedDonations?: number[];
  celebrations?: Celebration[];
  isInvalid?: ValidatingFields;
  resetValidation?: () => void;
  route?: Route<typeof routes>;
  refreshAppState?: () => void;
  userIsAssumedValid?: boolean;
  externalAPIisDown?: boolean;
  inputItems?: ComboboxItem[];
  polsOnParade?: PolsOnParade;
  resetSearchBar?: () => void;
  userFormValidated?: boolean;
  accountActivated?: boolean;
  paymentProcessed?: boolean;
  securityTheater?: {
    changePassword: boolean;
    deleteAccount: boolean;
  };
  swapFormPath?: () => void;
  swapToButton?: () => void;
  activeProfileTab?: string;
  contactInfo?: ContactInfo;
  showOverlay?: ShowOverlay;
  formCompliance?: boolean;
  showCosponsors?: boolean;
  handleClick?: () => void;
  formIsInvalid?: boolean;
  isShortMobile?: boolean;
  linksClass?: LinksClass;
  twitter?: string | null;
  checkedTerms?: boolean;
  formPath?: string | [];
  getEscrow?: () => void;
  LEGAL_LIMIT?: number[];
  cosponsors?: string[];
  donorId?: string | {};
  FORM_PATHS?: string[];
  showAlert?: ShowAlert;
  showClearBtn?: string;
  showModal?: ShowModal;
  showSideNav?: boolean;
  appRefresh?: boolean;
  hasDonated?: boolean;
  paymentError?: Error;
  pols?: HouseMember[];
  selectedPol?: string;
  setIntl?: () => void;
  userEntryError?: {
    showError: boolean;
    view: View;
  };
  isDesktop?: boolean;
  loggingIn?: boolean;
  settings?: Settings;
  start_date?: number;
  userData?: UserData;
  activeKey?: string;
  loggedIn?: boolean;
  updating?: boolean;
  donation?: number;
  district?: string;
  end_date?: number;
  isMobile: boolean;
  polData?: PolData;
  chamber?: string;
  BTNS?: string[];
  FEC_id?: string;
  isTip?: boolean;
  pValue?: string;
  tabKey?: string;
  uValue?: string;
  user?: UserData;
  info?: PolData;
  state?: string;
  name?: string;
  rank?: string;
  tip?: number;
  bill?: Bill;
};
