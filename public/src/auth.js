import AuthApp from './components/app/AuthApp.js';

const app = new AuthApp();
document.body.prepend(app.renderDOM());