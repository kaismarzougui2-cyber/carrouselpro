// api/stripe-webhook.js
// ─────────────────────────────────────────────────────────────
// Vercel Serverless Function — reçoit les événements Stripe
// et met à jour Firestore en conséquence.
//
// Setup :
//  1. Stripe Dashboard > Developers > Webhooks > Add endpoint
//     URL : https://ton-app.vercel.app/api/stripe-webhook
//     Événements : checkout.session.completed
//                  customer.subscription.deleted
//                  invoice.payment_failed
//
//  2. Variables Vercel (Settings > Environment Variables) :
//     STRIPE_SECRET_KEY       → Stripe > Developers > API keys > Secret key
//     STRIPE_WEBHOOK_SECRET   → Stripe > Developers > Webhooks > Signing secret
//     FIREBASE_PROJECT_ID     → Firebase Console > Paramètres du projet
//     FIREBASE_CLIENT_EMAIL   → Firebase Console > Paramètres > Comptes de service > Générer clé privée
//     FIREBASE_PRIVATE_KEY    → (même fichier JSON, champ "private_key")
// ─────────────────────────────────────────────────────────────

import Stripe from 'stripe'
import { initializeApp, getApps, cert } from 'firebase-admin/app'
import { getFirestore }                  from 'firebase-admin/firestore'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

// Init Firebase Admin (une seule fois)
if (!getApps().length) {
  initializeApp({
    credential: cert({
      projectId:   process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey:  process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    }),
  })
}
const db = getFirestore()

// ─── Helper : find user by stripe_customer_id ─────────────────
async function findUserByCustomer(customerId) {
  const snap = await db.collection('users')
    .where('stripe_customer_id', '==', customerId)
    .limit(1)
    .get()
  return snap.empty ? null : { id: snap.docs[0].id, ...snap.docs[0].data() }
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).send('Method not allowed')
  }

  const signature = req.headers['stripe-signature']

  let event
  try {
    event = stripe.webhooks.constructEvent(
      req.body, signature, process.env.STRIPE_WEBHOOK_SECRET
    )
  } catch (err) {
    console.error('[Webhook] Signature invalide:', err.message)
    return res.status(400).send(`Webhook Error: ${err.message}`)
  }

  // ── Paiement réussi → activer Premium ──────────────────────
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object
    const userId  = session.metadata?.firebase_user_id

    if (!userId) {
      console.error('[Webhook] firebase_user_id manquant dans metadata')
      return res.status(400).send('Missing user id')
    }

    try {
      await db.collection('users').doc(userId).set({
        is_premium:             true,
        stripe_customer_id:     session.customer,
        stripe_subscription_id: session.subscription,
        premium_until:          null,
      }, { merge: true })
      console.log(`[Webhook] ✓ User ${userId} → Premium activé`)
    } catch (e) {
      console.error('[Webhook] Erreur activation Premium:', e)
      return res.status(500).send('DB Error')
    }
  }

  // ── Abonnement annulé → désactiver Premium ─────────────────
  if (event.type === 'customer.subscription.deleted') {
    const customerId = event.data.object.customer
    const user = await findUserByCustomer(customerId)
    if (user) {
      await db.collection('users').doc(user.id).update({
        is_premium:    false,
        premium_until: new Date().toISOString(),
      })
      console.log(`[Webhook] ✓ Customer ${customerId} → Plan gratuit`)
    }
  }

  // ── Paiement échoué → désactiver Premium ───────────────────
  if (event.type === 'invoice.payment_failed') {
    const customerId = event.data.object.customer
    const user = await findUserByCustomer(customerId)
    if (user) {
      await db.collection('users').doc(user.id).update({ is_premium: false })
      console.log(`[Webhook] ✓ Customer ${customerId} → Paiement échoué, downgrade`)
    }
  }

  res.status(200).json({ received: true })
}
