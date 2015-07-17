
/**
 * CCLayer adapter
 * 
 */
class CCLayer {
    
    /**
     * Method templates for type checks
     */
    public _super = () => {};
    public addChild = (child:any, zOrder?:number, tag?:number) => {};
    public scheduleUpdate = () => {};
    
    constructor() {
        /**
         * Fixup the vtable
         * Delete template methods.
         * These will be replaced by cc.Layer::_super
         */  
        delete this['_super'];
        delete this['addChild'];
        delete this['scheduleUpdate'];
    }
    
    /**
     * createScene
     * 
     * @param prototype
     * @return a new scene with a layer based on the prototype
     */
    public createScene(prototype): cc.Scene {
        var Klass = cc.Layer.extend(prototype);
        var scene = new cc.Scene();
        scene.addChild(new Klass());
        return scene;
    }
    
}
