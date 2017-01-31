export class DAOInitializer {
    constructor() {
        console.log('new DAOInitializer');
    }

    preInitProcessor(instance, component) {}

    postInitProcessor(instance, component) {
        instance.house = '555';
    }
}
