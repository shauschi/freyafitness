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

class AboutCourses extends Component {

  render() {
    return (
      <div className={this.props.classes.root}>
        <Grid container spacing={16} justify="center" style={{height: '100%', width: '100%', margin: '0px'}}>
          <Grid item xs={12} md={8}>
            <Card>
              <CardHeader title={'Was für Kurse sind das?'}/>
              <CardMedia src={__API__ + '/about_course_example.png'}/>
              <CardContent>
                <Typography>
                  In jedem Kurs werden 10 - 30 verschiedene Übungen trainiert. Das Konzept wird jedes Mal individuell
                  und
                  neu für den Tag entwickelt.
                  Wichtig ist hierbei vor allem das Einbeziehen von funktionellen Übungen, die alltagsnah trainiert
                  werden. Dabei werden auch Eigenschaften wie Koordination, Gleichgewicht, Beweglichkeit, Kraft und
                  Schnelligkeit einbezogen und je nach Trainingsstand verbessert.
                </Typography>
                <Typography>
                  Inzwischen gibt es verschiedene Abstufungen der Kurse:
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
)(AboutCourses);