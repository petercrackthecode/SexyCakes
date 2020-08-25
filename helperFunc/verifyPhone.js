import Realm from "realm";

export async function verifyPhone(phoneNum) {
  var myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");

  var raw = JSON.stringify({});

  var requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: raw,
    redirect: "follow",
  };

  await fetch(
    "https://us-west-2.aws.webhooks.mongodb-realm.com/api/client/v2.0/app/stitch-test-sgbpv/service/testData/incoming_webhook/sendSmsVerify?num=" + phoneNum.toString(),
    requestOptions
  )
    .then((response) => response.text())
    .then((result) => console.log(result))
    .catch((error) => console.log("error", error));
}
