export default class LogInjector {

    preInitProcessor(inst, component) {
        var log = function(msg, ...args) {
            console.log(`[${component.name}]: ${msg}`, ...args);
        };

        inst.log = log;
    }

    postInitProcessor(inst, component) {
    }

}
