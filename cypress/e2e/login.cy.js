/**
 * Test Scenarios for Login E2E Flow
 *
 * - Login flow
 *   - should display login form correctly
 *   - should show error message for invalid credentials
 *   - should successfully login with valid credentials
 *   - should redirect to home page after successful login
 *   - should persist login state after page reload
 */

describe('Login Flow', () => {
  beforeEach(() => {
    // Clear localStorage and cookies before each test
    cy.clearLocalStorage();
    cy.clearCookies();
  });

  it('should display login form correctly', () => {
    cy.visit('/login');

    // Check if login form elements are present
    cy.get('h1').should('contain', 'Login');
    cy.get('label[for="email"]').should('be.visible');
    cy.get('label[for="password"]').should('be.visible');
    cy.get('input[type="email"]').should('be.visible');
    cy.get('input[type="password"]').should('be.visible');
    cy.get('button[type="submit"]').should('be.visible').and('contain', 'Login');
  });

  it('should show error message for invalid credentials', () => {
    cy.visit('/login');

    // Attempt to login with invalid credentials
    cy.get('input[type="email"]').type('invalid@example.com');
    cy.get('input[type="password"]').type('wrongpassword');
    cy.get('button[type="submit"]').click();

    // Wait for error message to appear
    cy.get('.error-message', { timeout: 10000 }).should('be.visible');
  });

  it('should successfully login with valid credentials', () => {
    // Note: This test assumes valid credentials exist in the API
    // You may need to adjust credentials based on your test environment
    cy.visit('/login');

    // Enter valid credentials
    // Replace with actual test credentials from your API
    cy.get('input[type="email"]').type('testuser@example.com');
    cy.get('input[type="password"]').type('testpassword123');
    cy.get('button[type="submit"]').click();

    // Wait for successful login (redirect to home page)
    cy.url({ timeout: 10000 }).should('not.include', '/login');
    
    // Check if user is authenticated (logout button should be visible)
    cy.get('button:contains("Logout")', { timeout: 10000 }).should('be.visible');
  });

  it('should redirect to home page after successful login', () => {
    cy.visit('/login');

    // Assuming login will succeed
    cy.get('input[type="email"]').type('testuser@example.com');
    cy.get('input[type="password"]').type('testpassword123');
    cy.get('button[type="submit"]').click();

    // Should be redirected to home page
    cy.url({ timeout: 10000 }).should('eq', Cypress.config('baseUrl') + '/');
    
    // Should see home page content (threads or navigation)
    cy.get('nav').should('be.visible');
  });

  it('should persist login state after page reload', () => {
    // First, login
    cy.visit('/login');
    cy.get('input[type="email"]').type('testuser@example.com');
    cy.get('input[type="password"]').type('testpassword123');
    cy.get('button[type="submit"]').click();

    // Wait for login to complete
    cy.url({ timeout: 10000 }).should('not.include', '/login');

    // Reload the page
    cy.reload();

    // Should still be logged in (logout button visible)
    cy.get('button:contains("Logout")', { timeout: 5000 }).should('be.visible');
    cy.url().should('not.include', '/login');
  });

  it('should navigate to login page from navbar when not authenticated', () => {
    cy.visit('/');

    // Click on Login link in navbar
    cy.get('a:contains("Login")').click();

    // Should be on login page
    cy.url().should('include', '/login');
  });
});

