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