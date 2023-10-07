import React from 'react';
import { PolName } from '@Components/displays';
import './style.css';

type Donee =
  | {
      id: string;
      last_name: string;
      member_id: string;
      first_name: string;
    }
  | undefined;

type Props = {
  donee: Donee;
};

const Title = ({ donee }: Props) =>
  donee && (
    <PolName
      name={donee.first_name + ' ' + donee.last_name}
      cls={'vertical-timeline-element-title'}
      firstName={donee.first_name}
      lastName={donee.last_name}
      headingSize={6}
    />
  );
export default React.memo(Title);
