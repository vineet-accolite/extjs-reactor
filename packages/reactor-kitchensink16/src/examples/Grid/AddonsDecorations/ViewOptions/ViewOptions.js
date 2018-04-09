import React, {Component} from 'react';
import { Grid, Column, Toolbar } from '@extjs/ext-react';
import model from '../../CompanyModel';

Ext.require(['Ext.grid.plugin.ViewOptions']);

export default class ViewOptionsGridExample extends Component {

  store = Ext.create('Ext.data.Store', {
    autoLoad: true,
    pageSize: 0,
    proxy: {
      type: 'ajax',
      url: 'resources/data/CompanyData.json'
    } 
  });

  render() {
    return (
      <Grid
        title="Grid with View Options"
        store={this.store}
        plugins="gridviewoptions"
        shadow
      >
        <Toolbar docked="top">
          <div style={{fontSize: '14px', fontWeight: 'normal'}}>Long press on a column header to customize this grid.</div>
        </Toolbar>
        <Column text="Company" dataIndex="name" width="150"/>
        <Column text="Phone" dataIndex="phone" width="100" hidden/>
        <Column text="Industry" dataIndex="industry" width="150" hidden/>
        <Column text="Price" dataIndex="price" width="75" formatter="usMoney" />
        <Column text="Change" width="100" dataIndex="priceChange" tpl={this.signTpl.bind(this, 'priceChange', '0.00')} cell={{ encodeHtml: false }}/>
        <Column text="% Change" dataIndex="priceChangePct" tpl={this.signTpl.bind(this, 'priceChangePct', '0.00%')} cell={{ encodeHtml: false }}/>
        <Column text="Last Updated" dataIndex="priceLastChange" width="125" formatter="date('m/d/Y')"/>
      </Grid>
    )
  }

  signTpl = (field, format, data) => {
    const value = data[field];
    return (
      <span style={{ color: value > 0 ? 'green' : value < 0 ? 'red' : ''}}>
        {Ext.util.Format.number(value, format)}
      </span>
    )
  }
}