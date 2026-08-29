import requests

# Login as User
login_url = "http://localhost:8080/auth/login"
login_payload = {
    "email": "onboard@example.com",
    "password": "password123"
}

print("Logging in as onboard@example.com...")
login_resp = requests.post(login_url, json=login_payload)
print(f"Login Status: {login_resp.status_code}")
if login_resp.status_code != 200:
    print(login_resp.text)
    exit(1)

token = login_resp.json().get("token")
print(f"Token: {token[:20]}...")

headers = {
    "Authorization": f"Bearer {token}",
    "Content-Type": "application/json"
}

app_id = "6a3ba3273f8e4c963815448b"
print(f"Attempting to accept application {app_id}...")
accept_resp = requests.post(f"http://localhost:8080/application/accept/{app_id}", headers=headers)
print("Accept status:", accept_resp.status_code)
print("Accept body:", accept_resp.text)

