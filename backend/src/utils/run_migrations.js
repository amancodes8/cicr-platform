// small helper that prints migrations path for CI; intentionally minimal
const path = require('path');
const fs = require('fs');

const migrationsPath = path.join(__dirname, '..', 'models', 'migrations.sql');
if (fs.existsSync(migrationsPath)) {
  // eslint-disable-next-line no-console
  console.log('Migrations file ready at:', migrationsPath);
} else {
  // eslint-disable-next-line no-console
  console.log('No migrations file found.');
}
