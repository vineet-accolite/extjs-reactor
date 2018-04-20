import React from 'react';
import ReactDOM from 'react-dom';
import App from './App'; // app components
import { launch } from '@extjs/reactor';

// include all ExtReact components so we can use them directly in jest tests.
Ext.require('Ext.*');

launch(<App/>, { debug: true });