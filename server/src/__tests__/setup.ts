import fs from 'fs/promises';
import path from 'path';

// Test data directory
const TEST_DATA_DIR = path.join(__dirname, '../test-data');

beforeEach(async () => {
  // Clean up test data directory before each test
  try {
    await fs.rm(TEST_DATA_DIR, { recursive: true, force: true });
  } catch (error) {
    // Directory might not exist, which is fine
  }
});

afterAll(async () => {
  // Clean up test data directory after all tests
  try {
    await fs.rm(TEST_DATA_DIR, { recursive: true, force: true });
  } catch (error) {
    // Directory might not exist, which is fine
  }
});