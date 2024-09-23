import Stripe from "stripe";
import {prisma} from "../index.js"

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


export async function refundFan(paymentId, amount, refunded, requestId) {




  // step 1: this is to make sure that two refunds aren't intiated.
  // kind of useless because stripe already checks this, but added just in case.  
  if(refunded){

    console.log("Request has already been refunded...")
    return
  }
  try {
    // console.log("refund: ", refund)

    console.log("amount: ", amount)

    // step 1: retrieve payment Intent and the last charge on it (if it exists). 
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentId)
    const chargeId = paymentIntent.latest_charge

    if(!chargeId){
      throw new Error("No charge found for the provided paymenet Intent")
    }

    // step 2: initiate a refund
        const refund = await stripe.refunds.create({
      // charge: "ch_3PAHQhGFwRQBDdF410sX6yZ4",
      charge:chargeId,
    });

    console.log("refund succeful: ", refund)


    // step 3: update request to refunded, to insure no double refunds.... again kind of useless because stripe checks this.  
    await prisma.request.update({
      where:{
        requestid:requestId
      },
      data:{
        refunded:true
      }
    })

    console.log("refund value updated to true")
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
