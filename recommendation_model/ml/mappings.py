import pandas as pd
import random

def negative_sampling(df):
    all_users = df['user_id'].unique()
    all_fanfics = df['fanfic_id'].unique()

    positive_pairs = set(zip(df.user_id, df.fanfic_id))
    negative_samples = []

    for user in all_users:
        interacted = df[df.user_id == user].fanfic_id.tolist()
        not_interacted = list(set(all_fanfics) - set(interacted))

        sample_size = min(len(interacted), len(not_interacted))
        sampled_neg = random.sample(not_interacted, sample_size)

        for fanfic in sampled_neg:
            negative_samples.append([user, fanfic, 0.0])

    neg_df = pd.DataFrame(
        negative_samples,
        columns=['user_id', 'fanfic_id', 'score']
    )

    df = pd.concat([df[['user_id','fanfic_id','score']], neg_df])
    return df


def create_mappings(df):

    df = negative_sampling(df)

    user_ids = df['user_id'].unique().tolist()
    fanfic_ids = df['fanfic_id'].unique().tolist()

    user_map = {int(id): i for i, id in enumerate(user_ids)}
    fanfic_map = {int(id): i for i, id in enumerate(fanfic_ids)}

    df['user_idx'] = df['user_id'].map(user_map)
    df['fanfic_idx'] = df['fanfic_id'].map(fanfic_map)

    return df, user_map, fanfic_map


