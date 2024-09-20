import Stripe from "stripe";


const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function PayCeleb(amount, celebStripeId) {



  try {
    const balance = (await stripe.balance.retrieve()).available;

    console.log("balance: ", balance);

    const transfer = await stripe.transfers.create({
      amount: amount,
      currency: "gbp",
      destination: celebStripeId,
      description: "Shoutout request Fulfilled",
    });

    console.log("payment succeful ");
    
    // res.send(transfer);
  } catch (error) {
    console.log(error.message);
    // res.sendStatus(401);
  }
}


export async function refundFan(paymentId, amount) {
  try {


    // console.log("refund: ", refund)

    console.log("amount: ", amount)

    const paymentIntent = await stripe.paymentIntents.retrieve(paymentId)
    const chargeId = paymentIntent.latest_charge

    if(!chargeId){
      throw new Error("No charge found for the provided paymenet Intent")

    }

        const refund = await stripe.refunds.create({
      // charge: "ch_3PAHQhGFwRQBDdF410sX6yZ4",
      charge:chargeId,
    });

    console.log("refund succeful: ", refund)
  } catch (error) {
    console.error(error);
  }
}




export async function createStripeCustomAccount(email, uid, displayName) {
  try {
    const account = await stripe.accounts.create({
      type: "custom",
      business_type: "individual",
      email: email,
      metadata: {
        uid: uid,
      },
      individual: {},
      business_profile: {
        url: "hikaya.com",
        name: displayName,
        mcc: 5815,
      },
      capabilities: {
        card_payments: {
          requested: true,
        },
        transfers: {
          requested: true,
        },
      },
    });

    console.log("Stripe account created succefully...")
    return account;
  } catch (error) {
    console.error("Error creating Stripe account:", error);
    throw error; // Propagate the error#
  }
}
