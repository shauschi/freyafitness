'use strict';
import React, {Component} from 'react';
import compose from 'recompose/compose';
import withWidth from '@material-ui/core/withWidth';
import Drawer from '@material-ui/core/Drawer';
import Hidden from '@material-ui/core/Hidden';
import Divider from '@material-ui/core/Divider';
import List from '@material-ui/core/List';
import {MenuLink} from '../components/general';

import {
  IconHome,
  IconInfo,
  IconCalendar,
  IconUser,
  IconSignOut,
  IconSignIn,
  IconDocument
} from '../utils/Icons';

class MyDrawer extends Component {

  render() {
    const {classes, open, toggleDrawer, logout, currentUser} = this.props;
    const drawer = (
      <div style={{height: '100%'}}>
        <div className={classes.drawerHeader}/>
        <Divider/>
        <div style={{overflowY: 'auto', height: '100vh'}}>
          <List>
            <MenuLink to='/' label='Home' icon={<IconHome/>} onClick={toggleDrawer}/>
            {
              currentUser
                ? <MenuLink to='/courses/all' label='Alle Kurse' icon={<IconCalendar/>} onClick={toggleDrawer}/>
                : undefined
            }
            {
              currentUser
                ? <MenuLink to='/profile' label='Profile' icon={<IconUser/>} onClick={toggleDrawer}/>
                : undefined
            }
          </List>
          <Divider/>
          <List>
            <MenuLink to='/about' label='Informationen' icon={<IconInfo/>} onClick={toggleDrawer}/>
            <MenuLink to='/agb' label='AGB' icon={<IconDocument/>} onClick={toggleDrawer}/>
            <MenuLink to='/impressum' label='Impressum' icon={<IconInfo/>} onClick={toggleDrawer}/>
            {
              currentUser
                ? <MenuLink to='/' label='Logout' icon={<IconSignOut/>} onClick={logout}/>
                : <MenuLink to='/login' label='Login' icon={<IconSignIn/>}/>
            }
          </List>
        </div>
      </div>
    );

    return (
      <div>
        <Hidden smUp>
          <Drawer
            variant="temporary"
            anchor="left"
            open={open}
            classes={{paper: classes.drawerPaper}}
            onClose={toggleDrawer}
            ModalProps={{
              keepMounted: true // Better open performance on mobile.
            }}
          >
            {drawer}
          </Drawer>
        </Hidden>
        <Hidden only='xs' implementation="js">
          <Drawer variant="permanent" open classes={{paper: classes.drawerPaper}}>
            {drawer}
          </Drawer>
        </Hidden>
      </div>
    );
  }
}

export default compose(
  withWidth()
)(MyDrawer);