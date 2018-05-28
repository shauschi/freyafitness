'use strict';
import React, {Component} from 'react';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import CardMedia from '@material-ui/core/CardMedia';
import Typography from '@material-ui/core/Typography';

class Agb extends Component {
  render() {
    return (
      <div style={{height: '100%', overflow: 'auto'}}>
        <Grid container spacing={16} justify="center" style={{height: '100%', width: '100%', margin: '0px'}}>
          <Grid item xs={12}>
            <Card>
              <CardHeader title={'Allgemeine Geschäftsbedingungen'}/>
              <CardMedia src={__API__ + '/about_freya.png'}/>
              <CardContent>
                <Typography>
                  Die müssen geschrieben werden!
                </Typography>
              </CardContent>
            </Card>
          </Grid>

        </Grid>
      </div>
    );
  }
}

export default Agb;