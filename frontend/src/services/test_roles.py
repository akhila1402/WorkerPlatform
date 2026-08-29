import requests

# Login as Admin
login_url = "http://localhost:8080/auth/login"
login_payload = {
    "email": "admin@gmail.com",
    "password": "admin123"
}

print("Logging in as Admin...")
login_resp = requests.post(login_url, json=login_payload)
if login_resp.status_code != 200:
    print("Login failed:", login_resp.text)
    exit(1)

token = login_resp.json().get("token")
headers = {
    "Authorization": f"Bearer {token}",
    "Content-Type": "application/json"
}

# Fetch all users
users_resp = requests.get("http://localhost:8080/user/getAll", headers=headers)
if users_resp.status_code == 200:
    users = users_resp.json()
    print("\nUsers roles:")
    for u in users:
        print(f"  ID: {u.get('id')}, Email: {u.get('email')}, Role: {u.get('role')}")
else:
    print("Failed to fetch users:", users_resp.text)

# Fetch all workers
workers_resp = requests.get("http://localhost:8080/worker/getAll", headers=headers)
if workers_resp.status_code == 200:
    workers = workers_resp.json()
    print("\nWorkers roles:")
    for w in workers:
         print(f"  ID: {w.get('id')}, Email: {w.get('email')}, Role: {w.get('role')}")
else:
    print("Failed to fetch workers:", workers_resp.text)

