const AdmZip = require('adm-zip');
const { existsSync, unlinkSync } = require('fs');

async function pathToZip(zipFileName, sourceDirectory)  {
  try {
    if (existsSync(zipFileName)) {
        unlinkSync(zipFileName);
    }
    const zip = new AdmZip();
    zip.addLocalFolder(sourceDirectory);
    zip.writeZip(zipFileName);
    console.log(`Created ${zipFileName} successfully`);
  } catch (error) {
    console.error('Erro ao criar o arquivo ZIP:', error);
  }
}

module.exports = {
    pathToZip
}
