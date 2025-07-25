const fs = require("fs");
const path = require("path");

function initCanisterEnv() {
  let localCanisters, prodCanisters;
  try {
    localCanisters = require(path.resolve(".dfx", "local", "canister_ids.json"));
  } catch (error) {
    console.log("No local canister_ids.json found");
  }
  try {
    prodCanisters = require(path.resolve("canister_ids.json"));
  } catch (error) {
    console.log("No production canister_ids.json found");
  }

  const network = process.env.DFX_NETWORK || (process.env.NODE_ENV === "production" ? "ic" : "local");
  const canisterConfig = network === "local" ? localCanisters : prodCanisters;

  const localMap = localCanisters
    ? Object.entries(localCanisters).reduce((prev, current) => {
        const [canisterName, canisterDetails] = current;
        prev[canisterName.toUpperCase() + "_CANISTER_ID"] = canisterDetails[network];
        return prev;
      }, {})
    : { BACKEND_CANISTER_CANISTER_ID: "meeck-xiaaa-aaaap-an2va-cai" };
  const prodMap = prodCanisters
    ? Object.entries(prodCanisters).reduce((prev, current) => {
        const [canisterName, canisterDetails] = current;
        prev[canisterName.toUpperCase() + "_CANISTER_ID"] = canisterDetails[network];
        return prev;
      }, {})
    : { BACKEND_CANISTER_CANISTER_ID: "meeck-xiaaa-aaaap-an2va-cai" };

  return [localMap, prodMap];
}

const [localCanisters, prodCanisters] = initCanisterEnv();

if (localCanisters) {
  const localTemplate = Object.entries(localCanisters).reduce((start, next) => {
    const [key, val] = next;
    return start ? `${start}\n${key}=${val}` : `${key}=${val}`;
  }, ``);
  fs.writeFileSync(".env.development", localTemplate);
}

if (prodCanisters) {
  const prodTemplate = Object.entries(prodCanisters).reduce((start, next) => {
    const [key, val] = next;
    return start ? `${start}\n${key}=${val}` : `${key}=${val}`;
  }, ``);
  fs.writeFileSync(".env", prodTemplate);
}