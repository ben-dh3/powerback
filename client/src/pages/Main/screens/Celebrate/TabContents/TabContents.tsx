import React, { Suspense, useState } from 'react';
import DesignCelebration from './DesignCelebration';
import { Elements } from '@stripe/react-stripe-js';
import { TabFlow } from '@Components/page/navs';
import { loadStripe } from '@stripe/stripe-js';
import Col from 'react-bootstrap/esm/Col';
import Row from 'react-bootstrap/esm/Row';
import Tab from 'react-bootstrap/esm/Tab';
import { Props } from '@Types';
import './style.css';

const TipAsk = React.lazy(() => import('./TipAsk')),
  Payment = React.lazy(() => import('./Payment')),
  Support = React.lazy(() => import('./Support'));

const TabContents = ({
  paymentProcessed,
  LEGAL_LIMIT,
  userData,
  polData,
  tabKey,
  ...props
}: Props) => {
  const [donorId, setDonorId] = useState<string | {}>({});

  const [stripePromise] = useState(
    loadStripe(
      'pk_live_51IeaXZEDB3wZVeArF4NCAUqSMQRAS8Ap4tQkBbXl3CGMMTaG2i2Etfu0B1A7mda4s5y3tsqJrqNOuaUqnaedrECu00svcKq5mm'
    )
  );

  return (
    <Row className='flex-column'>
      <Col hidden={tabKey === 'pol-donation' || tabKey === 'support'}>
        <TabFlow {...props} tabKey={tabKey} />
      </Col>
      <Col>
        <Tab.Content id='donate-pg-tab-content'>
          <Tab.Pane
            unmountOnExit={paymentProcessed}
            eventKey={'pol-donation'}>
            <DesignCelebration
              userData={userData}
              polData={polData}
              {...props}
            />
          </Tab.Pane>

          <Suspense fallback={<></>}>
            <Tab.Pane eventKey='payment'>
              <Payment
                paymentProcessed={paymentProcessed}
                setDonorId={setDonorId}
                stripe={stripePromise}
                userData={userData}
                polData={polData}
                tabKey={tabKey}
                {...props}
              />
            </Tab.Pane>

            <Tab.Pane eventKey='tips'>
              <Elements stripe={stripePromise}>
                <Row className='payment'>
                  <Col className='payment'>
                    <TipAsk
                      {...props}
                      paymentProcessed={paymentProcessed}
                      userData={userData}
                      polData={polData}
                      donorId={donorId}
                    />
                  </Col>
                </Row>
              </Elements>
            </Tab.Pane>
            <Tab.Pane eventKey='support'>
              <Row className='support'>
                <Col className='support'>
                  <Support {...props} userData={userData} />
                </Col>
              </Row>
            </Tab.Pane>
          </Suspense>
        </Tab.Content>
      </Col>
    </Row>
  );
};

export default React.memo(TabContents);
