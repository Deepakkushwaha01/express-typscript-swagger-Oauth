npm install -D typescript
npm install -D ts-node
npm install -D nodemon

# Create File tsconfig.json

`{
"compilerOptions": {
"target": "ES2020",
"module": "NodeNext",
"moduleResolution": "NodeNext",
"rootDir": "./src",
"outDir": "./dist",
"allowImportingTsExtensions": true,
"noEmit": true,
"preserveConstEnums": true,
"esModuleInterop": true,
"forceConsistentCasingInFileNames": true,
"strict": true,
"skipLibCheck": true,
"sourceMap": true,
"resolveJsonModule": true
},
"ts-node": {
"esm": true,
"experimentalSpecifierResolution": "node"
},
"include": ["src/**/*"],
"exclude": ["node_modules", "dist"]
}`

# Create File nodemon.json

{
"watch": ["src"],
"ext": ".ts,.js",

<!-- "exec": "ts-node ./src/index.ts" -->

}

add "dev": "nodemon", in package.json
