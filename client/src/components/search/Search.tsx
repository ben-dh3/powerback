import React from 'react';
import FormCheckInput from 'react-bootstrap/esm/FormCheckInput';
import { LinkGroup } from '@Components/interactive';
import Col from 'react-bootstrap/esm/Col';
import Row from 'react-bootstrap/esm/Row';
import { Props } from '@Types';
import './style.css';
import Stack from 'react-bootstrap/esm/Stack';
import FormCheckLabel from 'react-bootstrap/esm/FormCheckLabel';

const PolCombobox = React.lazy(() => import('./PolCombobox'));

const Search = ({
  handleCosponsors,
  showCosponsors,
  isDesktop,
  isMobile,
  ...props
}: Props) => (
  <>
    <Row className='pol-search-options'>
      <Col xs={5} lg={2} className='section-title'>
        {(isMobile && (
          <Stack direction='horizontal' gap={2}>
            <FormCheckInput
              type={'checkbox'}
              id={'show-cosponsors'}
              onChange={handleCosponsors}
            />
            <FormCheckLabel htmlFor='show-cosponsors'>
              {showCosponsors ? 'COSPONSORS ONLY' : 'HOUSE MEMBERS'}
            </FormCheckLabel>
          </Stack>
        )) || <>HOUSE MEMBERS</>}
      </Col>

      <Col xs={3} lg={5}>
        <LinkGroup isDesktop={isDesktop} isMobile={isMobile} {...props} />
      </Col>
    </Row>

    <Row className='pols-input-row pt-lg-2'>
      <Col>
        <PolCombobox
          handleCosponsors={handleCosponsors}
          isDesktop={isDesktop}
          isMobile={isMobile}
          {...props}
        />
      </Col>
    </Row>
  </>
);

export default React.memo(Search);
