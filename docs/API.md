# WearVibe Firebase Spark-plan contract

The browser uses Firebase Authentication and Cloud Firestore directly. No paid Cloud Functions are required.

- Auth: Email/Password Authentication
- Profile: `users/{uid}`
- Catalog: `products`, `curatedBoxes`, `matchingRules`
- Cart: `carts/{uid}/items/{itemId}`
- Orders: `orders/{orderId}`
- Reports: calculated from orders in the admin screen or exported manually

The local `functions/` folder contains optional future server-side code. Do not deploy it on the Spark plan.
