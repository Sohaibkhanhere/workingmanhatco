const User = require('../models/User');
const Product = require('../models/Product');
const Order = require('../models/Order');
const Settings = require('../models/Settings');

const products = [
  { title: "Workin' Man Patch Hat!", slug: "workin-man-patch-hat", description: "Yupoong Classic. Style - Flat Bill 5 Panel Snapback. Fit - High Profile Crown. This hat is built for the everyday workin' man who demands quality and style.", price: 32, category: "Hats", sku: "WM-HAT-001", featured: true, images: ["https://images.squarespace-cdn.com/content/v1/6890bae40faa362f5af230e2/1782667569729-3KH00YRK70BMIYQ0WX96/C6807D21-9765-4674-9A45-5402349A9011.jpeg"], sizes: [{ name: "One Size", price: 32 }], colors: ["Black"], tags: ["hat", "cap", "patch", "snapback", "workin man"] },
  { title: "USA Blue", slug: "usa-blue", description: "Yupoong Classic. Style - Flat Bill 5 Panel Snapback. Fit - High Profile Crown. Show your American pride with this bold blue colorway.", price: 30, category: "Hats", sku: "WM-HAT-002", images: ["https://images.squarespace-cdn.com/content/v1/6890bae40faa362f5af230e2/1782066163228-H1R7HUF6Y6PXFCDB9PRO/A5EAD9B2-4A79-458E-A4A0-11A3290BCC2D.png"], sizes: [{ name: "One Size", price: 30 }], colors: ["Blue"], tags: ["hat", "usa", "american", "blue"] },
  { title: "USA Red", slug: "usa-red", description: "Yupoong Classic. Style - Flat Bill 5 Panel Snapback. Fit - High Profile Crown. Bold red for the proud American.", price: 30, category: "Hats", sku: "WM-HAT-003", images: ["https://images.squarespace-cdn.com/content/v1/6890bae40faa362f5af230e2/1782066141471-U4RX23Z7NUZH9RKAVGHZ/394D8D71-5598-4BE2-A716-9A7A028D93FE.png"], sizes: [{ name: "One Size", price: 30 }], colors: ["Red"], tags: ["hat", "usa", "american", "red"] },
  { title: "Red White Blue Collar", slug: "red-white-blue-collar", description: "All tee shirts are printed on Comfort Colors style tees. 100% Cotton. Presale purchase with 2 week turnaround. Represent the blue collar lifestyle.", price: 30, category: "Apparel", sku: "WM-APP-001", images: ["https://images.squarespace-cdn.com/content/v1/6890bae40faa362f5af230e2/1782066108791-UEZ5ZTBEMZ8V7B70LSP9/ED57DD9F-E587-4566-A885-8BEA404F2C13.png"], sizes: [{ name: "XSmall", price: 30 }, { name: "Small", price: 30 }, { name: "Medium", price: 30 }, { name: "Large", price: 30 }, { name: "XLarge", price: 30 }, { name: "2XLarge", price: 30 }, { name: "3XLarge", price: 30 }], colors: ["Blue"], tags: ["tee", "shirt", "collar", "patriotic"], featured: true },
  { title: "Red, White, & Blue Collar", slug: "red-white-blue-collar-alt", description: "All tee shirts are printed on Comfort Colors style tees. 100% Cotton. Presale purchase with 2 week turnaround.", price: 30, category: "Apparel", sku: "WM-APP-002", images: ["https://images.squarespace-cdn.com/content/v1/6890bae40faa362f5af230e2/1781924720958-1ABVNN1RXRGPLS2G3WUQ/B9C56799-0A39-4AA9-92DE-0098E464F103.png"], sizes: [{ name: "XSmall", price: 30 }, { name: "Small", price: 30 }, { name: "Medium", price: 30 }, { name: "Large", price: 30 }, { name: "XLarge", price: 30 }, { name: "2XLarge", price: 30 }, { name: "3XLarge", price: 30 }], colors: ["Red", "White", "Blue"], tags: ["tee", "shirt", "collar", "patriotic"] },
  { title: "Revolutionary Workin' Man", slug: "revolutionary-workin-man", description: "Yupoong Classic. Style - Flat Bill 5 Panel Snapback. Fit - High Profile Crown. Revolutionary style for the modern workin' man.", price: 30, category: "Hats", sku: "WM-HAT-004", images: ["https://images.squarespace-cdn.com/content/v1/6890bae40faa362f5af230e2/1781924595067-KEW3QUBNNCYI7WJTQI5B/6D96A246-1B11-45A6-A7D3-C16E20FB74EA.png"], sizes: [{ name: "One Size", price: 30 }], colors: ["Black"], tags: ["hat", "revolutionary", "workin man"] },
  { title: "Built For America 250th", slug: "built-for-america-250th", description: "Yupoong Classic. Style - Flat Bill 5 Panel Snapback. Fit - High Profile Crown. Celebrating 250 years of American craftsmanship.", price: 30, category: "Hats", sku: "WM-HAT-005", images: ["https://images.squarespace-cdn.com/content/v1/6890bae40faa362f5af230e2/1781923828356-AY8SZVRU6NO76QFCDPUW/23D86C2A-976C-4989-8305-D09B6274F7D4.png"], sizes: [{ name: "One Size", price: 30 }], colors: ["Black"], tags: ["hat", "america", "250th", "patriotic"] },
  { title: "Chasin' Wake", slug: "chasin-wake", description: "Yupoong Classic. Style - Flat Bill 5 Panel Snapback. Fit - High Profile Crown. For those who live for the ride.", price: 30, category: "Hats", sku: "WM-HAT-006", images: ["https://images.squarespace-cdn.com/content/v1/6890bae40faa362f5af230e2/1781923338646-WUS1HSTKI202SL1HPD0Z/CBD639FB-4DC7-4C6D-A4B1-5EFB6C39AB13.png"], sizes: [{ name: "One Size", price: 30 }], colors: ["Blue"], tags: ["hat", "wake", "boat", "lake"] },
  { title: "Blue Collar To The Bone", slug: "blue-collar-to-the-bone", description: "Yupoong Classic. Style - Flat Bill 5 Panel Snapback. Fit - High Profile Crown. Blue collar pride runs deep.", price: 30, category: "Hats", sku: "WM-HAT-007", images: ["https://images.squarespace-cdn.com/content/v1/6890bae40faa362f5af230e2/1781996979884-J00J74CSWIPQA1NNSW58/C15FADA2-7FDF-4750-B975-4E2C1ACFAFCD.png"], sizes: [{ name: "One Size", price: 30 }], colors: ["Blue"], tags: ["hat", "blue collar", "work"] },
  { title: "Cowboy Killer", slug: "cowboy-killer", description: "Yupoong Classic. Style - Flat Bill 5 Panel Snapback. Fit - High Profile Crown. Bold style that commands attention.", price: 32, category: "Hats", sku: "WM-HAT-008", featured: true, images: ["https://images.squarespace-cdn.com/content/v1/6890bae40faa362f5af230e2/1780706975587-O4QO60MOJC6OYRW2C2SI/DD02D12D-3C4F-441E-BCB1-93D054E1D031.png"], sizes: [{ name: "One Size", price: 32 }], colors: ["Black"], tags: ["hat", "cowboy", "bold"] },
  { title: "Coastal Vice", slug: "coastal-vice", description: "Yupoong Classic. Style - Flat Bill 5 Panel Snapback. Fit - High Profile Crown. Coastal vibes meet workin' man grit.", price: 32, category: "Hats", sku: "WM-HAT-009", images: ["https://images.squarespace-cdn.com/content/v1/6890bae40faa362f5af230e2/1779235531817-S0G3JCX220MS8IYFDHLE/889EB923-6405-4AC9-A949-BAB7B25193E2.jpeg"], sizes: [{ name: "One Size", price: 32 }], colors: ["Teal"], tags: ["hat", "coastal", "beach", "vintage"] },
  { title: "Gold Standard", slug: "gold-standard", description: "Yupoong Classic. Style - Flat Bill 5 Panel Snapback. Fit - High Profile Crown. The gold standard of headwear.", price: 32, category: "Hats", sku: "WM-HAT-010", images: ["https://images.squarespace-cdn.com/content/v1/6890bae40faa362f5af230e2/1779235424637-RNPZIHEC3C234C31B9DT/AEF83873-782B-41A5-949F-C3FBCF20445B.jpeg"], sizes: [{ name: "One Size", price: 32 }], colors: ["Gold"], tags: ["hat", "gold", "premium"] },
  { title: "The Sunday Green", slug: "the-sunday-green", description: "Yupoong Classic. Style - Flat Bill 5 Panel Snapback. Fit - High Profile Crown. Relaxed Sunday vibes in green.", price: 32, category: "Hats", sku: "WM-HAT-011", images: ["https://images.squarespace-cdn.com/content/v1/6890bae40faa362f5af230e2/1776110519836-8YKUA34DNF7U4R5ZST6I/67E1960F-4523-4F88-AF8B-90B2C77B0579.jpeg"], sizes: [{ name: "One Size", price: 32 }], colors: ["Green"], tags: ["hat", "green", "sunday", "golf"] },
  { title: "Mulligan Master", slug: "mulligan-master", description: "Yupoong Classic. Style - Flat Bill 5 Panel Snapback. Fit - High Profile Crown. For the golfer who never gives up.", price: 35, category: "Hats", sku: "WM-HAT-012", images: ["https://images.squarespace-cdn.com/content/v1/6890bae40faa362f5af230e2/1775607103961-5LLKV869QR0FZIVPJV6P/E9D85F61-0EDE-490E-9927-87B2C75D01EB.jpeg"], sizes: [{ name: "One Size", price: 35 }], colors: ["Green"], tags: ["hat", "golf", "mulligan"] },
  { title: "Bass to the Bone", slug: "bass-to-the-bone", description: "Yupoong Classic. Style - Flat Bill 5 Panel Snapback. Fit - High Profile Crown. For the fisherman at heart.", price: 35, category: "Hats", sku: "WM-HAT-013", images: ["https://images.squarespace-cdn.com/content/v1/6890bae40faa362f5af230e2/09e4a5d0-d150-448f-96b1-f4bf3a45e96d/BBEC46E0-E262-443A-B124-E8A1D4EC36FC.PNG"], sizes: [{ name: "One Size", price: 35 }], colors: ["Camo"], tags: ["hat", "fishing", "bass", "outdoor"] },
  { title: "Dirt Rich", slug: "dirt-rich", description: "Yupoong Classic. Style - Flat Bill 5 Panel Snapback. Fit - High Profile Crown. Rich in spirit, dirty in hands.", price: 35, category: "Hats", sku: "WM-HAT-014", images: ["https://images.squarespace-cdn.com/content/v1/6890bae40faa362f5af230e2/b24b7c21-579c-464b-a01c-3cc3bfe820e4/machine+operator+stock.PNG"], sizes: [{ name: "One Size", price: 35 }], colors: ["Brown"], tags: ["hat", "dirt", "work", "industrial"] },
  { title: "Patch Sunsets", slug: "patch-sunsets", description: "Yupoong Classic. Style - Flat Bill 5 Panel Snapback. Fit - High Profile Crown. Chase sunsets and dreams.", price: 35, category: "Hats", sku: "WM-HAT-015", images: ["https://images.squarespace-cdn.com/content/v1/6890bae40faa362f5af230e2/1cc88ac3-24df-41f2-93dc-aab25e172ccc/oil+field+sunset+stock.PNG"], sizes: [{ name: "One Size", price: 35 }], colors: ["Orange"], tags: ["hat", "sunset", "patch", "golden hour"] },
  { title: "Mainline Misfit", slug: "mainline-misfit", description: "Yupoong Classic. Style - Flat Bill 5 Panel Snapback. Fit - High Profile Crown. Off the beaten path.", price: 35, category: "Hats", sku: "WM-HAT-016", images: ["https://images.squarespace-cdn.com/content/v1/6890bae40faa362f5af230e2/60c66e02-d956-4a18-bdd3-aa182fbe756c/train+sunset+stock.jpeg"], sizes: [{ name: "One Size", price: 35 }], colors: ["Sunset"], tags: ["hat", "train", "sunset", "misfit"] },
  { title: "Blue Collar Lover Girl Tee", slug: "blue-collar-lover-girl-tee", description: "All tee shirts are printed on Comfort Colors style tees. 100% Cotton. Presale purchase with 2 week turnaround. For the ladies who work as hard as the men.", price: 35, category: "Apparel", sku: "WM-APP-003", featured: true, images: ["https://images.squarespace-cdn.com/content/v1/6890bae40faa362f5af230e2/b384cabb-0172-498d-a73a-45b5149a6eb6/Blue+Collar+Lover+Girl.jpg"], sizes: [{ name: "XSmall", price: 35 }, { name: "Small", price: 35 }, { name: "Medium", price: 35 }, { name: "Large", price: 35 }, { name: "XLarge", price: 35 }, { name: "2XLarge", price: 35 }, { name: "3XLarge", price: 35 }], colors: ["Pink"], tags: ["tee", "women", "lover girl", "pink"] },
  { title: "American Proud Tee", slug: "american-proud-tee", description: "All tee shirts are printed on Comfort Colors style tees. 100% Cotton. Presale purchase with 2 week turnaround. Wear your pride on your chest.", price: 35, category: "Apparel", sku: "WM-APP-004", featured: true, images: ["https://images.squarespace-cdn.com/content/v1/6890bae40faa362f5af230e2/95778d19-6885-4a47-93e4-cafb33062a51/C1B99B95-C40F-4002-A615-039585795F53.png"], sizes: [{ name: "XSmall", price: 35 }, { name: "Small", price: 35 }, { name: "Medium", price: 35 }, { name: "Large", price: 35 }, { name: "XLarge", price: 35 }, { name: "2XLarge", price: 35 }, { name: "3XLarge", price: 35 }], colors: ["Red", "White", "Blue"], tags: ["tee", "american", "proud", "patriotic"] },
  { title: "American Proud Hoodie / Crewneck", slug: "american-proud-hoodie", description: "All hoodies are presale purchases! Each hoodie is made to order with a 2 week turnaround from your purchase date. Warmth meets patriotism.", price: 40, category: "Apparel", sku: "WM-APP-005", images: ["https://images.squarespace-cdn.com/content/v1/6890bae40faa362f5af230e2/52ae2daf-2804-4bad-86e0-34168ec07040/069C4E86-F872-419E-BABD-F72E29A140CB.png"], sizes: [{ name: "XSmall", price: 40 }, { name: "Small", price: 40 }, { name: "Medium", price: 40 }, { name: "Large", price: 40 }, { name: "XLarge", price: 40 }, { name: "2XLarge", price: 40 }, { name: "3XLarge", price: 45 }, { name: "4XLarge", price: 45 }, { name: "5XLarge", price: 50 }], colors: ["Navy"], tags: ["hoodie", "american", "proud", "sweatshirt"] },
  { title: "Iron Skull Tee", slug: "iron-skull-tee", description: "All tee shirts are printed on Comfort Colors style tees. 100% Cotton. Presale purchase with 2 week turnaround. Tough as iron.", price: 35, category: "Apparel", sku: "WM-APP-006", images: ["https://images.squarespace-cdn.com/content/v1/6890bae40faa362f5af230e2/6a066bd6-797e-4892-b7f3-22e3be0c3daa/F7CB421A-5C51-435A-B8CD-CCECC966F195.PNG"], sizes: [{ name: "XSmall", price: 35 }, { name: "Small", price: 35 }, { name: "Medium", price: 35 }, { name: "Large", price: 35 }, { name: "XLarge", price: 35 }, { name: "2XLarge", price: 35 }, { name: "3XLarge", price: 35 }], colors: ["Black"], tags: ["tee", "skull", "iron", "edgy"] },
  { title: "OG Logo Workin' Man Hoodie / Crewneck", slug: "og-logo-workin-man-hoodie", description: "All hoodies are presale purchases! Each hoodie is made to order with a 2 week turnaround from your purchase date. The original that started it all.", price: 40, category: "Apparel", sku: "WM-APP-007", featured: true, images: ["https://images.squarespace-cdn.com/content/v1/6890bae40faa362f5af230e2/6577b43c-4483-4d19-bbd8-e42816dbec0f/IMG_0339.jpeg"], sizes: [{ name: "XSmall", price: 40 }, { name: "Small", price: 40 }, { name: "Medium", price: 40 }, { name: "Large", price: 40 }, { name: "XLarge", price: 40 }, { name: "2XLarge", price: 40 }, { name: "3XLarge", price: 45 }, { name: "4XLarge", price: 45 }, { name: "5XLarge", price: 50 }], colors: ["Black", "White", "Pink", "Orange"], tags: ["hoodie", "og", "logo", "classic", "sweatshirt"] },
  { title: "OG Workin' Man Logo Hat", slug: "og-workin-man-logo-hat", description: "Yupoong Classic. Style - Flat Bill 5 Panel Snapback. Fit - High Profile Crown. The hat that started the movement.", price: 32, category: "Hats", sku: "WM-HAT-017", images: ["https://images.squarespace-cdn.com/content/v1/6890bae40faa362f5af230e2/f01cfb27-792b-4e90-9df2-a3aa41e3a69d/IMG_3803.jpeg"], sizes: [{ name: "One Size", price: 32 }], colors: ["Black"], tags: ["hat", "og", "logo", "classic"] },
  { title: "OG Workin' Man Tee", slug: "og-workin-man-tee", description: "All tee shirts are printed on Comfort Colors style tees. 100% Cotton. Presale purchase with 2 week turnaround. The original tee.", price: 35, category: "Apparel", sku: "WM-APP-008", images: ["https://images.squarespace-cdn.com/content/v1/6890bae40faa362f5af230e2/d515a8a5-31b5-449c-b621-9fa46f51dd67/19F3CDEE-352E-4B68-B3E4-EA5CCDC2C7A1.png"], sizes: [{ name: "XSmall", price: 35 }, { name: "Small", price: 35 }, { name: "Medium", price: 35 }, { name: "Large", price: 35 }, { name: "XLarge", price: 35 }, { name: "2XLarge", price: 35 }, { name: "3XLarge", price: 35 }], colors: ["Black"], tags: ["tee", "og", "logo", "classic"] }
];

async function seed() {
  console.log('Seeding database...');
  await User.deleteMany({});
  await Product.deleteMany({});
  await Order.deleteMany({});
  await Settings.deleteMany({});

  await User.create({ email: 'admin@workinmanhatco.com', password: 'admin123', name: 'Admin', role: 'admin' });
  console.log('  Created admin user');

  await Product.insertMany(products);
  console.log('  Inserted ' + products.length + ' products');

  const allProducts = await Product.find({});
  const fp = (title) => allProducts.find(p => p.title === title);

  const orders = [
    {
      orderNumber: 'WM-0001',
      customer: { name: 'John Smith', email: 'john.smith@example.com', address: '123 Main St', city: 'Houston', state: 'TX', zip: '77001', phone: '555-0101' },
      items: [
        { product: fp("Workin' Man Patch Hat!")._id, title: "Workin' Man Patch Hat!", price: 32, quantity: 1, size: 'One Size', color: 'Black', image: products[0].images[0] },
        { product: fp('Cowboy Killer')._id, title: 'Cowboy Killer', price: 32, quantity: 1, size: 'One Size', color: 'Black', image: products[8].images[0] },
        { product: fp('Blue Collar Lover Girl Tee')._id, title: 'Blue Collar Lover Girl Tee', price: 35, quantity: 1, size: 'Large', color: 'Pink', image: products[17].images[0] }
      ],
      total: 99, status: 'delivered', paymentMethod: 'card'
    },
    {
      orderNumber: 'WM-0002',
      customer: { name: 'Mike Johnson', email: 'mike.j@example.com', address: '456 Oak Ave', city: 'Dallas', state: 'TX', zip: '75201', phone: '555-0202' },
      items: [
        { product: fp('American Proud Tee')._id, title: 'American Proud Tee', price: 35, quantity: 1, size: 'Large', color: 'Red', image: products[18].images[0] },
        { product: fp('USA Blue')._id, title: 'USA Blue', price: 30, quantity: 1, size: 'One Size', color: 'Blue', image: products[1].images[0] }
      ],
      total: 65, status: 'shipped', paymentMethod: 'card'
    },
    {
      orderNumber: 'WM-0003',
      customer: { name: 'James Wilson', email: 'james.w@example.com', address: '789 Pine Rd', city: 'Austin', state: 'TX', zip: '73301', phone: '555-0303' },
      items: [
        { product: fp("OG Workin' Man Logo Hat")._id, title: "OG Workin' Man Logo Hat", price: 32, quantity: 1, size: 'One Size', color: 'Black', image: products[23].images[0] }
      ],
      total: 32, status: 'processing', paymentMethod: 'card'
    },
    {
      orderNumber: 'WM-0004',
      customer: { name: 'Robert Davis', email: 'robert.d@example.com', address: '321 Elm St', city: 'San Antonio', state: 'TX', zip: '78201', phone: '555-0404' },
      items: [
        { product: fp("OG Logo Workin' Man Hoodie / Crewneck")._id, title: "OG Logo Workin' Man Hoodie / Crewneck", price: 40, quantity: 1, size: 'Large', color: 'Black', image: products[22].images[0] },
        { product: fp('Coastal Vice')._id, title: 'Coastal Vice', price: 32, quantity: 1, size: 'One Size', color: 'Teal', image: products[9].images[0] },
        { product: fp('Gold Standard')._id, title: 'Gold Standard', price: 32, quantity: 1, size: 'One Size', color: 'Gold', image: products[10].images[0] },
        { product: fp('Iron Skull Tee')._id, title: 'Iron Skull Tee', price: 35, quantity: 1, size: 'Medium', color: 'Black', image: products[21].images[0] }
      ],
      total: 139, status: 'pending', paymentMethod: 'card'
    }
  ];

  await Order.insertMany(orders);
  console.log('  Created ' + orders.length + ' sample orders');

  await Settings.create({
    siteName: "Workin' Man Hat Co.",
    tagline: "For your every day workin'man",
    logo: 'https://images.squarespace-cdn.com/content/v1/6890bae40faa362f5af230e2/1754520881053-GITP2B476NHFI441CJ5Y/IMG_3617.jpeg?format=1500w',
    colors: { primary: '#36302A', secondary: '#F6F3EC', accent: '#B9A590', background: '#FDF8F6', text: '#000000', darkBg: '#1a1a1a', darkSurface: '#242424', darkText: '#F6F3EC' },
    fonts: { heading: 'Six Caps', body: 'Source Sans Pro' },
    social: { instagram: 'https://www.instagram.com/workinmanhatco/', facebook: 'https://www.facebook.com/profile.php?id=61578779784429', tiktok: 'https://www.tiktok.com/@workinmanhatco/', youtube: '', twitter: '' },
    contact: { email: 'workinmanhatco@gmail.com', phone: '', address: 'Texas, USA' },
    seo: {
      metaTitle: "Workin' Man Hat Co. | Hats & Apparel for the Everyday Workin' Man",
      metaDescription: "Premium hats and apparel built on hard work, American pride, and quality craftsmanship. Shop caps, tees, hoodies and more.",
      keywords: 'workin man, hats, caps, american made, apparel, blue collar, work wear',
      geoRegion: 'US-TX', geoPlacename: 'Texas', geoPosition: '31.0;-100.0', icbm: '31.0, -100.0'
    },
    homepage: {
      heroTitle: "For your every day workin'man",
      heroSubtitle: 'COME CHECK US OUT',
      heroImage: 'https://images.squarespace-cdn.com/content/v1/6890bae40faa362f5af230e2/f4c02976-3f0a-4d66-975f-c6eee8ed8a36/F16BBA54-AF60-4D50-9739-4A570BD208D5.png',
      aboutTitle: 'Built on Hard Work',
      aboutText: 'Hats and apparel for the everyday workin\u2019 Man. Our story is built on hard work, American pride, and quality craftsmanship.',
      aboutImage: '',
      brandStoryTitle: 'Our Story',
      brandStoryText: "What started as a passion for quality headwear has grown into a movement. Every Workin' Man product is designed for those who build, create, and hustle every single day.",
      newsletterTitle: 'Join the Crew',
      newsletterText: 'Sign up for exclusive drops, discounts, and behind-the-scenes content.',
      testimonialTitle: 'What People Say',
      ctaTitle: 'Ready to Gear Up?',
      ctaText: "Shop our latest collection and represent the workin' man lifestyle."
    }
  });
  console.log('  Created default settings');
  console.log('Database seeded successfully!');
}

module.exports = { seed, products };
