

declare global {
    namespace Cypress {
        interface Chainable {
            login(email: string, password: string): Chainable<void>;

            loginViaApi(email: string, password: string): Chainable<void>;

            logout(): Chainable<void>;
        }
    }
}

Cypress.Commands.add('login', (email: string, password: string) => {
    cy.visit('/auth/login');
    cy.get('input#email').type(email);
    cy.get('input#password').type(password);
    cy.contains('button', 'Login').click();

    cy.url().should('include', '/dashboard', { timeout: 10000 });
});

Cypress.Commands.add('loginViaApi', (email: string, password: string) => {
    cy.request({
        method: 'POST',
        url: 'http://localhost:5000/api/auth/login',  
        body: { email, password },
    }).then((response) => {
        const { accessToken, refreshToken } = response.body.data;

        window.localStorage.setItem('accessToken', accessToken);
        window.localStorage.setItem('refreshToken', refreshToken);
    });
});

Cypress.Commands.add('logout', () => {
    window.localStorage.clear();
    window.sessionStorage.clear();
    cy.clearCookies();
});

export { };