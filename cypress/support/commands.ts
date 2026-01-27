/// <reference types="cypress" />

// ***********************************************
// Custom Commands for Medicare Dashboard
// ***********************************************

// Extend Cypress namespace with custom commands
declare global {
    namespace Cypress {
        interface Chainable {
            /**
             * Custom command to log in a user via the UI
             * @example cy.login('test@example.com', 'password123')
             */
            login(email: string, password: string): Chainable<void>;

            /**
             * Custom command to log in a user via API (faster for tests)
             * @example cy.loginViaApi('test@example.com', 'password123')
             */
            loginViaApi(email: string, password: string): Chainable<void>;

            /**
             * Custom command to log out the current user
             * @example cy.logout()
             */
            logout(): Chainable<void>;
        }
    }
}

/**
 * Login command via UI
 * Use this when testing the actual login flow
 */
Cypress.Commands.add('login', (email: string, password: string) => {
    cy.visit('/auth/login');
    cy.get('input#email').type(email);
    cy.get('input#password').type(password);
    cy.contains('button', 'Login').click();

    // Wait for redirect to dashboard
    cy.url().should('include', '/dashboard', { timeout: 10000 });
});

/**
 * Login command via API
 * Use this for faster test setup when login flow is not being tested
 * 
 * NOTE: Update the API endpoint and response handling based on your backend
 */
Cypress.Commands.add('loginViaApi', (email: string, password: string) => {
    cy.request({
        method: 'POST',
        url: 'http://localhost:5000/api/auth/login', // Update with your backend URL
        body: { email, password },
    }).then((response) => {
        // Assuming your API returns a token
        // Adjust based on your actual auth response structure
        const { accessToken, refreshToken } = response.body.data;

        // Store tokens in localStorage (adjust based on your auth implementation)
        window.localStorage.setItem('accessToken', accessToken);
        window.localStorage.setItem('refreshToken', refreshToken);
    });
});

/**
 * Logout command
 */
Cypress.Commands.add('logout', () => {
    // Clear all stored auth data
    window.localStorage.clear();
    window.sessionStorage.clear();
    cy.clearCookies();
});

export { };
