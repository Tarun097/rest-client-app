#install node modules
npm install react react-dom react-scripts axios

#build image
sudo docker build -t rest-client-app .

#run image
sudo docker run -p 3000:3000 rest-client-app

#refer this for test APIs : https://restful-api.dev/