from flask import Flask, request, jsonify
from flasgger import Swagger
from datetime import datetime, timedelta
import os

app = Flask(__name__)

app.config['SWAGGER'] = {
   'title': 'Fraud detection service - AM BigBank',
    'uiversion': 3,
    'openapi': '3.0.0',
    'description': 'Service de detection de fraude pour les transactions bancaires',
    'version': '1.0.0'
}

swagger = Swagger(app)

transaction_history = []
fraud_alerts = []

RULES = {
    'HIGH_AMOUNT': {
        'threshold':10000,
        'description': 'Montant supérieur a 10 000 EUR'
    },
    'HIGH_FREQUENCY': {
        'max_transactions': 5,
        'window_minutes': 10,
        'description': 'Plus de 5 transactions en 10 minutes'
    },
    'ROUND_AMOUNT': {
        'description': 'Montant rond suspect, car le multiple de 1000 > 5000'
    }
}

def check_high_amount(transaction):
    amount = transaction.get('amount', 0)
    if amount > RULES['HIGH_AMOUNT']['threshold']:
        return {
            'rule': 'HIGH_AMOUNT',
            'severity': 'HIGH',
            'message': f"Montant de {amount} EUR dépasse le seuil de {RULES['HIGH_AMOUNT']['threshold']} EUR"
        }
    return None

def check_high_frequency(transaction):
    user_id = transaction.get('fromAccountId') or transaction.get('userId')
    if not user_id:
        return None
    window = datetime.now() - timedelta(minutes=RULES['HIGH_FREQUENCY']['window_minutes'])
    recent = [t for t in transaction_history
              if (t.get('fromAccountId') == user_id or t.get('userId') == user_id)
              and datetime.fromisoformat(t.get('timestamp', datetime.now().isoformat())) > window]
    if len(recent) >= RULES['HIGH_FREQUENCY']['max_transactions']:
        return {
            'rule': 'HIGH_FREQUENCY',
            'severity': 'MEDIUM',
            'message': f"Utilisateur {user_id} : {len(recent)} transactions en {RULES['HIGH_FREQUENCY']['window_minutes']} min"
        }
    return None

def check_round_amount(transaction):
    amount = transaction.get('amount', 0)
    if amount > 5000 and amount % 1000 == 0:
        return {
            'rule': 'ROUND_AMOUNT',
            'severity': 'LOW',
            'message': f"Montant rond suspect : {amount} EUR"
        }
    return None

def analyze_transaction(transaction):
    alerts = []
    for check in [check_high_amount, check_high_frequency, check_round_amount]:
        result = check(transaction)
        if result:
            alerts.append(result)
    return alerts

@app.route('/fraud/analyze', methods=['POST'])
def analyze():
    """
    Analyser une transaction pour detecter une fraude
    ---
    tags:
      - Fraud Detection
    requestBody:
      required: true
      content:
        application/json:
          schema:
            type: object
            required:
              - amount
            properties:
              transactionId:
                type: string
                example: "txn-123"
              fromAccountId:
                type: string
                example: "acc-001"
              toAccountId:
                type: string
                example: "acc-002"
              amount:
                type: number
                example: 15000
              userId:
                type: string
                example: "user-001"
    responses:
      200:
        description: Resultat de l'analyse
    """
    transaction = request.get_json()
    transaction['timestamp'] = datetime.now().isoformat()
    transaction_history.append(transaction)

    alerts = analyze_transaction(transaction)

    risk_level = 'NONE'
    if alerts:
        severities = [a['severity'] for a in alerts]
        if 'HIGH' in severities:
            risk_level = 'HIGH'
        elif 'MEDIUM' in severities:
            risk_level = 'MEDIUM'
        else:
            risk_level = 'LOW'

    result = {
        'transactionId': transaction.get('transactionId', 'unknown'),
        'isFraudulent': risk_level in ['HIGH', 'MEDIUM'],
        'riskLevel': risk_level,
        'alerts': alerts,
        'analyzedAt': datetime.now().isoformat()
    }

    if alerts:
        fraud_alerts.append(result)
        print(f"[FRAUD ALERT] {risk_level} - Transaction {result['transactionId']}: {len(alerts)} alerte(s)")
    else:
        print(f"[FRAUD OK] Transaction {result['transactionId']}: aucune alerte")

    return jsonify(result)

@app.route('/fraud/history', methods=['GET'])
def history():
    """
    Historique des transactions analysees
    ---
    tags:
      - Fraud Detection
    parameters:
      - in: query
        name: page
        schema:
          type: integer
          default: 1
      - in: query
        name: limit
        schema:
          type: integer
          default: 10
    responses:
      200:
        description: Liste paginee
    """
    page = request.args.get('page', 1, type=int)
    limit = request.args.get('limit', 10, type=int)
    offset = (page - 1) * limit
    paginated = transaction_history[offset:offset + limit]

    return jsonify({
        'data': paginated,
        'pagination': {
            'total': len(transaction_history),
            'page': page,
            'limit': limit,
            'totalPages': max(1, -(-len(transaction_history) // limit))
        }
    })


@app.route('/fraud/alerts', methods=['GET'])
def alerts():
    """
    Liste des alertes de fraude
    ---
    tags:
      - Fraud Detection
    responses:
      200:
        description: Liste des alertes
    """
    return jsonify({'data': fraud_alerts, 'total': len(fraud_alerts)})


@app.route('/fraud/stats', methods=['GET'])
def stats():
    """
    Statistiques du service de fraude
    ---
    tags:
      - Fraud Detection
    responses:
      200:
        description: Statistiques globales
    """
    total = len(transaction_history)
    fraudulent = len(fraud_alerts)
    return jsonify({
        'totalAnalyzed': total,
        'totalAlerts': fraudulent,
        'fraudRate': round(fraudulent / total * 100, 2) if total > 0 else 0,
        'rules': RULES
    })


@app.route('/fraud/health', methods=['GET'])
def health():
    """
    Health check
    ---
    tags:
      - Health
    responses:
      200:
        description: Service operationnel
    """
    return jsonify({
        'status': 'UP',
        'service': 'fraud-detection-service',
        'timestamp': datetime.now().isoformat()
    })


if __name__ == '__main__':
    port = int(os.environ.get('PORT', 3006))
    print(f"[FRAUD] Service de detection de fraude demarre sur le port {port}")
    app.run(host='0.0.0.0', port=port, debug=True)