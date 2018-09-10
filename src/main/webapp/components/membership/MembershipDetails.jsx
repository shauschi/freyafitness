'use strict';
import React, {Component} from 'react';
import compose from 'recompose/compose';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {findById, viewPath} from './../../utils/RamdaUtils';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Avatar from '@material-ui/core/Avatar';
import {ProfilePicture} from './../profile';
import {Dialog, GridDateControl, GridItemSelectControl, GridTextControl} from './../general';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import {ValidationGroup} from './../general/validation';
import {
  createMembership,
  deleteMembership,
  deleteParticipation,
  fetchMembership,
  hideCreateMembership,
  onMembershipDetailsDataChanged,
  saveMembership,
} from '../../model/memberships';
import moment from 'moment/moment';
import * as Format from '../../utils/Format';
import {TIMESTAMP_FORMAT_DE} from '../../utils/Format';
import {showNotification} from '../../model/notification';
import {updateUsers} from '../../model/profile';
import {TITLE_BG} from "../../utils/Style";
import {Validators} from "../general/validation";
import {getMembershipIcon} from '.';
import {withRouter} from 'react-router-dom';
import {
  DataTypeProvider,
  IntegratedFiltering,
  IntegratedSorting,
  SearchState,
  SortingState,
} from '@devexpress/dx-react-grid';
import {Grid as DxGrid, SearchPanel, Table, TableHeaderRow, Toolbar,} from '@devexpress/dx-react-grid-material-ui';
import {setPath} from "../../utils/RamdaUtils";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import {ConfirmButton} from "../general";
import {IconDeleteForever} from "../../utils/Icons";

const DateFormatter = ({value}) => moment(value).format(TIMESTAMP_FORMAT_DE);

class MembershipDetails extends Component {

  state = {
    participation: {
      anchor: null,
      participation: null
    }
  };

  componentWillMount = () => {
    const {match, actions} = this.props;
    const {fetchMembership, updateUsers} = actions;
    const id = match.params.id;
    fetchMembership(id);
    updateUsers();
  };

  handleRequestClose = () => {
    this.props.history.goBack();
  };

  handleRequestSave = () => {
    if (this.validateForm()) {
      const {history} = this.props;
      const data = viewPath(['memberships', 'details', 'data'], this.props);
      this.props.actions.saveMembership(data, history.goBack);
    }
  };

  handleRequestDelete = () => {
    const {history} = this.props;
    const id = viewPath(['memberships', 'details', 'data', 'id'], this.props);
    this.props.actions.deleteMembership(id, history.goBack);
  };

  validateForm = () => {
    const result = this.validationGroup.validate();
    return result.valid;
  };

  setValidation = ref => {
    this.validationGroup = ref;
  };

  openMenu = (event, participation) => {
    this.setState(setPath(['participation'], {anchor: event.currentTarget, participation: participation}, this.state));
  };

  closeMenu = () => {
    this.setState(setPath(['participation'], {anchor: null, participation: null}, this.state));
  };

  getCourseMenu = () => {
    const {anchor, participation} = this.state.participation;
    const {deleteParticipation, moveParticipation} = this.props.actions;
    return <Menu
      open={!!anchor}
      anchorEl={anchor}
      onClose={this.closeMenu}>
      <MenuItem onClick={() => {this.closeMenu(); moveParticipation(participation.id);}}>
        <span style={{marginLeft: '8px'}}>anderer Mitgliedschaft zuordnen</span>
      </MenuItem>
      <MenuItem onClick={() => {this.closeMenu(); deleteParticipation(participation.id);}}>
        <span style={{marginLeft: '8px'}}>Teilnahme löschen</span>
      </MenuItem>
    </Menu>
  };

  renderParticipations = () => {
    const {memberships, courseTypes} = this.props;
    const participations = viewPath(['details', 'data', 'participations'], memberships);

    if (memberships.details.pending) {
      return;
    }


    const columns = [
      {
        name: 'course_start',
        title: 'Kursbeginn',
        getCellValue: row => row.course.start
      },
      {
        name: 'course_type',
        title: 'Kurs',
        getCellValue: row => {
          const {name} = findById(courseTypes.data, row.course.courseTypeId) || {};
          return name;
        }
      },

    ];

    return (
      <DxGrid
        rows={participations}
        columns={columns}>

        <SearchState/>
        <SortingState defaultSorting={[{columnName: 'course_start', direction: 'asc'}]}/>
        <IntegratedFiltering/>
        <IntegratedSorting/>

        <DataTypeProvider
          {
            ...{
              for: ['course_start'],
              formatterComponent: DateFormatter
            }
          }
          />

        <Table
          rowComponent={({row, ...props}) => (
            <Table.Row
              {...props}
              onClick={e => this.openMenu(e, row)}
              style={{
                cursor: 'pointer',
              }}
            />
          )}
          messages={{noData: 'Keine Daten verfügbar'}}/>

        <TableHeaderRow
          messages={{sortingHint: 'Sortiert'}}/>
        <Toolbar/>
        <SearchPanel messages={{searchPlaceholder: 'Suchen...'}}/>
      </DxGrid>
    );
  };

  render() {
    const {memberships, membershipTypes, match, users, actions} = this.props;
    const {params} = match;
    const {id} = params;
    const {fetchMembership, updateUsers, onMembershipDetailsDataChanged} = actions;
    const {details} = memberships;
    const {pending, data, error, participations} = details;

    const {user, membershipTypeId, validity} = data;
    const {
      key,
      name,
      description,
      maxParticipations
    } = findById(membershipTypes.data, membershipTypeId) || {};

    return (
      <Dialog
        title='Mitgliedschaft'
        onClose={this.handleRequestClose}
        open={true}>
        <DialogContent style={{padding: '0', paddingTop: '12px'}}>
          {this.getCourseMenu()}
          <Grid container spacing={8} justify='center' style={{width: '100%', margin: '0px', padding: '16px'}}>
            <ValidationGroup ref={this.setValidation}>
              <Grid item xs={2} sm={1} style={{margin: 'auto'}}>
                <Avatar style={{backgroundColor: TITLE_BG}}>
                  <ProfilePicture user={user} />
                </Avatar>
              </Grid>
              <GridItemSelectControl
                xs={10}
                sm={5}
                id='user'
                label='Benutzer'
                value={user.id}
                validators={[Validators.notEmpty()]}
                values={users.data}
                keyProp='id'
                valueProp={user => user.firstname + ' ' + user.lastname}
                onChange={value => onMembershipDetailsDataChanged(['userId'], value)}
              />
              <Grid item xs={2} sm={1} style={{margin: 'auto'}}>
                <Avatar>
                  {getMembershipIcon(key)}
                </Avatar>
              </Grid>
              <GridItemSelectControl
                xs={10}
                sm={5}
                id='membershipTypeId'
                label='Mitgliedschaft'
                value={membershipTypeId}
                validators={[Validators.notEmpty()]}
                values={membershipTypes.data}
                keyProp='id'
                valueProp='name'
                onChange={value => onMembershipDetailsDataChanged(['membershipTypeId'], value)}
              />
              <GridTextControl
                text={description}/>
              <GridDateControl
                xs={6}
                id='validity_from'
                label='Gültig von'
                value={validity.from ? moment(validity.from) : null}
                validators={[Validators.notEmpty()]}
                onChange={value => {
                  if (!value.isValid()) {
                    return;
                  }
                  onMembershipDetailsDataChanged(['validity', 'from'], value.format(Format.TIMESTAMP_FORMAT));
                }}
              />
              <GridDateControl
                xs={6}
                id='validity_to'
                label='Gültig bis'
                value={validity.to ? moment(validity.to) : null}
                validators={[Validators.notEmpty()]}
                onChange={value => {
                  let newValue = null;
                  if (value && value.isValid()) {
                    newValue = value.format(Format.TIMESTAMP_FORMAT);
                  }
                  onMembershipDetailsDataChanged(['validity', 'to'], newValue);
                }}
                clearable={true}
              />
              {error ? <GridTextControl text={error} error={true}/> : undefined}
            </ValidationGroup>

            <Grid item xs={12} sm={8}>
              <ConfirmButton
                question='Möchtest du diese Mitgliedschaft wirklich löschen? Dadurch werden auch ALLE Teilnahmen an Kursen gelöscht und können nicht wieder hergestellt werden.'
                onClick={this.handleRequestDelete}
                variant='raised'
                color='secondary'
                fullWidth
                pending={false}
              >
                Mitgliedschaft löschen<IconDeleteForever style={{marginLeft: '8px'}} size={16}/>
              </ConfirmButton>
            </Grid>


            <GridTextControl
              text={'Hier kannst du die Kursteilnahmen einsehen, die bisher auf dieses Karte gebucht wurden.'}/>
            {this.renderParticipations()}

          </Grid>
        </DialogContent>
        <DialogActions>
          <Button color='primary' onClick={this.handleRequestSave} disabled={pending}>
            {'Speichern'}
          </Button>
          <Button onClick={this.handleRequestClose} disabled={pending}>
            {'Schließen'}
          </Button>
        </DialogActions>
      </Dialog>
    );
  };
}

const mapStateToProps = state => ({
  membershipTypes: state.membershipTypes,
  users: state.profile.users,
  memberships: state.memberships,
  courseTypes: state.courseTypes,
});

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators({
    showNotification: showNotification,
    // users
    updateUsers: updateUsers,
    // participatoins
    deleteParticipation: deleteParticipation,
    // membership
    hideCreateMembership: hideCreateMembership,
    onMembershipDetailsDataChanged: onMembershipDetailsDataChanged,
    createMembership: createMembership,
    fetchMembership: fetchMembership,
    saveMembership: saveMembership,
    deleteMembership: deleteMembership,
  }, dispatch),
  dispatch
});

export default compose(
  withRouter,
  connect(mapStateToProps, mapDispatchToProps)
)(MembershipDetails);