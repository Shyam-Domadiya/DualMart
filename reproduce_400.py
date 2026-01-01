import urllib.request
import urllib.error
import json

base_url = 'http://127.0.0.1:8000/api'

def send_request(url, method='POST', data=None, headers={}):
    try:
        req = urllib.request.Request(url, method=method)
        for k, v in headers.items():
            req.add_header(k, v)
        
        if data:
            req.add_header('Content-Type', 'application/json')
            jsondata = json.dumps(data).encode('utf-8')
            req.data = jsondata
            
        with urllib.request.urlopen(req) as response:
            return response.getcode(), response.read().decode('utf-8')
    except urllib.error.HTTPError as e:
        return e.code, e.read().decode('utf-8')
    except Exception as e:
        return 0, str(e)

def run():
    # 1. Register Supplier
    supplier_data = {
        'username': 'testsupplier_urllib',
        'email': 'debug_urllib@test.com',
        'password': 'password123',
        'role': 'supplier'
    }
    code, text = send_request(f'{base_url}/auth/register/', data=supplier_data)
    # Ignore if already exists (likely 400)

    # 2. Login
    code, text = send_request(f'{base_url}/auth/login/', data={
        'username': 'testsupplier_urllib',
        'password': 'password123'
    })
    
    if code != 200:
        print(f"Login failed: {code} {text}")
        return

    token = json.loads(text)['access']
    headers = {'Authorization': f'Bearer {token}'}

    # 3. Post Product with EMPTY description
    product_data = {
        'name': 'Test Product',
        'description': '', # Empty!
        'price': '10.50',
        'stock': 100
    }
    
    print("--- Testing Empty Description ---")
    code, text = send_request(f'{base_url}/products/', data=product_data, headers=headers)
    print(f"Status: {code}")
    print(f"Response: {text}")

    # 4. Post Product with Valid description
    product_data['description'] = 'Valid description'
    print("\n--- Testing Valid Description ---")
    code, text = send_request(f'{base_url}/products/', data=product_data, headers=headers)
    print(f"Status: {code}")
    print(f"Response: {text}")

if __name__ == '__main__':
    run()
