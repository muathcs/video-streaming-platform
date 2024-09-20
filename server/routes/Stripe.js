import { prisma } from "../index.js";
import express from "express";
import { Resend } from "resend";
import Stripe from "stripe";

const router = express.Router();
const resend = new Resend("re_4BKCu5uX_Lc8VgihresCMVwvBsAED315i");

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


//
router.post("/create-payment-intent", async (req, res) => {
  try {
    const { items } = req.body;
    console.log("price: ", req.body);
    const price = Number(req.body.requestPrice * 100)

    console.log("type: ", typeof price)

    // Create a PaymentIntent with the order amount and currency
    const paymentIntent = await stripe.paymentIntents.create({
      amount: price,
      currency: "eur",

      // In the latest version of the API, specifying the `automatic_payment_methods` parameter is optional because Stripe enables its functionality by default.
      automatic_payment_methods: {
        enabled: true,
      },
      // payment_method_types: ["card"],
    });

    console.log("clinetSec: ", paymentIntent.client_secret)

    // pi_3Q1EHXGFwRQBDdF40KkTmQqu_secret_Xgva2OYmz9Q52jZ6KFFYqd7fQ
    res.send({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    console.log("/create-stripe: ", error.message);
    res.send(error.message)
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
      console.log("id:: ", myAccount[0].metadata.uid)
      return myAccount[0].id;
    } else {
      return false;
    }
    console.log("myaccount: ", myAccount);

    // Access the retrieved account(s)

    console.log("account:", myAccount);
  } catch (error) {
    console.error("connectedAccountExistFunction: ", error)
  }
}


async function deleteAllConnectedAccounts() {
  try {
      // List all connected accounts
      const accounts = await stripe.accounts.list();
      
      // Loop through each account and delete
      for (const account of accounts.data) {
          try {
              await stripe.accounts.del(account.id);
              console.log(`Successfully deleted account: ${account.id}`);
          } catch (deleteError) {
              console.error(`Failed to delete account ${account.id}: ${deleteError.message}`);
          }
      }
  } catch (listError) {
      console.error(`Failed to list accounts: ${listError.message}`);
  }
}




router.post("/add-account", async (req, res) => {
  console.log("body: ", req.body);

  const { displayname, email, uid } = req.body;

  console.log("uid: ", uid, "displayname: ", displayname);

  // await deleteAllConnectedAccounts()
  // return

  try {
    const accountExist = await connectAccountExists(uid);

    if(accountExist){
      console.log("account exists: ", accountExist)
    }else{
      console.log("account doesn't exist: ", accountExist)
    }

    const {stripe_account_id} = await prisma.celeb.findUnique({
      where:{
        uid

      },
      select:{
        stripe_account_id:true
      }
    })

    

    const status = await stripe.accounts.retrieve(stripe_account_id)
    // const status = await stripe.accounts.retrieve("acct_1Q13NJ4aIt9NVBmv")

    console.log("status: ", status)



    if (status.charges_enabled) {
      console.log("creating")
      // Create a new account
      // let account = await stripe.accounts.create({
      //   type: "custom",
      //   business_type: "individual",
      //   email: email,
      //   metadata: {
      //     uid: uid,
      //   },
      //   individual: {},
      //   business_profile: {
      //     url: "hikaya.com",
      //     name: displayname,
      //     mcc: 5815,
      //   },
      //   capabilities: {
      //     card_payments: {
      //       requested: true,
      //     },
      //     transfers: {
      //       requested: true,
      //     },
      //   },
      // });


      // Create an account link for onboarding
      let accountLink = await stripe.accountLinks.create({
        account: stripe_account_id,
        refresh_url: "http://localhost:4242?failure",
        return_url: "http://localhost:4242?success",
        type: "account_onboarding",
        collect: "eventually_due",
      });

      const update = await prisma.celeb.update({
        where:{
          uid:uid
        },
        data:{
          stripe_onboarded:true
        }
      })

      // Send the URL to the client
      res.status(201).send({ url: accountLink.url });
    } else {
      console.log("Account already onboarded");
      res.status(400).send({ message: "Account already exists" });
    }
  } catch (error) {
    console.error(error);
    res.status(201).send({ error: "Internal Server Error" });
  }
});

router.post("/reciept", async (req, res) => {
  const name = "muah";
  const { celebuid, price } = req.body;

  console.log("uid: ", celebuid, "price: ", price);
  try {
    const celebName = await prisma.celeb.findUnique({
      where: {
        uid: celebuid, // Ensure that 'celebuid' is defined and holds the unique identifier for the celebrity
      },
      select: {
        displayname: true, // This tells Prisma to only return the 'displayname' field
      },
    });

    console.log("celebname: ", celebName);
    const { data, error } = await resend.emails.send({
      from: "onboarding@resend.dev",
      to: ["muath.khalifa@yahoo.com"],
      subject: "Order Confirmation",
      html: `
      <html>
        <body>
          <h1>Order Confirmation</h1>
          <p>Dear Customer ,</p>
          <p>Thank you for your shoutout request !</p>
          <p>You have successfully booked a shoutout with <strong>${celebName.displayname}</strong>. The total price for your request is <strong>£${price}</strong>.</p>
          <p>We are currently processing your request and you can expect to receive it within one week.</p>
          <p>If you have any questions or need to make any changes to your order, please do not hesitate to contact us at <a href="mailto:onboarding@resend.dev">onboarding@resend.dev</a>.</p>
          <p>Thank you for choosing our service!</p>
          <p>Warm regards,</p>
          <p>Muath Khalifa</p>
        </body>
      </html>
    `,
    });
  } catch (error) {
    console.error(error);
  }
});

export default router;
