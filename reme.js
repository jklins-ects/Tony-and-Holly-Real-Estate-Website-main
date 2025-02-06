const fs = require("fs/promises");
const path = require("path");
const sharp = require("sharp");

async function convertToJpeg(directory) {
    async function traverseDir(currentPath) {
        try {
            const entries = await fs.readdir(currentPath, {
                withFileTypes: true,
            });

            // Separate files and directories
            const files = [];
            const directories = [];

            for (const entry of entries) {
                if (entry.isDirectory()) {
                    directories.push(entry);
                } else if (entry.isFile()) {
                    files.push(entry);
                }
            }

            // Process each file
            for (const fileEntry of files) {
                const fileName = fileEntry.name;
                const filePath = path.join(currentPath, fileName);
                const ext = path.extname(fileName).toLowerCase();
                const baseName = path.basename(fileName, ext);

                // Skip non-image files and already .jpeg files
                if (
                    ![".png", ".jpg", ".jpeg"].includes(ext) ||
                    ext === ".jpeg"
                ) {
                    continue;
                }

                let targetBase = baseName;
                let counter = 1;
                let targetPath;

                // Find a unique target filename
                do {
                    const suffix = counter === 1 ? "" : `_${counter - 1}`;
                    const tentativeName = `${targetBase}${suffix}.jpeg`;
                    targetPath = path.join(currentPath, tentativeName);
                    try {
                        await fs.access(targetPath);
                        counter++;
                    } catch {
                        // File does not exist, exit loop
                        break;
                    }
                } while (true);

                try {
                    // Convert image to JPEG
                    await sharp(filePath).jpeg().toFile(targetPath);

                    // Remove the original file
                    await fs.unlink(filePath);

                    console.log(`Converted: ${filePath} -> ${targetPath}`);
                } catch (err) {
                    console.error(`Error converting ${filePath}:`, err);
                }
            }

            // Recursively process directories
            for (const dirEntry of directories) {
                await traverseDir(path.join(currentPath, dirEntry.name));
            }
        } catch (err) {
            console.error(`Error processing ${currentPath}:`, err);
        }
    }

    await traverseDir(directory);
}

const dataDirectory = path.join(__dirname, "data");
convertToJpeg(dataDirectory)
    .then(() => console.log("Conversion complete"))
    .catch(console.error);
