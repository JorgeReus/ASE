chrome.runtime.onMessage.addListener(async function (
  request: CreateAlarmRequest,
  sender,
  sendResponse: (response?: CreateAlarmResponse) => void,
) {
  console.log(
    sender.tab
      ? "from a content script:" + sender.tab.url
      : "from the extension",
  );

  await chrome.storage.local.set({
    key: request.data.ssoStartUrl,
    value: request.data.delayInMinutes,
  });

  await chrome.alarms.create(request.data.ssoStartUrl, {
    // delayInMinutes: request.data.delayInMinutes,
    delayInMinutes: 1,
  });
  sendResponse({ action: "createdAlarm" });
});

chrome.alarms.onAlarm.addListener(async (alarm: chrome.alarms.Alarm) => {
  // "expire-alarms": value,
  console.log(alarm);
  // const { value } = await chrome.storage.local.get(alarm.name);
  // console.log(value);
});
