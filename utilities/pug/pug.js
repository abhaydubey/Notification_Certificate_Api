const pug = require('pug');

module.exports = function (filepath, options) {
    options = options || {};
    return new Promise(function (resolve, reject) {
        pug.renderFile(filepath, options, (err, html) => {
            if (err) {
                reject(err);
            } else {
                resolve(html);
            }
        });
    });
}
