import ReactDOM from 'react-dom';

import { l } from './index'
import { reactify2 } from './reactify';
import React from 'react';
import ReactFiberReconciler from 'react-reconciler';
import invariant from 'fbjs/lib/invariant';
import emptyObject from 'fbjs/lib/emptyObject';
const UPDATE_SIGNAL = {};

const EXTRenderer = ReactFiberReconciler({

  createInstance(type, props, internalInstanceHandle) {
    let instance = null;
    const xtype = type.toLowerCase().replace(/_/g, '-')
    var extJSClass = Ext.ClassManager.getByAlias(`widget.${xtype}`)
    if (extJSClass == undefined) {
      l(`****** EXTRenderer extJSClass undefined ${xtype} (props, internalInstanceHandle, parentProps)`, props, internalInstanceHandle, internalInstanceHandle.initialConfig )
      return instance
    }
    else {
      l(`EXTRenderer createInstance ${xtype} (props, internalInstanceHandle, parentProps)`, props, internalInstanceHandle, internalInstanceHandle.initialConfig )
      var reactifiedClass = reactify2(type) // could send xtype
      instance =  new reactifiedClass(props);
      return instance;
    }
  },

  appendInitialChild(parentInstance, childInstance) {
    if (parentInstance != null && childInstance != null) {
      l('appendInitialChild (parentInstance.cmp.xtype, childInstance.xtype, parentInstance, childInstance)', parentInstance.cmp.xtype, childInstance.xtype, parentInstance, childInstance)
      doAdd(childInstance.xtype, parentInstance.cmp, childInstance.cmp, childInstance.props.children)
    }
    //parentInstance.cmp.add(child.cmp) //Ext add

    // if (typeof child === 'string') {
    //   // Noop for string children of Text (eg <Text>{'foo'}{'bar'}</Text>)
    //   invariant(false, 'Text children should already be flattened.');
    //   return;
    // }

    // child.inject(parentInstance);
	},

  createTextInstance(text, rootContainerInstance, internalInstanceHandle) {
l(`createTextInstance (text, rootContainerInstance, internalInstanceHandle)`,text, rootContainerInstance, internalInstanceHandle)
    return text;
  },

  finalizeInitialChildren(domElement, type, props) {
l(`finalizeInitialChildren********** ${type} (domElement, props)`,domElement, props)
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
    l(`getRootHostContext**********`)
    return emptyObject;
  },

  getChildHostContext() {
    l(`getChildHostContext**********`)
    return emptyObject;
  },

  //scheduleDeferredCallback: ReactDOMFrameScheduling.rIC,

  shouldSetTextContent(type, props) {
  l(`shouldSetTextContent**********`)
    return (
      typeof props.children === 'string' || typeof props.children === 'number'
    );
  },



  //now: ReactDOMFrameScheduling.now,
  now: () => {},

  useSyncScheduling: true,

  mutation: {
    appendChild(parentInstance, child) {
      l('appendChild (child.xtype, parentInstance, child)')
      if (parentInstance != null && child != null) {
        l('appendChild (child.xtype, parentInstance, child)', child.xtype, parentInstance, child)
        doAdd(child.xtype, parentInstance.cmp, child.cmp, child.props.children)
      }
    },

    appendChildToContainer(parentInstance, child) {
      if (parentInstance != null && child != null) {
        l('appendChildToContainer (child.target, parentInstance, child)', child.target, parentInstance, child)
        doAdd(child.xtype, parentInstance, child.cmp, child.props.children)
      }
      else {
        l('appendChildToContainer (null)')
      }
      // if (parentInstance.cmp != null && child != null) {
      // 	l('appendChildToContainer (child.xtype, parentInstance, child)', child.xtype, parentInstance, child)
      // 	doAdd(child.xtype, parentInstance.cmp, child.cmp child.props.children)
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
      instance._applyProps(oldProps, newProps);
    },

  },
});

export default EXTRenderer


/**
 * Wraps a dom element in an Ext Component so it can be added as a child item to an Ext Container.  We attach
 * a reference to the generated Component to the dom element so it can be destroyed later if the dom element
 * is removed when rerendering
 * @param {Object} node A React node object with node, children, and text
 * @returns {Ext.Component}
 */
function wrapDOMElement(node) {
  let contentEl = node.node;

  const cmp = new Ext.Component({ 
      // We give the wrapper component a class so that developers can reset css 
      // properties (ex. box-sizing: context-box) for third party components.
      cls: 'x-react-element' 
  });
  
  if (cmp.element) {
      // modern
      DOMLazyTree.insertTreeBefore(cmp.element.dom, node);
  } else {
      // classic
      const target = document.createElement('div');
      DOMLazyTree.insertTreeBefore(target, node);
      cmp.contentEl = contentEl instanceof HTMLElement ? contentEl : target /* text fragment or comment */;
  }

  cmp.$createdByReactor = true;
  contentEl._extCmp = cmp;

  // this is needed for devtools when using dangerouslyReplaceNodeWithMarkup
  // this not needed in fiber
  cmp.node = contentEl;

  return cmp;
}

//this needs to be refactored
function doAdd(childXtype, parentCmp, childCmp, childPropsChildren) {
  l(`doAdd ${childXtype} (parentCmp, childCmp, childPropsChildern)`, parentCmp, childCmp, childPropsChildren)
//which other types need special care?
  if (childXtype == 'column') {
    l(`doAdd use setColumns ${childXtype}`)
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
    l(`doAdd use add method`, parentCmp.xtype, childCmp.xtype)
    parentCmp.add(childCmp)
  }
  if (childPropsChildren == undefined) return
  if (childPropsChildren.type == undefined) {
    for (var i = 0; i < childPropsChildren.length; i++) {
      console.log(childPropsChildren[i]);
      var child = childPropsChildren[i]

      var xtype = null
      try {
        var type = child.type
        if (type == undefined) { 
          type = child[0].type 
        }
        xtype = type.toLowerCase().replace(/_/g, '-')
      }
      catch(e) {
        continue
      }
      //should call wrapDOMElement(node)??? what does classic do? can widget be used?

      if (xtype != null) {
        var target = Ext.ClassManager.getByAlias(`widget.${xtype}`)
        if (target == undefined) {
          console.log(`${xtype} is HTML`)
          //should call wrapDOMElement(node)??? what does classic do? can widget be used?
          var widget = Ext.create({xtype:'widget'})
          childCmp.add(widget)
          ReactDOM.render(child,widget.el.dom)
        }
        else {
          console.log(`xtype is NULL`)
        }
      }
      else {
        console.log(`${xtype} is ExtJS`)
      }
    }
  }
  else {
    console.log(childPropsChildren);
    var child = childPropsChildren

    var xtype = null
    try {
      var type = child.type
      if (type == undefined) { 
        type = child[0].type 
      }
      xtype = type.toLowerCase().replace(/_/g, '-')
    }
    catch(e) {
    }

    if (xtype != null) {
      var extObject = Ext.ClassManager.getByAlias(`widget.${xtype}`)
      if (extObject == undefined) {
        console.log(`${xtype} is HTML`)
        //should call wrapDOMElement(node)??? what does classic do? can widget be used?
        var widget = Ext.create({xtype:'widget'})
        childCmp.add(widget)
        ReactDOM.render(child,widget.el.dom)
      }
      else {
        console.log(`xtype is NULL`)
      }
    }
    else {
      console.log(`${xtype} is ExtJS`)
    }

  }
}

function doAdd2(childXtype, parentCmp, childCmp, childPropsChildren) {
  l(`doAdd ${childXtype} (parentCmp, childCmp, childPropsChildern)`, parentCmp, childCmp, childPropsChildren)
  if (childXtype == 'column') {
    l(`doAdd use setColumns ${childXtype}`)
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
    l(`doAdd use add method`, parentCmp.xtype, childCmp.xtype)
    parentCmp.add(childCmp)
  //		return

    var isHTML = false
    var children = childPropsChildren
debugger
//    var arrayLength = childPropsChildren.length;
    for (var i = 0; i < childPropsChildren.length; i++) {
        alert(childPropsChildren[i]);
    }




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
//                  var Type = reactify2(type)
//                  var instance =  new Type(child.props)
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
//                  var Type = reactify2(type)
//                  var instance =  new Type(child.props)
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