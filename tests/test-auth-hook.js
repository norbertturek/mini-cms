const strapiUrl = 'http://localhost:1337';

async function testRegistration() {
  const username = `testuser_${Date.now()}`;
  const email = `${username}@example.com`;

  console.log(`Registering user: ${username}`);

  const regRes = await fetch(`${strapiUrl}/api/auth/local/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      username,
      email,
      password: 'password123',
    }),
  });

  const regData = await regRes.json();

  if (regData.error) {
    console.error('Registration failed:', regData.error);
    return;
  }

  console.log(
    'Registration success. JWT:',
    regData.jwt.substring(0, 20) + '...',
  );

  // Wait a moment for the hook to finish
  await new Promise((resolve) => setTimeout(resolve, 1000));

  console.log('Checking for Author...');

  // We need to be authenticated to check authors if permissions are not set,
  // but let's see if we can check it.
  // Actually, I'll use the Strapi Document Service API directly if I can or just query authors.
  // Since I don't have permissions set yet, this might fail unless public.

  const authorsRes = await fetch(`${strapiUrl}/api/authors`, {
    headers: { Authorization: `Bearer ${regData.jwt}` },
  });

  const authorsData = await authorsRes.json();
  console.log('Authors found:', JSON.stringify(authorsData, null, 2));
}

testRegistration();
