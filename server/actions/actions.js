export async function PayCeleb(celebId, amount) {
  try {
    const balance = await stripe.balance.retrieve();

    console.log("balance: ", balance);

    const transfer = await stripe.transfers.create({
      amount: amount,
      currency: "gbp",
      destination: "acct_1PBpfj4NWxSsROFH",
      description: "Shoutout request Request",
    });

    console.log("transwER ", transfer);
    res.send(transfer);
  } catch (error) {
    console.log(error.message);
    res.sendStatus(401);
  }
}

//charge id is reuqest id
export async function refundFan(chargeId, amount) {
  try {
    const refund = await stripe.refunds.create({
      charge: "ch_3PAHQhGFwRQBDdF410sX6yZ4",
      amount: amount,
    });
  } catch (error) {
    console.error(error);
  }
}
