
var renderer = new THREE.WebGLRenderer();
var height = window.innerHeight;
renderer.setSize( window.innerWidth, height);
document.body.appendChild( renderer.domElement );

var camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 500 );

var x = 170;
var y = -70;

camera.position.set(x, y-200, 400);
camera.lookAt(new THREE.Vector3(x, y, 0));

var scene = new THREE.Scene();






d3.json('county.json', function(data) {
  d3.csv('data.csv', function(bigdata) {
    var dict = {};

    // bigdata = bigdata.filter(function(d) {
    //   return d.Year == '2014';
    // });

    bigdata.forEach(function(d) {
      dict[d.Zip] = d.Amount;
    })

    console.log('data', dict);

    var counties = topojson.feature(data, data.objects.county);
    var projection = d3.geo.mercator();
    var features = counties.features;

    var scale  = d3.scale.linear().domain([0, 130000]).range([0, 100]);

    features = features.filter(function(f) {
      return dict[f.id];
    });

    console.log('features with data', features.length);

    // features = features.slice(0, 1000);

    console.log('features', features);

    light = new THREE.PointLight(0xffffff, x, y);
    light.position.x = 170;
    light.position.y = -70;
    light.position.z = 50;
    light.intensity = 1.5;

    scene.add(light);

    features.forEach(function(feature) {
      
    })


    features.forEach(function(feature) {
      var coordinates = feature.geometry.coordinates[0];
      if (!coordinates) {
        return;
      }
      var polygon = coordinates[0];


      var shape = new THREE.Shape();

      polygon.forEach(function(coords, i) {
        var point = projection(coords);

        if (i == 0) {
          shape.moveTo(point[0], -1*point[1], 0);
        } else {
          shape.lineTo(point[0], -1*point[1], 0);
        }
      });

      // var material = new THREE.LineBasicMaterial({ color: 0xffffff });

      material = new THREE.MeshLambertMaterial( { color: 0x78D8FF  } );

      // var geometry = new THREE.ShapeGeometry(shape);
      var amount;
      if (dict[feature.id]) {
        amount = scale(dict[feature.id]);
      } else {
        amount = 1;
      }
      var geometry = new THREE.ExtrudeGeometry(shape, { amount: amount });

      mesh = new THREE.Mesh( geometry, material );

      scene.add(mesh);

      // var line = new THREE.Line(geometry, material);
      // scene.add(line);

      // var shape = new THREE.ExtrudeGeometry(geometry, { amount: 20 });
      // scene.add(shape);
      renderer.render(scene, camera);

    })
  });



  // var generator = d3.geo.path().projection(d3.geo.mercator());

  // var result = generator(counties);

  // console.log('result', result);



});
