import { CommonUtils } from '@/util';

import Component from './Component';

/**
 * Simple wrapper class for keeping a component instance associated with a compoment configuration
 */
export default class ComponentInstance {

    /**
     * Constructor
     *
     * @param {Object} instance
     * @param {Component} component The component configuration for this instance
     */
    constructor(instance, component) {
        this.setInstance(instance);
        this.setComponent(component);
    }

    /**
     * Sets the instance for this wrapper
     *
     * @param {Objecty} instance
     */
    setInstance(instance) {
        this.instance = instance;
    }

    /**
     * Returns the instance for this wrapper
     *
     * @return {Object}
     */
    getInstance() {
        return this.instance;
    }

    /**
     * Sets the component configuration for this wrapper
     *
     * @param {Component} component
     */
    setComponent(component) {
        this.component = component;
    }

    /**
     * Returns the component configuration for this wrapper
     *
     * @return {Component}
     */
    getComponent() {
        return this.component;
    }

    /**
     * Destroys this component instance object. This will invoke the destroyMethod if one
     * was defined for this component
     */
    destroy() {
        var { component, instance } = this;

        if (component.destroyMethod) {
            CommonUtils.callback(component.destroyMethod, instance);
        }

        this.component = this.instance = null;
    }
}
