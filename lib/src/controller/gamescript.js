var itemsLayer;
var cart;
var xSpeed = 0;
var touchOrigin;
var touchEnd;
var touching = false;

var gameScene = cc.Scene.extend({
	onEnter:function () {
     	this._super();
		gameLayer = new game();
		gameLayer.init();
		this.addChild(gameLayer);
	}
});

var game = cc.Layer.extend({
	init:function () {
		this._super();
          var backgroundLayer = cc.LayerGradient.create(cc.color(0,0,0,255), cc.color(0x46,0x82,0xB4,255));
          this.addChild(backgroundLayer);
          itemsLayer = cc.Layer.create()
          this.addChild(itemsLayer)
          topLayer = cc.Layer.create()
          this.addChild(topLayer)
          cart = cc.Sprite.create("assets/cart.png");
		topLayer.addChild(cart,0);
          cart.setPosition(240,24);
          this.schedule(this.addItem,1);
          cc.eventManager.addListener(touchListener, this); 
          this.scheduleUpdate(); 
	},
     addItem:function(){
          var item = new Item();
     	itemsLayer.addChild(item,1);
     },
     removeItem:function(item){
		itemsLayer.removeChild(item);
	},
     update:function(dt){
          if(touching){
               xSpeed = (touchEnd.getPosition().x-touchOrigin.getPosition().x)/50; 
               if(xSpeed>0){
                    cart.setFlippedX(true);
               }
               if(xSpeed<0){
                    cart.setFlippedX(false);
               }
               cart.setPosition(cart.getPosition().x+xSpeed,cart.getPosition().y);
          }     
     }
});

var Item = cc.Sprite.extend({
	ctor:function() { 
		this._super(); 
          if(Math.random()<0.5){
               this.initWithFile("assets/bomb.png");
               this.isBomb=true;
          }
          else{
               this.initWithFile("assets/strawberry.png");
               this.isBomb=false;
          }
	},
	onEnter:function() { 
		this._super(); 
		this.setPosition(Math.random()*400+40,350);   
		var moveAction = cc.MoveTo.create(8, new cc.Point(Math.random()*400+40,-50));
		this.runAction(moveAction);
		this.scheduleUpdate();  
	},
	update:function(dt){
          if(this.getPosition().y<35 && this.getPosition().y>30 && Math.abs(this.getPosition().x-cart.getPosition().x)<10 && !this.isBomb){
               gameLayer.removeItem(this);
               console.log("FRUIT");
          
          }
          if(this.getPosition().y<35 && Math.abs(this.getPosition().x-cart.getPosition().x)<25 && this.isBomb){
               gameLayer.removeItem(this);
                console.log("BOMB");
          
          }
		if(this.getPosition().y<-30){
			gameLayer.removeItem(this)    
		}	                                   
	}
})

var touchListener = cc.EventListener.create({
     event: cc.EventListener.TOUCH_ONE_BY_ONE,
     swallowTouches: true,
     onTouchBegan: function (touch, event) {
          touchOrigin = cc.Sprite.create("assets/touchorigin.png");
		topLayer.addChild(touchOrigin,0);
          touchOrigin.setPosition(touch.getLocation().x,touch.getLocation().y);
          touchEnd = cc.Sprite.create("assets/touchend.png");
		topLayer.addChild(touchEnd,0);
          touchEnd.setPosition(touch.getLocation().x,touch.getLocation().y);
          touching = true;
          return true;    
     },
     onTouchMoved: function (touch, event) {
          touchEnd.setPosition(touch.getLocation().x,touchEnd.getPosition().y);
     },       
     onTouchEnded:function (touch, event) {
	    touching = false;
         topLayer.removeChild(touchOrigin);
         topLayer.removeChild(touchEnd);
	}
})