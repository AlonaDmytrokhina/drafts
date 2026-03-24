import json
import numpy as np
import tensorflow as tf
from fastapi import FastAPI

app = FastAPI()
model = tf.keras.models.load_model("./ml/model/model.keras")

with open("mappings.json", "r") as f:
    mappings = json.load(f)

user_map = mappings["userMap"]
fanfic_map = mappings["fanficMap"]

inv_fanfic_map = {v: k for k, v in fanfic_map.items()}


@app.get("/recommend/{user_id}")
def recommend(user_id: int, top_n: int = 50):

    if str(user_id) not in user_map:
        return {"error": "User not found"}
    user_idx = user_map[str(user_id)]
    num_items = len(fanfic_map)
    user_array = np.full((num_items,), user_idx)
    item_array = np.arange(num_items)
    predictions = model.predict([user_array, item_array], verbose=0)
    top_indices = np.argsort(predictions.flatten())[-top_n:][::-1]
    recommendations = [
        int(inv_fanfic_map[i]) for i in top_indices
    ]

    return {
        "user_id": user_id,
        "recommendations": recommendations
    }