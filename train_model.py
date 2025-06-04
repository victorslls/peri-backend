import pandas as pd
from pymongo import MongoClient
from xgboost import XBGClassifier
from sklearn.preprocessing import OneHotEncoder, LabelEncoder
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
import pickle

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