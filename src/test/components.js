export default {
    imports: [],

    components: [{
        name: 'MemoryDataSource',
        base: require('./components/MemoryDataSource').default
    }, {
        name: 'PersonDAO',
        base: require('./components/PersonDAO').default,
        constructorArgs: [{
            ref: 'MemoryDataSource'
        }]
    }, {
        name: 'LogInjector',
        base: require('./components/LogInjector').default,
        attrs: ['ComponentPostProcessor']
    }]
};
