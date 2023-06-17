npm install
npm install --prefix client

rm -rf client/build
npm run build --prefix client

npm start