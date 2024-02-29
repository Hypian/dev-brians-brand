import chai from "chai";
import chaiHttp from "chai-http";
import app from "../server.ts"; // Assuming your Express app is exported from 'app.ts' or 'app.js'

chai.use(chaiHttp);
const expect = chai.expect;

describe("API Routes", () => {
  describe("POST /api/signup", () => {
    it("should create a new user", (done) => {
      chai
        .request(app)
        .post("/api/signup")
        .send({ email: "test@example.com", password: "password" })
        .end((err, res) => {
          expect(res).to.have.status(201);
          expect(res.body)
            .to.have.property("message")
            .to.equal("User created successfully");
          done();
        });
    });
  });

  // Write tests for other routes similarly
});
