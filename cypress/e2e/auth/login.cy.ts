describe('Login Page', () => {
    beforeEach(() => {
        cy.visit('/auth/login');
    });

    it('should display login form elements', () => {
        // Check page title/header
        cy.contains('Welcome to Medicare').should('be.visible');
        cy.contains('Login to your account').should('be.visible');

        // Check form fields exist
        cy.get('input#email').should('be.visible');
        cy.get('input#password').should('be.visible');

        // Check buttons
        cy.contains('button', 'Login').should('be.visible');
        cy.contains('Forgot password').should('be.visible');
    });

    it('should show validation errors for empty form submission', () => {
        cy.contains('button', 'Login').click();

        // Should show validation error messages
        cy.get('.text-destructive').should('exist');
    });

    it('should show validation error for invalid email format', () => {
        cy.get('input#email').type('invalidemail');
        cy.get('input#password').type('password123');
        cy.contains('button', 'Login').click();

        cy.get('.text-destructive').should('exist');
    });

    it('should allow typing in email and password fields', () => {
        cy.get('input#email').type('test@example.com').should('have.value', 'test@example.com');
        cy.get('input#password').type('password123').should('have.value', 'password123');
    });

    it('should navigate to signup page when clicking sign up link', () => {
        cy.contains('Sign up').click();
        cy.url().should('include', '/auth/signup');
    });

    it('should navigate to forgot password page', () => {
        cy.contains('Forgot password').click();
        cy.url().should('include', '/auth/forgot-password');
    });

    it('should display Google login button', () => {
        cy.contains('button', /google/i).should('be.visible');
    });

    // ✅ REAL LOGIN TEST with your credentials
    it('should successfully login with valid credentials', () => {
        // Load user fixtures
        cy.fixture('users').then((users) => {
            // Type email
            cy.get('input#email').clear().type(users.validUser.email);

            // Type password
            cy.get('input#password').clear().type(users.validUser.password);

            // Click login button
            cy.contains('button', 'Login').click();

            // Wait for redirect to dashboard (with increased timeout for API call)
            cy.url().should('include', '/dashboard', { timeout: 15000 });

            // Verify dashboard elements are visible
            cy.contains('Dashboard', { timeout: 10000 }).should('be.visible');
        });
    });

    it('should show error message for invalid credentials', () => {
        cy.fixture('users').then((users) => {
            cy.get('input#email').clear().type(users.invalidUser.email);
            cy.get('input#password').clear().type(users.invalidUser.password);
            cy.contains('button', 'Login').click();

            // Should show error message (toast or inline error)
            // Adjust selector based on how your app shows login errors
            cy.contains(/invalid|incorrect|error|failed/i, { timeout: 10000 }).should('be.visible');
        });
    });
});
