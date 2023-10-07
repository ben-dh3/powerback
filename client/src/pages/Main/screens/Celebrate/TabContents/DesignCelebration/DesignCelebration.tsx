import React, {
  ChangeEvent,
  Suspense,
  useCallback,
  useState,
} from 'react';
import Placeholder from 'react-bootstrap/esm/Placeholder';
import { PolCarousel } from '@Components/interactive';
import DonationSection from './DonationSection';
import { Search } from '@Components/search';
import Col from 'react-bootstrap/esm/Col';
import Row from 'react-bootstrap/esm/Row';
import { Props } from '@Types';
import './style.css';

const DesignCelebration = ({ ...props }: Props) => {
  const [showCosponsors, setShowCosponsors] = useState(false);
  const handleCosponsors = useCallback(
    (e: ChangeEvent) =>
      setShowCosponsors((e.target as HTMLInputElement).checked),

    []
  );
  return (
    <div className='design-celebration'>
      <Row>
        <Col className='celebration-top third'>
          <Suspense
            fallback={
              <Placeholder
                className={'selector-bar'}
                animation={'wave'}
                as={Col}
                lg={5}
              />
            }>
            <Row className='selector-bar'>
              <Col id='choose-pols' lg={5}>
                <Search
                  handleCosponsors={handleCosponsors}
                  showCosponsors={showCosponsors}
                  {...props}
                />
              </Col>
            </Row>
          </Suspense>
        </Col>
      </Row>
      <Row>
        <Col className='celebration-middle third'>
          <PolCarousel showCosponsors={showCosponsors} {...props} />
        </Col>
      </Row>
      <Row>
        <Col className='celebration-bottom third pt-lg-1'>
          <DonationSection {...props} />
        </Col>
      </Row>
    </div>
  );
};

export default React.memo(DesignCelebration);
