import { prisma } from "../index.js";
import express from "express";
import Stripe from "stripe";

const router = express.Router();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

async function createCustomer(email, displayname, uid) {
  try {
    // const customer = await stripe.customers.list({
    //   limit: 1,
    //   email: email,
    // });

    const customer = await stripe.customers.search({
      query: `metadata["customeId"]:"${uid}"`,
    });

    console.log("customer: ", customer);

    if (customer.data.length > 0) {
      console.log("true customer exists");
      // console.log("customer: ", customer);
      return customer.data[0];
    } else {
      console.log("false: customer does not eixst");
      const customer = await stripe.customers.create({
        name: displayname,
        email: email,
        metadata: {
          customeId: uid,
        },
      });

      return customer;
    }
  } catch (error) {
    console.error(error.message);
  }
}

// async function PayCeleb(){

//   //first check if Celeb has a custom connect account

//   const celebCustomAccount = await stripe.accounts.retrieve({
//     ema

//   })
// }

// on request
// router.post("/create-payment-intent", async (req, res) => {
//   console.log("in the intent page: ", req.body);
//   try {
//     const { items } = req.body;

//     const price = req.body.requestPrice * 100;

//     const email = "muath.khalifaa@test.com";
//     const displayname = "muath k";
//     const uid = "3248fsadlhj239184x";

//     // create as soon as the user creates an account on.
//     const customer = await createCustomer(email, displayname, uid); // info comes from Hikaya account

//     // Create a PaymentIntent with the order amount and currency

// const paymentIntent = await stripe.paymentIntents.create({
//   // customer: customer.id,
//   amount: price,
//   currency: "eur",
//   // In the latest version of the API, specifying the `automatic_payment_methods` parameter is optional because Stripe enables its functionality by default.
//   automatic_payment_methods: {
//     enabled: false,
//   },
//   payment_method_types: ["card"],
// });

//     res.send({
//       clientSecret: paymentIntent.client_secret,
//     });
//   } catch (error) {
//     console.log("/create-stripe: ", error);
//   }
// });

router.post("/create-payment-intent", async (req, res) => {
  try {
    const { items } = req.body;
    console.log("price: ", req.body);
    const price = req.body.requestPrice * 100;

    // Create a PaymentIntent with the order amount and currency
    const paymentIntent = await stripe.paymentIntents.create({
      amount: price,
      currency: "eur",

      // In the latest version of the API, specifying the `automatic_payment_methods` parameter is optional because Stripe enables its functionality by default.
      automatic_payment_methods: {
        enabled: false,
      },
      payment_method_types: ["card"],
    });

    res.send({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    console.log("/create-stripe: ", error);
  }
});

async function connectAccountExists(uid) {
  try {
    const accounts = await stripe.accounts.list({
      limit: 100,
    });

    const myAccount = accounts.data.filter(
      (account) => account.metadata.uid === uid
    );

    if (myAccount.length > 0) {
      return myAccount[0].id;
    } else {
      return false;
    }
    console.log("myaccount: ", myAccount);

    // Access the retrieved account(s)

    console.log("account:", myAccount);
  } catch (error) {}
}

router.post("/add-account", async (req, res) => {
  console.log("body: ", req.body);

  const { displayname, email, uid } = req.body;

  console.log("uid: ", uid, "displayname: ", email);

  res.sendStatus(201);

  const accountExist = connectAccountExists(uid);

  try {
    if (!accountExist) {
      //create account
      let account = await stripe.accounts.create({
        type: "custom",
        business_type: "individual",
        email: email, // from body
        metadata: {
          uid: uid, // from body
        },

        individual: {},
        business_profile: {
          url: "hikaya.com",
          name: displayname,
          mcc: 5815, //mcc code for digital software business sector
        },

        capabilities: {
          card_payments: {
            requested: true, // keep in case I want to allow Fans to directly send money to celebs in the future (maybe tips)
          },
          transfers: {
            requested: true, // will allow us to transfer funds to celeb
          },
        },
      });
    } else {
    }

    let accountLink = await stripe.accountLinks.create({
      account: account.id,
      refresh_url: "http://localhost:4242?failure",
      return_url: "http://localhost:4242?successx",
      type: "account_onboarding",

      collect: "eventually_due",
    });

    res.send(accountLink).status(201);
  } catch (error) {
    console.error(error);
  }
});

export default router;
