import _ from 'lodash';

import { CommonUtils } from '@/core/util';

/**
 * Decorator mixin used for event handling
 */
export default class Observable {

    /**
     * @static
     * Mixes the observable functionality into a given object or class instance. This does not
     * mix functionality into a constructor...
     *
     * @param {Object} instance The instance to mix the observable functionality into
     */
    static mixin(instance) {
        var o = new Observable();

        if (_.isFunction(instance.destroy)) {
            // intercept the destroy method...
            instance.destroy = (...args) => (o.destroy.apply(instance), instance.destroy(args));
        } else {
            instance.destroy = o.destroy;
        }

        // mixin the functionality now
        _.extend(instance, {
            events: {},

            fireEvent: o.fireEvent,
            addListener: o.addListener,
            removeListener: o.removeListener,
            removeListeners: o.removeListeners
        });
    }

    /**
     * Fires an event by name with any arguments provided
     *
     * @param {String} eventName The name of the event
     * @param {Object...} args... Any arguments to pass into the event
     * @return {Boolean} `false` if any event handlers returned `false`
     */
    fireEvent(eventName, ...args) {
        var event = this.events[eventName];

        if (event) {
            var ret = event.fire(args);

            if (ret === false) {
                return false;
            }
        }
    }

    /**
     * adds a listener to this class
     *
     * @param {String} eventName The name of the event
     * @param {String/Function} eventHandler The function to execute for this event. If a string, it is the name of the function in the `thisArg` object.
     * @param {Object} thisArg The `this` binding for `eventHandler`.
     * @param {Object} options. Options to provide for this event. This is automatically included as the last parameter in `eventHandler`
     */
    addListener(eventName, eventHandler, thisArg, options) {
        var { events } = this;
        var event = events[eventName];

        if (!event) {
            this.events[eventName] = event = new Event();
        }

        return event.addListener(eventHandler, thisArg, options);
    }

    /**
     * Removes a listener. Parameters must match those which were provided for addListener
     *
     * @param {String} eventName The name of the event
     * @param {String/Function} eventHandler The function to execute for this event. If a string, it is the name of the function in the `thisArg` object.
     * @param {Object} thisArg The `this` binding for `eventHandler`.
     * @param {Object} options. Options to provide for this event. This is automatically included as the last parameter in `eventHandler`
     */
    removeListener(eventName, eventHandler, thisArg, options) {
        var { events } = this;
        var event = events[eventName];

        if (event) {
            event.removeListener(eventHandler, thisArg, options);
        }
    }

    /**
     * Removes all events or all of the listeners for a particular event name
     *
     * @param {String} [eventName] The name of the event to purge listeners for (optional).
     */
    removeListeners(eventName) {
        if (eventName) {
            var event = this.events[eventName];

            if (event) {
                event.destroy();
                this.events[eventName] = null;
            }
        } else {
            _.each(this.events, event => event.destroy());
            this.events = {};
        }
    }

    /**
     * Destroys this observable instance
     */
    destroy() {
        this.fireEvent('destroy', this);

        this.removeListeners();
    }
}

/**
 * A class representing a fire-able event
 */
class Event {
    constructor() {
        _.extend(this, {
            listeners: []
        });
    }

    /**
     * Adds a handler to this event
     *
     * @param {Function/String} eventHandler The function (or function name in regards to the thisArg) to call for this event
     * @param {Object} thisArg The "this" argument for the method
     * @param {Object} options Options to include for the event
     *
     * @return {Function} A function to call to remove this listener
     */
    addListener(eventHandler, thisArg, options) {
        var listener = { eventHandler, thisArg, options },
            me = this;

        me.listeners.push(listener);

        return function() {
            _.pull(me.listeners, listener);
        };
    }

    /**
     * Remove a handler from this event
     *
     * @param {Function/String} eventHandler The function or function name to execute
     * @param {Object} thisArg The "this" argument for the method
     * @param {Object} options Options to inclue for the event
     */
    removeListener(eventHandler, thisArg, options) {
        var matches = _.filter(this.listeners, { eventHandler, thisArg, options });

        _.pullAll(this.listeners, matches);
    }

    /**
     * Fires an event with the specified arguments
     *
     * @param {Mixed} args...
     */
    fire(...args) {
        var { listeners } = this;
        var me = this;

        for (var i = 0; i < listeners.length; i++) {
            var listener = listeners[i];

            var val = this.fireListener(listener, args);

            // any handler returning false stops further events
            if (val === false) {
                return false;
            }
        }
    }

    /**
     * Executes a particular listener
     *
     * @param {Object} listener The listener configuration
     * @param {Object[]} args Arguments to pass into the listener
     * @return {Mixed} Whatever the event handler returns
     */
    fireListener(listener, args) {
        var { eventHandler, thisArg, options } = listener;

        if (_.isString(eventHandler)) {
            eventHandler = thisArg[eventHandler];
        }

        // options is always the last param in the handler
        return eventHandler.apply(thisArg, [...args, options]);

        // TODO, any options...
    }

    /**
     * Destroys this event to remove all associated memory references
     */
    destroy() {
        this.listeners = null;
    }
}
