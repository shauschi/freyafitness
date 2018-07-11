'use strict';
import React, {Component} from 'react';
import compose from 'recompose/compose';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import CardMedia from '@material-ui/core/CardMedia';
import Typography from '@material-ui/core/Typography';
import withWidth, {isWidthDown} from '@material-ui/core/withWidth';
import {withStyles} from "@material-ui/core/styles/index";
import * as Style from "../utils/Style";

class AboutFreya extends Component {

  render() {
    const {width} = this.props;
    const suffix = isWidthDown('sm', width) ? 'xs' : 'md';
    return (
      <div className={this.props.classes.root}>
        <Grid container spacing={16} justify="center" style={{height: '100%', width: '100%', margin: '0px'}}>
          <Grid item xs={12} md={8}>
            <Card>
              <CardHeader title={'Wer ist Freya?'}/>
              <CardMedia
                component={'img'}
                image={__API__ + '/about_freya_' + suffix + '.jpg'}
                title={'Freya Heine'}
              />
              <CardContent>
                <Typography paragraph>
                  Mein Name ist Freya Heine und ich verwirkliche mit der Eröffnung von FreyRaum meinen ganz persönlichen
                  Traum vom eigenen, sehr persönlichen Studio in Toppenstedt.
                </Typography>
                <Typography paragraph>
                  Durch mein Studium zur Fitnessökonomin mit Weiterbildungen im medizinischen Fitnesstraining, TRX
                  Training, Functional Training und mehreren Jahren Berufserfahrung, in verschiedenen Fitnessstudios,
                  ist
                  es 2018 Zeit an der Zeit mein eigenes Kapitel zu beginnen.
                </Typography>
                <Typography paragraph>
                  Meine Leidenschaft zum Sport, als auch die Freude dabei Euch sportlich nach vorne zu bringen, lassen
                  mein Herz höherschlagen.
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
  withWidth(),
  withStyles(Style.APP_STYLES, {withTheme: true})
)(AboutFreya);