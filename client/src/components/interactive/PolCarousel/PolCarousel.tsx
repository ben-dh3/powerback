import React, {
  useTransition,
  useReducer,
  useEffect,
  useMemo,
} from 'react';
import Placeholder from 'react-bootstrap/esm/Placeholder';
import Container from 'react-bootstrap/esm/Container';
import { transformPolData, calcDays } from '@Utils';
import { Props } from '@Types';
import Stack from 'react-bootstrap/esm/Stack';
import { Loading, PolSelection } from '.';
import Row from 'react-bootstrap/esm/Row';
import { PolData, PolsOnParade } from '@Interfaces';
import './style.css';

const PolCarousel = ({
  showCosponsors,
  polsOnParade,
  cosponsors,
  isMobile,
  polData,
  ...props
}: Props) => {
  const [polsAreLoaded, setPolsAreLoaded] = useReducer((state) => {
    return (state = true);
  }, false);

  const [isLoading, startLoading] = useTransition();

  // carousel items after user manipulation
  const applied = useMemo(() => {
    return !polsOnParade ? [] : polsOnParade.applied;
  }, [polsOnParade]);

  useEffect(() => {
    let ignore = false;
    if (!ignore && !polsAreLoaded && applied)
      startLoading(() => {
        if (applied.length) setPolsAreLoaded();
      });
    return () => {
      ignore = true;
    };
  }, [polsAreLoaded, applied]);

  const handleCenteringPolSelection = useMemo(() => {
    if (!polsAreLoaded) return;
    // turn this into a switch activity for different screen sizes
    else if (applied.length < 8 && applied.length > 3) {
      return 'pol-row short';
    } else if (applied.length === 3) {
      return 'pol-row three';
    } else if (applied.length === 2) {
      return 'pol-row two';
    } else if (applied.length === 1) {
      return 'pol-row one';
    } else return 'pol-row';
  }, [polsAreLoaded, applied]);

  const filteredByCosponsorship = useMemo(() => {
    return (polsOnParade as PolsOnParade).applied.filter((pol) =>
      (cosponsors as string[]).length && (showCosponsors as boolean)
        ? (cosponsors as string[]).includes(pol.member_id)
        : pol
    );
  }, [cosponsors, polsOnParade, showCosponsors]);

  return (
    <Container id={'pol-carousel'} className={'pol-carousel'}>
      {isLoading || (!polsAreLoaded && !handleCenteringPolSelection) ? (
        <>
          <Placeholder
            as={Container}
            animation={'wave'}
            className={'pol-carousel-placeholder'}>
            <Placeholder
              className={'pol-row-placeholder'}
              animation={'wave'}
              as={Row}>
              <Loading />
            </Placeholder>
          </Placeholder>
        </>
      ) : (
        <Row
          className={'pol-carousel ' + handleCenteringPolSelection}
          style={
            filteredByCosponsorship.length < 9 && !isMobile
              ? { justifyContent: 'center' }
              : {}
          }>
          {polsOnParade &&
            filteredByCosponsorship.map((choice) => (
              <Stack
                key={choice.id}
                direction={'horizontal'}
                className={'pol-w-card'}>
                <PolSelection
                  {...props}
                  {...choice}
                  id={choice.id}
                  polData={polData}
                  isMobile={isMobile}
                  lastName={choice.last_name}
                  polsOnParade={polsOnParade}
                  firstName={choice.first_name}
                  state={choice.roles[0].state}
                  info={transformPolData(choice)}
                  description={polData as PolData}
                  twitter={choice.twitter_account}
                  rank={choice.roles[0].state_rank}
                  chamber={choice.roles[0].chamber}
                  district={choice.roles[0].district}
                  middleName={choice.middle_name ?? ''}
                  FEC_id={choice.roles[0].fec_candidate_id}
                  end_date={calcDays(choice.roles[0].end_date)}
                  start_date={calcDays(choice.roles[0].start_date)}
                  name={choice.first_name + ' ' + choice.last_name}
                  key={'pol-selection-card-' + choice.id}
                />
              </Stack>
            ))}
        </Row>
      )}
    </Container>
  );
};

export default React.memo(PolCarousel);
