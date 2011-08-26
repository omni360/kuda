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
	
	// jquery triggered events
	module.EventTypes.ColorPicked = 'editor.TreeSelector.ColorPicked';
	
	var eventNdx = 0;
	
	module.ui.TreeSelectorDefaults = {
		containerClass: '',
		panelHeight: 400,
		tree: null,
		types: {},
		json: {},
		select: null
	};
	
	module.ui.TreeSelector = module.ui.Component.extend({
		init: function(options) {
			var newOpts =  jQuery.extend({}, module.ui.TreeSelectorDefaults, 
				options);
			this.eventName = 'click.treeSelector' + eventNdx;
			this.buttonId = 'treeSelectorBtn' + eventNdx;
			this.inputId = 'treeSelectorIpt' + eventNdx;
			this.panelId = 'treeSelectorPnl' + eventNdx++;
			this._super(newOpts);
		},
		
		finishLayout: function() {			
			var wgt = this,
				
				toggleFcn = function(evt) {
					var ipt = wgt.input,
						btn = wgt.picker,
						pnl = wgt.panel;
					
					if (pnl.is(':visible')) {
						wgt.hidePanel();
						
						jQuery(document).unbind(wgt.eventName);
						pnl.data('docBound', false);
						btn.removeClass('open');
						ipt.removeClass('open');
					}
					else {
						var isDocBound = pnl.data('docBound');
						ipt.addClass('open');
						btn.addClass('open');
						width = ipt.outerWidth() + btn.outerWidth() -
							wgt.treeBorder - wgt.treePadding;
						
						wgt.showPanel(width);
											
						if (!isDocBound) {
							jQuery(document).bind(wgt.eventName, function(evt){
								var target = jQuery(evt.target),
									parent = target.parents('#' + wgt.panelId),
									id = target.attr('id');
								
								if (parent.size() == 0 
										&& id != wgt.panelId
										&& id != wgt.inputId
										&& id != wgt.buttonId) {
									wgt.hidePanel();
								}
							});
							pnl.data('docBound', true);
						}
					}
				};
			
			// initialize container
			this.container = jQuery('<div class="treeSelector"></div>');
			this.input = jQuery('<input type="text" id="' + this.inputId + '" class="treeSelectorIpt" readonly="readonly" />');
			this.picker = jQuery('<button id="' + this.buttonId + '" class="treeSelectorBtn">Selector</button>');
			this.panel = jQuery('<div id="' + this.panelId + '" class="treeSelectorPnl"></div>');
			
			var selFcn = function(evt, data){
				if (wgt.config.select) {
					if (wgt.config.select(data, wgt)) {
						wgt.picker.removeClass('selected');
						wgt.hidePanel();
					}
				}
				else {
					var elem = data.rslt.obj, 
						val = elem.find('a').text();
					
					wgt.input.val(val);
					wgt.hidePanel();
					wgt.picker.removeClass('selected');
					wgt.setSelection(val);
				}
			};
			
			if (this.config.tree) {			
				this.config.tree.addListener(module.EventTypes.Trees.TreeCreated, 
					function(treeUI) {
						wgt.tree = treeUI;
						wgt.tree.bind('select_node.jstree', selFcn).addClass('treeSelectorTree');
				
						var pnl = wgt.panel.append(wgt.tree);
			
						wgt.treeBorder = Math.ceil(parseFloat(pnl.css('borderRightWidth'))) 
							+ Math.ceil(parseFloat(pnl.css('borderLeftWidth')));
						wgt.treePadding = Math.ceil(parseFloat(pnl.css('paddingLeft'))) 
							+ Math.ceil(parseFloat(pnl.css('paddingRight')));
					});
				}
			else {
				this.tree = jQuery('<div></div>');
				
				// setup the tree
				this.tree.bind('select_node.jstree', selFcn).jstree({
					'json_data': {
						'data': this.config.json
					},
					'types': {
						'types': this.config.types
					},
					'themes': {
						'dots': false
					},
					'ui': {
						'select_limit': 1,
						'selected_parent_close': 'false'
					},
					'plugins': ['json_data', 'sort', 'themes', 'types', 'ui']
				});
				
				this.panel.append(this.tree);
			}		
			this.container.addClass(this.config.containerClass);
			
			jQuery('body').append(this.panel);
			this.container.append(this.input).append(this.picker);
			this.panel.css({
				maxHeight: this.config.panelHeight,
				position: 'absolute'
			}).hide();
			
			this.input.bind('click', toggleFcn);
			this.picker.bind('click', toggleFcn);
		},
		
		getSelection: function() {
			return this.input.data('selectObj');
		},
		
		hidePanel: function() {
			this.panel.slideUp(200);
			this.input.removeClass('open');
			this.picker.removeClass('open');
		},
		
		reset: function() {
			this.input.val('');
			this.input.removeData('selectObj');
			this.tree.jstree('deselect_all');
		},
		
		setSelection: function(obj) {
			this.input.data('selectObj', obj);
		},
	
		select: function(nodeId) {
			var elem = jQuery('#' + nodeId);
			this.tree.jstree('select_node', elem);
		},
		
		showPanel: function(width) {
			var position = this.input.offset(),
				width = width || this.container.width();
			
			position.top += this.input.outerHeight();
			this.panel.css({
				top: position.top,
				left: position.left
			}).width(width).slideDown(200);
		}
	});
	
	return module;
})(editor || {});
