'use strict';
import React, {Component} from 'react';

class ValidationGroup extends Component {

  constructor(props) {
    super(props);
    this.children = [];
  }

  addChildRef = child => {
    this.children.push(child);
  };

  validate() {
    const errors = [];
    for (const child of this.children) {
      if (child.validate) {
        const result = child.validate();
        if (!result.valid) {
          errors.push(result.error);
        }
      }
    }
    return {valid: errors.length === 0, errors: errors};
  };

  render() {
    return <div>
      {
        React.Children.map(this.props.children, child => {
          return React.cloneElement(child, {ref: this.addChildRef});
        })
      }
    </div>
  }

}

export default ValidationGroup;
