require.config({
	urlArgs : "bust=" + (new Date()).getTime()
});
require(
		[ "libs/order!jquery", "libs/order!libs/ps-log4js-console-ext", "libs/order!libs/ember-0.9.8.1", "libs/order!libs/ember-0.9.8.1", ],
		function($) {
			function isGlobal(reference) {
				if (typeof window[reference] === 'undefined') {
					console.error(reference + " global is not loaded!!");
					return false;
				} else {
					console.debug(reference + " global is loaded.");
					return true;
				}
			}

			isGlobal("Ember");

			window.App = Ember.Application.create();

			App.CanvasView = Ember.View.extend({
				tagName : 'canvas',
				attributeBindings : [ 'width', 'height', 'style' ],
				width : 300,
				height : 300,
				style : 'border:1px solid; background-color: #eeeeee',
				elementArrayBinding : 'App.canvasController.elementArray',
				// redraw : true,
				redrawBinding : 'App.canvasController.redraw',
				dragging : false,// is mss overbodig adh van redraw
				dragoffx : 0,
				dragoffy : 0,

				update : function(elementArray) {
					if (!this.get('redraw'))
						return;

					console.debug("CanvasView->update(", elementArray, ")");
					if (elementArray == undefined)
						elementArray = this.get('elementArray');

					var ctx = this.get('ctx');

					this.clear();

					elementArray.forEach(function(element) {
						// console.log(element, this.indexOf(element));
						element.draw(ctx);
					}, elementArray);

					this.set('redraw', false);
					// cancelAnimationFrame(this.animloop());
				},// .property('elementArray.@each'),

				didInsertElement : function() {
					console.debug('CanvasView->didInsertElement');
					// if(this.get('redraw'))
					this.update();
					// this.animloop();
				},

				animloop : function() {
					console.debug('CanvasView->animloop');
					if (this.get('redraw'))
						this.update();
					requestAnimationFrame(this.animloop());
				},

				ctx : function() {
					return this.get('element').getContext('2d');
				}.property('element'),

				clear : function() {
					console.debug(this.get('width'), ", ", this.get('height'));
					this.get('ctx').clearRect(0, 0, this.get('width'), this.get('height'));
				},

				getMousePos : function(evt) {
					// get canvas position
					var obj = this.get('element');
					var top = 0;
					var left = 0;
					while (obj && obj.tagName != 'BODY') {
						top += obj.offsetTop;
						left += obj.offsetLeft;
						obj = obj.offsetParent;
					}

					// return relative mouse position
					var mouseX = evt.clientX - left + window.pageXOffset;
					var mouseY = evt.clientY - top + window.pageYOffset;
					return {
						x : mouseX,
						y : mouseY
					};
				},
				click : function(e) {

				},
				mouseDown : function(e) {
					console.debug("mousedown->clientX: ", e.clientX, " .clientY: ", e.clientY);

					var mousePos = this.getMousePos(e);
					console.debug("Mouse position: ", mousePos.x, ",", mousePos.y);
					var elementArray = this.get('elementArray');

					var dragoffx;
					var dragoffy;

					elementArray.forEach(function(element) {
						if (element.hasPoint(mousePos.x, mousePos.y)) {
							dragoffx = mousePos.x - element.get('left');
							dragoffy = mousePos.y - element.get('top');
							// console.debug("dragoffx: ",
							// this.get('dragoffx'),"dragoffy: ",
							// this.get('dragoffy'));
							// console.debug("mouseDown on: ", element, " with
							// index: ", this.indexOf(element));
							element.set('selected', true);
							e.target.style.cursor = 'move';
						} else {
							//element.set('selected', false);
							e.target.style.cursor = 'default';
						}
					}, elementArray);
					this.set('dragoffx', dragoffx);
					this.set('dragoffy', dragoffy);
					// if(dirtyBoolean)
					this.set('dragging', true);
					this.set('redraw', true);
					this.update();
				},
				mouseUp : function(e) {
					console.debug("mouseup->clientX: ", e.clientX, " .clientY: ", e.clientY);
					e.target.style.cursor = 'default';
					this.set('dragging', false);
					this.set('redraw', false);
				},

				mouseMove : function(e) {
					if (this.get('dragging')) {
						var mousePos = this.getMousePos(e);
						console.debug("mousemove->clientX: ", e.clientX, " .clientY: ", e.clientY);
						console.debug("mousemove->mousePos.x: ", mousePos.x, " .mousePos.y: ", mousePos.y);

						// var elt = this.get('element');
						// console.debug(elt.id);
						var selectedElementArray = this.get('selectedElementArray');

						console.debug("selectedElementArray: ", selectedElementArray);

						var dragoffx = this.get('dragoffx');
						var dragoffy = this.get('dragoffy');
						selectedElementArray.forEach(function(element) {
							// console.log(element, this.indexOf(element));
							console.debug(mousePos.x - dragoffx);
							console.debug(mousePos.y - dragoffy);

							element.set('left', mousePos.x - dragoffx);
							element.set('top', mousePos.y - dragoffy);
						}, selectedElementArray);
						this.set('redraw', true);
						this.update();
					}
				},

				doubleClick : function(e) {
					console.debug("doubleClick->clientX: ", e.clientX, " .clientY: ", e.clientY);
				},
				selectedElementArray : function() {
					var elementArray = this.get('elementArray');
					return elementArray.filterProperty('selected', true);
				}.property('elementArray.@each.selected')
			// writeMessage : function(message) {
			// App.canvasController.set('message', message);
			// this.update();
			// }
			});

			App.Shape = Ember.Object.extend({
				top : 0,
				left : 0,
				width : 10,
				height : 10,
				selected : false,
				fill : 'red',
				selectedFill : 'green',
				ctx : null, // ctx buffer

				hasPoint : function(x, y) {
					var ctx = this.get('ctx');
					this.path(ctx);
					return ctx.isPointInPath(x, y);
				},

				draw : function(ctx) {
					if (ctx !== null)// fill local buffer
						this.set('ctx', ctx);
					else
						// get local buffer
						ctx = this.get('ctx');

					console.debug("App.Shape->draw(", ctx, ")");
					this.path(ctx);
					ctx.save();
					ctx.fillStyle = this.get('selected') ? this.get('selectedFill') : this.get('fill');
					ctx.fill();
					ctx.restore();
				}
			});

			App.Rect = App.Shape.extend({
				path : function(ctx) {
					ctx.beginPath();
					console.debug("App.Rect->path(", ctx, ") => left: ", this.get('left'), " top: ", this.get('top'), " width: ", this
							.get('width'), " height: ", this.get('height'));
					ctx.rect.apply(ctx, [ this.get('left'), this.get('top'), this.get('width'), this.get('height') ]);
					ctx.closePath();
				}
			});

			App.Text = App.Shape.extend({
				text : null,
				path : function(ctx) {
					if (text !== null) {
						ctx.beginPath();
						console.debug("App.Text->path(", ctx, ") => left: ", this.get('left'), " top: ", this.get('top'), " text: ", this
								.get('text'));
						ctx.font = '9pt Calibri';
						ctx.fillStyle = 'black';
						ctx.fillText(this.get('text'), this.get('left'), this.get('top'));
						ctx.closePath();
					}
				}
			});

			App.canvasController = Ember.Object.create({
				elementArray : [],
				redraw : false,
				add : function(object) {
					console.debug("App.canvasController->add(", object, ")");
					this.get('elementArray').pushObject(object);
					this.set('redraw', true);
				}
			});

			App.canvasController.add(App.Rect.create({
				// fill : 'red',
				top : 30,
				left : 10,
				width : 100,
				height : 50
			}));
			App.canvasController.add(App.Rect.create({
				fill : 'blue',
				top : 90,
				left : 10,
				width : 100,
				height : 50
			}));
		});
