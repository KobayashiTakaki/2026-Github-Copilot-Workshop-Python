import unittest
import sys
import os
sys.path.insert(0, os.path.abspath(os.path.dirname(__file__)))
from app import app

class TestPomodoroApp(unittest.TestCase):
    def setUp(self):
        app.config['TESTING'] = True
        self.client = app.test_client()

    def test_index_route(self):
        response = self.client.get('/')
        self.assertEqual(response.status_code, 200)
        self.assertIn(b'html', response.data)  # index.htmlの内容に応じて修正可

if __name__ == '__main__':
    unittest.main()
