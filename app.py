import os
import random
import string
from flask import Flask, request, jsonify, render_template
from flask_sqlalchemy import SQLAlchemy
from dotenv import load_dotenv

# Cargar variables de entorno
load_dotenv()

app = Flask(__name__)

# Configuración de la base de datos en Render
DB_USER = "longern_user"
DB_PASSWORD = "tu_contraseña"  # Copia la contraseña de la imagen
DB_HOST = "dpg-cum1hb5umphs738ba2n0-a"
DB_NAME = "longern"
DB_PORT = "5432"

app.config["SQLALCHEMY_DATABASE_URI"] = f"postgresql://{DB_USER}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}/{DB_NAME}"
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

db = SQLAlchemy(app)

# Modelo de Usuarios
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
@app.route('/test-db')
def test_db():
    try:
        db.session.execute("SELECT 1")
        return "Conexión exitosa a PostgreSQL en Render"
    except Exception as e:
        return f"Error conectando a PostgreSQL: {str(e)}"

# Modelo de Pagos
class Payment(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    full_name = db.Column(db.String(200), nullable=False)
    cedula = db.Column(db.String(20), nullable=False)
    city = db.Column(db.String(100), nullable=False)
    address = db.Column(db.String(255), nullable=False)
    payment_method = db.Column(db.String(50), nullable=False)
    cart_details = db.Column(db.Text, nullable=False)
    order_code = db.Column(db.String(20), unique=True, nullable=False)
    order_status = db.Column(db.String(50), default='En preparación')

# Crear las tablas en la BD
with app.app_context():
    db.create_all()

print("Base de datos conectada y tablas creadas.")

# Función para generar código de pedido aleatorio
def generate_order_code(length=10):
    return ''.join(random.choices(string.ascii_uppercase + string.digits, k=length))

# Rutas de la aplicación
@app.route('/')
def index():
    return render_template('Longern.html')

@app.route('/camisetas')
def camisetas():
    return render_template('Camisetas.html')

@app.route('/pago')
def pago():
    return render_template('pago.html')

# Procesar el pago y guardar pedido en la base de datos
@app.route('/process-payment', methods=['POST'])
def process_payment():
    data = request.get_json()
    order_code = generate_order_code()

    try:
        existing_payment = Payment.query.filter_by(full_name=data['fullName'], cedula=data['cedula']).first()

        if existing_payment:
            existing_payment.order_code = order_code
            existing_payment.order_status = "En preparación"
        else:
            new_payment = Payment(
                full_name=data['fullName'],
                cedula=data['cedula'],
                city=data['city'],
                address=data['address'],
                payment_method=data['paymentMethod'],
                cart_details=str(data['cart']),
                order_code=order_code
            )
            db.session.add(new_payment)

        db.session.commit()
        return jsonify({'status': 'success', 'order_code': order_code}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'status': 'error', 'message': str(e)}), 500

# Consultar detalles de un pedido por código
@app.route('/order-details/<order_code>', methods=['GET'])
def order_details(order_code):
    try:
        order = Payment.query.filter_by(order_code=order_code).first()

        if not order:
            return "Código de pedido no encontrado.", 404

        return render_template('order_details.html', order=order)
    except Exception as e:
        return f"Error: {str(e)}", 500

# Rastrear pedido ingresando el código
@app.route('/track-order', methods=['GET', 'POST'])
def track_order():
    if request.method == 'POST':
        order_code = request.form.get('order_code')
        order = Payment.query.filter_by(order_code=order_code).first()

        if not order:
            return render_template('track_order.html', error="Código no encontrado.")
        return render_template('order_details.html', order=order)

    return render_template('track_order.html')

if __name__ == '__main__':
    app.run(debug=True)
