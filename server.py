import http.server
import socketserver
import os
import sys

PORT = 8000
DIRECTORY = os.path.dirname(os.path.abspath(__file__))

class Handler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIRECTORY, **kwargs)
        
    def end_headers(self):
        # Enable CORS and disable browser caching for smooth live coding/testing
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Cache-Control', 'no-cache, no-store, must-revalidate')
        self.send_header('Pragma', 'no-cache')
        self.send_header('Expires', '0')
        super().end_headers()

# Move execution context to the file directory
os.chdir(DIRECTORY)

print("=" * 65)
print("   Aetheris Voyage Space Flight Customer Center Server Initialized")
print("=" * 65)
print(f"   Launch URL  : http://localhost:{PORT}")
print(f"   Directory   : {DIRECTORY}")
print("   Status      : Telemetry systems active, waiting for connection...")
print("=" * 65)
print("Press Ctrl+C to terminate orbital uplink.")

with socketserver.TCPServer(("", PORT), Handler) as httpd:
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\nShutting down space server. Telemetry link closed.")
        sys.exit(0)
