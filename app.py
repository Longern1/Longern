from flask import Flask, request, jsonify, render_template, redirect, url_for
import psycopg2
import random  
import string  

app = Flask(__name__)

# Configuración de la base de datos
db_config = {
    'host': 'dpg-cum1hb5umphs738ba2n0-a',
    'user': 'longern_user',
    'password': 'fcW5rRgFTfKw5ve3Qe5ZyrJIFJpRCE2Q',
    'database': 'longern',
    'port': '5432'  # Puerto por defecto de PostgreSQL
}



# Función para obtener conexión a la base de datos
def get_db_connection():
    return psycopg2.connect(
        host=db_config['host'],
        database=db_config['database'],
        user=db_config['user'],
        password=db_config['password'],
        port=db_config['port']
    )

@app.route('/')
def index():
    return render_template('Longern.html')  

@app.route('/camisetas')
def camisetas():
    return render_template('Camisetas.html')  

@app.route('/pago')
def pago():
    return render_template('pago.html')  

def generate_order_code(length=10):
    return ''.join(random.choices(string.ascii_uppercase + string.digits, k=length))

@app.route('/process-payment', methods=['POST'])
def process_payment():
    data = request.get_json()
    full_name = data.get('fullName')
    cedula = data.get('cedula')
    city = data.get('city')
    address = data.get('address')
    payment_method = data.get('paymentMethod')
    cart = data.get('cart')

    order_code = generate_order_code()

    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute('''
            UPDATE payments SET order_code = %s, order_status = 'En preparación' 
            WHERE full_name = %s AND cedula = %s
        ''', (order_code, full_name, cedula))
        
        if cursor.rowcount == 0:  
            cursor.execute('''
                INSERT INTO payments (full_name, cedula, city, address, payment_method, cart_details, order_code)
                VALUES (%s, %s, %s, %s, %s, %s, %s)
            ''', (full_name, cedula, city, address, payment_method, str(cart), order_code))
        
        conn.commit()
        return jsonify({'status': 'success', 'order_code': order_code}), 200
    except Exception as e:
        return jsonify({'status': 'error', 'message': str(e)}), 500
    finally:
        cursor.close()
        conn.close()

@app.route('/order-details/<order_code>', methods=['GET'])
def order_details(order_code):
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute('SELECT * FROM payments WHERE order_code = %s', (order_code,))
        order = cursor.fetchone()
        
        if not order:
            return "Código de pedido no encontrado.", 404
        
        return render_template('order_details.html', order=order)
    except Exception as e:
        return f"Error: {str(e)}", 500
    finally:
        cursor.close()
        conn.close()

@app.route('/track-order', methods=['GET', 'POST'])
def track_order():
    if request.method == 'POST':
        order_code = request.form.get('order_code')
        try:
            conn = get_db_connection()
            cursor = conn.cursor()
            cursor.execute('SELECT * FROM payments WHERE order_code = %s', (order_code,))
            order = cursor.fetchone()
            
            if not order:
                return render_template('track_order.html', error="Código no encontrado.")
            return render_template('order_details.html', order=order)
        except Exception as e:
            return f"Error: {str(e)}", 500
        finally:
            cursor.close()
            conn.close()
    return render_template('track_order.html')

if __name__ == '__main__':
    app.run(debug=True)
