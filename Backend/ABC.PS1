

# Create main folders and files
mkdir node_modules, src
New-Item .env -ItemType File
New-Item .gitignore -ItemType File
New-Item package.json -ItemType File
New-Item package-lock.json -ItemType File
New-Item README.md -ItemType File

# Navigate into src and create subfolders and server.js
cd src
mkdir config, controllers, middlewares, models, routes, utils
New-Item server.js -ItemType File
