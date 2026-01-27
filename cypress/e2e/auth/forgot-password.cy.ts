describe('Forgot Password Page', () => {
    beforeEach(() => {
        cy.visit('/auth/forgot-password');
    });

    it('should display forgot password form elements', () => {
        // Check form fields exist
        cy.get('input#email').should('be.visible');

        // Check submit button exists
        cy.get('button[type="submit"]').should('be.visible');
    });

    it('should show validation error for empty email', () => {
        cy.get('button[type="submit"]').click();
        cy.get('.text-destructive').should('exist');
    });

    it('should show validation error for invalid email format', () => {
        cy.get('input#email').type('invalidemail');
        cy.get('button[type="submit"]').click();
        cy.get('.text-destructive').should('exist');
    });

    it('should allow typing valid email', () => {
        cy.get('input#email').type('test@example.com').should('have.value', 'test@example.com');
    });

    it('should have link to go back to login', () => {
        cy.contains(/sign in|login|back/i).should('be.visible');
    });
});
