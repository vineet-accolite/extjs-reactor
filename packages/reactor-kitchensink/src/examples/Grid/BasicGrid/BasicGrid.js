import React, { Component } from 'react';
import { Grid, Column, RendererCell, LoadMask } from '@extjs/ext-react';

export default class BasicGridExample extends Component {

    state = {
        data: null
    }

    componentWillMount() {
        Ext.Ajax.request({
            url: 'resources/data/CompanyData.json',
            success: (response) => {
                this.setState({ 
                    data: JSON.parse(response.responseText)
                });
            }
        })
    }

    render() {
        const { data, loading } = this.state;

        return (
            <Grid 
                title="Stock Prices" 
                data={data} 
                masked={!data && 'Loading...'} 
                shadow 
            >
                <Column text="Company" dataIndex="name" width="150"/>
                <Column text="Price" width="85" dataIndex="price" formatter='usMoney'/>
                <Column text="Change" width="100" dataIndex="priceChange" renderer={this.renderSign.bind(this, '0.00')}/>
                <Column text="% Change" dataIndex="priceChangePct" renderer={this.renderSign.bind(this, '0.00%')}/>
            </Grid>
        )
    }

    renderSign = (format, value) => (
        <span style={{ color: value > 0 ? 'green' : value < 0 ? 'red' : ''}}>
            {Ext.util.Format.number(value, format)}
        </span>
    )

}