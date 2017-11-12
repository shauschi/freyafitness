'use strict';
import React, {Component} from 'react';
import compose from 'recompose/compose';
import withWidth from 'material-ui/utils/withWidth';
import Drawer from 'material-ui/Drawer';
import Hidden from 'material-ui/Hidden';
import Divider from 'material-ui/Divider';
import List, {ListItem, ListItemIcon, ListItemText} from 'material-ui/List';
import {Link} from 'react-router-dom';

import {FaHome, FaInfo, FaCalendar, FaUser, FaSignOut, FaHandGrabO} from 'react-icons/lib/fa';

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
            <MenuLink to='/' label='Home' icon={<FaHome/>} onClick={toggleDrawer}/>
            <MenuLink to='/courses/all' label='Alle Kurse' icon={<FaCalendar/>} onClick={toggleDrawer}/>
            <MenuLink to='/profile' label='Profile' icon={<FaUser/>} onClick={toggleDrawer}/>
          </List>
          <Divider/>
          <List>
            <MenuLink to='/about/freya' label='Über Freya' icon={<FaInfo/>} onClick={toggleDrawer}/>
            <MenuLink to='/about/stall' label='Der Stall' icon={<FaInfo/>} onClick={toggleDrawer}/>
            <MenuLink to='/agb' label='AGB' icon={<FaHandGrabO/>} onClick={toggleDrawer}/>
            <MenuLink to='/impressum' label='Impressum' icon={<FaInfo/>} onClick={toggleDrawer}/>
            <MenuLink to='/signout' label='Sign-Out' icon={<FaSignOut/>} onClick={toggleDrawer}/>
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
            onRequestClose={toggleDrawer}
            ModalProps={{
              keepMounted: true // Better open performance on mobile.
            }}
          >
            {drawer}
          </Drawer>
        </Hidden>
        <Hidden smDown implementation="css">
          <Drawer type="permanent" open classes={{paper: classes.drawerPaper}}>
            {drawer}
          </Drawer>
        </Hidden>
      </div>
    );
  }
}

export default compose(withWidth())(MyDrawer);