Ext.define('MyApp.view.main.MainView', {
	extend: 'Ext.Container',
	xtype: 'mainview',
	controller: {type: 'mainviewcontroller'},
	viewModel: {type: 'mainviewmodel'},
	layout: 'fit',
	items: [
		{ xtype: 'navview',    reference: 'navview',    docked: 'left',   bind: {width:  '{navview_width}'}, listeners: { select: "onMenuViewSelectionChange"} },
		{ xtype: 'headerview', reference: 'headerview', docked: 'top',    bind: {height: '{headerview_height}'} },
		{ xtype: 'footerview', reference: 'footerview', docked: 'bottom', bind: {height: '{footerview_height}'} },
		{ xtype: 'centerview', reference: 'centerview' },
		{ xtype: 'detailview', reference: 'detailview', docked: 'right',  bind: {width:  '{detailview_width}'}  },
	]
});
