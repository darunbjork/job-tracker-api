Updated jest.setup.ts for test database URL.
<br>
Modified jest.setup.ts to use process.env.TEST_DATABASE_URL, defaulting to 'postgresql://postgres:postgres@localhost:5432/jobtracker_test?schema=public' for tests.
<br>