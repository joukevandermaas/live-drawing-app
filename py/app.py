from flask import Flask, request, jsonify
import base64
app = Flask(__name__)
from ml_ocr import img2str

@app.route("/", methods=['POST'])
def stringify():
    base64_img = request.form['img']
    img = base64.b64decode(base64_img)
    recognized_str = img2str(base64_img)
    return jsonify(
                text=recognized_str
            )

