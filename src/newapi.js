///http://localhost:5000/api/auth/register//   
// {
//   "name": "New Client",
//   "email": "newclient@gmail.com",
//   "password": "123456",
//   "role": "client",
//   "phone": "9876543210"
// }
// {
    // "success": true,
    // "message": "Registration successful",
    // "user": {
    //     "id": "6aa521fd3221e023488c0c5d",
    //     "name": "New Client",
    //     "email": "newclient@gmail.com",
    //     "role": "client"
    // },
    // "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjZhYTUyMWZkMzIyMWUwMjM0ODhjMGM1ZCIsInJvbGUiOiJjbGllbnQiLCJpYXQiOjE3ODkyMDcwMzcsImV4cCI6MTc5MTc5OTAzN30.JsbBonoRXATdTR8afRDmGRt6-T9sHOADJZS1h9711iY"
// }
{
    "success": true,
    "message": "Registration successful",
    "user": {
        "id": "6aa5a4ffed20080b648c8671",
        "name": "New Test Client",
        "email": "newtestclient@gmail.com",
        "role": "client"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjZhYTVhNGZmZWQyMDA4MGI2NDhjODY3MSIsInJvbGUiOiJjbGllbnQiLCJpYXQiOjE3ODkyNDA1NzUsImV4cCI6MTc5MTgzMjU3NX0.-fMpzxHVhz1wd1bdFqcO9t63YX_eQnt80ZOxOkWMvio"
}

// freelancer account   register

 post http://localhost:5000/api/auth/register

 {
  "name": "Test Freelancer",
  "email": "testfreelancer@gmail.com",
  "password": "123456",
  "role": "freelancer",
  "phone": "9876543210"
}


{
    "success": true,
    "message": "Registration successful",
    "user": {
        "id": "6aa5311dc1e6df678d044e1c",
        "name": "Test Freelancer",
        "email": "testfreelancer@gmail.com",
        "role": "freelancer"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjZhYTUzMTFkYzFlNmRmNjc4ZDA0NGUxYyIsInJvbGUiOiJmcmVlbGFuY2VyIiwiaWF0IjoxNzg5MjEwOTA5LCJleHAiOjE3OTE4MDI5MDl9.DUTLHaezLiLBVS0xad6MzmrOzgtPmvQBBrAseM90B94"
}

//  freelancer login 
   post http://localhost:5000/api/auth/login

   {
  "email": "testfreelancer@gmail.com",
  "password": "123456"
}
{
    "success": true,
    "message": "Login successful",
    "user": {
        "id": "6aa5311dc1e6df678d044e1c",
        "name": "Test Freelancer",
        "email": "testfreelancer@gmail.com",
        "role": "freelancer"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjZhYTUzMTFkYzFlNmRmNjc4ZDA0NGUxYyIsInJvbGUiOiJmcmVlbGFuY2VyIiwiaWF0IjoxNzg5MjExMDI3LCJleHAiOjE3OTE4MDMwMjd9.P0ja8fhrIQfBCm1b26LN7mn1vfvOgstC9sFeiBDxCzU"
}


Freelancer Application Test
  post http://localhost:5000/api/applications/project/6aa1a61240ed79554a653019

{
  "proposal": "I can build this MERN e-commerce project with a modern responsive UI. I have experience with React.js, Node.js, Express.js and MongoDB.",
  "bidAmount": 12000
}

{
    "success": true,
    "message": "Application submitted successfully",
    "application": {
        "project": "6aa1a61240ed79554a653019",
        "freelancer": "6aa1b3ee51b13ae926cc8409",
        "proposal": "I can build this MERN e-commerce project with a modern responsive UI. I have experience with React.js, Node.js, Express.js and MongoDB.",
        "bidAmount": 12000,
        "status": "pending",
        "_id": "6aa5321cbac20b5158960ab4",
        "createdAt": "2026-09-12T11:06:04.530Z",
        "updatedAt": "2026-09-12T11:06:04.530Z",
        "__v": 0
    }
}
Next Step — My Applications GET API
http://localhost:5000/api/applications/my



// review
post http://localhost:5000/api/reviews/project/6aa1a5fb138cd76a5e0cdc45


{
  "reviewee": "6aa1a5fb138cd76a5e0cdc45",
  "rating": 5,
  "comment": "Excellent work. The project was completed successfully."
}


{
    "success": true,
    "message": "Review submitted successfully",
    "review": {
        "project": "6aa1a5fb138cd76a5e0cdc45",
        "reviewer": "6aa521fd3221e023488c0c5d",
        "reviewee": "6aa1a5fb138cd76a5e0cdc45",
        "rating": 5,
        "comment": "Excellent work. The project was completed successfully.",
        "_id": "6aa6e3138024d9897263d482",
        "createdAt": "2026-09-13T17:53:23.673Z",
        "updatedAt": "2026-09-13T17:53:23.673Z",
        "__v": 0
    }
}


   get http://localhost:5000/api/reviews/user/6aa1a5fb138cd76a5e0cdc45

   {
  "reviewee": "6aa1a5fb138cd76a5e0cdc45",
  "rating": 5,
  "comment": "Excellent work. The project was completed successfully."
}


{
    "success": true,
    "count": 1,
    "reviews": [
        {
            "_id": "6aa6e3138024d9897263d482",
            "project": {
                "_id": "6aa1a5fb138cd76a5e0cdc45",
                "title": "E-Commerce Website"
            },
            "reviewer": {
                "_id": "6aa521fd3221e023488c0c5d",
                "name": "New Client",
                "profileImage": ""
            },
            "reviewee": "6aa1a5fb138cd76a5e0cdc45",
            "rating": 5,
            "comment": "Excellent work. The project was completed successfully.",
            "createdAt": "2026-09-13T17:53:23.673Z",
            "updatedAt": "2026-09-13T17:53:23.673Z",
            "__v": 0
        }
    ]
}



project
   get http://localhost:5000/api/projects/6aa1a5fb138cd76a5e0cdc45

{
    "success": true,
    "project": {
        "_id": "6aa1a5fb138cd76a5e0cdc45",
        "client": {
            "_id": "6aa1c42551b13ae926cc840b",
            "name": "Test Client",
            "email": "testclient@gmail.com",
            "profileImage": ""
        },
        "title": "E-Commerce Website",
        "description": "Build a modern e-commerce website using MERN Stack",
        "skills": [
            "React.js",
            "Node.js",
            "Express.js",
            "MongoDB"
        ],
        "category": "Web Development",
        "budget": 15000,
        "deadline": "2026-10-30T00:00:00.000Z",
        "status": "completed",
        "selectedFreelancer": null,
        "createdAt": "2026-09-09T18:31:23.148Z",
        "updatedAt": "2026-09-10T05:43:53.056Z",
        "__v": 0
    }
}

  post http://localhost:5000/api/auth/login

  {
    "success": true,
    "message": "Login successful",
    "user": {
        "id": "6aa5311dc1e6df678d044e1c",
        "name": "Test Freelancer",
        "email": "testfreelancer@gmail.com",
        "role": "freelancer"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjZhYTUzMTFkYzFlNmRmNjc4ZDA0NGUxYyIsInJvbGUiOiJmcmVlbGFuY2VyIiwiaWF0IjoxNzg5MzI2MDUxLCJleHAiOjE3OTE5MTgwNTF9.sUClzbc16fY1Lp8bf9LIq1qi-84TJQBokVmLecf0DtA"
}



appication 


get http://localhost:5000/api/applications/my


{
    "success": true,
    "count": 1,
    "applications": [
        {
            "_id": "6aa6f37457f9e4c2b4a52dd9",
            "project": {
                "_id": "6aa1a61240ed79554a653019",
                "client": {
                    "_id": "6aa1a484138cd76a5e0cdc44",
                    "name": "Client User",
                    "email": "client@gmail.com"
                },
                "title": "E-Commerce Website",
                "description": "Build a modern e-commerce website using MERN Stack",
                "skills": [
                    "React.js",
                    "Node.js",
                    "Express.js",
                    "MongoDB"
                ],
                "category": "Web Development",
                "budget": 15000,
                "deadline": "2026-10-30T00:00:00.000Z",
                "status": "open",
                "selectedFreelancer": null,
                "createdAt": "2026-09-09T18:31:46.703Z",
                "updatedAt": "2026-09-09T18:31:46.703Z",
                "__v": 0
            },
            "freelancer": "6aa5311dc1e6df678d044e1c",
            "proposal": "I can build this MERN E-Commerce Website with React.js, Node.js, Express.js and MongoDB.",
            "bidAmount": 12000,
            "status": "pending",
            "createdAt": "2026-09-13T19:03:16.146Z",
            "updatedAt": "2026-09-13T19:03:16.146Z",
            "__v": 0
        }
    ]
}



  post http://localhost:5000/api/applications/project/6aa1a61240ed79554a653019

  {
    "success": true,
    "message": "Application submitted successfully",
    "application": {
        "project": "6aa1a61240ed79554a653019",
        "freelancer": "6aa5311dc1e6df678d044e1c",
        "proposal": "I can build this MERN E-Commerce Website with React.js, Node.js, Express.js and MongoDB.",
        "bidAmount": 12000,
        "status": "pending",
        "_id": "6aa6f37457f9e4c2b4a52dd9",
        "createdAt": "2026-09-13T19:03:16.146Z",
        "updatedAt": "2026-09-13T19:03:16.146Z",
        "__v": 0
    }
}


//  post http://localhost:5000/api/messages/send

// {
    "success": true,
    "message": "Message sent successfully",
    "data": {
        "_id": "6aa7d0d1c84972a809d698d8",
        "sender": {
            "_id": "6aa5311dc1e6df678d044e1c",
            "name": "Test Freelancer",
            "email": "testfreelancer@gmail.com",
            "role": "freelancer"
        },
        "receiver": {
            "_id": "6aa5a4ffed20080b648c8671",
            "name": "New Test Client",
            "email": "newtestclient@gmail.com",
            "role": "client"
        },
        "message": "Hello, how is the project going?",
        "isRead": false,
        "createdAt": "2026-09-14T10:47:45.017Z",
        "updatedAt": "2026-09-14T10:47:45.017Z",
        "__v": 0
    }
}

















// get http://localhost:5000/api/messages/conversation/6aa5a4ffed20080b648c8671
{
    "success": true,
    "count": 1,
    "data": [
        {
            "_id": "6aa7d0d1c84972a809d698d8",
            "sender": {
                "_id": "6aa5311dc1e6df678d044e1c",
                "name": "Test Freelancer",
                "email": "testfreelancer@gmail.com",
                "role": "freelancer"
            },
            "receiver": {
                "_id": "6aa5a4ffed20080b648c8671",
                "name": "New Test Client",
                "email": "newtestclient@gmail.com",
                "role": "client"
            },
            "message": "Hello, how is the project going?",
            "isRead": false,
            "createdAt": "2026-09-14T10:47:45.017Z",
            "updatedAt": "2026-09-14T10:47:45.017Z",
            "__v": 0
        }
    ]
}









// freelancer


 post http://localhost:5000/api/auth/login

{
    "success": true,
    "message": "Login successful",
    "user": {
        "id": "6aa5311dc1e6df678d044e1c",
        "name": "Test Freelancer",
        "email": "testfreelancer@gmail.com",
        "role": "freelancer"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjZhYTUzMTFkYzFlNmRmNjc4ZDA0NGUxYyIsInJvbGUiOiJmcmVlbGFuY2VyIiwiaWF0IjoxNzg5NDA4NTAzLCJleHAiOjE3OTIwMDA1MDN9.qb1mdiXikINy2dF3NnODLtakTz5G9v_N-oKLkKRjwY4"
}





















   post http://localhost:5000/api/applications/project/6aa8347316f6f05c37c44089

{
    "success": true,
    "message": "Application submitted successfully",
    "application": {
        "project": "6aa8347316f6f05c37c44089",
        "freelancer": "6aa5311dc1e6df678d044e1c",
        "proposal": "I can build this professional MERN portfolio website using React.js, Node.js, Express.js and MongoDB.",
        "bidAmount": 9000,
        "status": "pending",
        "_id": "6aa835b516f6f05c37c4408a",
        "createdAt": "2026-09-14T17:58:13.551Z",
        "updatedAt": "2026-09-14T17:58:13.551Z",
        "__v": 0
    }
}

// client notification 













get http://localhost:5000/api/notifications
{
    "success": true,
    "count": 1,
    "notifications": [
        {
            "_id": "6aa835b516f6f05c37c4408b",
            "user": "6aa5a4ffed20080b648c8671",
            "message": "A freelancer has applied for your project \"Portfolio Website\".",
            "type": "proposal",
            "isRead": false,
            "createdAt": "2026-09-14T17:58:13.555Z",
            "updatedAt": "2026-09-14T17:58:13.555Z",
            "__v": 0
        }
    ]
}

// update
put http://localhost:5000/api/notifications/6aa835b516f6f05c37c4408b/read
{
    "success": true,
    "message": "Notification marked as read",
    "notification": {
        "_id": "6aa835b516f6f05c37c4408b",
        "user": "6aa5a4ffed20080b648c8671",
        "message": "A freelancer has applied for your project \"Portfolio Website\".",
        "type": "proposal",
        "isRead": true,
        "createdAt": "2026-09-14T17:58:13.555Z",
        "updatedAt": "2026-09-14T18:08:19.556Z",
        "__v": 0
    }
}
// all
put http://localhost:5000/api/notifications/read-all










































post http://localhost:5000/api/auth/register

{
    "success": true,
    "message": "Registration successful",
    "user": {
        "id": "6aa848d016f6f05c37c4408c",
        "name": "Admin User",
        "email": "adminnew@gmail.com",
        "role": "client"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjZhYTg0OGQwMTZmNmYwNWMzN2M0NDA4YyIsInJvbGUiOiJjbGllbnQiLCJpYXQiOjE3ODk0MTM1ODQsImV4cCI6MTc5MjAwNTU4NH0.meT8g5eYKN_3016WqryKa-F2veHB-P1XOIq_RAgEojw"
}







login 
post http://localhost:5000/api/auth/login
{
    "success": true,
    "message": "Login successful",
    "user": {
        "id": "6aa848d016f6f05c37c4408c",
        "name": "Admin User",
        "email": "adminnew@gmail.com",
        "role": "admin"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjZhYTg0OGQwMTZmNmYwNWMzN2M0NDA4YyIsInJvbGUiOiJhZG1pbiIsImlhdCI6MTc4OTQxMzc1NSwiZXhwIjoxNzkyMDA1NzU1fQ.9RBmz2r5-VhaIvNrRtRii9NxIU8_5lg409L5_cpK-f8"
}









login token 

GET http://localhost:5000/api/admin/users
  eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjZhYTg0OGQwMTZmNmYwNWMzN2M0NDA4YyIsInJvbGUiOiJhZG1pbiIsImlhdCI6MTc4OTQxMzc1NSwiZXhwIjoxNzkyMDA1NzU1fQ.9RBmz2r5-VhaIvNrRtRii9NxIU8_5lg409L5_cpK-f8

  {
    "success": true,
    "dashboard": {
        "totalUsers": 15,
        "totalClients": 6,
        "totalFreelancers": 6,
        "totalProjects": 4,
        "openProjects": 3,
        "completedProjects": 1,
        "totalProposals": 1
    }
}















admin


get http://localhost:5000/api/admin/users

{
    "success": true,
    "users": [
        {
            "_id": "6aa848d016f6f05c37c4408c",
            "name": "Admin User",
            "email": "adminnew@gmail.com",
            "role": "admin",
            "phone": "",
            "bio": "",
            "skills": [],
            "profileImage": "",
            "portfolio": [],
            "isActive": true,
            "createdAt": "2026-09-14T19:19:44.532Z",
            "updatedAt": "2026-09-14T19:19:44.532Z",
            "__v": 0
        },
        {
            "_id": "6aa5a4ffed20080b648c8671",
            "name": "New Test Client",
            "email": "newtestclient@gmail.com",
            "role": "client",
            "phone": "",
            "bio": "",
            "skills": [],
            "profileImage": "",
            "portfolio": [],
            "isActive": true,
            "createdAt": "2026-09-12T19:16:15.027Z",
            "updatedAt": "2026-09-12T19:16:15.027Z",
            "__v": 0
        },
        {
            "_id": "6aa5311dc1e6df678d044e1c",
            "name": "Test Freelancer",
            "email": "testfreelancer@gmail.com",
            "role": "freelancer",
            "phone": "9876543210",
            "bio": "",
            "skills": [],
            "profileImage": "",
            "portfolio": [],
            "isActive": true,
            "createdAt": "2026-09-12T11:01:49.919Z",
            "updatedAt": "2026-09-12T11:01:49.919Z",
            "__v": 0
        },
        {
            "_id": "6aa521fd3221e023488c0c5d",
            "name": "New Client",
            "email": "newclient@gmail.com",
            "role": "client",
            "phone": "9876543210",
            "bio": "",
            "skills": [],
            "profileImage": "",
            "portfolio": [],
            "isActive": true,
            "createdAt": "2026-09-12T09:57:17.465Z",
            "updatedAt": "2026-09-12T09:57:17.465Z",
            "__v": 0
        },
        {
            "_id": "6aa2f24ceaa335c11dd37ada",
            "name": "tre",
            "email": "priy906@gmail.com",
            "role": "client",
            "phone": "",
            "bio": "",
            "skills": [],
            "profileImage": "",
            "portfolio": [],
            "isActive": true,
            "createdAt": "2026-09-10T18:09:16.218Z",
            "updatedAt": "2026-09-10T18:09:16.218Z",
            "__v": 0
        },
        {
            "_id": "6aa2f217eaa335c11dd37ad9",
            "name": "priya",
            "email": "priyampriya1906@gmail.com",
            "role": "freelancer",
            "phone": "",
            "bio": "",
            "skills": [],
            "profileImage": "",
            "portfolio": [],
            "isActive": true,
            "createdAt": "2026-09-10T18:08:23.789Z",
            "updatedAt": "2026-09-10T18:08:23.789Z",
            "__v": 0
        },
        {
            "_id": "6aa264f38d5113fbf9626e83",
            "name": "Test Client",
            "email": "testclient123@gmail.com",
            "role": "client",
            "phone": "",
            "bio": "",
            "skills": [],
            "profileImage": "",
            "portfolio": [],
            "isActive": true,
            "createdAt": "2026-09-10T08:06:11.242Z",
            "updatedAt": "2026-09-10T08:06:11.242Z",
            "__v": 0
        },
        {
            "_id": "6aa25d21a7db02c561c4b95a",
            "name": "sharikTest Freelancer",
            "email": "shariktest123@gmail.com",
            "role": "freelancer",
            "phone": "",
            "bio": "",
            "skills": [],
            "profileImage": "",
            "portfolio": [],
            "isActive": true,
            "createdAt": "2026-09-10T07:32:49.877Z",
            "updatedAt": "2026-09-10T07:32:49.877Z",
            "__v": 0
        },
        {
            "_id": "6aa24b81ca02a387458759d6",
            "name": "Admin User",
            "email": "admin@gmail.com",
            "role": "admin",
            "phone": "",
            "bio": "",
            "skills": [],
            "profileImage": "",
            "portfolio": [],
            "isActive": true,
            "createdAt": "2026-09-10T06:17:37.180Z",
            "updatedAt": "2026-09-10T06:17:37.180Z",
            "__v": 0
        },
        {
            "_id": "6aa1c42551b13ae926cc840b",
            "name": "Test Client",
            "email": "testclient@gmail.com",
            "role": "admin",
            "phone": "",
            "bio": "",
            "skills": [],
            "profileImage": "",
            "portfolio": [],
            "isActive": true,
            "createdAt": "2026-09-09T20:40:05.800Z",
            "updatedAt": "2026-09-09T20:40:05.800Z",
            "__v": 0
        },
        {
            "_id": "6aa1b3ee51b13ae926cc8409",
            "name": "Priya Freelancer",
            "email": "priyafreelancer@gmail.com",
            "role": "freelancer",
            "phone": "",
            "bio": "",
            "skills": [],
            "profileImage": "",
            "portfolio": [],
            "isActive": true,
            "createdAt": "2026-09-09T19:30:54.760Z",
            "updatedAt": "2026-09-09T19:30:54.760Z",
            "__v": 0
        },
        {
            "_id": "6aa1a484138cd76a5e0cdc44",
            "name": "Client User",
            "email": "client@gmail.com",
            "role": "client",
            "phone": "",
            "bio": "",
            "skills": [],
            "profileImage": "",
            "portfolio": [],
            "isActive": true,
            "createdAt": "2026-09-09T18:25:08.716Z",
            "updatedAt": "2026-09-09T18:25:08.716Z",
            "__v": 0
        },
        {
            "_id": "6aa19c218c54891e645a79fc",
            "name": "Rahul Client",
            "email": "rahulclient@gmail.com",
            "role": "client",
            "phone": "",
            "bio": "",
            "skills": [],
            "profileImage": "",
            "portfolio": [],
            "isActive": true,
            "createdAt": "2026-09-09T17:49:21.744Z",
            "updatedAt": "2026-09-09T17:49:21.744Z",
            "__v": 0
        },
        {
            "_id": "6aa1985c8c54891e645a79fb",
            "name": "zara",
            "email": "zara12@gmail.com",
            "role": "freelancer",
            "phone": "9876543210",
            "bio": "MERN Stack Developer",
            "skills": [
                "React.js",
                "Node.js",
                "Express.js",
                "MongoDB"
            ],
            "profileImage": "",
            "portfolio": [],
            "isActive": true,
            "createdAt": "2026-09-09T17:33:16.768Z",
            "updatedAt": "2026-09-09T17:45:48.345Z",
            "__v": 1
        },
        {
            "phone": "",
            "portfolio": [],
            "isActive": true,
            "_id": "6aa16412efb6fa778122f097",
            "name": "Priya",
            "email": "priya@gmail.com",
            "role": "freelancer",
            "skills": [],
            "bio": "",
            "profileImage": "",
            "createdAt": "2026-09-09T13:50:10.039Z",
            "updatedAt": "2026-09-09T13:50:10.039Z",
            "__v": 0
        }
    ]
}




freelamcer
post  http://localhost:5000/api/auth/register

{
  "name": "Dashboard Freelancer",
  "email": "dashboardfreelancer@gmail.com",
  "phone": "9876543210",
  "password": "Freelancer@123",
  "role": "freelancer"
}
{
    "success": true,
    "message": "Registration successful",
    "user": {
        "id": "6aa8eea894f90ee1a5b9fa3c",
        "name": "Dashboard Freelancer",
        "email": "dashboardfreelancer@gmail.com",
        "role": "freelancer"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjZhYThlZWE4OTRmOTBlZTFhNWI5ZmEzYyIsInJvbGUiOiJmcmVlbGFuY2VyIiwiaWF0IjoxNzg5NDU2MDQwLCJleHAiOjE3OTIwNDgwNDB9.0402lY9tYn8dC91Q3NM-D4tTS5651_omgPL89sh-3cQ"
}






payment

get http://localhost:5000/api/projects/6aa8347316f6f05c37c44089
{
    "success": true,
    "project": {
        "_id": "6aa8347316f6f05c37c44089",
        "client": {
            "_id": "6aa5a4ffed20080b648c8671",
            "name": "New Test Client",
            "email": "newtestclient@gmail.com",
            "profileImage": ""
        },
        "title": "Portfolio Website",
        "description": "Build a professional portfolio website using MERN Stack",
        "skills": [
            "React.js",
            "Node.js",
            "MongoDB"
        ],
        "category": "Web Development",
        "budget": 10000,
        "deadline": "2026-10-30T00:00:00.000Z",
        "status": "open",
        "selectedFreelancer": null,
        "createdAt": "2026-09-14T17:52:52.008Z",
        "updatedAt": "2026-09-14T17:52:52.008Z",
        "__v": 0
    }
}



// freelancer 





















GET http://localhost:5000/api/users/freelancers



{
  "email": "testfreelancer@gmail.com",
  "password": "123456"
}

{
    "success": true,
    "count": 6,
    "freelancers": [
        {
            "id": "6aa8eea894f90ee1a5b9fa3c",
            "name": "Dashboard Freelancer",
            "email": "dashboardfreelancer@gmail.com",
            "role": "freelancer",
            "bio": "",
            "skills": [],
            "profileImage": "",
            "portfolio": [],
            "rating": 0,
            "reviews": 0,
            "completedJobs": 0,
            "experience": "",
            "rate": null,
            "location": ""
        },
        {
            "id": "6aa5311dc1e6df678d044e1c",
            "name": "Test Freelancer",
            "email": "testfreelancer@gmail.com",
            "role": "freelancer",
            "bio": "",
            "skills": [],
            "profileImage": "",
            "portfolio": [],
            "rating": 0,
            "reviews": 0,
            "completedJobs": 0,
            "experience": "",
            "rate": null,
            "location": ""
        },
        {
            "id": "6aa2f217eaa335c11dd37ad9",
            "name": "priya",
            "email": "priyampriya1906@gmail.com",
            "role": "freelancer",
            "bio": "",
            "skills": [],
            "profileImage": "",
            "portfolio": [],
            "rating": 0,
            "reviews": 0,
            "completedJobs": 0,
            "experience": "",
            "rate": null,
            "location": ""
        },
        {
            "id": "6aa25d21a7db02c561c4b95a",
            "name": "sharikTest Freelancer",
            "email": "shariktest123@gmail.com",
            "role": "freelancer",
            "bio": "",
            "skills": [],
            "profileImage": "",
            "portfolio": [],
            "rating": 0,
            "reviews": 0,
            "completedJobs": 0,
            "experience": "",
            "rate": null,
            "location": ""
        },
        {
            "id": "6aa1b3ee51b13ae926cc8409",
            "name": "Priya Freelancer",
            "email": "priyafreelancer@gmail.com",
            "role": "freelancer",
            "bio": "",
            "skills": [],
            "profileImage": "",
            "portfolio": [],
            "rating": 0,
            "reviews": 0,
            "completedJobs": 0,
            "experience": "",
            "rate": null,
            "location": ""
        },
        {
            "id": "6aa1985c8c54891e645a79fb",
            "name": "zara",
            "email": "zara12@gmail.com",
            "role": "freelancer",
            "bio": "MERN Stack Developer",
            "skills": [
                "React.js",
                "Node.js",
                "Express.js",
                "MongoDB"
            ],
            "profileImage": "",
            "portfolio": [],
            "rating": 0,
            "reviews": 0,
            "completedJobs": 0,
            "experience": "",
            "rate": null,
            "location": ""
        }
    ]
}