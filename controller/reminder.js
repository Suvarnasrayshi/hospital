const express = require("express");
const app = express();
app.set("view engine", "ejs");
const bodyParser = require("body-parser");
const { Op } = require("sequelize");
const { medication, reminder, user } = require("../models");
const cron = require("node-cron");

const { EmailQueue } =require('../service/producer')

const generateReminders = async () => {
  const todayDate = new Date();
  const dateWithoutTime = todayDate.toISOString().split("T")[0];
  console.log(dateWithoutTime);
  const todayDay = todayDate.toLocaleString("en-US", { weekday: "long" });
  const currentTime = new Date();
  console.log("dateWithoutTime",dateWithoutTime);

  let hours = currentTime.getHours().toString().padStart(2, '0');
  let minutes = currentTime.getMinutes().toString().padStart(2, '0');
  let seconds = currentTime.getSeconds().toString().padStart(2, '0');
  console.log("seconds"+seconds);
  console.log("todayDay-" + todayDay);
  console.log(hours + ":" + minutes + ":" + seconds);
  let totaltime = hours + ":" + minutes + ":" + seconds
  try {
    
    const allMedications = await medication.findAll({
      attributes: ['name', 'description', 'time', 'date','start_date','end_date','type','rec_type','day_week', 'user.email', 'user.id'],
      raw:true,
      include: [user],
    });

     console.log("allMedications",allMedications);

    if (allMedications) {
      allMedications.forEach(async (medicationdetail) => {
     
         if (medicationdetail.type === "one-time" && 
        medicationdetail.date === dateWithoutTime &&
        medicationdetail.time === totaltime
        ) {
          await reminder.create({
            medication_id: medicationdetail.id,
            reminder_at: new Date(`${medicationdetail.date} ${medicationdetail.time}`),
            status: "pending",
          });
          console.log("Reminder created for one-time medication", medicationdetail.user.email);
          EmailQueue.add("email",{
            recipientEmail:medicationdetail.user.email,
            subject:'Medication Reminder',
            text:`Please remember to take your medication ${medicationdetail.name} at ${medicationdetail.time}.`,
           medicationId: medicationdetail.id
         });

        }
        console.log(medicationdetail.start_date);
        console.log(medicationdetail.end_date);
        if (medicationdetail.type === "recurring" &&
            medicationdetail.start_date <= dateWithoutTime &&
            medicationdetail.end_date >= dateWithoutTime 
             && medicationdetail.time === totaltime) {
              
              console.log("hello world!!!");
             if(  medicationdetail.rec_type=== "daily"){
          await reminder.create({
            medication_id: medicationdetail.id,
            reminder_at: new Date(`${dateWithoutTime} ${medicationdetail.time}`),
            status: "pending",
          });
          console.log("daily");
        }
         if (medicationdetail.rec_type=== "weekly" ) {
          console.log(" in side the above the week");
          if (medicationdetail.day_week === todayDay ) {
            
          
            await reminder.create({
              medication_id: medicationdetail.id,
              reminder_at: new Date(`${dateWithoutTime} ${medicationdetail.time}`),
              status: "pending",
            });
            console.log("weekly");
          }
          }
         
          console.log(`Reminder created for recurring medication: ${medicationdetail.email}`);
          
          EmailQueue.add("email",{
             recipientEmail:medicationdetail.email,
             subject:'Medication Reminder',
             text:`Please remember to take your medication ${medicationdetail.name} at ${medicationdetail.time}.`,
            medicationId: medicationdetail.id
          });
          
        }
     

      });
    } else {
      console.log("No medication found");
    }
  } catch (error) {
    console.error("Error generating reminders:", error);
  }
};

  cron.schedule("* * * * *", function() {
  console.log("Scheduled the cron to run daily at midnight");
  generateReminders();
});

module.exports = { generateReminders };








// Executing (default): SELECT `medication`.`name`, `medication`.`description`, `medication`.`time`, `medication`.`date`, `medication`.`start_date`, `medication`.`end_date`, `medication`.`type`, `medication`.`rec_type`, `medication`.`day_week`, `user`.`email`, `user`.`id`, `user`.`id` AS `user.id`, `user`.`username` AS `user.username`, `user`.`email` AS `user.email`, `user`.`password` AS `user.password`, `user`.`deletedAt` AS `user.deletedAt`, `user`.`createdAt` AS `user.createdAt`, `user`.`updatedAt` AS `user.updatedAt` FROM `medications` AS `medication` LEFT OUTER JOIN `users` AS `user` ON `medication`.`user_id` = `user`.`id` AND (`user`.`deletedAt` IS NULL) WHERE (`medication`.`deletedAt` IS NULL);
// allMedications [
//   {
//     name: 'niacinamide',
//     description: 'for acne',
//     time: '15:11:00',
//     date: '2024-06-07',
//     start_date: null,
//     end_date: null,
//     type: 'one-time',
//     rec_type: null,
//     day_week: null,
//     email: 'sinhaaarya15@gmail.com',
//     id: 4,
//     'user.id': 4,
//     'user.username': 'anjali',
//     'user.email': 'sinhaaarya15@gmail.com',
//     'user.password': 'arya',
//     'user.deletedAt': null,
//     'user.createdAt': 2024-06-06T05:08:48.000Z,
//     'user.updatedAt': 2024-06-07T05:28:06.000Z
//   },
//   {
//     name: 'paracetamol',
//     description: 'for the fever',
//     time: '15:11:00',
//     date: '2024-06-07',
//     start_date: null,
//     end_date: null,
//     type: 'one-time',
//     rec_type: null,
//     day_week: null,
//     email: 'sinhaaarya15@gmail.com',
//     id: 4,
//     'user.id': 4,
//     'user.username': 'anjali',
//     'user.email': 'sinhaaarya15@gmail.com',
//     'user.password': 'arya',
//     'user.deletedAt': null,
//     'user.createdAt': 2024-06-06T05:08:48.000Z,
//     'user.updatedAt': 2024-06-07T05:28:06.000Z
//   },
//   {
//     name: 'vitamin c',
//     description: 'for dullness',
//     time: '15:49:00',
//     date: null,
//     start_date: '2024-06-07',
//     end_date: '2024-07-04',
//     type: 'recurring',
//     rec_type: 'daily',
//     day_week: null,
//     email: 'sinhaaarya15@gmail.com',
//     id: 4,
//     'user.id': 4,
//     'user.username': 'anjali',
//     'user.email': 'sinhaaarya15@gmail.com',
//     'user.password': 'arya',
//     'user.deletedAt': null,
//     'user.createdAt': 2024-06-06T05:08:48.000Z,
//     'user.updatedAt': 2024-06-07T05:28:06.000Z
//   },
//   {
//     name: 'eno',
//     description: 'gas',
//     time: '19:09:00',
//     date: null,
//     start_date: '2024-06-07',
//     end_date: '2024-07-04',
//     type: 'recurring',
//     rec_type: 'weekly',
//     day_week: 'Friday',
//     email: 'sinhaaarya15@gmail.com',
//     id: 4,
//     'user.id': 4,
//     'user.username': 'anjali',
//     'user.email': 'sinhaaarya15@gmail.com',
//     'user.password': 'arya',
//     'user.deletedAt': null,
//     'user.createdAt': 2024-06-06T05:08:48.000Z,
//     'user.updatedAt': 2024-06-07T05:28:06.000Z
//   },
//   {
//     name: 'paracetamol',
//     description: 'for the fever',
//     time: '19:02:00',
//     date: null,
//     start_date: '2024-06-07',
//     end_date: '2024-07-07',
//     type: 'recurring',
//     rec_type: 'weekly',
//     day_week: 'Friday',
//     email: 'kajal@gmail.commm',
//     id: 7,
//     'user.id': 7,
//     'user.username': 'kajal',
//     'user.email': 'kajal@gmail.commm',
//     'user.password': 'kajal',
//     'user.deletedAt': null,
//     'user.createdAt': 2024-06-06T07:11:00.000Z,
//     'user.updatedAt': 2024-06-06T13:09:13.000Z
//   },
//   {
//     name: 'paracetamol',
//     description: 'for the fever',
//     time: '19:09:00',
//     date: null,
//     start_date: '2024-06-07',
//     end_date: '2024-06-21',
//     type: 'recurring',
//     rec_type: 'daily',
//     day_week: null,
//     email: 'krushi@gmaill.com',
//     id: 10,
//     'user.id': 10,
//     'user.username': 'krushi',
//     'user.email': 'krushi@gmaill.com',
//     'user.password': '$2a$10$LL1YpEjZP4MGW0gFHnxmPu5OAvTFDHQfDsGFhsViJEJnT315C5l2C',
//     'user.deletedAt': null,
//     'user.createdAt': 2024-06-07T13:37:24.000Z,
//     'user.updatedAt': 2024-06-07T13:37:24.000Z
//   }
// ]
// null
// null
// null
// null
// 2024-06-07
// 2024-07-04
// 2024-06-07
// 2024-07-04
// hello world!!!
//  in side the above the week
// 2024-06-07
// 2024-07-07
// 2024-06-07
// 2024-06-21
// hello world!!!
// Executing (default): INSERT INTO `reminders` (`id`,`medication_id`,`reminder_at`,`status`,`createdAt`,`updatedAt`) VALUES (DEFAULT,?,?,?,?,?);
// Executing (default): INSERT INTO `reminders` (`id`,`medication_id`,`reminder_at`,`status`,`createdAt`,`updatedAt`) VALUES (DEFAULT,?,?,?,?,?);
// weekly
// Reminder created for recurring medication: sinhaaarya15@gmail.com
// node:internal/process/promises:279
//             triggerUncaughtException(err, true /* fromPromise */);
//             ^

// Error
//     at Query.run (/home/suvarna-sinha/Documents/hospital_healthandwellness/hospital/node_modules/sequelize/lib/dialects/mysql/query.js:52:25)
//     at /home/suvarna-sinha/Documents/hospital_healthandwellness/hospital/node_modules/sequelize/lib/sequelize.js:315:28
//     at processTicksAndRejections (node:internal/process/task_queues:96:5)
//     at async MySQLQueryInterface.insert (/home/suvarna-sinha/Documents/hospital_healthandwellness/hospital/node_modules/sequelize/lib/dialects/abstract/query-interface.js:308:21)
//     at async reminder.save (/home/suvarna-sinha/Documents/hospital_healthandwellness/hospital/node_modules/sequelize/lib/model.js:2490:35)
//     at async Function.create (/home/suvarna-sinha/Documents/hospital_healthandwellness/hospital/node_modules/sequelize/lib/model.js:1362:12)
//     at async /home/suvarna-sinha/Documents/hospital_healthandwellness/hospital/controller/reminder.js:66:11 {
//   name: 'SequelizeForeignKeyConstraintError',
//   parent: Error: Cannot add or update a child row: a foreign key constraint fails (`hospitalmigration`.`reminders`, CONSTRAINT `reminders_ibfk_1` FOREIGN KEY (`medication_id`) REFERENCES `medications` (`id`) ON DELETE CASCADE ON UPDATE CASCADE)
//       at Packet.asError (/home/suvarna-sinha/Documents/hospital_healthandwellness/hospital/node_modules/mysql2/lib/packets/packet.js:728:17)
//       at Execute.execute (/home/suvarna-sinha/Documents/hospital_healthandwellness/hospital/node_modules/mysql2/lib/commands/command.js:29:26)
//       at Connection.handlePacket (/home/suvarna-sinha/Documents/hospital_healthandwellness/hospital/node_modules/mysql2/lib/connection.js:481:34)
//       at PacketParser.onPacket (/home/suvarna-sinha/Documents/hospital_healthandwellness/hospital/node_modules/mysql2/lib/connection.js:97:12)
//       at PacketParser.executeStart (/home/suvarna-sinha/Documents/hospital_healthandwellness/hospital/node_modules/mysql2/lib/packet_parser.js:75:16)
//       at Socket.<anonymous> (/home/suvarna-sinha/Documents/hospital_healthandwellness/hospital/node_modules/mysql2/lib/connection.js:104:25)
//       at Socket.emit (node:events:513:28)
//       at addChunk (node:internal/streams/readable:315:12)
//       at readableAddChunk (node:internal/streams/readable:289:9)
//       at Socket.Readable.push (node:internal/streams/readable:228:10) {
//     code: 'ER_NO_REFERENCED_ROW_2',
//     errno: 1452,
//     sqlState: '23000',
//     sqlMessage: 'Cannot add or update a child row: a foreign key constraint fails (`hospitalmigration`.`reminders`, CONSTRAINT `reminders_ibfk_1` FOREIGN KEY (`medication_id`) REFERENCES `medications` (`id`) ON DELETE CASCADE ON UPDATE CASCADE)',
//     sql: 'INSERT INTO `reminders` (`id`,`medication_id`,`reminder_at`,`status`,`createdAt`,`updatedAt`) VALUES (DEFAULT,?,?,?,?,?);',
//     parameters: [
//       10,
//       '2024-06-07 13:39:00',
//       'pending',
//       '2024-06-07 13:39:00',
//       '2024-06-07 13:39:00'
//     ]
//   },
//   original: Error: Cannot add or update a child row: a foreign key constraint fails (`hospitalmigration`.`reminders`, CONSTRAINT `reminders_ibfk_1` FOREIGN KEY (`medication_id`) REFERENCES `medications` (`id`) ON DELETE CASCADE ON UPDATE CASCADE)
//       at Packet.asError (/home/suvarna-sinha/Documents/hospital_healthandwellness/hospital/node_modules/mysql2/lib/packets/packet.js:728:17)
//       at Execute.execute (/home/suvarna-sinha/Documents/hospital_healthandwellness/hospital/node_modules/mysql2/lib/commands/command.js:29:26)
//       at Connection.handlePacket (/home/suvarna-sinha/Documents/hospital_healthandwellness/hospital/node_modules/mysql2/lib/connection.js:481:34)
//       at PacketParser.onPacket (/home/suvarna-sinha/Documents/hospital_healthandwellness/hospital/node_modules/mysql2/lib/connection.js:97:12)
//       at PacketParser.executeStart (/home/suvarna-sinha/Documents/hospital_healthandwellness/hospital/node_modules/mysql2/lib/packet_parser.js:75:16)
//       at Socket.<anonymous> (/home/suvarna-sinha/Documents/hospital_healthandwellness/hospital/node_modules/mysql2/lib/connection.js:104:25)
//       at Socket.emit (node:events:513:28)
//       at addChunk (node:internal/streams/readable:315:12)
//       at readableAddChunk (node:internal/streams/readable:289:9)
//       at Socket.Readable.push (node:internal/streams/readable:228:10) {
//     code: 'ER_NO_REFERENCED_ROW_2',
//     errno: 1452,
//     sqlState: '23000',
//     sqlMessage: 'Cannot add or update a child row: a foreign key constraint fails (`hospitalmigration`.`reminders`, CONSTRAINT `reminders_ibfk_1` FOREIGN KEY (`medication_id`) REFERENCES `medications` (`id`) ON DELETE CASCADE ON UPDATE CASCADE)',
//     sql: 'INSERT INTO `reminders` (`id`,`medication_id`,`reminder_at`,`status`,`createdAt`,`updatedAt`) VALUES (DEFAULT,?,?,?,?,?);',
//     parameters: [
//       10,
//       '2024-06-07 13:39:00',
//       'pending',
//       '2024-06-07 13:39:00',
//       '2024-06-07 13:39:00'
//     ]
//   },
//   sql: 'INSERT INTO `reminders` (`id`,`medication_id`,`reminder_at`,`status`,`createdAt`,`updatedAt`) VALUES (DEFAULT,?,?,?,?,?);',
//   parameters: [
//     10,
//     '2024-06-07 13:39:00',
//     'pending',
//     '2024-06-07 13:39:00',
//     '2024-06-07 13:39:00'
//   ],
//   table: 'medications',
//   fields: [ 'medication_id' ],
//   value: 10,
//   index: 'reminders_ibfk_1',
//   reltype: 'child'
// }
// [nodemon] app crashed - waiting for file changes before starting...
