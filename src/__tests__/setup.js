// Set up environment variables for testing
process.env.IMAGE_KIT_PUBLIC = "test_public_key";
process.env.IMAGE_KIT_PRIVATE = "test_private_key";
process.env.IMAGE_KIT_URL = "https://test.imagekit.io";
process.env.JWT_SECRET = "test_jwt_secret";
process.env.MONGODB_URL = "mongodb://localhost:27017/test";

process.env.RAZORPAY_KEY_ID = "test_razorpay_key";
process.env.RAZORPAY_SECRET = "test_razorpay_secret";
// Suppress console errors during tests if needed
const originalError = console.error;
beforeAll(() => {
  console.error = (...args) => {
    if (typeof args[0] === "string" && args[0].includes("Missing publicKey")) {
      return;
    }
    originalError.call(console, ...args);
  };
});

afterAll(() => {
  console.error = originalError;
});
