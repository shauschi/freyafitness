'use strict';
import React from 'react';
import {Row, Subheader} from './../../components/general';
import List, {ListItem, ListItemText, ListItemIcon} from 'material-ui/List';
import Avatar from 'material-ui/Avatar';
import {FaBattery1, FaLock, FaUser, FaLineChart} from 'react-icons/lib/fa';
import {red} from 'material-ui/colors';
import * as Format from "../../utils/Format.jsx";
import moment from "moment/moment";

const backgroundColor = 'rgba(255, 255, 255, 0.75)';

const Profile = ({profile, onProfileDetailsChange, onOpenPasswordChange}) => {
  const {firstname, lastname, dayOfBirth, email, mobil, adress = {}} = profile;
  const {zipCode, city, street, nr} = adress;

  return (
    <List>
      <Subheader label={"Profilübersicht"} />
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

      <Subheader label={"Persönliche Daten"} />
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

      <Subheader label={"Anschrift"} />
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