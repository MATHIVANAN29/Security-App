# Security-App

The source code comprises three modules:
- Server1 code folder
- Server2 code folder
- frontend.zip

## Useage

- First clone the repository: i.e
```
git clone https://github.com/MATHIVANAN29/Security-App.git
```
- then enter the folder i.e
  ```cd Security-App
  ```
- unzip the frontend
  ```
  unzip frontend.zip -d frontend
  ```
- in one terminal(command prompt) open Server1 and run the server
  ```
  cd Server1
  node index.js
  ```

- in another terminal open Server2 then run
  ```
  cd Server2

  source flask-env/bin/activate
  export FLASK_APP=app.py
  export FLASK_ENV=development
  flask run --host=0.0.0.0
  
  ```

- then open the browser on port
  

## first time useage installation

If running for the first time cd into server 1 and install prerequisite i.e
```
cd Security-App
cd Server1
npm install
```
Install server2 requirements
```
pip3 install numpy==1.19.4
pip3 install requests
pip3 install jsonpickle
pip3 install opencv-python
pip3 install facenet-pytorch
apt-get install python-flask
```
