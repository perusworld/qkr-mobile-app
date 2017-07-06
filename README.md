# Simple Mobile App using Mastercard Qkr! APIs #
Uses the [node-qkr-api-server](https://github.com/perusworld/node-qkr-api-server) to call Qkr! APIs. This implementation allows browsing for products(by default the first merchant, first menu, first product variant, first card would be used), add them to a cart and then checkout.

If you are looking to call Qkr! APIs directly then head over to [node-qkr-api](https://github.com/perusworld/node-qkr-api)
 

## Run ##
 * Start [node-qkr-api-server](https://github.com/perusworld/node-qkr-api-server)
 * set that as the API endpoint in [config-service.ts](./src/providers/config-service/config-service.ts), right now it is pointing to [http://localhost:3000/api/v1/](http://localhost:3000/api/v1/)
 * ionic serve

## Run Android ##
 * Make sure to point the API endpoint in [config-service.ts](./src/providers/config-service/config-service.ts) to an externally accessible endpoint.
```bash
ionic cordova run android --device
```

## Demo Video ##
### Mobile Web ###
[![qkr-mobile-app - Qkr Cart Checkout Demo Video](https://img.youtube.com/vi/_RvluBW2K8s/3.jpg)](https://youtu.be/_RvluBW2K8s)
### Android ###
[![qkr-mobile-app - Qkr Cart Checkout Demo Video - Android](https://img.youtube.com/vi/8gjkrQB-j3M/2.jpg)](https://youtu.be/8gjkrQB-j3M)