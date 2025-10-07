import fs from 'fs';

// Fix remaining /specs/ paths to /data/Specs/
function fixRemainingPaths(data) {
  return data.map(item => {
    if (item.pdf_link && item.pdf_link !== null && item.pdf_link !== '') {
      const updatedLink = item.pdf_link.replace('/specs/', '/data/Specs/');
      if (updatedLink !== item.pdf_link) {
        console.log(`Updated: ${item.pdf_link} -> ${updatedLink}`);
        return { ...item, pdf_link: updatedLink };
      }
    }
    return item;
  });
}

// Process all data files
const files = ['mewp_data.json', 'mewp_data_corrected.json', 'mewp_data_final.json'];

files.forEach(file => {
  try {
    const data = JSON.parse(fs.readFileSync(file, 'utf8'));
    const updatedData = fixRemainingPaths(data);

    // Only write if there were changes
    const originalDataString = JSON.stringify(data, null, 2);
    const updatedDataString = JSON.stringify(updatedData, null, 2);

    if (originalDataString !== updatedDataString) {
      fs.writeFileSync(file, updatedDataString);
      console.log(`Updated ${file} for remaining paths`);
    } else {
      console.log(`No remaining path changes needed for ${file}`);
    }
  } catch (error) {
    console.error(`Error processing ${file}:`, error.message);
  }
});

console.log('Remaining path fixes completed!');
