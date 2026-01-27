describe('Public Routes Navigation', () => {
    it('should load signup page as default route', () => {
        cy.visit('/');
        cy.contains('Create your account').should('be.visible');
    });

    it('should navigate between auth pages correctly', () => {
        // Start at signup
        cy.visit('/auth/signup');
        cy.contains('Create your account').should('be.visible');

        // Go to login
        cy.contains('Sign in').click();
        cy.url().should('include', '/auth/login');
        cy.contains('Login to your account').should('be.visible');

        // Go to signup from login
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
        // Try to access dashboard directly (should redirect to login/signup)
        cy.visit('/dashboard');
        // User should be redirected to auth pages since they are not logged in
        cy.url().should('not.include', '/dashboard');
    });
});
