from flask import Flask, request, jsonify
import base64
app = Flask(__name__)
from ml_ocr import img2str

@app.route("/", methods=['POST'])
def stringify():
    # get the img data encoded in b64
    base64_img = request.form['img']

    # strip the string 'data:image/png;base64,'
    b64_stripped = base64_img[22:]

    # decode into binary img
    img = base64.b64decode(b64_stripped)

    # write to test file
    #with open('test.png', 'wb') as w:
    #    w.write(img)

    recognized_str = img2str(img)
    return jsonify(
                text=recognized_str
            )

