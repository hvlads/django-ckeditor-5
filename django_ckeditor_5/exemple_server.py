#!/usr/bin/env python3

import os
from http.server import HTTPServer, SimpleHTTPRequestHandler
from json import dumps

class RequestHandler(SimpleHTTPRequestHandler):

  def send_dict_response(self, d):
      self.wfile.write(bytes(dumps(d), "utf8"))

  def do_GET(self):
      self.send_response(200)
      super().do_GET()


  def do_POST(self):
      self.send_response(200)
      #self._send_cors_headers()
      self.send_header("Content-Type", "application/json")
      response = {}
      response['url'] = 'https://avatars0.githubusercontent.com/u/10467081?s=400&v=4'
      self.end_headers()
      dataLength = int(self.headers["Content-Length"])
      data = self.rfile.read(dataLength)
      print(data)
      response["status"] = "OK"
      self.send_dict_response(response)


print("Starting server")
httpd = HTTPServer(("127.0.0.1", 8000), RequestHandler)
print("Hosting server on port 8000")
httpd.serve_forever()

