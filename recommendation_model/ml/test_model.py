import numpy as np
import pickle
import tensorflow as tf
from db import load_test, get_users_cluster


model = tf.keras.models.load_model("./model/model.keras")

with open('model/user_map.pkl', 'rb') as f:
    user_map = pickle.load(f)
with open('model/fanfic_map.pkl', 'rb') as f:
    fanfic_map = pickle.load(f)

inv_fanfic_map = {v: k for k, v in fanfic_map.items()}

def get_recommendations(user_id, model, top_k=10):
    user_idx = user_map[user_id]
    all_fanfic_idxs = np.array(list(fanfic_map.values()))
    user_input = np.full(len(all_fanfic_idxs), user_idx)

    scores = model.predict(
        [user_input, all_fanfic_idxs],
        verbose=0
    ).flatten()

    top_indices = np.argsort(scores)[::-1][:top_k]
    return [inv_fanfic_map[i] for i in top_indices]


def get_users_recs(users):
    for user in users:
        rec_ids = get_recommendations(user, model, top_k=10)
        rec_df = load_test(rec_ids)
        rec_clusters = rec_df["cluster"].tolist()
        # user_cluster = get_users_cluster(user)["preference_cluster"].iloc[0]
        #
        # if user_cluster:
        #     print(f"user {user} cluster: {user_cluster}")
        print(f"user {user} recommendation clusters: {rec_clusters}")
        print()


get_users_recs([1517, 1518, 1519, 1520, 1521])
