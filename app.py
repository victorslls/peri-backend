# backend/app.py (versão inicial)
from flask import Flask
from flask_cors import CORS
from pymongo import MongoClient
from dataclasses import datatime, asdict
import random
from datetime import datetime, timedelta
from flask import request, abort, jsonify





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

def validar_caso_json(data):
    try:
        vitima = data ["vitima"]
        assert isinstance(vitima, dict)
        assert all(k in vitima for k in ("etnia", "idade"))
        datatime.fromisoformat(data["data_do_caso"])
        assert isinstance(data["tipo_do_caso"], str)
        assert isinstance(data["localizacao"], str)
    except:
        return False
    return True

if __name__ == "__main__":
    if colecao.count_documents({}) == 0:
        print("Inserido dados iniciais...")
        dados_iniciais = gerar_dados_aleatorios(20)
        colecao.insert_many(dados_iniciais)
    app.run(debug=True)




@app.route('/api/casos', methods=['GET'])
def listar_casos():
    documentos = list(colecao.fin({}, {"_id":0}))
    return jsonify(documentos), 200

@app.route('/api/casos', methods=['POST'])
def criar_caso():
    data = request.get_json()
    if not data or not validar_caso_json(data):
        abort(400, "JSON inválido ou campos faltando.")
    colecao.insert_one(data)
    return jsonify({"message": "Caso criado com sucesso"}), 201

@app.route('/api/casos/<string:data_caso>', methods=['GET'])
def buscar_caso(data_caso):
    caso = colecao.find_one({"data_do_caso": data_caso}, {"_id": 0})
    if not caso:
        abort(404, "Caso não encontrado.")
    return jsonify(caso), 200

@app.route('/api/casos/<string:data_caso>', methods=['DELETE'])
def deletar_caso(data_caso):
    resultado = colecao.delete_one({"data_do_caso": data_caso})
    if resultado.deleted_count == 0:
        abort(404, "Caso não encontrado.")
    return jsonify({"message": "Caso deletado"}), 200


def hello():
    return "Bem-vindo à API de análise de casos criminais"

if __name__ == '__main__':
    app.run(debug=True)