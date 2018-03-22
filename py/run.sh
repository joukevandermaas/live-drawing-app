if [ ! -d "venv" ]; then
  python3 -m venv venv
  source venv/bin/activate
  pip install -r requirements.txt
fi

source venv/bin/activate
export FLASK_APP=app.py
flask run
