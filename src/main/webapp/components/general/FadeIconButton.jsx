'use strict';
import React from 'react';
import IconButton from '@material-ui/core/IconButton';
import {Fade} from '.';

const defaultStyle = {
  zIndex: 20
};

const FadeIconButton = (
  {inProp,
    color = 'contrast',
    ariaLabel,
    onClick,
    style,
    iconStyle,
    children}) => (
  <Fade
    inProp={inProp}
    style={Object.assign({}, defaultStyle, style)}>
    <IconButton
      color={color}
      aria-label={ariaLabel}
      onClick={onClick}
      style={iconStyle}>
      {children}
    </IconButton>
  </Fade>
);

export default FadeIconButton;
