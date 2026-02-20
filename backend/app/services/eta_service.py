import pickle
import os
import numpy as np
from datetime import datetime

MODEL_PATH = "eta_model.pkl"

model = None
if os.path.exists(MODEL_PATH):
    with open(MODEL_PATH, "rb") as f:
        model = pickle.load(f)

def predict_eta(active_orders: int):
    if model:
        hour = datetime.utcnow().hour
        features = np.array([[hour, active_orders]])
        return int(model.predict(features)[0])
    return 5 + active_orders
