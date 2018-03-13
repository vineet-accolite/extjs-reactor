import 'babel-polyfill';
import React from 'react';
import App from './App'; // app components
import { launch } from '@extjs/reactor';
import * as d3 from 'd3';

window.d3 = d3; // needed for ExtReact/D3 components

import {ExtReact} from '@extjs/ext-react';
launch(<ExtReact><App/></ExtReact>,{ debug: false });