const {
  addProduct,
  getProductCheckUser,
  getProductById,
} = require("../controllers/product.controller");
const productModel = require("../models/product.model");
const imagekit = require("../Services/imagekit");

jest.mock("../models/product.model");
jest.mock("../Services/imagekit");

describe("Product Controller", () => {
  let req, res;

  beforeEach(() => {
    req = {
      body: {},
      file: null,
      user: { id: "user123" },
      params: {},
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };

    jest.clearAllMocks();
  });

  describe("addProduct", () => {
    it("should return 400 if required fields are missing", async () => {
      req.body = {
        name: "Test Product",
        price: 100,
        // Missing description, category, stock
      };

      await addProduct(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          message: expect.stringContaining("required"),
        }),
      );
    });

    it("should return 400 if no image is provided", async () => {
      req.body = {
        name: "Test Product",
        price: 100,
        description: "Test Description",
        category: "Electronics",
        stock: 10,
      };
      req.file = null;

      await addProduct(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          message: "Image is required",
        }),
      );
    });
  });

  describe("getProductCheckUser", () => {
    it("should return all products", async () => {
      const mockProducts = [
        {
          _id: "product1",
          name: "Product 1",
          price: 100,
        },
        {
          _id: "product2",
          name: "Product 2",
          price: 200,
        },
      ];

      productModel.find.mockResolvedValue(mockProducts);

      await getProductCheckUser(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          message: expect.stringContaining("successfully"),
        }),
      );
    });

    it("should handle error in getProductCheckUser", async () => {
      const error = new Error("Database error");
      productModel.find.mockRejectedValue(error);

      await getProductCheckUser(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
    });
  });

  describe("getProductById", () => {
    it("should return 403 if id is missing", async () => {
      req.params.id = null;

      await getProductById(req, res);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          message: expect.stringContaining("required"),
        }),
      );
    });

    it("should return 404 if product not found", async () => {
      req.params.id = "product123";

      productModel.findOne.mockResolvedValue(null);

      await getProductById(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          message: "Product not found",
        }),
      );
    });

    it("should return product if found", async () => {
      const mockProduct = {
        _id: "product123",
        name: "Test Product",
        price: 100,
      };

      req.params.id = "product123";
      productModel.findOne.mockResolvedValue(mockProduct);

      await getProductById(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          message: expect.stringContaining("successfully"),
        }),
      );
    });
  });
});
