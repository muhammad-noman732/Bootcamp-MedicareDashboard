describe('Signup Page', () => {
    beforeEach(() => {
        cy.visit('/auth/signup');
    });

    it('should display signup form elements', () => {
        cy.contains('Welcome to Medicare').should('be.visible');
        cy.contains('Create your account').should('be.visible');

        cy.get('input#email').should('be.visible');
        cy.get('input#password').should('be.visible');
        cy.get('input#confirmPassword').should('be.visible');

        cy.contains('button', 'Create an account').should('be.visible');
    });

    it('should show validation errors for empty form submission', () => {
        cy.contains('button', 'Create an account').click();

        cy.get('.text-destructive').should('exist');
    });

    it('should show validation error for invalid email format', () => {
        cy.get('input#email').type('invalidemail');
        cy.get('input#password').type('Password123!');
        cy.get('input#confirmPassword').type('Password123!');
        cy.contains('button', 'Create an account').click();

        cy.get('.text-destructive').should('exist');
    });

    it('should show validation error when passwords do not match', () => {
        cy.get('input#email').type('test@example.com');
        cy.get('input#password').type('Password123!');
        cy.get('input#confirmPassword').type('DifferentPassword!');
        cy.contains('button', 'Create an account').click();

        cy.get('.text-destructive').should('exist');
    });

    it('should allow typing in all form fields', () => {
        cy.get('input#email').type('test@example.com').should('have.value', 'test@example.com');
        cy.get('input#password').type('Password123!').should('have.value', 'Password123!');
        cy.get('input#confirmPassword').type('Password123!').should('have.value', 'Password123!');
    });

    it('should navigate to login page when clicking sign in link', () => {
        cy.contains('Sign in').click();
        cy.url().should('include', '/auth/login');
    });

    it('should display Google signup button', () => {
        cy.contains('button', /google/i).should('be.visible');
    });
});