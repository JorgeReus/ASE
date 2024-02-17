// export function createExpireNotification(startUrl: string) {
//   chrome.notifications.create({
//     type: "basic",
//     iconUrl: "src/stay_hydrated.png",
//     title: "AWS SSO Sesstion Expired",
//     message: `The SSO session with start url ${startUrl} has expired.`,
//     buttons: [{ title: "Re-authenticate" }],
//     priority: 0,
//   });
// }

export async function createExpireAlarm(startUrl: string, minutes: number) {}

// function setExpireAlarm(event: Event) {
//   let minutes = parseFloat(event.target.value);
//   // chrome.action.setBadgeText({text: 'Expired'});
//   // chrome.storage.sync.set({minutes: minutes});
//   window.close();
// }
