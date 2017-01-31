import { CommonUtils } from '@/util';

/**
 * Class representing a component with various configurations. This class is here just provide
 * a list of configurations for a component. It does not have any internal logic related to
 * components.
 */
export default class Component {

    /**
     * Constructor function
     *
     * @param {Object} cfg
     */
    constructor(cfg) {

        CommonUtils.assignIn(this, {
            /**
             * @cfg {String} name
             *
             * The name of this component
             */
            name: null,

            /**
             * @cfg {Function/Object} base
             *
             * The base of this component. This is either a constructor function or an object
             */
            base: null,

            /**
             * @cfg {String} factoryMethod
             *
             * The name of the method for this component to call to create an instance of this component. If `base` is a function,
             * the method must be "static". That means the function must be accessible as a property on the function, not the prototype.
             */
            factoryMethod: null,

            /**
             * @cfg {String} factoryComponent
             *
             * The name of a component which contains the `factoryMethod` used to create this compoment. This is optional, and if left blank,
             * the method `factoryMethod` will be called directly on the object or function provided in `base`.
             */
            factoryComponent: null,

            /**
             * @cfg {String/String[]} alias
             *
             * The aliases for this component. These can be used as refs for other injectable properties
             */
            alias: null,

            /**
             * @cfg {String} initMethod
             *
             * The method to invoke when this component is created
             */
            initMethod: null,

            /**
             * @cfg {String} destroyMethod
             *
             * The method to invoke when this component is destroyed. This method is only called if the object uses a singleton
             * scope. Prototype scopes do not have a managed lifecycle.
             */
            destroyMethod: null,

            /**
             * @cfg {String} scope
             *
             * The scope of this component. The available scopes are:
             *
             * - singleton: An instance of the component is created once and only once
             * - prototype: An instance of the component is created every time it is requested
             */
            scope: 'singleton',

            /**
             * @cfg {Booolean} lazy
             *
             * Only applies to singletons, if `true` this component is created only when it is needed. If `false`, it is
             * created as soon as all component configurations are ready to load
             */
            lazy: false,

            /**
             * @cfg {Object[]} constructorArgs
             *
             * The arguments to pass to the constructor. Each argument configuration can have the following properties:
             *
             * - index: The index of the argument for the constructor invocation. If specified, all constructor args need an index. Otherwise,
             * this property should be left as `undefined` which will use the order the arguments were defined in.
             * - value: An interpolated value to pass into the constructor. This can be a literal value or an evaluated property
             * - ref: A reference to another component by name or alias
             */
            constructorArgs: [],

            /**
             * @cfg {Object[]} properties
             *
             * Field injection properties. This defines the fields which will be injected into the component once it has been created via the provided
             * constructor function. Each property is defined as an object with the following properties:
             *
             * - name: The name of the property in the component instance
             * - value: An interpolated value to pass into the constructor. This can be a literal value or an evaluated property
             * - ref: A reference to another component by name or alias
             *
             * Note: Field injection is typicially discouraged as it hides implementation details and allows components to become too large. It is supported
             * here since it is a common pattern.
             */
            properties: [],

            /**
             * @cfg {Object[]} methods
             *
             * TODO
             */
            methods: [],

            /**
             * @cfg {Object[]} attrs
             *
             * Extended attributes and responsibilities related to this component. For example, this is where pre/post processors are defined.
             */
            attrs: []

        }, cfg);
    }
}
