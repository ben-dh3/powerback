import React, {
  useRef,
  useMemo,
  useState,
  useEffect,
  RefObject,
  useCallback,
  useLayoutEffect,
  MutableRefObject,
  StyleHTMLAttributes,
} from 'react';
import { PolsOnParade, PolDonations, PolData, Bill } from '@Interfaces';
import { EscrowDisplay, Subheading, Headshot } from '.';
import Col, { ColProps } from 'react-bootstrap/esm/Col';
import Row, { RowProps } from 'react-bootstrap/esm/Row';
import { handleKeyDown } from '@Utils';
import { Props } from '@Types';
import './style.css';

type PolSelectionProps = {
  description?: PolData;
  middleName?: string;
  firstName: string;
  lastName: string;
  chamber: string;
  info: PolData;
  name: string;
  bill?: Bill;
  id: string;
};

// donee/Pol unit
const PolSelection = ({
  totalCelebrations,
  polsOnParade,
  description,
  selectedPol,
  middleName,
  firstName,
  selectPol,
  lastName,
  isMobile,
  chamber,
  bill,
  info,
  name,
  id,
  ...props
}: Props & PolSelectionProps) => {
  const [polDonationsInEscrow, setPolDonationsInEscrow] = useState(0);
  const [polDonationTally, setPolDonationTally] = useState(0);

  const tallyDonations = useCallback(
    (id: string) => {
      let [polDonations] = (totalCelebrations as PolDonations[]).filter(
        (c) => c.pol_id === id
      );
      if (!polDonations) {
        return;
      } else {
        setPolDonationTally(polDonations.count);
        setPolDonationsInEscrow(polDonations.donation);
      }
    },
    [totalCelebrations]
  );

  useEffect(() => tallyDonations(id), [id, tallyDonations]);

  // ref handles activation of pol selection, scrolling and focus
  const selectedPolRef = useRef<MutableRefObject<null>>();

  const isDifferentPol = useMemo(() => {
    return (
      (id && description && id !== (description as PolData).id) ||
      !id ||
      !description
    );
  }, [id, description]);

  const [selectionClassName, setSelectionClassName] = useState<string>(''); // img border effect
  // keyboard method of choosing pol feeds into Select handler

  const handleSelect = useCallback(() => {
    if (isDifferentPol) (selectPol as (pol: PolData) => void)({ ...info });

    // smooth scrolls pol into center view
    (
      (selectedPolRef as RefObject<MutableRefObject<null>>)
        .current as ColProps
    ).scrollIntoView({
      block: 'nearest',
      inline: 'center', // should be CENTER on mobile?
      behavior: 'instant', // should be SMOOTH on mobile?
    });

    // slap on a border to visually indicate selection
    (
      (
        (selectedPolRef as RefObject<MutableRefObject<null>>)
          .current as ColProps
      ).style as StyleHTMLAttributes<ColProps>
    ).className = 'pol-headshot-selected';
    setSelectionClassName(
      (
        (selectedPolRef as RefObject<MutableRefObject<null>>)
          .current as any
      ).style.className as string
    );
    // for the aforementioned accessibility
    (selectedPolRef as any).current.focus();
  }, [isDifferentPol, selectPol, info]);

  const nail = useMemo(() => {
    return {
      isSingle: (polsOnParade as PolsOnParade).applied.length === 1,
      tabIndex:
        (polsOnParade as PolsOnParade).applied.length === 1 ? -1 : 0,
      styles:
        (polsOnParade as PolsOnParade).applied.length === 1
          ? { height: '357px !important' }
          : {},
    };
  }, [polsOnParade]);

  const polPosition = useMemo(() => {
    return (polsOnParade as PolsOnParade).applied[0];
  }, [polsOnParade]);

  useEffect(() => {
    if (nail.isSingle) handleSelect();
  }, [polPosition, handleSelect, nail.isSingle]);

  // what does this even do anymore?
  useLayoutEffect(() => {
    if (selectedPol)
      (
        document.getElementsByClassName('pol-row') as RowProps
      ).scrollLeft = 0;
  }, [selectedPol, bill]);

  const isExpanded = useMemo(() => {
    return selectedPol !== null;
  }, [selectedPol]);

  return (
    <Col className='pol-wrapper' key={'pol-carousel-selection-' + id}>
      <Row style={nail.styles}>
        <Col
          id={id}
          ref={selectedPolRef}
          onClick={handleSelect}
          tabIndex={nail.tabIndex}
          aria-expanded={isExpanded}
          className={'pol-selection-col'}
          onKeyDown={(e) => handleKeyDown(e, handleSelect)}>
          <EscrowDisplay
            key={id + '-escrow-display-' + polDonationTally}
            donations={polDonationsInEscrow}
            middleName={middleName ?? ''}
            tally={polDonationTally}
            firstName={firstName}
            isMobile={isMobile}
            lastName={lastName}
            id={id}
          />
          <Headshot
            src={id}
            name={name}
            cls={selectionClassName}
            id={description ? (description as PolData).id : ''}
            {...props}
          />
          <Subheading
            totalCelebrations={totalCelebrations}
            polsOnParade={polsOnParade}
            selectedPol={selectedPol}
            selectPol={selectPol}
            isMobile={isMobile}
            bill={bill}
            {...props}
          />
        </Col>
      </Row>
    </Col>
  );
};

export default React.memo(PolSelection);
