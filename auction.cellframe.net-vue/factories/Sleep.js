export default async function sleep(milliseconds) {
  return await new Promise((resolve) => setTimeout(resolve, milliseconds));
}
