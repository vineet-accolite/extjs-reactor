# Release Notes

## v1.1.0

### reactor

* You can now render React components inside Grid cells using the `Column` component's `renderer` prop or the new `RendererCell` component. 
* The responsive plugin is automatically added to any ExtReact component with a `responsiveConfig` prop.
* The `launch` function now passes the viewport DOM element as a parameter to the callback function.  This makes it easier to use react-hot-loader.  See updated reactor-boilerplate for an example of this in action.
* New `renderWhenReady` higher-order component makes it easier to build libraries based on ExtReact.  When root ExtReact components are wrapped in `renderWhenReady`, the launch function is not needed as long as your app does not set the `fullscreen` prop to `true` on any components.
* Added support for react-test-renderer and jest. Boilerplate projects now use jest for the npm test script.
* You can now use component names in selectors when using Sencha Test
* Fixed a bug that caused new children added to the first position in an existing container to be rendered in the wrong position.
* Fixed a bug that prevented updates to the `className` prop from being applied to the DOM.
* Fixed a bug that caused incorrect component names to be rendered in React dev tools' virtual DOM view.
* Fixed a bug that prevented componentWillUnmount from being called on children of ExtReact components
* Fixed a bug that prevented componentWillUnmount from being called on components rendered by `tpl` prop callbacks


### reactor-webpack-plugin

* New `treeShaking` options allows you to disable tree shaking in development builds to improve build times.  When `treeShaking` is set to false, all ExtReact components are included in the build.

### generator-ext-react (Yeoman Generator)

* Typescript is now supported
* Jest is now supported when using JavaScript
* react-hot loader is now supported when using JavaScript
* You can omit example code to create a minimal starter app.
* Fixed a bug that prevented new projects from being created when `yo` is not installed globally
* The generated README.md is now customized based on yeoman input parameters.

### reactor-kitchensink

* Added more examples of the `Panel` component
* Added an example of a multi-step Wizard.
* All grid examples have been updated to use Column's `renderer` prop and `RendererCell` where applicable.

### Boilerplates

* Added react-hot-loader to reactor-boilerplate and reactor-modern-boilerplate
* All boilerplates now automatically find an open port starting with 8080.
* npm "prod" script now uses static-server instead of webpack-dev-server.
