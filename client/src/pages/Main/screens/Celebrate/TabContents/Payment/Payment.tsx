import React, { Dispatch, SetStateAction, useEffect } from 'react';
import { Props, PaymentProps } from '@Types';
import { CheckoutCard } from '@Components/displays';
import { ShowModal, UserData } from 'interfaces';
import Col from 'react-bootstrap/esm/Col';
import Row from 'react-bootstrap/esm/Row';
import { ObjectId } from 'mongodb';
import API from '@API';
import './style.css';

const Payment = ({
  switchToErrorScreen,
  setShowModal,
  userData,
  tabKey,
  ...props
}: Props & PaymentProps) => {
  // checks database if user has already agreed to Eligibility rules
  useEffect(() => {
    if (tabKey !== 'payment' || !userData) {
      return;
    }
    let ignore = false;
    API.checkPrivilege((userData as UserData).id as ObjectId)
      .then((res) => {
        const data = res.data;
        return data;
      })
      .then((data) => {
        if (data === false && !ignore)
          (setShowModal as Dispatch<SetStateAction<ShowModal>>)((s) => ({
            ...s,
            eligibility: true,
          }));
      })
      .catch((err) => (switchToErrorScreen as (err: Error) => void)(err));
    return () => {
      ignore = true;
    };
  }, [tabKey, userData, setShowModal, switchToErrorScreen]);

  return (
    <Row className='payment pt-lg-3'>
      <Col className='payment'>
        <CheckoutCard
          key={(userData as UserData).id + 'checkout-card'}
          switchToErrorScreen={switchToErrorScreen}
          setShowModal={setShowModal}
          userData={userData}
          tabKey={tabKey}
          {...props}
        />
      </Col>
    </Row>
  );
};

export default React.memo(Payment);
