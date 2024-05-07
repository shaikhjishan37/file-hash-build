#! /usr/bin/env node

console.log("File hasher Started!");

const fs = require('fs');
const path = require("path");
const crypto = require('crypto');
const { exec } = require('child_process');
const { promisify } = require('util');
const exec_async = promisify(exec);

const getHash = ( content ) => {				
  const hash = crypto.createHash('md5');
  //passing the data to be hashed
  const data = hash.update(content, 'utf-8');
  //Creating the hash in the required format
  const gen_hash = data.digest('hex');

  return gen_hash;
}

const processFile = (file, filePath, extensions, filePathCleanUp, impactFiles = '*.*') => {
  const fileExtension = path.extname(filePath);

  if ( extensions.includes(fileExtension) ) {
    const fileContent = fs.readFileSync(filePath, 'utf8');
    const filehash = getHash(fileContent);

    if ( !filePath.includes(filehash) ) {
      const fileNewName = filePath.replace(fileExtension, `.${filehash}${fileExtension}`);

      fs.rename(filePath, fileNewName, function(err) {
        if ( err ) console.log('ERROR: ' + err);
      });

      const filePathAfterCleanup = filePath.replace(filePathCleanUp, '');
      const fileNewNameAfterCleanup = fileNewName.replace(filePathCleanUp, '');
      const sedCommand = `grep -rl '${filePathAfterCleanup}' '${impactFiles}' | xargs sed -i 's|${filePathAfterCleanup}|${fileNewNameAfterCleanup}|g'`;

      console.log(sedCommand)

      exec_async(sedCommand)
      .catch(err => {console.log(err)})
    }
  }
}

const procesFolders = (folderPaths, extensions, filePathCleanUp, impactFiles) => {
  folderPaths.forEach( (folderPath) => {
    try {
      const folders = fs.readdirSync(folderPath);

      folders.forEach((folderContent) => {
        try {
          const childPath = `${folderPath}/${folderContent}`;
          const stats = fs.statSync(childPath);

          if ( stats.isFile() ) {
            processFile(folderContent, childPath, extensions, filePathCleanUp, impactFiles);
          } else if ( stats.isDirectory() ) {
            procesFolders([childPath], extensions, filePathCleanUp, impactFiles);
          }
        } catch(error) {
          console.log(error)
        }
      })
    } catch(error) {
      console.log(error)
    }
  } );
}

((folderPathsKey, extensionsKey, postProcessCleanUpPath, impactFilesPath) => {
  const folderPaths = [];
  const extensions = [];
  let filePathCleanUp = '';
  let impactFiles;

  process.argv.forEach((userInput) => {
    if (userInput.includes('=') && userInput.startsWith('-')) {
      const [key, value] = userInput.split('=');

      if ( key.toLocaleLowerCase() === folderPathsKey.toLocaleLowerCase() ) {
        folderPaths.push(value);
      } else if ( key.toLocaleLowerCase() === extensionsKey.toLocaleLowerCase() ) {
        extensions.push(value);
      } else if ( key.toLocaleLowerCase() === postProcessCleanUpPath.toLocaleLowerCase() ) {
        filePathCleanUp = value;
      }  else if ( key.toLocaleLowerCase() === impactFilesPath.toLocaleLowerCase() ) {
        impactFiles = value;
      }
    }
  });

  procesFolders(folderPaths, extensions, filePathCleanUp, impactFiles);
})('-folder', '-fileExtension', '-postProcessCleanUpPath', '-impactFilesPath');
