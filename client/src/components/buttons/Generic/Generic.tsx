import React, { KeyboardEvent, MouseEvent, ReactNode } from 'react';
import Button from 'react-bootstrap/esm/Button';
import './style.css';

type Props = {
  onPress: (e?: KeyboardEvent | MouseEvent | undefined) => void;
  size: 'sm' | 'lg' | undefined;
  value?: string | undefined;
  children?: ReactNode;
};

const GenericBtn = ({ onPress, size = 'lg', value, children }: Props) => (
  <Button
    onKeyDown={(e: KeyboardEvent) =>
      onPress(e as KeyboardEvent<HTMLButtonElement>)
    }
    onClick={(e: MouseEvent) =>
      onPress(e as MouseEvent<HTMLButtonElement>)
    }
    className={'generic-btn'}
    aria-label={value}
    type={'button'}
    tabIndex={0}
    size={size}>
    {value ? value : children}
  </Button>
);

export default React.memo(GenericBtn);
