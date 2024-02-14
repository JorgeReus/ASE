import { SSOClient, ListAccountsCommand } from "@aws-sdk/client-sso";

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

function formatRemainingTime(expireDate: number): string {
  const currentDate = new Date().getTime();
  const remainingMilliseconds = expireDate - currentDate;

  const seconds = Math.floor((remainingMilliseconds / 1000) % 60);
  const minutes = Math.floor((remainingMilliseconds / (1000 * 60)) % 60);
  const hours = Math.floor((remainingMilliseconds / (1000 * 60 * 60)) % 24);

  return `${hours} hours, ${minutes} minutes, and ${seconds} seconds`;
}

try {
  const userData: UserInformation = await fetch(url, requestOptions).then(
    (response) => {
      return response.json();
    },
  );

  const remainingTime = formatRemainingTime(userData.expireDate);
  console.log("Remaining time until expiry:", remainingTime);

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
