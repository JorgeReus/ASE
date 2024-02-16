import {
  ListAccountsCommand,
  ListAccountsCommandOutput,
  SSOClient,
} from "@aws-sdk/client-sso";

const BASE_URL_TMPL = "https://portal.sso.{0}.amazonaws.com/token/whoAmI";
const COOKIE_NAME = "x-amz-sso_authn";

function formatString(template: String, ...args: Array<string>) {
  return template.replace(/{([0-9]+)}/g, function (match, index) {
    return typeof args[index] === "undefined" ? match : args[index];
  });
}

interface UserInformation {
  accountId: string;
  createDate: number;
  directoryId: string;
  expireDate: number;
  firstName: string;
  userIdentifier: string;
}

export class AwsSso {
  accessToken: string;
  region: string;
  ssoStartUrl: string;
  portalUrl: string;
  ssoClient: SSOClient;

  constructor(
    documentCookie: string,
    documentHead: HTMLHeadElement,
    ssoStartUrl: string,
  ) {
    this.region = documentHead
      .querySelector('[name="region"]')
      ?.getAttribute("content")!;

    this.ssoStartUrl = ssoStartUrl;
    this.accessToken = documentCookie
      .split("; ")
      .find((row: string) => row.startsWith(COOKIE_NAME))
      ?.split("=")[1]!;

    this.portalUrl = formatString(BASE_URL_TMPL, this.region);

    this.ssoClient = new SSOClient({
      region: this.region,
    });
  }

  async whoAmI(): Promise<UserInformation> {
    const headers: HeadersInit = {
      Accept: "application/json, text/plain, */*",
      "Accept-Encoding": "gzip, deflate, br",
      "Cache-Control": "no-cache",
      Origin: this.ssoStartUrl,
      Pragma: "no-cache",
      Referer: this.ssoStartUrl,
      "X-Amz-Sso-Bearer-Token": this.accessToken,
      "X-Amz-Sso_bearer_token": this.accessToken,
    };

    const requestOptions: RequestInit = {
      method: "GET",
      headers,
    };

    return await fetch(this.portalUrl, requestOptions).then((response) => {
      return response.json();
    });
  }

  listAccounts(): Promise<ListAccountsCommandOutput> {
    const command = new ListAccountsCommand({
      accessToken: this.accessToken,
    });
    return this.ssoClient.send(command);
  }
}
