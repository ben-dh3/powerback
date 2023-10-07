import React, { Dispatch, SetStateAction, useCallback } from 'react';
import { StyledModal } from '@Components/modals';
import { AgreeBtn } from '@Components/buttons';
import { Props } from '@Types';
import { ShowModal } from '@Interfaces';
import { TERMS } from './tuples';
import './style.css';

const TermsModal = ({
  showModal,
  setShowModal,
  setCheckedTerms,
}: Props) => {
  const handleClick = useCallback(() => {
    (setShowModal as Dispatch<SetStateAction<ShowModal>>)((s) => ({
      ...s,
      terms: false,
    }));
    (setCheckedTerms as Dispatch<SetStateAction<boolean>>)(true);
  }, [setShowModal, setCheckedTerms]);
  return (
    <StyledModal
      tabIdx={1}
      type={'terms'}
      backdrop={true}
      closeButton={true}
      showModal={showModal as ShowModal}
      setShowModal={setShowModal as Dispatch<SetStateAction<ShowModal>>}
      heading={<span className={'display-5'}>Terms and Conditions</span>}
      body={
        <ul>
          {TERMS.map((term) => {
            return (
              <li
                className={'pb-3'}
                key={'terms-of-service-' + term.section}>
                <span className='display-6'>{term.section}</span>
                <p>{term.term}</p>
              </li>
            );
          })}
        </ul>
      }
      footer={<AgreeBtn handleClick={handleClick} />}
    />
  );
};

export default React.memo(TermsModal);
