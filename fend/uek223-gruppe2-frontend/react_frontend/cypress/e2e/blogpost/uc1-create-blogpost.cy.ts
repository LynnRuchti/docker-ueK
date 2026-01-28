// UC1 Tests - Create Blogpost

describe('UC1: Create Blogpost', () => {

  // Test 1 - Success case
  it('create blogpost with valid data', () => {
    // login
    cy.visit('/login')
    cy.get('#email').type('admin@example.com')
    cy.get('#password').type('1234')
    cy.get('button[type="submit"]').click()
    
    // go to create page
    cy.contains('Create New Post').click()
    
    // fill form
    cy.get('#title').type('TestTest Test')
    cy.get('#text').type('TestTestTestTest TestTestTestTest Test')
    cy.get('#category').click()
    cy.contains('Technology').click()
    
    // submit
    cy.get('button[type="submit"]').click()
    
    // check if it worked
    cy.url().should('include', '/')
  })

  // Test 2 - Title too short
  it('title too short', () => {
    cy.visit('/login')
    cy.get('#email').type('admin@example.com')
    cy.get('#password').type('1234')
    cy.get('button[type="submit"]').click()
    
    cy.contains('Create New Post').click()
    
    cy.get('#title').type('Test')
    cy.get('#text').type('TestTestTestTest TestTestTestTest Test')
    cy.get('#category').click()
    cy.contains('Technology').click()
    
    cy.get('button[type="submit"]').should('be.disabled')
  })

  // Test 3 - Text too short
  it('text too short', () => {
    cy.visit('/login')
    cy.get('#email').type('admin@example.com')
    cy.get('#password').type('1234')
    cy.get('button[type="submit"]').click()
    
    cy.contains('Create New Post').click()
    
    cy.get('#title').type('TestTest Test')
    cy.get('#text').type('Short')
    cy.get('#category').click()
    cy.contains('Technology').click()
    
    cy.get('button[type="submit"]').should('be.disabled')
  })

  // Test 4 - No category
  it('category missing', () => {
    cy.visit('/login')
    cy.get('#email').type('admin@example.com')
    cy.get('#password').type('1234')
    cy.get('button[type="submit"]').click()
    
    cy.contains('Create New Post').click()
    
    cy.get('#title').type('TestTest Test')
    cy.get('#text').type('TestTestTestTest TestTestTestTest Test')
    
    cy.get('button[type="submit"]').should('be.disabled')
  })

  // Test 5 - Not logged in
  it('not logged in', () => {
    cy.visit('/blogpost/create')
    cy.url().should('include', '/login')
  })

  // Test 6 - Cancel button
  it('cancel button works', () => {
    cy.visit('/login')
    cy.get('#email').type('admin@example.com')
    cy.get('#password').type('1234')
    cy.get('button[type="submit"]').click()
    
    cy.contains('Create New Post').click()
    cy.contains('Cancel').click()
    
    cy.url().should('not.include', '/create')
  })

  // Test 7 - No permission
  it('user without permission', () => {
    cy.visit('/login')
    cy.get('#email').type('user@example.com')
    cy.get('#password').type('1234')
    cy.get('button[type="submit"]').click()
    
    cy.visit('/blogpost/create')
    
    cy.url().should('not.include', '/create')
  })

})
