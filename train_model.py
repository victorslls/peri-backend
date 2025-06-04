import pandas as pd
from pymongo import MongoClient
from xgboost import XBGClassifier
from sklearn.preprocessing import OneHotEncoder, LabelEncoder
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
import pickle
from flask import request, abort

#1. Conectar o MongoDB e puxar dados
client = MongoClient("mongodb://localhost:27017/")
db = client["meu_banco"]
colecao = db["meus_dados"]

dados = list(colecao.find({}, {"_id": 0}))

lista = []
for d  in dados:
    lista.append({
        "idade": d["vitima"]["idade"]
        "idade": d["vitima"]["etnia"]
        "localizacao": d["localizacao"]
        "tipo_de_caso": d["tipo_do_caso"]  
    })

df = pd.DataFrame(lista)

#3 Variaveis explicativas e alvo

x = df[["idade", "etnia", "localização"]]
y = df[["tipo_do_caso"]]

#4. Encode da variável
label_encoder = LabelEncoder()
y_encoded = label_encoder.fit_transform(y)

# 5 pipeli

categorical_features = ["etnia", "localizacao"]
numeric_features = ["idade"]

preprocessor = ColumnTransformer(
    transformers=[
        ("cat", OneHotEncoder(handle_unknown='ignore'), categorical_features),
        ("nuum", "passthrough", numeric_features)
    ]
)

pipeline = Pipeline([
    ("preprocessor", preprocessor),
    ("classifier", XBGClassifier(use_label_encoder=False, eval_metric='mlogloos'))
])

#6 treinar 

pipeline.fit(x,y_encoded)

# 7 Salvar pipelone = label encoder

with open("model.pkl", "wb") as f:
    pickle.dump([
        "pipeline": pipeline,
        "label_encoder" : label_encoder
    ], f)

print("Modelo treinado e salvo em model.pkl")

# 8 



