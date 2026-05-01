const fs = require('fs');
const path = require('path');
const { Report, initDB } = require('./src/models/Report');

const migrate = async () => {
  await initDB();
  const jsonPath = path.join(__dirname, 'reports.json');
  
  if (fs.existsSync(jsonPath)) {
    const data = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
    console.log(`Found ${data.length} reports to migrate...`);
    
    for (const report of data) {
      try {
        await Report.findOrCreate({
          where: { id: report.id },
          defaults: report
        });
      } catch (err) {
        console.error(`Failed to migrate report ${report.id}:`, err.message);
      }
    }
    console.log('Migration complete!');
  } else {
    console.log('No reports.json found to migrate.');
  }
  process.exit(0);
};

migrate();
