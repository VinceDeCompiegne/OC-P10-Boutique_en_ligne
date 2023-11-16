/************************************************************************ */
//  SMOKE TESTS                                                           //
//  ● Test 5 : Smoke tests                                                //
//  ○ vérifiez la présence des champs et boutons de connexion ;           //
//  ○ vérifiez la présence des boutons d’ajout au panier quand vous êtes  //
//  connecté ;                                                            //
//  ○ vérifiez la présence du champ de disponibilité du produit.          //
/************************************************************************ */

describe('SMOKE TESTS', () => {

  beforeEach(() => {
    // Cypress starts out with a blank slate for each test
    // so we must tell it to visit our website with the `cy.visit()` command.
    // Since we want to visit the same URL at the start of all our tests,
    // we include it in our beforeEach function so that it runs before each test
    cy.visit('http://localhost:4200/#/')

  })

  it('Champs et boutons de connexion', () => {

    cy.contains('Connexion').should('be.visible').should('have.attr', 'href', "#/login").click();

    cy.get('#username').should('be.visible');

    cy.get('#password').should('be.visible');

    cy.get('button').should('have.attr', 'data-cy', "login-submit").should('be.visible');

  })

  it('Ajouter au panier', () => {

    cy.contains('Connexion').should('be.visible').should('have.attr', 'href', "#/login").click();

    cy.get('#username').should('be.visible').type("toto@toto.net");

    cy.get('#password').should('be.visible').type("totoToto");

    cy.get('button').should('be.visible').should('have.attr', 'data-cy', "login-submit").click();

    cy.get('button').contains("Consulter").eq(0).should('be.visible').click();

    cy.get('button').contains("Ajouter au panier").should('be.visible');

  })

  it('Stock', () => {

    cy.contains('Accueil').eq(0).should('be.visible').click();

    cy.wait(3000);

    cy.get('button').eq(3).should('be.visible').click();

    cy.wait(3000);

    cy.get('.stock').eq(0).should('be.visible').then((stockElement) => {

      const stockText = stockElement.text();
      //   alert(stockText);

      const nb = parseInt(stockText.split(' ')[0], 10);
      //   alert(nb);

      expect(nb).to.be.greaterThan(-1);

    });

  })



})
