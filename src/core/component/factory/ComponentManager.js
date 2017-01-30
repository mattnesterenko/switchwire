import _ from 'lodash';

import Component from '../Component';

/**
 * Simple class to manage components and their aliases
 */
export default class ComponentManager {
    constructor() {
        this.registry = {};
        this.components = [];
    }

    /**
     * Returns a component by name or alias. If no component is found, `undefined` is returned
     *
     * @param {String} nameOrAlias The full name or alias of the component
     * @return {Object}
     */
    getComponent(nameOrAlias) {
        return _.get(this.registry, nameOrAlias);
    }

    /**
     * Tests whether or not a component exists from a certain name or alias
     *
     * @param {String} nameOrAlias
     * @return {Boolean}
     */
    hasComponent(nameOrAlias) {
        return !_.isNil(this.getComponent(nameOrAlias));
    }

    /**
     * Normalizes a component name or alias. If name is provided, name is returned. If
     * an alias is provdied, it's primary name is returned. If no component is registered
     * with the provided name/alias, `null` is returned.
     *
     * @param {String} nameOrAlias
     * @return {String}
     */
    normalize(nameOrAlias) {
        if (this.hasComponent(nameOrAlias)) {
            return this.getComponent(nameOrAlias).name;
        }

        return null;
    }

    /**
     * Applies a function to each component in this manager
     *
     * @param {Function} callback
     */
    each(callback) {
        _.each(this.components, callback);
    }

    /**
     * Registers a component with this component manager. This method returns nothing.
     *
     * Names and aliases can use dot notation to represent nested namespaces.
     *
     * @param {Component} cmp
     */
    registerComponent(cmp) {

        if (!(cmp instanceof Component)) {
            throw new Exception('Only Component instances can be registered with a ComponentManager');
        }

        var { name, alias } = cmp;

        this.components.push(cmp);
        _.set(this.registry, name, cmp);

        // register this component by each aliased name too
        if (!_.isEmpty(alias)) {
            _.each(_.castArray(alias), a => {
                _.set(this.registry, a, cmp);
            });
        }

        return cmp;
    }
}
