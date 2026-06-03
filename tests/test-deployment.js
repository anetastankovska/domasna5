/**
 * test-green.js
 * Validates the Green (new) environment before switching traffic.
 * Tests the API endpoints to ensure they respond correctly.
 */

const TARGET_URL = process.env.TARGET_URL || "http://localhost:3030";

async function testEndpoint(name, url, validate, responseType = "json") {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    let data;
    if (responseType === "text") {
      data = await response.text();
    } else {
      data = await response.json();
    }

    if (validate) {
      validate(data);
    }
    console.log(`  [PASS] ${name}`);
    return true;
  } catch (error) {
    console.log(`  [FAIL] ${name}: ${error.message}`);
    return false;
  }
}

async function runTests() {
  console.log(`\nRunning deployment validation tests against: ${TARGET_URL}\n`);

  const results = [];

  // Test 1: Root endpoint responds with text
  results.push(
    await testEndpoint(
      "Root endpoint responds",
      TARGET_URL,
      (data) => {
        if (data !== "Hello World") {
          throw new Error(`Expected 'Hello World', got '${data}'`);
        }
      },
      "text" // Specify response type as text
    )
  );

  // Test 2: GET /api/students returns array
  results.push(
    await testEndpoint(
      "GET /api/students returns student array",
      `${TARGET_URL}/api/students`,
      (data) => {
        if (!Array.isArray(data)) {
          throw new Error("Expected array response");
        }
        if (data.length === 0) {
          throw new Error("Expected non-empty student array");
        }
      }
    )
  );

  // Test 3: Students have required fields
  results.push(
    await testEndpoint(
      "Students have required fields",
      `${TARGET_URL}/api/students`,
      (data) => {
        const requiredFields = ["id", "firstName", "lastName", "age", "gender", "email"];
        const student = data[0];
        for (const field of requiredFields) {
          if (!(field in student)) {
            throw new Error(`Missing field: ${field}`);
          }
        }
      }
    )
  );

  // Test 4: Filter by gender works
  results.push(
    await testEndpoint(
      "Filter by gender query param works",
      `${TARGET_URL}/api/students?gender=F`,
      (data) => {
        if (!Array.isArray(data)) {
          throw new Error("Expected array response");
        }
        for (const student of data) {
          if (student.gender !== "F") {
            throw new Error(`Expected gender F, got ${student.gender}`);
          }
        }
      }
    )
  );

  // Test 5: Get student by ID
  results.push(
    await testEndpoint(
      "GET /api/students/:id returns single student",
      `${TARGET_URL}/api/students/7ca2298c-6c7c-4816-bded-510cedd50f31`,
      (data) => {
        if (data.firstName !== "John") {
          throw new Error(`Expected John, got ${data.firstName}`);
        }
      }
    )
  );

  // Summary
  const passed = results.filter((r) => r).length;
  const total = results.length;

  console.log(`\n  Results: ${passed}/${total} tests passed\n`);

  if (passed < total) {
    console.log("  DEPLOYMENT VALIDATION FAILED - DO NOT SWITCH TRAFFIC\n");
    process.exit(1);
  } else {
    console.log("  DEPLOYMENT VALIDATION PASSED - SAFE TO SWITCH\n");
    process.exit(0);
  }
}

runTests();
