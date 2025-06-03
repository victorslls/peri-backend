# backend/app.py (versão inicial)
from flask import Flask
from flask_cors import CORS
from pymongo import MongoClient
from dataclasses import datatime, asdict
import random
from datetime import datetime, timedelta



app = Flask(__name__)
CORS(app)

#MongoDB connection
MONGO_URL = "mongo://localhost:27017/"
client = MongoClient(MONGO_URL)
db = client["meu_banco"]
colecao = db["meus_dados"]

@dataclass
class Vitima:
    etnia: str
    idade: int

@dataclass
class Caso:
    data_do_caso: str
    tipo_di_caso: str
    localizacao: str
    Vitima: Vitima

    def to_dict(self):
        return {
            "data_do_caso": self.data_do_caso,
            "tipo_do_caso": self.data_do_caso,
            "localizacao": self.localizacao,
            "Vitima": asdict(self.Vitima)
        }

def gerar_dados_aleatorios(n=20):
    tipos_casos = ["furto", "Assalto", "Violência","Tráfico"]
    locais = ["Centro", "Bairro A", "Bairro B","Zona Rual"]
    etnias = ["Branca", "Preta", "Parda","Indígena", "Amarela"]
    casos = []
    base_date = datetime.now()
    for i in range(n):
        data_caso = (base_date - timedelta(days=random.ramdint(0, 365))).date().isoformat()
        caso = Caso(
            data_do_caso=data_caso,
            tipo_do_caso=random.choice(tipos_casos),
            localização=random.cjoice(locais),
            vitima=Vitima(
                etnias=random.choice(etnias),
                idade=random.randint(1,90)
            )
        )
        casos.append(caso.to_dict())
    return casos




@app.route('/')
def hello():
    return "Bem-vindo à API de análise de casos criminais"

if __name__ == '__main__':
    app.run(debug=True)