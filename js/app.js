// app.js : ouverture modal, compteur visits, estimation simple
document.addEventListener('DOMContentLoaded', () => {
  // year
  document.getElementById('year').textContent = new Date().getFullYear();

  // modal controls
  const modal = document.getElementById('booking-modal');
  const btns = [document.getElementById('btn-book'), document.getElementById('hero-book')];
  btns.forEach(b => b && b.addEventListener('click', ()=> openModal()));
  document.getElementById('close-modal').addEventListener('click', closeModal);
  modal.addEventListener('click', (e)=>{ if(e.target===modal) closeModal();});
  function openModal(){ modal.setAttribute('aria-hidden','false'); }
  function closeModal(){ modal.setAttribute('aria-hidden','true'); }

  // CountAPI visits
  fetch('https://api.countapi.xyz/hit/elite-luxury-transfer-paris/visites')
    .then(r=>r.json()).then(data=>{
      document.getElementById('visits').innerText = data.value ?? '—';
    }).catch(()=>{ /* ignore */ });

  // Estimation simple
  const form = document.getElementById('booking-form');
  const estimateBtn = document.getElementById('estimate-btn');
  const estimateEl = document.getElementById('estimate');

  // Pricing params (exemple) : prix au km par véhicule + frais fixes
  const pricing = {
    'classe-e': { per_km: 1.3, base: 25 },
    'classe-v': { per_km: 1.7, base: 35 }
  };

  // fallback distance estimate (si pas d'API) : 10km fixe pour démonstration
  function estimateDistanceFallback(){
    return 10; // km
  }

  async function calculateEstimate(formData){
    // Si tu souhaites utiliser l'API Google Distance Matrix,
    // tu dois appeler un backend pour ne pas exposer la clé.
    // Ici on propose une estimation simple.
    const vehicle = formData.get('vehicle');
    // tentative : si tu avais une API pour distance réelle, la remplacer ici.
    const distance = estimateDistanceFallback();
    const p = pricing[vehicle];
    const price = Math.round((p.base + distance * p.per_km) * 100) / 100;
    return { distance, price };
  }

  estimateBtn.addEventListener('click', async ()=>{
    const data = new FormData(form);
    estimateEl.textContent = 'Calcul en cours…';
    try{
      const r = await calculateEstimate(data);
      estimateEl.textContent = `Prix estimé : ${r.price} € (distance estimée : ${r.distance} km)`;
    }catch(e){
      estimateEl.textContent = 'Impossible d\'estimer pour le moment.';
    }
  });

  // Submit: utiliser Netlify forms or fetch to backend
  form.addEventListener('submit', async (e)=>{
    e.preventDefault();
    const fd = new FormData(form);

    // Exemple : on envoie une requête POST vers une fonction Netlify (à créer)
    // fetch('/.netlify/functions/book', { method: 'POST', body: fd })
    //  .then(...)

    // Pour l'instant, simple comportement : ouvrir un mailto ou envoyer vers Netlify Forms (si configuré)
    alert('Merci — votre demande a été reçue. Nous vous contacterons rapidement.');
    closeModal();
  });
});
