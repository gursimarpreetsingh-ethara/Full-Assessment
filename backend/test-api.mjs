import http from 'http';
import fs from 'fs';

// Read JWT token from a quick login first
const loginData = JSON.stringify({ email: 'testuser123@example.com', password: 'password123' });

const loginReq = http.request({
  hostname: 'localhost', port: 5000, path: '/api/auth/login',
  method: 'POST',
  headers: { 'Content-Type': 'application/json', 'Content-Length': loginData.length }
}, (res) => {
  let body = '';
  res.on('data', d => body += d);
  res.on('end', () => {
    const parsed = JSON.parse(body);
    const token = parsed.token;
    if (!token) { console.log('Login failed:', body); return; }

    // Now test dashboard
    const dashReq = http.request({
      hostname: 'localhost', port: 5000, path: '/api/dashboard',
      method: 'GET',
      headers: { 'Authorization': `Bearer ${token}` }
    }, (r2) => {
      let b2 = '';
      r2.on('data', d => b2 += d);
      r2.on('end', () => console.log('Dashboard status:', r2.statusCode, '\nBody:', b2));
    });
    dashReq.on('error', e => console.error('Dashboard error:', e.message));
    dashReq.end();
  });
});
loginReq.on('error', e => console.error('Login error:', e.message));
loginReq.write(loginData);
loginReq.end();
