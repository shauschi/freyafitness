import React, {Component} from 'react';
import Grid from '@material-ui/core/Grid';

class Impressum extends Component {
  render() {
    return (
      <Grid container spacing={16} justify="center" style={{width: '100%'}}>
        <h1>Impressum</h1>
        <p>TODO: muss noch programmiert werden</p>
        <p>Lorem ipsum dolor sit amet, consetetur sadipscing elitr,
          sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat,
          sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum.
          Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.
          Lorem ipsum dolor sit amet, consetetur sadipscing elitr,
          sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat,
          sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum.
          Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.</p>
      </Grid>
    );
  }
}

export default Impressum;