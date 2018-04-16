import React, { Component } from 'react';
import { TextColumn } from '@extjs/ext-react';
import { Tree, TreeColumn } from '@extjs/ext-react-treegrid';
import store from './Store.js';

Ext.require([
    'Ext.grid.plugin.Editable',
    'Ext.grid.plugin.CellEditing'
]);

export default class EditableTreeExample extends Component {

    render(){
        return (
            <Tree
                shadow
                store={store}
                platformConfig={{
                    title: "Editable Tree",
                    desktop: {
                        plugins: {
                            gridcellediting: true
                        }
                    },
                    '!desktop': {
                        plugins: {
                            grideditable: true
                        }
                    }
                }}
                {...columnProps}
            >
            </Tree>
        )
    }
}

const columnProps = {
    columns : [{
        xtype:'treecolumn',
        text:"Name",
        dataIndex:"text",
        flex:1,
        editable: true
    }, {
        xtype:'treecolumn',
        text:"Class Name",
        dataIndex:"className",
        flex:1,
        editable:true
    }]
}