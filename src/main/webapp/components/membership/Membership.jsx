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
import {bindActionCreators} from "redux";
import {fetchMemberships} from "../../model/memberships";
import {withStyles} from "@material-ui/core/styles";
import * as Style from "../../utils/Style";
import Avatar from "@material-ui/core/Avatar";
import {ProfilePicture} from "../profile";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import IconButton from "@material-ui/core/IconButton";
import {IconMoreVert} from "../../utils/Icons";
import {setPath, viewPath} from "../../utils/RamdaUtils";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import Grid from "@material-ui/core/Grid";

class Membership extends Component {

  getValidityText = () => {
    const {membership} = this.props;
    const {validity} = membership;
    const now = moment();
    const from = moment(validity.from);
    const to = moment(validity.to);
    if (!!to && now.isAfter(to)) {
      return 'abgelaufen seit ' + to.format(DATE_FORMAT);
    }
    if (now.isBefore(from)) {
      return 'gültig ab ' + from.format(DATE_FORMAT);
    }
    if (!!to) {
      return 'gültig bis ' + from.format(DATE_FORMAT);
    }
    return 'ungebstimmt gültig';
  };

  render() {
    const {membership, membershipTypes, actions} = this.props;
    const {user, validity} = membership;
    const {
      key,
      name,
      description,
      maxParticipations
    } = findById(membershipTypes.data, membership.membershipTypeId) || {};
    const {showMembershipDetails} = actions;
    return (
      <ListItem
        button
        onClick={() => showMembershipDetails(id)}>
        <ListItemIcon>
          <Avatar>
            <ProfilePicture user={user} asAvatar/>
          </Avatar>
        </ListItemIcon>
        <ListItemText>
          <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between'}}>
          <Typography>{user.firstname + ' ' + user.lastname}</Typography>
          <Typography variant='caption'>{name}</Typography>
          </div>
          <Typography variant='caption'>{this.getValidityText()}</Typography>
        </ListItemText>
      </ListItem>
    );
  }
}

const mapStateToProps = state => ({
  membershipTypes: state.membershipTypes,
});

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators({
    // memberships
    fetchMemberships: fetchMemberships
  }, dispatch),
  dispatch
});

export default compose(
  withStyles(Style.APP_STYLES, {withTheme: true}),
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
)(Membership);