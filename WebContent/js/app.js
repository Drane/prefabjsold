require(["libs/order!jquery","libs/order!libs/ps-log4js-console-ext","libs/order!libs/ember-0.9.8.1"], function($) {
	function isGlobal(reference){
		if(typeof window[reference]==='undefined'){
			console.error(reference+" global is not loaded!!");
			return false;
		}else{
			console.debug(reference+" global is loaded.");
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

		renderAll : function(elementArray) {
			console.debug("CanvasView->renderAll(", elementArray, ")");
			if (elementArray == undefined)
				elementArray = this.get('elementArray');

			var ctx = this.get('ctx');

			//ctx.clearRect(0, 0, this.get('width'), this.get('height'));

			elementArray.forEach(function(element) {
				// console.log(element, this.indexOf(element));
				element.draw(ctx);
			}, elementArray);
		},// .property('elementArray.@each'),

		didInsertElement : function() {
			console.debug('CanvasView->didInsertElement');
			this.renderAll();
		},

		ctx : function() {
			return this.get('element').getContext('2d');
		}.property('element'),

		clear : function() {
			console.debug(this.get('width'), ", ", this.get('height'));
			this.get('ctx').clearRect(0, 0, this.get('width'), this.get('height'));
		},

		click : function(e) {
			var mousePos = this.getMousePos(e);
			console.debug("Mouse position: ", mousePos.x, ",", mousePos.y);
			
			this.get('elementArray').forEach(function(element) {
				if(element.hasPoint(mousePos.x, mousePos.y))
					console.debug("Clicked: ",element);
			}, this.get('elementArray'));
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
		}
//		writeMessage : function(message) {
//			App.canvasController.set('message', message);
//			this.renderAll();
//		}
	});

	App.Shape = Ember.Object.extend({
		top : 0,
		left : 0,
		width : 10,
		height : 10,
		color : 'red',
		ctx : null,
		hasPoint : function(x, y) {
			var ctx = this.get('ctx');
			this.path(ctx);
			return ctx.isPointInPath(x, y);
		},
		draw : function(ctx) {
			if (ctx === null)
				ctx = this.get('ctx');
			else
				this.set('ctx',ctx);

			console.debug("App.Shape->draw(", ctx, ")");
			this.path(ctx);
			ctx.save();
			ctx.fillStyle = this.get('color');
			ctx.fill();
			ctx.restore();
		}
	});

	App.Rect = App.Shape.extend({
		path : function(ctx) {
			ctx.beginPath();
			console.debug("App.Rect->path(", ctx, ") => left: ", this.get('left'),
					" top: ", this.get('top'), " width: ", this.get('width'),
					" height: ", this.get('height'));
			ctx.rect.apply(ctx, [ this.get('left'), this.get('top'),
					this.get('width'), this.get('height') ]);
			ctx.closePath();
		}
	});

	App.Text = App.Shape.extend({
		text : null,
		path : function(ctx) {
			if (text !== null) {
				ctx.beginPath();
				console.debug("App.Text->path(", ctx, ") => left: ", this
						.get('left'), " top: ", this.get('top'), " text: ", this
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
		add : function(object) {
			console.debug("App.canvasController->add(", object, ")");
			this.get('elementArray').pushObject(object);
		}
	});

	App.canvasController.add(App.Rect.create({
		top : 30,
		left : 10,
		width : 100,
		height : 50,
		color : 'green'
	}));
	
});
