'use strict';
import React, {Component} from 'react';
import compose from 'recompose/compose';
import {connect} from 'react-redux';
import Typography from '@material-ui/core/Typography';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import {findById} from './../../utils/RamdaUtils';
import {DATE_FORMAT} from './../../utils/Format';
import {
  IconBatteryFull,
  IconBatteryHigh,
  IconBatteryLow,
  IconBatteryMid,
  IconGift,
  IconHeart
} from './../../utils/Icons';

import {green, red, yellow} from '@material-ui/core/colors';
import {PRIMARY, SECONDARY} from './../../utils/Style';
import moment from 'moment';

export const getMembershipIcon = key => getIcon(100, 0, key);

export const getIcon = (maxParticipations, participations, key) => {
  if (key === undefined || key === null) {
    return key;
  }

  const style = {marginRight: '0px'}
  if (key === 'TRIAL') {
    return <IconGift size={24} color={SECONDARY} style={style}/>;
  } else if (key === 'SUBSCRIPTION') {
    return <IconHeart size={24} color={PRIMARY} style={style}/>;
  }

  const p = participations / maxParticipations;
  if (p > 0.75) {
    return <IconBatteryLow size={24} color={red.A200} style={style}/>
  } else if (p > 0.5) {
    return <IconBatteryMid size={24} color={yellow.A200} style={style}/>
  } else if (p > 0.25) {
    return <IconBatteryHigh size={24} color={green.A200} style={style}/>
  } else {
    return <IconBatteryFull size={24} color={green.A200} style={style}/>
  }
};

const geParticipationtText = (maxParticipations, participations, key) => {
  if (key === 'SUBSCRIPTION') {
    return "Du hast dich bisher für " + participations + " Kurse angemeldet";
  }
  return maxParticipations - participations + " von " + maxParticipations + " frei";
};

const getValidityText = validity => {
  const from = moment(validity.from).format(DATE_FORMAT);
  const to = validity.to ? moment(validity.to).format(DATE_FORMAT) : "unbestimmt";
  return "Gültigkeit: " + from + " - " + to;
};

class MyMembership extends Component {

  render() {
    const {membership, membershipTypes} = this.props;
    const {participationCount, validity, membershipTypeid} = membership;
    const {
      key,
      name,
      description,
      maxParticipations
    } = findById(membershipTypes.data, membership.membershipTypeId) || {};

    return (
      <ListItem
        button
        onClick={() => {}}>
        <ListItemIcon>
          {getIcon(maxParticipations, participationCount, key)}
        </ListItemIcon>
        <div style={{flex: '1 1 auto', padding: '0 16px', minWidth: '0'}}>
          <Typography variant='subheading'>{name}</Typography>
          <Typography variant='caption'>{geParticipationtText(maxParticipations, participationCount, key)}</Typography>
          <Typography variant='caption'>{getValidityText(validity)}</Typography>
        </div>
      </ListItem>
    );
  };
}

const mapStateToProps = state => ({
  membershipTypes: state.membershipTypes,
});

export default compose(
  connect(mapStateToProps)
)(MyMembership);