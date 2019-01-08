const fs = require('fs');

// Папка, где хранится проект
var appPath = './src/components';

// Папка, где хранятся библиотеки
var vendorPath = './src/vendors';

// Папка, где собирается проект
var buildPath = './www';

// Пространство имен, где будут доступны шаблоны
var namespace = 'window.profili = window.profili || {}; window.profili.html'

// Строки с названиями дополнительных файлов, которые необходимо скопировать
var addition = [];

var appCSS = '';
var appJS = '';
var appTemplates = {};
var vendorCSS = '';
var vendorJS = '';

var version = process.argv[2] || Date.now();


var makeBuildDir = function() {
    fs.mkdirSync(buildPath);
    fs.mkdirSync(buildPath + '/assets');
}

var clearDirRecursive = function(path) {
    try {
        let stat = fs.lstatSync(path)
    } catch (e) {
        return;
    }

    fs.readdirSync(path).forEach(function(item, index) {
        let stat = fs.lstatSync(path + '/' + item);
        if (stat.isFile()) {
            fs.unlinkSync(path + '/' + item);
        } else {
            clearDirRecursive(path + '/' + item);
        }
    });
    fs.rmdirSync(path);
}

var build = function() {
    clearDirRecursive(buildPath);
    makeBuildDir();

    fs.readdir(appPath, (err, files) => {
        if (err) {
            console.error(err);
            return;
        }
        files.forEach(file => {
            console.log('Обрабатывается: ' + file);
            try {
                appCSS += fs.readFileSync(appPath + '/' + file + '/' + file + '.css').toString();
            } catch (e) {
                console.log('Не обнаружено: ' + appPath + '/' + file + '/' + file + '.css');
            }
            try {
                appJS += fs.readFileSync(appPath + '/' + file + '/' + file + '.js') + ';';
            } catch (e) {
                console.log('Не обнаружено: ' + appPath + '/' + file + '/' + file + '.js');
            }

            try {
                appTemplates[file] = fs.readFileSync(appPath + '/' + file + '/' + file + '.html').toString();;
            } catch (e) {
                console.log('Не обнаружено: ' + appPath + '/' + file + '/' + file + '.html');
            }

            try {
                let assets = fs.readdirSync(appPath + '/' + file + '/assets');
                console.log('Копируем ASSETS: ' + appPath + '/' + file + '/assets');
                assets.forEach(asset => {
                    fs.copyFileSync(appPath + '/' + file + '/assets/' + asset, buildPath + '/assets/' + asset);
                })
            } catch (e) {
                console.log('Не обнаружено папки ASSETS: ' + appPath + '/' + file + '/assets');
            }
        });

        fs.writeFileSync(buildPath + '/app-' + version + '.css', appCSS);
        fs.writeFileSync(buildPath + '/app-' + version + '.js', appJS);
        var templatesJS = `(function() { ${namespace}  = ${JSON.stringify(appTemplates)};})();`;
        fs.writeFileSync(buildPath + '/templates-' + version + '.js', templatesJS);
    });

    fs.readdir(vendorPath, (err, files) => {
        if (err) {
            console.error(err);
            return;
        }
        files.forEach(file => {
            console.log('Обрабатывается: ' + file);
            try {
                vendorCSS += fs.readFileSync(vendorPath + '/' + file + '/' + file + '.css').toString()
            } catch (e) {
                console.log('Не обнаружено: ' + vendorPath + '/' + file + '/' + file + '.css');
            }
            try {
                vendorJS += fs.readFileSync(vendorPath + '/' + file + '/' + file + '.js').toString() + ';';
            } catch (e) {
                console.log('Не обнаружено: ' + vendorPath + '/' + file + '/' + file + '.js');
            }

        });

        fs.writeFileSync(buildPath + '/vendors-' + version + '.css', vendorCSS);
        fs.writeFileSync(buildPath + '/vendors-' + version + '.js', vendorJS);

    });


    // Копируем дополнительные файлы
    addition.forEach((file) => {
        fs.copyFileSync(appPath + '/' + file, buildPath + '/' + file);
    })

    var indexHTML = fs.readFileSync(appPath + '/index.html', 'utf8');

    var re = /<%([^%>]+)?%>/g;
    var match;

    while (match = re.exec(indexHTML)) {
        indexHTML = indexHTML.replace(match[0], version);
    }

    fs.writeFileSync('./www/index.html', indexHTML);
}

build();