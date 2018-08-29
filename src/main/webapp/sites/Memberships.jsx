'use strict';
import React, {Component} from 'react';
import compose from 'recompose/compose';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import {
  fetchMemberships,
} from '../model/memberships';
import {withStyles} from '@material-ui/core/styles/index';
import * as Style from './../utils/Style';
import moment from 'moment';
import {PullToRefresh} from './../components/general';
import {findById} from "../utils/RamdaUtils";
import {DATE_FORMAT} from "../utils/Format";
import {withRouter} from 'react-router-dom';

import {IntegratedFiltering, IntegratedSorting, SearchState, SortingState,} from '@devexpress/dx-react-grid';
import {Grid as DxGrid, SearchPanel, Table, TableHeaderRow, Toolbar,} from '@devexpress/dx-react-grid-material-ui';

class Memberships extends Component {

  onRowSelect = selectedMembership => {
    const {history} = this.props;
    history.push('/memberships/membership/' + selectedMembership.id);
  };

  render() {
    const {memberships, membershipTypes, actions} = this.props;
    const {pending, data} = memberships;
    const {fetchMemberships} = actions;

    if (!pending) {
      fetchMemberships(false); // no force refresh on render
    }

    const columns = [
      {
        name: 'user_firstname',
        title: 'Vorname',
        getCellValue: row => (row.user ? row.user.firstname : undefined)
      },
      {
        name: 'user_lastname',
        title: 'Nachname',
        getCellValue: row => (row.user ? row.user.lastname : undefined)
      },
      {
        name: 'membershiptypeid', title: 'Mitgliedschaft',
        getCellValue: row => {
          const {name} = findById(membershipTypes.data, row.membershipTypeId) || {};
          return name;
        }
      },
      {
        name: 'validity_from',
        title: 'Gültig von',
        getCellValue: row => (row.validity ? moment(row.validity.from).format(DATE_FORMAT) : undefined)
      },
      {
        name: 'validity_to',
        title: 'Gültig bis',
        getCellValue: row => (row.validity ? moment(row.validity.to).format(DATE_FORMAT) : undefined)
      },
    ];

    return (
      <div className={this.props.classes.root}>
        <PullToRefresh
          pending={pending}
          onRefresh={() => fetchMemberships(true)}>
          <Grid container spacing={16} justify="center" style={{width: '100%', margin: '0px'}}>
            <Grid item xs={12} sm={8}>
              <Card>
                <CardHeader title='Mitgliedschaften'/>
                <CardContent>
                  <Typography>{'Insgesamt gibt es ' + data.length + ' Mitgliedschaften'}</Typography>
                </CardContent>
                <CardContent style={{padding: '0px'}}>
                  <DxGrid
                    rows={data}
                    columns={columns}>
                    <SearchState/>
                    <SortingState defaultSorting={[{columnName: 'user_firstname', direction: 'asc'}]}/>
                    <IntegratedFiltering/>
                    <IntegratedSorting/>

                    <Table
                      rowComponent={({row, ...props}) => (
                        <Table.Row
                          {...props}
                          onClick={() => this.onRowSelect(row)}
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
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </PullToRefresh>
      </div>
    );
  }
}

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

export default compose(
  withRouter,
  withStyles(Style.APP_STYLES, {withTheme: true}),
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
)(Memberships);