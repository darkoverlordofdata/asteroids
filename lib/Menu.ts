/**
 * Menu prototype
 * 
 * The main menu for the game
 * 
 */
class Menu extends CCLayer {

    /** 
     * Start the menu
     */
    public static start(): cc.Scene {
        Properties.init("alienzone", properties);
        return Menu.show(false);
    }

    /** 
     * Show the menu with fade
     * 
     * @param fade
     * @return the menu scene
     */
    public static show(fade:boolean=true): cc.Scene {
        var MenuClass = cc.Layer.extend(Menu.prototype);
        var scene = new cc.Scene();
        scene.addChild(new MenuClass());
        return fade ? cc.director.runScene(new cc.TransitionFade(1.2, scene)) : scene;
    }

    
    /**
     * Cocos2d Constructor
     */
    public ctor () {
        
        this._super();
        
        var {width, height} = cc.director.getWinSize();
        var x = ~~width / 2;
        var title = new cc.Sprite(res.title_png);
        title.setPosition(cc.p(x, height - 50));

        /**
         * Select Game
         * 
         * Infinity - no time limit
         * FTL - timed
         */
        var infinityNormal = new cc.Sprite(res.infinity_png);
        var infinitySelected = new cc.Sprite(res.infinity_png);
        var infinityDisabled = new cc.Sprite(res.infinity_png);

        var ftlNormal = new cc.Sprite(res.ftl_png);
        var ftlSelected = new cc.Sprite(res.ftl_png);
        var ftlDisabled = new cc.Sprite(res.ftl_png);

        var infinity = new cc.MenuItemSprite(infinityNormal, infinitySelected, infinityDisabled, this.onInfinity, this);
        var ftl = new cc.MenuItemSprite(ftlNormal, ftlSelected, ftlDisabled, this.onFtl, this);
        var gameMenu; 
        gameMenu = new cc.Menu(infinity, ftl);
        gameMenu.alignItemsVerticallyWithPadding(15);
        gameMenu.setPosition(cc.p(x, height - 150));

        /**
         * Options Menu
         * 
         * Achievements
         * Login
         * Leaderboards
         * Instructions
         */
        var achievementsNormal = new cc.Sprite(res.gamesAchievements_png, cc.rect(0, 0, 64, 64));
        var achievementsSelected = new cc.Sprite(res.gamesAchievements_png, cc.rect(64, 0, 64, 64));
        var achievementsDisabled = new cc.Sprite(res.gamesAchievements_png, cc.rect(128, 0, 64, 64));

        var controllerNormal = new cc.Sprite(res.gamesController_png, cc.rect(0, 0, 64, 64));
        var controllerSelected = new cc.Sprite(res.gamesController_png, cc.rect(64, 0, 64, 64));
        var controllerDisabled = new cc.Sprite(res.gamesController_png, cc.rect(128, 0, 64, 64));

        var leaderboardsNormal = new cc.Sprite(res.gamesLeaderboards_png, cc.rect(0, 0, 64, 64));
        var leaderboardsSelected = new cc.Sprite(res.gamesLeaderboards_png, cc.rect(64, 0, 64, 64));
        var leaderboardsDisabled = new cc.Sprite(res.gamesLeaderboards_png, cc.rect(128, 0, 64, 64));

        var instructionsNormal = new cc.Sprite(res.instructions_png);
        var instructionsSelected = new cc.Sprite(res.instructions_png);
        var instructionsDisabled = new cc.Sprite(res.instructions_png);

        var achievements = new cc.MenuItemSprite(achievementsNormal, achievementsSelected, achievementsDisabled, this.onAchievements, this);
        var controller = new cc.MenuItemSprite(controllerNormal, controllerSelected, controllerDisabled, this.onController, this);
        var leaderboards = new cc.MenuItemSprite(leaderboardsNormal, leaderboardsSelected, leaderboardsDisabled, this.onLeaderboards, this);
        var instructions = new cc.MenuItemSprite(instructionsNormal, instructionsSelected, instructionsDisabled, this.onInstructions, this);
        var optionsMenu = new cc.Menu(achievements, controller, leaderboards, instructions);
        optionsMenu.alignItemsInColumns(3, 1);
        optionsMenu.setPosition(cc.p(x, height - 300));

        /**
         * Settings Menu
         * 
         * Sound Effects Volume
         * Music Volume
         */
        var sfxNormal = new cc.Sprite(res.sfx_option_png, cc.rect(0, 0, 70, 61));
        var sfxSelected = new cc.Sprite(res.sfx_option_png, cc.rect(70, 0, 70, 61));
        var sfxDisabled = new cc.Sprite(res.sfx_option_png, cc.rect(0, 0, 70, 61));

        var musicNormal = new cc.Sprite(res.music_option_png, cc.rect(0, 0, 47, 57));
        var musicSelected = new cc.Sprite(res.music_option_png, cc.rect(47, 0, 47, 57));
        var musicDisabled = new cc.Sprite(res.music_option_png, cc.rect(0, 0, 47, 57));

        var sfx = new cc.MenuItemSprite(sfxNormal, sfxSelected, sfxDisabled, this.onSfx, this);
        var music = new cc.MenuItemSprite(musicNormal, musicSelected, musicDisabled, this.onMusic, this);
        var settingsMenu = new cc.Menu(sfx, music);
        settingsMenu.alignItemsHorizontallyWithPadding(180);
        settingsMenu.setPosition(cc.p(x, height - 380));

        this.addChild(title);
        this.addChild(gameMenu);
        this.addChild(optionsMenu);
        this.addChild(settingsMenu);
        return true;
    }
    
    /**
     * Show the achievements screen
     */
    onAchievements(sender) {
        var scene = this.createScene(new Achievements());
        cc.director.runScene(new cc.TransitionFade(1.2, scene));
    }
    
    /**
     * Login
     */
    onController(sender) {
        var scene = this.createScene(new Controller());
        cc.director.runScene(new cc.TransitionFade(1.2, scene));
    }
    
    /**
     * Show the leaderboards
     */
    onLeaderboards(sender) {
        var scene = this.createScene(new Leaderboards());
        cc.director.runScene(new cc.TransitionFade(1.2, scene));
    }
    
    /**
     * Game: Infinity
     */
    onInfinity(sender) {
        var scene = this.createScene(new Game("infinity"));
        cc.director.runScene(new cc.TransitionFade(1.2, scene));
    }
    
    /**
     * Game: FTL
     */
    onFtl(sender) {
        var scene = this.createScene(new Game("ftl"));
        cc.director.runScene(new cc.TransitionFade(1.2, scene));
    }
    
    /**
     * Show Instructions
     */
    onInstructions(sender) {
        var scene = this.createScene(new Instructions());
        cc.director.runScene(new cc.TransitionFade(1.2, scene));
    }
        
    /**
     * Toggle SoundFX
     */
    onSfx(sender) {
        cc.log("onSfx");
    }
    
    /**
     * Toggle Music
     */
    onMusic(sender) {
        cc.log("onMusic");
    }
}

