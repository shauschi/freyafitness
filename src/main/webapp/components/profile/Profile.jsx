import React from 'react';
import Grid from 'material-ui/Grid';
import Typography from 'material-ui/Typography';
import TextField from 'material-ui/TextField';

const Profile = ({profile}) => {

  profile = {
    firstname: 'Max',
    lastname: 'Muster'
  };

  const {firstname, lastname} = profile;

  return (
    <Grid container spacing={16} justify="center" style={{width: '100%'}}>
      <Grid item xs={12}>
        <Typography type="title" gutterBottom>
          {"Dein Profil"}
        </Typography>
      </Grid>
      <Grid item xs={12} md={12}>
        <p>Übersicht 10er-Karte</p>
      </Grid>
      <Grid item xs={6} md={6}>
        <Grid item xs={12} md={6}>
          <TextField id="firstname" label="Vorname" value={firstname} fullWidth/>
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField id="lastname" label="Nachname" value={lastname} fullWidth/>
        </Grid>
      </Grid>
      <Grid item xs={6} md={6}>
        <div style={{color: 'blue', height: '50px'}}>Profilbild</div>
      </Grid>
      <Grid item xs={12} md={12}>
        <TextField id="mail" label="E-Mail" value={""} fullWidth/>
      </Grid>
      <Grid item xs={12} md={12}>
        <TextField id="mobil" label="Mobil" value={"0176 ...."} fullWidth/>
      </Grid>
      <Grid item xs={12} md={12}>
        <h2>Anschrift</h2>
      </Grid>
      <Grid item xs={12} md={12}>
        <TextField id="zipCode" label="PLZ" value={"21224"} fullWidth/>
      </Grid>
      <Grid item xs={12} md={12}>
        <TextField id="city" label="Ort" value={"Rosengarten"} fullWidth/>
      </Grid>
      <Grid item xs={10} md={10}>
        <TextField id="street" label="Straße" value={"Eichelhäherkamp"} fullWidth/>
      </Grid>
      <Grid item xs={2} md={2}>
        <TextField id="nr" label="Nr" value={"2"} fullWidth/>
      </Grid>
    </Grid>
  );
};

export default Profile;