'use strict';
import React, {Component} from 'react';
import compose from 'recompose/compose';
import withWidth from '@material-ui/core/withWidth';
import Drawer from '@material-ui/core/Drawer';
import Divider from '@material-ui/core/Divider';
import List from '@material-ui/core/List';
import {MenuLink} from '../components/general';

import {IconCalendar, IconDocument, IconHome, IconInfo, IconSignIn, IconSignOut, IconUser, IconLineChart, IconPreferences} from '../utils/Icons';

class MyDrawer extends Component {

  render() {
    const {classes, open, toggleDrawer, logout, currentUser} = this.props;

    return (
      <Drawer
        variant="temporary"
        anchor="left"
        open={open}
        classes={{paper: classes.drawerPaper}}
        onClose={toggleDrawer}
        ModalProps={{
          keepMounted: true // Better open performance on mobile.
        }}>
        <div style={{height: '100%'}}>
          <div className={classes.drawerHeader}/>
          <Divider/>
          <div style={{overflowY: 'auto', height: '100vh'}}>
            <List>
              <MenuLink color='primary' to='/' label='Home' icon={<IconHome/>} onClick={toggleDrawer}/>
              {
                currentUser
                  ? <MenuLink to='/statistics' label='Statistiken und PR' icon={<IconLineChart/>} onClick={toggleDrawer}/>
                  : undefined
              }
              {
                currentUser
                  ? <MenuLink to='/courses/all' label='Alle Kurse' icon={<IconCalendar/>} onClick={toggleDrawer}/>
                  : undefined
              }
              {
                currentUser
                  ? <MenuLink to='/profile' label='Profil' icon={<IconUser/>} onClick={toggleDrawer}/>
                  : undefined
              }
              {
                currentUser
                  ? <MenuLink to='/preferences' label='Einstellungen' icon={<IconPreferences/>} onClick={toggleDrawer}/>
                  : undefined
              }
            </List>
            <Divider/>
            <List>
              <MenuLink to='/about/freya' label='Über Freya' icon={<IconInfo/>} onClick={toggleDrawer}/>
              <MenuLink to='/about/freyraum' label='Über FreyRaum' icon={<IconInfo/>} onClick={toggleDrawer}/>
              <MenuLink to='/about/courses' label='Über die Kurse' icon={<IconInfo/>} onClick={toggleDrawer}/>
              <MenuLink to='/agb' label='AGB' icon={<IconDocument/>} onClick={toggleDrawer}/>
              <MenuLink to='/impressum' label='Impressum' icon={<IconInfo/>} onClick={toggleDrawer}/>
            </List>
            <Divider/>
            <List>
              {
                currentUser
                  ? <MenuLink to='/' label='Logout' icon={<IconSignOut/>} onClick={logout}/>
                  : <MenuLink to='/login' label='Login' icon={<IconSignIn/>}/>
              }
            </List>
          </div>
        </div>
      </Drawer>
    );
  }
}

export default compose(
  withWidth()
)(MyDrawer);