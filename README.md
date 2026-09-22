# WearVibe

Responsive React/Vite storefront for curated 3-piece fashion capsule boxes using Firebase Spark-plan services.

## Free-plan stack

- Firebase Authentication: email/password login
- Cloud Firestore: users, products, boxes, rules, carts, orders
- Firebase Storage: product images within free quota
- Firebase Hosting: optional static hosting within free quota

Cloud Functions are not required and are intentionally not deployed because they require the Blaze billing plan. The browser uses Firestore directly with Security Rules for the current project/demo scope.

## Run

```bash
npm install
copy .env.example .env
npm run dev
```

See `docs/FIREBASE_SETUP.md` for Firestore setup and collection data.
