const {redisConfig} =require('../config/redisConfig')
const {Queue}=require('bullmq');
exports.EmailQueue = new Queue('email',{connection:redisConfig});
exports.ReportQueue = new Queue('report',{connection:redisConfig});