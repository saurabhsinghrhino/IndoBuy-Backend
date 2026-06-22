const { userRegister, userLogin } = require("../controllers/auth.controller");
const userModel = require("../models/user.model");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

jest.mock("../models/user.model");
jest.mock("jsonwebtoken");
jest.mock("bcrypt");

describe("Auth Controller", () => {
  let req, res;

  beforeEach(() => {
    req = {
      body: {},
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
      cookie: jest.fn().mockReturnThis(),
    };

    jest.clearAllMocks();
  });

  describe("userRegister", () => {
    it("should register a new user successfully", async () => {
      const mockUser = {
        _id: "user123",
        username: "testuser",
        email: "test@test.com",
        password: "hashedpassword",
        role: "customer",
        lastLogin: new Date(),
      };

      req.body = {
        username: "testuser",
        email: "test@test.com",
        password: "password123",
        role: "customer",
      };

      userModel.findOne.mockResolvedValue(null);
      userModel.create.mockResolvedValue(mockUser);
      jwt.sign.mockReturnValue("token123");

      await userRegister(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          message: expect.stringContaining("successfully"),
          user: expect.objectContaining({
            email: "test@test.com",
            username: "testuser",
          }),
        }),
      );
    });

    it("should return 409 if email already exists", async () => {
      req.body = {
        username: "testuser",
        email: "existing@test.com",
        password: "password123",
        role: "customer",
      };

      userModel.findOne.mockResolvedValue({
        email: "existing@test.com",
      });

      await userRegister(req, res);

      expect(res.status).toHaveBeenCalledWith(409);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          message: "Email already exists",
        }),
      );
    });

    it("should handle registration errors", async () => {
      req.body = {
        username: "testuser",
        email: "test@test.com",
        password: "password123",
        role: "customer",
      };

      userModel.findOne.mockResolvedValue(null);
      userModel.create.mockRejectedValue(new Error("Database error"));

      await userRegister(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          message: expect.any(String),
        }),
      );
    });
  });

  describe("userLogin", () => {
    it("should login user successfully", async () => {
      const mockUser = {
        _id: "user123",
        username: "testuser",
        email: "test@test.com",
        password: "hashedpassword",
        role: "customer",
        lastLogin: new Date(),
      };

      req.body = {
        email: "test@test.com",
        password: "password123",
      };

      userModel.findOne.mockReturnValue({
        populate: jest.fn().mockResolvedValue(mockUser),
      });
      bcrypt.compare.mockResolvedValue(true);
      jwt.sign.mockReturnValue("token123");

      await userLogin(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          message: expect.stringContaining("successfully"),
          user: expect.objectContaining({
            email: "test@test.com",
          }),
        }),
      );
    });

    it("should return 404 if user not found", async () => {
      req.body = {
        email: "notfound@test.com",
        password: "password123",
      };

      userModel.findOne.mockReturnValue({
        populate: jest.fn().mockResolvedValue(null),
      });

      await userLogin(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          message: "User not found",
        }),
      );
    });

    it("should return 401 if password is incorrect", async () => {
      const mockUser = {
        _id: "user123",
        username: "testuser",
        email: "test@test.com",
        password: "hashedpassword",
        role: "customer",
      };

      req.body = {
        email: "test@test.com",
        password: "wrongpassword",
      };

      userModel.findOne.mockReturnValue({
        populate: jest.fn().mockResolvedValue(mockUser),
      });
      bcrypt.compare.mockResolvedValue(false);

      await userLogin(req, res);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          message: "Invalid credentials",
        }),
      );
    });
  });
});
