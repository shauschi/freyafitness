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
        <Typography type="title" style={{flex: 1, textAlign: 'center'}}>
          <Hidden smUp>
            <span style={{color: 'white'}}>freya</span><span style={{color: amber.A400}}>.fitness</span>
          </Hidden>
          <Hidden xsDown>
            freya.fitness - Willkommen beim Fitnessprogramm mit Freya
          </Hidden>
        </Typography>
      </Toolbar>
    </AppBar>
  );
};

export default compose(withWidth())(MyAppBar);