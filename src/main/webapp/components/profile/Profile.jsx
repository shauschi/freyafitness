'use strict';
import React, {Component} from 'react';
import {ListItemInput, Subheader} from './../../components/general';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import {IconBatteryLow, IconLockClosed, IconLineChart} from '../../utils/Icons';
import {red} from '@material-ui/core/colors';
import * as Format from '../../utils/Format';
import moment from 'moment/moment';
import {ProfilePicture} from '.';

const backgroundColor = 'rgba(255, 255, 255, 0.75)';

class Profile extends Component {

  render() {
    const {
      profile,
      onProfileDetailsChange,
      onOpenPasswordChange,
      onOpenProfilPictureChange
    } = this.props;
    const {id, firstname, lastname, dayOfBirth, email, mobil, adress = {}} = profile.user;
    const {zipCode, city, street, nr} = adress;

    return (
      <div>
        <List style={{padding: '0'}}>
          <Subheader label={"Profilübersicht"}/>
          <ListItem
            button
            style={{backgroundColor: backgroundColor}}
            onClick={onOpenProfilPictureChange}>
            <ListItemIcon>
              <ProfilePicture user={profile.user} />
            </ListItemIcon>
            <ListItemText primary={"Profilbild ändern"}/>
          </ListItem>
          <ListItem button style={{backgroundColor: backgroundColor}}>
            <ListItemIcon>
              <IconBatteryLow color={red.A200}/>
            </ListItemIcon>
            <ListItemText primary={"10-er Karte (folgt)"} secondary={"2 von 10 frei"}/>
          </ListItem>
          <ListItem button style={{backgroundColor: backgroundColor}}>
            <ListItemIcon>
              <IconLineChart/>
            </ListItemIcon>
            <ListItemText primary={"Statistiken (folgt)"}/>
          </ListItem>
          <ListItem button style={{backgroundColor: backgroundColor}}
                    onClick={() => onOpenPasswordChange()}>
            <ListItemIcon>
              <IconLockClosed/>
            </ListItemIcon>
            <ListItemText primary={"Passwort ändern"}/>
          </ListItem>

          <Subheader label={"Persönliche Daten"}/>
          <ListItemInput id="firstname" label="Vorname" value={firstname}
               onChange={value => onProfileDetailsChange(['firstname'], value)}/>
          <ListItemInput id="lastname" label="Nachname" value={lastname}
               onChange={value => onProfileDetailsChange(['lastname'], value)}/>
          {/*
            <ListItemInput id="dayOfBirth" label="Geburtsdatum"
                           value={moment(dayOfBirth).format(Format.ISO_DATE_FORMAT)} type='date'
                           onChange={value => onProfileDetailsChange(['dayOfBirth'], value)}/>
          */}
          <ListItemInput id="email" label="E-Mail" value={email}
               onChange={value => onProfileDetailsChange(['email'], value)}/>
          {/*
          <ListItemInput id="mobil" label="Mobil" value={mobil}
               onChange={value => onProfileDetailsChange(['mobil'], value)}/>

          <Subheader label={"Anschrift"}/>
          <ListItemInput id="zipCode" label="PLZ" value={zipCode}
               onChange={value => onProfileDetailsChange(['adress', 'zipCode'], value)}/>
          <ListItemInput id="city" label="Ort" value={city}
               onChange={value => onProfileDetailsChange(['adress', 'city'], value)}/>
          <ListItemInput id="street" label="Straße" value={street}
               onChange={value => onProfileDetailsChange(['adress', 'street'], value)}/>
          <ListItemInput id="nr" label="Hausnummer" value={nr}
               onChange={value => onProfileDetailsChange(['adress', 'nr'], value)}/>
          */}
        </List>
      </div>
    );
  };
}

export default Profile;