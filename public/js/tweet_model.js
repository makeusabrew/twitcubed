TweetModel = function(data) {
        var _meshes = [],
            _vx = 0,
            _vy = 0,
            _vz = 0,
            _rvx = 0,
            _rvy = 0,
            _rvz = 0;

    return {
        init: function() {
            // balloon first
            var texture = new THREE.ImageUtils.loadTexture(data.user.profile_image_url);
            var geometry = new THREE.Sphere(40, 40, 40);
            var material = [
                new THREE.MeshBasicMaterial({map:texture})
            ];
            _meshes.push(new THREE.Mesh(geometry, material));

            // now the rope
            var lGeometry = new THREE.Geometry();

            lGeometry.vertices.push(new THREE.Vertex({x:0,y:0, z:1}));
            lGeometry.vertices.push(new THREE.Vertex({x:0,y:-40, z:1}));
            lGeometry.vertices.push(new THREE.Vertex({x:0,y:-80, z:1}));

            var line = new THREE.Line(lGeometry, new THREE.LineBasicMaterial({color: 0xCC8523, linewidth:2}));
            _meshes.push(line);

            // front placard

            // rear placard

            var x = document.createElement('canvas');
            var xc = x.getContext('2d');
            x.width = 150;
            x.height = 50;
            xc.fillStyle = '#ddd';
            xc.font = '20px Helvetica';
            var uWidth = xc.measureText(data.user.screen_name);
            var offset = (150 - uWidth.width) / 2;
            xc.fillText(data.user.screen_name, offset, 30);
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
            _meshes[2].position.y = y - 100;
            _meshes[2].position.z = z;
        },

        setVelocity: function(vx, vy, vz) {
            _vx = vx;
            _vy = vy;
            _vx = vz;
        },

        setRotationVelocity: function(vx, vy, vz) {
            _rvx = vx;
            _rvy = vy;
            _rvz = vz;
        },

        move: function() {
            for (var i = 0; i < _meshes.length; i++) {
                _meshes[i].position.x += _vx;
                _meshes[i].position.y += _vy;
                _meshes[i].position.z += _vz;

                _meshes[i].rotation.x += _rvx;
                _meshes[i].rotation.y += _rvy;
                _meshes[i].rotation.z += _rvz;
            }
        },

        getMeshes: function() {
            return _meshes;
        }
    };

    //mesh.position.z = row*30;
    /*
    var x = document.createElement('canvas');
    var xc = x.getContext('2d');
    x.width = 150;
    x.height = 50;
    xc.fillStyle = '#000';
    xc.font = '20px helvetica';
    xc.fillText(tweet.text, 0, 20);
    var texture = new THREE.Texture(x);
    */
};
