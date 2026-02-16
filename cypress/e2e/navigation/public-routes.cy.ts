describe('Public Routes Navigation', () => {
    it('should load signup page as default route', () => {
        cy.visit('/');
        cy.contains('Create your account').should('be.visible');
    });

    it('should navigate between auth pages correctly', () => {
        cy.visit('/auth/signup');
        cy.contains('Create your account').should('be.visible');

        cy.contains('Sign in').click();
        cy.url().should('include', '/auth/login');
        cy.contains('Login to your account').should('be.visible');

        cy.contains('Sign up').click();
        cy.url().should('include', '/auth/signup');
        cy.contains('Create your account').should('be.visible');
    });

    it('should navigate to forgot password from login', () => {
        cy.visit('/auth/login');
        cy.contains('Forgot password').click();
        cy.url().should('include', '/auth/forgot-password');
    });

    it('should redirect unauthenticated users from protected routes', () => {
        cy.visit('/dashboard');
        cy.url().should('not.include', '/dashboard');
    });
});