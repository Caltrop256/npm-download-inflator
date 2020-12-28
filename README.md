# npm-download-inflator
Artificially increase the download-counter of any npm package!

Read more about this [here](https://caltrop.dev/why-you-should-not-trust-npm-download-count).

## Install

`$ npm install --save download-inflator`

## Usage

Requiring `download-inflator` will return a class. Upon instantiation it will increment the download count of the 
specified package every second.

```js
var DownloadInflator = require('download-inflator');

var inflator = new DownloadInflator({
	name: 'download-inflator'
});
```

### Options

#### name
Type: `string`

The name of the npm package.

#### onPing
Type: `function`

A function to be called whenever the download count gets increased.

Default: `function() {}`

```js
var DownloadInflator = require('download-inflator');

var inflator = new DownloadInflator({
    name: 'download-inflator',
    onPing: function(timesPinged) {
		console.log('The download count has been incremented ' + timesPinged + ' times!');
	}
});
```

#### delay
Type `number`

The amount of time to wait between pings in milliseconds

Default: `1000`

##### version
Type `string`

The version of the package.

Default: `'1.0.0'`

#### scope
Type `string`

The scope of the npm package if it is scoped

Default: `null`

```js
var DownloadInflator = require('download-inflator');

var inflator = new DownloadInflator({
    name: 'download-inflator',
    version: '1.0.0',
	scope: 'caltrop'
});
```

### Methods

#### stop

Stops the interval, optionally takes an amount of time in milliseconds to wait before stopping.

The example below increases the download count of this package once every 250 milliseconds and automatically stops after 10 seconds:
```js
var DownloadInflator = require('download-inflator');

var inflator = new DownloadInflator({
    name: 'download-inflator',
    delay: 250
});

inflator.stop(10 * 1000);
```

## License
This demo is licensed under the GNU General Public License v3.0. You may copy, distribute and modify the software as long as you track changes/dates in source files. Any modifications to this project must be made available under the GPL along with build & install instructions.