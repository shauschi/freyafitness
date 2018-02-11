'use strict';
import React, {Component} from 'react';
import compose from 'recompose/compose';
import {withStyles} from 'material-ui/styles';
import Typography from 'material-ui/Typography';
import Button from 'material-ui/Button';
import List, {ListItem, ListItemSecondaryAction} from 'material-ui/List';

const itemStyles = () => ({
  container: {
    height: '300px',
    backgroundColor: 'white',
    backgroundSize: 'cover'
  },
  description: {
    color: 'white',
    position: 'absolute',
    bottom: '0',
    width: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.35)'
  },
  descriptionText: {
    padding: '16px'
  },
  stepperPlaceholder: {
    height: '22px'
  }
});

class NewsItem extends Component {
  render() {
    const {classes, title, text, img} = this.props;
    return (
      <div className={classes.container} style={{backgroundImage: img ? 'url(' + img + ')' : undefined}}>
        <div className={classes.description}>
          <List style={{padding: '0'}}>
            <ListItem button>
                <div style={{width: '100%'}}>
                  <Typography style={{color: 'rgba(255, 255, 255, 0.87)'}} type='headline'>
                    {title}
                    </Typography>
                  <Typography style={{color: 'rgba(255, 255, 255, 0.87)'}}>
                    {text}
                  </Typography>
                </div>
                <ListItemSecondaryAction style={{marginTop: 'auto', top: 'auto', bottom: '6px'}}>
                  <Button dense color='primary'>
                    mehr
                  </Button>
                </ListItemSecondaryAction>
            </ListItem>
          </List>
          <div className={classes.stepperPlaceholder}/>
        </div>
      </div>
    );
  };
}

export default compose(
  withStyles(itemStyles)
)(NewsItem);