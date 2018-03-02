'use strict';
import React from 'react';
import Button from 'material-ui/Button';
import {Fade} from '.';

const defaultStyle = {
  zIndex: 20
};

const FadeButton = (
  {inProp,
    color = 'primary',
    ariaLabel,
    onClick,
    style = defaultStyle,
    children}) => (
  <Fade inProp={inProp}>
    <Button
      color={color}
      aria-label={ariaLabel}
      onClick={onClick}
      style={style}
    >
      {children}
    </Button>
  </Fade>
);

export default FadeButton;
