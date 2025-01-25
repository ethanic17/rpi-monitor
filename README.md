# 🖥️ Raspberry Pi Monitor

Raspberry Pi Monitor (RPi Monitor) is a React & ExpressJS application that runs on your Raspberry Pi (or any Debian-based IoT Linux Device) that allows you to monitor basic device information and quick access dashboard to self-hosted services. RPi Monitor is hosted on port ```3000``` and is accessible in any browser on mobile and web. 

![image](https://github.com/user-attachments/assets/d5bbd19c-4936-4ac8-8bb7-8b7a7e906cfa)



## ✅Prerequisites:
- Have MongoDB installed (Raspberry Pis use an [older version](https://www.mongodb.com/developer/products/mongodb/mongodb-on-raspberry-pi/)
 that supports ARM)
- Have NeoFetch installed (```sudo apt-get install neofetch```) 

## ➡️Running Application:
- Download the repository to your local machine/Raspberry Pi and open the repo with your preferred text editor
- In the ```.env``` file, change ```REACT_APP_LOCAL_IP``` to the local IP of your Raspberry Pi and ```REACT_APP_BACKEND_URL``` to the the local IP with port ```:5000``` added at the end
  - ![image](https://github.com/user-attachments/assets/c418abbb-89e6-4860-b14f-d2dee864e284)
  - Replace ```127.0.0.1``` on both lines with your local IP Address (you can run ```hostname -I``` to retrieve the host IP Address)
 
- Open a terminal in the downloaded repository and run ```npm i``` to install node dependencies

- Then, ```cd``` into the ```BackEnd``` folder
  -  run ```node server.js``` to start the backend

- Lastly, ```cd``` into the ```src``` folder
   - run ```npm start``` to start the frontend

## ❗Important:
- Self-host Services hyperlink buttons will only work if you have set them up properly and binded them to the default ports (you can change them in the source code if needed)
- MAC Address assumes you are using ```eth0``` (you can change this in the source code if needed)



