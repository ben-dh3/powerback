import React, { useEffect, useState, useMemo } from 'react';
import { VerticalTimelineElement } from 'react-vertical-timeline-component';
import { Icon, Title, ButtonSet, Subtitle } from './subcomps';
import 'react-vertical-timeline-component/style.min.css';
import advancedFormat from 'dayjs/plugin/advancedFormat';
import relativeTime from 'dayjs/plugin/relativeTime';
import EventPlaceholder from '../../Placeholder';
import { HouseMember, Bill } from '@Interfaces';
import Image from 'react-bootstrap/esm/Image';
import Logo from '@Images/logo/cable-nav.png';
import Stack from 'react-bootstrap/esm/Stack';
import { Celebration, Props } from '@Types';
import Col from 'react-bootstrap/esm/Col';
import Row from 'react-bootstrap/esm/Row';
import { ObjectId } from 'mongodb';
import dayjs from 'dayjs';
import './style.css';

type EventProps = {
  handleError: (err: Error) => void;
  timelineStyles: {
    contentArrowStyle: object;
    contentStyle: object;
    iconStyle: object;
  };
  celebration: Celebration;
  value: ObjectId;
  idx: number;
  id: string;
};

const CelebrationEvent = ({
  timelineStyles,
  celebration,
  handleError,
  isMobile,
  value,
  bill,
  pols,
  idx,
  id,
  ...props
}: Props & EventProps) => {
  dayjs.extend(relativeTime);
  dayjs.extend(advancedFormat);

  const dT = useMemo(() => {
    return ['MM-DD-YYYY', 'HH:mm'];
  }, []);

  const idToDate = useMemo(() => {
    return value
      ? new Date(
          parseInt((value as unknown as string).substring(0, 8), 16) * 1000
        )
      : new Date();
  }, [value]);

  const dDT = useMemo(() => {
    return {
      date: dayjs(idToDate).format(dT[0]),
      time: dayjs(idToDate).format(dT[1]),
    };
  }, [dT, idToDate]);

  const [donee, setDonee] = useState<HouseMember | undefined>();

  useEffect(
    () =>
      setDonee(
        (pols as HouseMember[]).filter(
          (d: HouseMember) => d.member_id === celebration.pol_id
        )[0]
      ),
    [pols, celebration]
  );

  return donee ? (
    <VerticalTimelineElement
      id={id}
      {...timelineStyles}
      icon={<Icon donee={donee} handleError={handleError} {...props} />}
      date={
        (
          <Row>
            <Col xs={'auto'}>
              <Stack direction='vertical' gap={2}>
                <Stack direction='horizontal' gap={3}>
                  <span>date: {dDT.date}</span>
                  <span>time: {dDT.time}</span>
                </Stack>{' '}
                <span>
                  id:{' '}
                  {value
                    ? (value as unknown as string).substring(-1, 8)
                    : ''}
                </span>
              </Stack>
            </Col>
            <Col>
              {' '}
              <Image
                className={'splash-icon receipt-mark pt-lg-1'}
                height={'40px'}
                src={Logo}
              />
            </Col>
          </Row>
        ) as unknown as string
      }>
      <>
        <Row>
          <Col>
            <span className={'donation-counter'}>#{idx + 1}</span>
          </Col>
          <Col xs={3} lg={2}>
            <span className={'donation-amount'}>
              ${celebration.donation}
            </span>
          </Col>
        </Row>
        <Row>
          <Col>
            <Stack direction={'vertical'}>
              <Row>
                <Col xs={'auto'}>
                  <Title donee={donee} />
                </Col>
                <Col>
                  <span className={'donation-bill float-end'}>
                    {celebration.bill_id
                      .substring(0, celebration.bill_id.length - 4)
                      .toUpperCase()}
                  </span>
                </Col>
              </Row>
              <Subtitle donee={donee} {...props} />
            </Stack>
          </Col>
        </Row>
        <Row className='mt-3'>
          <Col>
            <ButtonSet
              {...props}
              selectedBill={bill as Bill}
              celebration={celebration}
              handleError={handleError}
            />
          </Col>
        </Row>
      </>
    </VerticalTimelineElement>
  ) : (
    <EventPlaceholder
      timelineStyles={timelineStyles}
      handleError={handleError}
      isMobile={isMobile}
    />
  );
};

export default React.memo(CelebrationEvent);
