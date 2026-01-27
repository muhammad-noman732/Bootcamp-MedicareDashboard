/**
 * Dashboard Sidebar Tests
 * 
 * NOTE: These tests require a logged-in user session.
 * To run these tests, you need to either:
 * 1. Use cy.session() with real credentials
 * 2. Mock the auth state by setting localStorage/cookies
 * 3. Use a test user that is already seeded in the database
 * 
 * For now, these tests are written for reference and will need
 * the authentication setup in cypress/support/commands.ts
 */

describe('Dashboard Sidebar Navigation', () => {
    // Skip these tests until auth is configured
    // Remove .skip when you set up authentication in commands.ts
    describe.skip('Authenticated User', () => {
        beforeEach(() => {
            // TODO: Add login command in cypress/support/commands.ts
            // cy.login('test@example.com', 'password123');
            cy.visit('/dashboard');
        });

        it('should display sidebar with Medicare logo', () => {
            cy.get('img[alt="Medicare logo"]').should('be.visible');
            cy.contains('Medicare').should('be.visible');
        });

        it('should display MENU section with navigation items', () => {
            cy.contains('MENU').should('be.visible');
            cy.contains('Dashboard').should('be.visible');
            cy.contains('Schedule').should('be.visible');
            cy.contains('Tasks').should('be.visible');
            cy.contains('Patients').should('be.visible');
            cy.contains('Analytics').should('be.visible');
        });

        it('should display GENERAL section with navigation items', () => {
            cy.contains('GENERAL').should('be.visible');
            cy.contains('Settings').should('be.visible');
            cy.contains('Support').should('be.visible');
        });

        it('should navigate to Schedule page', () => {
            cy.contains('Schedule').click();
            cy.url().should('include', '/dashboard/schedule');
        });

        it('should navigate to Tasks page', () => {
            cy.contains('Tasks').click();
            cy.url().should('include', '/dashboard/tasks');
        });

        it('should navigate to Patients page', () => {
            cy.contains('Patients').click();
            cy.url().should('include', '/dashboard/patients');
        });

        it('should navigate to Analytics page', () => {
            cy.contains('Analytics').click();
            cy.url().should('include', '/dashboard/analytics');
        });

        it('should navigate to Settings page', () => {
            cy.contains('Settings').click();
            cy.url().should('include', '/dashboard/settings');
        });

        it('should navigate to Support page', () => {
            cy.contains('Support').click();
            cy.url().should('include', '/dashboard/support');
        });

        it('should highlight active navigation item', () => {
            // Dashboard should be active by default
            cy.contains('Dashboard').parent().should('have.class', 'font-medium');

            // Click on Tasks and verify it becomes active
            cy.contains('Tasks').click();
            cy.contains('Tasks').should('have.class', 'font-medium');
        });
    });
});
