TweetModel = function(data) {
    var _mesh,
        _texture,
        _geometry,
        _material;

    _texture = new THREE.ImageUtils.loadTexture(data.user.profile_image_url);
    _geometry = new THREE.Sphere(20, 20, 20);
    _material = [
        //new THREE.MeshBasicMaterial({color:0x000000, wireframe: true}),
        new THREE.MeshBasicMaterial({map:_texture})
    ];
    _mesh = new THREE.Mesh(_geometry, _material);

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
    return {
        setPosition: function(x, y, z) {
            _mesh.position.x = x;
            _mesh.position.y = y;
            _mesh.position.z = z;
        },

        getMesh: function() {
            return _mesh;
        }
    };
};
