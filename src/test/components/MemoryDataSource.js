export default class MemoryDataSource {
    init() {
        this.log('Initializing MemoryDataSource()');

        this.tables = {};
    }

    getRows(table) {
        return this.tables[table];
    }

    insertRow(table, row) {
        var rows = [];

        if (_.isArray(this.tables[table])) {
            rows = this.tables[table] = [];
        }

        rows.push(row);
    }
};
