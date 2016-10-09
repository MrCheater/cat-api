var http, images, fs;
http = require('http');
fs = require('fs');

function getFiles (dir, files_){
    files_ = files_ || [];
    var files = fs.readdirSync(dir);
    for (var i in files){
        var name = dir + '/' + files[i];
        if (fs.statSync(name).isDirectory()){
            getFiles(name, files_);
        } else {
            files_.push('/' + name);
        }
    }
    return files_;
}

images = getFiles('images');

module.exports = function (req, res) {
    var readFile;
    var index = (images.length * Math.random())|0;
    if(req.url === '/') {
        res.writeHead(200, {
            'Content-Type': 'application/json'
        });
        res.end(JSON.stringify({
            url : images[index]
        }));
    } else if(images.indexOf(req.url) !== -1) {
        readFile = fs.createReadStream('.' + req.url);
        readFile.pipe(res);
    } else {
        res.writeHead(404);
        res.end();
    }
};