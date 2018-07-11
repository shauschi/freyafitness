'use strict';
import React, {Component} from 'react';
import compose from 'recompose/compose';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import Typography from '@material-ui/core/Typography';
import {withStyles} from "@material-ui/core/styles/index";
import * as Style from "../utils/Style";

class Impressum extends Component {
  render() {
    return (
      <div className={this.props.classes.root}>
        <Grid container spacing={16} justify="center" style={{height: '100%', width: '100%', margin: '0px'}}>
          <Grid item xs={12} md={8}>
            <Card>
              <CardHeader title={'Betreiber und Kontakt'}/>
              <CardContent>
                <Typography>
                  Freya Constanze Heine
                </Typography>
                <Typography>
                  Tangendorfer Straße 2a
                </Typography>
                <Typography>
                  21442 Toppenstedt
                </Typography>
                <Typography>
                  Telefon: +49 (0) 151 2071 2506
                </Typography>
                <Typography>
                  E-Mail: freyraum@freya.fitness
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={8}>
            <Card>
              <CardHeader title={'Haftung für Links'}/>
              <CardContent>
                <Typography>
                  Unser Angebot enthält Links zu externen Webseiten Dritter, auf deren Inhalte wir keinen Einfluss
                  haben.
                  Deshalb können wir für diese fremden Inhalte auch keine Gewähr übernehmen. Für die Inhalte der
                  verlinkten Seiten ist stets der jeweilige Anbieter oder Betreiber der Seiten verantwortlich. Die
                  verlinkten Seiten wurden zum Zeitpunkt der Verlinkung auf mögliche Rechtsverstöße überprüft.
                  Rechtswidrige Inhalte waren zum Zeitpunkt der Verlinkung nicht erkennbar. Eine permanente inhaltliche
                  Kontrolle der verlinkten Seiten ist jedoch ohne konkrete Anhaltspunkte einer Rechtsverletzung nicht
                  zumutbar. Bei Bekanntwerden von Rechtsverletzungen werden wir derartige Links umgehend entfernen.
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
)(Impressum);