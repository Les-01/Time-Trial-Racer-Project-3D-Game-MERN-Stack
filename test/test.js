const chai = require("chai");
const chaiHttp = require("chai-http");
const { app } = require("../Final Year Project/backend/server");
const highScoreRouter = require("../Final Year Project/backend/routes/highScore");
const userRouter = require("../Final Year Project/backend/routes/users");
chai.use(chaiHttp);
// This requires 'bcrypt' then sets it as the value of the variable 'bcrypt'.
const bcrypt = require('bcrypt')
const sinon = require('sinon');
// This requires the functions 'checkEmptyFields', 'checkValidEmail', 'checkStrongPassword', 'checkEmailExists', 'checkEmptyEmailAndPassword', 'checkUserExists', 'comparePasswords', from the 'validationModel' file
// then assigns each funtion to a variable of the same name.
const {checkEmptyFields, checkValidEmail, checkStrongPassword, checkEmailExists, checkEmptyEmailAndPassword, checkUserExists, comparePasswords} = require('../Final Year Project/backend/models/validationModel');

// -----------------------------------  Intergration Tests  ----------------------------------- //
// This is the JSON Web Token confirming the users authorisation to access the server.
const jwtAuthorisationToken = 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NWE5NTg1NDY2ODU2M2UxYjc4ODlkZGQiLCJpYXQiOjE3MDU4NTE4MDEsImV4cCI6MTcxNDQ5MTgwMX0.LrtY-IvETDmCSJ72m-ddgOGk6Zw4cOKmWTI4TQqwdxg'

// This is the payload for the create highScore test.
const createHighScorePayload = {
  userName: "Create HighScore Test",
  score: 10,
  user_id: "65a95854668563e1b7889ddd",
  email: "alan@alderson.com"
};
// This is the object ID of the object in the database to be deleted in the delete highScore test.
const deleteHighScoreId = "65ad4877749d0ac99735cc48"
// This is the object ID of the object in the database to be updated in the update highScore test.
const updateHighScoreId = "65ad440d4a0d246b72bd51fb"
// This is the object ID of the object in the database to be updated in the ADMIN update user test.
const updateUserId = "65ad3b6231029b94b2e550dc"
// This is the object ID of the object in the database to be deleted in the ADMIN delete user test.
const deleteUserId = "65ad4bb8d0ba1e00423defec"
// This is the payload for the update highScore test.
const updateHighScorePayload = {
  userName: "Update HighScore Test",
  score: 10,
  user_id: "65a95854668563e1b7889ddd",
  email: "alan@alderson.com"
};

const updateUserPayload = {
  userName: "Test Admin Update User",
  email: "testadminuser@update.com",
  password: "TestAdminUserUpdate01!",
  rank: "user" 
};

// This is the payload for the create new user test.
const signupUserPayload = {
  userName: "Test User Signup",
  email: "testuser@signup.com",
  password: "TestUserSignup01!",
  rank: "user" 
};

// This is the payload for the login user test.
const loginUserPayload = {
  email: "testuser@login.com",
  password: "TestUserLogin01!" 
};

// --------------------  Integration Test Database HighScore Creation, Read, Update and Delete Tests  -------------------- //

// This is the integration testing suite for the highScore routes.
suite("Integration tests for highScore routes (CREATE, READ, UPDATE, DELETE)", function() {  
  // C.R.U.D Create HighScore Test
  test("CREATE HighScore Test (POST /api/highScores)", function(done) {
    chai.request(app)
      .post("/api/highScores")
      .set('Authorization', jwtAuthorisationToken)
      .send(createHighScorePayload)
      .end(function(error, response) {
        chai.assert.equal(response.status, 200, "Wrong status code");
        chai.expect(response.body).to.have.property('userName').equal(createHighScorePayload.userName);
        chai.expect(response.body).to.have.property('score').equal(createHighScorePayload.score);        
        chai.expect(response.body).to.have.property('user_id').equal(createHighScorePayload.user_id);
        console.log(error)
        done();
      });
  });

  // C.R.U.D Retrieve HighScores Test
  test("READ HighScores Test (GET /api/highScores)", function(done) {
    chai.request(app)
      .get("/api/highScores/highScoreTable")
      .set('Authorization', jwtAuthorisationToken)
      .end(function(error, response) {
        chai.assert.equal(response.status, 200, "Wrong status code");
        chai.expect(response.body).to.be.an("array");
        chai.expect(response.body).to.have.length.above(0);
        // Example assertions for the GET request
        chai.expect(response.body[0]).to.have.property('userName').that.is.a('string');
        done();
      });
  });

  // C.R.U.D Update HighScore Test
  test("UPDATE HighScore Test (PATCH /api/highScores/:id)", function(done) {
    const highScoreIdToUpdate = updateHighScoreId;
    chai.request(app)
      .patch(`/api/highScores/${highScoreIdToUpdate}`)
      .set('Authorization', jwtAuthorisationToken)
      .send(updateHighScorePayload)
      .end(function(error, response) {
        chai.assert.equal(response.status, 200, "Wrong status code");
        chai.expect(response.body).to.have.property('userName').equal(updateHighScorePayload.userName);
        chai.expect(response.body).to.have.property('score').equal(updateHighScorePayload.score);        
        chai.expect(response.body).to.have.property('user_id').equal(updateHighScorePayload.user_id);
        console.log(error)
        done();
      });
  }); 

  // C.R.U.D Delete HighScore Test
  test("DELETE HighScore Test (DELETE /api/highScores/:id)", function(done) {
    const highScoreIdToDelete = deleteHighScoreId;
    chai.request(app)
      .delete(`/api/highScores/${highScoreIdToDelete}`)
      .set('Authorization', jwtAuthorisationToken)
      .end(function(error, response) {
        chai.assert.equal(response.status, 200, "Wrong status code");
        chai.expect(response.body).to.have.property('_id').equal(deleteHighScoreId);
        done();
      });
  });
});

// ---------------  Integration Test Database User Account Creation, Login and Authentication Tests  --------------- //

// This is the integration testing suite for the user routes.
suite("Integration tests for user routes (CREATE, LOGIN AND AUTHENTICATE)", function() {
  // C.R.U.D Create User Account Test
  test("CREATE New User Account Test (POST /api/signup)", function(done) {
    chai.request(app)
      .post("/api/user/signup")
      .send(signupUserPayload)
      .end(function(error, response) {
        chai.assert.equal(response.status, 200, "Wrong status code");
        chai.expect(response.body).to.have.property('userName').equal(signupUserPayload.userName);
        chai.expect(response.body).to.have.property('email').equal(signupUserPayload.email);
        console.log(error)
        done();
      });
  });

  // C.R.U.D Login User Test
  test("AUTHENTICATE User Account (Test POST /api/login)", function(done) {
    chai.request(app)
      .post("/api/user/login")
      .send(loginUserPayload)
      .end(function(error, response) {
        chai.assert.equal(response.status, 200, "Wrong status code");
        chai.expect(response.body).to.have.property('email').equal(loginUserPayload.email);
        done();
      });
  });
});

// --------------------  Integration Test ADMIN Database User account Read, Update and Delete Tests  -------------------- //
// This is the integration testing suite for the admin user routes.
suite("Integration tests for ADMIN user routes (READ, UPDATE, DELETE)", function() {  
  // C.R.U.D ADMIN Retrieve Users Test
  test("ADMIN READ Users Test (GET /api/user/admin)", function(done) {
    chai.request(app)
      .get("/api/user/admin")
      .set('Authorization', jwtAuthorisationToken)
      .end(function(error, response) {
        chai.assert.equal(response.status, 200, "Wrong status code");
        chai.expect(response.body).to.be.an("array");
        chai.expect(response.body).to.have.length.above(0);
        // Example assertions for the GET request
        chai.expect(response.body[0]).to.have.property('userName').that.is.a('string');
        done();
      });
  });

  // C.R.U.D ADMIN Update User Test
  test("ADMIN UPDATE User Test (PATCH /api/user/admin/:id)", function(done) {
    const userIdToUpdate = updateUserId;
    chai.request(app)
      .patch(`/api/user/admin/${userIdToUpdate}`)
      .set('Authorization', jwtAuthorisationToken)
      .send(updateUserPayload)
      .end(function(error, response) {
        chai.assert.equal(response.status, 200, "Wrong status code");
        chai.expect(response.body).to.have.property('userName').equal(updateUserPayload.userName);
        chai.expect(response.body).to.have.property('email').equal(updateUserPayload.email);
        chai.expect(response.body).to.have.property('password').equal(updateUserPayload.password);
        chai.expect(response.body).to.have.property('rank').equal(updateUserPayload.rank);
        done(); 
      });
  }); 

  // C.R.U.D Delete User Test
  test("ADMIN DELETE User Test (DELETE /api/user/admin/:id)", function(done) {
    const userIdToDelete = deleteUserId;
    chai.request(app)
      .delete(`/api/user/admin/${userIdToDelete}`)
      .set('Authorization', jwtAuthorisationToken)
      .end(function(error, response) {
        chai.assert.equal(response.status, 200, "Wrong status code");
        chai.expect(response.body).to.have.property('_id').equal(deleteUserId);
        done();
      });
  });
});

// -----------------------------------  Unit Tests For Signup Form Validation  ----------------------------------- //

// This is the unit testing suite for signup form validation.
suite("Unit tests for signup form validation", function() {
  // Signup Form 'checkEmptyFields' function No 'User Name' Field Filled In Test
  test("'checkEmptyFields' function should throw an error if 'User Name' field is empty", function() {
    try {
      checkEmptyFields("", "alan@alderson.com", "AlanAlderson01!");
    } catch (error) {
      chai.expect(error.message).to.equal("Please fill in all fields");
    }
  });
  // Signup Form 'checkEmptyFields' function No 'Email' Field Filled In Test
  test("'checkEmptyFields' function should throw an error for if 'Email' field is empty", function() {
    try {
      checkEmptyFields("Alan", "", "AlanAlderson01");
    } catch (error) {
      chai.expect(error.message).to.equal("Please fill in all fields");
    }
  });
  // Signup Form 'checkEmptyFields' function No 'Password' Field Filled In Test
  test("'checkEmptyFields' function should throw an error for if 'Password' field is empty", function() {
    try {
      checkEmptyFields("Alan", "alan@alderson.com", "");
    } catch (error) {
      chai.expect(error.message).to.equal("Please fill in all fields");
    }
  });
  // Signup Form 'checkEmptyFields' function All Fields Filled In Test
  test("'checkEmptyFields' should not throw an error for non-empty 'User Name', 'Email' and 'Password", function() {
    try {
      checkEmptyFields("Alan", "alan@alderson.com", "AlanAlderson01!");
    } catch (error) {
      chai.expect.fail("Should not throw an error for non-empty 'User Name', 'Email' and 'Password");
    }
  });
  // Signup Form 'checkValidEmail' function Invalid Email Format Test
  test("'checkValidEmail' function should throw an error for invalid email format", function() {
    try {
      checkValidEmail("invalid_email");
    } catch (error) {
      chai.expect(error.message).to.equal("Please use a valid email");
    }
  });
  // Signup Form 'checkStrongPassword' function Weak Password Test
  test("'checkStrongPassword' function should throw an error for weak password", function() {
    try {
      checkStrongPassword("weak");
    } catch (error) {
      chai.expect(error.message).to.equal("Please use a stronger password");
    }
  });
  // Signup Form 'checkEmailExists' function Exisitng Email Test
  test("'checkEmailExists' function should throw an error if email already exists in database", async function() {
    // Mocking the database call using sinon
    const findOneStub = sinon.stub();
    findOneStub.withArgs({ email: "existing_email@example.com" }).resolves({ email: "existing_email@example.com" });

    const context = { findOne: findOneStub };

    try {
      await checkEmailExists.call(context, "existing_email@example.com");
    } catch (error) {
      chai.expect(error.message).to.equal("Email already registered");
    }
  });
  // Signup Form 'checkEmailExists' function Non-Exisitng Email Test
  test("'checkEmailExists' function should not throw an error if email does not exist in database", async function() {
    // Mocking the database call using sinon
    const findOneStub = sinon.stub();
    findOneStub.withArgs({ email: "non_existing_email@example.com" }).resolves(null);

    const context = { findOne: findOneStub };

    try {
      await checkEmailExists.call(context, "non_existing_email@example.com");
    } catch (error) {
      chai.expect.fail("Should not throw an error for non-existing email");
    }
  });
});

// -----------------------------------  Unit Tests For Login Form Validation  ----------------------------------- //
// Login Form 'checkEmptyEmailAndPassword' function No 'Email' Field Filled In Test
suite("Unit tests for login form validation", function() {
  test("'checkEmptyEmailAndPassword' function should throw an error if 'Email' field is empty", function() {
    try {
      checkEmptyEmailAndPassword("", "AlanAlderson01");
    } catch (error) {
      chai.expect(error.message).to.equal("Please fill in all fields");
    }
  });
  // Login Form 'checkEmptyEmailAndPassword' function No 'Password' Field Filled In Test
  test("'checkEmptyEmailAndPassword' function should throw an error if 'Password' field is empty", function() {
    try {
      checkEmptyEmailAndPassword("alan@alderson.com", "");
    } catch (error) {
      chai.expect(error.message).to.equal("Please fill in all fields");
    }
  });
  // Login Form 'checkEmptyEmailAndPassword' function 'Email' and 'Password' Field Filled In Test
  test("'checkEmptyEmailAndPassword' function should not throw an error for non-empty 'Email' and 'Password'", function() {
    try {
      checkEmptyEmailAndPassword("alan@alderson.com", "AlanAlderson01");
    } catch (error) {
      chai.expect.fail("Should not throw an error for non-empty email and password");
    }
  });
  // Login Form 'checkUserExists' function Non-Exisitng User Test
  test("'checkUserExists' function should throw an error if user does not exist in database", async function() {
    // Mocking the database call using sinon
    const findOneStub = sinon.stub();
    findOneStub.withArgs({ email: "User_Does_Not_Exist@Unit_Test.com" }).resolves(null);

    const context = { findOne: findOneStub };

    try {
      await checkUserExists.call(context, "User_Does_Not_Exist@Unit_Test.com");
    } catch (error) {
      chai.expect(error.message).to.equal("Invalid email or password");
    }
  });
  // Login Form 'checkUserExists' function Exisitng User Test
  test("'checkUserExists' function should not throw an error if user does exist in database", async function() {
    // Mocking the database call using sinon
    const findOneStub = sinon.stub();
    findOneStub.withArgs({ email: "User_Does_Exist@Unit_Test.com" }).resolves({ email: "User_Does_Exist@Unit_Test.com" });

    const context = { findOne: findOneStub };

    try {
      await checkUserExists.call(context, "User_Does_Exist@Unit_Test.com");
    } catch (error) {
      chai.expect.fail("Should not throw an error for existing user");
    }
  });
  // Login Form 'comparePasswords' function Passwords Do Not Match Test
  test("'comparePasswords' function should throw an error if the passwords do not match", async function() {
    // Mocking bcrypt.compare using sinon
    const bcryptStub = sinon.stub(bcrypt, 'compare').resolves(false);

    try {
      await comparePasswords("AlanAlderson01!", "hashedPassword");
    } catch (error) {
      chai.expect(error.message).to.equal("Invalid email or password");
    }

    // Restoring the stubbed method
    bcryptStub.restore();
  });
  // Login Form 'comparePasswords' function Passwords Do Match Test
  test("'comparePasswords' function should not throw an error if the passwords do match", async function() {
    // Mocking bcrypt.compare using sinon
    const password = 'AlanAlderson01'
    const bcryptStub = sinon.stub(bcrypt, 'compare').resolves(true);
    const bcryptSalt = await bcrypt.genSalt(10)
    // Here the 'bcrypt.hash' method is used to hash arguments passed to it. In this case the users password and the bcrypt salt are both passed to 'bcrypt.hash' with the resulting hash being assigned as the 
    // value of the variable 'hashedPassword'. 
    const hashedPassword = await bcrypt.hash(password, bcryptSalt)

    try {
      await comparePasswords(password, hashedPassword);
    } catch (error) {
      // Fail the test if an error is thrown
      chai.expect.fail(null, null, 'Should not throw an error for correct password match');
    }

    // Restoring the stubbed method
    bcryptStub.restore();
  });
});