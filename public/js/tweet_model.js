TweetModel = function(data) {
        var _meshes = [],
            _x = y = z = 0,
            _vx = _vy = _vz = 0,
            _rvx = _rvy = _rvz = 0,
            _ax =  _ay = _az = 0,
            _colour,
            _light;

    return {
        init: function() {
            // balloon first
            //var texture = new THREE.ImageUtils.loadTexture(data.user.profile_image_url);
            _colour = Math.floor(Math.random()*0xffffff);

            // we don't need to keep hold of these so local variables will do
            var geometry = new THREE.Sphere(50, 50, 50);
            //var ambient = Math.floor(Math.random()*0xffffff);
            var ambient = _colour;
            //var specular = Math.floor(Math.random()*0xffffff);
            var specular = _colour;
            var shininess = Math.floor(Math.random()*0xffffff);
            var material = [
				new THREE.MeshPhongMaterial( { ambient: ambient, color: _colour, specular: specular, shininess: shininess, shading: THREE.SmoothShading } )
            ];
            _meshes.push(new THREE.Mesh(geometry, material));

            // now the rope
            var lGeometry = new THREE.Geometry();

            lGeometry.vertices.push(new THREE.Vertex({x:0,y:0, z:1}));
            //lGeometry.vertices.push(new THREE.Vertex({x:0,y:-40, z:1}));
            lGeometry.vertices.push(new THREE.Vertex({x:0,y:-150, z:1}));

            var line = new THREE.Line(lGeometry, new THREE.LineBasicMaterial({color: 0xCC8523, linewidth:3}));
            _meshes.push(line);

            // front placard

            var x = Utils.textToCanvas({
                "text": data.text,
                "colour": "#fff",
                "fontHeight": 10,
                "font": "Helvetica",
                "wrap": true,
                "width": 150,
                "height": 50
            });
            var texture = new THREE.Texture(x);
            var geometry = new THREE.Plane(150, 50);
            var xm = new THREE.MeshBasicMaterial({map:texture});
            xm.map.needsUpdate = true;
            var material = [
                new THREE.MeshBasicMaterial({map:new THREE.ImageUtils.loadTexture("/img/wood.jpg")}),
                xm
                //new THREE.MeshBasicMaterial({color:0x000000, wireframe:true})
            ];

            _meshes.push(new THREE.Mesh(geometry, material));

            // rear placard

            x = Utils.textToCanvas({
                "text": data.user.screen_name,
                "colour": "#ddd",
                "fontHeight": 20,
                "font": "Helvetica",
                "wrap": true,
                "width": 150,
                "height": 50
            });

            texture = new THREE.Texture(x);
            geometry = new THREE.Plane(150, 50);
            var xm = new THREE.MeshBasicMaterial({map:texture});
            xm.map.needsUpdate = true;
            material = [
                new THREE.MeshBasicMaterial({map: new THREE.ImageUtils.loadTexture("/img/wood.jpg")}),
                xm
            ];

            var mesh = new THREE.Mesh(geometry, material);
            mesh.rotation.y = Utils.deg2rad(180.0);

            _meshes.push(mesh);

            // lighting

            _light = new THREE.PointLight(_colour, 0.5);

            // start at a random X angle
            _ax = Math.random() * 360;
        },

        setPosition: function(x, y, z) {
            // balloon
            _meshes[0].position.x = x;
            _meshes[0].position.y = y;
            _meshes[0].position.z = z;

            // rope
            _meshes[1].position.x = x + 0;
            _meshes[1].position.y = y - 0;
            _meshes[1].position.z = z;

            // rear placard
            _meshes[2].position.x = x - 0;
            _meshes[2].position.y = y - 175;
            _meshes[2].position.z = z;

            // front placard
            _meshes[3].position.x = x - 0;
            _meshes[3].position.y = y - 175;
            _meshes[3].position.z = z-0.1;

            // light
            _light.position.x = x;
            _light.position.y = y + 60;
            _light.position.z = z;

            // local coords
            _x = x;
            _y = y;
            _z = z;
        },

        getPosition: function() {
            return {
                x: _x,
                y: _y,
                z: _z
            };
        },

        setVelocity: function(vx, vy, vz) {
            _vx = vx;
            _vy = vy;
            _vz = vz;
        },

        setRotationVelocity: function(vx, vy, vz) {
            _rvx = vx;
            _rvy = vy;
            _rvz = vz;
        },

        move: function() {
            for (var i = 0; i < _meshes.length; i++) {
                _meshes[i].position.x += Math.cos(_ax) * _vx;
                _meshes[i].position.y += _vy;
                _meshes[i].position.z += _vz;

                _meshes[i].rotation.x += _rvx;
                _meshes[i].rotation.y += _rvy;
                _meshes[i].rotation.z += _rvz;
            }

            _light.position.x += Math.cos(_ax) * _vx;
            _light.position.y += _vy;
            _light.position.z += _vz;

            _ax += 0.01;
        },

        getMeshes: function() {
            return _meshes;
        },

        getLight: function() {
            return _light;
        }
    };
};
