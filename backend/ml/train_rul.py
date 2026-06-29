import os
import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import MinMaxScaler
from sklearn.metrics import mean_absolute_error, mean_squared_error
import xgboost as xgb
import pickle

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

# STEP 1: PANDAS - Data load karo (FIXED separator)
columns = ['engine_id', 'cycle', 'setting1', 'setting2', 'setting3'] + \
          [f'sensor{i}' for i in range(1, 22)]

df = pd.read_csv(os.path.join(BASE_DIR, "data", "train_FD001.txt"),
                  sep=r"\s+",
                   header=None, 
                   names=columns, 
                   engine='python')

print("✅ Data loaded!", df.shape)
print(df.columns.tolist())
print(df.head())

# STEP 2: FEATURE ENGINEERING - RUL column banao

max_cycles = df.groupby('engine_id')['cycle'].max().reset_index()
max_cycles.columns = ['engine_id', 'max_cycle']

df = df.merge(max_cycles, on='engine_id')
df['RUL'] = df['max_cycle'] - df['cycle']
df.drop('max_cycle', axis=1, inplace=True)

print("✅ RUL column added!")
print(df[['engine_id', 'cycle', 'RUL']].head(10))

# STEP 3: PANDAS - Features select karo

drop_cols = ['engine_id', 'cycle', 'setting1', 'setting2', 'setting3',
             'sensor1', 'sensor5', 'sensor6', 'sensor10', 'sensor16',
             'sensor18', 'sensor19']

X = df.drop(drop_cols + ['RUL'], axis=1)
y = df['RUL']

print("✅ Features shape:", X.shape)
print("Feature columns:", X.columns.tolist())

# STEP 4: SKLEARN - Train/test split

X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)

# STEP 5: SKLEARN - Feature scaling

scaler = MinMaxScaler()
X_train_scaled = scaler.fit_transform(X_train)
X_test_scaled = scaler.transform(X_test)

print("✅ Scaling done!")

# STEP 6: XGBOOST - Model train karo

model = xgb.XGBRegressor(
    n_estimators=100,
    max_depth=6,
    learning_rate=0.1,
    random_state=42
)

model.fit(X_train_scaled, y_train)
print("✅ Model trained!")

# STEP 7: SKLEARN - Accuracy check karo

y_pred = model.predict(X_test_scaled)

mae = mean_absolute_error(y_test, y_pred)
rmse = np.sqrt(mean_squared_error(y_test, y_pred))

print(f"📊 MAE  : {mae:.2f} cycles")
print(f"📊 RMSE : {rmse:.2f} cycles")

# STEP 8: PICKLE - Model + scaler save karo

os.makedirs(os.path.join(BASE_DIR, "models"), exist_ok=True)
pickle.dump(model, open(os.path.join(BASE_DIR, "models", "rul_model.pkl"), "wb"))
pickle.dump(scaler, open(os.path.join(BASE_DIR, "models", "rul_scaler.pkl"), "wb"))

print("✅ Models saved!")