import React, {Component} from 'react';
import Grid from 'material-ui/Grid';
import IconButton from 'material-ui/IconButton';
import Button from 'material-ui/Button';
import Dialog, {DialogTitle, DialogContent, DialogActions, DialogContentText} from 'material-ui/Dialog';
import List, {ListItem, ListItemIcon, ListItemText, ListSubheader, ListItemSecondaryAction} from 'material-ui/List';

import {FaCloud, FaBolt, FaInfo, FaBattery1} from 'react-icons/lib/fa';

import {green, red} from 'material-ui/colors';


class SimpleDialog extends React.Component {
  handleRequestClose = () => {
    this.props.onRequestClose(this.props.selectedValue);
  };

  render() {
    const {...other} = this.props;

    return (
      <Dialog onRequestClose={this.handleRequestClose} {...other}>
        <DialogTitle><FaBattery1 color={red.A200} style={{marginRight: '12px'}}/>10er-Karte</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Achtung, Deine 10er-Karte ist bald voll. Denke daran, dir eine neue zu kaufen :-)
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={this.handleRequestClose} color="primary">
            Okay
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}

class Home extends Component {

  state = {
    open: false
  };

  handleClickOpen = () => {
    this.setState({
      open: true,
    });
  };

  handleRequestClose = () => {
    this.setState({open: false });
  };


  render() {
    return (
      <div>
        <SimpleDialog
          open={this.state.open}
          onRequestClose={this.handleRequestClose}
        />
        <Grid container spacing={16} justify="center" style={{width: '100%'}}>
          <Grid item xs={12} md={12}>
            <List>
              <ListSubheader disableSticky>
                Neuigkeiten
              </ListSubheader>
              <ListItem>
                <ListItemText inset primary={"Neue App"} secondary={"Ab jetzt alles einfach"}/>
                <ListItemSecondaryAction>
                  <IconButton aria-label="Comments">
                    <FaInfo />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
              <ListItem>
                <ListItemText inset primary={"Neuer Raum ab 08.11.2017"}/>
                <ListItemSecondaryAction>
                  <IconButton aria-label="Comments">
                    <FaInfo />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
              <ListSubheader disableSticky>
                Meine Kurse...
              </ListSubheader>
              <ListItem>
                <ListItemIcon>
                  <FaCloud color={green.A200}/>
                </ListItemIcon>
                <ListItemText inset primary={"Sanfter Kurs"} secondary={"morgen, 19:30"}/>
                <ListItemSecondaryAction>
                  <IconButton aria-label="Comments">
                    <FaInfo />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <FaBolt color={red.A200}/>
                </ListItemIcon>
                <ListItemText inset primary={"Power Kurs"} secondary={"Mi, 17.11. 20:30"}/>
                <ListItemSecondaryAction>
                  <IconButton aria-label="Comments">
                    <FaInfo />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <FaBolt color={red.A200}/>
                </ListItemIcon>
                <ListItemText inset primary={"Power Kurs"} secondary={"Mi, 25.11. 20:30"}/>
                <ListItemSecondaryAction>
                  <IconButton aria-label="Comments">
                    <FaInfo />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
              <ListSubheader disableSticky>
                Status
              </ListSubheader>
              <ListItem button onClick={this.handleClickOpen}>
                <ListItemIcon>
                  <FaBattery1 color={red.A200}/>
                </ListItemIcon>
                <ListItemText inset primary={"Zehnerkarte"} secondary={"(8 von 10 verbraucht)"}/>
              </ListItem>
              <ListItem button onClick={this.handleClickOpen}>
                <ListItemIcon>
                  <FaBattery1 color={red.A200}/>
                </ListItemIcon>
                <ListItemText inset primary={"Zehnerkarte"} secondary={"(8 von 10 verbraucht)"}/>
              </ListItem>
              <ListItem button onClick={this.handleClickOpen}>
                <ListItemIcon>
                  <FaBattery1 color={red.A200}/>
                </ListItemIcon>
                <ListItemText inset primary={"Zehnerkarte"} secondary={"(8 von 10 verbraucht)"}/>
              </ListItem>
            </List>
          </Grid>
        </Grid>
      </div>
    );
  }
}

export default Home;