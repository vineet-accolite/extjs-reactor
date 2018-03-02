import React from 'react'
import ReactDOM from 'react-dom'
import { AppContainer } from 'react-hot-loader'
import App from './App'
let viewport;

// import { launch } from '@extjs/reactor15';
// const render = (Component, target) => {
//     ReactDOM.render(
//         <AppContainer>
//             <Component/>
//         </AppContainer>,
//         target
//     )
// }

import {RootContainer} from '@extjs/ext-react';

import { launch } from '@extjs/reactor16';
const render = (Component, target) => {
	ReactDOM.render(
		<AppContainer>
		<RootContainer fullscreen layout="fit">
		<Component />
		</RootContainer>
		</AppContainer>,
		target
	)
}
console.log(require('react').version)
launch(target => render(App, viewport = target));

if (module.hot) {
    module.hot.accept('./App', () => render(App, viewport));
}