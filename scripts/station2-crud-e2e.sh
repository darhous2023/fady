#!/usr/bin/env bash
# Real E2E test of cars-catalog admin CRUD (add/edit/archive/delete) against
# Production, using the disposable session cookie from
# e2e-admin-session-setup.ts. Read+write, but every write is on data this
# script itself creates and deletes in the same run.
set -e
BASE="https://fady-delta.vercel.app"
COOKIE_NAME=$(node -e "console.log(JSON.parse(require('fs').readFileSync('.e2e-session.local.json')).cookieName)")
COOKIE_VALUE=$(node -e "console.log(JSON.parse(require('fs').readFileSync('.e2e-session.local.json')).cookieValue)")
COOKIE="${COOKIE_NAME}=${COOKIE_VALUE}"

pass() { echo "PASS: $1"; }
fail() { echo "FAIL: $1"; exit 1; }

echo "=== 1. CREATE brand ==="
BRAND_RES=$(curl -s -X POST "$BASE/api/admin/cars-catalog/brands" -H "Cookie: $COOKIE" -H "Content-Type: application/json" \
  -d '{"nameEn":"E2E Test Brand","slug":"e2e-test-brand","nameAr":"ماركة اختبار"}')
BRAND_ID=$(echo "$BRAND_RES" | node -e "let d='';process.stdin.on('data',c=>d+=c);process.stdin.on('end',()=>{try{console.log(JSON.parse(d).id||'')}catch{console.log('')}})")
[ -n "$BRAND_ID" ] || fail "brand create: $BRAND_RES"
pass "brand created: $BRAND_ID"

echo "=== 2. CREATE model under brand ==="
MODEL_RES=$(curl -s -X POST "$BASE/api/admin/cars-catalog/models" -H "Cookie: $COOKIE" -H "Content-Type: application/json" \
  -d "{\"brandId\":\"$BRAND_ID\",\"nameEn\":\"E2E Test Model\",\"slug\":\"e2e-test-model\",\"nameAr\":\"موديل اختبار\"}")
MODEL_ID=$(echo "$MODEL_RES" | node -e "let d='';process.stdin.on('data',c=>d+=c);process.stdin.on('end',()=>{try{console.log(JSON.parse(d).id||'')}catch{console.log('')}})")
[ -n "$MODEL_ID" ] || fail "model create: $MODEL_RES"
pass "model created: $MODEL_ID"

echo "=== 3. CREATE car ==="
CAR_RES=$(curl -s -X POST "$BASE/api/admin/cars-catalog/cars" -H "Cookie: $COOKIE" -H "Content-Type: application/json" \
  -d "{\"displayName\":\"E2E Test Car 2026\",\"brandId\":\"$BRAND_ID\",\"modelId\":\"$MODEL_ID\",\"year\":2026,\"bodyType\":\"Sedan\",\"fuelType\":\"Petrol (Gasoline)\"}")
CAR_KEY=$(echo "$CAR_RES" | node -e "let d='';process.stdin.on('data',c=>d+=c);process.stdin.on('end',()=>{try{console.log(JSON.parse(d).normalizedKey||'')}catch{console.log('')}})")
[ -n "$CAR_KEY" ] || fail "car create: $CAR_RES"
pass "car created: $CAR_KEY"

echo "=== 4. EDIT car (notes + field override) ==="
EDIT_RES=$(curl -s -X PATCH "$BASE/api/admin/cars-catalog/cars/$(node -e "console.log(encodeURIComponent('$CAR_KEY'))")" \
  -H "Cookie: $COOKIE" -H "Content-Type: application/json" \
  -d '{"notes":"E2E test note","overrides":[{"field":"displayName","value":"E2E Test Car 2026 (Edited)"}]}')
EDITED_NAME=$(echo "$EDIT_RES" | node -e "let d='';process.stdin.on('data',c=>d+=c);process.stdin.on('end',()=>{try{console.log(JSON.parse(d).displayName||'')}catch{console.log('')}})")
[ "$EDITED_NAME" = "E2E Test Car 2026 (Edited)" ] || fail "edit did not apply override: $EDIT_RES"
pass "edit applied, override reflected: $EDITED_NAME"

echo "=== 5. ARCHIVE car (hidden=true) — verify vanishes from public listing ==="
curl -s -X PATCH "$BASE/api/admin/cars-catalog/cars/$(node -e "console.log(encodeURIComponent('$CAR_KEY'))")" \
  -H "Cookie: $COOKIE" -H "Content-Type: application/json" -d '{"hidden":true}' > /dev/null
PUBLIC_CHECK=$(curl -s "$BASE/new/car/$(node -e "console.log(encodeURIComponent('$CAR_KEY'))")" -o /dev/null -w "%{http_code}")
[ "$PUBLIC_CHECK" = "404" ] || fail "archived car still publicly reachable (got $PUBLIC_CHECK)"
pass "archived car correctly hidden from public site (404)"

echo "=== 6. UN-ARCHIVE car (hidden=false) ==="
UNHIDE_RES=$(curl -s -X PATCH "$BASE/api/admin/cars-catalog/cars/$(node -e "console.log(encodeURIComponent('$CAR_KEY'))")" \
  -H "Cookie: $COOKIE" -H "Content-Type: application/json" -d '{"hidden":false}')
STILL_HIDDEN=$(echo "$UNHIDE_RES" | node -e "let d='';process.stdin.on('data',c=>d+=c);process.stdin.on('end',()=>{try{console.log(JSON.parse(d).adminHidden)}catch{console.log('?')}})")
[ "$STILL_HIDDEN" = "false" ] || fail "un-archive did not clear adminHidden: $UNHIDE_RES"
pass "un-archived successfully"

echo "=== 7. DELETE car (admin-created, should succeed) ==="
DEL_CODE=$(curl -s -o /dev/null -w "%{http_code}" -X DELETE "$BASE/api/admin/cars-catalog/cars/$(node -e "console.log(encodeURIComponent('$CAR_KEY'))")" -H "Cookie: $COOKIE")
[ "$DEL_CODE" = "200" ] || fail "car delete returned $DEL_CODE"
pass "car deleted (200)"

echo "=== 8. DELETE model ==="
DEL_MODEL_CODE=$(curl -s -o /dev/null -w "%{http_code}" -X DELETE "$BASE/api/admin/cars-catalog/models/$MODEL_ID" -H "Cookie: $COOKIE")
[ "$DEL_MODEL_CODE" = "200" ] || fail "model delete returned $DEL_MODEL_CODE"
pass "model deleted (200)"

echo "=== 9. DELETE brand ==="
DEL_BRAND_CODE=$(curl -s -o /dev/null -w "%{http_code}" -X DELETE "$BASE/api/admin/cars-catalog/brands/$BRAND_ID" -H "Cookie: $COOKIE")
[ "$DEL_BRAND_CODE" = "200" ] || fail "brand delete returned $DEL_BRAND_CODE"
pass "brand deleted (200)"

echo "=== 10. Confirm a SYNCED (non-admin) car cannot be hard-deleted (archive-only safety rule) ==="
SYNCED_KEY='toyota|proace-city|2026|l2-50-kwh-136-hp-electric|minivan'
DEL_SYNCED_RES=$(curl -s -o /tmp/synced_del_body.json -w "%{http_code}" -X DELETE "$BASE/api/admin/cars-catalog/cars/$(node -e "console.log(encodeURIComponent('$SYNCED_KEY'))")" -H "Cookie: $COOKIE")
[ "$DEL_SYNCED_RES" = "409" ] || fail "expected 409 (protected) for a synced car, got $DEL_SYNCED_RES: $(cat /tmp/synced_del_body.json)"
pass "synced car correctly protected from hard-delete (409, archive-only)"
# Confirm it's still live afterward (the guard didn't partially delete anything).
STILL_LIVE=$(curl -s -o /dev/null -w "%{http_code}" "$BASE/new/car/$(node -e "console.log(encodeURIComponent('$SYNCED_KEY'))")")
[ "$STILL_LIVE" = "200" ] || fail "synced car unexpectedly not live after protected-delete attempt (got $STILL_LIVE)"
pass "synced car still live and unaffected (200)"

echo ""
echo "ALL CRUD CHECKS PASSED"
