'use strict';
import React, {Component} from 'react';
import compose from 'recompose/compose';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import Typography from '@material-ui/core/Typography';
import {LoadingIndicator} from '../components/general';
import {
  fetchStatistics
} from './../model/statistics';
import {withStyles} from "@material-ui/core/styles/index";
import * as Style from "./../utils/Style";
import {comparingModFunc} from "./../utils/Comparator";
import {findById} from './../utils/RamdaUtils';
import {TypeMapper} from "../components/course";
import moment from 'moment';
import {Bar} from 'react-chartjs';

class Statistics extends Component {

  render() {
    const {profile, user, statistics, courseTypes, actions} = this.props;
    const {fetchStatistics} = actions;
    if (profile.pending || statistics.pending || !user) {
      return (<LoadingIndicator/>);
    }

    if (user.id) {
      fetchStatistics(user.id);
    }

    const {name = "", color} = findById(courseTypes.data, statistics.data.favouriteCourseTypeId) || TypeMapper.UNKNOWN;
    const participationsPerMonth = statistics.data.participationsPerMonth;
    const sorted = Object.keys(participationsPerMonth)
      .sort(comparingModFunc(value => value, moment))
    return (
      <div className={this.props.classes.root}>
        <Grid container spacing={16} justify="center" style={{width: '100%', margin: '0px'}}>
          <Grid item xs={12} sm={8}>
            <Card>
              <CardHeader title='Dein Lieblingskurs'/>
              <CardContent>
                <Typography>
                  {name}
                </Typography>
                <Typography variant='caption'>
                  {'Du hast an diesem Kurs bereits ' + statistics.data.favouriteCourseParticipations + ' mal teilgenommen.'}
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={8}>
            <Card>
              <CardHeader title='Statistiken'/>
              <CardContent>
                <Typography>
                  Hier siehst du, wie oft du in den letzten Wochen und Monaten an Kursen teilgenommen hast.
                </Typography>
                <div style={{paddingTop: '16px', width: '100%'}}>
                  <Bar
                    options={{
                      responsive: true,
                      scaleShowVerticalLines: false
                    }}
                    data={{
                      labels: sorted
                        .map(key => moment(key).format('MMMM')),
                      datasets: [{
                        label: 'Teilnahmen',
                        fillColor: Style.PRIMARY,
                        data: sorted
                          .map(key => participationsPerMonth[key])
                    }]
                  }}/>
                </div>
              </CardContent>
            </Card>
          </Grid>

        </Grid>
      </div>
    );

  }
}

const mapStateToProps = state => ({
  profile: state.profile,
  user: state.profile.user,
  statistics: state.statistics,
  courseTypes: state.courseTypes
});

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators({
    // statistics
    fetchStatistics: fetchStatistics,
  }, dispatch),
  dispatch
});

export default compose(
  withStyles(Style.APP_STYLES, {withTheme: true}),
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
)(Statistics);