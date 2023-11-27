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

  });



  it('Stock > 0', () => {

    cy.intercept('GET', 'http://localhost:8081/products/random').as('productRandom');
    cy.intercept('GET', 'http://localhost:8081/products/*').as('detailProduct');
    cy.contains('Accueil').eq(0).should('be.visible').click();

    cy.wait('@productRandom');

    cy.get('button').eq(2).should('be.visible').click();

    cy.wait('@detailProduct');
    cy.wait('@productRandom');

    cy.get('h1').scrollIntoView();

    cy.get('.stock').eq(0).should('be.visible').then((stockElement) => {

      const stockText = stockElement.text();
      //  alert(stockText);

      const nb = parseInt(stockText.split(' ')[0], 10);
      //  alert(nb);

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

    cy.wait('@detailProduct');

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

    cy.url({
      timeout: 2000
    }).should('eq', "http://localhost:4200/#/cart");

    cy.wait('@detailPanier').should((interception) => {
      expect(interception).to.exist;
      expect(interception.response.statusCode).to.equal(200);
    });

    cy.wait('@me').should((interception) => {
      expect(interception).to.exist;
      expect(interception.response.statusCode).to.equal(200);
    });

    cy.get('@detailPanier').should('not.be.null').then((panierElement) => {

      expect(panierElement.response.body.orderLines[0].product.name).to.be.equal(Cypress.env('produit'));
      expect(panierElement.response.body.orderLines[0].quantity).to.be.equal(1);
      Cypress.env('quantity', panierElement.response.body.orderLines[0].quantity);
    });

    //Retour sur page produit
    cy.go('back');

    cy.wait('@detailProduct')

    cy.wait('@productRandom');

    cy.get('.stock').eq(0).should('be.visible').then((stockElement) => {

      const stockText = stockElement.text();
      //   alert(stockText);

      const nb = parseInt(stockText.split(' ')[0], 10);
      const qantity = parseInt(Cypress.env('quantity'), 10);
      const stock = parseInt(Cypress.env('stock'), 10)
      //   alert(nb);
      const resteStock = stock - qantity;



      //Retour sur la page du panier

      cy.go('forward')

      cy.wait('@detailPanier')

      cy.wait('@me');

      //clique sur l'image de la corbeille pour annuler la commande
      cy.get('img').eq(2).should("have.attr", "alt", "Supprimer le produit").should('be.visible').click();

      expect(nb).to.be.equal(resteStock);

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

    // cy.get('input').first().should('be.visible').type('1');
    cy.get('input').first().should('be.visible').type('{leftArrow}');
    cy.get('input').first().should('be.visible').type('{del}');
    cy.get('input').first().should('be.visible').type('-1');

    //Appel Page Panier
    cy.get('button').first().should('be.visible').click();

    cy.url().should('not.eq', "http://localhost:4200/#/cart");

    // cy.wait('@detailPanier').should((interception) => {
    //   expect(interception).to.exist;
    //   expect(interception.response.statusCode).to.equal(200);
    // });

    // cy.wait('@me').should((interception) => {
    //   expect(interception).to.exist;
    //   expect(interception.response.statusCode).to.equal(200);
    // });

    // cy.get('@detailPanier').should('not.be.null').then((panierElement) => {

    //   expect(panierElement.response.body.orderLines[0].product.name).to.be.equal(Cypress.env('produit'));
    //   expect(panierElement.response.body.orderLines[0].quantity).to.be.equal(-1);
    //   Cypress.env('quantity', panierElement.response.body.orderLines[0].quantity);
    // });

    // //Retour sur page produit
    // cy.go('back');

    // cy.wait('@detailProduct')

    // cy.wait('@productRandom');

    // cy.get('.stock').eq(0).should('be.visible').then((stockElement) => {

    //   const nb = parseInt(stockText.split(' ')[0], 10);
    //   const quantity = parseInt(Cypress.env('quantity'), 10);
    //   const stock = parseInt(Cypress.env('stock'), 10)
    //   //   alert(nb);
    //   const resteStock = stock - quantity;

    //   //Retour sur la page du panier

    //   cy.go('forward')

    //   cy.wait('@detailPanier')

    //   cy.wait('@me');

    //   //clique sur l'image de la corbeille pour annuler la commande
    //   cy.get('img').eq(2).should("have.attr", "alt", "Supprimer le produit").should('be.visible').click();

    //   expect(nb).to.be.equal(resteStock);

    // });

  })

  it('> 20 produit', () => {

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
    cy.get('input').first().should('be.visible').type('{leftArrow}');
    cy.get('input').first().should('be.visible').type('{del}');
    cy.get('input').first().should('be.visible').type('100');

    //Appel Page Panier
    cy.get('button').first().should('be.visible').click();

    cy.url({
      timeout: 1000
    }).should('eq', "http://localhost:4200/#/cart");

    cy.wait('@detailPanier').should((interception) => {
      expect(interception).to.exist;
      expect(interception.response.statusCode).to.equal(200);
    });

    cy.wait('@me').should((interception) => {
      expect(interception).to.exist;
      expect(interception.response.statusCode).to.equal(200);
    });

    cy.get('@detailPanier').should('not.be.null').then((panierElement) => {

      expect(panierElement.response.body.orderLines[0].product.name).to.be.equal(Cypress.env('produit'));
      expect(panierElement.response.body.orderLines[0].quantity).to.be.greaterThan(20);
      Cypress.env('quantity', panierElement.response.body.orderLines[0].quantity);
    });

    //Retour sur page produit
    cy.go('back');

    cy.wait('@detailProduct')

    cy.wait('@productRandom');

    cy.get('.stock').eq(0).should('be.visible').then((stockElement) => {

      const stockText = stockElement.text();
      //   alert(stockText);

      const nb = parseInt(stockText.split(' ')[0], 10);
      const qantity = parseInt(Cypress.env('quantity'), 10);
      const stock = parseInt(Cypress.env('stock'), 10)
      //   alert(nb);
      const resteStock = stock - qantity;

      //Retour sur la page du panier

      cy.go('forward')

      cy.wait('@detailPanier')

      cy.wait('@me');

      //clique sur l'image de la corbeille pour annuler la commande
      cy.get('img').eq(2).should("have.attr", "alt", "Supprimer le produit").should('be.visible').click();

      expect(resteStock).to.be.greaterThan(-1);
      expect(nb).to.be.equal(resteStock);

    });
  });

})
