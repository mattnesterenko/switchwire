import extend from 'lodash/extend';
import assignIn from 'lodash/assignIn';
import merge from 'lodash/merge';
import defaults from 'lodash/defaults';
import defaultsDeep from 'lodash/defaultsDeep';
import filter from 'lodash/filter';
import debounce from 'lodash/debounce';
import get from 'lodash/get';
import set from 'lodash/set';
import find from 'lodash/find';
import each from 'lodash/each';
import has from 'lodash/has';
import map from 'lodash/map';
import pull from 'lodash/pull';
import pullAll from 'lodash/pullAll';
import reduce from 'lodash/reduce';
import castArray from 'lodash/castArray';
import isUndefined from 'lodash/isUndefined';
import isString from 'lodash/isString';
import isDefined from 'lodash/isDefined';
import isNull from 'lodash/isNull';
import isNil from 'lodash/isNil';
import isFinite from 'lodash/isFinite';
import isObject from 'lodash/isObject';
import isFunction from 'lodash/isFunction';
import isEmpty from 'lodash/isEmpty';

/**
 * Class for common utility methods
 */
export default class CommonUtils {

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
        if (typeof fn === 'string' && fn in thisArg) {
            fn = thisArg[fn];
        }

        if (typeof fn === 'function') {
            return fn.apply(thisArg, args);
        }
    }
}

// lodash proxy methods. individual files beyond this should not require lodash or any subset of it
CommonUtils.extend = extend;
CommonUtils.assignIn = assignIn;
CommonUtils.merge = merge;
CommonUtils.defaults = defaults;
CommonUtils.defaultsDeep = defaultsDeep;
CommonUtils.filter = filter;
CommonUtils.debounce = debounce;
CommonUtils.get = get;
CommonUtils.set = set;
CommonUtils.find = find;
CommonUtils.each = each;
CommonUtils.has = has;
CommonUtils.map = map;
CommonUtils.pull = pull;
CommonUtils.pullAll = pullAll;
CommonUtils.reduce = reduce;
CommonUtils.castArray = castArray;
CommonUtils.isUndefined = isUndefined;
CommonUtils.isString = isString;
CommonUtils.isDefined = isDefined;
CommonUtils.isNull = isNull;
CommonUtils.isNil = isNil;
CommonUtils.isFinite = isFinite;
CommonUtils.isObject = isObject;
CommonUtils.isFunction = isFunction;
CommonUtils.isEmpty = isEmpty;
