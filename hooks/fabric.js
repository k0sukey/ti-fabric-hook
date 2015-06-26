var chalk = require('chalk'),
	fs = require('fs'),
	path = require('path'),
	wrench = require('wrench'),
	xcode = require('xcode');

exports.id = 'be.k0suke.ti-fabric-hook';
exports.cliVersion = '>=3.2';

exports.init = function init(logger, config, cli, appc) {
	var source = {
			fabric: path.join(__dirname, '..', '..', '..', '..', 'Fabric.framework'),
			crashlytics: path.join(__dirname, '..', '..', '..', '..', 'Crashlytics.framework')
		},
		destination = {
			fabric: path.join(__dirname, '..', '..', '..', '..', 'build', 'iphone', 'Fabric.framework'),
			crashlytics: path.join(__dirname, '..', '..', '..', '..', 'build', 'iphone', 'Crashlytics.framework')
		},
		tiappm = path.join(__dirname, '..', '..', '..', '..', 'build', 'iphone', 'Classes', 'TiApp.m'),
		pbxproj = path.join(__dirname, '..', '..', '..', '..', 'build', 'iphone', cli.tiapp.name + '.xcodeproj', 'project.pbxproj'),
		project = xcode.project(pbxproj),
		xcconfig = path.join(__dirname, '..', '..', '..', '..', 'build', 'iphone', 'project.xcconfig'),
		code;

	cli.on('build.pre.construct', function(data, callback){
		if (!fs.existsSync(source.fabric)) {
			logger.error(source.fabric + ' does not exists');
			process.exit(1);
		}

		if (!fs.existsSync(source.crashlytics)) {
			logger.error(source.crashlytics + ' does not exists');
			process.exit(1);
		}

		callback();
	});

	cli.on('build.pre.compile', function(data, callback){
		logger.info('Coping Fabric.framework: ' + chalk.cyan(destination.fabric));
		wrench.copyDirSyncRecursive(source.fabric, destination.fabric);

		logger.info('Coping Crashlytics.framework: ' + chalk.cyan(destination.crashlytics));
		wrench.copyDirSyncRecursive(source.crashlytics, destination.crashlytics);

		callback();
	});

	cli.on('build.ios.prerouting', function(data, callback){
		logger.info('Fabric code injecting: ' + chalk.cyan(tiappm));
		code = fs.readFileSync(tiappm, 'utf8');
		code = code.replace(/(#import\s"TiApp\.h")/, '$1\n#import <Fabric/Fabric.h>\n#import <Crashlytics/Crashlytics.h>');
		code = code.replace(/(-\s\(BOOL\)application:\(UIApplication\s\*\)application\sdidFinishLaunchingWithOptions:\(NSDictionary\s\*\)launchOptions_\n\{\n)/m,
			'$1    [Fabric with:@[CrashlyticsKit]];\n\n');
		fs.writeFileSync(tiappm, code);

		logger.info('Fabric code injecting: ' + chalk.cyan(xcconfig));
		code = fs.readFileSync(xcconfig, 'utf8');
		code = code.replace(/(OTHER_LDFLAGS\[sdk=iphoneos\*\]=\$\(inherited\)\s-weak_framework\siAd)/, '$1 -framework Fabric -framework Crashlytics');
		fs.writeFileSync(xcconfig, code);

		logger.info('Fabric code injecting: ' + chalk.cyan(pbxproj));
		project.parse(function(err){
			if (err) {
				process.exit(1);
			}

			project.addFramework(destination.fabric, {
				customFramework: true
			});
			project.addFramework(destination.crashlytics, {
				customFramework: true
			});
			fs.writeFileSync(pbxproj, project.writeSync());

			callback();
		});
	});

	cli.on('build.finalize', function(data, callback){
		callback();
	});
};