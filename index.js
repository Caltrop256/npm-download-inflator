var {get} = require('https');

function isValid(s) {
    return typeof s === 'string' && s.length;
}

/**
 * @typedef options
 * @type {Object}
 * @property {string} name The name of the package
 * @property {function(number):undefined} [onPing]
 * @property {number} [delay] Time to wait inbetween pings
 * @property {string} [version] The version of the package
 * @property {string} [scope] The name of the scope if required
 */

/**
 * @class InstallInflator
 * @description Inflates the download count of an npm package
 * @public
 * @property {number} timesPinged
 * @property {function(number):undefined} onPing
 * @param {options} options 
 */
function InstallInflator(options = {}) {
    if(!InstallInflator[Symbol.hasInstance](this)) return new InstallInflator(options);
    if(!isValid(options.name)) throw TypeError('Package name must be a String!');
    var delay = Number(options.delay);
    if(typeof options.delay !== 'undefined' && (delay !== delay || delay === Infinity || delay <= 0)) throw new TypeError('Ping delay must be a valid finite number above 0');
    if(!isValid(options.version)) options.version = '1.0.0';
    if(!isValid(options.scope)) options.scope = '';
    if(options.scope.charAt(0) === '@') options.scope = options.scope.substring(1);
    this.$stopped = false;
    var {name, version, scope} = options;
    var url = encodeURI('https://registry.npmjs.org/'+(scope.length ? '@'+scope+'/'+ name : name)+'/-/'+name+'-'+version+'.tgz');
    var self = this;
    new Promise(function(resolve, reject) {
        get(url, function(res) {
            resolve(res.statusCode === 200);
        }).on('error', reject);
    }).then(function(packageExists) {
        if(self.$stopped) return;
        if(!packageExists) throw new Error('The specified package does not exist or can\'t be reached at the moment!');
        self.timesPinged = 0;
        self.onPing = typeof options.onPing === 'function' ? options.onPing : function() {};
        self.$intervalId = setInterval(get.bind(null, url, function() {
            self.timesPinged += 1;
            if(typeof self.onPing === 'function') self.onPing(self.timesPinged);
        }), delay || 1000);
    }).catch(console.error);
};

/**
 * Ends the pinging delay
 * @param {number} [delay] Optionally, how long to wait before stopping in milliseconds 
 * @returns {void}
 */
InstallInflator.prototype.stop = function stop(delay) {
    var del = Number(delay);
    if(typeof delay !== 'undefined' && (del !== del || del === Infinity || del <= 0)) throw new TypeError('Stop delay must be a valid finite number above 0');
    var self = this;
    function end() {
        self.$stopped = true;
        clearInterval(self.$intervalId);
    }
    if(del) {
        setTimeout(end, del);
    } else {
        end();
    }
};
module.exports = InstallInflator;
