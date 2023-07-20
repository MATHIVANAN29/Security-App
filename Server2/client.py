from __future__ import print_function
import requests
import json
import cv2

addr = 'http://localhost:5000'
test_url = addr + '/verify'

# prepare headers for http request
content_type = 'image/jpeg'
headers = {'content-type': content_type}


#img = cv2.imread('lena.jpeg')
#img = cv2.imread('test-image.jpg')
#img = cv2.imread('0205.png')
img = cv2.imread('0153.png')

# encode image as jpeg
_, img_encoded = cv2.imencode('.jpeg', img)
# send http request with image and receive response
response = requests.post(test_url, data=img_encoded.tostring(), headers=headers)
# decode response
print(json.loads(response.text))
'''


def post_image(img_file):
    """ post image and return the response """
    img = open(img_file, 'rb').read()
    response = requests.post(test_url, data=img, headers=headers)

    print(json.loads(response.text))

    return response


post_image('lena.jpeg')
'''