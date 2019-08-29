import Component from '../Component.js';
import Header from './Header.js';
import SignUp from '../auth/SignUp.js';
import SignIn from '../auth/SignIn.js';
import { signUp as userSignUp, sighIn as userSignIn } from '../../services/todo-api.js';
import store from '../../services/store.js';

function success(user) {
    store.setToken(user.token);
    const searchParams = new URLSearchParams(location.search);
    location = searchParams.get('redirect' || './todo-list.html');
}

class AuthApp extends Component {
    
    onRender(dom) {
        const header = new Header();
        dom.prepend(header.renderDOM());

        const errors = dom.querySelector('.errors');
    }
    renderHTML() {
        return /*html*/`
            
        `;
    }
}

export default AuthApp;