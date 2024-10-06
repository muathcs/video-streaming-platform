import { prisma } from "../index.js";

export async function sendRequest(intended_uid, sender_uid, message) {
  try {
    const response = await prisma.notification.create({
      data: {
        intended_uid: intended_uid,
        sender_uid: sender_uid,
        message: message,
      },
    });
  } catch (error) {
    console.log("error/notification: ", error);
  }
}
export async function updateFanClusterIdAndTotalSpent(celebUid, fanUid, price) {
    try {
      //get the cluster id of the celeb that was just reqeusted
      const getCelebCluster = await prisma.celeb.findFirst({
        where: {
          uid: celebUid,
        },
        select: {
          cluster_id: true,
        },
      });
  
      //destruct cluster id
      const { cluster_id } = getCelebCluster;
  
      //update the fan who made the request table fav_categories column, with the cluster of the id
      // const addUserFavCat = await prisma.fan.update({
      //   where: {
      //     uid: fanUid,
      //   },
      //   data: {
      //     fav_categories: cluster_id,
      //   },
      // });
  
      //update total spent for a specific Fan.
      // const updateTotalSpent = await prisma.fan.update({
      //   data: {
      //     total_spent: {
      //       increment: price,
      //     },
      //     num_of_requests: {
      //       increment: 1,
      //     },
      //   },
      //   where: {
      //     uid: fanUid,
      //   },
      // });
    } catch (error) {
      console.error(error);
    }
  }
  