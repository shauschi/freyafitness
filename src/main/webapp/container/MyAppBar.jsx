import React from 'react';
import compose from 'recompose/compose';
import withWidth from 'material-ui/utils/withWidth';
import AppBar from 'material-ui/AppBar';
import Toolbar from 'material-ui/Toolbar';
import Typography from 'material-ui/Typography';
import IconButton from 'material-ui/IconButton';
import MenuIcon from 'material-ui-icons/Menu';
import Hidden from 'material-ui/Hidden';

const MyAppBar = (props) => {
  const {classes, toggleDrawer} = props;
  return (
    <AppBar color="primary" className={classes.appBar}>
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
        <Typography type="title" color="inherit" style={{flex: 1}}>
          <Hidden smUp>
            Freya Fitness
          </Hidden>
          <Hidden xsDown>
            Willkommen beim Fitnessprogramm mit Freya
          </Hidden>
        </Typography>
      </Toolbar>
    </AppBar>
  );
};

export default compose(withWidth())(MyAppBar);