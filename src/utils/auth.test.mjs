// utils/auth.test.mjs — logique d'expiration du token (sans navigateur).
// Usage : node utils/auth.test.mjs
//
// `isTokenExpired` évite la coquille vide au refresh : quand le JWT stocké est
// déjà périmé, RequireRole renvoie au login immédiatement au lieu d'attendre le
// premier appel API en 401.
//
// Convention du repo (cf. src/forms/etapes.test.mjs) : pas d'import réel de
// modules ESM/Vite (chemins sans extension non résolvables en Node nu). On
// vérifie donc (1) la présence de la garde dans le source et (2) la logique de
// décodage `exp` reproduite à l'identique.
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const ici = dirname(fileURLToPath(import.meta.url));
const srcAuth = readFileSync(join(ici, 'auth.js'), 'utf8');
const srcGuard = readFileSync(join(ici, '..', 'components', 'RequireRole.js'), 'utf8');

let ko = 0;
const check = (libelle, reel, attendu) => {
  const ok = reel === attendu;
  if (!ok) ko++;
  console.log(`  ${ok ? 'OK  ' : 'FAIL'} ${libelle} -> ${reel}`);
};

// --- Logique reproduite à l'identique de auth.js#isTokenExpired -------------
// On l'isole ici pour la tester réellement, sans dépendre de l'import ESM.
const isTokenExpired = (token, nowMs = Date.now()) => {
  if (!token) return true;
  try {
    const payload = token.split('.')[1];
    if (!payload) return false;
    const json = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8'));
    if (!json.exp) return false;
    return json.exp * 1000 <= nowMs;
  } catch {
    return false;
  }
};

const fakeJwt = (expSec) => {
  const b64 = (o) => Buffer.from(JSON.stringify(o)).toString('base64url');
  return `${b64({ alg: 'HS256' })}.${b64({ exp: expSec })}.sig`;
};
const maintenantSec = () => Math.floor(Date.now() / 1000);

console.log('== isTokenExpired : décodage du JWT ==');
check('aucun token -> expiré', isTokenExpired(null), true);
check('token encore valide -> non expiré', isTokenExpired(fakeJwt(maintenantSec() + 3600)), false);
check('token dépassé -> expiré', isTokenExpired(fakeJwt(maintenantSec() - 1)), true);

const sansExp = `${Buffer.from('{}').toString('base64url')}.${Buffer.from(JSON.stringify({ matricule: 'EMP001' })).toString('base64url')}.sig`;
check('token sans exp -> non expiré (laissé au backend)', isTokenExpired(sansExp), false);
check('token illisible -> toléré, non expiré', isTokenExpired('pas-un-jwt'), false);

console.log('== Garde-fous dans le code ==');
check('auth.js expose isTokenExpired', /export const isTokenExpired/.test(srcAuth), true);
check('auth.js lit le champ exp', /json\.exp/.test(srcAuth), true);
check('RequireRole teste isTokenExpired', srcGuard.includes('isTokenExpired()'), true);
check('RequireRole nettoie la session si expiré', /isTokenExpired\(\)[\s\S]{0,80}clearSession\(\)/.test(srcGuard), true);
check('RequireRole renvoie vers /login', srcGuard.includes('to="/login"'), true);

console.log(ko === 0 ? '\n✅ TOUS LES TESTS PASSENT' : `\n❌ ${ko} ECHEC(S)`);
process.exit(ko === 0 ? 0 : 1);

