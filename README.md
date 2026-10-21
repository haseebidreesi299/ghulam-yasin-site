# Ghulam Yasin - E-Commerce Website (Expo + React Native)

## Chalane ka tareeqa (VS Code terminal mein)
    npm install
    npm run web        # browser (desktop/tablet/mobile) mein chalega
    npm start          # QR code - phone par Expo Go se scan karein

## Apni photo lagana
`assets/profile.jpg` ko apni photo se replace karein (same naam, square photo behtar hai).

## Number / email change karna
`App.js` ke shuru mein `CONTACT` section dekhein.

## Website build (hosting ke liye)
    npm run build:web   # output: dist/ folder

## Earnings / Sales screenshots
Har marketplace ke liye 3 images hain:
    assets/earnings/amazon/1.jpg, 2.jpg, 3.jpg
    assets/earnings/ebay/...   walmart   tiktok   etsy   shopify   onbuy
Apni image ko same naam (.jpg) se replace karein. Customer ke naam/address blur kar dein.

## Reviews section
App.js mein `REVIEWS` list (CLIENT REVIEWS wale hisse mein) mein asli client reviews add karein.
Review ki image/screenshot optional hai: assets/reviews/1.jpg rakh kar `image: require('./assets/reviews/1.jpg')` likhein.
Visitors ke likhe reviews sirf unki apni device par dikhte hain; "Send on WhatsApp/Email" se aap tak pahunchte hain,
phir aap unhe `REVIEWS` mein add karke sab ke liye permanent kar sakte hain.

Reviews slider: har ~3.5 second baad agla review 1 second ki animation ke saath slide hota hai (App.js mein SLIDE_MS / SLIDE_EVERY se badal sakte hain).
