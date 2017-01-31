import { CommonUtils } from '@/util';

/**
 * Class which contains items as named singletons
 */
export default class SingletonScope {

    /**
     * Default constructor
     */
    constructor() {
        CommonUtils.extend(this, {
            /**
             * @cfg {Function} onDelete
             *
             * Callback handler for when this scope is deleted
             */
            onDelete: null,

            /**
             * @private @property {Object} instances
             *
             * The instances created by this scope
             */
            instances: {}
        });
    }

    /**
     * Returns a component by name if it exists, otherwise automatically creates and registers it
     *
     * @param {String} name The name of the component
     * @param {Function} factoryFn Function to call to create the component
     * @return {Object} The singleton component
     */
    getComponent(name, factoryFn) {
        if (!this.instances[name]) {
            var instance = factoryFn();

            this.instances[name] = instance;
        }

        return this.instances[name];
    }

    /**
     * Destroys this scope and all components registered within it
     */
    destroy() {
        CommonUtils.each(this.instances, inst => inst.destroy());

        CommonUtils.callback('onDelete', this);
    }
}
