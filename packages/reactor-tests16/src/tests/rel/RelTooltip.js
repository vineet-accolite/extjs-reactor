import React from 'react';
import { Container, Button, ToolTip } from '@extjs/ext-react';

export default function RelTooltip() {
    return (
        <Container>
            <Container>
                <div>This checks that a tooltip can be assigned using a child element.  The test should pass if the button has a tooltip.</div>
            </Container>
            <Button text="Button" itemId="button" tooltip="I am a tooltip">
                <ToolTip itemId="tooltip">
                    I am a tooltip
                </ToolTip>
            </Button>
        </Container>
    )
}