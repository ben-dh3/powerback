import React, {
  MutableRefObject,
  SetStateAction,
  useCallback,
  Dispatch,
} from 'react';
import {
  ControlCategory,
  ContactInfo,
  ShowAlert,
  UserData,
} from '@Interfaces';
import { FieldControl, Props } from '@Types';
import Spinner from 'react-bootstrap/esm/Spinner';
import FieldList from '../sidenav/FieldList';
import { ProfileForm, CONTROLS } from '..';
import Col from 'react-bootstrap/esm/Col';
import Row from 'react-bootstrap/esm/Row';
import Tab from 'react-bootstrap/esm/Tab';
import Compliance from '../Compliance';
import './style.css';

type FieldGroupProps = {
  fieldList: FieldControl[]; // swap this with FieldControl? or just reconcile them somehow
  setFieldList: () => void;
};

type ProfilePaneProps = {
  setShowAlert: Dispatch<SetStateAction<ShowAlert>>;
  setActiveTab: Dispatch<SetStateAction<string>>;
  handleAccountUpdate: () => void;
  contactInfo?: ContactInfo;
  updating?: boolean;
  activeTab: string;
  isMobile: boolean;
  user: UserData;
};

const ProfileSubPane = ({
  setActiveTab,
  setFieldList,
  contactInfo,
  getFieldMap,
  activeTab,
  fieldList,
  isMobile,
  updating,
  user,
  ...props
}: Props & ProfilePaneProps & FieldGroupProps) => {
  const handleActiveTab = useCallback(
    (formGroup: ControlCategory) => {
      return formGroup.eventKey === activeTab;
    },
    [activeTab]
  );

  return (
    <Tab.Content className='p-2 pt-2 pt-lg-0'>
      {!isMobile && (
        <Compliance user={user} isMobile={isMobile} {...props} />
      )}
      {CONTROLS.map((formGroup) => (
        <Tab.Pane
          key={formGroup.key}
          unmountOnExit={true}
          eventKey={formGroup.eventKey}
          active={handleActiveTab(formGroup)}>
          {updating ? (
            <Row>
              <Col lg={11} className='form-and-fields transition-spinner'>
                <Spinner
                  role={'status'}
                  animation={'border'}
                  className={'account-profile-spinner'}>
                  <span className='visually-hidden'>
                    Updating Profile...
                  </span>
                </Spinner>
              </Col>
            </Row>
          ) : contactInfo ? (
            <div className='form-and-fields'>
              <ProfileForm
                isEmployed={String(Number(contactInfo.isEmployed))}
                key={(user as UserData).id + '-profile-form'}
                contactInfo={contactInfo}
                getFieldMap={getFieldMap as () => MutableRefObject<null>}
                // activeTab={activeTab}
                isMobile={isMobile}
                form={formGroup as unknown as FieldControl[]}
                user={user}
                {...props}
              />
              {isMobile && (
                <FieldList
                  key={
                    'account-modal-profile-sidenav-field-list-' +
                    (user as UserData).id
                  }
                  setActiveTab={setActiveTab}
                  fieldList={fieldList}
                  setFieldList={setFieldList}
                  getFieldMap={getFieldMap as () => MutableRefObject<null>}
                  contactInfo={contactInfo}
                  activeTab={activeTab}
                  isMobile={isMobile}
                  user={user}
                  {...props}
                />
              )}
            </div>
          ) : (
            <>Loading...</>
          )}
        </Tab.Pane>
      ))}
    </Tab.Content>
  );
};

export default React.memo(ProfileSubPane);
