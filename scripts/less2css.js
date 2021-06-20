const util = require('util');
const execSync = require('child_process').execSync;
const path = require('path');
const fs = require('fs');

const main = async () => {
  const commonPath = path.resolve(__dirname, '../src/components/common');
  const dataPath = path.resolve(commonPath, './data');
  const uiPath = path.resolve(commonPath, './ui');

  const lessDirPathList = [dataPath, uiPath];

  lessDirPathList.forEach(lessDirPath => {
    const componentNameList = fs.readdirSync(lessDirPath);

    componentNameList.forEach(componentName => {
      const componentLessPath = path.resolve(
        lessDirPath,
        componentName,
        `${componentName}.less`
      );
      if (fs.existsSync(componentLessPath)) {
        
        execSync(`lessc ${}`)
      }
    });

    console.log({ componentNameList });
  });

  // const { stdout, stderr } = await exec('ls');
  // console.log('stdout:', stdout);
  // console.error('stderr:', stderr);
};

main();
