'use strict';
import React, {Component} from 'react';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import CardMedia from '@material-ui/core/CardMedia';
import Typography from '@material-ui/core/Typography';

class About extends Component {
  render() {
    return (
      <Grid container spacing={16} justify="center" style={{height: '100%', width: '100%', margin: '0px'}}>
        <Grid item xs={12} md={8}>
          <Card>
            <CardHeader title={'Wer ist Freya?'}/>
            <CardMedia
              component={'img'}
              image={__API__ + '/about_freya.jpg'}
              title={'Freya Heine'}
            />
            <CardContent>
              <Typography paragraph>
                Mein Name ist Freya Heine und ich verwirkliche mit der Eröffnung von FreyRaum meinen ganz persönlichen
                Traum vom eigenen, sehr persönlichen Studio in Toppenstedt.
              </Typography>
              <Typography paragraph>
                Durch mein Studium zur Fitnessökonomin mit Weiterbildungen im medizinischen Fitnesstraining, TRX
                Training, Functional Training und mehreren Jahren Berufserfahrung, in verschiedenen Fitnessstudios, ist
                es 2018 Zeit an der Zeit mein eigenes Kapitel zu beginnen.
              </Typography>
              <Typography paragraph>
                Meine Leidenschaft zum Sport, als auch die Freude dabei Euch sportlich nach vorne zu bringen, lassen
                mein Herz höherschlagen.
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={8}>
          <Card>
            <CardHeader title={'Was für Kurse sind das?'}/>
            <CardMedia src={__API__ + '/about_course_example.png'}/>
            <CardContent>
              <Typography>
                In jedem Kurs werden 10 - 30 verschiedene Übungen trainiert. Das Konzept wird jedes Mal individuell und
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

        <Grid item xs={8}>
          <Card>
            <CardHeader title={'Wo muss ich hin?'}/>
            <CardMedia src={__API__ + '/about_location.png'}/>
            <CardContent>
              <Typography>
                FreyRaum findest du in der Tangendorfer Straße 2a in 21442 Toppenstedt. Ein Großteil der Kurse findet ab
                August 2018 im ehemaligen „Blumenstübchen“ von Toppenstedt statt.
                Parkplätze sind direkt vor der Tür vorhanden.
              </Typography>
              <Typography>
                Während der Sommersaison kann es vereinzelt vorkommen, dass Kurse in „die Scheune“ verlegt werden. Diese
                befindet sich in der Hauptstraße 15 und war bis vor kurzem noch unser Hauptquartier.
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    );
  }
}

export default About;