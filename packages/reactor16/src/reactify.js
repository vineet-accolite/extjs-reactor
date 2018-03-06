import { l } from './index'
import { ExtJSComponent } from './ExtJSComponent';

// global reactor settings
let settings = {};
/**
 * Store reactor settings from launch
 * @param {Object} reactorSettings 
 */
export function configure(reactorSettings) {
  settings = reactorSettings;
}

function getTheClass(isRoot, xtype, target) {
  //clean up xtype stuff (have a method instead of a property) - reactorsettings does it correctly
  var ExtJSClass = Ext.ClassManager.getByAlias(`widget.${xtype}`);
  if (!ExtJSClass) throw new Error(`No Ext JS component with xtype "${xtype}" found.  Perhaps you're missing a package?`);

  return class extends ExtJSComponent {
    static get source() {return 'ExtJS'}
    isRootContainer() {return isRoot}
    get extJSClass() {return ExtJSClass}
    get reactorSettings() { return settings }
    get xtype() {return xtype}
    target() {return target}
    constructor(props) { super(props) }
  }
}

export function reactify2(target) {
  const xtype = target.toLowerCase().replace(/_/g, '-')
  l(`reactify2 ${xtype}`)
  var reactifiedClass = getTheClass(false, xtype, target)
  return reactifiedClass
}

export function reactify(target) {
  if (typeof(target) === 'function') {
    //check to make sure this is an Ext JS define
    //this is a custom ExtJS class (like worldmap), it has to have an xtype to work
    console.log('target is a function: ' + target.xtype)
    return target.xtype
  }
  else if (target === 'ExtReact') {
    console.log('target is: ExtReact, return reactifiedClass')
    const xtype = 'container'
    var reactifiedClass = getTheClass(true, xtype, target)
    return reactifiedClass
  }
  else if (target.substr(0,4) === 'Root') {
    console.log('target is: ' + target + ', return reactifiedClass')
    var className = target.substr(4)
    const xtype = className.toLowerCase().replace(/_/g, '-')
    var reactifiedClass = getTheClass(true, xtype, target)
    return reactifiedClass
  }
  else {
    console.log('target is: ' + target)
    return target
  }
}
