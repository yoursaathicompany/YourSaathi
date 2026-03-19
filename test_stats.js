import { cookies } from 'next/headers';

fetch('http://localhost:3000/api/user/stats', {
  headers: {
    // We need a session, so this direct fetch might fail without cookie 
    // We can just add a console.log into the route.ts to see what it's generating
  }
})
