import React, {Component} from 'react';
import { Grid, Column } from '@extjs/ext-react';
import model from '../../CompanyModel';

Ext.require([
    'Ext.grid.plugin.SummaryRow',
    'Ext.data.summary.Average',
    'Ext.data.summary.Max',
]);

export default class RowBodyGridExample extends Component {

  store = Ext.create('Ext.data.Store', {
    model,
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
          title="Summary Row Grid"
          store={this.store}
          shadow
          plugins={{
              gridsummaryrow: true
          }}
      >
        <Column 
          text="Company" 
          dataIndex="name" 
          width="150"
          summaryRenderer={this.summarizeCompanies}
        />
        <Column 
          text="Price" 
          width="75" 
          dataIndex="price" 
          formatter="usMoney" 
          summary="average"
        />
        <Column 
          text="Change" 
          width="90" 
          dataIndex="priceChange" 
          tpl={this.signTpl.bind(this, 'priceChange', '0.00')} 
          cell={{ encodeHtml: false }}
          summary="max" 
        />
        <Column 
          text="% Change" 
          width="100"
          dataIndex="priceChangePct" 
          tpl={this.signTpl.bind(this, 'priceChangePct', '0.00%')} 
          cell={{ encodeHtml: false }}
          summary="average" 
        />
        <Column 
          text="Last Updated" 
          width="125" 
          dataIndex="priceLastChange" 
          formatter="date('m/d/Y')" 
          summary="max"
        />
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

  renderSign = (format, value) => (
      <span style={{ color: value > 0 ? 'green' : value < 0 ? 'red' : ''}}>
          {Ext.util.Format.number(value, format)}
      </span>
  )

  summarizeCompanies = (grid, context) => context.records.length + ' Companies';
}