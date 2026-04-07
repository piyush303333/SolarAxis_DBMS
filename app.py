from flask import Flask, render_template, request, redirect, session, url_for
import mysql.connector
from werkzeug.security import generate_password_hash, check_password_hash

app = Flask(__name__)
app.secret_key = "solar_topper_key"

def get_db():
    return mysql.connector.connect(host="127.0.0.1", user="root", password="", database="solar_db")

@app.route('/')
def home():
    return render_template('index.html') # Tera premium landing page

@app.route('/signup', methods=['GET', 'POST'])
def signup():
    if request.method == 'POST':
        name, email = request.form['name'], request.form['email']
        password = generate_password_hash(request.form['password'])
        phone, address = request.form['phone'], request.form['address']
        ctype = request.form['connection_type']
        
        db = get_db(); cursor = db.cursor()
        cursor.execute("INSERT INTO users (name, email, password, phone, address, connection_type) VALUES (%s,%s,%s,%s,%s,%s)", 
                       (name, email, password, phone, address, ctype))
        db.commit(); return redirect(url_for('login'))
    return render_template('signup.html')

@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        email, password = request.form['email'], request.form['password']
        db = get_db(); cursor = db.cursor(dictionary=True)
        cursor.execute("SELECT * FROM users WHERE email=%s", (email,))
        user = cursor.fetchone()
        if user and check_password_hash(user['password'], password):
            session['user_id'] = user['customer_id']
            session['role'] = user['role']
            session['name'] = user['name']
            return redirect(url_for('admin_dash' if user['role'] == 'admin' else 'user_dash'))
        return "Ghalat details!"
    return render_template('login.html')






@app.route('/admin_dashboard')
def admin_dash():
    # Security: Sirf Admin hi ye page dekh sake
    if session.get('role') != 'admin':
        return redirect(url_for('login'))
    
    db = get_db()
    cursor = db.cursor(dictionary=True)
    
    # 1. Total kitne log registered hain
    cursor.execute("SELECT COUNT(*) as total FROM users WHERE role='customer'")
    user_count = cursor.fetchone()['total']
    
    # 2. Saare users ki details (Name, Email, Phone)
    cursor.execute("SELECT customer_id, name, email, phone, connection_type FROM users WHERE role='customer' ORDER BY customer_id DESC")
    all_users = cursor.fetchall()
    
    return render_template('admin_dashboard.html', count=user_count, users=all_users)



















@app.route('/user_dashboard')
def user_dash():
    if 'user_id' not in session: return redirect(url_for('login'))
    uid = session['user_id']
    db = get_db(); cursor = db.cursor(dictionary=True)
    
    cursor.execute("SELECT * FROM users WHERE customer_id=%s", (uid,))
    user_data = cursor.fetchone()
    cursor.execute("SELECT * FROM panels WHERE customer_id=%s", (uid,))
    panels = cursor.fetchall()
    cursor.execute("SELECT * FROM billing WHERE customer_id=%s", (uid,))
    bills = cursor.fetchall()
    
    return render_template('user_dashboard.html', u=user_data, panels=panels, bills=bills)

@app.route('/logout')
def logout():
    session.clear(); return redirect(url_for('login'))

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8000, debug=True)