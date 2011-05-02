TweetModel = function(data) {
        var _meshes = [];

    return {
        init: function() {
            // balloon first
            var texture = new THREE.ImageUtils.loadTexture(data.user.profile_image_url);
            var geometry = new THREE.Sphere(20, 20, 20);
            var material = [
                new THREE.MeshBasicMaterial({map:texture})
            ];
            _meshes.push(new THREE.Mesh(geometry, material));

            // now the rope

            var lGeometry = new THREE.Geometry();

            lGeometry.vertices.push(new THREE.Vertex({x:0,y:0, z:1}));
            lGeometry.vertices.push(new THREE.Vertex({x:0,y:-50, z:1}));

            var line = new THREE.Line(lGeometry, new THREE.LineBasicMaterial({color: 0x00ffff}));
            _meshes.push(line);
        },

        setPosition: function(x, y, z) {
            // balloon
            _meshes[0].position.x = x;
            _meshes[0].position.y = y;
            _meshes[0].position.z = z;

            // rope
            _meshes[1].position.x = x + 10;
            _meshes[1].position.y = y - 10;
            _meshes[1].position.z = z;
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
