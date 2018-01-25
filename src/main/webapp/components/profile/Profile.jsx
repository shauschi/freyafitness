'use strict';
import React, {Component} from 'react';
import List, {ListItem, ListItemText, ListItemIcon, ListSubheader} from 'material-ui/List';
import Avatar from 'material-ui/Avatar';
import {FormControl} from 'material-ui/Form';
import Input, {InputLabel} from 'material-ui/Input';
import {FaBattery1, FaLock, FaUser, FaLineChart, FaFloppyO} from 'react-icons/lib/fa';
import {red} from 'material-ui/colors';
import {blueGrey} from "material-ui/colors/index";
import * as Format from "../../utils/Format.jsx";
import moment from "moment/moment";

// TODO in constants / colors
const backgroundColor = 'rgba(255, 255, 255, 0.75)';

// TODO als utils!
const Row = ({icon, id, label, type, value, endAdornment, onChange, inset, readonly}) => {
  return (
    <ListItem style={{backgroundColor: backgroundColor}} inset={inset}>
      {icon ? <ListItemIcon>{icon}</ListItemIcon> : undefined}
      <FormControl fullWidth>
        <InputLabel htmlFor={id}>{label}</InputLabel>
        <Input id={id} type={type}
               endAdornment={endAdornment}
               value={value}
               onChange={event => onChange(event.target.value)}
               disabled={readonly}/>
      </FormControl>
    </ListItem>
  );
};

const Profile = ({profile, onProfileDetailsChange, onOpenPasswordChange}) => {
  const {firstname, lastname, dayOfBirth, email, mobil, adress = {}} = profile;
  const {zipCode, city, street, nr} = adress;

  return (
    <List>
      <ListSubheader style={{background: blueGrey.A400, color: 'white', lineHeight: '32px'}}>
        {"Profilübersicht"}
      </ListSubheader>
      <ListItem button style={{backgroundColor: backgroundColor}}>
        <Avatar>
          <FaUser/>
        </Avatar>
        <ListItemText primary={"Profilbild ändern"}/>
      </ListItem>
      <ListItem button style={{backgroundColor: backgroundColor}}>
        <ListItemIcon>
          <FaBattery1 color={red.A200}/>
        </ListItemIcon>
        <ListItemText primary={"10-er Karte"} secondary={"2 von 10 frei"}/>
      </ListItem>
      <ListItem button style={{backgroundColor: backgroundColor}}>
        <ListItemIcon>
          <FaLineChart/>
        </ListItemIcon>
        <ListItemText primary={"Statistiken (PR)"}/>
      </ListItem>
      <ListItem button style={{backgroundColor: backgroundColor}}
                onClick={() => onOpenPasswordChange()}>
        <ListItemIcon>
          <FaLock/>
        </ListItemIcon>
        <ListItemText primary={"Passwort ändern"}/>
      </ListItem>

      <ListSubheader style={{background: blueGrey.A400, color: 'white', lineHeight: '32px'}}>
        {"Persönliche Daten"}
      </ListSubheader>
      <Row id="firstname" label="Vorname" value={firstname}
           readonly={false} /* TODO */
           onChange={value => onProfileDetailsChange(['firstname'], value)}
           icon={undefined /* TODO ??? */}/>
      <Row id="lastname" label="Nachname" value={lastname}
           readonly={false} /* TODO */
           onChange={value => onProfileDetailsChange(['lastname'], value)}
           icon={undefined /* TODO ??? */}/>
      <Row id="dayOfBirth" label="Geburtsdatum" value={moment(dayOfBirth).format(Format.ISO_DATE_FORMAT)} type='date'
           readonly={false} /* TODO */
           onChange={value => onProfileDetailsChange(['dayOfBirth'], value)}
           icon={undefined /* TODO ??? */}/>
      <Row id="email" label="E-Mail" value={email}
           readonly={false} /* TODO */
           onChange={value => onProfileDetailsChange(['email'], value)}
           icon={undefined /* TODO ??? */}/>
      <Row id="mobil" label="Mobil" value={mobil}
           readonly={false} /* TODO */
           onChange={value => onProfileDetailsChange(['mobil'], value)}
           icon={undefined /* TODO ??? */}/>

      <ListSubheader style={{background: blueGrey.A400, color: 'white', lineHeight: '32px'}}>
        {"Anschrift"}
      </ListSubheader>
      <Row id="zipCode" label="PLZ" value={zipCode}
           readonly={false} /* TODO */
           onChange={value => onProfileDetailsChange(['adress', 'zipCode'], value)}
           icon={undefined /* TODO ??? */}/>
      <Row id="city" label="Ort" value={city}
           readonly={false} /* TODO */
           onChange={value => onProfileDetailsChange(['adress', 'city'], value)}
           icon={undefined /* TODO ??? */}/>
      <Row id="street" label="Straße" value={street}
           readonly={false} /* TODO */
           onChange={value => onProfileDetailsChange(['adress', 'street'], value)}
           icon={undefined /* TODO ??? */}/>
      <Row id="nr" label="Hausnummer" value={nr}
           readonly={false} /* TODO */
           onChange={value => onProfileDetailsChange(['adress', 'nr'], value)}
           icon={undefined /* TODO ??? */}/>
    </List>
  );
};

export default Profile;