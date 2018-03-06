import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux'
import { TitleBar, Container, NestedList, Panel, Button, Transition } from '@extjs/ext-react';

import * as actions from './actions';

class Layout2 extends Component {
  render() {
    console.log('props$$$$$$$$$$$$$$$$$$$$$$')
    console.log(this.props.showCode)
    return (
      <Panel title={this.props.showCode+'a'} layout="hbox" cls="main-background">
        <div>a{this.props.showCode+'a'}a</div>
      </Panel>
    )
  }
}

const mapStateToProps = (state) => {
  console.log('state$$$$$$$$$$$$$$$$$$$$$$')
  console.log(state.showCode)
  return { ...state }
  // return {
  //   showCode : state.showCode
  // }
}

const mapDispatchToProps = (dispatch) => {
  const actionCreators = {};
  for (let key in actions) {
    const action = actions[key];
    if (typeof action === 'function') {
      actionCreators[key] = action;
    }
  }
  return { actions: bindActionCreators(actionCreators, dispatch) };
}

export default connect(mapStateToProps, mapDispatchToProps)(Layout2)