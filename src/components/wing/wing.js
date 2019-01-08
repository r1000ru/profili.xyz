(function(){
    var Wing = function(templates, element) {
        this._templates = templates;
        this._element = element;
        this._html = this._templates.get('wing');
        
        this._element.appendChild(this._html);
        console.log(templates, element)
    }

    window.profili.Wing = Wing;
})()