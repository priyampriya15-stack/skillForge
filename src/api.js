

//    auth
// POST http://localhost:5000/api/auth/register
// POST http://localhost:5000/api/auth/login
// GET  http://localhost:5000/api/auth/me
// post http://localhost:5000/api/auth/register
//  token eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjZhYTI0YjgxY2EwMmEzODc0NTg3NTlkNiIsInJvbGUiOiJhZG1pbiIsImlhdCI6MTc4OTAyMTA1NywiZXhwIjoxNzkxNjEzMDU3fQ.j9WPGeTntlz07eRayI_pd7O51scBU97ZspypDEZ4r0c
// post http://localhost:5000/api/auth/login
// eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjZhYTI0YjgxY2EwMmEzODc0NTg3NTlkNiIsInJvbGUiOiJhZG1pbiIsImlhdCI6MTc4OTAyMTE4OSwiZXhwIjoxNzkxNjEzMTg5fQ.lm5bF9UL6RCyh7iF7vxaGaiQ-mQ-LFuBSTlV4NO6IOE

// get  http://localhost:5000/api/admin/dashboard
// get http://localhost:5000/api/admin/users

// post  http://localhost:5000/api/auth/register
// {
//     "success": true,
//     "message": "Registration successful",
//     "user": {
//         "id": "6aa25d21a7db02c561c4b95a",
//         "name": "sharikTest Freelancer",
//         "email": "shariktest123@gmail.com",
//         "role": "freelancer"
//     },
//     "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjZhYTI1ZDIxYTdkYjAyYzU2MWM0Yjk1YSIsInJvbGUiOiJmcmVlbGFuY2VyIiwiaWF0IjoxNzg5MDI1NTY5LCJleHAiOjE3OTE2MTc1Njl9.XBew8WU4CchvaeEzUWNC7CIoIonYPTw2Lg_UQqonSgE"
// }


// users
// GET http://localhost:5000/api/users/profile
// PUT http://localhost:5000/api/users/profile

//   project api 
// POST   http://localhost:5000/api/projects
// GET    http://localhost:5000/api/projects
// GET    http://localhost:5000/api/projects/PROJECT_ID
// PUT    http://localhost:5000/api/projects/PROJECT_ID
// DELETE http://localhost:5000/api/projects/PROJECT_ID

//  put http://localhost:5000/api/projects/6aa1a5fb138cd76a5e0cdc45

//   proposal 
// POST http://localhost:5000/api/proposals/project/PROJECT_ID

// GET http://localhost:5000/api/proposals/project/PROJECT_ID

// PUT http://localhost:5000/api/proposals/PROPOSAL_ID/shortlist

// PUT http://localhost:5000/api/proposals/PROPOSAL_ID/accept


//  milestone 
// post http://localhost:5000/api/milestones/project/6aa1a5fb138cd76a5e0cdc45
// get http://localhost:5000/api/milestones/project/6aa1a5fb138cd76a5e0cdc45
// put http://localhost:5000/api/milestones/6aa23f0a8949cd8a9e1f17f0



//  review 
//  post http://localhost:5000/api/reviews/project/6aa1a5fb138cd76a5e0cdc45
//  get http://localhost:5000/api/reviews/user/6aa1b3ee51b13ae926cc8409


// notification 
//   get http://localhost:5000/api/notifications


// application 
//  post http://localhost:5000/api/applications/project/6aa1a61240ed79554a653019
// {
//     "success": true,
//     "message": "Application submitted successfully",
//     "application": {
//         "project": "6aa1a61240ed79554a653019",
//         "freelancer": "6aa25d21a7db02c561c4b95a",
//         "proposal": "I can develop this modern E-Commerce Website using React.js, Node.js, Express.js and MongoDB.",
//         "bidAmount": 12000,
//         "status": "pending",
//         "_id": "6aa25df04331932f2791fb5f",
//         "createdAt": "2026-09-10T07:36:16.948Z",
//         "updatedAt": "2026-09-10T07:36:16.948Z",
//         "__v": 0
//     }
// }



//  get http://localhost:5000/api/applications/my

// {
//     "success": true,
//     "count": 1,
//     "applications": [
//         {
//             "_id": "6aa25df04331932f2791fb5f",
//             "project": {
//                 "_id": "6aa1a61240ed79554a653019",
//                 "client": "6aa1a484138cd76a5e0cdc44",
//                 "title": "E-Commerce Website",
//                 "description": "Build a modern e-commerce website using MERN Stack",
//                 "skills": [
//                     "React.js",
//                     "Node.js",
//                     "Express.js",
//                     "MongoDB"
//                 ],
//                 "category": "Web Development",
//                 "budget": 15000,
//                 "deadline": "2026-10-30T00:00:00.000Z",
//                 "status": "open",
//                 "selectedFreelancer": null,
//                 "createdAt": "2026-09-09T18:31:46.703Z",
//                 "updatedAt": "2026-09-09T18:31:46.703Z",
//                 "__v": 0
//             },
//             "freelancer": "6aa25d21a7db02c561c4b95a",
//             "proposal": "I can develop this modern E-Commerce Website using React.js, Node.js, Express.js and MongoDB.",
//             "bidAmount": 12000,
//             "status": "pending",
//             "createdAt": "2026-09-10T07:36:16.948Z",
//             "updatedAt": "2026-09-10T07:36:16.948Z",
//             "__v": 0
//         }
//     ]
// }



// 
    //   post http://localhost:5000/api/auth/register

// {  
//     "success": true,
//     "message": "Registration successful",
//     "user": {
//         "id": "6aa264f38d5113fbf9626e83",
//         "name": "Test Client",
//         "email": "testclient123@gmail.com",
//         "role": "client"
//     },
//     "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjZhYTI2NGYzOGQ1MTEzZmJmOTYyNmU4MyIsInJvbGUiOiJjbGllbnQiLCJpYXQiOjE3ODkwMjc1NzEsImV4cCI6MTc5MTYxOTU3MX0.Bm7ryG54pln80lnzLpLrqoqewE5_7uk_adjpD2XkWJY"
// }
// 

// email 
// post http://localhost:5000/api/email/test-email


// mail 
// post http://localhost:5000/api/applications/project/6aa1a61240ed79554a653019

//  get  http://localhost:5000/api/applications/my
// {
    // "success": true,
    // "count": 1,
    // "applications": [
    //     {
    //         "_id": "6aa25df04331932f2791fb5f",
    //         "project": {
    //             "_id": "6aa1a61240ed79554a653019",
    //             "client": "6aa1a484138cd76a5e0cdc44",
    //             "title": "E-Commerce Website",
    //             "description": "Build a modern e-commerce website using MERN Stack",
    //             "skills": [
    //                 "React.js",
    //                 "Node.js",
    //                 "Express.js",
    //                 "MongoDB"
    //             ],
    //             "category": "Web Development",
    //             "budget": 15000,
    //             "deadline": "2026-10-30T00:00:00.000Z",
    //             "status": "open",
    //             "selectedFreelancer": null,
    //             "createdAt": "2026-09-09T18:31:46.703Z",
    //             "updatedAt": "2026-09-09T18:31:46.703Z",
    //             "__v": 0
//             },
//             "freelancer": "6aa25d21a7db02c561c4b95a",
//             "proposal": "I can develop this modern E-Commerce Website using React.js, Node.js, Express.js and MongoDB.",
//             "bidAmount": 12000,
//             "status": "pending",
//             "createdAt": "2026-09-10T07:36:16.948Z",
//             "updatedAt": "2026-09-10T07:36:16.948Z",
//             "__v": 0
//         }
//     ]
// }
// 

// notification 
// get http://localhost:5000/api/notifications




// milestone 
//get  http://localhost:5000/api/milestones/project/6aa1a61240ed79554a653019



// file
// post http://localhost:5000/api/files/upload