import requests
import json
from settings import API_KEY
from settings import job_id

data = {"column1": 'heloworld', 'collumn2': 'helloworld2'}

request_url = "https://api.crowdflower.com/v1/jobs/{}/units.json".format(job_id)
headers = {'content-type': 'application/json'}

payload = {
    'key': API_KEY,
    'unit': {
        'data':data
    }
}

r = requests.post(request_url, data = json.dumps(payload), headers = headers)
print r.text
print r.status_code