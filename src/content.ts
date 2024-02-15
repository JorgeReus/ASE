import { SSOClient, ListAccountsCommand } from "@aws-sdk/client-sso";
import { formatRemainingTime } from "./util/unixTimestamp";

const cookies = document.cookie.split("; ");

const awsSsoToken = cookies
  .find((row) => row.startsWith("x-amz-sso_authn="))
  ?.split("=")[1]!;

const region = document.head
  .querySelector('[name="region"]')
  ?.getAttribute("content")!;

const hostname = window.location.hostname;

const headers: HeadersInit = {
  Accept: "application/json, text/plain, */*",
  "Accept-Encoding": "gzip, deflate, br",
  "Cache-Control": "no-cache",
  Origin: hostname,
  Pragma: "no-cache",
  Referer: hostname,
  "X-Amz-Sso-Bearer-Token": awsSsoToken,
  "X-Amz-Sso_bearer_token": awsSsoToken,
};

const requestOptions: RequestInit = {
  method: "GET",
  headers,
};
const url = `https://portal.sso.${region}.amazonaws.com/token/whoAmI`;

interface UserInformation {
  accountId: string;
  createDate: number;
  directoryId: string;
  expireDate: number;
  firstName: string;
  userIdentifier: string;
}

try {
  const userData: UserInformation = await fetch(url, requestOptions).then(
    (response) => {
      return response.json();
    },
  );

  const { hours, minutes, seconds } = formatRemainingTime(userData.expireDate);

  console.log(
    `Remaining time until expiry: ${hours} hours, ${minutes} minutes with ${seconds} seconds`,
  );

  const client = new SSOClient({
    region,
  });
  const input = {
    accessToken: awsSsoToken,
  };
  const command = new ListAccountsCommand(input);
  const response = await client.send(command);

  console.log(response);
} catch (e) {
  console.error("Error getting whoAmI information", e);
}
