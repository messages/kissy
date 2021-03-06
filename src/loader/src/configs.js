/**
 * @ignore
 * Declare config info for KISSY.
 * @author yiminghe@gmail.com
 */
(function (S) {
    var Loader = S.Loader,
        Package = Loader.Package,
        Utils = Loader.Utils,
        host = S.Env.host,
        Config = S.Config,
        location = host.location,
        locationPath = '',
        configFns = Config.fns;

    if (location) {
        locationPath = location.protocol + '//' + location.host + location.pathname;
    }

    // how to load mods by path
    Config.loadModsFn = function (rs, config) {
        S.getScript(rs.url, config);
    };

    // how to get mod url
    Config.resolveModFn = function (mod) {
        var name = mod.name,
            filter, t, url, subPath;
        var packageInfo = mod.getPackage();
        var packageBase = packageInfo.getBase();
        var packageName = packageInfo.getName();
        var extname = '.' + mod.getType();
        // special for css module
        name = name.replace(/\.css$/, '');
        filter = packageInfo.filter;

        if (filter) {
            filter = '-' + filter;
        }

        // packageName: a/y use('a/y');
        if (name === packageName) {
            url = packageBase.substring(0, packageBase.length - 1) + filter + extname;
        } else {
            subPath = name + filter + extname;
            if (Utils.startsWith(name, packageName + '/')) {
                subPath = subPath.substring(packageName.length + 1);
            }
            url = packageBase + subPath;
        }

        if ((t = mod.getTag())) {
            t += '.' + mod.getType();
            url += '?t=' + t;
        }
        return url;
    };

    configFns.requires = shortcut('requires');

    configFns.alias = shortcut('alias');

    configFns.packages = function (config) {
        var Config = this.Config,
            packages = Config.packages;
        if (config) {
            Utils.each(config, function (cfg, key) {
                // object type
                var name = cfg.name = cfg.name || key;
                var base = cfg.base || cfg.path;
                if (base) {
                    cfg.base = normalizePath(base, true);
                }
                if (packages[name]) {
                    packages[name].reset(cfg);
                } else {
                    packages[name] = new Package(cfg);
                }
            });
            return undefined;
        } else if (config === false) {
            Config.packages = {
                core: packages.core
            };
            return undefined;
        } else {
            return packages;
        }
    };

    configFns.modules = function (modules) {
        if (modules) {
            Utils.each(modules, function (modCfg, modName) {
                var url = modCfg.url;
                if (url) {
                    modCfg.url = normalizePath(url);
                }
                var mod = Utils.getOrCreateModuleInfo(modName, modCfg);
                // #485, invalid after add
                if (mod.status === Loader.Status.INIT) {
                    Utils.mix(mod, modCfg);
                }
            });
        }
    };

    configFns.base = function (base) {
        var self = this,
            corePackage = Config.packages.core;

        if (!base) {
            return corePackage && corePackage.getBase();
        }

        self.config('packages', {
            core: {
                base: base
            }
        });

        return undefined;
    };

    function shortcut(attr) {
        return function (config) {
            var newCfg = {};
            for (var name in config) {
                newCfg[name] = {};
                newCfg[name][attr] = config[name];
            }
            S.config('modules', newCfg);
        };
    }

    function normalizePath(base, isDirectory) {
        if (base.indexOf('\\') !== -1) {
            base = base.replace(/\\/g, '/');
        }
        if (isDirectory && base.charAt(base.length - 1) !== '/') {
            base += '/';
        }
        if (locationPath) {
            if (base.charAt(0) === '/') {
                base = location.protocol + '//' + location.host + base;
            } else {
                base = Utils.normalizePath(locationPath, base);
            }
        }
        return base;
    }
})(KISSY);
