interface CreateAlarmRequest {
  action: "createAlarm";
  data: {
    ssoStartUrl: string;
    delayInMinutes: number;
  };
}

interface CreateAlarmResponse {
  action: "createdAlarm";
}
