import sys
import joblib
import pandas as pd
import numpy as np
import sklearn
import pickle


def main():
    # Take data from the arguments
    data = [sys.argv[1:]]
    filename = '/Users/micheletamborrino/WebstormProjects/iotdash/finalized_model.sav'
    # Load the model with that filename
    model = pickle.load(open(filename, 'rb'))
    # print(data)
    # Build the dataframe to feed to the prediction function
    df = pd.DataFrame(data, columns=[' HR (BPM)', ' RESP (BPM)', ' SpO2 (%)', 'TEMP (*C)'])
    # Sklearn needs float32-type values
    z = df.astype(np.float32)
    # print(z)
    # Predict
    prediction = model.predict(z)
    # Print the prediction
    print(prediction)


main()