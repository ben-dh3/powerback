import React, { useCallback, useMemo } from 'react';
import { InfoTooltip } from '@Components/modals';
import { PolName } from '@Components/displays';
import Badge from 'react-bootstrap/esm/Badge';
import Stack from 'react-bootstrap/esm/Stack';
import accounting from 'accounting';
import './style.css';

interface Names {
  hasMiddleName: boolean;
  fil: string;
  iml: string;
  iil: string;
  il: string;
}

type Props = {
  middleName: string;
  donations: number;
  firstName: string;
  isMobile: boolean;
  lastName: string;
  tally: number;
  id: string;
};

const EscrowDisplay = ({
  middleName,
  donations,
  firstName,
  isMobile,
  lastName,
  tally,
  id,
}: Props) => {
  // would be cleaner as a custom hook?
  const fullName = useMemo(() => {
      return firstName + ' ' + middleName + ' ' + lastName;
    }, [firstName, middleName, lastName]),
    names = useMemo(() => {
      return {
        hasMiddleName: !!middleName.length,
        // a progression of how names should be displayed
        fil:
          firstName + ' ' + middleName.substring(0, 1) + '. ' + lastName, // First M. Last
        iml:
          firstName.substring(0, 1) + '. ' + middleName + ' ' + lastName, // F. Middle Last
        iil:
          firstName.substring(0, 1) +
          '. ' +
          middleName.substring(0, 1) +
          '. ' +
          lastName, // F. M. Last
        il: firstName.substring(0, 1) + '. ' + lastName, // F. Last
      };
    }, [firstName, middleName, lastName]);

  const doesFit = useCallback(
    (type: keyof Names) => {
      return (names[type] as string).length <= 21;
    },
    [names]
  );

  const abbreviatedName = useMemo(() => {
    return fullName.length <= 21
      ? fullName
      : names.hasMiddleName
      ? doesFit('fil')
        ? names.fil
        : doesFit('iml')
        ? names.iml
        : doesFit('iil')
        ? names.iil
        : doesFit('il')
      : names.il;
  }, [names, fullName, doesFit]);

  const setYPosition = useMemo(() => {
      return (
        (-0.75 -
          0.0424 * (abbreviatedName as string).length +
          0.00261 * (abbreviatedName as string).length ** 2) *
          (isMobile ? 3 : 1) +
        'vw'
      );
    }, [isMobile, abbreviatedName]),
    setXPosition = useMemo(() => {
      return (
        10 *
          (1 / (abbreviatedName as string).length) *
          (isMobile ? 1 : 0.33) +
        'vw'
      );
    }, [isMobile, abbreviatedName]);

  return (
    <Stack
      direction={'horizontal'}
      className={'escrow-display'}
      style={donations > 0 ? { marginLeft: setYPosition } : {}}
      gap={0}>
      {donations > 0 ? (
        <Badge
          className={'escrow-badge'}
          style={donations > 0 ? { marginRight: setXPosition } : {}}>
          <InfoTooltip
            message={
              <>
                <span className={'donation-popper'}>
                  {accounting.formatMoney(donations)}
                </span>
                <span>
                  {' '}
                  total in-waiting for this politician. This total is{' '}
                  <span className='fst-italic'>across the userbase.</span>
                </span>

                <br />
                <span>Total celebrations: {tally}</span>
                <br />
                <span>
                  Average celebration:{' '}
                  {accounting.formatMoney(donations / tally)}
                </span>
              </>
            }
            toolTipId={id + '-donations-tooltip'}
            icon={'currency-dollar'}
            infoPlacement={'auto'}
            showToolTips={true}
          />
        </Badge>
      ) : (
        <></>
      )}
      <PolName
        name={abbreviatedName as string}
        cls={'pol-selector'}
        headingSize={4}
      />
    </Stack>
  );
};

export default React.memo(EscrowDisplay);
