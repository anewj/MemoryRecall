import nltk
from nltk.stem.lancaster import LancasterStemmer
import numpy as np # initialize numpy arrays from nested Python lists
import tflearn #deep learning library
import tensorflow as tf
import json
import pickle # way to convert a python object (list, dict, etc.) into a character stream.
import sys
import os

dir_path = os.path.dirname(os.path.realpath(__file__)) + "/"

sent = sys.stdin.readlines()

words = []

# read the json file and load the training data
with open(dir_path+'data.json') as json_data:
    data = json.load(json_data)

# get a list of all categories to train for
with open(dir_path+"categories.txt", "rb") as fp:   # Unpickling
    categories = pickle.load(fp)


with open(dir_path+"words.txt", "rb") as fp:   # Unpickling
   words = pickle.load(fp)


training = np.load(dir_path+"training_data.npy")

stemmer = LancasterStemmer()

# trainX contains the Bag of words and train_y contains the label/ category
train_x = list(training[:, 0])
train_y = list(training[:, 1])


# reset underlying graph data
tf.reset_default_graph()
# Build neural network
net = tflearn.input_data(shape=[None, len(train_x[0])])
net = tflearn.fully_connected(net, 8)
net = tflearn.fully_connected(net, 8)
net = tflearn.fully_connected(net, len(train_y[0]), activation='softmax')
net = tflearn.regression(net)

# Define model and setup tensorboard
model = tflearn.DNN(net, tensorboard_dir='tflearn_logs')
model.load(dir_path+'model.tflearn')


def get_tf_record(sentence):
    global words
    # tokenize the pattern
    sentence_words = nltk.word_tokenize(sentence)
    # stem each word
    sentence_words = [stemmer.stem(word.lower()) for word in sentence_words]
    # bag of words
    bow = [0]*len(words)
    for s in sentence_words:
        for i, w in enumerate(words):
            if w == s:
                bow[i] = 1

    return(np.array(bow))


# PREDICT THE SENTENCE
print(categories[np.argmax(model.predict([get_tf_record(sent[0])]))])

