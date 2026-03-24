import tensorflow as tf

def build_model(num_users, num_fanfics, emb_dim):

    user_input = tf.keras.layers.Input(shape=(1,))
    fan_input = tf.keras.layers.Input(shape=(1,))

    user_emb = tf.keras.layers.Embedding(
        num_users,
        emb_dim,
        embeddings_regularizer=tf.keras.regularizers.l2(1e-6)
    )(user_input)

    fan_emb = tf.keras.layers.Embedding(
        num_fanfics,
        emb_dim,
        embeddings_regularizer=tf.keras.regularizers.l2(1e-6)
    )(fan_input)

    user_vec = tf.keras.layers.Flatten()(user_emb)
    fan_vec = tf.keras.layers.Flatten()(fan_emb)

    # Bias
    user_bias = tf.keras.layers.Embedding(num_users, 1)(user_input)
    fan_bias = tf.keras.layers.Embedding(num_fanfics, 1)(fan_input)

    user_bias = tf.keras.layers.Flatten()(user_bias)
    fan_bias = tf.keras.layers.Flatten()(fan_bias)

    # Dot
    dot = tf.keras.layers.Dot(axes=1)([user_vec, fan_vec])

    # MLP
    concat = tf.keras.layers.Concatenate()([user_vec, fan_vec])
    dense1 = tf.keras.layers.Dense(128, activation='relu')(concat)
    dense1 = tf.keras.layers.Dropout(0.2)(dense1)
    dense2 = tf.keras.layers.Dense(128, activation='relu')(dense1)
    dense2 = tf.keras.layers.Dropout(0.1)(dense2)

    mlp_output = tf.keras.layers.Dense(1)(dense2)

    # Combine everything
    output = tf.keras.layers.Add()([dot, mlp_output, user_bias, fan_bias])
    output = tf.keras.layers.Activation('sigmoid')(output)

    model = tf.keras.Model(
        inputs=[user_input, fan_input],
        outputs=output
    )

    model.compile(
        optimizer=tf.keras.optimizers.Adam(0.001),
        loss='binary_crossentropy',
        metrics=['AUC']
    )

    return model