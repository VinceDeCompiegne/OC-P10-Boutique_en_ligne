describe('Tests API - Faille XSS', () => {

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
  it("API : /Reviews - POST - Faille XSS", () => {

    const token = Cypress.env('token');

    const reviews = {
      "title": "Superbe objet",
      "comment": "Cet objet est suberbe !",
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

  it("API : /orders - POST", () => {

    const token = Cypress.env('token');

    const reviews = {
      "firstname": "<script>alert('créé par une faille XSS');</script>",
      "lastname": "<script>alert('créé par une faille XSS');</script>",
      "address": "<script>alert('créé par une faille XSS');</script>",
      "zipCode": "60200",
      "city": "<script>alert('créé par une faille XSS');</script>"
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

  /********************************************************************************************* */
  /* API : /orders/add : Faille XSS impossble car valeur attendu par le backend sont des Integer */
  /********************************************************************************************** */

  // Backend :

  // @@ -61,7 +61,10 @@ public function getCurrentOrder(OrderRepository $orderRepository): JsonResponse
  //   #[Route('/orders/add', name: 'add_product_to_cart', methods: ['PUT'])]
  //   #[OA\RequestBody(
  //       description: 'Informations du produit à ajouter',
  //       content: new Model(type: OrderLine::class, groups: ['create_order'])
  //       content: new OA\JsonContent(type: 'object', properties: [
  //           new OA\Property(property: 'product', type: 'integer'), 
  //           new OA\Property(property: 'quantity', type: 'integer'),
  //       ])
  //   )]
  //   #[OA\Response(
  //       response: 200,

  // Frontend :

  // it("API : /orders/add - PUT", () => {
  //   const token = Cypress.env('token');
  //   const reviewsAdd = {
  //     "product": 5,
  //     "quantity": 1
  //   };
  //   cy.request({
  //     method: 'PUT',
  //     url: 'http://localhost:8081/orders/add',
  //     headers: {
  //       'Accept': 'application/json',
  //       'Authorization': `Bearer ${token}`,
  //       'Content-Type': 'application/json'
  //     },
  //     body: reviewsAdd,
  //   }).then((response) => {
  //     expect(response.status).to.eq(200);
  //   });
  // })

})
