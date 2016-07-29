# gulp-wp-theme

> Code in development. Get an optimized wordpress package.

![gulp-wp-theme](./development/images/gulp-wp-theme.png)

## Features

* ES6 with Babel
* [Include JavaScript files like snockets / sprockets](https://github.com/wiledal/gulp-include#include-directives)
* Image optimization
* CSS Autoprefixer
* __PHP Server__ and live reload with BrowserSync
* Powerful CSS with SASS
* JS and CSS minification
* Install and use components via npm and bower
* Useful helper functions
* Styles and scripts enqueued

## How to install

First of all, you need of PHP 5.4+ and MySQL installed on your environment.

1. Clone this repo and go to folder
2. Install npm dependencies with `npm install`
3. Download wordpress via `npm run wordpress` one time
4. Go to `development/sass/style.scss` and put your theme's information
5. Run `npm run watch` to preview and code
6. Install Wordpress and connect to your database, after that, sign in on Wordpress and activate the `gulp-wp-theme`
7. Code on the `development` folder like a theme (use full Wordpress functions)
8. Finished? Run `npm run build` to get an optimized wordpress package on `dist` folder

## Todo

* ~~Full integration with Wordpress~~
* One command to download a wordpress plugin, something like `npm run wordpress:plugin -- advanced-custom-fields`

## Some "issues"

If you see `undefined%` on wordpress download progress, don't worry about that.

## License

MIT.
