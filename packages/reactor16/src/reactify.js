import { l } from './index'
import { ExtJSComponent } from './ExtJSComponent';


// global reactor settings
export var settings = {};
/**
 * Store reactor settings from launch
 * @param {Object} reactorSettings 
 */
export function configure(reactorSettings) {
  settings = reactorSettings;
}

function getTheClass(isRootContainer, xtype, target) {
  //clean up xtype stuff (have a method instead of a property) - reactorsettings does it correctly
  var extJSClass = Ext.ClassManager.getByAlias(`widget.${xtype}`);
  if (!extJSClass) throw new Error(`No Ext JS component with xtype "${xtype}" found.  Perhaps you're missing a package?`);

  //what is target used for?? or, does it have 1 meaning here and another in ExtJSComponent.js?
  return class extends ExtJSComponent {
    //static get source() {return 'ExtJS'}
    get isRootContainer() {return isRootContainer}
    get extJSClass() {return extJSClass}
    get reactorSettings() { return settings }
    get xtype() {return xtype}
    get target() {return target} //original element passed from jsx
 //   constructor(props) { super(props) }
  }
}

//merge this into reactify
export function reactify2(target) {
  const xtype = target.toLowerCase().replace(/_/g, '-')
  l(`reactify2 ${xtype}`)
  var reactifiedClass = getTheClass(false, xtype, target)
  return reactifiedClass
}

export function reactify(target) {
  if( typeof reactify.numRoots == 'undefined' ) {
    reactify.numRoots = 0;
  }
  if (reactify.numRoots > 1) {
    throw `${target} More than 1 root import defined (either ExtReact, RootContainer or RootPanel)`
  }
  if (typeof(target) === 'function') {
    //check to make sure this is an Ext JS define
    //this is a custom ExtJS class (like worldmap), it has to have an xtype to work
    l('target is a function: ' + target.xtype)
    return target.xtype
  }
  else if (target === 'ExtReact') {
    reactify.numRoots++
    l('target is: ExtReact, return reactifiedClass')
    const xtype = 'container'
    var reactifiedClass = getTheClass(true, xtype, target)
    return reactifiedClass
  }
  else if (target.substr(0,4) === 'Root') {
    reactify.numRoots++
    l('target is: ' + target + ', return reactifiedClass')
    var className = target.substr(4)
    const xtype = className.toLowerCase().replace(/_/g, '-')
    var reactifiedClass = getTheClass(true, xtype, target)
    return reactifiedClass
  }
  else {
    l('target is: ' + target)
    return target
  }
}
