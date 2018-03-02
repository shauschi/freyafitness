'use strict';
import React, {Component} from 'react';
import compose from 'recompose/compose';
import withWidth from 'material-ui/utils/withWidth';
import Drawer from 'material-ui/Drawer';
import Hidden from 'material-ui/Hidden';
import Divider from 'material-ui/Divider';
import List, {ListItem, ListItemIcon, ListItemText} from 'material-ui/List';
import {Link} from 'react-router-dom';

import {
  IconHome,
  IconInfo,
  IconCalendar,
  IconUser,
  IconSignOut,
  IconDocument
} from '../utils/Icons';

const MenuLink = ({to, label, icon, onClick}) => (
  <Link to={to} style={{textDecoration: 'none'}} onClick={onClick}>
    <ListItem button>
      <ListItemIcon>
        {icon}
      </ListItemIcon>
      <ListItemText primary={label}/>
    </ListItem>
  </Link>
);

class MyDrawer extends Component {

  render() {
    const {classes, open, toggleDrawer} = this.props;
    const drawer = (
      <div style={{height: '100%'}}>
        <div className={classes.drawerHeader}/>
        <Divider/>
        <div style={{overflowY: 'auto', height: '100vh'}}>
          <List>
            <MenuLink to='/' label='Home' icon={<IconHome/>} onClick={toggleDrawer}/>
            <MenuLink to='/courses/all' label='Alle Kurse' icon={<IconCalendar/>} onClick={toggleDrawer}/>
            <MenuLink to='/profile' label='Profile' icon={<IconUser/>} onClick={toggleDrawer}/>
          </List>
          <Divider/>
          <List>
            <MenuLink to='/about/freya' label='Über Freya' icon={<IconInfo/>} onClick={toggleDrawer}/>
            <MenuLink to='/about/stall' label='Der Stall' icon={<IconInfo/>} onClick={toggleDrawer}/>
            <MenuLink to='/agb' label='AGB' icon={<IconDocument/>} onClick={toggleDrawer}/>
            <MenuLink to='/impressum' label='Impressum' icon={<IconInfo/>} onClick={toggleDrawer}/>
            <MenuLink to='/logout' label='Logout' icon={<IconSignOut/>} onClick={toggleDrawer}/>
          </List>
        </div>
      </div>
    );

    return (
      <div>
        <Hidden smUp>
          <Drawer
            type="temporary"
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
        <Hidden only='xs' implementation="css">
          <Drawer type="permanent" open classes={{paper: classes.drawerPaper}}>
            {drawer}
          </Drawer>
        </Hidden>
      </div>
    );
  }
}

export default compose(withWidth())(MyDrawer);