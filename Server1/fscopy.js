const fs = require('fs');
const path = require('path');

function copyFolder(source, destination) {
  // Create destination folder if it doesn't exist
  if (!fs.existsSync(destination)) {
    fs.mkdirSync(destination);
  }

  // Read the contents of the source folder
  const files = fs.readdirSync(source);

  // Copy each file from the source folder to the destination folder
  files.forEach(file => {
    const sourcePath = path.join(source, file);
    const destPath = path.join(destination, file);

    // Check if the current item is a file or a directory
    if (fs.statSync(sourcePath).isDirectory()) {
      // If it's a directory, recursively call the function to copy its contents
      copyFolder(sourcePath, destPath);
    } else {
      // If it's a file, copy it to the destination folder
      fs.copyFileSync(sourcePath, destPath);
    }
  });
}

function deleteFolderContents(folder) {
  // Read the contents of the folder
  const files = fs.readdirSync(folder);

  // Delete each file or subfolder within the folder
  files.forEach(file => {
    const filePath = path.join(folder, file);

    if (fs.statSync(filePath).isDirectory()) {
      // If it's a directory, recursively call the function to delete its contents
      deleteFolderContents(filePath);
      fs.rmdirSync(filePath);
    } else {
      // If it's a file, delete it
      fs.unlinkSync(filePath);
    }
  });
}

// Usage:
const sourceFolder = 'path/to/source/folder';
const destinationFolder = 'path/to/destination/folder';

// Copy the contents of the source folder to the destination folder
copyFolder(sourceFolder, destinationFolder);

// Delete the contents of the source folder
deleteFolderContents(sourceFolder);
