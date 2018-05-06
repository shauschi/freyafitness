'use strict';
import React, {Component} from 'react';

class ValidationControl extends Component {

  constructor(props) {
    super(props);
    this.state = {valid: true, errors: []};
    this.validate = this.validate.bind(this);
  }

  validate() {
    const {value, validators = [], showAllErrors = false} = this.props;
    const errors = [];
    for (const validator of validators) {
      const result = validator(value);
      if (!result.valid) {
        errors.push(result.error);
      }
      if (!showAllErrors && errors.length > 0) {
        break;
      }
    }
    const state = {valid: errors.length === 0, errors: errors};
    this.setState(state);
    return state;
  };

}

export default ValidationControl;
