import React from 'react'
import { BrowserRouter as Router } from 'react-router-dom'
import Layout from './Layout';

// Enable responsiveConfig app-wide. You can remove this if you don't plan to build a responsive UI.
Ext.require('Ext.plugin.Responsive');

/**
 * The main application view
 */
// export default function App() {
//   return (
//       <Router>
//         <Layout/>
//       </Router>
//   )
// }

import {ExtReact} from '@extjs/ext-react';
export default function App() {
  return (
    <ExtReact>
      <Router>
        <Layout/>
      </Router>
    </ExtReact>
  )
}



// import {RootContainer} from '@extjs/ext-react';
// export default function App() {
// 	return (
// 		<RootContainer>
// 			<Router>
// 					<Layout/>
// 			</Router>
// 		</RootContainer>
// 	)
// }
