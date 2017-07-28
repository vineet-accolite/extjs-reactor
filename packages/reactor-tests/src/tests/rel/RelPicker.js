import React from 'react';
import { Container, PickerField } from '@extjs/ext-react';
import { Tree } from '@extjs/ext-react-treegrid';

export default function RelPicker() {

    return (
        <Container>
            <PickerField itemId="field">
                <Tree 
                    itemId="picker"
                    height="300"
                    store={{
                        type: 'tree',
                        root: {
                            text: 'Root',
                            expanded: true,
                            children: [
                                { text: 'Child 1', leaf: true },
                                { text: 'Child 2', leaf: true },
                                { text: 'Child 3', leaf: true },
                            ]
                        }
                    }}
                />
            </PickerField>
        </Container>
    )

}