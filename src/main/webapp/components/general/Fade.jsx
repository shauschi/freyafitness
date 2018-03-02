'use strict';
import React from 'react';
import {Transition} from 'react-transition-group';

const defaultStyle = {
  transition: 'opacity 650ms cubic-bezier(0.23, 1, 0.32, 1)',
  zIndex: 20,
  opacity: 1,
};

const transitionStyles = {
  entering: {opacity: 1},
  entered: {opacity: 1},
  exiting: {opacity: 0},
  exited: {opacity: 0},
};

const Fade = ({inProp, style, children}) => (
  <Transition
    in={inProp}
    timeout={650}>
    {(state) => {
      return <div style={{
        ...defaultStyle,
        ...transitionStyles[state],
        ...style
      }}>
        {children}
      </div>
    }}
  </Transition>
);

export default Fade;
