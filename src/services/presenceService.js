import api from './http';

// ---------------------------------------------------------------------------
//  Présences — service.
//
//  Contrat aligné sur le reste de l'API : les listes retournent
//  { data, meta } (cf. services/api.js et controllers/presenceController.js).
//  Contrairement à l'ancienne version, les erreurs REMONTENT (plus de retour
//  silencieux [] qui masquait une coupure réseau ou un 403) : chaque écran
//  les affiche via useAsyncData / useFormErrors.
// ---------------------------------------------------------------------------

// GET /api/presences — historique paginé ({ data, meta }).
export const getAllPresences = (params = {}) => api.get('/presences', { params });

// GET /api/presences/:date — le pointage d'une journée ({ data }).
// Une journée sans fiche répond 200 + [] : ce n'est pas une erreur.
export const getPresencesByDate = (date) => api.get(`/presences/${date}`);

// POST /api/presences — enregistre un lot de fiches (upsert côté API :
// une seule fiche par agent et par jour).
export const savePresence = (fiches) => {
  if (!Array.isArray(fiches) || fiches.length === 0) {
    return Promise.reject(new Error('Aucune fiche de présence à enregistrer.'));
  }
  return api.post('/presences', { fiches });
};

