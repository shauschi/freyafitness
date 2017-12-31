import React from 'react';
import compose from 'recompose/compose';
import withWidth from 'material-ui/utils/withWidth';
import AppBar from 'material-ui/AppBar';
import Toolbar from 'material-ui/Toolbar';
import Typography from 'material-ui/Typography';
import IconButton from 'material-ui/IconButton';
import MenuIcon from 'material-ui-icons/Menu';
import Hidden from 'material-ui/Hidden';

import {blueGrey, amber} from 'material-ui/colors';

const MyAppBar = (props) => {
  const {classes, toggleDrawer} = props;
  return (
    <AppBar style={{background: blueGrey.A700}} className={classes.appBar}>
      <Toolbar>
        <Hidden smUp>
          <IconButton
            color="contrast"
            aria-label="Navigation"
            onClick={toggleDrawer}
          >
            <MenuIcon/>
          </IconButton>
        </Hidden>
        <Typography type="title" style={{left: 0, position: 'absolute', width: '100%', textAlign: 'center'}}>
          <span style={{color: 'white'}}>freya</span>
          <span style={{color: '#03a9f4'}}>.</span>
          <span style={{color: amber.A400}}>fitness</span>
          <Hidden xsDown>
            <span style={{color: 'white'}}> - Willkommen beim Fitnessprogramm mit Freya</span>
          </Hidden>
        </Typography>
      </Toolbar>
    </AppBar>
  );
};

export default compose(withWidth())(MyAppBar);