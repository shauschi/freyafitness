import React from 'react';
import Grid from 'material-ui/Grid';
import Typography from 'material-ui/Typography';
import TextField from 'material-ui/TextField';

const Profile = ({profile}) => {
  const {firstname, lastname} = profile;
  return (
    <Grid container spacing={16} justify="center" style={{width: '100%'}}>
      <Grid item xs={12}>
        <Typography type="title" gutterBottom>
          {"Profil bearbeiten"}
        </Typography>
      </Grid>
      <Grid item xs={12} md={6}>
        <TextField id="firstname" label="Vorname" value={firstname} fullWidth/>
      </Grid>
      <Grid item xs={12} md={6}>
        <TextField id="lastname" label="Nachname" value={lastname} fullWidth/>
      </Grid>
      <Grid item xs={12} md={6}>
        <TextField id="mail" label="E-Mail" value={""} fullWidth/>
      </Grid>
    </Grid>
  );
};

export default Profile;