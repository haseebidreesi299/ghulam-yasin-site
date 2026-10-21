import React, { useRef, useState, useCallback, useEffect } from 'react';
import {
  View,
  Text,
  Animated,
  Easing,
  AccessibilityInfo,
  Image,
  ScrollView,
  Pressable,
  TextInput,
  Linking,
  Modal,
  Platform,
  StyleSheet,
  useWindowDimensions,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

/* ------------------------------------------------------------------ */
/*  CONTACT DETAILS  (sirf yahan change karna hai)                     */
/* ------------------------------------------------------------------ */
const CONTACT = {
  name: 'Ghulam Yasin',
  email: 'ecommerce3811@gmail.com',
  phoneDisplay: '+92 306 6272381',
  phoneIntl: '923066272381', // WhatsApp ke liye: + aur spaces ke baghair
};

const URLS = {
  whatsapp: (msg) =>
    `https://wa.me/${CONTACT.phoneIntl}${msg ? `?text=${encodeURIComponent(msg)}` : ''}`,
  email: (subject = '', body = '') =>
    `mailto:${CONTACT.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`,
  call: `tel:+${CONTACT.phoneIntl}`,
};

/* Link kholne ka helper: mobile aur web dono par chalta hai */
const openUrl = (url) => {
  if (Platform.OS === 'web') {
    if (url.startsWith('http')) {
      window.open(url, '_blank', 'noopener,noreferrer');
    } else {
      // mailto: / tel: -> same tab, taake email app / dialer khule
      window.location.href = url;
    }
  } else {
    Linking.openURL(url).catch(() => {});
  }
};

/* ------------------------------------------------------------------ */
/*  THEME                                                              */
/* ------------------------------------------------------------------ */
const C = {
  navy: '#0B1F3A',
  navy2: '#12305A',
  navy3: '#1B4079',
  gold: '#F5B83D',
  goldDark: '#D99A16',
  bg: '#F7F9FC',
  card: '#FFFFFF',
  text: '#0F2540',
  muted: '#5B6B82',
  line: '#E3E9F2',
  green: '#25D366',
  greenDark: '#128C7E',
  soft: '#EAF1FB',
};

const shadow = Platform.select({
  web: { boxShadow: '0 10px 30px rgba(11,31,58,0.08)' },
  default: {
    shadowColor: '#0B1F3A',
    shadowOpacity: 0.1,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 8 },
    elevation: 4,
  },
});

/* ------------------------------------------------------------------ */
/*  CONTENT                                                            */
/* ------------------------------------------------------------------ */
const NAV = [
  { id: 'home', label: 'Home' },
  { id: 'services', label: 'Services' },
  { id: 'marketplaces', label: 'Marketplaces' },
  { id: 'process', label: 'Process' },
  { id: 'why', label: 'Why Me' },
  { id: 'reviews', label: 'Reviews' },
  { id: 'contact', label: 'Contact' },
];

const SERVICES = [
  {
    icon: 'magnify',
    title: 'Product Research & Sourcing',
    items: [
      'Market and competitor research',
      'Product demand and trend analysis',
      'Supplier research',
      'Product and shipping cost analysis',
      'Profit margin analysis',
      'Supplier communication',
    ],
  },
  {
    icon: 'text-search',
    title: 'Product Listings & SEO',
    items: [
      'SEO titles and descriptions',
      'Keyword research',
      'Bullet points and product specifications',
      'Listing optimization',
      'Image and media optimization',
    ],
  },
  {
    icon: 'store-cog',
    title: 'Store & Order Management',
    items: [
      'Daily store operations',
      'Product and inventory management',
      'Order processing',
      'Shipping coordination',
      'Performance monitoring',
    ],
  },
  {
    icon: 'headset',
    title: 'Customer Service',
    items: [
      'Professional customer replies',
      'Order updates and delivery issues',
      'Returns and refunds',
      'Customer complaint handling',
      'Feedback management',
    ],
  },
];

const MARKETS = [
  {
    key: 'amazon',
    name: 'Amazon',
    icon: 'cart',
    color: '#FF9900',
    items: [
      'Amazon Account Setup & Management',
      'Product Research & Sourcing',
      'Product Listing Creation',
      'SEO & Keyword Research',
      'Amazon PPC Campaign Setup & Optimization',
      'Sponsored Products & Sponsored Brands',
      'Product Launch Support',
      'Inventory & Order Management',
      'Customer Service',
      'Account Health Monitoring',
      'Listing Suppression Fix',
      'Account Issue Resolution',
      'Policy Violation Guidance',
      'Account Suspension Support',
      'Returns, Refunds & A-to-Z Claims',
      'Shipment Confirmation & Order Tracking',
      'Supplier & Warehouse Coordination',
    ],
  },
  {
    key: 'ebay',
    name: 'eBay',
    icon: 'tag-multiple',
    color: '#E53238',
    items: [
      'Product Research',
      'Product Listing & SEO Optimization',
      'SEO Titles & Descriptions',
      'Inventory Management',
      'Product Repricing',
      'Order Processing',
      'Buyer Message Management',
      'Customer Service',
      'Returns & Refunds',
      'Negative Feedback Management',
      'Account Health Monitoring',
      'Account Issue Resolution',
      'Order Tracking & Shipment Confirmation',
    ],
  },
  {
    key: 'walmart',
    name: 'Walmart',
    icon: 'storefront',
    color: '#0071CE',
    items: [
      'Product Research',
      'Product Listings',
      'Store Management',
      'Order Processing',
      'Customer Service',
      'Inventory Management',
    ],
  },
  {
    key: 'tiktok',
    name: 'TikTok Shop',
    icon: 'rocket-launch',
    color: '#FE2C55',
    items: [
      'Product Research',
      'Product Listings',
      'Store Management',
      'Order Processing',
      'Product Promotion Strategy',
      'Customer Service',
    ],
  },
  {
    key: 'etsy',
    name: 'Etsy',
    icon: 'heart-outline',
    color: '#F1641E',
    items: [
      'Product Research',
      'Etsy Shop Setup & Management',
      'Product Listing Creation',
      'SEO Titles, Tags & Descriptions',
      'Keyword Research',
      'Order Management',
      'Customer Service',
      'Store Optimization',
    ],
  },
  {
    key: 'shopify',
    name: 'Shopify',
    icon: 'shopping',
    color: '#5E8E3E',
    items: [
      'Shopify Store Setup & Management',
      'Product Uploads',
      'Product Listings & SEO',
      'Store Organization',
      'Order Management',
      'Inventory Management',
      'Customer Service',
      'Store Optimization',
    ],
  },
  {
    key: 'onbuy',
    name: 'OnBuy',
    icon: 'package-variant-closed',
    color: '#00A3E0',
    items: [
      'Product Research',
      'Product Listing',
      'Order Management',
      'Customer Service',
      'Returns & Refunds',
      'Store Management',
    ],
  },
];

const PROCESS = [
  { t: 'Market Research', i: 'chart-areaspline' },
  { t: 'Product Research', i: 'magnify' },
  { t: 'Product Sourcing', i: 'package-variant-closed' },
  { t: 'Supplier Selection', i: 'handshake' },
  { t: 'Cost & Profit Analysis', i: 'calculator' },
  { t: 'Product Listing', i: 'file-document-edit' },
  { t: 'SEO Optimization', i: 'text-search' },
  { t: 'Store Management', i: 'store-cog' },
  { t: 'Order Processing', i: 'clipboard-list' },
  { t: 'Shipping Management', i: 'truck-delivery' },
  { t: 'Customer Service', i: 'headset' },
  { t: 'Returns & Refunds', i: 'cash-refund' },
  { t: 'Inventory Management', i: 'warehouse' },
  { t: 'Performance Monitoring', i: 'chart-line' },
  { t: 'Business Growth', i: 'trending-up' },
];

const WHY = [
  { t: 'Multi-marketplace e-commerce experience', i: 'earth' },
  { t: 'A-to-Z e-commerce support', i: 'format-list-checks' },
  { t: 'Professional store management', i: 'store-cog' },
  { t: 'Product research and analysis', i: 'database-search' },
  { t: 'SEO-focused listings', i: 'text-search' },
  { t: 'Organized order management', i: 'clipboard-list' },
  { t: 'Professional customer service', i: 'headset' },
  { t: 'Reliable communication', i: 'forum' },
  { t: 'Supplier and warehouse coordination', i: 'warehouse' },
  { t: 'Focus on long-term business growth', i: 'trending-up' },
  { t: 'Client-focused approach', i: 'account-heart' },
];

/* ------------------------------------------------------------------ */
/*  EARNINGS / SALES SCREENSHOTS                                       */
/*  Apni images yahan replace karein: assets/earnings/<market>/1.jpg   */
/*  (2.jpg, 3.jpg). Naam wohi rakhein, bas file badal dein.            */
/* ------------------------------------------------------------------ */
const EARNINGS = {
  amazon: [require('./assets/earnings/amazon/1.jpg'), require('./assets/earnings/amazon/2.jpg'), require('./assets/earnings/amazon/3.jpg')],
  ebay: [require('./assets/earnings/ebay/1.jpg'), require('./assets/earnings/ebay/2.jpg'), require('./assets/earnings/ebay/3.jpg')],
  walmart: [require('./assets/earnings/walmart/1.jpg'), require('./assets/earnings/walmart/2.jpg'), require('./assets/earnings/walmart/3.jpg')],
  tiktok: [require('./assets/earnings/tiktok/1.jpg'), require('./assets/earnings/tiktok/2.jpg'), require('./assets/earnings/tiktok/3.jpg')],
  etsy: [require('./assets/earnings/etsy/1.jpg'), require('./assets/earnings/etsy/2.jpg'), require('./assets/earnings/etsy/3.jpg')],
  shopify: [require('./assets/earnings/shopify/1.jpg'), require('./assets/earnings/shopify/2.jpg'), require('./assets/earnings/shopify/3.jpg')],
  onbuy: [require('./assets/earnings/onbuy/1.jpg'), require('./assets/earnings/onbuy/2.jpg'), require('./assets/earnings/onbuy/3.jpg')],
};

/* ------------------------------------------------------------------ */
/*  CLIENT REVIEWS                                                     */
/*  Sirf asli reviews yahan daalein. Har review ka format:             */
/*  {                                                                  */
/*    name: 'Client Name',                                             */
/*    rating: 5,                       // optional (1 se 5)           */
/*    item: 'Product title', itemNo: '#123',   // optional          */
/*    text: 'Review ka text ...',                                      */
/*    source: 'Amazon client',         // optional                     */
/*    date: 'March 2026',              // optional                     */
/*    image: require('./assets/reviews/1.jpg'), // optional screenshot */
/*  },                                                                 */
/* ------------------------------------------------------------------ */
const REVIEWS = [
  { name: 'eBay Buyer', text: 'A+++++', item: 'Lilac Sz L Maternity Convertible Shorts Denim Stretch Adjustable Waist', itemNo: '#251509773264', source: 'eBay feedback' },
  { name: 'eBay Buyer', text: 'Fast shipping. Item as described. Thanks!', item: 'Ladies Nike Jacket L Jersey Lining Princess Seams Pockets Snap Cuffs', itemNo: '#251462500554', source: 'eBay feedback' },
  { name: 'eBay Buyer', text: 'Really fast shipping!', item: 'emile et rose 18 Months Winter Coat, Boy, Baby Blue', itemNo: '#251489172349', source: 'eBay feedback' },
  { name: 'eBay Buyer', text: 'LOVE these sandals & they look BN. Fast shipping. A+ transaction. Thanks!', item: 'Kickers Kids Sandals Leather Sz 30 Or 12 Little Boy Or Girl Worn Once', itemNo: '#251478238486', source: 'eBay feedback' },
  { name: 'eBay Buyer', text: 'Great communication. A pleasure to do business with.', item: 'J.Crew Crewcuts $98 Boys Leather Oxfords shoes black Sz 13', itemNo: '#231035426957', source: 'eBay feedback' },
  { name: 'eBay Buyer', text: 'Beautiful. Thanks so much.', item: 'Boden Sz 8 Cotten Sateen Pencil Wiggle Sheath Dress Black White Purple $128', itemNo: '#251468667562', source: 'eBay feedback' },
  { name: 'eBay Buyer', text: 'Great item thank you', item: 'Woolly and Tig - Spider WOOLLY Plush SOFT TOY', itemNo: '#398118752502', source: 'eBay feedback' },
  { name: 'eBay Buyer', text: 'Thanks', item: 'Solar Filter Sheet for Telescopes 66mm 117mm Outer Diameter Solar Filter Film', itemNo: '#398207607955', source: 'eBay feedback' },
  { name: 'eBay Buyer', text: 'Fine ty', item: 'Universal Air Conditioner Exhaust Duct Pipe Hose Interface Connector Kit 150mm/ 100mm/75mm', itemNo: '#398127122482', source: 'eBay feedback' },
  { name: 'eBay Buyer', text: 'Superb', item: '100% Apple 1m 2.5A USB-C to Lightning Data Cable For iPhone iPad', itemNo: '#398203121081', source: 'eBay feedback' },
  { name: 'eBay Buyer', text: 'Good item thanks', item: 'Fexible Hair Brush with 8 Shark Flexible Rotator, Anti-tangle Liquid Sense', itemNo: '#398183561557', source: 'eBay feedback' },
  { name: 'eBay Buyer', text: 'Good quality, just what I wanted, does the job.', item: 'Cyclic Adjustable Fabric Cycle ST-7C Plastic', itemNo: '#398179402093', source: 'eBay feedback' },
];

const LOCAL_REVIEWS_KEY = 'gy_reviews_v1';

/* ------------------------------------------------------------------ */
/*  SMALL COMPONENTS                                                   */
/* ------------------------------------------------------------------ */
function Button({ label, icon, iconSet = 'ion', onPress, variant = 'gold', style, full }) {
  const palette = {
    gold: { bg: C.gold, fg: C.navy, border: C.gold },
    green: { bg: C.green, fg: '#06371F', border: C.green },
    navy: { bg: C.navy, fg: '#fff', border: C.navy },
    ghost: { bg: 'transparent', fg: '#fff', border: 'rgba(255,255,255,0.45)' },
    outline: { bg: '#fff', fg: C.navy, border: C.line },
  }[variant];
  const Icon = iconSet === 'mci' ? MaterialCommunityIcons : Ionicons;
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed, hovered }) => [
        styles.btn,
        { backgroundColor: palette.bg, borderColor: palette.border },
        full && { alignSelf: 'stretch' },
        (pressed || hovered) && { opacity: 0.88, transform: [{ translateY: -1 }] },
        style,
      ]}
    >
      {icon ? <Icon name={icon} size={20} color={palette.fg} style={{ marginRight: 10 }} /> : null}
      <Text style={[styles.btnText, { color: palette.fg }]}>{label}</Text>
    </Pressable>
  );
}

function SectionHeader({ eyebrow, title, subtitle, light, center = true }) {
  return (
    <View style={{ alignItems: center ? 'center' : 'flex-start', marginBottom: 34 }}>
      {eyebrow ? (
        <View style={[styles.eyebrow, light && { backgroundColor: 'rgba(245,184,61,0.15)' }]}>
          <Text style={[styles.eyebrowText, light && { color: C.gold }]}>{eyebrow}</Text>
        </View>
      ) : null}
      <Text
        style={[
          styles.h2,
          { textAlign: center ? 'center' : 'left', color: light ? '#fff' : C.text },
        ]}
      >
        {title}
      </Text>
      {subtitle ? (
        <Text
          style={[
            styles.lead,
            {
              textAlign: center ? 'center' : 'left',
              color: light ? 'rgba(255,255,255,0.78)' : C.muted,
            },
          ]}
        >
          {subtitle}
        </Text>
      ) : null}
    </View>
  );
}

function Gallery({ images, name, isMobile, onOpen }) {
  const { width } = useWindowDimensions();
  const cardW = isMobile ? Math.min((width - 84) * 0.8, 340) : undefined;
  return (
    <View style={{ marginTop: 26 }}>
      <View style={[styles.row, { alignItems: 'center', marginBottom: 14 }]}>
        <Ionicons name="stats-chart" size={20} color={C.goldDark} />
        <Text style={styles.galleryTitle}>{name} Earnings & Sales</Text>
      </View>
      <ScrollView
        horizontal={isMobile}
        scrollEnabled={isMobile}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ gap: 14, flexDirection: 'row' }}
      >
        {images.map((src, i) => (
          <Pressable
            key={i}
            onPress={() => onOpen(images, i)}
            style={({ hovered }) => [
              styles.shot,
              isMobile ? { width: cardW } : { flex: 1 },
              hovered && { transform: [{ translateY: -3 }] },
            ]}
            accessibilityLabel={`${name} screenshot ${i + 1}`}
          >
            <View style={{ width: '100%', aspectRatio: 4 / 3 }}>
              <Image source={src} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }} resizeMode="contain" />
            </View>
            <View style={styles.zoomHint}>
              <Ionicons name="expand" size={14} color="#fff" />
            </View>
          </Pressable>
        ))}
      </ScrollView>
    </View>
  );
}

function Lightbox({ state, onClose, onChange }) {
  if (!state) return null;
  const { images, index } = state;
  const next = (d) => onChange((index + d + images.length) % images.length);
  return (
    <Modal visible transparent animationType="fade" onRequestClose={onClose}>
      <Pressable style={styles.lbBackdrop} onPress={onClose}>
        <Pressable style={styles.lbBox} onPress={() => {}}>
          <Image source={images[index]} style={{ width: '100%', height: '100%' }} resizeMode="contain" />
        </Pressable>
        <Pressable style={styles.lbClose} onPress={onClose} accessibilityLabel="Close">
          <Ionicons name="close" size={26} color="#fff" />
        </Pressable>
        {images.length > 1 ? (
          <>
            <Pressable style={[styles.lbNav, { left: 12 }]} onPress={() => next(-1)}>
              <Ionicons name="chevron-back" size={28} color="#fff" />
            </Pressable>
            <Pressable style={[styles.lbNav, { right: 12 }]} onPress={() => next(1)}>
              <Ionicons name="chevron-forward" size={28} color="#fff" />
            </Pressable>
            <Text style={styles.lbCount}>{index + 1} / {images.length}</Text>
          </>
        ) : null}
      </Pressable>
    </Modal>
  );
}

function Stars({ value = 0, size = 18, onChange }) {
  return (
    <View style={{ flexDirection: 'row' }} accessibilityLabel={`${value} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((n) => {
        const icon = (
          <Ionicons
            name={n <= Math.round(value) ? 'star' : 'star-outline'}
            size={size}
            color={C.goldDark}
            style={{ marginRight: 3 }}
          />
        );
        return onChange ? (
          <Pressable
            key={n}
            onPress={() => onChange(n)}
            accessibilityRole="button"
            accessibilityLabel={`${n} star${n > 1 ? 's' : ''}`}
            hitSlop={6}
          >
            {icon}
          </Pressable>
        ) : (
          <View key={n}>{icon}</View>
        );
      })}
    </View>
  );
}

function ReviewCard({ review, style, onOpenImage }) {
  return (
    <View style={[styles.card, styles.reviewCard, style]}>
      <View style={[styles.row, { justifyContent: 'space-between', alignItems: 'center' }]}>
        {review.rating ? (
          <Stars value={review.rating} />
        ) : (
          <View style={styles.positiveBadge}>
            <Ionicons name="add-circle" size={18} color="#1E8E4E" />
            <Text style={styles.positiveText}>Positive feedback</Text>
          </View>
        )}
        <Ionicons name="chatbubble-ellipses-outline" size={22} color="#9DB3D3" />
      </View>
      <Text style={styles.reviewText}>{'\u201C'}{review.text}{'\u201D'}</Text>
      {review.item ? (
        <Text style={styles.reviewItem} numberOfLines={3}>
          {review.item}
          {review.itemNo ? `  (${review.itemNo})` : ''}
        </Text>
      ) : null}
      <View style={{ marginTop: 'auto' }}>
        <View style={styles.reviewDivider} />
        <View style={[styles.row, { alignItems: 'center', justifyContent: 'space-between', gap: 8 }]}>
          <View style={{ flexShrink: 1 }}>
            <Text style={styles.reviewName}>{review.name}</Text>
            {review.source || review.date ? (
              <Text style={styles.reviewMeta}>
                {[review.source, review.date].filter(Boolean).join('  \u2022  ')}
              </Text>
            ) : null}
          </View>
          {review.image ? (
            <Pressable onPress={() => onOpenImage(review.image)} style={styles.reviewShotBtn} accessibilityLabel="View original review screenshot">
              <Ionicons name="image-outline" size={16} color={C.navy2} />
              <Text style={styles.reviewShotText}>Original</Text>
            </Pressable>
          ) : null}
        </View>
        {review.local ? (
          <View style={styles.localBadge}>
            <Ionicons name="time-outline" size={14} color="#6B5314" />
            <Text style={styles.localBadgeText}>Shown only on this device until approved</Text>
          </View>
        ) : null}
      </View>
    </View>
  );
}

/* Auto-sliding reviews: har 1 second ki animation ke saath agla review aata hai */
const SLIDE_MS = 1000; // slide animation ka time
const SLIDE_EVERY = 3500; // har kitni der baad agla slide

function ReviewSlider({ reviews, perView, onOpenImage }) {
  const gap = 18;
  const n = reviews.length;
  const [w, setW] = useState(0);
  const [active, setActive] = useState(0);
  const [reduceMotion, setReduceMotion] = useState(false);
  const x = useRef(new Animated.Value(0)).current;
  const idx = useRef(0);
  const busy = useRef(false);
  const paused = useRef(false);

  const sliding = n > perView;
  const cardW = w ? (w - gap * (perView - 1)) / perView : 0;
  const step = cardW + gap;
  const items = sliding ? [...reviews, ...reviews.slice(0, perView)] : reviews;

  useEffect(() => {
    AccessibilityInfo.isReduceMotionEnabled?.().then(setReduceMotion).catch(() => {});
  }, []);

  // size badalne par (rotate / resize) position sahi rakho
  useEffect(() => {
    x.setValue(-idx.current * step);
  }, [step, x]);

  const animateTo = useCallback(
    (target, done) => {
      busy.current = true;
      Animated.timing(x, {
        toValue: -target * step,
        duration: SLIDE_MS,
        easing: Easing.inOut(Easing.cubic),
        useNativeDriver: Platform.OS !== 'web',
      }).start(() => {
        if (target >= n) {
          x.setValue(0);
          idx.current = 0;
        } else {
          idx.current = target;
        }
        setActive(idx.current % n);
        busy.current = false;
        done && done();
      });
    },
    [n, step, x]
  );

  const next = useCallback(() => {
    if (!sliding || busy.current || !step) return;
    animateTo(idx.current + 1);
  }, [sliding, step, animateTo]);

  const prev = useCallback(() => {
    if (!sliding || busy.current || !step) return;
    if (idx.current === 0) {
      x.setValue(-n * step);
      idx.current = n;
    }
    animateTo(idx.current - 1);
  }, [sliding, step, n, x, animateTo]);

  useEffect(() => {
    if (!sliding || reduceMotion) return undefined;
    const t = setInterval(() => {
      if (!paused.current) next();
    }, SLIDE_EVERY);
    return () => clearInterval(t);
  }, [sliding, reduceMotion, next]);

  return (
    <View>
      <Pressable
        onHoverIn={() => (paused.current = true)}
        onHoverOut={() => (paused.current = false)}
        onPressIn={() => (paused.current = true)}
        onPressOut={() => (paused.current = false)}
        accessible={false}
      >
        <View onLayout={(e) => setW(e.nativeEvent.layout.width)} style={{ overflow: 'hidden', paddingVertical: 14, marginVertical: -8 }}>
          {w ? (
            <Animated.View
              style={{
                flexDirection: 'row',
                gap,
                justifyContent: sliding ? 'flex-start' : 'center',
                transform: [{ translateX: x }],
              }}
            >
              {items.map((r, i) => (
                <ReviewCard
                  key={`${r.itemNo || r.name}-${i}`}
                  review={r}
                  style={{ width: cardW }}
                  onOpenImage={onOpenImage}
                />
              ))}
            </Animated.View>
          ) : null}
        </View>
      </Pressable>

      {sliding ? (
        <View style={styles.sliderControls}>
          <Pressable onPress={prev} style={styles.sliderBtn} accessibilityLabel="Previous review">
            <Ionicons name="chevron-back" size={20} color={C.navy} />
          </Pressable>
          <View style={styles.dots}>
            {reviews.map((_, i) => (
              <View key={i} style={[styles.dot2, i === active && styles.dot2On]} />
            ))}
          </View>
          <Pressable onPress={next} style={styles.sliderBtn} accessibilityLabel="Next review">
            <Ionicons name="chevron-forward" size={20} color={C.navy} />
          </Pressable>
        </View>
      ) : null}
    </View>
  );
}

function Check({ text, light }) {
  return (
    <View style={styles.checkRow}>
      <Ionicons name="checkmark-circle" size={18} color={light ? C.gold : C.goldDark} />
      <Text style={[styles.checkText, light && { color: 'rgba(255,255,255,0.9)' }]}>{text}</Text>
    </View>
  );
}

/* ------------------------------------------------------------------ */
/*  APP                                                                */
/* ------------------------------------------------------------------ */
export default function App() {
  const { width } = useWindowDimensions();
  const isDesktop = width >= 1000;
  const isTablet = width >= 640 && width < 1000;
  const isMobile = width < 640;
  const pad = isMobile ? 20 : isTablet ? 32 : 48;

  const scrollRef = useRef(null);
  const positions = useRef({});
  const [menuOpen, setMenuOpen] = useState(false);
  const [market, setMarket] = useState('amazon');
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [errors, setErrors] = useState({});
  const [lightbox, setLightbox] = useState(null);
  const [localReviews, setLocalReviews] = useState([]);
  const [rForm, setRForm] = useState({ name: '', rating: 0, text: '' });
  const [rErrors, setRErrors] = useState({});
  const [lastPosted, setLastPosted] = useState(null);

  useEffect(() => {
    AsyncStorage.getItem(LOCAL_REVIEWS_KEY)
      .then((raw) => {
        if (!raw) return;
        const list = JSON.parse(raw);
        if (Array.isArray(list)) setLocalReviews(list.filter((r) => r && r.name && r.text));
      })
      .catch(() => {});
  }, []);

  const onSection = (id) => (e) => {
    positions.current[id] = e.nativeEvent.layout.y;
  };

  const goTo = useCallback((id) => {
    setMenuOpen(false);
    const y = positions.current[id] ?? 0;
    scrollRef.current?.scrollTo({ y: Math.max(0, y - 64), animated: true });
  }, []);

  const activeMarket = MARKETS.find((m) => m.key === market);

  const buildMessage = () =>
    `Hello ${CONTACT.name},\n\nMy name is ${form.name.trim()}.\n${
      form.email.trim() ? `Email: ${form.email.trim()}\n` : ''
    }\n${form.message.trim()}`;

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Please enter your name';
    if (form.email.trim() && !/^\S+@\S+\.\S+$/.test(form.email.trim()))
      e.email = 'Please enter a valid email';
    if (!form.message.trim()) e.message = 'Please write a short message';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const sendWhatsApp = () => {
    if (validate()) openUrl(URLS.whatsapp(buildMessage()));
  };
  const sendEmail = () => {
    if (validate())
      openUrl(URLS.email(`E-commerce inquiry from ${form.name.trim()}`, buildMessage()));
  };

  const reviewMessage = (r) =>
    `Hello ${CONTACT.name},\n\nI would like to leave a review:\n\nName: ${r.name}\nRating: ${r.rating}/5\nReview: ${r.text}`;

  const postReview = () => {
    const e = {};
    const name = rForm.name.trim().slice(0, 60);
    const text = rForm.text.trim().slice(0, 600);
    if (!name) e.name = 'Please enter your name';
    if (!rForm.rating) e.rating = 'Please choose a star rating';
    if (text.length < 10) e.text = 'Please write at least a short sentence (10 characters)';
    setRErrors(e);
    if (Object.keys(e).length) return;
    const review = { name, rating: rForm.rating, text, date: new Date().toLocaleDateString(), local: true };
    const next = [review, ...localReviews].slice(0, 20);
    setLocalReviews(next);
    setLastPosted(review);
    setRForm({ name: '', rating: 0, text: '' });
    AsyncStorage.setItem(LOCAL_REVIEWS_KEY, JSON.stringify(next)).catch(() => {});
  };

  const approved = REVIEWS;
  const rated = approved.filter((r) => r.rating);
  const avgRating = rated.length ? rated.reduce((sum, r) => sum + r.rating, 0) / rated.length : 0;
  const reviewsPerView = isDesktop ? 3 : isTablet ? 2 : 1;

  const cols = isDesktop ? 4 : isTablet ? 2 : 1;
  const gap = 18;
  const colWidth = (total) => ({
    width: isMobile ? '100%' : `${100 / total - 2}%`,
    flexGrow: 1,
  });

  return (
    <View style={styles.root}>
      <StatusBar style="light" />

      {/* ---------------- NAVBAR ---------------- */}
      <View style={styles.nav}>
        <View style={[styles.navInner, { paddingHorizontal: pad }]}>
          <Pressable onPress={() => goTo('home')} style={styles.brand}>
            <View style={styles.logo}>
              <Text style={styles.logoText}>GY</Text>
            </View>
            <Text style={styles.brandText}>Ghulam Yasin</Text>
          </Pressable>

          {isDesktop ? (
            <View style={styles.navLinks}>
              {NAV.filter((n) => n.id !== 'contact').map((n) => (
                <Pressable key={n.id} onPress={() => goTo(n.id)} style={styles.navLink}>
                  <Text style={styles.navLinkText}>{n.label}</Text>
                </Pressable>
              ))}
              <Button
                label="Contact Me"
                icon="logo-whatsapp"
                variant="green"
                onPress={() => openUrl(URLS.whatsapp())}
                style={{ paddingVertical: 10, marginLeft: 8 }}
              />
            </View>
          ) : (
            <Pressable
              onPress={() => setMenuOpen((v) => !v)}
              style={styles.menuBtn}
              accessibilityLabel="Menu"
            >
              <Ionicons name={menuOpen ? 'close' : 'menu'} size={26} color="#fff" />
            </Pressable>
          )}
        </View>
        {!isDesktop && menuOpen ? (
          <View style={[styles.mobileMenu, { paddingHorizontal: pad }]}>
            {NAV.map((n) => (
              <Pressable key={n.id} onPress={() => goTo(n.id)} style={styles.mobileMenuItem}>
                <Text style={styles.mobileMenuText}>{n.label}</Text>
                <Ionicons name="chevron-forward" size={18} color="rgba(255,255,255,0.5)" />
              </Pressable>
            ))}
          </View>
        ) : null}
      </View>

      <ScrollView
        ref={scrollRef}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 0 }}
      >
        {/* ---------------- HERO ---------------- */}
        <View onLayout={onSection('home')}>
          <LinearGradient
            colors={[C.navy, C.navy2, C.navy3]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={[styles.hero, { paddingHorizontal: pad }]}
          >
            <View style={styles.glowA} />
            <View style={styles.glowB} />
            <View
              style={[
                styles.container,
                {
                  flexDirection: isDesktop ? 'row' : 'column-reverse',
                  alignItems: 'center',
                  gap: isDesktop ? 60 : 36,
                },
              ]}
            >
              <View style={{ flex: isDesktop ? 1.15 : undefined, width: isDesktop ? undefined : '100%' }}>
                <View style={styles.pill}>
                  <View style={styles.dot} />
                  <Text style={styles.pillText}>Available for new projects</Text>
                </View>
                <Text style={[styles.heroRole]}>E-Commerce Specialist & Marketplace Manager</Text>
                <Text style={[styles.heroTitle, { fontSize: isMobile ? 38 : isTablet ? 50 : 60 }]}>
                  Your E-Commerce{'\n'}
                  <Text style={{ color: C.gold }}>Growth Partner</Text>
                </Text>
                <Text style={styles.heroText}>
                  I help businesses build, manage, and grow online stores across Amazon, eBay,
                  Walmart, TikTok Shop, Etsy, Shopify, OnBuy, and other major e-commerce platforms.
                </Text>
                <Text style={[styles.heroText, { marginTop: 12 }]}>
                  I am <Text style={{ color: '#fff', fontWeight: '700' }}>Ghulam Yasin</Text>, an
                  experienced E-Commerce Specialist providing complete A-to-Z support — product
                  research, sourcing, listing creation, SEO, store management, order processing,
                  customer service, returns, refunds, and marketplace operations.
                </Text>
                <View style={[styles.row, { marginTop: 28, gap: 12 }]}>
                  <Button
                    label="Get Started"
                    icon="arrow-forward"
                    onPress={() => goTo('contact')}
                    style={isMobile ? { alignSelf: 'stretch' } : null}
                  />
                  <Button
                    label="WhatsApp Me"
                    icon="logo-whatsapp"
                    variant="ghost"
                    onPress={() => openUrl(URLS.whatsapp('Hello Ghulam, I would like to discuss my e-commerce business.'))}
                    style={isMobile ? { alignSelf: 'stretch' } : null}
                  />
                </View>
                <View style={[styles.row, { marginTop: 30, gap: isMobile ? 18 : 34 }]}>
                  {[
                    ['7', 'Marketplaces'],
                    ['A–Z', 'Support'],
                    ['24/7', 'Reachable'],
                  ].map(([n, l]) => (
                    <View key={l}>
                      <Text style={styles.stat}>{n}</Text>
                      <Text style={styles.statLabel}>{l}</Text>
                    </View>
                  ))}
                </View>
              </View>

              <View style={{ alignItems: 'center', flex: isDesktop ? 0.85 : undefined }}>
                <View
                  style={[
                    styles.photoRing,
                    {
                      width: isMobile ? 240 : isTablet ? 300 : 380,
                      height: isMobile ? 240 : isTablet ? 300 : 380,
                      borderRadius: 999,
                    },
                  ]}
                >
                  <Image
                    source={require('./assets/profile.jpg')}
                    style={{ width: '100%', height: '100%', borderRadius: 999 }}
                    resizeMode="cover"
                    accessibilityLabel="Ghulam Yasin"
                  />
                </View>
                <View style={styles.floatBadge}>
                  <Ionicons name="shield-checkmark" size={18} color={C.navy} />
                  <Text style={styles.floatBadgeText}>Trusted Marketplace Manager</Text>
                </View>
              </View>
            </View>
          </LinearGradient>
        </View>

        {/* ---------------- INTRO ---------------- */}
        <View style={[styles.section, { paddingHorizontal: pad, backgroundColor: C.bg }]}>
          <View style={styles.container}>
            <SectionHeader
              eyebrow="ABOUT"
              title="Helping Businesses Grow in the World of E-Commerce"
              subtitle="I help businesses manage and grow their online marketplace operations across multiple platforms. My goal is to keep e-commerce businesses organized, improve their online presence, and support long-term growth through professional marketplace management."
            />
          </View>
        </View>

        {/* ---------------- SERVICES ---------------- */}
        <View
          onLayout={onSection('services')}
          style={[styles.section, { paddingHorizontal: pad, backgroundColor: '#fff', paddingTop: 70 }]}
        >
          <View style={styles.container}>
            <SectionHeader
              eyebrow="SERVICES"
              title="Everything You Need to Grow Online"
              subtitle="Four core service areas that cover your complete e-commerce operation."
            />
            <View style={[styles.grid, { gap }]}>
              {SERVICES.map((s) => (
                <View key={s.title} style={[styles.card, colWidth(cols)]}>
                  <LinearGradient colors={[C.navy2, C.navy3]} style={styles.iconBox}>
                    <MaterialCommunityIcons name={s.icon} size={28} color={C.gold} />
                  </LinearGradient>
                  <Text style={styles.cardTitle}>{s.title}</Text>
                  <View style={{ marginTop: 10 }}>
                    {s.items.map((it) => (
                      <Check key={it} text={it} />
                    ))}
                  </View>
                </View>
              ))}
            </View>
          </View>
        </View>

        {/* ---------------- MARKETPLACES ---------------- */}
        <View
          onLayout={onSection('marketplaces')}
          style={[styles.section, { paddingHorizontal: pad, backgroundColor: C.bg }]}
        >
          <View style={styles.container}>
            <SectionHeader
              eyebrow="MARKETPLACE EXPERTISE"
              title="Services for Every Major Platform"
              subtitle="Select a marketplace to see exactly how I can help."
            />
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.tabs}
              style={{ marginBottom: 22, alignSelf: 'center', maxWidth: '100%' }}
            >
              {MARKETS.map((m) => {
                const active = m.key === market;
                return (
                  <Pressable
                    key={m.key}
                    onPress={() => setMarket(m.key)}
                    style={[styles.tab, active && { backgroundColor: C.navy, borderColor: C.navy }]}
                  >
                    <MaterialCommunityIcons
                      name={m.icon}
                      size={18}
                      color={active ? C.gold : m.color}
                      style={{ marginRight: 8 }}
                    />
                    <Text style={[styles.tabText, active && { color: '#fff' }]}>{m.name}</Text>
                  </Pressable>
                );
              })}
            </ScrollView>

            <View style={[styles.card, { padding: isMobile ? 22 : 34 }]}>
              <View style={[styles.row, { alignItems: 'center', marginBottom: 18 }]}>
                <View style={[styles.marketIcon, { backgroundColor: activeMarket.color + '22' }]}>
                  <MaterialCommunityIcons
                    name={activeMarket.icon}
                    size={28}
                    color={activeMarket.color}
                  />
                </View>
                <Text style={[styles.h3, { marginLeft: 14 }]}>{activeMarket.name} Services</Text>
              </View>
              <View style={styles.grid}>
                {activeMarket.items.map((it) => (
                  <View key={it} style={{ width: isMobile ? '100%' : isTablet ? '50%' : '33.33%', paddingRight: 12 }}>
                    <Check text={it} />
                  </View>
                ))}
              </View>
              {EARNINGS[activeMarket.key] ? (
                <Gallery
                  images={EARNINGS[activeMarket.key]}
                  name={activeMarket.name}
                  isMobile={isMobile}
                  onOpen={(images, index) => setLightbox({ images, index })}
                />
              ) : null}
              <Button
                label={`Ask about ${activeMarket.name}`}
                icon="logo-whatsapp"
                variant="green"
                style={{ alignSelf: isMobile ? 'stretch' : 'flex-start', marginTop: 22 }}
                onPress={() =>
                  openUrl(URLS.whatsapp(`Hello Ghulam, I need help with my ${activeMarket.name} store.`))
                }
              />
            </View>
          </View>
        </View>

        {/* ---------------- PROCESS ---------------- */}
        <View onLayout={onSection('process')}>
          <LinearGradient
            colors={[C.navy, C.navy2]}
            style={[styles.section, { paddingHorizontal: pad }]}
          >
            <View style={styles.container}>
              <SectionHeader
                light
                eyebrow="THE JOURNEY"
                title="From Product Idea to Business Growth"
                subtitle="A clear, step-by-step e-commerce process — every stage handled professionally."
              />
              <View style={[styles.grid, { gap: 14 }]}>
                {PROCESS.map((p, idx) => (
                  <View
                    key={p.t}
                    style={[
                      styles.step,
                      {
                        width: isMobile ? '47.5%' : isTablet ? '31.5%' : '18.6%',
                        flexGrow: 1,
                      },
                      idx === PROCESS.length - 1 && { backgroundColor: C.gold, borderColor: C.gold },
                    ]}
                  >
                    <View style={styles.stepNum}>
                      <Text style={styles.stepNumText}>{idx + 1}</Text>
                    </View>
                    <MaterialCommunityIcons
                      name={p.i}
                      size={30}
                      color={idx === PROCESS.length - 1 ? C.navy : C.gold}
                    />
                    <Text
                      style={[
                        styles.stepText,
                        idx === PROCESS.length - 1 && { color: C.navy },
                      ]}
                    >
                      {p.t}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          </LinearGradient>
        </View>

        {/* ---------------- COMPLETE SUPPORT ---------------- */}
        <View style={[styles.section, { paddingHorizontal: pad, backgroundColor: '#fff' }]}>
          <View style={styles.container}>
            <View style={[styles.supportBox, { padding: isMobile ? 24 : 40 }]}>
              <Text style={styles.h2Left}>Complete E-Commerce Support</Text>
              <Text style={[styles.lead, { textAlign: 'left', color: C.muted }]}>
                I can support different parts of an e-commerce business, including product research,
                supplier sourcing, product listings, SEO, order processing, shipping coordination,
                customer service, returns, refunds, inventory management, and profit analysis.
              </Text>
              <View style={styles.note}>
                <Ionicons name="information-circle" size={22} color={C.goldDark} />
                <Text style={styles.noteText}>
                  Results can vary depending on the marketplace, products, suppliers, competition,
                  and business strategy. No unrealistic income or profit guarantees are made.
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* ---------------- WHY ME ---------------- */}
        <View
          onLayout={onSection('why')}
          style={[styles.section, { paddingHorizontal: pad, backgroundColor: C.bg }]}
        >
          <View style={styles.container}>
            <SectionHeader
              eyebrow="WHY ME"
              title="Why Businesses Choose to Work With Me"
            />
            <View style={[styles.grid, { gap: 14 }]}>
              {WHY.map((w) => (
                <View
                  key={w.t}
                  style={[
                    styles.whyCard,
                    { width: isMobile ? '100%' : isTablet ? '48.5%' : '32%', flexGrow: 1 },
                  ]}
                >
                  <View style={styles.whyIcon}>
                    <MaterialCommunityIcons name={w.i} size={24} color={C.navy2} />
                  </View>
                  <Text style={styles.whyText}>{w.t}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>

        {/* ---------------- REVIEWS ---------------- */}
    <View
  onLayout={onSection('reviews')}
  style={[styles.section, { paddingHorizontal: pad, backgroundColor: '#fff' }]}
>
  <View style={styles.container}>
    <SectionHeader
      eyebrow="REVIEWS"
      title="What Clients Say"
      subtitle="Feedback from my eBay buyers."
    />

    {approved.length ? (
      <View style={[styles.row, styles.ratingSummary]}>
        {rated.length ? (
          <>
            <Text style={styles.ratingBig}>{avgRating.toFixed(1)}</Text>
            <View style={{ marginLeft: 14 }}>
              <Stars value={avgRating} size={22} />
              <Text style={styles.reviewMeta}>
                Based on {rated.length} review{rated.length > 1 ? 's' : ''}
              </Text>
            </View>
          </>
        ) : (
          <>
            <Text style={styles.ratingBig}>130</Text>
            <View style={{ marginLeft: 14 }}>
              <View style={styles.positiveBadge}>
                <Ionicons name="add-circle" size={20} color="#1E8E4E" />
                <Text style={[styles.positiveText, { fontSize: 15 }]}>
                  Positive feedbacks
                </Text>
              </View>
              <Text style={styles.reviewMeta}>From my eBay buyers</Text>
            </View>
          </>
        )}
      </View>
    ) : null}

    {approved.length ? (
      <View style={{ marginBottom: 34 }}>
        <ReviewSlider
          reviews={approved}
          perView={reviewsPerView}
          onOpenImage={(img) => setLightbox({ images: [img], index: 0 })}
        />
      </View>
    ) : null}

    {localReviews.length ? (
      <View style={{ marginBottom: 34 }}>
        <Text
          style={[
            styles.cardTitle,
            { marginBottom: 12, textAlign: 'center' },
          ]}
        >
          Your reviews
        </Text>

        <View style={[styles.grid, { gap: 18, justifyContent: 'center' }]}>
          {localReviews.map((r, i) => (
            <ReviewCard
              key={`${r.name}-${i}`}
              review={r}
              style={{
                width: isMobile
                  ? '100%'
                  : `${100 / reviewsPerView - 2.2}%`,
              }}
              onOpenImage={() => {}}
            />
          ))}
        </View>
      </View>
    ) : null}

    {!approved.length && !localReviews.length ? (
      <View style={[styles.emptyReviews, { marginBottom: 34 }]}>
        <Ionicons
          name="chatbubble-ellipses-outline"
          size={30}
          color={C.navy3}
        />
        <Text style={styles.emptyReviewsTitle}>No reviews yet</Text>
        <Text style={styles.emptyReviewsText}>
          Be the first to share your experience.
        </Text>
      </View>
    ) : null}
  </View>
</View>
        {/* ---------------- CONTACT ---------------- */}
        <View onLayout={onSection('contact')}>
          <LinearGradient
            colors={[C.navy, C.navy2, C.navy3]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={[styles.section, { paddingHorizontal: pad }]}
          >
            <View style={styles.container}>
              <SectionHeader
                light
                eyebrow="CONTACT"
                title="Let’s Grow Your E-Commerce Business"
                subtitle="Send a message on WhatsApp or email, or call directly. I usually reply quickly."
              />

              <View
                style={{
                  flexDirection: isDesktop ? 'row' : 'column',
                  gap: 22,
                  alignItems: 'stretch',
                }}
              >
                {/* Contact details */}
                <View style={{ flex: isDesktop ? 0.9 : undefined, gap: 14 }}>
                  <Pressable style={styles.contactCard} onPress={() => openUrl(URLS.whatsapp('Hello Ghulam, I would like to get started.'))}>
                    <View style={[styles.contactIcon, { backgroundColor: C.green }]}>
                      <Ionicons name="logo-whatsapp" size={24} color="#fff" />
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.contactLabel}>WhatsApp</Text>
                      <Text style={styles.contactValue}>{CONTACT.phoneDisplay}</Text>
                    </View>
                    <Ionicons name="arrow-forward" size={20} color={C.muted} />
                  </Pressable>

                  <Pressable
                    style={styles.contactCard}
                    onPress={() => openUrl(URLS.email('E-commerce inquiry', 'Hello Ghulam,\n\n'))}
                  >
                    <View style={[styles.contactIcon, { backgroundColor: C.navy2 }]}>
                      <Ionicons name="mail" size={24} color="#fff" />
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.contactLabel}>Email</Text>
                      <Text style={styles.contactValue} numberOfLines={1}>
                        {CONTACT.email}
                      </Text>
                    </View>
                    <Ionicons name="arrow-forward" size={20} color={C.muted} />
                  </Pressable>

                  <Pressable style={styles.contactCard} onPress={() => openUrl(URLS.call)}>
                    <View style={[styles.contactIcon, { backgroundColor: C.gold }]}>
                      <Ionicons name="call" size={24} color={C.navy} />
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.contactLabel}>Phone</Text>
                      <Text style={styles.contactValue}>{CONTACT.phoneDisplay}</Text>
                    </View>
                    <Ionicons name="arrow-forward" size={20} color={C.muted} />
                  </Pressable>

                  <Button
                    label="Contact Me Today"
                    icon="call"
                    onPress={() => openUrl(URLS.call)}
                    full
                  />
                </View>

                {/* Form */}
                <View style={[styles.formCard, { flex: isDesktop ? 1.1 : undefined, padding: isMobile ? 22 : 32 }]}>
                  <Text style={styles.formTitle}>Send me a message</Text>
                  <Text style={styles.formSub}>
                    Fill in the form and choose how you want to send it.
                  </Text>

                  <Text style={styles.label}>Full Name</Text>
                  <TextInput
                    value={form.name}
                    onChangeText={(t) => setForm({ ...form, name: t })}
                    placeholder="Your full name"
                    placeholderTextColor="#9AA7BA"
                    style={[styles.input, errors.name && styles.inputErr]}
                  />
                  {errors.name ? <Text style={styles.err}>{errors.name}</Text> : null}

                  <Text style={styles.label}>Email Address</Text>
                  <TextInput
                    value={form.email}
                    onChangeText={(t) => setForm({ ...form, email: t })}
                    placeholder="you@example.com"
                    placeholderTextColor="#9AA7BA"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    style={[styles.input, errors.email && styles.inputErr]}
                  />
                  {errors.email ? <Text style={styles.err}>{errors.email}</Text> : null}

                  <Text style={styles.label}>Message</Text>
                  <TextInput
                    value={form.message}
                    onChangeText={(t) => setForm({ ...form, message: t })}
                    placeholder="Tell me about your store or what you need help with..."
                    placeholderTextColor="#9AA7BA"
                    multiline
                    numberOfLines={5}
                    textAlignVertical="top"
                    style={[styles.input, { height: 120, paddingTop: 14 }, errors.message && styles.inputErr]}
                  />
                  {errors.message ? <Text style={styles.err}>{errors.message}</Text> : null}

                  <View style={[styles.row, { gap: 12, marginTop: 20 }]}>
                    <Button
                      label="Send on WhatsApp"
                      icon="logo-whatsapp"
                      variant="green"
                      onPress={sendWhatsApp}
                      style={{ flexGrow: 1, flexBasis: isMobile ? '100%' : 0 }}
                    />
                    <Button
                      label="Send by Email"
                      icon="mail"
                      variant="navy"
                      onPress={sendEmail}
                      style={{ flexGrow: 1, flexBasis: isMobile ? '100%' : 0 }}
                    />
                  </View>
                </View>
              </View>
            </View>
          </LinearGradient>
        </View>

        {/* ---------------- FOOTER ---------------- */}
        <View style={[styles.footer, { paddingHorizontal: pad }]}>
          <View
            style={[
              styles.container,
              {
                flexDirection: isMobile ? 'column' : 'row',
                justifyContent: 'space-between',
                alignItems: isMobile ? 'flex-start' : 'center',
                gap: 12,
              },
            ]}
          >
            <View>
              <Text style={styles.footBrand}>Ghulam Yasin</Text>
              <Text style={styles.footSub}>E-Commerce Specialist & Marketplace Manager</Text>
            </View>
            <Text style={styles.footSub}>
              © {new Date().getFullYear()} Ghulam Yasin. All rights reserved.
            </Text>
          </View>
        </View>
      </ScrollView>

      <Lightbox
        state={lightbox}
        onClose={() => setLightbox(null)}
        onChange={(i) => setLightbox((l) => ({ ...l, index: i }))}
      />

      {/* ---------------- FLOATING WHATSAPP ---------------- */}
      <Pressable
        accessibilityLabel="Chat on WhatsApp"
        onPress={() => openUrl(URLS.whatsapp('Hello Ghulam, I would like to discuss my e-commerce business.'))}
        style={({ hovered }) => [
          styles.fab,
          hovered && { transform: [{ scale: 1.07 }] },
        ]}
      >
        <Ionicons name="logo-whatsapp" size={30} color="#fff" />
      </Pressable>
    </View>
  );
}

/* ------------------------------------------------------------------ */
/*  STYLES                                                             */
/* ------------------------------------------------------------------ */
const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: C.bg },
  container: { width: '100%', maxWidth: 1180, alignSelf: 'center' },
  row: { flexDirection: 'row', flexWrap: 'wrap' },
  grid: { flexDirection: 'row', flexWrap: 'wrap' },

  /* nav */
  nav: {
    backgroundColor: C.navy,
    zIndex: 50,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.08)',
  },
  navInner: {
    height: 64,
    width: '100%',
    maxWidth: 1276,
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  brand: { flexDirection: 'row', alignItems: 'center' },
  logo: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: C.gold,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  logoText: { color: C.navy, fontWeight: '800', fontSize: 16 },
  brandText: { color: '#fff', fontWeight: '700', fontSize: 18, letterSpacing: 0.3 },
  navLinks: { flexDirection: 'row', alignItems: 'center' },
  navLink: { paddingHorizontal: 14, paddingVertical: 8 },
  navLinkText: { color: 'rgba(255,255,255,0.85)', fontSize: 15, fontWeight: '500' },
  menuBtn: { padding: 6 },
  mobileMenu: { paddingBottom: 12 },
  mobileMenuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.08)',
  },
  mobileMenuText: { color: '#fff', fontSize: 16, fontWeight: '500' },

  /* hero */
  hero: { paddingTop: 56, paddingBottom: 80, overflow: 'hidden' },
  glowA: {
    position: 'absolute',
    top: -120,
    right: -80,
    width: 380,
    height: 380,
    borderRadius: 999,
    backgroundColor: 'rgba(245,184,61,0.12)',
  },
  glowB: {
    position: 'absolute',
    bottom: -140,
    left: -100,
    width: 340,
    height: 340,
    borderRadius: 999,
    backgroundColor: 'rgba(80,140,255,0.14)',
  },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255,255,255,0.09)',
    borderRadius: 999,
    paddingVertical: 7,
    paddingHorizontal: 14,
    marginBottom: 20,
  },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: C.green, marginRight: 8 },
  pillText: { color: '#fff', fontSize: 13, fontWeight: '500' },
  heroRole: {
    color: C.gold,
    fontWeight: '700',
    fontSize: 14,
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    marginBottom: 12,
  },
  heroTitle: { color: '#fff', fontWeight: '800', lineHeight: undefined, letterSpacing: -0.5 },
  heroText: { color: 'rgba(255,255,255,0.8)', fontSize: 16.5, lineHeight: 26, marginTop: 18 },
  stat: { color: C.gold, fontSize: 28, fontWeight: '800' },
  statLabel: { color: 'rgba(255,255,255,0.7)', fontSize: 13, marginTop: 2 },
  photoRing: {
    padding: 8,
    borderWidth: 3,
    borderColor: C.gold,
    backgroundColor: 'rgba(255,255,255,0.08)',
  },
  floatBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: C.gold,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 999,
    marginTop: -22,
  },
  floatBadgeText: { color: C.navy, fontWeight: '700', marginLeft: 8, fontSize: 13.5 },

  /* sections */
  section: { paddingVertical: 80 },
  eyebrow: {
    backgroundColor: C.soft,
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 999,
    marginBottom: 14,
  },
  eyebrowText: { color: C.navy3, fontWeight: '700', fontSize: 12, letterSpacing: 1.5 },
  h2: { fontSize: 32, fontWeight: '800', letterSpacing: -0.3, maxWidth: 820 },
  h2Left: { fontSize: 28, fontWeight: '800', color: C.text, marginBottom: 12 },
  h3: { fontSize: 24, fontWeight: '800', color: C.text },
  lead: { fontSize: 16.5, lineHeight: 26, marginTop: 14, maxWidth: 780 },

  /* cards */
  card: {
    backgroundColor: C.card,
    borderRadius: 20,
    padding: 24,
    borderWidth: 1,
    borderColor: C.line,
    ...shadow,
  },
  iconBox: {
    width: 56,
    height: 56,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  cardTitle: { fontSize: 19, fontWeight: '800', color: C.text },
  checkRow: { flexDirection: 'row', alignItems: 'flex-start', marginTop: 9 },
  checkText: { flex: 1, marginLeft: 8, color: C.muted, fontSize: 14.5, lineHeight: 21 },

  /* marketplaces */
  tabs: { paddingHorizontal: 4, gap: 10 },
  tab: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 11,
    paddingHorizontal: 18,
    borderRadius: 999,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: C.line,
  },
  tabText: { color: C.text, fontWeight: '700', fontSize: 14.5 },
  marketIcon: {
    width: 52,
    height: 52,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },

  /* gallery */
  galleryTitle: { marginLeft: 8, fontSize: 17, fontWeight: '800', color: C.text },
  shot: {
    backgroundColor: C.bg,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: C.line,
    overflow: 'hidden',
  },
  zoomHint: {
    position: 'absolute',
    right: 10,
    bottom: 10,
    backgroundColor: 'rgba(11,31,58,0.75)',
    borderRadius: 999,
    padding: 7,
  },
  lbBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(5,12,25,0.92)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  lbBox: { width: '100%', maxWidth: 1000, height: '80%' },
  lbClose: {
    position: 'absolute',
    top: 24,
    right: 20,
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 999,
    padding: 8,
  },
  lbNav: {
    position: 'absolute',
    top: '50%',
    marginTop: -26,
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 999,
    padding: 10,
  },
  lbCount: { position: 'absolute', bottom: 28, color: '#fff', fontWeight: '700' },

  /* process */
  step: {
    backgroundColor: 'rgba(255,255,255,0.07)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.14)',
    borderRadius: 18,
    padding: 18,
    alignItems: 'center',
    minHeight: 130,
    justifyContent: 'center',
  },
  stepNum: {
    position: 'absolute',
    top: 10,
    left: 12,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(245,184,61,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepNumText: { color: '#fff', fontSize: 12, fontWeight: '800' },
  stepText: { color: '#fff', fontWeight: '700', fontSize: 14.5, textAlign: 'center', marginTop: 10 },

  /* support */
  supportBox: {
    backgroundColor: C.bg,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: C.line,
  },
  note: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#FFF7E3',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#F7E1A6',
    padding: 16,
    marginTop: 22,
  },
  noteText: { flex: 1, marginLeft: 10, color: '#6B5314', fontWeight: '600', lineHeight: 22, fontSize: 14.5 },

  /* why */
  whyCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: C.line,
  },
  whyIcon: {
    width: 46,
    height: 46,
    borderRadius: 13,
    backgroundColor: C.soft,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  whyText: { flex: 1, color: C.text, fontWeight: '700', fontSize: 15, lineHeight: 21 },

  /* contact */
  contactCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 16,
  },
  contactIcon: {
    width: 50,
    height: 50,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  contactLabel: { color: C.muted, fontSize: 12.5, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.8 },
  contactValue: { color: C.text, fontSize: 16.5, fontWeight: '800', marginTop: 2 },
  formCard: { backgroundColor: '#fff', borderRadius: 24 },
  formTitle: { fontSize: 22, fontWeight: '800', color: C.text },
  formSub: { color: C.muted, marginTop: 4, marginBottom: 8, fontSize: 14.5 },
  label: { color: C.text, fontWeight: '700', fontSize: 13.5, marginTop: 14, marginBottom: 7 },
  input: {
    backgroundColor: C.bg,
    borderWidth: 1,
    borderColor: C.line,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 13,
    fontSize: 15.5,
    color: C.text,
    ...(Platform.OS === 'web' ? { outlineStyle: 'none' } : null),
  },
  inputErr: { borderColor: '#E5484D' },
  err: { color: '#E5484D', fontSize: 12.5, marginTop: 5 },

  /* reviews */
  reviewCard: {
    minHeight: 220,
    padding: 22,
    ...Platform.select({
      web: { boxShadow: '0 3px 12px rgba(11,31,58,0.07)' },
      default: { shadowOpacity: 0.06, shadowRadius: 8, shadowOffset: { width: 0, height: 3 }, elevation: 2 },
    }),
  },
  reviewText: { color: C.text, fontSize: 15.5, lineHeight: 24, marginTop: 14, marginBottom: 16 },
  reviewItem: { color: C.muted, fontSize: 13, lineHeight: 19, marginBottom: 14, marginTop: -4 },
  reviewDivider: { height: 1, backgroundColor: C.line, marginBottom: 14 },
  reviewName: { color: C.text, fontWeight: '800', fontSize: 15.5 },
  reviewMeta: { color: C.muted, fontSize: 13, marginTop: 2 },
  reviewShotBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 7,
    paddingHorizontal: 12,
    borderRadius: 999,
    backgroundColor: C.soft,
  },
  reviewShotText: { color: C.navy2, fontWeight: '700', fontSize: 13 },
  localBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#FFF7E3',
    borderRadius: 10,
    paddingVertical: 6,
    paddingHorizontal: 10,
    marginTop: 12,
    alignSelf: 'flex-start',
  },
  localBadgeText: { color: '#6B5314', fontSize: 12, fontWeight: '600' },
  positiveBadge: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  positiveText: { color: '#1E8E4E', fontWeight: '800', fontSize: 14 },
  sliderControls: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 16, marginTop: 20 },
  sliderBtn: {
    width: 42,
    height: 42,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: C.line,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dots: { flexDirection: 'row', alignItems: 'center', gap: 6, flexShrink: 1, flexWrap: 'wrap', justifyContent: 'center', maxWidth: 220 },
  dot2: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#CBD5E4' },
  dot2On: { width: 22, backgroundColor: C.goldDark },
  ratingSummary: { alignItems: 'center', justifyContent: 'center', marginBottom: 30 },
  ratingBig: { color: C.text, fontSize: 52, fontWeight: '800', letterSpacing: -1 },
  emptyReviews: {
    alignItems: 'center',
    backgroundColor: C.bg,
    borderWidth: 1,
    borderColor: C.line,
    borderRadius: 20,
    paddingVertical: 36,
    paddingHorizontal: 20,
  },
  emptyReviewsTitle: { color: C.text, fontWeight: '800', fontSize: 18, marginTop: 10 },
  emptyReviewsText: { color: C.muted, marginTop: 4, fontSize: 15 },
  successBox: {
    backgroundColor: '#EAF8EF',
    borderWidth: 1,
    borderColor: '#BFE6CC',
    borderRadius: 14,
    padding: 16,
    marginTop: 22,
  },
  successTitle: { color: '#14532D', fontWeight: '800', fontSize: 16 },
  successText: { color: '#1F5133', marginTop: 8, lineHeight: 22, fontSize: 14.5 },

  /* buttons */
  btn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
    paddingHorizontal: 24,
    borderRadius: 14,
    borderWidth: 1,
  },
  btnText: { fontWeight: '800', fontSize: 15.5 },

  /* footer + fab */
  footer: { backgroundColor: '#07162B', paddingVertical: 30 },
  footBrand: { color: '#fff', fontWeight: '800', fontSize: 17 },
  footSub: { color: 'rgba(255,255,255,0.6)', fontSize: 13.5, marginTop: 3 },
  fab: {
    position: Platform.OS === 'web' ? 'fixed' : 'absolute',
    right: 18,
    bottom: 22,
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: C.green,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 100,
    ...Platform.select({
      web: { boxShadow: '0 8px 22px rgba(37,211,102,0.45)' },
      default: { elevation: 8 },
    }),
  },
});
