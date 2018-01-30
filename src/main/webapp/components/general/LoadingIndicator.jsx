'use strict';
import React, {Component} from 'react';
import {FaSpinner} from 'react-icons/lib/fa';

const keyframesStyle = `
  @-webkit-keyframes spinner {
    to {transform: rotate(360deg);}
  }
`;

const injectStyle = (style) => {
  const styleElement = document.createElement('style');
  document.head.appendChild(styleElement);
  const styleSheet = styleElement.sheet;
  styleSheet.insertRule(style, styleSheet.cssRules.length);
};

const loadingStyles = {
  loadingIndicator: {
    width: '100%',
    textAlign: 'center'
  },
  spinner: {
    fontSize: '2em',
    WebkitAnimation: 'spinner 1.8s linear infinite'
  }
};

class LoadingIndicator extends Component {

  constructor(props) {
    super(props);
    injectStyle(keyframesStyle);
  }

  render()
  {
    return (
      <div style={loadingStyles.loadingIndicator}>
        <FaSpinner style={loadingStyles.spinner} />
      </div>
    );
  };
}

export default LoadingIndicator;