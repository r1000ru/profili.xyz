(function(){
    var App = function() {
        this._templates = new MicroTemplates(window.profili.html);
        this._html = this._templates.get('app');
        this._wing = new profili.Wing(this._templates, this._html.models.wing);
        this._xyz = new profili.XYZ(this._html.models.xyz);

    }

    App.prototype.run = function() {
        document.body.appendChild(this._html);
        this._xyz.show();
        this._xyz.setProfileRoot(window.profili.data[0].coords, 350);
        this._xyz.setProfileTip(window.profili.data[0].coords, 200, 50, 1000);
    }

    window.profili.App = App;
})()