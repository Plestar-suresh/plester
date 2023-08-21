const NodeMediaServer = require('node-media-server');
var fs = require('fs');
var http = require('http');

const mediaFolder = '/home/ihelpdaas/public_html/ss/mednew';
const ffmpegFolder = '/usr/bin/ffmpeg';
const appName = 'livenew';
var globalStreams = {}; 

const config = {
  rtmp: {
    port: 1936,
    chunk_size: 60000,
    gop_cache: true,
    ping: 30,
    ping_timeout: 60
  },
  http: {
    port: 8001,
    allow_origin: '*'
  },
};

var nms = new NodeMediaServer(config);
nms.run();
var root = this;
nms.on('postPublish', (id, StreamPath, args) => {
	globalStreams[id] = StreamPath.split(appName + '/')[1];
	var options = {
	  host: 'ihelpdaas.org',
	  port: 80,
	  path: '/ssolssa/api/ls_started?lsk=' + globalStreams[id]
	};

	http.get(options, function(res) {
	}).on('error', function(e) {
	  console.log("Got error: " + e.message);
	});
});

nms.on('donePublish', (id, StreamPath, args) => {
	globalStreams[id] = StreamPath.split(appName + '/')[1];
});

nms.on('doneConnect', (id, args) => {
	var streamKey = globalStreams[id];
	var options = {
	  host: 'ihelpdaas.org',
	  port: 80,
	  path: '/ssolssa/api/ls_ended?lsk=' + streamKey
	};

	http.get(options, function(res) {
	  /*console.log("Got response: " + res.statusCode);
	  res.on('data', function (chunk) {
		console.log('BODY: ' + chunk);
	  });
	}).on('error', function(e) {
	  console.log("Got error: " + e.message);
	});
	delete globalStreams[id];

	var dir = mediaFolder + '/' + appName + '/' + streamKey + '/';
	var files = fs.readdirSync(dir);
	files.sort(function(a, b) {
    	return fs.statSync(dir + b).mtime.getTime() - fs.statSync(dir + a).mtime.getTime();
	});
	console.log(files);
	if(files.length > 0){
    
    	setTimeout(function () {
        	root.fs.rename(dir + files[0], dir + id + '.mp4', function(err) {
            	if ( err ) console.log('ERROR: ' + err);
            	else console.log('Done');
        	});
        }, 3000);
	}
  	delete globalStreams[id];
  	console.log(globalStreams);
});
