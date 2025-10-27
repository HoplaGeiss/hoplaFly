// Simple test script for backend functions
// Run with: node test-backend.js

const testDeviceId = 'test-device-' + Date.now();
const testData = {
  deviceId: testDeviceId,
  hoplaTokens: 5,
  score: 5
};

console.log('Testing hoplaFly Backend Functions...\n');

// Test save user data
async function testSaveUserData() {
  console.log('1. Testing save user data...');

  try {
    const response = await fetch('http://localhost:9999/.netlify/functions/save-user-data-simple', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testData)
    });

    const result = await response.json();

    if (response.ok && result.success) {
      console.log('✅ Save user data: SUCCESS');
      console.log('   Response:', result);
    } else {
      console.log('❌ Save user data: FAILED');
      console.log('   Error:', result);
    }
  } catch (error) {
    console.log('❌ Save user data: ERROR');
    console.log('   Error:', error.message);
  }
}

// Test get user data
async function testGetUserData() {
  console.log('\n2. Testing get user data...');

  try {
    const response = await fetch(`http://localhost:9999/.netlify/functions/get-user-data-simple?deviceId=${encodeURIComponent(testDeviceId)}`);
    const result = await response.json();

    if (response.ok && result.success) {
      console.log('✅ Get user data: SUCCESS');
      console.log('   Response:', result);
    } else {
      console.log('❌ Get user data: FAILED');
      console.log('   Error:', result);
    }
  } catch (error) {
    console.log('❌ Get user data: ERROR');
    console.log('   Error:', error.message);
  }
}

// Test invalid data
async function testInvalidData() {
  console.log('\n3. Testing invalid data handling...');

  try {
    const response = await fetch('http://localhost:9999/.netlify/functions/save-user-data-simple', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ deviceId: '', hoplaTokens: 'invalid' })
    });

    const result = await response.json();

    if (!response.ok && result.error) {
      console.log('✅ Invalid data handling: SUCCESS');
      console.log('   Error message:', result.error);
    } else {
      console.log('❌ Invalid data handling: FAILED');
      console.log('   Response:', result);
    }
  } catch (error) {
    console.log('❌ Invalid data handling: ERROR');
    console.log('   Error:', error.message);
  }
}

// Run all tests
async function runTests() {
  console.log('Make sure to start the Netlify functions server first:');
  console.log('npm install -g netlify-cli');
  console.log('netlify functions:serve\n');

  await testSaveUserData();
  await testGetUserData();
  await testInvalidData();

  console.log('\n🎉 Backend testing complete!');
  console.log('\nTo test in production:');
  console.log('1. Deploy to Netlify');
  console.log('2. Update the URLs in this script to your Netlify domain');
  console.log('3. Run the tests again');
}

runTests().catch(console.error);
