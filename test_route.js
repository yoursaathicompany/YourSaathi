fetch('http://localhost:3000/api/antigravity/generate-quiz', { method: 'POST', body: '{}' }).then(res => res.json()).then(console.log);
