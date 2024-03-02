// import { SNSClient, PublishCommand } from "@aws-sdk/client-sns";

// async function sendSMS(sns, params) {
//   const command = new PublishCommand(params);
//   const message = await sns.send(command);
//   return message;
// }
// async () => {
//   const params = {
//     Message: "Your OTP code is: " + Math.random().toString().substring(2, 6),
//     PhoneNumber: "0559041043",
//     MessageAttributes: {
//       "AWS.SNS.SMS.SenderID": {
//         DataType: "String",
//         StringValue: "String",
//       },
//     },
//   };

//   const sns = new SNSClient({
//     region: "REGION",
//     credentials: {
//       accessKeyId: "access_key",
//       secretAccessKey: "secret_AccessKey",
//     },
//   });

//   await sendSMS(sns, params);
// };
