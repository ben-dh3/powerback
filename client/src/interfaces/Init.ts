import { LinksClass, OptionCategory, ShowAlert, ShowModal } from './ui';
import { Settings, UserData, UserEntryForm } from './user';
import { PolData } from './pols';

interface ChangePasswordForm {
  confirmNewPassword: string;
  newPassword: string;
  err: string;
}

export interface Init {
  alerts: ShowAlert;
  modals: ShowModal;
  honestPol: PolData;
  userData: UserData;
  overlays: {
    resetPass: boolean;
  };
  defaultSettings: Settings;
  credentials: UserEntryForm;
  optionCategory: OptionCategory;
  activeSearchOption: LinksClass;
  changePasswordForm: ChangePasswordForm;
}
