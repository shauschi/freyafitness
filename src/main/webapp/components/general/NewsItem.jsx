'use strict';
import React, {Component} from 'react';
import compose from 'recompose/compose';
import {withStyles} from 'material-ui/styles';
import Typography from 'material-ui/Typography';
import Hidden from 'material-ui/Hidden';
import {LoadingIndicator} from '.';

const itemStyles = () => ({
  container: {
    height: '300px',
    backgroundColor: 'white',
    backgroundSize: 'cover'
  },
  description: {
    position: 'absolute',
    bottom: '0',
    width: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.85)'
  },
  descriptionText: {
    padding: '16px'
  },
  stepperPlaceholder: {
    height: '22px'
  }
});

class NewsItem extends Component {
  render()
  {
    const {classes, title, text, img} = this.props;
    return (
      <div>
        <div className={classes.container} style={{backgroundImage: img ? 'url(' + img + ')' : undefined}}>
          <div className={classes.description}>
            <div className={classes.descriptionText}>
              <Typography type='title'>{title}</Typography>
              <Typography>{text}</Typography>
            </div>
            <div className={classes.stepperPlaceholder} />
          </div>
        </div>
      </div>
    );
  };
}

export default compose(
  withStyles(itemStyles)
)(NewsItem);