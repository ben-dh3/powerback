import React, { KeyboardEvent, useCallback } from 'react';
import FormCheckLabel from 'react-bootstrap/esm/FormCheckLabel';
import FormGroup from 'react-bootstrap/esm/FormGroup';
import Stack from 'react-bootstrap/esm/Stack';
import Form from 'react-bootstrap/esm/Form';
import { ARROW_KEYS } from './tuples';
import ToggleLabel from './label';
import './style.css';

/// responsive and accessible expansion of Bootstrap's Form.Check "switch" type input element
// paired with two dynamically styled and interactive labels (sub-component).
/// Updates a boolean state prop.

type Props = {
  toggleSelectionClass: string[];
  formPath: string;
  swapPaths: () => void;
  labels: string[];
};

const ToggleSwitch = ({
  toggleSelectionClass,
  formPath,
  swapPaths,
  labels,
}: Props) => {
  const handleKeyDown = useCallback(
    (e: KeyboardEvent<HTMLSpanElement>) => {
      if (
        e.key === 'Enter' ||
        e.key === 'Arrow' + ARROW_KEYS[0][+labels.indexOf(formPath)]
      )
        swapPaths();
    },
    [labels, formPath, swapPaths]
  );

  return (
    <FormGroup controlId={'login-signup-switch'} className={'mb-3'}>
      <Form.Check
        type='switch'
        onChange={swapPaths}
        className={'form-toggle'}
        checked={formPath === 'Sign Up'}
      />{' '}
      <FormCheckLabel htmlFor='login-signup-switch'>
        <Stack direction={'vertical'} gap={2}>
          {labels &&
            labels.map((label: string, i: number) => {
              return (
                <ToggleLabel
                  cls={
                    toggleSelectionClass[formPath === 'Sign Up' ? +!i : i]
                  }
                  // add a onClick here but have it only work if it is the 'off' label. can this work?

                  key={'toggle-label-' + label + '-' + i}
                  handleKeyDown={handleKeyDown}
                  value={label}
                />
              );
            })}
        </Stack>
      </FormCheckLabel>
    </FormGroup>
  );
};

export default React.memo(ToggleSwitch);
