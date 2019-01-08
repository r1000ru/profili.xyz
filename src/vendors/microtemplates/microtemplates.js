(function() {
	var Loader = function(name, url) {
		this.name = name;
		this.url = url;
	};
	
	Loader.prototype.start = function(callback) {
		var self = this;
		
		this.xhr = new XMLHttpRequest();
		this.xhr.open('GET', this.url);
		this.xhr.onload = function() {
			var html = this.responseText;
			console.info(Date.now() + ' loaded ' + self.name + ' ' + self.url);
            callback(self.name, html);
        };

        this.xhr.onerror = function() {
        	console.log('Error' + name + ' ' + url);
            callback(self.name, false);
        };
        
        this.xhr.onabort = function(e) {
            console.log('Abort ' + self.name, e);
            callback(self.name, false);
        };
        
        this.xhr.ontimeout = function() {
            console.log('Timeout ' + self.name);
            callback(self.name, false);
        }

        this.xhr.send();
	};
	

    var MicroTemplates = function(templates) {
        this.element = "content" in document.createElement('template') ? 'template' : 'div';
        this.debug = true;
        this.templates = {};
        
        if (!templates) {
            return;
        }

        for (var template in templates) {
            this.templates[template] = this.toDOM(templates[template]);
        }
    };

    MicroTemplates.prototype.load = function(templates, callback) {
        var count = Object.keys(templates).length;
        var self = this;

        for (var template in templates) {
        	var l = new Loader(template, templates[template]);
        	l.start(function(name, html){
                self.templates[name] = self.toDOM(html);
                count--;
                if (!count && callback) {
                    callback();
                }
        	});
        }
    };
    

    MicroTemplates.prototype.toDOM = function(html) {
        html = html || '<div>Error loading template</div>';
        var e = document.createElement(this.element);
        e.innerHTML = html.trim();
        return this.element === 'template' ? e.content.firstChild : e.firstElementChild;
    };

    MicroTemplates.prototype.get = function(template) {
        var element = this.templates[template].cloneNode(true);
        element.models = {};
        var models = element.querySelectorAll('[data-model]');
        
        for (var m = 0; m < models.length; m++) {
            element.models[models[m].getAttribute('data-model')] = models[m];
        }

        return element;
    };

    window.MicroTemplates = MicroTemplates;
})();