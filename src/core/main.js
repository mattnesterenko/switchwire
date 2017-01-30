import { ComponentContext } from './index';

class PersonDAO {
    constructor() {
        console.log('new PersonDAO');
    }

    getPerson() {
        console.log('PersonDAO.getPerson()');
    }

    init() {
        console.log('PersonDAO.init()');
    }

    static getComponent() {
        console.log('PersonDAO::getComponent() [static]');

        return new PersonDAO();
    }
}

class HouseholdDAO {
    constructor(personDAO) {
        console.log('new HouseholdDAO');

        personDAO.getPerson();

        this.house = 12345;
    }

    printHouse() {
        console.log('HouseholdDAO.printHouse()- house = ' + this.house);
    }

    destroy() {
        console.log('HouseholdDAO.destroy()');
    }
}

class CompanyDAO {
    constructor(personDAO) {
        console.log('new CompanyDAO');

        personDAO.getPerson();
    }
}

class DAOFactory {
    constructor(personDAO) {
        console.log('new DAOFactory');
        this.personDAO = personDAO;
    }

    getCompanyDAO(personDAO) {
        console.log('DAOFactory.getCompanyDAO()');

        return new CompanyDAO(this.personDAO);
    }
}

var ctxt = new ComponentContext();


ctxt.registerComponentByBase('PersonDAO', PersonDAO, { initMethod: 'init', factoryMethod: true });
ctxt.registerComponentByBase('CompanyDAO', CompanyDAO, { factoryMethod: 'getCompanyDAO', factoryComponent: 'DAOFactory'});
ctxt.registerComponentByBase('HouseholdDAO', HouseholdDAO, { destroyMethod: 'destroy', constructorArgs: [{ ref: 'PersonDAO' }] });
ctxt.registerComponentByBase('DAOFactory', DAOFactory, { constructorArgs: [{ ref: 'PersonDAO' }] });

ctxt.registerComponentConfiguration({ name: 'DAOInitializer', requireBase: __dirname + '/', requirePath: 'daoinit', attrs: [{ type: 'componentPostProcessor' }] });

ctxt.getComponentFactory().initComponents();

ctxt.getComponent('HouseholdDAO').printHouse();

ctxt.destroy();
