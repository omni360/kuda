/* 
 * Kuda includes a library and editor for authoring interactive 3D content for the web.
 * Copyright (C) 2011 SRI International.
 *
 * This program is free software; you can redistribute it and/or modify it under the terms
 * of the GNU General Public License as published by the Free Software Foundation; either 
 * version 2 of the License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; 
 * without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  
 * See the GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License along with this program; 
 * if not, write to the Free Software Foundation, Inc., 51 Franklin Street, Fifth Floor, 
 * Boston, MA 02110-1301 USA.
 */

var editor = (function(module) {
	module.ui = module.ui || {};
	
    module.EventTypes = module.EventTypes || {};
	
	var CIT_TREE_PNL_ID = 'objPkrCitTreePnl',
		CIT_TREE_ID = 'objPkrCitTree';
	
	var citTree = null,
		citTreePnl = jQuery('<div id="' + CIT_TREE_PNL_ID +'"></div>'),
		padding = 0,
		border = 0,
		outerWidth = 0;
		
	var createCitizenTree = function(filter) {
			try {
				if (citTree == null) {
					citTree = module.ui.createCitizensTree();
					
					if (citTree.tree == null) {
						citTree.addListener(module.EventTypes.Trees.TreeCreated, function(treeUI){
							initCitizenTree(treeUI, filter);
						});
					}
					else {
						initCitizenTree(citTree.tree, filter);
					}
					
					citTree.addListener(module.EventTypes.Trees.SelectCitizen, function(data){
						var elem = citTreePnl.data('curElem'), 
							btn = elem.children('button'), 
							ipt = elem.children('input'), 
							wgt = ipt.data('widget');
						
						citTreePnl.hide().data('curElem', null);
						citTree.currentParamIpt = null;
						
						jQuery(document).unbind('click.' + wgt.argName + 'CitTree');
						citTreePnl.data('docBound', false);
						ipt.removeClass('open');
						btn.removeClass('open');
						
						if (wgt.config.sendsNotifications) {
							wgt.notifyListeners(module.EventTypes.Params.SetArgument, data);
						}
					});
				}
				else {
					citTree.filter(filter);
				}
			}
			catch (err) {
				this.cannotFilter = true;
			}
		},
		
		initCitizenTree = function(tree, filter) {	
			citTreePnl.append(tree);
			tree.attr('id', CIT_TREE_ID);	
			jQuery('body').append(citTreePnl);
			citTreePnl.hide();
			
			outerWidth = citTreePnl.outerWidth() - citTreePnl.width();
				
			citTree.bindSelect(function(evt, data) {
				var elem = data.rslt.obj,
					metadata = elem.data('jstree'),
					citizen = metadata.citizen,
					paramIpt = citTree.currentParamIpt,
					citParam = '',
					citName = '';
					
				if (metadata.type === 'citizen') {
					citParam = hemi.dispatch.ID_ARG + citizen.getId();
					citName = citizen.getCitizenType().split('.').pop() 
						+ '.' + citizen.name;
					jQuery(this).parent().hide(200);
					tree.jstree('close_all').jstree('deselect_all');
					citTree.currentParamIpt = null;
				} else if (metadata.type === 'citType') {
					tree.jstree('toggle_node', elem);
				}
				
				if (paramIpt != null && citParam != '') {
					// TODO: change trueval to citizen...or not
					paramIpt.val(citName).data('trueVal', citParam);
					
					var e = citTreePnl.data('curElem'),
						btn = e.children('button'), 
						ipt = e.children('input'),
						wgt = ipt.data('widget');
					
					citTreePnl.hide().data('curElem', null);
					citTree.currentParamIpt = null;
					
					jQuery(document).unbind('click.' + wgt.argName 
						+ 'CitTree');
					citTreePnl.data('docBound', false);
					ipt.removeClass('open');
					btn.removeClass('open');
				}
			});
	
			citTree.filter(filter);
		};
	
	module.ui.ObjectPicker = module.ui.Component.extend({
		init: function(argName, filter) {
			this.argName = argName;
			this.filter = filter;
			
			createCitizenTree.call(this, filter);
			
			this._super();
		},
		
		finishLayout: function() {
			this.container = jQuery('<div class="objectPicker"></div>');
						
			var wgt = this,
				argName = this.argName,
				prefix = argName,
				toggleFcn = function(evt){
					var oldElem = citTreePnl.data('curElem'),
						elem = jQuery(this).parent(),
						btn = elem.children('button'), 
						ipt = elem.children('input');
					
					if (citTreePnl.is(':visible') && oldElem 
							&& elem[0] === oldElem[0]) {
						citTreePnl.slideUp(200).data('curElem', null);
						citTree.currentParamIpt = null;
						
						jQuery(document).unbind('click.' + argName + 'CitTree');
						citTreePnl.data('docBound', false);
						ipt.removeClass('open');
						btn.removeClass('open');
					}
					else {
						var position = ipt.offset(),
							isDocBound = citTreePnl.data('docBound'),
							width = ipt.outerWidth() + btn.outerWidth() -
								outerWidth;
						
						position.top += ipt.outerHeight();
						ipt.addClass('open');
						btn.addClass('open');
						citTreePnl.css({
							top: position.top,
							left: position.left
						}).width(width).slideDown(200).data('curElem', elem);
						
						if (!isDocBound) {
							jQuery(document).bind('click.' + argName + 'CitTree', function(evt){
								var target = jQuery(evt.target),
									parent = target.parents('#' + CIT_TREE_PNL_ID),
									id = target.attr('id');
								
								if (parent.size() == 0 
									&& id != CIT_TREE_PNL_ID
									&& !target.hasClass('objPkrCitTreeBtn')
									&& !target.hasClass('objPkrCitTreeIpt')) {
									citTreePnl.slideUp(200);
									ipt.removeClass('open');
									btn.removeClass('open');
								}
							});
							citTreePnl.data('docBound', true);
						}
						
						citTree.currentParamIpt = ipt;
					}
				},			
				ip = jQuery('<input type="text" class="objPkrCitTreeIpt" id="objPkr_' + argName + '"></input>'),
				cb = jQuery('<button class="objPkrCitTreeBtn dialogBtn">Citizens</button>');
				
	            this.container.append(ip).append(cb);
				
				ip.data('widget', this).bind('click', toggleFcn);		
				cb.bind('click', toggleFcn);
				
				this.input = ip;
				
				if (this.cannotFilter) {
					this.input.val('none available');
					cb.attr('disabled', 'disabled');
					ip.attr('disabled', 'disabled');
				}
		},
		
		getValue: function() {
			return this.input.data('trueVal');
		},
		
		setValue: function(citizen) {
			if (citizen != null && citizen.getCitizenType() === this.filter) {
				var nodeId = module.treeData.getNodeName(citizen, {
					prefix: citTree.pre,
					id: citizen.getId()
				});
				
				citTreePnl.data('curElem', this.container);
				citTree.currentParamIpt = this.input;
				citTree.getUI().jstree('select_node', '#' + nodeId);
			}
			else if (citizen != null) {
				alert('not the correct type');
			}
		}
	});
	
	return module;
})(editor || {});