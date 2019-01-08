(function(){
    var XYZ = function(element) {
        this._element = element;
        this._control;
        this._camera;
        this._scene = new THREE.Scene();
        this._renderer = new THREE.WebGLRenderer();
        
        
        var dir = new THREE.Vector3( -1, 0, 0);

        //normalize the direction vector (convert to vector of length 1)
        dir.normalize();
        var origin = new THREE.Vector3( 0, 0, 0 );
        var length = 500;
        var hex = 0xffff00;

        var arrowHelper = new THREE.ArrowHelper( dir, origin, length, hex, 5, 5 );
        this._scene.add( arrowHelper );
    }

    XYZ.prototype.show = function(){
        const rect = this._element.getBoundingClientRect();
        this._camera = new THREE.PerspectiveCamera( 100, rect.width / rect.height, 0.1, 10000 );
        this._control = new THREE.OrbitControls(this._camera, this._element);
        this._renderer.setSize( rect.width, rect.height );
        
        this._element.appendChild( this._renderer.domElement );
        this._animate();
    }

    XYZ.prototype.setProfileRoot = function(coords, length, angle) {
        /*
        var material = new THREE.LineBasicMaterial( { color: 0x0000ff } );

        var geometryTop = new THREE.Geometry();
        var geometryBottom = new THREE.Geometry();
        
        
        coords.forEach(coord => {
            shape.bezierCurveTo()
            geometryTop.vertices.push(new THREE.Vector3( length * coord.X, length * coord.Yt, 0) );
            geometryBottom.vertices.push(new THREE.Vector3( length * coord.X, length * coord.Yb, 0) );
        });

        var chordRootTop = new THREE.Line(geometryTop, material );
        var chordRootBottom = new THREE.Line(geometryBottom, material );
        this._scene.add(chordRootTop);
        this._scene.add(chordRootBottom);
        */
        var shape = new THREE.Shape();
        shape.moveTo(0,0);
        var c = 0;
        for (c = 1; c < coords.length - 1; c++) {
            shape.bezierCurveTo(coords[c-1].X * length, coords[c-1].Yt * length, coords[c].X * length, coords[c].Yt * length, coords[c+1].X * length, coords[c+1].Yt * length);
        }
        
        shape.bezierCurveTo(coords[c].X * length, coords[c].Yt * length, coords[0].X * length, coords[0].Yt * length, coords[0].X * length, coords[0].Yt * length);
        var geometry = new THREE.ShapeGeometry( shape );
        var material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
        mesh = new THREE.Mesh( geometry, material ) ;
        this._scene.add(mesh);
        this._camera.position.set(length / 5, 0, 0);
        this._camera.lookAt( length / 2, 0, 0 );
        this._control.update();
        
    }

    XYZ.prototype.setProfileTip = function(coords, length, forvard, offset) {
        var material = new THREE.LineBasicMaterial( { color: 0x0000ff } );

        var geometryTop = new THREE.Geometry();
        var geometryBottom = new THREE.Geometry();

        coords.forEach(coord => {
            geometryTop.vertices.push(new THREE.Vector3( length * coord.X + forvard, length * coord.Yt, offset) );
            geometryBottom.vertices.push(new THREE.Vector3( length * coord.X + forvard, length * coord.Yb, offset) );
        });

        var chordRootTop = new THREE.Line(geometryTop, material );
        var chordRootBottom = new THREE.Line(geometryBottom, material );
        this._scene.add(chordRootTop);
        this._scene.add(chordRootBottom);
        this._camera.position.set(length / 5, 0, 0);
        this._camera.lookAt( length / 2, 0, 0 );
        this._control.update();
        this._renderer.render( this._scene, this._camera );
    }

    XYZ.prototype._animate = function() {
        requestAnimationFrame(()=>{
            // required if controls.enableDamping or controls.autoRotate are set to true
            this._control.update();
            this._renderer.render(this._scene, this._camera);
            this._animate();
        } );
        
    }

    window.profili.XYZ = XYZ;
})()