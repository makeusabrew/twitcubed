SceneManager = function(options) {
    var _scene,
        _camera,
        _renderer,
        _tweets = [],
        _meshes = [],
        _width = options.width,
        _height = options.height,
        _mousePos;

    return {
        init: function() {
            _camera = new THREE.Camera(50, _width / _height, 1, 10000);

            _scene = new THREE.Scene();

            _renderer = new THREE.WebGLRenderer({antialias: true});

            _renderer.setSize(_width, _height);

            $("body").append(_renderer.domElement);
        },

        addTweet: function(data) {
            var tweet = new TweetModel(data);
            tweet.init();

            var meshes = tweet.getMeshes();
            for (var i = 0; i < meshes.length; i++) {
                var mesh = meshes[i];
                _scene.addObject(mesh);
                _meshes.push(mesh);
                THREE.Collisions.colliders.push(THREE.CollisionUtils.MeshOBB(mesh));
            }

            _tweets.push(tweet);

            return tweet;
        },

        render: function() {
            for (var i = 0; i < _tweets.length; i++) {
                _tweets[i].move();
            }

            var r = new THREE.Ray();
            r.origin.copy(_mousePos);
            
            var matrix = _camera.matrixWorld.clone();
            matrix.multiplySelf(THREE.Matrix4.makeInvert(_camera.projectionMatrix));
            matrix.multiplyVector3(r.origin);

            r.direction = r.origin.clone().subSelf(_camera.position);

            var c = THREE.Collisions.rayCastNearest(r);

            /*
            if (c) {
                //console.log(c);
                c.mesh.rotation.y += 0.03;
                c.mesh.rotation.x += 0.02;
            }
            */

            if (Input.isKeyDown("UP_ARROW")) {
                _camera.position.z --;
            } else if (Input.isKeyDown("DOWN_ARROW")) {
                _camera.position.z ++;
            }

            if (Input.isKeyDown("LEFT_ARROW")) {
                _camera.target.position.x --;
            } else if (Input.isKeyDown("RIGHT_ARROW")) {
                _camera.target.position.x ++;
            }

            //_camera.target.position.x = x;
            //_camera.target.position.y = y;
            _renderer.render(_scene, _camera);

        },

        getWidth: function() {
            return _width;
        },

        getHeight: function() {
            return _height;
        },

        setMousePosition: function(mousePos) {
            _mousePos = mousePos;
        },

        setCameraPosition: function(x, y, z) {
            _camera.position.x = x;
            _camera.position.y = y;
            _camera.position.z = z;
        },

        setCameraTarget: function(x, y, z) {
            _camera.target.position.x = x;
            _camera.target.position.y = y;
            _camera.target.position.z = z;
        }
    };
}
