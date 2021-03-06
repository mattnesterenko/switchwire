import _ from 'lodash';

import Component from '../Component';
import ComponentAttributes from '../ComponentAttributes';
import ComponentInstance from '../ComponentInstance';

import ComponentManager from './ComponentManager';

import SingletonScope from './SingletonScope';
import PrototypeScope from './PrototypeScope';

import { CommonUtils } from '@/core/util';

const DEFAULT_FACTORY_METHOD = 'getComponent';
const DEFAULT_PRIORITY = 10000;

const DEFAULT_INIT_ATTR_PRIORITY = {
    [ComponentAttributes.COMPONENT_RESOLVER]: 1000,
    [ComponentAttributes.COMPONENT_POST_PROCESSOR]: 5000,
    [ComponentAttributes.COMPONENT_FACTORY_AWARE]: DEFAULT_PRIORITY - 1
};


/**
 * Primary class for registering components and wiring them together based on their noted
 * dependencies
 */
export default class ComponentFactory {

    /**
     * Constructor
     */
    constructor(cfg) {
        _.extend(this, {

            /**
             * @property {ComponentManager} componentManager
             *
             * The component manager for handling all component registrations in this factory
             */
            componentManager: new ComponentManager(),

            /**
             * @cfg {ComponentFactory} parentFactory
             *
             * An optional parent factory to pull dependencies from
             */
            parentFactory: null,

            /**
             * @property {Boolean} locked
             *
             * The locked status of this factory. `true` prevents new components from being registered.
             * `false` still allows modifications`.
             */
            locked: false,

            /**
             * @private @property {Object} scopes
             *
             * The scopes associated with this component
             */
            scopes: {},

            /**
             * @private @property {Object[]} componentPostProcessors
             *
             * A list of components which are postprocessors for all created compomentss
             */
            componentPostProcessors: [],

            /**
             * @private @property {String[]} componentCreationStack
             *
             * A stack of the components being created to avoid circular loops
             */
            componentCreationStack: [],

            /**
             * @private @property {String} dependencyResolvers
             *
             * A name of components which act as component resolvers
             */
            dependencyResolvers: []

        }, cfg);

        this.init();
    }

    /**
     * Returns a component by name. If the component is not found in this factory, this will
     * attempt to see if a parent-level factory has a component with this name.
     *
     * @param {String} nameOrAlias
     * @return {Object} The component instance
     */
    getComponent(nameOrAlias) {
        if (!this.locked) {
            throw new Error('getComponent()- Cannot retrieve a component until configuration is complete');
        }

        return this.doGetComponent(nameOrAlias);
    }

    /**
     * Returns whether or not this component factory contains a component by name or alias.
     * This can also check a parent factory if one is defined
     *
     * @param {String} nameOrAlias The name or alias of the component
     * @param {Boolean} [checkParent=true] Check the parent factory to see if it contains the component
     * if this one does not
     * @return {Boolean}
     */
    hasComponent(nameOrAlias, checkParent = true) {
        var hasCmp = this.componentManager.hasComponent(nameOrAlias);

        if (!hasCmp && checkParent === true && this.parentFactory) {
            return this.parentFactory.hasComponent(nameOrAlias, true);
        }

        return hasCmp;
    }

    /**
     * Registers a component configuration
     *
     * @param {Component} component
     * @return {Component} component
     */
    registerComponent(component) {
        if (this.locked) {
            throw new Exception('registerComponent()- You cannot register a component on a locked ComponentFactory!');
        }

        component.priority = this.getComponentPriority(component);

        return this.componentManager.registerComponent(component);
    }

    /**
     * Initializes all components once everything has been registered. This can only
     * be called once, and when called, prevents new components from being registered
     * in this factory.
     */
    initComponents() {
        if (this.locked) {
            throw new Exception('initComponents()- You cannot reinitialize a ComponentFactory!');
        }

        this.locked = true;


        // get all compoments, order them by priority, and call getComponent on each of them to create and register them
        _(this.componentManager.components)
            .sortBy('priority')
            .filter(c => c.scope === 'singleton') // only initalize singleton items
            .filter(c => c.lazy !== true) // do not initialize lazy items
            .each(c => this.getComponent(c.name));
    }

    /**
     * Normalizes a component name. If an alias is provided, the name of the component is returned
     *
     * @param {String} nameOrAlias
     * @return {String}
     */
    normalizeComponentName(nameOrAlias) {
        return this.componentManager.normalize(nameOrAlias);
    }

    /**
     * Registers a scope by name
     *
     * @param {String} name The name of the scope
     * @param {Object} scope The scope instance
     * @return {Object} scope
     */
    registerScope(name, scope) {
        var { scopes } = this;

        scopes[name] = scope;

        scope.onDestroy = () => delete scopes[name];

        return scope;
    }

    /**
     * Sets the parent factory for this factory
     *
     * @param {ComponentFactory} parent
     */
    setParentFactory(parent) {
        this.parentFactory = parent;
    }

    /**
     * Returns a scope by name
     *
     * @param {String} name
     * @return {Object} scope
     */
    getScope(name) {
        return this.scopes[name];
    }

    /**
     * Destroys this component factory
     */
    destroy() {
        this.parentFactory = null;

        // destroy all registered scope
        _.each(this.scopes, s => s.destroy());

        this.scopes = null;
    }

    /////////////////////////////////////////
    // Begin "private" methods
    /////////////////////////////////////////

    /**
     * @private
     * Initializes this factory with some standard behavior defaults
     */
    init() {
        // register the singleton and prototype scopes
        this.registerScope('singleton', new SingletonScope());
        this.registerScope('prototype', new PrototypeScope());
    }

    /**
     * @private
     * Returns a component by name. If the component is not found in this factory, this will
     * attempt to see if a parent-level factory has a component with this name.
     *
     * @param {String} nameOrAlias
     * @return {Object} The component instance
     */
    doGetComponent(nameOrAlias) {
        var mgr = this.componentManager,
            cmp = mgr.getComponent(nameOrAlias),
            normalizedName = this.normalizeComponentName(nameOrAlias),
            me = this;

        // return a component from a parent-level factory
        if (!cmp && this.parentFactory) {
            return this.parentFactory.getComponent(nameOrAlias);
        }

        if (!cmp) {
            throw new Error(`getComponent()- Unable to find component by name: "${ nameOrAlias }"`);
        } else if (this.componentCreationStack.indexOf(normalizedName) !== -1) {
            throw new Error(`getComponent()- Component: "${ nameOrAlias }" (normalized: "${ normalizedName }") is already being created! Component Queue: ${ this.componentCreationStack.join(' -> ') }`);
        } else {
            this.componentCreationStack.push(normalizedName);
        }

        var cmpScope = cmp.scope,
            scope = this.scopes[cmpScope];

        if (!scope) {
            this.componentCreationStack.pop();

            throw new Error(`getComponent()- Invalid component scope: "${ cmpScope }" defined for component: "${ nameOrAlias }" (normalized: "${ normalizedName }").`);
        }

        // return the component from the provided scope
        var cmpInst = scope.getComponent(normalizedName, () => me.createComponent(cmp));

        this.componentCreationStack.pop();

        return cmpInst.getInstance();
    }

    /**
     * @private
     * Creates a component from its configuration
     *
     * @param {Component} component
     * @return {ComponentInstance}
     */
    createComponent(component) {
        var me = this,
            inst;

        if (component.factoryMethod) {
            inst = this.buildComponentFromFactoryMethod(component);
        } else {
            inst = this.buildComponentFromConstructor(component);
        }

        // handle all pre-init functionality
        this.executePreInitProcessors(inst, component);

        // call the init method if one was provided
        if (component.initMethod) {
            CommonUtils.callback(component.initMethod, inst);
        }

        // handle all post-init functionality
        inst = this.executePostInitProcessors(inst, component);

        // process all attributes of this component
        _.each(component.attrs, attr => this.processComponentAttribute(component, inst, attr));

        // wrap the instance with its configuration and return it
        return new ComponentInstance(inst, component);
    }

    /**
     * @private
     * Builds a component through a factory method. The factory method must be a static
     * method for a given component
     *
     * @param {Component} component
     * @return {Object}
     */
    buildComponentFromFactoryMethod(component) {
        var { factoryMethod, factoryComponent } = component;

        if (factoryMethod === true) {
            factoryMethod = DEFAULT_FACTORY_METHOD;
        }

        if (!factoryComponent) {
            factoryComponent = this.getComponentBase(component);
        } else {
            factoryComponent = this.getComponent(factoryComponent);
        }

        return CommonUtils.callback(factoryMethod, factoryComponent);
    }

    /**
     * @private
     * Builds a component from a constructor argument
     *
     * @param {Component} component
     * @return {Object}
     */
    buildComponentFromConstructor(component) {
        var T = this.getComponentBase(component);

        // if the type is a regular object and not a function, return
        // the object itself.
        if (_.isObject(T) && !_.isFunction(T)) {
            return T;
        }

        var constructorArgs = this.getConstructorArgs(component);
        return new T(...constructorArgs);
    }

    /**
     * @private
     * Returns the priority for a given component based on its configuration or provided attributes
     *
     * @param {Component} component
     * @return {Number} The priority number
     */
    getComponentPriority(component) {
        var { priority, attrs } = component;

        if (_.isFinite(priority)) {
            return priority;
        }

        // return the lowest priority for this component based on its attribute types
        return _(attrs).map(attr => DEFAULT_INIT_ATTR_PRIORITY[attr.type] || DEFAULT_PRIORITY).concat(DEFAULT_PRIORITY).min();
    }

    /**
     * @private
     * Executes all component postprocessors defined to run prior to component initialization
     *
     * @param {Object} inst The component instance
     * @param {Component} component
     */
    executePreInitProcessors(inst, component) {
        _.each(this.componentPostProcessors, p => this.getComponent(p).preInitProcessor(inst, component));
    }

    /**
     * @private
     * Executes all component postprocessors defined to run after component initialization. Postprocessors
     * can return a different instances of the component (i.e., component proxying).
     *
     * @param {Object} inst The component instance
     * @param {Component} component
     * @return {Object} inst
     */
    executePostInitProcessors(inst, component) {
        return _.reduce(this.componentPostProcessors, (ret, p) => (this.getComponent(p).postInitProcessor(ret, component) || ret), inst);
    }

    /**
     * @private
     * Components an attribute for a specific component
     *
     * @param {Component} component The component configuration
     * @param {Object} inst The component instance
     * @param {Object} attr The attribute for the component
     */
    processComponentAttribute(component, inst, attr) {
        var { type } = attr;

        if (type === ComponentAttributes.COMPONENT_POST_PROCESSOR) {
            this.componentPostProcessors.push(component.name);
        } else if (type === ComponentAttributes.COMPONENT_RESOLVER) {
            this.dependencyResolvers.push(component.name);
        } else if (type === ComponentAttributes.COMPONENT_FACTORY_AWARE) {
            inst.setComponentFactory(this);
        }
    }

     /**
     * @private
     * Returns the constructor arguments based on a component's configurations
     *
     * @param {Component} component
     * @return {Object[]}
     */
    getConstructorArgs(component) {
        var { constructorArgs } = component;

        // map all constructor args to whatever they map to
        return _.map(constructorArgs, arg => this.getConstructorArg(arg, component));
    }

    /**
     * @private
     * Returns an constructor argument based on its configuration
     *
     * @param {Object} constructorArg The constructor argument configuration
     * @param {Component} component The component requesting the arg
     * @return {Mixed}
     */
    getConstructorArg(constructorArg, component) {
        var { ref, value } = constructorArg;

        if (ref) {
            return this.getComponent(ref);
        } if (_.isDefined(value)) {
            return value;
        }
    }

    /**
     * @private
     * Returns the base object for a component
     *
     * @param {Component} component
     * @return {Object/Function}
     */
    getComponentBase(component) {
        if (component.base) {
            return component.base;
        }

        var resolver = _(this.dependencyResolvers)
            .map(name => this.getComponent(name))
            .find(resolver => resolver.canResolveComponent(component));

        if (resolver) {
            return resolver.resolveComponent(component);
        }
    }
}
