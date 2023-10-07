import React from 'react';
import { GenericBtn } from '@Components/buttons';
import { routes } from '../../../router';

type Props = {
  size: 'sm' | 'lg' | undefined;
  onPress: (e: any) => void;
  value: string;
};

// wraps Generic btn component
const MobileFormBtn = ({ size, value, onPress }: Props) => (
  <a {...routes.main().link}>
    {<GenericBtn value={value} size={size} onPress={onPress} />}
  </a>
);

export default React.memo(MobileFormBtn);
