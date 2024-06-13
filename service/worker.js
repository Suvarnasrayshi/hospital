const {Worker} = require('bullmq');
const {redisConfig} =require('../config/redisConfig')
const { sendEmailreminderNotification } = require("../service/reminderemail");
const {sendEmailNotification} = require("../service/email")

exports.emailWorker = new Worker('email',async(job)=>{
  const{recipientEmail,subject,text,reminderId}=job.data;
  sendEmailreminderNotification(recipientEmail,subject,text,reminderId);
},{connection:redisConfig});



exports.reportWorker = new Worker('report',async(job)=>{
  const{recipientEmail,subject,text,filepath}=job.data;
  sendEmailNotification(recipientEmail,subject,text,filepath);
},{connection:redisConfig});
