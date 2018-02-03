'use strict';
import React, {Component} from 'react';
import compose from 'recompose/compose';
import {withStyles} from 'material-ui/styles';
import SwipeableViews from 'react-swipeable-views';
import {autoPlay} from 'react-swipeable-views-utils';
import MobileStepper from 'material-ui/MobileStepper';
import Button from 'material-ui/Button';
import KeyboardArrowLeft from 'material-ui-icons/KeyboardArrowLeft';
import KeyboardArrowRight from 'material-ui-icons/KeyboardArrowRight';
import {LoadingIndicator} from '.';

const EnhancedSwipeableViews = autoPlay(SwipeableViews);

const sliderStyles = () => ({
  container: {
    position: 'relative'
  },
  stepper: {
    background: 'none',
    height: '38px',
    width: '100%',
    padding: '0'
  },
  stepperContainer: {
    position: 'absolute',
    bottom: '0',
    width: '100%'
  }
});

class Slider extends Component {

  constructor(props) {
    super(props);
    this.state = {
      index: 0
    };
    this.handleChangeIndex = this.handleChangeIndex.bind(this);
    this.handleNext = this.handleNext.bind(this);
    this.handleBack = this.handleBack.bind(this);
  }

  handleChangeIndex(index) {
    this.setState({index: index});
  }

  handleNext() {
    const current = this.state.index;
    let next = current + 1;
    this.setState({index: next});
  }

  handleBack() {
    const current = this.state.index;
    let next = current - 1;
    this.setState({index: next});
  }

  render()
  {
    const {loading, classes, children = []} = this.props;
    const {index} = this.state;

    return (
      <div className={classes.container}>
        <EnhancedSwipeableViews
          disableLazyLoading={true}
          index={index}
          interval={5000}
          onChangeIndex={this.handleChangeIndex}>
          {loading ? <LoadingIndicator/> : children}
        </EnhancedSwipeableViews>

        <div className={classes.stepperContainer}>
          <MobileStepper
            type="dots"
            steps={children.length}
            activeStep={index % children.length}
            position="static"
            className={classes.stepper}
            nextButton={
              <Button dense onClick={this.handleNext}>
                <KeyboardArrowRight/>
              </Button>
            }
            backButton={
              <Button dense onClick={this.handleBack}>
                <KeyboardArrowLeft/>
              </Button>
            }
          />
        </div>
      </div>
    );
  };
}

export default compose(
  withStyles(sliderStyles)
)(Slider);