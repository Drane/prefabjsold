var App = Ember.Application.create();

App.CanvasView = Ember.View.extend({
    elementArray : [],
    didInsertElement: function() {
        console.debug('didInsertElement CanvasView');
        //this.get('canvas').renderAll();
        this.get('elementArray').invoke('draw');
    },
    add : function(object){
        object.set('canvasView', this);
        this.get('elementArray').pushObject(object);
        console.debug('elementArray: '+this.get('elementArray'));
        //object.draw();
        //this.get('elementArray').invoke('draw');
    },
	tagName : 'canvas',
    style : 'border: 1px solid #ccc',
    click: function(evt) {
        alert("ClickableView was clicked!");
    }
});
/*
App.Canvas = Ember.Object.extend({
	canvasView : null,
    init : function(){
        console.debug(this.get('canvasView'));
        / *
        this.get('canvasView').on('didInsertElement', function() {
            console.debug('didInsertElement Canvas');
            this.get('elementArray').invoke('draw');
        });
        * /
    },
    canvas : function(){
            return this.get('canvasView').get('element');
    }.property('canvasView'),
	ctx : function(){
		return this.get('canvas').getContext('2d');
	}.property('canvas'),
    elementArray : [],
    add : function(object){
        object.set('canvas', this);
        this.get('elementArray').pushObject(object);
        console.debug('elementArray: '+this.get('elementArray'));
        //object.draw();
        //this.get('elementArray').invoke('draw');
    },
    update : function(){
        this.get('ctx').clearRect(0,0,$('#'+id)[0].width(),$('#'+id)[0].heigth());
    }
});*/

App.Shape = Ember.Object.extend({
    top : 0,
    left : 0,
    width : 10,
    height : 10,
    canvasView : null,
    hasPoint : function(x,y){
        var ctx = this.get('canvasView').emptyCtx;
        this.path(ctx);
        return ctx.isPointInPath(x,y);
    },
    draw : function(){
        console.debug(this.get('canvasView'));
        console.debug(this.get('canvasView').get('element'));
        var ctx = this.get('canvasView').get('ctx');
        this.path(ctx);
        ctx.save();
        ctx.fillStyle = 'red';
        ctx.fill();
        ctx.restore();
    }
});

App.Rect = App.Shape.extend({
    path: function (ctx) {
        ctx.beginPath();
        console.debug('drawing rect => left: '+this.get('left')+' top: '+this.get('top')+' width: '+this.get('width')+' height: '+this.get('height'));
        ctx.rect.apply(ctx, [this.get('left'),this.get('top'),this.get('width'),this.get('height')]);
        ctx.closePath();
    }
});
var view = App.CanvasView.create({
    ctx : function(){
        return _super.get('element').getContext('2d');
	}.property()
});//.append();
/*
view.appendTo('#canvasContainer');
*/

//view.on('didInsertElement', function() {
    console.debug('didInsertElement with elementId: '+Ember.get(view, 'elementId'));
    //var ctx = Ember.get(view, 'element').getContext('2d');
    //console.debug(ctx);
  //  var canvasInstance = App.Canvas.create({
    //    canvasView : view
//    });
    view.add(App.Rect.create({top: 10, left: 10, width: 100, height: 50}));
//});



//canvasInstance.get('ctx').fillRect(25,25,100,100);
//canvasInstance.add(App.Rect.create({data : [25,25,100,100]}));
