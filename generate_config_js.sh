#!/bin/sh -eu
cat <<EOF
window.API_DOMAIN="${API_DOMAIN}";
window.GOOGLE_RECAPTCHA_KEY="${GOOGLE_RECAPTCHA_KEY}";
window.CHANNEL_CODE="${CHANNEL_CODE}";
window.GA_ID="${GA_ID}";
EOF
