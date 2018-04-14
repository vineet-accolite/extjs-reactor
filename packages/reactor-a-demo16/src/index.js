
if (module.hot) {
  console.log('hi2')
  Ext.application({
    extend: 'MyApp.Application',
    name: 'MyApp'
  });
}