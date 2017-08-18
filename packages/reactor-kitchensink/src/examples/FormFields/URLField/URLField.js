import React from 'react';
import { FormPanel, URLField } from '@extjs/ext-react';

Ext.require('Ext.data.validator.Url');

export default function UrlFieldExample() {
    return (
        <FormPanel shadow>
            <URLField 
                placeholder="http://www.domain.com" 
                label="URL" 
                width="200"
                validators="url"
                errorTarget="under"
            />
        </FormPanel>
    )
} 