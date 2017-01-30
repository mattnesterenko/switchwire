import { Component, ComponentFactory, ComponentRequirePathResolver } from '../component';

import _ from 'lodash';

/**
 * Base class which combines the component factory and configuration loading
 */
export default class ComponentContext {

	/**
	 * Constructor
	 *
	 * @param {Object} cfg
	 */
	constructor(cfg) {

		_.extend(this, cfg, {

			/**
			 * @cfg {Object} factoryCfg
			 *
			 * A configuration object to pass into the component factory when it is created
			 */
			factoryCfg: {
				dependencyResolvers: ['RequireResolver']
			},

			/**
			 * @private @property {ComponentFactory} factory
			 *
			 * The component factory for this context
			 */
			factory: null,

			/**
			 * @private @property {ComponentContext} parentContext
			 *
			 * The parent component context, if there is one
			 */
			parentContext: null
		});

		// create a component factory now
		this.factory = new ComponentFactory(this.factoryCfg);

		this.initDefaultComponents();

		//this.factory.initComponents();
	}

	/**
	 * Sets a parent component context
	 *
	 * @param {ComponentContext} parent
	 */
	setParentComponentContext(parentContext) {
		this.parentContext = parentContext;

		this.factory.setParentFactory(parentContext.getComponentFactory());
	}

	/**
	 * Registers a new dependency resolver with this context
	 *
	 * @param {DependencyResolver} resolver
	 */
	registerDependencyResolver(resolver) {
		return this.factory.registerDependencyResolver(resolver);
	}

	/**
	 * Returns a component by its name or alias
	 *
	 * @param {String} nameOrAlias The name or alias of the component to retrieve
	 * @return {Object} The component instance
	 */
	getComponent(nameOrAlias) {
		return this.factory.getComponent(nameOrAlias);
	}

	/**
	 * Returns whether or not this context contains a given component by name or alias
	 *
	 * @param {String} nameOrAlias
	 * @param {Boolean} [checkParent=true] Checks the parent context if one is available
	 * @return {Boolean}
	 */
	hasComponent(nameOrAlias, checkParent = true) {
		return this.factory.hasComponent(nameOrAlias, checkParent);
	}

	/**
	 * Manually registers a component with this context
	 *
	 * @param {Component} component
	 */
	registerComponent(component) {
		return this.factory.registerComponent(component);
	}

	/**
	 * Registers a component by a configuration object
	 *
	 * @param {Object} componentConfig
	 * @return {Component} The created component
	 */
	registerComponentConfiguration(componentConfig) {
		var cmp = new Component(componentConfig);

		return this.registerComponent(cmp);
	}

	/**
	 * Registers a component by its base
	 *
	 * @param {String} name The name of the component
	 * @param {Function/Object} base The constructor or base of the component
	 * @param {Object} [componentConfig] Optional additional configuration for this component
	 * @return {Component} The registered component
	 */
	registerComponentByBase(name, base, componentConfig) {
		var cfg = _.defaults({ name, base }, componentConfig);

		return this.registerComponentConfiguration(cfg);
	}

	/**
	 * Destroys this component context
	 */
	destroy() {
		this.parentContext = null;
		this.factory.destroy();
	}

	//////////////////////////////////////////////////
	/// Begin private methods
	//////////////////////////////////////////////////

	initDefaultComponents() {
		var { factory } = this;

		if (!this.hasComponent('RequireResolver')) {
			this.registerComponentByBase('RequireResolver', ComponentRequirePathResolver, { attrs: [{ type: 'componentResolver' }] });
		}
	}

	/**
	 * @private
	 * Returns the component factory for this context
	 *
	 * @return {ComponentFactory}
	 */
	getComponentFactory() {
		return this.factory;
	}
}
