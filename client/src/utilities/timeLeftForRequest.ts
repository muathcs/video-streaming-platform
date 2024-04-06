export function calculateTimeLeftForCelebrityReply(
  requestMadeTimeString: string | Date
) {
  // Parse the request made time string into a Date object
  const requestMadeTime: Date = new Date(requestMadeTimeString);

  // Calculate the deadline by adding 7 days
  const deadline: any = new Date(
    requestMadeTime.getTime() + 7 * 24 * 60 * 60 * 1000
  );

  // Get the current time
  const currentTime: any = new Date();

  // Calculate the time difference in milliseconds
  const timeDifferenceMs = deadline - currentTime;

  if (timeDifferenceMs < 0) {
    return "expired";
  }

  // Convert milliseconds to days, hours, minutes, and seconds
  const days = Math.floor(timeDifferenceMs / (1000 * 60 * 60 * 24));
  const hours = Math.floor(
    (timeDifferenceMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
  );
  const minutes = Math.floor(
    (timeDifferenceMs % (1000 * 60 * 60)) / (1000 * 60)
  );
  const seconds = Math.floor((timeDifferenceMs % (1000 * 60)) / 1000);

  const timeLeft = `${days} days, ${hours} hours, ${minutes} minutes`;

  return timeLeft;
}
