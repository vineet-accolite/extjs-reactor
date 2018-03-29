import React, { Component } from 'react'

import { ExtReact, Grid,Toolbar, Column } from '@extjs/ext-react';
import model from './grid/CompanyModel';
import { Template } from '@extjs/reactor';

Ext.require([
    'Ext.grid.plugin.Editable',
    'Ext.grid.plugin.CellEditing',
    'Ext.data.validator.Presence',
    'Ext.data.validator.Number',
    'Ext.data.validator.Date'
]);

export default class AppGrid extends Component {

  // store = Ext.create('Ext.data.Store', {
  //   autoLoad: true,
  //   model,
  //   pageSize: 0,
  //   proxy: {
  //     type: 'ajax',
  //     url: 'build/CompanyData.json'
  //   }
  // });


  render() {
    return (
      <ExtReact> 
        <Grid 
          title='Stock Prices'
          shadow 
//          store={this.store}
        >

        <Toolbar docked="top">
        <div style={{color: '#666', fontSize: '13px' }}>f</div>
        </Toolbar>

          <Column 
            text="Company" 
            width="150" 
            dataIndex="name" 
            editable
          />
          <Column 
            text="Change" 
            width="90" 
            //renderer={this.renderSign.bind(this, '0.00')}
            dataIndex="change" 
          />




        </Grid>
      </ExtReact>
    )
  }

}
