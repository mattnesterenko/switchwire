import _ from 'lodash';

import { CommonUtils } from '@/core/util';

/**
 * Scope which always creates a new instance of an object. Note, since there is no way
 * to gauge when one of these objects is no longer in use, they will never be destroyed.
 */
export default class PrototypeScope {

    /**
     * Default constructor
     *
     * @param {Object} cfg
     */
    constructor(cfg) {
        _.extend(this, {

            /**
             * @cfg {Function} onDelete
             *
             * Callback handler for when this scope is deleted
             */
            onDelete: null

        }, cfg);
    }

    /**
     * Returns a component by name
     *
     * @param {String} name
     * @param {Function} factoryFn
     * @return {Object}
     */
    getComponent(name, factoryFn) {
        return factoryFn();
    }

    /**
     * This method only calls the onDelete callback. Components created with a prototype scope
     * are not managed under the container lifecycle as it is not known when these objects
     * will be disposed of
     */
    destroy() {
        CommonUtils.callback('onDelete', this);
    }
}
