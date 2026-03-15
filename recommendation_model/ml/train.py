# train.py
from db import load_data
from mappings import create_mappings
from model import build_model
from sklearn.model_selection import train_test_split

df = load_data()

df, user_map, fanfic_map = create_mappings(df)
train_df, test_df = train_test_split(df, test_size=0.2)

model = build_model(
    len(user_map),
    len(fanfic_map),
    32
)

model.summary()

model.fit(
    [
        train_df['user_idx'],
        train_df['fanfic_idx']
    ],
    train_df['score'],
    validation_data=(
        [test_df['user_idx'], test_df['fanfic_idx']],
        test_df['score']
    ),
    epochs=15,
    batch_size=4096,
    verbose=1
)

model.save("model/model.keras")