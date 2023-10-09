import React, { useLayoutEffect, useCallback } from 'react';
import Alert from 'react-bootstrap/esm/Alert';
import { ShowAlert } from '@Interfaces';
import { AlertProps } from './props';
import './style.css';

const StyledAlert = ({
  dismissible,
  alertClass,
  iconClass,
  heading,
  message,
  setShow,
  variant,
  icon,
  show,
  time,
  type,
}: AlertProps) => {
  const handleClose = useCallback(
    () =>
      setShow((s) => ({
        ...s,
        [type as string]: false,
      })),
    [type, setShow]
  );

  useLayoutEffect(() => {
    if (!show) return;
    if (!type) return;
    if (!show[type]) return;
    if (show[type]) {
      const timeId = setTimeout(
        () => setShow((s) => ({ ...s, [type]: false })),
        time
      );
      return () => clearTimeout(timeId);
    }
  }, [show, time, type, setShow]);

  if (show && !show[type as keyof ShowAlert]) return null;
  else
    return (
      <Alert
        variant={variant}
        onClose={handleClose}
        dismissible={dismissible}
        className={`${alertClass} styled-alert`}>
        {heading ? (
          <>
            <Alert.Heading>
              <i className={`bi bi-${icon} ${iconClass}`} />
              {heading}
            </Alert.Heading>
            {message}
          </>
        ) : (
          <>
            <i className={`bi bi-${icon} ${iconClass}`} />
            {message}
          </>
        )}
      </Alert>
    );
};

export default React.memo(StyledAlert);
