# Firebase Spark-plan setup

WearVibe can run without Blaze billing. Do not deploy Cloud Functions.

1. Enable Email/Password in Authentication.
2. Create the Cloud Firestore database on the Spark plan.
3. Enable Storage only if you need uploaded product images.
4. Copy `.env.example` to `.env` and fill in the Firebase web config.
5. Deploy only rules:

```bash
firebase deploy --only firestore:rules,storage
```

6. Create the first customer through the app. The profile document is `users/{uid}`.
7. To create an administrator, add `role: "admin"` to that user document from the Firebase Console.
8. Add products, curated boxes, and matching rules through Firestore Console.

Collections:

- `users/{uid}`: name, email, phone, role, skinTone, stylePreferences
- `products/{id}`: type, name, color, colorHex, priceCents, inventoryCount, imageUrl, active
- `curatedBoxes/{id}`: name, description, priceCents, shirtId, trouserId, beltId, skinTones, active
- `matchingRules/{id}`: shirtColor, trouserColor, beltColor, skinTone, priority, active
- `carts/{uid}/items/{id}`: selected product data, quantity, size, style
- `orders/{id}`: userId, shipping, paymentMethod, items, totalCents, status

Spark-plan limitation: without Cloud Functions, price verification, inventory reservation, and automated reports run in the client/admin workflow. Do not treat the client-only checkout as a high-security production payment system. For a student/demo project, Firestore Rules and admin review are sufficient.
