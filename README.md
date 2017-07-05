# Simple Mobile App using Mastercard Qkr! APIs #
Uses the [node-qkr-api-server](https://github.com/perusworld/node-qkr-api-server) to call Qkr! APIs. This implementation allows browsing for products(by default the first merchant, first menu, first product variant would be selected), add them to a cart and then checkout.

 If you are looking to call Qkr! APIs directly then head over to [node-qkr-api](https://github.com/perusworld/node-qkr-api)
 

## Run ##
 * Start [node-qkr-api-server](https://github.com/perusworld/node-qkr-api-server)
 * set that as the API endpoint in [config-service.ts](./src/providers/config-service/config-service.ts), right now it is pointing to [http://localhost:3000/api/v1/](http://localhost:3000/api/v1/)
 * ionic serve

