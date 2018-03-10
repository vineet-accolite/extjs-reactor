import React from 'react'
import ReactDOM from 'react-dom'
import { AppContainer } from 'react-hot-loader'
import { launch } from '@extjs/reactor';
import App from './App'

let viewport;

//verif this is needed
Ext.require([
  'Ext.layout.container.Fit'
]);
const render = (Component, target) => {
    ReactDOM.render(
        <AppContainer>
            <Component/>
        </AppContainer>,
        target
    )
}
launch(target => render(App, viewport = target),{debug:true});

if (module.hot) {
    module.hot.accept('./App', () => render(App, viewport));
}