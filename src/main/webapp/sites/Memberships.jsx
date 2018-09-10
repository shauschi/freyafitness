'use strict';
import React, {Component} from 'react';
import compose from 'recompose/compose';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import Typography from '@material-ui/core/Typography';
import Badge from '@material-ui/core/Badge';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import TextField from '@material-ui/core/TextField';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import {fetchMemberships,} from '../model/memberships';
import {withStyles} from '@material-ui/core/styles/index';
import * as Style from './../utils/Style';
import moment from 'moment';
import {PullToRefresh} from './../components/general';
import {findBy, findById, setPath, togglePath} from "../utils/RamdaUtils";
import {DATE_FORMAT} from "../utils/Format";
import {withRouter} from 'react-router-dom';
import {getIcon} from './../components/membership';
import Fuse from 'fuse.js';

const infinity = '\u221E';

const mapStateToProps = state => ({
  courses: state.courses,
  memberships: state.memberships,
  membershipTypes: state.membershipTypes,
});

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators({
    // memberships
    fetchMemberships: fetchMemberships,
  }, dispatch),
  dispatch
});

class _MembershipItem extends Component {

  onClick = selectedMembership => {
    const {history} = this.props;
    history.push('/memberships/membership/' + selectedMembership.id);
  };

  render() {
    const {membership, membershipTypes, key} = this.props;
    const {key, maxParticipations} = findById(membershipTypes.data, membership.membershipTypeId) || {};
    let max = maxParticipations;
    if (max === -1) {
      max = infinity;
    }

    return <ListItem button onClick={() => this.onClick(membership)}>
      <ListItemIcon>
        {getIcon(maxParticipations, membership.participationCount, key)}
      </ListItemIcon>
      <Grid container spacing={0} justify="center" style={{width: '100%', padding: '8px'}}>
        <Grid item xs={8}>
          <Typography>{membership.user.firstname + ' ' + membership.user.lastname}</Typography>
        </Grid>
        <Grid item xs={4}>
          <Typography>
            {moment(membership.validity.from).format(DATE_FORMAT)}
          </Typography>
        </Grid>
        <Grid item xs={8}>
          <Typography variant='caption'>
            {membership.participationCount + ' von ' + max}
          </Typography>
        </Grid>
        <Grid item xs={4}>
          <Typography>
            {
              membership.validity.to
              ? moment(membership.validity.to).format(DATE_FORMAT)
              : infinity
            }
          </Typography>
        </Grid>
      </Grid>
    </ListItem>
  }
}

const MembershipItem = compose(
  withRouter,
  withStyles(Style.APP_STYLES, {withTheme: true}),
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
)(_MembershipItem);

class BatchedButton extends Component {

  render() {
    const {selected, id, label, onClick, badgeContent} = this.props;
    const button = <Button
      variant={selected ? 'raised' : 'outlined'}
      size='small'
      onClick={onClick}
      color='secondary'>
      {label}
    </Button>;

    if (selected) {
      return button;
    }
    return (
      <Badge
        badgeContent={badgeContent}
        color='primary'>
        {button}
      </Badge>
    );
  }
}

class Memberships extends Component {

  state = {
    search: '',
    filter: {
      card10: false,
      abo: false,
      trial: false,
      extended: false,
      valid: true,
    },
    showInvalid: false,
  };

  onRowSelect = selectedMembership => {
    const {history} = this.props;
    history.push('/memberships/membership/' + selectedMembership.id);
  };

  toggleFilter = id => {
    const updated = togglePath(['filter', id], this.state);
    this.setState(setPath(['search'], '', updated));
  };

  setSearch = event => {
    this.setState(setPath(['search'], event.target.value, this.state));
  };

  render() {
    const {search, showInvalid, filter} = this.state;
    const {memberships, membershipTypes, actions} = this.props;
    const {pending, data} = memberships;
    const {fetchMemberships} = actions;

    if (!pending) {
      fetchMemberships(false); // no force refresh on render
    }

    const dataFilter = {
      card10: data => {
        const card10 = findBy('key', membershipTypes.data, 'CARD_10') || {};
        return data.filter(m => m.membershipTypeId === card10.id);
      },
      abo: data => {
        const abo = findBy('key', membershipTypes.data, 'SUBSCRIPTION') || {};
        return data.filter(m => m.membershipTypeId === abo.id);
      },
      trial: data => {
        const trial = findBy('key', membershipTypes.data, 'TRIAL') || {};
        return data.filter(m => m.membershipTypeId === trial.id);
      },
      extended: data => {
        const now = moment();
        return data.filter(m => m.validity.to && moment(m.validity.to) < now);
      },
      valid: data => {
        const now = moment();
        return data.filter(m => m.validity.from && moment(m.validity.from) <= now
          && (!m.validity.to || moment(m.validity.to) >= now));
      },
      search: data => {
        const options = {
          shouldSort: true,
          threshold: 0.6,
          location: 0,
          distance: 100,
          maxPatternLength: 32,
          minMatchCharLength: 1,
          keys: [
            'user.firstname',
            'user.lastname',
          ]
        };
        const fuse = new Fuse(data, options);
        return fuse.search(search);
      }
    };

    let filtered = data;
    for (const f in dataFilter) {
      if (filter[f]) {
        filtered = dataFilter[f](filtered);
      }
    }

    const possibleData = {};
    for (const f in dataFilter) {
      possibleData[f] = [];
      if (!filter[f]) {
        possibleData[f] = dataFilter[f](filtered);
      }
    }



    return (
      <div className={this.props.classes.root}>
        <PullToRefresh
          pending={pending}
          onRefresh={() => fetchMemberships(true)}>
          <Grid container spacing={16} justify="center" style={{width: '100%', margin: '0px'}}>
            <Grid item xs={12} md={10}>
              <Card>
                <CardHeader title='Mitgliedschaften'/>
                <CardContent>
                  <Grid container spacing={16} style={{width: '100%', margin: '0px'}}>
                    <Grid item xs={12}>
                      <Typography>{'Insgesamt gibt es ' + data.length + ' Mitgliedschaften'}</Typography>
                    </Grid>
                    <Grid item>
                      <BatchedButton
                        id='card10'
                        label='10er'
                        selected={filter.card10}
                        onClick={() => this.toggleFilter('card10')}
                        badgeContent={possibleData.card10.length}/>
                    </Grid>
                    <Grid item>
                      <BatchedButton
                        id='abo'
                        label='Abo'
                        selected={filter.abo}
                        onClick={() => this.toggleFilter('abo')}
                        badgeContent={possibleData.abo.length}/>
                    </Grid>
                    <Grid item>
                      <BatchedButton
                        id='trial'
                        label='Probem.'
                        selected={filter.trial}
                        onClick={() => this.toggleFilter('trial')}
                        badgeContent={possibleData.trial.length}/>
                    </Grid>
                    <Grid item>
                      <BatchedButton
                        id='extended'
                        label='Abgelaufen'
                        selected={filter.extended}
                        onClick={() => this.toggleFilter('extended')}
                        badgeContent={possibleData.extended.length}/>
                    </Grid>
                    <Grid item>
                      <BatchedButton
                        id='valid'
                        label='Gültig'
                        selected={filter.valid}
                        onClick={() => this.toggleFilter('valid')}
                        badgeContent={possibleData.valid.length}/>
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        id='search'
                        label='Suche nach Namen'
                        fullWidth
                        value={search}
                        onChange={this.setSearch}
                        type='search'
                      />
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={10}>
              <Card>
                <CardContent style={{padding: '0px'}}>
                  <List>
                    {
                      filtered.map((membership, key) => <MembershipItem key={key} membership={membership}/>)
                    }
                  </List>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </PullToRefresh>
      </div>
    );
  }
}

export default compose(
  withRouter,
  withStyles(Style.APP_STYLES, {withTheme: true}),
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
)(Memberships);