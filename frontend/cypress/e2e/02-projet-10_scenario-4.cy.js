/****************************************************************** */
//  Test 4 : Panier                                                 //
//  ○ vous êtes connectés avec les infos données précédemment ;     //
//  ○ cliquez sur un des produits ;                                 //
//  ○ le stock doit être supérieur à 1 pour pouvoir être ajouté ;   //
//  ○ cliquez sur ajouter pour ajouter au panier :                  //
//  ■ vérifiez que le produit a été ajouté au panier,               //
//  ■ retournez sur la page du produit et vérifiez que le stock a   //
//  enlevé le nombre de produits qui sont dans le panier,           //
//  ■ vérifiez les limites                                          //
//  ● entrez un chiffre négatif,                                    //
//  ● entrez un chiffre supérieur à 20 ;                            //
//  ○ Ajout d’un élément au panier (clic bouton ajouter au panier,  //
//  vérification du contenu du panier via l’API).                   //
/****************************************************************** */


/****************************************************************** */
// CONDITION INITIALE                                               */
//                                                                  //
// - LE PANIER DOIT ETRE VIDE                                       //
// - L'utilisateur :                                                //
//        mail:"toto@toto.net"                                      //
//        password:"totoToto"                                       //
//   DOIT EXISTER                                                   //
//                                                                  //
/****************************************************************** */

describe('TEST 4', () => {

  beforeEach(() => {

    cy.visit('http://localhost:4200/#');

    cy.contains('Connexion').should('be.visible').should('have.attr', 'href', "#/login").click();

    cy.get('#username').should('be.visible').type("toto@toto.net");

    cy.get('#password').should('be.visible').type("totoToto");

    cy.get('button').should('be.visible').should('have.attr', 'data-cy', "login-submit").click();

  })

  it('Stock > 0', () => {

    cy.intercept('GET', 'http://localhost:8081/products/random').as('productRandom');
    cy.intercept('GET', 'http://localhost:8081/products/*').as('detailProduct');

    cy.contains('Accueil').eq(0).should('be.visible').click();

    cy.wait('@productRandom');

    cy.get('button').eq(2).should('be.visible').click();

    cy.wait('@detailProduct');

    cy.wait(500);

    cy.get('h1').scrollIntoView();

    cy.get('.stock').eq(0).should('be.visible').then((stockElement) => {

      const stockText = stockElement.text();
      //   alert(stockText);

      const nb = parseInt(stockText.split(' ')[0], 10);
      //   alert(nb);

      expect(nb).to.be.greaterThan(-1);

    });

  })

  it('1 produit', () => {

    cy.intercept('GET', 'http://localhost:8081/products').as('product');
    cy.intercept('GET', 'http://localhost:8081/products/random').as('productRandom');
    cy.intercept('GET', 'http://localhost:8081/products/*').as('detailProduct');
    cy.intercept('GET', 'http://localhost:8081/orders').as('detailPanier');
    cy.intercept('GET', 'http://localhost:8081/me').as('me');
    //Appel page d'acceuil
    cy.contains('Accueil').eq(0).should('be.visible').click();

    cy.wait('@productRandom');
    //Appel Page Produits
    cy.get('a').contains('Produits').eq(0).should('be.visible').click();

    cy.wait('@product');
    //Appel Page d'un Produit
    cy.get('button').eq(2).should('be.visible').click();

    cy.wait('@detailProduct')

    cy.wait('@productRandom');

    cy.get('h1').first().should('be.visible').then((titre) => {
      // alert(titre.text());
      const stockText = titre.text();
      Cypress.env('produit', stockText);
    })

    cy.get('.stock').eq(0).should('be.visible').then((stockElement) => {

      const stockText = stockElement.text();
      //   alert(stockText);
      const nb = parseInt(stockText.split(' ')[0], 10);
      //   alert(nb);
      expect(nb).to.be.greaterThan(-1);

      Cypress.env('stock', nb);

    });

    // cy.get('input').first().should('be.visible').type('1');

    //Appel Page Panier
    cy.get('button').first().should('be.visible').click();

    cy.wait('@detailPanier').then((panierElement) => {

      expect(panierElement.response.body.orderLines[0].product.name).to.be.equal(Cypress.env('produit'));
      expect(panierElement.response.body.orderLines[0].quantity).to.be.equal(1);

    });

    cy.wait('@me');

    //Retour sur page produit
    cy.go('back');

    cy.wait('@detailProduct')

    cy.wait('@productRandom');

    cy.get('.stock').eq(0).should('be.visible').then((stockElement) => {

      const stockText = stockElement.text();
      //   alert(stockText);

      const nb = parseInt(stockText.split(' ')[0], 10);
      //   alert(nb);
      const resteStock = parseInt(Cypress.env('stock'), 10) - 1;

      expect(nb).to.be.equal(resteStock);

      //Retour sur la page du panier

      cy.go('forward')

      cy.wait('@detailPanier')

      cy.wait('@me');

      //clique sur l'image de la corbeille pour annuler la commande
      cy.get('img').eq(2).should('be.visible').click();

    });

  })

  it('-1 produit', () => {

    cy.intercept('GET', 'http://localhost:8081/products').as('product');
    cy.intercept('GET', 'http://localhost:8081/products/random').as('productRandom');
    cy.intercept('GET', 'http://localhost:8081/products/*').as('detailProduct');
    cy.intercept('GET', 'http://localhost:8081/orders').as('detailPanier');
    cy.intercept('GET', 'http://localhost:8081/me').as('me');
    //Appel page d'acceuil
    cy.contains('Accueil').eq(0).should('be.visible').click();

    cy.wait('@productRandom');
    //Appel Page Produits
    cy.get('a').contains('Produits').eq(0).should('be.visible').click();

    cy.wait('@product');
    //Appel Page d'un Produit
    cy.get('button').eq(2).should('be.visible').click();

    cy.wait('@detailProduct')

    cy.wait('@productRandom');

    cy.get('h1').first().should('be.visible').then((titre) => {
      // alert(titre.text());
      const stockText = titre.text();
      Cypress.env('produit', stockText);
    })

    cy.get('.stock').eq(0).should('be.visible').then((stockElement) => {

      const stockText = stockElement.text();
      //   alert(stockText);
      const nb = parseInt(stockText.split(' ')[0], 10);
      //   alert(nb);
      expect(nb).to.be.greaterThan(-1);

      Cypress.env('stock', nb);

    });

    cy.get('input').first().should('be.visible').type('{leftArrow}');
    cy.get('input').first().should('be.visible').type('{del}');
    cy.get('input').first().should('be.visible').type('-1');

    //Appel Page Panier
    cy.get('button').first().should('be.visible').click();

    //La page ne doit pas changer (boutton disabled) car quantité limite = -1
    cy.url().should('eq', 'http://localhost:4200/#/products/5');

  })

  it('> 20 produits', () => {

    cy.intercept('GET', 'http://localhost:8081/products').as('product');
    cy.intercept('GET', 'http://localhost:8081/products/random').as('productRandom');
    cy.intercept('GET', 'http://localhost:8081/products/*').as('detailProduct');
    cy.intercept('GET', 'http://localhost:8081/orders').as('detailPanier');
    cy.intercept('GET', 'http://localhost:8081/me').as('me');
    //Appel page d'acceuil
    cy.contains('Accueil').eq(0).should('be.visible').click();

    cy.wait('@productRandom');
    //Appel Page Produits
    cy.get('a').contains('Produits').eq(0).should('be.visible').click();

    cy.wait('@product');
    //Appel Page d'un Produit
    cy.get('button').eq(2).should('be.visible').click();

    cy.wait('@detailProduct')

    cy.wait('@productRandom');

    cy.get('h1').first().should('be.visible').then((titre) => {
      // alert(titre.text());
      const stockText = titre.text();
      Cypress.env('produit', stockText);
    })

    cy.get('.stock').eq(0).should('be.visible').then((stockElement) => {

      const stockText = stockElement.text();
      //   alert(stockText);
      const nb = parseInt(stockText.split(' ')[0], 10);
      //   alert(nb);
      expect(nb).to.be.greaterThan(-1);

      Cypress.env('stock', nb);

    });

    cy.get('input').first().should('be.visible').type('{leftArrow}');
    cy.get('input').first().should('be.visible').type('{del}');
    cy.get('input').first().should('be.visible').type('50');

    //Appel Page Panier
    cy.get('button').first().should('be.visible').click();

    //La page ne doit pas changer (boutton disabled) car quantité limite supérieur à 20 = 50
    cy.url().should('eq', 'http://localhost:4200/#/products/5');

  })

})
