/* @refresh reload */
import { render } from 'solid-js/web';
import { AwsSso } from "../util/sso";
import { createSignal, onCleanup } from 'solid-js';
import { waitForElement } from '../util/ui';
import { formatRemainingTime, unixTimestampToMinutes } from '../util/unixTimestamp';
import { createExpireAlarm, createExpireNotification } from '../util/chrome';

const SSO_DIVIDER_ID= "sso-enhance-expiration-divider"
const SSO_SPAN_ID="sso-enhance-expiration-span"

let portal = await waitForElement('portal-topbar centered-content .service-links')

let divider = document.getElementById(SSO_DIVIDER_ID)

if (!divider) {
  divider = document.createElement('div')
  divider.id = SSO_DIVIDER_ID
  divider.className= "divider"
  divider.setAttribute('_ngcontent-c2', '')
  portal.prepend(divider)
}

let span = document.getElementById(SSO_SPAN_ID)

if (!span) {
  span = document.createElement('span')
  span.id = SSO_SPAN_ID
  portal.prepend(span)
}

try {
  const sso = new AwsSso(
    document.cookie,
    document.head,
    window.location.hostname,
  );

  let userData = await sso.whoAmI();

  let expMinutes = unixTimestampToMinutes(userData.expireDate)

  let request: CreateAlarmRequest = {
    action: "createAlarm",
    data: {
      delayInMinutes: expMinutes,
      ssoStartUrl: sso.ssoStartUrl
    }
  }

  const response: CreateAlarmResponse = await chrome.runtime.sendMessage(request);
  console.log(response.action);

  function Component() {
    const [expiryTime, setExpiryTime] = createSignal(userData.expireDate);

    const inter = setInterval(() => {
      setExpiryTime(expiryTime() - 1)
    // TODO set configurable polling time
    }, 1000);

      const formattedTimestamp = () => {
        let ft = formatRemainingTime(expiryTime())
        let result = ""
        if(ft.hours > 0) {
          result += `${ft.hours} Hours, `
        }
        if (ft.minutes >0) {
          result += `${ft.minutes} Minutes, `
        }
        if (ft.seconds >0) {
          result += `${ft.seconds} Seconds remaining`
        }
        // TODO Trigger reauth with configurable treshhold
        return result
    }
    onCleanup(() => clearInterval(inter))
    return <span>{formattedTimestamp()}</span>
  }

  render(() => <Component />, span!);
} catch(e) {

  render(() => {
    return <span>The token is invalid, reauthenticate</span>
  }, span!);
}
