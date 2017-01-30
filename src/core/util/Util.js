import _ from 'lodash';

/**
 * Class for common utility methods
 */
export default class Util {

    /**
     * Executes a callback function if it is a valid function. The function can also be a string to a function
     * assigned by the same name in `thisArg`.
     *
     * @param {Function/String} fn The function (or function name) to execute
     * @param {Object} thisArg The `this` binding for `fn`
     * @param {Array} args The arguments to pass into the function
     * @return {Mixed} The return value of `fn`, if it is valid
     */
    static callback(fn, thisArg, args) {
        if (_.isString(fn)) {
            fn = thisArg[fn];
        }

        if (_.isFunction(fn)) {
            return fn.apply(thisArg, args);
        }
    }
}
