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

var hemi = (function(hemi) {
	/**
	 * @namespace A module for managing the string literals for Message types.
	 * @example
	 * The documentation for each Message type has an example of a typical
	 * Message body for that type (the 'data' property of a Message).
	 */
	hemi.msg = {
		/**
		 * @type string
		 * @constant
		 * @example
		 * hemi.model.Model - the Model's animation time changes
		 * data = {
		 *     previous: (number) the previous animation time for the Model
		 *     time: (number) the new animation time for the Model
		 * }
		 */
		animate: 'hemi.animate',
		/**
		 * @type string
		 * @constant
		 * @example
		 * hemi.effect.Burst - the Burst effect is triggered
		 * data = {
		 *     position: (number[3]) the XYZ position the Burst was triggered at
		 * }
		 */
		burst: 'hemi.burst',
		/**
		 * @type string
		 * @constant
		 * @example
		 * hemi.world - the World is being cleaned up and emptied
		 * data = { }
		 * @example
		 * hemi.world.Citizen - the Citizen is being removed from the World
		 * data = { }
		 */
		cleanup: 'hemi.cleanup',
		/**
		 * @type string
		 * @constant
		 * @example
		 * hemi.manip.Draggable - the Draggable has been dragged
		 * data = {
		 *     drag: (number[3]) the change in XYZ position caused by the drag
		 * }
		 */
		drag: 'hemi.drag',
		/**
		 * @type string
		 * @constant
		 * @example
		 * hext.tools.BaseTool - the tool is enabled or disabled
		 * data = {
		 *     enabled: (boolean) a flag indicating if the tool is enabled
		 * }
		 */
		enable: 'hemi.enable',
		/**
		 * @type string
		 * @constant
		 * @example
		 * hemi.audio.Audio - the Audio's media content is loaded
		 * data = {
		 *     src: (string) the URL of the audio file loaded
		 * }
		 * @example
		 * hemi.hud.HudImage - the HudImage's image data is loaded
		 * data = { }
		 * @example
		 * hemi.hud.HudVideo - the HudVideo's media content is loaded
		 * data = {
		 *     src: (string) the URL of the video file loaded
		 * }
		 * @example
		 * hemi.model.Model - the Model's 3D data is loaded
		 * data = { }
		 * @example
		 * hemi.scene.Scene - the Scene is set as the "current" Scene
		 * data = { }
		 */
		load: 'hemi.load',
		/**
		 * @type string
		 * @constant
		 * @example
		 * hemi.world - a shape is picked by a mouse click
		 * data = {
		 *     mouseEvent: (o3d.Event) the event generated by the mouse click
		 *     pickInfo: (o3djs.picking.PickInfo) the info generated by the pick
		 * }
		 */
		pick: 'hemi.pick',
		/**
		 * @type string
		 * @constant
		 * @example
		 * hemi.world - a task's progress data has been updated
		 * data = {
		 *     isTotal: (boolean) a flag indicating if percent is for a specific
		 *                        task or a total of all current tasks
		 *     percent: (number) the task's percentage complete, 0-100
		 *     task: (string) an id for the task, ex: url of a file being loaded
		 * }
		 */
		progress: 'hemi.progress',
		/**
		 * @type string
		 * @constant
		 * @example
		 * hemi.world - the World's resources are loaded and ready
		 * data = { }
		 */
        ready: 'hemi.ready',
		/**
		 * @type string
		 * @constant
		 * @example
		 * hemi.manip.Scalable - the Scalable has been scaled
		 * data = {
		 *     scale: (number) the new scale
		 * }
		 */
        scale: 'hemi.scale',
		/**
		 * @type string
		 * @constant
		 * @example
		 * hemi.animation.Animation - the Animation starts
		 * data = { }
		 * @example
		 * hemi.audio.Audio - the Audio starts playing
		 * data = { }
		 * @example
		 * hemi.effect.Trail - the Trail effect starts generating particles
		 * data = { }
		 * @example
		 * hemi.motion.Rotator - the Rotator starts rotating
		 * data = { }
		 * @example
		 * hemi.motion.Translator - the Translator starts translating
		 * data = { }
		 * @example
		 * hemi.time.Timer - the Timer starts counting down
		 * data = {
		 *     time: (number) the milliseconds the Timer will count down for
		 * }
		 * @example
		 * hemi.view.Camera - the Camera starts moving to a Viewpoint
		 * data = {
		 *     viewpoint: (hemi.view.Viewpoint) the Viewpoint the Camera is
		 *                                      moving to
		 * }
		 */
		start: 'hemi.start',
		/**
		 * @type string
		 * @constant
		 * @example
		 * hemi.animation.Animation - the Animation finishes or is stopped
		 * data = { }
		 * @example
		 * hemi.audio.Audio - the Audio finishes playing
		 * data = { }
		 * @example
		 * hemi.effect.Trail - the Trail effect stops generating particles
		 * data = { }
		 * @example
		 * hemi.motion.Rotator - the Rotator stops rotating
		 * data = { }
		 * @example
		 * hemi.motion.Translator - the Translator stops translating
		 * data = { }
		 * @example
		 * hemi.time.Timer - the Timer stops counting down
		 * data = {
		 *     time: (number) the milliseconds the Timer counted down
		 * }
		 * @example
		 * hemi.view.Camera - the Camera arrives at a Viewpoint
		 * data = {
		 *     viewpoint: (hemi.view.Viewpoint) the Viewpoint the Camera moved
		 *                                      to
		 * }
		 */
		stop: 'hemi.stop',
		/**
		 * @type string
		 * @constant
		 * @example
		 * hemi.audio.Audio - the Audio's media content is unloaded
		 * data = { }
		 * @example
		 * hemi.model.Model - the Model's 3D data is unloaded
		 * data = { }
		 * @example
		 * hemi.scene.Scene - the Scene is set to not be the "current" Scene
		 * data = { }
		 */
		unload: 'hemi.unload',
		/**
		 * @type string
		 * @constant
		 * @example
		 * hemi.effect.Emitter - the Emitter is shown or hidden
		 * data = {
		 *     visible: (boolean) a flag indicating if the Emitter is visible
		 * }
		 * @example
		 * hemi.hud.HudDisplay - the HudDisplay shows a page or is hidden
		 * data = {
		 *     page: (number) the page number being shown or 0 if the HudDisplay
		 *                    is hidden
		 * }
		 * @example
		 * hext.tools.BaseTool - the tool is shown or hidden
		 * data = {
		 *     visible: (boolean) a flag indicating if the tool is visible
		 * }
		 */
		visible: 'hemi.visible',
		
		// Wildcard functions
		/**
		 * Register the given handler to receive Messages of the specified type
		 * from any source. This creates a MessageTarget.
		 * 
		 * @param {string} type type of Message to handle
		 * @param {Object} handler either a function or an object
		 * @param {string} opt_func name of the function to call if handler is
		 *     an object
		 * @param {string[]} opt_args optional array of names of arguments to
		 *     pass to the handler. Otherwise the entire Message is just passed
		 *     in.
		 * @return {hemi.dispatch.MessageTarget} the created MessageTarget
		 */
		subscribe: function(type, handler, opt_func, opt_args) {
			return hemi.dispatch.registerTarget(hemi.dispatch.WILDCARD, type,
				handler, opt_func, opt_args);
		},
		
		/**
		 * Remove the given MessageTarget for the specified Message type. Note
		 * that this removes a MessageTarget registered with the wildcard as the
		 * source id. It does not remove the MessageTarget from any Citizens it
		 * may be directly registered with.
		 * 
		 * @param {hemi.dispatch.MessageTarget} target the MessageTarget to
		 *     remove from the Dispatch
		 * @param {string} opt_type Message type the MessageTarget was
		 *     registered for
		 * @return {hemi.dispatch.MessageTarget} the removed MessageTarget or
		 *     null
		 */
		unsubscribe: function(target, opt_type) {
			return hemi.dispatch.removeTarget(target, {
				src: hemi.dispatch.WILDCARD,
				msg: opt_type
			});
		}
	};

	return hemi;
})(hemi || {});
