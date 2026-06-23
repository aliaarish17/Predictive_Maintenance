import os
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score, classification_report
import xgboost as xgb
import pickle

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
df = pd.read_csv(os.path.join(BASE_DIR, "data", "ai4i2020.csv"))

print(" Data loaded!", df.shape)

X = df[['Air temperature [K]',
        'Process temperature [K]',
        'Rotational speed [rpm]',
        'Torque [Nm]',
        'Tool wear [min]']]

X.columns = ['air_temp', 'process_temp', 'rotational_speed', 'torque', 'tool_wear']

y = df['Machine failure']

X_train, X_test, y_train, y_test = train_test_split(X, y, 
                                                    test_size=0.2,
                                                      random_state=42)

model = xgb.XGBClassifier(n_estimators=100, 
                          max_depth=6, 
                          learning_rate=0.1, 
                          random_state=42)

model.fit(X_train, y_train)

print(" Model trained!")

y_pred = model.predict(X_test)
print("Accuracy:", accuracy_score(y_test, y_pred))
print(classification_report(y_test, y_pred))

os.makedirs(os.path.join(BASE_DIR, "models"), exist_ok=True)
pickle.dump(model, open(os.path.join(BASE_DIR, "models", "failure_model.pkl"), "wb"))
print("Model saved!")