// constructs g.settings object
module.exports = function () {
    var appRoot = m.path.normalize(__dirname + '/');

    g.settings = {
        appRoot: appRoot,
        classLoader: {
            baseDir: m.path.join(appRoot, 'classes/'),
            toLoad: [
                'Server',
                'LessWatch'
            ]
        },
        Server: {
            webroot: 'www',
            port: 3000
        },
        LessWatch: {
            paths: {
                watchDirs: [
                    './less/**/*.less'
                ],
                lessInput: [
                    './less/all.less'
                ],
                cssOutput: './www/css'
            }
        },
        MONGOOSE: {
            connect: 'true',
            host: 'localhost',
            database: 'test',
            user: '',
            pass: ''
        },
        MYSQL: {
            connect: 'false',
            host: 'localhost',
            database: '',
            user: 'root',
            pass: ''
        }
       
    };
};
