import React from 'react';
import Grid from 'material-ui/Grid';
import Typography from 'material-ui/Typography';
import Button from 'material-ui/Button';
import Icon from 'material-ui/Icon';
import TextField from 'material-ui/TextField';

import {FaBattery1} from 'react-icons/lib/fa';
import {red} from 'material-ui/colors';

const Profile = ({profile}) => {

  profile = {
    firstname: 'Max',
    lastname: 'Muster'
  };

  const {firstname, lastname} = profile;
  const backgroundColor = 'rgba(255, 255, 255, 0.75)';

  return (
    <Grid container spacing={16} alignItems="center" style={{width: '100%'}}>
      <Grid item xs={12} md={12}>
        <Typography type="title" >Profilübersicht</Typography>
      </Grid>

      <Grid item container xs={12} alignItems='flex-end'>
        <Grid item container xs={6}>
          <Grid item xs={12}>
            <div style={{width: '100%', backgroundColor: backgroundColor}}>
              <Typography type="title">10-er Karte</Typography>
              <Icon style={{fontSize: '24px'}}>
                <FaBattery1 color={red.A200}/>
              </Icon>
              <Typography style={{display: 'inline-block', color: red.A200, marginLeft: '8px'}}>2 von 10 frei</Typography>
            </div>
          </Grid>
          <Grid item xs={12}>
            <TextField id="firstname" label="Vorname" value={firstname} fullWidth style={{backgroundColor: backgroundColor}}/>
          </Grid>
          <Grid item xs={12}>
            <TextField id="lastname" label="Nachname" value={lastname} fullWidth style={{backgroundColor: backgroundColor}}/>
          </Grid>
        </Grid>
        <Grid item container xs={6} justify='center'>
          <Grid item xs={12}>
            <div style={{color: 'blue', height: '150px', width: '150px', backgroundColor: '#dddddd', margin: '0 auto'}}>
              Profilbild
            </div>
          </Grid>
          <Grid item xs={12} style={{textAlign: 'center'}}>
            <Button raised={true}>Bild ändern</Button>
          </Grid>
        </Grid>
      </Grid>

      <Grid item xs={12}>
        <TextField id="mail" label="E-Mail" value={""} fullWidth  style={{backgroundColor: backgroundColor}}/>
      </Grid>
      <Grid item xs={12}>
        <TextField id="mobil" label="Mobil" value={"0176 ...."} fullWidth  style={{backgroundColor: backgroundColor}}/>
      </Grid>
      <Grid item xs={12} style={{textAlign: 'center'}}>
        <Button raised={true}>Passwort ändern</Button>
      </Grid>

      <Grid item xs={12}>
        <h2>Anschrift</h2>
      </Grid>
      <Grid item xs={12}>
        <TextField id="zipCode" label="PLZ" value={"21224"} fullWidth  style={{backgroundColor: backgroundColor}}/>
      </Grid>
      <Grid item xs={12}>
        <TextField id="city" label="Ort" value={"Rosengarten"} fullWidth  style={{backgroundColor: backgroundColor}}/>
      </Grid>
      <Grid item xs={10}>
        <TextField id="street" label="Straße" value={"Eichelhäherkamp"} fullWidth  style={{backgroundColor: backgroundColor}}/>
      </Grid>
      <Grid item xs={2}>
        <TextField id="nr" label="Nr" value={"2"} fullWidth  style={{backgroundColor: backgroundColor}}/>
      </Grid>
    </Grid>
  );
};

export default Profile;