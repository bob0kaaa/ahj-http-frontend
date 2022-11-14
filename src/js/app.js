import Controller from './controller';
import UserInterface from './userInterface';

const userI = new UserInterface();
const controller = new Controller(userI);
controller.init();
