import mongoose from "mongoose";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import Product from "./models/product.js";
import nodemailer from 'nodemailer';

dotenv.config();

const productData = [
  { 
    name: "Classic Sourdough", 
    cat: "Bread & Rolls", 
    price: "₹320", 
    calories: "220 kcal / slice",
    protein: "8g",
    img: "https://plus.unsplash.com/premium_photo-1667806841904-751960cadc78?w=800", 
    desc: "Our signature sourdough is fermented for 48 hours using a 15-year-old starter.",
    rating: 4.6, reviews: 120,
    sound: "https://www.zapsplat.com/wp-content/uploads/2015/sound-effects-61905/61905_1454504107.mp3"
  },
  { 
    name: "Sea Salt Croissant", 
    cat: "Pastries & Sweets", 
    price: "₹180", 
    calories: "280 kcal",
    protein: "5g",
    img: "https://images.unsplash.com/photo-1555507036-ab1f4038808a?q=80&w=1200", 
    desc: "Butter-layered French pastry finished with a pinch of hand-harvested sea salt.",
    rating: 4.7, reviews: 98,
    sound: "https://assets.mixkit.co/active_storage/sfx/702/702-preview.mp3"
  },
  { 
    name: "Feto Filo Crown", 
    cat: "Savoury & Snack Items", 
    price: "₹340", 
    calories: "340 kcal",
    protein: "9g",
    img: "https://plus.unsplash.com/premium_photo-1669253692097-490087c4f8d0?w=800", 
    desc: "A savory masterpiece featuring salty feta cheese and fresh herbs wrapped in filo.",
    rating: 4.5, reviews: 85,
    sound: "https://www.zapsplat.com/wp-content/uploads/2015/sound-effects-35448/35448_1437145448.mp3"
  },
  { 
    name: "Lavender Velvet Cake", 
    cat: "Cakes", 
    price: "₹750",
    calories: "450 kcal / slice",
    protein: "4g",
    img: "https://plus.unsplash.com/premium_photo-1717017014070-2941b0d27b61?w=800", 
    desc: "A botanical masterpiece featuring delicate lavender-infused sponge layers.",
    rating: 4.9, reviews: 150,
    sound: "https://assets.mixkit.co/active_storage/sfx/1004/1004-preview.mp3"
  },
  { 
    name: "Dark Chocolate Pain", 
    cat: "Pastries & Sweets", 
    price: "₹220", 
    calories: "310 kcal",
    protein: "6g",
    img: "https://images.unsplash.com/photo-1679143121627-4dba2860ef50?w=800", 
    desc: "Enriched dough filled with 70% single-origin dark chocolate batons.",
    rating: 4.8, reviews: 110,
    sound: "https://assets.mixkit.co/active_storage/sfx/702/702-preview.mp3"
  },
  { 
    name: "Artisan Baguette", 
    cat: "Bread & Rolls", 
    price: "₹140", 
    calories: "160 kcal / portion",
    protein: "7g",
    img: "https://images.unsplash.com/photo-1597079910443-60c43fc4f729?q=80&w=1200", 
    desc: "The quintessential French staple with a crackly crust and airy crumb.",
    rating: 4.4, reviews: 210,
    sound: "https://www.zapsplat.com/wp-content/uploads/2015/sound-effects-61905/61905_1454504107.mp3"
  },
  { 
    name: "Avocado Toast", 
    cat: "Savoury & Snack Items", 
    price: "₹280", 
    calories: "380 kcal",
    protein: "11g",
    img: "https://images.pexels.com/photos/7936741/pexels-photo-7936741.jpeg", 
    desc: "Thick-cut house-made sourdough with organic smashed avocados.",
    rating: 4.7, reviews: 95,
    sound: "https://www.zapsplat.com/wp-content/uploads/2015/sound-effects-61905/61905_1454504107.mp3"
  },
  { 
    name: "Vanilla Bean Tart", 
    cat: "Pastries & Sweets", 
    price: "₹260", 
    calories: "290 kcal",
    protein: "4g",
    img: "https://images.unsplash.com/photo-1519915028121-7d3463d20b13?q=80&w=1200", 
    desc: "Buttery tart shell filled with rich Madagascar vanilla bean custard.",
    rating: 4.6, reviews: 78,
    sound: "https://assets.mixkit.co/active_storage/sfx/1004/1004-preview.mp3"
  },
  { 
    name: "Rustic Berry Cake", 
    cat: "Cakes", 
    price: "₹720", 
    calories: "390 kcal / slice",
    protein: "5g",
    img: "https://plus.unsplash.com/premium_photo-1675371100797-90cc84925477?w=800", 
    desc: "Dark chocolate sponge cake layered with fresh seasonal berry compote.",
    rating: 4.8, reviews: 130,
    sound: "https://assets.mixkit.co/active_storage/sfx/1004/1004-preview.mp3"
  },
  { 
    name: "Eclair", 
    cat: "Pastries & Sweets", 
    price: "₹210", 
    calories: "260 kcal",
    protein: "5g",
    img: "https://images.unsplash.com/photo-1753826366896-170e04691b1c?w=600", 
    desc: "French choux pastry filled with vanilla crème and chocolate ganache.",
    rating: 4.7, reviews: 88,
    sound: "https://assets.mixkit.co/active_storage/sfx/1004/1004-preview.mp3"
  },
  { 
    name: "Macaron", 
    cat: "Pastries & Sweets", 
    price: "₹95", 
    calories: "90 kcal / pc",
    protein: "2g",
    img: "https://plus.unsplash.com/premium_photo-1672986896021-cf725eba8ba3?w=600", 
    desc: "Delicate almond meringue shells with smooth ganache filling.",
    rating: 4.9, reviews: 300,
    sound: "https://www.zapsplat.com/wp-content/uploads/2015/sound-effects-35448/35448_1437145448.mp3"
  },
  { 
    name: "Cannoli", 
    cat: "Pastries & Sweets", 
    price: "₹240", 
    calories: "240 kcal",
    protein: "6g",
    img: "https://plus.unsplash.com/premium_photo-1663133750605-97df74d9d3a2?w=600", 
    desc: "Crisp fried pastry tubes filled with sweet, creamy ricotta.",
    rating: 4.6, reviews: 145,
    sound: "https://assets.mixkit.co/active_storage/sfx/702/702-preview.mp3"
  },
  { 
    name: "Zeppole", 
    cat: "Pastries & Sweets", 
    price: "₹190", 
    calories: "290 kcal",
    protein: "5g",
    img: "https://images.unsplash.com/photo-1588798569668-74249ff82df6?w=600", 
    desc: "Traditional Italian deep-fried dough balls topped with sugar.",
    rating: 4.5, reviews: 67,
    sound: "https://www.zapsplat.com/wp-content/uploads/2015/sound-effects-35448/35448_1437145448.mp3"
  },
  { 
    name: "Baklava", 
    cat: "Pastries & Sweets", 
    price: "₹280", 
    calories: "330 kcal",
    protein: "4g",
    img: "https://images.unsplash.com/photo-1598110750624-207050c4f28c?w=600", 
    desc: "Layers of filo filled with chopped nuts and honey syrup.",
    rating: 4.8, reviews: 190,
    sound: "https://assets.mixkit.co/active_storage/sfx/702/702-preview.mp3"
  },
  { 
    name: "Whoopie pie", 
    cat: "Pastries & Sweets", 
    price: "₹180", 
    calories: "350 kcal",
    protein: "3g",
    img: "https://plus.unsplash.com/premium_photo-1669557209263-94abeebafcdd?w=600", 
    desc: "Two soft chocolate cookies sandwiching marshmallow filling.",
    rating: 4.4, reviews: 55,
    sound: "https://assets.mixkit.co/active_storage/sfx/1004/1004-preview.mp3"
  },
  { 
    name: "Pastelitos", 
    cat: "Pastries & Sweets", 
    price: "₹220", 
    calories: "210 kcal",
    protein: "4g",
    img: "https://images.pexels.com/photos/30380492/pexels-photo-30380492.jpeg", 
    desc: "Cuban puff pastry turnovers filled with guava and cream cheese.",
    rating: 4.7, reviews: 42,
    sound: "https://assets.mixkit.co/active_storage/sfx/702/702-preview.mp3"
  },
  { 
    name: "French Baguettes", 
    cat: "Bread & Rolls", 
    price: "₹160", 
    calories: "140 kcal / portion",
    protein: "5g",
    img: "https://plus.unsplash.com/premium_photo-1726718604345-efbf5a45fd8a?w=600", 
    desc: "Long, thin loaf with a crisp crust and airy interior.",
    rating: 4.5, reviews: 120,
    sound: "https://www.zapsplat.com/wp-content/uploads/2015/sound-effects-61905/61905_1454504107.mp3"
  },
  { 
    name: "Italian Ciabatta Bread", 
    cat: "Bread & Rolls", 
    price: "₹210", 
    calories: "170 kcal / slice",
    protein: "6g",
    img: "https://images.unsplash.com/photo-1638668542813-6ab880c71455?w=600", 
    desc: "High-hydration bread known for large alveolar holes.",
    rating: 4.6, reviews: 89,
    sound: "https://www.zapsplat.com/wp-content/uploads/2015/sound-effects-61905/61905_1454504107.mp3"
  },
  { 
    name: "Brioche Rolls", 
    cat: "Bread & Rolls", 
    price: "₹280", 
    calories: "210 kcal",
    protein: "5g",
    img: "https://plus.unsplash.com/premium_photo-1671399556250-b5d9e9d7ef1a?w=600", 
    desc: "Enriched French bread with a high butter and egg content.",
    rating: 4.8, reviews: 112,
    sound: "https://assets.mixkit.co/active_storage/sfx/1004/1004-preview.mp3"
  },
  { 
    name: "Speciality Loaves", 
    cat: "Bread & Rolls", 
    price: "₹350", 
    calories: "190 kcal / slice",
    protein: "7g",
    img: "https://images.unsplash.com/photo-1691862469672-bbdc5b75191d?w=600", 
    desc: "Rotating artisan selection with walnuts and olives.",
    rating: 4.7, reviews: 76,
    sound: "https://www.zapsplat.com/wp-content/uploads/2015/sound-effects-61905/61905_1454504107.mp3"
  },
  { 
    name: "Classic Loaves", 
    cat: "Bread & Rolls", 
    price: "₹180", 
    calories: "150 kcal / slice",
    protein: "5g",
    img: "https://images.pexels.com/photos/32944491/pexels-photo-32944491.jpeg", 
    desc: "Traditional white or whole wheat loaves with a soft crust.",
    rating: 4.3, reviews: 200,
    sound: "https://www.zapsplat.com/wp-content/uploads/2015/sound-effects-61905/61905_1454504107.mp3"
  },
  { 
    name: "Focaccia", 
    cat: "Bread & Rolls", 
    price: "₹260", 
    calories: "250 kcal / slice",
    protein: "7g",
    img: "https://plus.unsplash.com/premium_photo-1700326967545-91adcec6af2a?w=600", 
    desc: "Italian flatbread topped with rosemary and olive oil.",
    rating: 4.8, reviews: 167,
    sound: "https://www.zapsplat.com/wp-content/uploads/2015/sound-effects-61905/61905_1454504107.mp3"
  },
  { 
    name: "Hokkaido", 
    cat: "Bread & Rolls", 
    price: "₹290", 
    calories: "185 kcal / slice",
    protein: "6g",
    img: "https://images.unsplash.com/photo-1741092966822-d5cb93046491?w=600", 
    desc: "Japanese milk bread with a cloud-like texture.",
    rating: 4.9, reviews: 143,
    sound: "https://assets.mixkit.co/active_storage/sfx/1004/1004-preview.mp3"
  },
  { 
    name: "Hawaiian Rolls", 
    cat: "Bread & Rolls", 
    price: "₹220", 
    calories: "160 kcal",
    protein: "4g",
    img: "https://images.unsplash.com/photo-1767796775779-5c39039afb06?w=600", 
    desc: "Soft and fluffy rolls with a hint of tropical sweetness.",
    rating: 4.6, reviews: 92,
    sound: "https://assets.mixkit.co/active_storage/sfx/1004/1004-preview.mp3"
  },
  { 
    name: "Rosetta Rolls", 
    cat: "Bread & Rolls", 
    price: "₹190", 
    calories: "180 kcal",
    protein: "5g",
    img: "https://images.unsplash.com/photo-1604349347116-c9eeaf23700f?q=80&w=2073", 
    desc: "Rose-shaped Italian bread with a hollow interior.",
    rating: 4.4, reviews: 51,
    sound: "https://www.zapsplat.com/wp-content/uploads/2015/sound-effects-61905/61905_1454504107.mp3"
  },
  { 
    name: "Scotch Morning Rolls", 
    cat: "Bread & Rolls", 
    price: "₹180", 
    calories: "200 kcal",
    protein: "6g",
    img: "https://images.pexels.com/photos/18584485/pexels-photo-18584485.jpeg", 
    desc: "Scottish rolls with a crispy crust and chewy center.",
    rating: 4.5, reviews: 38,
    sound: "https://www.zapsplat.com/wp-content/uploads/2015/sound-effects-61905/61905_1454504107.mp3"
  },
  { 
    name: "Turnovers", 
    cat: "Savoury & Snack Items", 
    price: "₹240", 
    calories: "320 kcal",
    protein: "4g",
    img: "https://images.pexels.com/photos/19498997/pexels-photo-19498997.jpeg", 
    desc: "Flaky puff pastry folded over sweet or savory filling.",
    rating: 4.3, reviews: 82,
    sound: "https://assets.mixkit.co/active_storage/sfx/702/702-preview.mp3"
  },
  { 
    name: "Cheese Straws", 
    cat: "Savoury & Snack Items", 
    price: "₹160", 
    calories: "120 kcal / pc",
    protein: "3g",
    img: "https://images.pexels.com/photos/14363846/pexels-photo-14363846.jpeg", 
    desc: "Sharp cheddar and parmesan puff pastry sticks.",
    rating: 4.7, reviews: 104,
    sound: "https://assets.mixkit.co/active_storage/sfx/702/702-preview.mp3"
  },
  { 
    name: "Paneer Pockets", 
    cat: "Savoury & Snack Items", 
    price: "₹220", 
    calories: "290 kcal",
    protein: "10g",
    img: "https://images.pexels.com/photos/8957093/pexels-photo-8957093.jpeg", 
    desc: "Spiced paneer bhurji in a buttery pastry shell.",
    rating: 4.8, reviews: 156,
    sound: "https://www.zapsplat.com/wp-content/uploads/2015/sound-effects-35448/35448_1437145448.mp3"
  },
  { 
    name: "Mushroom Pithivier", 
    cat: "Savoury & Snack Items", 
    price: "₹380", 
    calories: "410 kcal",
    protein: "7g",
    img: "https://images.pexels.com/photos/16406489/pexels-photo-16406489.jpeg", 
    desc: "Enclosed pie with roasted mushroom duxelles.",
    rating: 4.6, reviews: 44,
    sound: "https://www.zapsplat.com/wp-content/uploads/2015/sound-effects-61905/61905_1454504107.mp3"
  },
  { 
    name: "Margherita Scrolls", 
    cat: "Savoury & Snack Items", 
    price: "₹240", 
    calories: "300 kcal",
    protein: "9g",
    img: "https://images.unsplash.com/photo-1670338512239-556181fff224?w=600", 
    desc: "Soft dough with tomato basil sauce and mozzarella.",
    rating: 4.5, reviews: 119,
    sound: "https://assets.mixkit.co/active_storage/sfx/702/702-preview.mp3"
  },
  { 
    name: "Seasoning Bagels", 
    cat: "Savoury & Snack Items", 
    price: "₹180", 
    calories: "270 kcal",
    protein: "9g",
    img: "https://images.unsplash.com/photo-1633171702522-5806cb457df1?q=80&w=1170&auto=format&fit=crop", 
    desc: "Dense rings topped with poppy seeds and garlic.",
    rating: 4.7, reviews: 210,
    sound: "https://www.zapsplat.com/wp-content/uploads/2015/sound-effects-61905/61905_1454504107.mp3"
  },
  { 
    name: "Spinach & Cheese Muffins", 
    cat: "Savoury & Snack Items", 
    price: "₹210", 
    calories: "310 kcal",
    protein: "8g",
    img: "https://images.unsplash.com/photo-1686221817801-27b85431430d?w=600", 
    desc: "Savory breakfast muffins with spinach and feta.",
    rating: 4.4, reviews: 63,
    sound: "https://assets.mixkit.co/active_storage/sfx/1004/1004-preview.mp3"
  },
  { 
    name: "Hazelnut Praline Mousse Cake", 
    cat: "Cakes", 
    price: "₹820", 
    calories: "480 kcal",
    protein: "5g",
    img: "https://images.pexels.com/photos/9708317/pexels-photo-9708317.jpeg", 
    desc: "Hazelnut dacquoise with milk chocolate mousse.",
    rating: 4.9, reviews: 178,
    sound: "https://assets.mixkit.co/active_storage/sfx/1004/1004-preview.mp3"
  },
  { 
    name: "Tiramisu Espresso Cake", 
    cat: "Cakes", 
    price: "₹850", 
    calories: "450 kcal",
    protein: "6g",
    img: "https://images.pexels.com/photos/10169991/pexels-photo-10169991.jpeg", 
    desc: "Espresso sponge with creamy mascarpone frosting.",
    rating: 4.8, reviews: 215,
    sound: "https://assets.mixkit.co/active_storage/sfx/1004/1004-preview.mp3"
  },
  { 
    name: "Madagascar Vanilla Cake", 
    cat: "Cakes", 
    price: "₹650", 
    calories: "380 kcal",
    protein: "4g",
    img: "https://images.pexels.com/photos/7552441/pexels-photo-7552441.jpeg", 
    desc: "Classic cake with real Madagascar vanilla beans.",
    rating: 4.6, reviews: 94,
    sound: "https://assets.mixkit.co/active_storage/sfx/1004/1004-preview.mp3"
  },
  { 
    name: "Caramel & Toffee Crunch Cake", 
    cat: "Cakes", 
    price: "₹780", 
    calories: "520 kcal",
    protein: "4g",
    img: "https://images.pexels.com/photos/10510747/pexels-photo-10510747.jpeg", 
    desc: "Brown sugar sponge with salted caramel sauce.",
    rating: 4.7, reviews: 132,
    sound: "https://assets.mixkit.co/active_storage/sfx/1004/1004-preview.mp3"
  },
  { 
    name: "Torta Caprese Cake", 
    cat: "Cakes", 
    price: "₹820", 
    calories: "410 kcal",
    protein: "7g",
    img: "https://images.unsplash.com/photo-1605138693981-6c8a5ea87796?w=600", 
    desc: "Italian flourless cake made with ground almonds.",
    rating: 4.8, reviews: 160,
    sound: "https://assets.mixkit.co/active_storage/sfx/1004/1004-preview.mp3"
  },
  { 
    name: "Golden Pistachio Cake", 
    cat: "Cakes", 
    price: "₹850", 
    calories: "460 kcal",
    protein: "6g",
    img: "https://images.pexels.com/photos/15294365/pexels-photo-15294365.jpeg", 
    desc: "Pistachio sponge with rose-water infused cream.",
    rating: 4.7, reviews: 140,
    sound: "https://assets.mixkit.co/active_storage/sfx/1004/1004-preview.mp3"
  },
  { 
    name: "Ruby Rose Cake", 
    cat: "Cakes", 
    price: "₹790", 
    calories: "430 kcal",
    protein: "4g",
    img: "https://images.pexels.com/photos/17321236/pexels-photo-17321236.jpeg", 
    desc: "Pink sponge flavored with natural rose extract.",
    rating: 4.9, reviews: 120,
    sound: "https://assets.mixkit.co/active_storage/sfx/1004/1004-preview.mp3"
  },
  { 
    name: "The Bicolor Raspberry Croissant", 
    cat: "Pastries & Sweets", 
    price: "₹240", 
    calories: "430 kcal",
    protein: "8g", 
    img: "https://images.unsplash.com/photo-1595923610147-18ed661ebbf6?w=600", 
    desc: "72 hours of patience. Hand-laminated buttery layers with a vibrant, tart raspberry infusion.",
    rating: 4.9, 
    reviews: 120,
    sound: "https://assets.mixkit.co/active_storage/sfx/702/702-preview.mp3"
  },
  { 
    name: "Raspberry Vanilla Bento Cake", 
    cat: "Cakes", 
    price: "₹680", 
    calories: "520 kcal",
    protein: "12g",
    img: "https://images.unsplash.com/photo-1694067609280-5837ebf9e64f?w=600", 
    desc: "A minimalist masterpiece. Chiffon layers infused with Provence lavender.",
    rating: 5.0, 
    reviews: 42,
    sound: "https://assets.mixkit.co/active_storage/sfx/1004/1004-preview.mp3"
  },
  { 
    name: "The Miso-Caramel Gold Brownie", 
    cat: "Pastries & Sweets", 
    price: "₹210", 
    calories: "410 kcal",
    protein: "7g",
    img: "https://images.unsplash.com/photo-1702650671262-126924544820?w=600", 
    desc: "Salted caramel reimagined with white miso umami. Densely fudgy.",
    rating: 4.8, 
    reviews: 156,
    sound: "https://assets.mixkit.co/active_storage/sfx/702/702-preview.mp3"
  },
  {
    name: "Saffron Pistachio Loaf",
    cat: "Bread & Rolls",
    price: "₹450",
    desc: "Infused with premium Kashmiri saffron and toasted pistachios.",
    img: "https://images.unsplash.com/photo-1509440159596-0249088772ff"
  },
  {
    name: "Dark Chocolate Sea Salt Tart",
    cat: "Pastries & Sweets",
    price: "₹280",
    desc: "70% dark Belgian chocolate with a flaky sea salt finish.",
    img: "https://images.unsplash.com/photo-1519915028121-7d3463d20b13"
  },
  {
    name: "Wildflower Honey Madeleines",
    cat: "Pastries & Sweets",
    price: "₹350",
    desc: "Traditional French tea cakes sweetened with organic honey.",
    img: "https://images.unsplash.com/photo-1558961363-fa8fdf82db35"
  },
  {
    name: "Rose & Cardamom Sourdough",
    cat: "Bread & Rolls",
    price: "₹390",
    desc: "Naturally leavened sourdough with a floral and spice twist.",
    img: "https://images.unsplash.com/photo-1585478259715-876a6a81b212"
  },
  {
    name: "Espresso Hazelnut Biscotti",
    cat: "Pastries & Sweets",
    price: "₹320",
    desc: "Double-baked Italian biscuits, perfect for dipping in coffee.",
    img: "https://images.unsplash.com/photo-1559598467-f8b76c8155d0"
  }
];

// --- BULK NOTIFICATION FUNCTION ---
const sendSummaryEmail = async (products) => {
  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // Create HTML for each product row
    const productListHtml = products.map(p => `
      <div style="border-bottom: 1px solid #eee; padding: 15px 0; display: flex;">
        <img src="${p.img}" width="100" style="border-radius: 5px; margin-right: 15px;"/>
        <div>
          <h4 style="margin: 0; color: #333;">${p.name}</h4>
          <p style="margin: 5px 0; font-size: 14px; color: #666;">${p.desc}</p>
          <span style="color: #d4a373; font-weight: bold;">${p.price}</span>
        </div>
      </div>
    `).join('');

    await transporter.sendMail({
      from: `"Boulangerie Bakery" <${process.env.EMAIL_USER}>`,
      to: process.env.SUBSCRIBER_EMAILS || process.env.EMAIL_USER,
      subject: `🥐 New Arrivals: Check out our ${products.length} new treats!`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
          <h2 style="color: #d4a373; text-align: center;">Freshly Baked Arrivals</h2>
          <p>Hello! We've updated our menu with some amazing new items:</p>
          ${productListHtml}
          <div style="text-align: center; margin-top: 30px;">
            <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}" style="background: #d4a373; color: white; padding: 12px 25px; text-decoration: none; border-radius: 5px; font-weight: bold;">Order Now</a>
          </div>
        </div>
      `
    });
    console.log("✅ Summary email sent successfully to all subscribers.");
  } catch (error) {
    console.error("❌ Failed to send summary email:", error.message);
  }
};

const seedProducts = async () => {
  try {
    await connectDB();
    console.log("🔗 Connected to MongoDB...");

    // 1. We use insertMany() instead of .create() to avoid triggering 48 individual middleware emails
    await Product.deleteMany();
    console.log("🗑️ Old products deleted.");

    try {
      await Product.collection.dropIndexes();
      console.log("🛠️ Indexes refreshed.");
    } catch (err) {
      console.log("ℹ️ Index drop skipped.");
    }

    console.log("🌱 Seeding products to database...");
    const createdProducts = await Product.insertMany(productData);
    console.log(`✅ Success! ${createdProducts.length} Products seeded.`);

    // 2. Trigger ONE single email for everything
    console.log("📢 Preparing one summary email for all items...");
    await sendSummaryEmail(createdProducts);

    process.exit();
  } catch (error) {
    console.error("❌ Critical Seeding Failure:", error);
    process.exit(1);
  }
};

seedProducts();