/**
 * Instructions prototype
 * 
 * Display the instructions
 * 
 */
class Instructions extends CCLayer {
    
    /**
     * Cocos2d Constructor
     */
    public ctor() {
        
        this._super();
        
        var {width, height} = cc.director.getWinSize();
        var x = ~~width / 2;

        var scores = new cc.Sprite(res.instructions_scores_png);
        scores.setPosition(cc.p(x, height - 275));

        var logo = new cc.Sprite(res.instructions_logo_png);
        logo.setPosition(cc.p(80, height - 80));

        var backNormal = new cc.Sprite(res.instructions_back_png, cc.rect(0, 0, 51, 27));
        var backSelected = new cc.Sprite(res.instructions_back_png, cc.rect(0, 0, 51, 27));
        var backDisabled = new cc.Sprite(res.instructions_back_png, cc.rect(0, 0, 51, 27));

        var back = new cc.MenuItemSprite(backNormal, backSelected, backDisabled, this.onBack, this);
        var backMenu = new cc.Menu(back);
        backMenu.setPosition(cc.p(width - 40, height - 10));

        var title = new cc.LabelTTF("AlienZone", opendyslexic, 24);
        title.setPosition(cc.p(x, height - 140));

        var help = new cc.LabelTTF(helpText, opendyslexic, 12, scores.getContentSize());
        help.setFontFillColor(cc.color.BLACK);
        help.setPosition(cc.p(x + 40, height - 350));

        var copyright = new cc.LabelTTF("© Copyright 2014 Dark Overlord of Data", opendyslexic, 12);
        copyright.setFontFillColor(cc.color.BLACK);
        copyright.setPosition(cc.p(x, height - 420));

        this.addChild(scores);
        this.addChild(logo);
        this.addChild(backMenu);
        this.addChild(title);
        this.addChild(help);
        this.addChild(copyright);
        return true;
    }
    
    /**
     * Back to the Menu
     */
    onBack(sender) {
        Menu.show();
    }
}
