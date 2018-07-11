'use strict';
import React, {Component} from 'react';
import compose from 'recompose/compose';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import CardMedia from '@material-ui/core/CardMedia';
import Typography from '@material-ui/core/Typography';
import {withStyles} from "@material-ui/core/styles/index";
import * as Style from "../utils/Style";

class AboutFreyRaum extends Component {

  render() {
    return (
      <div className={this.props.classes.root}>
        <Grid container spacing={16} justify="center" style={{height: '100%', width: '100%', margin: '0px'}}>
          <Grid item xs={12} md={8}>
            <Card>
              <CardHeader title={'Wo muss ich hin?'}/>
              <CardMedia src={__API__ + '/about_location.png'}/>
              <CardContent>
                <Typography>
                  FreyRaum findest du in der Tangendorfer Straße 2a in 21442 Toppenstedt. Ein Großteil der Kurse findet
                  ab
                  August 2018 im ehemaligen „Blumenstübchen“ von Toppenstedt statt.
                  Parkplätze sind direkt vor der Tür vorhanden.
                </Typography>
                <Typography>
                  Während der Sommersaison kann es vereinzelt vorkommen, dass Kurse in „die Scheune“ verlegt werden.
                  Diese
                  befindet sich in der Hauptstraße 15 und war bis vor kurzem noch unser Hauptquartier.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </div>
    );
  }
}

export default compose(
  withStyles(Style.APP_STYLES, {withTheme: true})
)(AboutFreyRaum);