import sleep from "./Sleep";

export default async function exponentialBackoff(
  promiseFunction,
  failureFunction,
  err,
  totalAllowedBackoffTries = 5,
  backoffAttempt = 1
) {
  const backoffSecondsToWait = 2 + Math.pow(backoffAttempt, 2);

  if (backoffAttempt > totalAllowedBackoffTries) throw err;

  try {
    const result = await promiseFunction();
    return result;
  } catch (err) {
    if (failureFunction) failureFunction(err, backoffAttempt);
    await sleep(backoffSecondsToWait * 1000);
    return await exponentialBackoff(
      promiseFunction,
      failureFunction,
      err,
      totalAllowedBackoffTries,
      backoffAttempt + 1
    );
  }
}
