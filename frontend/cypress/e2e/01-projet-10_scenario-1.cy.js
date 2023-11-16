/********************************************************** */
// Test 2 : Connexion                                       //
// ○ Front :                                                //
// ■ Cliquez sur le bouton de connexion ;                   //
// ■ La page de connexion avec le formulaire s’affiche ;    //
// ■ Entrez “test2@test.fr” dans le champ de l’email ;      //
// ■ Entrez “TestTest” comme mot de passe ;.                //
// ■ vous devez être connecté et voir le bouton panier.     //
/********************************************************** */

describe('TEST 2', () => {

    beforeEach(() => {
        cy.visit('http://localhost:4200/#/')
    })

    it('Connexion et \'Mon panier\'', () => {

        cy.contains('Connexion').should('be.visible').should('have.attr', 'href', "#/login").click();
    
        cy.get('#username').should('be.visible').type("toto@toto.net");
    
        cy.get('#password').should('be.visible').type("totoToto");
    
        cy.get('button').should('be.visible').should('have.attr', 'data-cy', "login-submit").click();
    
        cy.get('a').contains("Mon panier").eq(0).should('be.visible');
        
      })

})