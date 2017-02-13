import { ComponentContext } from '@/core';
import config from './components';

var context = new ComponentContext({ componentConfig: config.components });

var person = context.getComponent('PersonDAO');

person.doSomething();

context.destroy();
