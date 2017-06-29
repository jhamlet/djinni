/**
 * @typedef Djinni
 * @type Object
 */

/**
 * A function that eceives a reference to the `djinni` instance to perform
 * various operations.
 * @callback PluginCallback
 * @param {Djinni} djinni
 * @returns {Observable}
 */

/**
 * Creates a `djinni` instance for use in building out a directory of files.
 * @param {?Object|String} [optsOrPath] an options object, or a string which is
 * a path to the directory to use. If not given, defaults to either the
 * directory of the nearest `djinni.js(on)?` file, or the current working
 * directory.
 * @param {?String} [opts.directory]
 * @param {?String} [opts.source='./src']
 * @param {?String} [opts.destination='./dist']
 * @returns {Djinni} djinni instance
 */
export default (opts = {}) => {
  return /** @lends Djinni# */{
    /**
     * Add a plugin to be used in the build flow.
     * @param {PluginCallback} plugin
     * @returns {Djinni} current instance
     */
    use (plugin) {

    },
    /**
     * Run the build
     * @returns {Observable}
     */
    build () {

    },
    /**
     * Set the source directory. Defaults to `./src`
     * @param {String} src
     * @returns {Djinni} current instance
     */
    source (src) {

    },
    /**
     * Set the destination directory. Defaults to `./dist`
     * @param {String} dest
     * @returns {Djinni} current instance
     */
    destination (dest) {

    }
  };
}
