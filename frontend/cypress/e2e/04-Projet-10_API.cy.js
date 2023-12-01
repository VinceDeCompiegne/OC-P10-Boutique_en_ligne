/*********** */
// TESTS API //
/*********** */

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


describe('Tests API', () => {

  //   beforeEach(() => {
  it("API : /login", () => {

    const loginUser = {
      "username": "toto@toto.net",
      "password": "totoToto"
    };

    cy.request({
      method: 'POST',
      url: 'http://localhost:8081/login',
      body: loginUser,
    }).then((response) => {

      expect(response.status).to.eq(200);

      Cypress.env('token', response.body.token);

    });

  })



  it("API : /products", () => {

    const token = Cypress.env('token');

    cy.request({
      method: 'GET',
      url: 'http://localhost:8081/products',
      headers: {
        'accept': 'application/json',
        'Authorization': `Bearer ${token}`
      },

    }).then((response) => {

      expect(response.status).to.eq(200);

    });
  })

  it("API : /products/random", () => {
    const token = Cypress.env('token');


    cy.request({
      method: 'GET',
      url: 'http://localhost:8081/products/random',
      headers: {
        'accept': 'application/json',
        'Authorization': `Bearer ${token}`
      },

    }).then((response) => {

      expect(response.status).to.eq(200);

    });
  })

  it("API : /products/:id", () => {
    const token = Cypress.env('token');


    cy.request({
      method: 'GET',
      url: 'http://localhost:8081/products/5',
      headers: {
        'accept': 'application/json',
        'Authorization': `Bearer ${token}`
      },

    }).then((response) => {

      expect(response.status).to.eq(200);

    });
  })

  it("API : /products/random", () => {
    const token = Cypress.env('token');

    cy.request({
      method: 'GET',
      url: 'http://localhost:8081/products/random',
      headers: {
        'accept': 'application/json',
        'Authorization': `Bearer ${token}`
      },

    }).then((response) => {

      expect(response.status).to.eq(200);

    });
  })

  it("API : /reviews - GET", () => {
    const token = Cypress.env('token');


    cy.request({
      method: 'GET',
      url: 'http://localhost:8081/reviews',
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`
      },

    }).then((response) => {

      expect(response.status).to.eq(200);

    });
  })

  it("API : /Reviews - POST", () => {

    const token = Cypress.env('token');

    const reviews = {
      "title": "Superbe objet",
      "comment": "Cet objet est superbe !",
      "rating": 5
    };

    cy.request({
      method: 'POST',
      url: 'http://localhost:8081/reviews',
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: reviews,
    }).then((response) => {

      expect(response.status).to.eq(200);

    });

  })

  it("API : /products/me", () => {
    const token = Cypress.env('token');


    cy.request({
      method: 'GET',
      url: 'http://localhost:8081/me',
      headers: {
        'accept': 'application/json',
        'Authorization': `Bearer ${token}`
      },

    }).then((response) => {

      expect(response.status).to.eq(200);

    });
  })

  it("API : /orders/add - PUT", () => {

    const token = Cypress.env('token');

    const reviewsAdd = {
      "product": 5,
      "quantity": 1
    };

    cy.request({
      method: 'PUT',
      url: 'http://localhost:8081/orders/add',
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: reviewsAdd,
    }).then((response) => {

      expect(response.status).to.eq(200);

    });

  })

  it("API : /orders - get", () => {

    const token = Cypress.env('token');

    cy.request({
      method: 'GET',
      url: 'http://localhost:8081/orders',
      headers: {
        'accept': 'application/json',
        'Authorization': `Bearer ${token}`
      },

    }).then((response) => {

      expect(response.status).to.eq(200);

      Cypress.env('id', response.body.orderLines[0].id);

    });
  })

  it("API : /orders/id/change-quantity - PUT", () => {

    const token = Cypress.env('token');

    const id = Cypress.env('id');

    const ordersQuatity = {
      "quantity": 10
    };

    cy.request({
      method: 'PUT',
      url: `http://localhost:8081/orders/${id}/change-quantity`,
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: ordersQuatity,

    }).then((response) => {

      expect(response.status).to.eq(200);

    });

  })

  it("API : /orders/id/delete - DELETE", () => {

    const token = Cypress.env('token');

    const id = Cypress.env('id');

    const reviewsQuatity = {
      "quantity": 10
    };

    cy.request({
      method: 'DELETE',
      url: `http://localhost:8081/orders/${id}/delete`,
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },

    }).then((response) => {

      expect(response.status).to.eq(200);

    });

  })

  it("API : /orders - POST", () => {

    const token = Cypress.env('token');

    const reviews = {
      "firstname": "Toto",
      "lastname": "Le Hero",
      "address": "34 rue de la lune",
      "zipCode": "75001",
      "city": "Paris"
    }

    cy.request({
      method: 'POST',
      url: 'http://localhost:8081/orders',
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: reviews,
    }).then((response) => {

      expect(response.status).to.eq(200);

    });

  })


  it("API : /register - POST", () => {

    const token = Cypress.env('token');

    cy.readFile('cypress/fixtures/profile.json').then((profile) => {

      let index = parseInt(profile.id, 10) + 1;

      cy.writeFile('cypress/fixtures/profile.json', {
        id: index,
        name: 'Jane',
        email: 'jane@example.com',
      })

      const userData = {
        "email": `TestEmail${index}@str.net`,
        "firstname": `Test_firstname_${index}`,
        "lastname": `Test_lastname_${index}`,
        "plainPassword": {
          "first": "totoToto",
          "second": "totoToto"
        }
      }

      cy.request({
        method: 'POST',
        url: 'http://localhost:8081/register',
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: userData,
      }).then((response) => {

        expect(response.status).to.eq(200);

      });

    });
  });
})
