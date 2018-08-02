'use strict';
import React, {Component} from 'react';
import compose from 'recompose/compose';
import {withStyles} from '@material-ui/core/styles';
import classnames from 'classnames';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import Collapse from '@material-ui/core/Collapse';
import CardActions from '@material-ui/core/CardActions';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import {IconExpandMore} from '../../utils/Icons';
import moment from 'moment';
import * as Format from '../../utils/Format';

const styles = theme => ({
  expand: {
    transform: 'rotate(0deg)',
    transition: theme.transitions.create('transform', {
      duration: theme.transitions.duration.shortest,
    }),
    marginLeft: 'auto',
    [theme.breakpoints.up('sm')]: {
      marginRight: -8,
    },
  },
  expandOpen: {
    transform: 'rotate(180deg)',
  },
});

class NewsItem extends Component {

  state = {
    expanded: false
  };

  handleExpandClick = () => {
    this.setState(state => ({ expanded: !state.expanded }));
  };

  render() {
    const {classes, title, teaser, text, validity, img} = this.props;
    return (
      <div>
        <CardMedia
          component={'img'}
          image={img}
          title={title}
        />
        <CardContent>
          <Grid container spacing={16} justify="center" style={{width: '100%', margin: '0px'}}>
            <Grid item xs={10}>
              <Typography variant='title'>
                {title}
              </Typography>
              <Typography variant='caption' gutterBottom>
                {'Beitrag vom: ' + moment(validity.from).format(Format.DATE_FORMAT)}
              </Typography>
              <Typography>
                {teaser}
              </Typography>
            </Grid>
            <Grid item xs={2}>
              <IconButton
                className={classnames(classes.expand, {
                  [classes.expandOpen]: this.state.expanded,
                })}
                onClick={this.handleExpandClick}
                aria-expanded={this.state.expanded}
                aria-label="Show more"
              >
                <IconExpandMore/>
              </IconButton>
            </Grid>
          </Grid>
        </CardContent>
        <Collapse in={this.state.expanded} timeout="auto" unmountOnExit>
          <CardContent>
            <Typography>
              {text}
            </Typography>
          </CardContent>
        </Collapse>
      </div>
    );
  };
}

export default compose(
  withStyles(styles)
)(NewsItem);