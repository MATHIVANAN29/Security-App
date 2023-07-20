
from flask import Flask, request, Response
from werkzeug.utils import secure_filename

from flask_cors import CORS

import numpy as np
import os

import time

import requests
import json
import jsonpickle
import cv2

app = Flask(__name__)
cors = CORS(app, resources={r'/*'})



#!pip install facenet_pytorch

# importing libraries
from facenet_pytorch import MTCNN, InceptionResnetV1
import torch
from torchvision import datasets
from torch.utils.data import DataLoader
from PIL import Image

#!unzip photos.zip




mtcnn = MTCNN(image_size=240, margin=0, min_face_size=20) # initializing mtcnn for face detection
resnet = InceptionResnetV1(pretrained='vggface2').eval() 

dataset=datasets.ImageFolder('user-images') # photos folder path 
idx_to_class = {i:c for c,i in dataset.class_to_idx.items()} # accessing names of peoples from folder names

def collate_fn(x):
    return x[0]


lastdetectiontionTime = 0.0

loader = DataLoader(dataset, collate_fn=collate_fn)

face_list = [] 
name_list = [] 
embedding_list = [] # list of embeding matrix after conversion from cropped faces to embedding matrix using resnet


for img, idx in loader:
    face, prob = mtcnn(img, return_prob=True) 
    if face is not None and prob>0.90: # if face detected and porbability > 90%
        emb = resnet(face.unsqueeze(0)) 
        embedding_list.append(emb.detach()) 
        name_list.append(idx_to_class[idx]) # names are stored in a list


data = [embedding_list, name_list]

'''
torch.save(data, 'data.pt') # saving data.pt file


'''



### Matching face id of the given photo with available data from data.pt file

def face_match(img_path, data_path): # img_path= location of photo, data_path= location of data.pt 
    # getting embedding matrix of the given img
    img = Image.open(img_path)
    face, prob = mtcnn(img, return_prob=True) # returns cropped face and probability
    emb = resnet(face.unsqueeze(0)).detach() # detech is to make required gradient false
    
    saved_data = torch.load('data.pt') # loading data.pt file
    embedding_list = saved_data[0] # getting embedding data
    name_list = saved_data[1] # getting list of names
    dist_list = [] # list of matched distances, minimum distance is used to identify the person
    
    for idx, emb_db in enumerate(embedding_list):
        dist = torch.dist(emb, emb_db).item()
        dist_list.append(dist)
        
    idx_min = dist_list.index(min(dist_list))
    return (name_list[idx_min], min(dist_list))

'''
#result = face_match('test-image.jpg', 'data.pt')
#result = face_match('0205.png', 'data.pt')
result = face_match('0153.png', 'data.pt')


print('Face matched with: ',result[0], 'With distance: ',result[1])

'''


@app.route("/")
def hello_world():

	#ObtainToken()

    #return "Hello, World!"
	return "Server is alive!!!"



@app.route("/train", methods=['POST'])
def train():
    face_list = [] # list of cropped faces from photos folder
    name_list = [] # list of names corrospoing to cropped photos
    embedding_list = [] # list of embeding matrix after conversion from cropped faces to embedding matrix using resnet

    for img, idx in loader:
        face, prob = mtcnn(img, return_prob=True) 
        if face is not None and prob> 0.90:
            # if face detected and porbability > 90%
            emb = resnet(face.unsqueeze(0)) # passing cropped face into resnet model to get embedding matrix
            embedding_list.append(emb.detach()) # resulten embedding matrix is stored in a list
            name_list.append(idx_to_class[idx]) # names are stored in a list

    """### Saving data into data.pt file"""

    data = [embedding_list, name_list]
    torch.save(data, 'data.pt') # saving data.pt file

    response = {'result': "training done..."}
    response_pickled = jsonpickle.encode(response)
    
    return Response(response=response_pickled, status=200, mimetype="application/json")




# @app.route("/detect", methods=['POST'])
# def detect():
#     if request.method == 'POST':
#         image_data = request.form['image']

#         # Remove the data URL prefix
#         image_data = image_data.replace('data:image/png;base64,', '')

#         # Convert the base64-encoded image data to a NumPy array
#         nparr = np.frombuffer(base64.b64decode(image_data), np.uint8)

#         # Decode the image using OpenCV
#         img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)

#         # Process the image as needed

#         return "Image received and processed successfully!"



@app.route("/verify", methods=['POST'])
def verify():
    if request.method == 'POST':
        #if 'file' not in request.files:
        #    return 'there is no file1 in form!'
        #print(request.files)
        print(json.dumps(request.files))
        #print(request.data)
        nparr = np.fromstring(request.data, np.uint8)


        # decode image
        img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
        #response = {'message': 'image received. size={}x{}'.format(img.shape[1], img.shape[0])}
        #response_pickled = jsonpickle.encode(response)



        #img = cv2.imread('yourfile.jpg')
        path = 'TestImages/'
        name = 'test.jpeg'
        cv2.imwrite(os.path.join(path, name), img)



        result = face_match( os.path.join(path, name) , 'data.pt')
        #result = face_match(img, 'data.pt')
        print('Face matched with: ',result[0], 'With distance: ',result[1])


        #uname = "-----"

        detectionTime = time.time()
        global lastdetectiontionTime
        timeOffset = detectionTime - lastdetectiontionTime
        print("off-set: " + str(timeOffset) )

        if( timeOffset> 15.0):
            print("15 sec more than last accepted detection, now open gate..")
            lastdetectiontionTime = time.time()
            #user_metadata = requests.get(url="http://localhost:9000/api/user/"+ result[0] )
            #print("username => " + user_metadata.username )

            Command = {"data":"open"}
            GateCommand = requests.post(url="http://localhost:9000/opengate", data=Command)

            #uname = user_metadata.username 

        response = {'username': result[0],'distance': result[1]}
        #response = {'username': uname ,'distance': result[1]}
        response_pickled = jsonpickle.encode(response)
            

        return Response(response=response_pickled, status=200, mimetype="application/json")



    #return 'done'

