import ReactDOM from 'react-dom';
import { l } from './index'
import React from 'react';
import EXTRenderer from './ReactEXT.js'

export class ExtJSComponent extends React.Component {
	//static isRoot = true

	constructor(props) {
		super(props)
		this.props = props
		this.xtype = this.constructor.name.toLowerCase()
		l(`ExtJSComponent constructor ${this.xtype} (this)`, this)
//		this.isRoot = ExtJSComponent.isRoot
//		console.log(this.isRootContainer())
//		l(`ExtJSComponent isTheRoot ${this.isRootContainer()} (this)`, this)
//		ExtJSComponent.isRoot = false
		var config = {}
		config['xtype'] = this.xtype
		if (this.isRootContainer()) {
			config['fullscreen'] = true
			config['layout'] = 'fit'
		}
//		if (this.xtype == 'extjsroot') {
//			config['xtype'] = 'container'
//		}
//		else {
//			config['xtype'] = this.xtype
//		}
		for (var key in props) {
			if(key.substr(0,2) === 'on') {
				var event = key.substr(2).toLowerCase()
				if (config.listeners == undefined) {
					config.listeners = {}
				}
				config.listeners[event] = props[key]
				//MetaData
			}
			else {
				config[key] = props[key]
				//MetaData
			}
		}

		this._cmp = Ext.create(config)
		l(`ExtJSComponent Ext.create ${this.xtype}`, config)
	}

	componentWillMount() {
		l(`componentWillMount ${this.xtype}`, this)
  }

	componentDidMount() {
		l(`componentDidMount ${this.xtype}`, this)
		if (this.isRoot) {
			var root = document.getElementsByClassName('x-viewport-body-el')[0]
			this._cmp.render(root)
		}
			this._mountNode = EXTRenderer.createContainer(this._cmp);
			EXTRenderer.updateContainer(this.props.children, this._mountNode, this);
  }

  componentDidUpdate(prevProps, prevState) {
		l('componentDidUpdate')
		if (this.isRoot) {
			 EXTRenderer.updateContainer(this.props.children, this._mountNode, this);
		}
	}
	
  componentWillUnmount() {
		l('componentWillUnmount')
    EXTRenderer.updateContainer(null, this._mountNode, this);
  }

  render() {
		l('render')
		return null
  }

}


//		this.renderChildren = this.renderChildren.bind(this)

// 	renderChildren() {
// 		return React.Children.map(this.props.children, child => {
// 			if (child == null) {
// 				return null
// 			}
// 			// if(child.xtype == undefined) {
// 			// 	return null
// 			// }
// //			l('child', child)
// 			return React.cloneElement(child, {
// //				theParentCmp: this.state.cmp
// 			})
// 		})
// 	}


		// var children = this.renderChildren()
		// var childrenLength 
		// if (children == undefined) {
		// 	childrenLength = 0
		// 	children = []
		// }
		// else {
		// 	childrenLength = children.length
		// }
		// var names = ''
		// for (var child of children) {
		// 	//console.log(child)
		// 	if (child.type.name) {
		// 	names = names + `${child.type.name}(${child.props.d},${child.type.source}), `
		// 	}
		// }
		// l(`render ${this.xtype}, ${childrenLength} items`,names)
		// var root = document.getElementsByClassName('x-viewport-body-el')[0]
		// return ReactDOM.createPortal(
		// 	children,
		// 	root,
		// )

		// // this.htmlDiv = document.createElement("div")
		// // return ReactDOM.createPortal(
		// // 	children,
		// // 	this.htmlDiv,
		// // )
		// //var root = this._cmp


		// if (childrenLength == 0) {
		// 	return(null)
		// }
		// else {
		// 	return(children)
		// }


// getChild(child) {
// 	if (child.type  == 'div' || 
// 	child.type == 'h1' ||
// 	child.type == 'h2' ||
// 	child.type == 'li' ||
// 	child.type == 'p' ||
// 	child.type == 'ul' ||
// 	child.type == 'span' ||
// 	child.type == 'a') {
// 		this.html = this.html + ' ' + `<` + child.type + ''
// 		for (var prop in child.props) {
// 			if (prop != 'children') {
// 				if (prop == 'style') {
// 					//
// 					var styleTagContent = JSON.stringify(child.props[prop],null,'')
// 					.replace(/"/g,'')
// 					.replace(/,/g,';')
// 					.replace(/\}/g, ';') 
// 					.replace(/\{/g, '')  

// // //debugger


// // 						var s = JSON.stringify(child.props[prop])
// // 						var t = s.replace("{", "")
// // 						var u = t.replace("}", ";")
// // 						var v  = u.replace(/"/g,"")
// // 						var w = v.replace(",", ";")
// // 						//var v = u.replace('/"', '')

// 					//debugger
// 					//for (styleProp of child.props[prop]) {

// 						this.html = this.html + ` ${prop}='${styleTagContent}'`

// 						//this.html = this.html + ` ${prop}='${child.props[prop][styleProp]}'`
// 					//}
// 					//debugger
// 				}

// 				else if (prop == 'className') {
// 					this.html = this.html + ` class='${child.props[prop]}'`
// 				}
// 				else {
// 					this.html = this.html + ` ${prop}='${child.props[prop]}'`
// 				}
// 			}
// 		}
// 		if (typeof child.props.children == 'string') {
// 			this.html = this.html + '>' + child.props.children
// 			this.html = this.html + `\</` + child.type + '>\n'
// 		}
// 		else {
// 			this.html = this.html + '>' + `\<` + child.type + '>'
// 			this.getThem(child.props.children)
// 			this.html = this.html + `\</` + child.type + '>\n'
// 		}
// 	}
// }

// getThem(children) {
// 	if (children != null) {
// 		if (children.length == undefined) {
// 			var child = children
// //				l('child', child.type)
// 			if (child != undefined) {
// 				this.getChild(child)
// 			}
// 		}
// 		else {
// 			for (var child of children) {
// //					l('child', child.type)
// 				if (child != undefined) {
// 					this.getChild(child)
// 				}
// 			}
// 		}
// 	}
// }
