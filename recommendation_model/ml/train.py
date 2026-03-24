from db import load_data
from mappings import create_mappings
from model import build_model
from sklearn.model_selection import train_test_split
import matplotlib.pyplot as plt
import pickle
import os

df = load_data()

df, user_map, fanfic_map = create_mappings(df)

os.makedirs("model", exist_ok=True)
with open('model/user_map.pkl', 'wb') as f:
    pickle.dump(user_map, f)
with open('model/fanfic_map.pkl', 'wb') as f:
    pickle.dump(fanfic_map, f)


train_df, test_df = train_test_split(df, test_size=0.2)

model = build_model(
    len(user_map),
    len(fanfic_map),
    32
)

model.summary()

history = model.fit(
    [
        train_df['user_idx'],
        train_df['fanfic_idx']
    ],
    train_df['score'],
    validation_data=(
        [test_df['user_idx'], test_df['fanfic_idx']],
        test_df['score']
    ),
    epochs=12,
    batch_size=4096,
    verbose=1
)

model.save("model/model.keras")


def plot_metrics(history, metric_name):
    plt.figure(figsize=(10, 5))
    plt.plot(history.history[metric_name], label=f'Train {metric_name}')
    plt.plot(history.history[f'val_{metric_name}'], label=f'Val {metric_name}')
    plt.title(f'Model {metric_name.upper()}')
    plt.xlabel('Epochs')
    plt.ylabel(metric_name)
    plt.legend()
    plt.show()

plot_metrics(history, 'AUC')
plot_metrics(history, 'loss')