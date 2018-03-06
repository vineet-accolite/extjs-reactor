import ReactDOM from 'react-dom';

import { l } from './index'
import { reactify2 } from './reactify';
import React from 'react';
import ReactFiberReconciler from 'react-reconciler';
import invariant from 'fbjs/lib/invariant';
import emptyObject from 'fbjs/lib/emptyObject';
const UPDATE_SIGNAL = {};
// import union from 'lodash.union';
// import isEqual from 'lodash.isequal';
// import capitalize from 'lodash.capitalize'
// import cloneDeepWith from 'lodash.clonedeepwith';


//   /**
//    * Calls config setters for all react props that have changed
//    * @private
//    */
//   function _applyProps(oldProps, props, cmp) {
//     const keys = union(Object.keys(oldProps), Object.keys(props));

//     for (let key of keys) {
//         const oldValue = oldProps[key], newValue = props[key];

//         if (key === 'children') continue;

//         if (!isEqual(oldValue, newValue)) {
//             const eventName = _eventNameForProp(key);

//             if (eventName) {
//                 _replaceEvent(eventName, oldValue, newValue, cmp);
//             } else {
//                 const setter = _setterFor(key, cmp);

//                 if (setter) {
//                     const value = _cloneProps(newValue);
// //                    if (this.reactorSettings.debug) console.log(setter, newValue);
//                     cmp[setter](value);
//                 }
//             }
//         }
//     }
//   }

//   /**
//    * If the propName corresponds to an event listener (starts with "on" followed by a capital letter), returns the name of the event.
//    * @param {String} propName 
//    * @param {String}
//    */
//   function _eventNameForProp(propName) {
//     if (propName.match(/^on[A-Z]/)) {
//         return propName.slice(2).toLowerCase();
//     } else {
//         return null;
//     }
//   }
//   /**
//    * Detaches the old event listener and adds the new one.
//    * @param {String} eventName 
//    * @param {Function} oldHandler 
//    * @param {Function} newHandler 
//    */
//   function _replaceEvent(eventName, oldHandler, newHandler, cmp) {
//     if (oldHandler) {
// //        if (this.reactorSettings.debug) console.log(`detaching old listener for ${eventName}`);
//         cmp.un(eventName, oldHandler);
//     }

// //    if (this.reactorSettings.debug) console.log(`attaching new listener for ${eventName}`);
//     cmp.on(eventName, newHandler);
//   }
//   /**
//    * Returns the name of the setter method for a given prop.
//    * @param {String} prop
//    */
//   function _setterFor(prop, cmp) {
//     if (prop === 'className') {
//         prop = 'cls';
//     }
//     const name = `set${_capitalize(prop)}`;
//     return cmp[name] && name;
//   }
//   /**
//    * Returns the name of a getter for a given prop.
//    * @param {String} prop
//    */
//   function _getterFor(prop, cmp) {
//       const name = `get${_capitalize(prop)}`;
//       return cmp[name] && name;
//   }
//   /**
//    * Capitalizes the first letter in the string
//    * @param {String} str
//    * @return {String}
//    * @private
//    */
//   function _capitalize(str) {
//     return capitalize(str[0]) + str.slice(1);
//   }
//   /**
//    * Cloning props rather than passing them directly on as configs fixes issues where Ext JS mutates configs during
//    * component initialization.  One example of this is grid columns get $initParent added when the grid initializes.
//    * @param {Object} props
//    * @private
//    */
//   function _cloneProps(props) {
//     return cloneDeepWith(props, value => {
//         if (value instanceof Ext.Base || typeof(value) === 'function') {
//             return value;
//         }
//     })
//   }




const EXTRenderer = ReactFiberReconciler({

  createInstance(type, props, internalInstanceHandle) {
    let instance = null;
    const xtype = type.toLowerCase().replace(/_/g, '-')
    //l(`first EXTRenderer createInstance ${xtype} (props, internalInstanceHandle, parentProps)`, props, internalInstanceHandle, internalInstanceHandle.initialConfig )

    var target = Ext.ClassManager.getByAlias(`widget.${xtype}`)
    if (target == undefined) {
      l(`****** EXTRenderer target undefined ${xtype} (props, internalInstanceHandle, parentProps)`, props, internalInstanceHandle, internalInstanceHandle.initialConfig )
      return instance
    }
    else {
      l(`EXTRenderer createInstance ${xtype} (props, internalInstanceHandle, parentProps)`, props, internalInstanceHandle, internalInstanceHandle.initialConfig )
      var reactifiedClass = reactify2(type) // could send xtype
      instance =  new reactifiedClass(props);
      return instance;
    }
  },

  createTextInstance(text, rootContainerInstance, internalInstanceHandle) {
//l(`createTextInstance (text, rootContainerInstance, internalInstanceHandle)`,text, rootContainerInstance, internalInstanceHandle)
    return text;
  },

  finalizeInitialChildren(domElement, type, props) {
//l(`finalizeInitialChildren********** ${type} (domElement, props)`,domElement, props)
    return false;
  },

  getPublicInstance(instance) {
    l(`getPublicInstance`,instance)
    return instance;
  },

  prepareForCommit() {
    l(`prepareForCommit**********`)
    // Noop
  },

  prepareUpdate(domElement, type, oldProps, newProps) {
    l(`prepareUpdate ${type} **********`)
    return UPDATE_SIGNAL;
  },


  resetAfterCommit() {
    l(`resetAfterCommit**********`)
    // Noop
  },

  resetTextContent(domElement) {
    l(`resetTextContent**********`)
    // Noop
  },

  shouldDeprioritizeSubtree(type, props) {
    l(`shouldDeprioritizeSubtree**********`)
    return false;
  },

  getRootHostContext() {
    //l(`getRootHostContext**********`)
    return emptyObject;
  },

  getChildHostContext() {
    //l(`getChildHostContext**********`)
    return emptyObject;
  },

  //scheduleDeferredCallback: ReactDOMFrameScheduling.rIC,

  shouldSetTextContent(type, props) {
  //l(`shouldSetTextContent**********`)
    return (
      typeof props.children === 'string' || typeof props.children === 'number'
    );
  },

  appendInitialChild(parentInstance, child) {
    //l('appendInitialChild (child.xtype, parentInstance, child)')
    //l('parentInstance',parentInstance)
    //l('child',child)
    if (parentInstance != null && child != null) {
//      console.log(child)
      l('appendInitialChild (child.xtype, parentInstance, child)', child.xtype, parentInstance, child)
      l('appendInitialChild d', 'parent - ' + parentInstance.props.d, 'child - ' + child.props.d)
      doAdd(child.xtype, parentInstance.cmp, child)
    }
    //parentInstance.cmp.add(child.cmp) //Ext add

    // if (typeof child === 'string') {
    //   // Noop for string children of Text (eg <Text>{'foo'}{'bar'}</Text>)
    //   invariant(false, 'Text children should already be flattened.');
    //   return;
    // }

    // child.inject(parentInstance);
	},

  //now: ReactDOMFrameScheduling.now,
  now: () => {},

  useSyncScheduling: true,

  mutation: {
    appendChild(parentInstance, child) {
      l('appendChild (child.xtype, parentInstance, child)')
      if (parentInstance != null && child != null) {
        l('appendChild (child.xtype, parentInstance, child)', child.xtype, parentInstance, child)
        doAdd(child.xtype, parentInstance.cmp, child)
      }
    },

    appendChildToContainer(parentInstance, child) {
      if (parentInstance != null && child != null) {
        l('appendChildToContainer (child.target(), parentInstance, child)', child.target(), parentInstance, child)
        doAdd(child.xtype, parentInstance, child)
      }
      else {
        l('appendChildToContainer (null)')
      }
      // if (parentInstance.cmp != null && child != null) {
      // 	l('appendChildToContainer (child.xtype, parentInstance, child)', child.xtype, parentInstance, child)
      // 	doAdd(child.xtype, parentInstance.cmp, child)
      // }
    },

    insertBefore(parentInstance, child, beforeChild) {
      l(`insertBefore**********`)
      invariant(
        child !== beforeChild,
        'ReactEXT: Can not insert node before itself',
      );
      child.injectBefore(beforeChild);
    },

    insertInContainerBefore(parentInstance, child, beforeChild) {
      l(`insertInContainerBefore**********`)
      invariant(
        child !== beforeChild,
        'ReactExt: Can not insert node before itself',
      );
      child.injectBefore(beforeChild);
    },

    removeChild(parentInstance, child) {
      l(`removeChild (parentInstance, child)`, parentInstance, child)

      if (parentInstance != null && child != null) {
        parentInstance.cmp.remove(child.cmp, true)
      }
    },

    removeChildFromContainer(parentInstance, child) {
      l(`removeChildFromContainer (parentInstance, child)`, parentInstance, child)

      if (parentInstance != null && child != null) {
        parentInstance.remove(child.cmp, true)
      }
    },

    commitTextUpdate(textInstance, oldText, newText) {
      l(`commitTextUpdate**********`)
      // Noop
    },

    commitMount(instance, type, newProps) {
      l(`commitMount**********`)
      // Noop
    },


  commitUpdate(instance, updatePayload, type, oldProps, newProps) {
    l(`commitUpdate ${type} (instance, updatePayload, oldProps, newProps)`, instance, updatePayload, oldProps, newProps)
    //_applyProps(oldProps, newProps, instance.cmp);
    instance._applyProps(instance, newProps, oldProps);
  },



  },
});

export default EXTRenderer


function doAdd(xtype, parentCmp, child) {
  var childCmp = child.cmp
  if (xtype == 'column') {
    l(`doAdd ${xtype}`)
    var columns = []
    var newColumns = []
    columns = parentCmp.getColumns()
    for (var item in columns) {
      newColumns.push(columns[item])
    }
    newColumns.push(childCmp)
    parentCmp.setColumns(newColumns)
  }
  else if (parentCmp.add != undefined) {
    l(`doAdd ${xtype} (parentCmp, childCmp)`, parentCmp, childCmp)

    parentCmp.add(childCmp)
  //		return

    var isHTML = false
    var children = child.props.children
    if (children != undefined) {
      if (children.length == undefined) {
        var child = children
        if (child != undefined) {


          if (child != undefined) {
            if (child.type != undefined) {
              if(child.type[0] != undefined) {
                var type = child.type
                const xtype = type.toLowerCase().replace(/_/g, '-')
                var target = Ext.ClassManager.getByAlias(`widget.${xtype}`)
                if (target == undefined) {
  ///								if (child.type[0] != child.type[0].toUpperCase()) {
                  isHTML = true
                }
                else {
                  var Type = reactify2(type)
                  var instance =  new Type(child.props)
                }
              }
            }
          }


        }
      }
      else {
        for (var child of children) {


          if (child != undefined) {
            if (child.type != undefined) {
              if(child.type[0] != undefined) {
                var type = child.type
                const xtype = type.toLowerCase().replace(/_/g, '-')
                var target = Ext.ClassManager.getByAlias(`widget.${xtype}`)
                if (target == undefined) {
  ///								if (child.type[0] != child.type[0].toUpperCase()) {
                  isHTML = true
                }
                else {
                  var Type = reactify2(type)
                  var instance =  new Type(child.props)
                }
              }
            }
          }


        }
      }
    }

    if (isHTML) {
      var widget = Ext.create({xtype:'widget'})
      childCmp.add(widget)
      ReactDOM.render(children,widget.el.dom)
    }

  }
  else {
    l(`doAdd ${xtype} undefined...`)
  }
}