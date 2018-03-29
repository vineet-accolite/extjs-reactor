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
    internalInstanceHandle.mjg = 'mjg';
    let instance = null;
    const xtype = type.toLowerCase().replace(/_/g, '-')
    var extJSClass = Ext.ClassManager.getByAlias(`widget.${xtype}`)
    if (extJSClass == undefined) {
      l(`****** EXTRenderer.createInstance extJSClass undefined ${xtype} (props, internalInstanceHandle)`, props, internalInstanceHandle )
      // var extJSChild = Ext.ClassManager.getByAlias(`widget.component`)
      // var widget = Ext.create({xtype:'widget'})
      // debugger
      // var child = <div>hey</div>
      // ReactDOM.render(child,extJSChild.cmp.el.dom)
      // return widget
      return instance
    }
    else {
      l(`EXTRenderer.createInstance ${xtype} (props, internalInstanceHandle)`, props, internalInstanceHandle )
      var reactifiedClass = reactify2(type) // could send xtype
      instance =  new reactifiedClass(props);

//      instance._applyProps(instance, props)


      return instance;
    }
  },

  appendInitialChild(parentInstance, childInstance) {
    if (parentInstance != null && childInstance != null) {
      l('appendInitialChild (parentInstance.cmp.xtype, childInstance.xtype, parentInstance, childInstance)', parentInstance.cmp.xtype, childInstance.xtype, parentInstance, childInstance)
      doAdd(childInstance.xtype, parentInstance.cmp, childInstance.cmp, childInstance.reactChildren)
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

  finalizeInitialChildren(ExtJSComponent, type, props) {
    //first parm is NOT a domElement
    l(`finalizeInitialChildren********** ${type} (ExtJSComponent?, props)`,ExtJSComponent, props)
    const xtype = type.toLowerCase().replace(/_/g, '-')
    if (xtype == 'segmentedbutton') { if(props.value != undefined) { ExtJSComponent.cmp.setValue(props.value) } }

    return true;
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
  l(`shouldSetTextContent**********type,props`,type,props)
    return (
      typeof props.children === 'string' || typeof props.children === 'number'
    );
  },



  //now: ReactDOMFrameScheduling.now,
  now: () => {},

  useSyncScheduling: true,

  mutation: {
    appendChild(parentInstance, childInstance) {
      l('appendChild (childInstance.xtype, parentInstance, child)')
      if (parentInstance != null && childInstance != null) {
        l('appendChild (childInstance.xtype, parentInstance, child)', childInstance.xtype, parentInstance, childInstance)
        doAdd(childInstance.xtype, parentInstance.cmp, childInstance.cmp, childInstance.reactChildren)
      }
    },

    appendChildToContainer(parentInstance, childInstance) {
      if (parentInstance != null && childInstance != null) {
        l('appendChildToContainer (childInstance.target, parentInstance, childInstance)', childInstance.target, parentInstance, childInstance)
        doAdd(childInstance.xtype, parentInstance, childInstance.cmp, childInstance.reactChildren)
      }
      else {
        l('appendChildToContainer (null)')
      }
      // if (parentInstance.cmp != null && child != null) {
      // 	l('appendChildToContainer (child.xtype, parentInstance, child)', child.xtype, parentInstance, child)
      // 	doAdd(child.xtype, parentInstance.cmp, child.cmp child.children)
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
  if (childXtype == 'column' || 
  childXtype == 'treecolumn' || 
  childXtype == 'textcolumn' || 
  childXtype == 'numbercolumn' ) {
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
  else if (parentCmp.xtype == 'button') {
    if (childXtype == 'menu') {
      l(`doAdd button/menu`)
      parentCmp.setMenu(childCmp)
    }
    else {
      l(`doAdd did nothing!!!`, parentCmp.xtype, childCmp.xtype)
    }
  }
  else if (childXtype == 'toolbar') {
    if (parentCmp.getHideHeaders() == false) {
      l(`doAdd toolbar hideHeaders is false`)
      var i = parentCmp.items.items.length
      parentCmp.insert(i-1,childCmp)
     }
    else {
      l(`doAdd toolbar hideHeaders is true`)
      parentCmp.add(childCmp)
    }
  }
  else if (parentCmp.add != undefined) {
    l(`doAdd use add method`, parentCmp.xtype, childCmp.xtype)
    parentCmp.add(childCmp)
  }
  else {
    l(`doAdd did nothing!!!`, parentCmp.xtype, childCmp.xtype)
  }
  if (childPropsChildren == undefined) return
  if (childPropsChildren.type == undefined) { 
    if(typeof childPropsChildren === "string") {
      //PLAIN TEXT CASE
      var text=childPropsChildren
      l(`${text} is PLAIN TEXT`)
      childCmp.setHtml(text)
    } 
    else {
      for (var i = 0; i < childPropsChildren.length; i++) {
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
        if (xtype != null) {
          var target = Ext.ClassManager.getByAlias(`widget.${xtype}`)
          if (target == undefined) {
            l(`${xtype} is HTML`)
            //should call wrapDOMElement(node)??? what does classic do? can widget be used?
            var widget = Ext.create({xtype:'widget'})
            childCmp.add(widget)
            ReactDOM.render(child,widget.el.dom)
          }
          else {
            l(`xtype is NULL`)
          }
        }
        else {
          l(`${xtype} is ExtJS`)
        }
      }
    }
    
  }
  else {
    l(childPropsChildren);
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
        l(`${xtype} is HTML`)
        //should call wrapDOMElement(node)??? what does classic do? can widget be used?
        var widget = Ext.create({xtype:'widget'})
        childCmp.add(widget)
        ReactDOM.render(child,widget.el.dom)
      }
      else {
        l(`xtype is NULL`)
      }
    }
    else {
      l(`${xtype} is ExtJS`)
    }

  }
}
