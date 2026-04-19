// assets/js/supabase-client.js
// Wird NACH dem CDN-Script-Tag geladen – supabase ist dann global verfügbar

const SUPABASE_URL  = 'https://kalonkzgzbpsndkuznqp.supabase.co';   // ← anpassen
const SUPABASE_ANON = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImthbG9ua3pnemJwc25ka3V6bnFwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU0NjkxMjQsImV4cCI6MjA5MTA0NTEyNH0.FChiR30MGNLUv3L2hSi-d-hNTg8pVLoMNN5XgWrX1ZQ';          // ← anpassen

const { createClient } = supabase;
const db = createClient(SUPABASE_URL, SUPABASE_ANON);

// db global verfügbar machen, damit blog.html und login.html es nutzen können
window._supabase = db;