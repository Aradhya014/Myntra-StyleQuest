// import { Product } from "../types";

// export const mockCatalog: Product[] = [
//   // Sneakers
//   {
//     id: "snk-1",
//     name: "Air Force 1 '07",
//     brand: "Nike",
//     category: "Sneakers",
//     price: 8495,
//     originalPrice: 9995,
//     rating: 4.8,
//     image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&q=80&w=400",
//     description: "The radiance lives on in the Nike Air Force 1 '07, the basketball original that puts a fresh spin on what you know best: durably stitched overlays, clean finishes and the perfect amount of flash."
//   },
//   {
//     id: "snk-2",
//     name: "Samba OG Shoes",
//     brand: "Adidas",
//     category: "Sneakers",
//     price: 9999,
//     originalPrice: 11999,
//     rating: 4.7,
//     image: "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&q=80&w=400",
//     description: "Born on the pitch, the Samba is a timeless icon of street style. This silhouette stays true to its legacy with a tasteful, low-profile, soft leather upper, suede overlays and gum sole."
//   },
//   {
//     id: "snk-3",
//     name: "Classic Suede Sneakers",
//     brand: "Puma",
//     category: "Sneakers",
//     price: 5499,
//     originalPrice: 6999,
//     rating: 4.5,
//     image: "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?auto=format&fit=crop&q=80&w=400",
//     description: "The Suede is Puma's most epic silhouette. It has been kicking around since 1968, worn by icons of every generation. Features full suede upper and comfy foam cushion."
//   },
//   {
//     id: "snk-4",
//     name: "Chuck Taylor All Star",
//     brand: "Converse",
//     category: "Sneakers",
//     price: 3999,
//     originalPrice: 4499,
//     rating: 4.6,
//     image: "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?auto=format&fit=crop&q=80&w=400",
//     description: "Created in 1917, the Chuck Taylor All Star sneaker was the original basketball shoe. Its use has changed over the years, but it's still perfect in its simplicity."
//   },

//   // Indian Wear
//   {
//     id: "ind-1",
//     name: "Floral Printed A-Line Kurta",
//     brand: "Anouk",
//     category: "Indian Wear",
//     price: 1299,
//     originalPrice: 2499,
//     rating: 4.3,
//     image: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&q=80&w=400",
//     description: "Blue and white floral printed A-line kurta, has a mandarin collar, three-quarter sleeves, flared hem, and front slit. Pure cotton for high durability and perfect comfort."
//   },
//   {
//     id: "ind-2",
//     name: "Handwoven Linen Nehru Jacket",
//     brand: "Fabindia",
//     category: "Indian Wear",
//     price: 3490,
//     originalPrice: 4490,
//     rating: 4.5,
//     image: "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&q=80&w=400",
//     description: "Lend a classy look to your ethnic attire with this stylish pink handwoven linen Nehru jacket. Pair it with a contrasting kurta-pyjama for family functions and festive occasions."
//   },
//   {
//     id: "ind-3",
//     name: "Zari Embroidered Anarkali Set",
//     brand: "W",
//     category: "Indian Wear",
//     price: 4999,
//     originalPrice: 7999,
//     rating: 4.6,
//     image: "https://images.unsplash.com/photo-1608748010899-18f300247112?auto=format&fit=crop&q=80&w=400",
//     description: "Magnificent red and golden embroidered Anarkali suit with heavy zari border. Elegant round neckline, flared silhouette, and matching organza dupatta."
//   },

//   // Western Wear
//   {
//     id: "wst-1",
//     name: "Slim Fit Distressed Jeans",
//     brand: "Roadstar",
//     category: "Western Wear",
//     price: 1899,
//     originalPrice: 3299,
//     rating: 4.2,
//     image: "https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&q=80&w=400",
//     description: "Medium-wash distressed jeans, designed in slim fit with clean cotton-stretch blend denim. Perfect for casual wear and daily college or weekend trips."
//   },
//   {
//     id: "wst-2",
//     name: "HRX Active Training Tee",
//     brand: "HRX by Hrithik Roshan",
//     category: "Western Wear",
//     price: 699,
//     originalPrice: 1199,
//     rating: 4.4,
//     image: "https://images.unsplash.com/photo-1581655353564-df123a1eb820?auto=format&fit=crop&q=80&w=400",
//     description: "Crafted with sweat-wicking rapid-dry fabric, this athletic t-shirt is designed to keep you cool and dry during high-intensity training sessions."
//   },
//   {
//     id: "wst-3",
//     name: "Premium Satin Slip Dress",
//     brand: "Zara",
//     category: "Western Wear",
//     price: 2990,
//     originalPrice: 3990,
//     rating: 4.7,
//     image: "https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&q=80&w=400",
//     description: "Flowy emerald green premium satin slip dress. V-neckline, thin straps that cross over at the back, and side slit detail at the hem."
//   },

//   // Accessories
//   {
//     id: "acc-1",
//     name: "Vintage Gold Digital Watch",
//     brand: "Casio",
//     category: "Accessories",
//     price: 4995,
//     originalPrice: 5995,
//     rating: 4.8,
//     image: "https://images.unsplash.com/photo-1524592094714-0f0654e20314?auto=format&fit=crop&q=80&w=400",
//     description: "Retro classic gold-tone stainless steel digital watch with daily alarm, hourly time signal, auto-calendar, and led backlighting."
//   },
//   {
//     id: "acc-2",
//     name: "Classic Polarized Aviator Sunglasses",
//     brand: "Ray-Ban",
//     category: "Accessories",
//     price: 8590,
//     originalPrice: 9990,
//     rating: 4.9,
//     image: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&q=80&w=400",
//     description: "The legendary Ray-Ban Aviator sunglasses, designed in 1937 for US military pilots. Polarized green classic lenses set in gold metal frames."
//   },
//   {
//     id: "acc-3",
//     name: "Water Resistant Travel Backpack",
//     brand: "Fastrack",
//     category: "Accessories",
//     price: 1999,
//     originalPrice: 2999,
//     rating: 4.1,
//     image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&q=80&w=400",
//     description: "Unisex modern black tech backpack, features weather-proof shell, separate 15-inch laptop compartment, ergonomic padded straps and quick access pockets."
//   }
// ];

import { Product } from "../types";

export const mockCatalog: Product[] = [
  {
    id: "snk-1",
    name: "Air Force 1 '07",
    brand: "Nike",
    category: "Sneakers",
    price: 8495,
    originalPrice: 9995,
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=400",
    description: "The legendary Nike Air Force 1 with premium leather upper, cushioned sole and timeless streetwear appeal."
  },
  {
    id: "snk-2",
    name: "Jordan 1 Mid",
    brand: "Nike",
    category: "Sneakers",
    price: 11995,
    originalPrice: 13995,
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?auto=format&fit=crop&q=80&w=400",
    description: "Inspired by the original Air Jordan, these sneakers combine premium leather construction with iconic basketball heritage."
  },
  {
    id: "snk-3",
    name: "Dunk Low Retro",
    brand: "Nike",
    category: "Sneakers",
    price: 9695,
    originalPrice: 10995,
    rating: 4.7,
    image: "https://images.unsplash.com/photo-1608231387042-66d1773070a5?auto=format&fit=crop&q=80&w=400",
    description: "Classic Nike Dunk Low featuring durable overlays, padded collar and a versatile everyday design."
  },
  {
    id: "snk-4",
    name: "Samba OG",
    brand: "Adidas",
    category: "Sneakers",
    price: 10999,
    originalPrice: 12999,
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1605348532760-6753d2c43329?auto=format&fit=crop&q=80&w=400",
    description: "A timeless Adidas icon crafted with smooth leather, suede overlays and signature gum sole."
  },
  {
    id: "snk-5",
    name: "Campus 00s",
    brand: "Adidas",
    category: "Sneakers",
    price: 9999,
    originalPrice: 11999,
    rating: 4.7,
    image: "https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&q=80&w=400",
    description: "Chunky skate-inspired sneakers featuring premium suede upper and Cloudfoam comfort."
  },
  {
    id: "snk-6",
    name: "RS-X Reinvention",
    brand: "Puma",
    category: "Sneakers",
    price: 7499,
    originalPrice: 8999,
    rating: 4.6,
    image: "https://images.unsplash.com/photo-1608666634759-4376010f863d?auto=format&fit=crop&q=80&w=400",
    description: "Bold Puma sneakers designed with lightweight cushioning and futuristic styling."
  },
  {
    id: "snk-7",
    name: "Suede Classic XXI",
    brand: "Puma",
    category: "Sneakers",
    price: 5999,
    originalPrice: 7499,
    rating: 4.5,
    image: "https://images.unsplash.com/photo-1560769629-975ec94e6a86?auto=format&fit=crop&q=80&w=400",
    description: "The iconic Puma Suede returns with premium suede construction and everyday comfort."
  },
  {
    id: "snk-8",
    name: "Chuck Taylor All Star",
    brand: "Converse",
    category: "Sneakers",
    price: 4999,
    originalPrice: 5999,
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1491553895911-0055eca6402d?auto=format&fit=crop&q=80&w=400",
    description: "Classic canvas high-top sneakers with rubber toe cap and timeless Converse style."
  },
  {
    id: "snk-9",
    name: "550",
    brand: "New Balance",
    category: "Sneakers",
    price: 10999,
    originalPrice: 12499,
    rating: 4.7,
    image: "https://images.unsplash.com/photo-1600269452121-4f2416e55c28?auto=format&fit=crop&q=80&w=400",
    description: "Vintage basketball-inspired sneakers combining premium leather with superior comfort."
  },
  {
    id: "snk-10",
    name: "Gel-Kayano 30",
    brand: "ASICS",
    category: "Sneakers",
    price: 14999,
    originalPrice: 16999,
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1709258228137-19a8c193be39?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8YXNpY3MlMjBzaG9lc3xlbnwwfHwwfHx8MA%3D%3D",
    description: "Premium running shoes featuring GEL cushioning and advanced stability technology."
  },
  {
    id: "snk-11",
    name: "Club C 85",
    brand: "Reebok",
    category: "Sneakers",
    price: 6499,
    originalPrice: 7999,
    rating: 4.6,
    image: "https://images.unsplash.com/photo-1514989940723-e8e51635b782?auto=format&fit=crop&q=80&w=400",
    description: "Minimal leather sneakers inspired by vintage tennis style with soft cushioning."
  },
  {
    id: "snk-12",
    name: "Old Skool",
    brand: "Vans",
    category: "Sneakers",
    price: 5499,
    originalPrice: 6999,
    rating: 4.7,
    image: "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?auto=format&fit=crop&q=80&w=400",
    description: "Iconic Vans skate sneakers with durable suede upper and signature waffle outsole."
  },
  {
    id: "snk-13",
    name: "GOwalk Flex",
    brand: "Skechers",
    category: "Sneakers",
    price: 5999,
    originalPrice: 7499,
    rating: 4.6,
    image: "https://images.unsplash.com/photo-1539185441755-769473a23570?auto=format&fit=crop&q=80&w=400",
    description: "Ultra-lightweight walking shoes with Air-Cooled Memory Foam cushioning."
  },
  {
    id: "snk-14",
    name: "Charged Assert 10",
    brand: "Under Armour",
    category: "Sneakers",
    price: 7999,
    originalPrice: 9499,
    rating: 4.5,
    image: "https://images.unsplash.com/photo-1460353581641-37baddab0fa2?auto=format&fit=crop&q=80&w=400",
    description: "Performance running shoes with Charged Cushioning midsole for responsive comfort."
  },
  {
    id: "snk-15",
    name: "574 Core",
    brand: "New Balance",
    category: "Sneakers",
    price: 8999,
    originalPrice: 10499,
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1543508282-6319a3e2621f?auto=format&fit=crop&q=80&w=400",
    description: "Everyday lifestyle sneakers blending retro style with ENCAP cushioning."
  },


  {
    id: "ind-1",
    name: "Floral Printed A-Line Kurta",
    brand: "Anouk",
    category: "Indian Wear",
    price: 1299,
    originalPrice: 2499,
    rating: 4.5,
    image: "https://images.unsplash.com/photo-1604436607823-d721dfe2df46?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8a3VydGElMjBmb3IlMjB3b21lbnxlbnwwfHwwfHx8MA%3D%3D",
    description: "Elegant floral printed A-line kurta crafted from breathable cotton with three-quarter sleeves."
  },
  {
    id: "ind-2",
    name: "Embroidered Kurta Set",
    brand: "Libas",
    category: "Indian Wear",
    price: 2499,
    originalPrice: 3999,
    rating: 4.6,
    image: "https://images.unsplash.com/photo-1745313452052-0e4e341f326c?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8a3VydGlzfGVufDB8fDB8fHww",
    description: "Beautiful embroidered kurta set with matching pants and dupatta for festive occasions."
  },
  {
    id: "ind-3",
    name: "Zari Embroidered Anarkali",
    brand: "W",
    category: "Indian Wear",
    price: 4599,
    originalPrice: 6999,
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1597983073750-16f5ded1321f?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8a3VydGl8ZW58MHx8MHx8fDA%3D",
    description: "Premium Anarkali suit with intricate zari embroidery and elegant flare."
  },
  {
    id: "ind-4",
    name: "Straight Fit Kurta",
    brand: "Biba",
    category: "Indian Wear",
    price: 1799,
    originalPrice: 2999,
    rating: 4.4,
    image: "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&q=80&w=400",
    description: "Classic straight-fit kurta designed with soft cotton fabric and delicate prints."
  },
  {
    id: "ind-5",
    name: "Handwoven Linen Nehru Jacket",
    brand: "Fabindia",
    category: "Indian Wear",
    price: 3490,
    originalPrice: 4490,
    rating: 4.7,
    image: "https://plus.unsplash.com/premium_photo-1674719144570-0728faf14f96?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8amFja2V0fGVufDB8fDB8fHww",
    description: "Premium linen Nehru jacket ideal for festive and formal ethnic occasions."
  },
  {
    id: "ind-6",
    name: "Printed Cotton Kurta",
    brand: "Aurelia",
    category: "Indian Wear",
    price: 1499,
    originalPrice: 2799,
    rating: 4.5,
    image: "https://images.unsplash.com/photo-1727835523545-70ee992b5763?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Y290dG9uJTIwa3VydGF8ZW58MHx8MHx8fDA%3D",
    description: "Comfortable cotton kurta featuring vibrant ethnic prints and relaxed silhouette."
  },
  {
    id: "ind-7",
    name: "Festive Sharara Set",
    brand: "Indya",
    category: "Indian Wear",
    price: 3999,
    originalPrice: 5999,
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1603124552328-a43fb49ee4ff?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8c2hhcmFyYSUyMHNldHxlbnwwfHwwfHx8MA%3D%3D",
    description: "Designer sharara set with mirror work and matching dupatta."
  },
  {
    id: "ind-8",
    name: "Printed Ethnic Dress",
    brand: "Sangria",
    category: "Indian Wear",
    price: 1699,
    originalPrice: 2999,
    rating: 4.4,
    image: "https://images.unsplash.com/photo-1616583936499-d4116e7e2e76?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8ZXRobmljJTIwZHJlc3N8ZW58MHx8MHx8fDA%3D",
    description: "Flowy ethnic dress with beautiful block prints and comfortable fit."
  },
  {
    id: "ind-9",
    name: "Silk Blend Kurta",
    brand: "Soch",
    category: "Indian Wear",
    price: 2799,
    originalPrice: 4299,
    rating: 4.6,
    image: "https://images.unsplash.com/photo-1585487000160-6ebcfceb0d03?auto=format&fit=crop&q=80&w=400",
    description: "Luxurious silk blend kurta with subtle embroidery and premium finish."
  },
  {
    id: "ind-10",
    name: "Classic Wedding Kurta",
    brand: "Manyavar",
    category: "Indian Wear",
    price: 4999,
    originalPrice: 7499,
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1621184455862-c163dfb30e0f?auto=format&fit=crop&q=80&w=400",
    description: "Traditional wedding kurta featuring elegant embroidery and royal finish."
  },
  {
    id: "ind-11",
    name: "Bandhani Kurta Set",
    brand: "Libas",
    category: "Indian Wear",
    price: 2299,
    originalPrice: 3599,
    rating: 4.5,
    image: "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&q=80&w=400",
    description: "Traditional Bandhani print kurta set crafted for festive celebrations."
  },
  {
    id: "ind-12",
    name: "Floral Palazzo Set",
    brand: "Biba",
    category: "Indian Wear",
    price: 2899,
    originalPrice: 4499,
    rating: 4.7,
    image: "https://images.unsplash.com/photo-1612722432474-b971cdcea546?auto=format&fit=crop&q=80&w=400",
    description: "Elegant floral palazzo set with coordinated dupatta and premium finish."
  },
  {
    id: "ind-13",
    name: "Designer Saree",
    brand: "W",
    category: "Indian Wear",
    price: 5499,
    originalPrice: 7999,
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&q=80&w=400",
    description: "Elegant designer saree featuring premium fabric and contemporary patterns."
  },
  {
    id: "ind-14",
    name: "Mirror Work Kurta",
    brand: "Anouk",
    category: "Indian Wear",
    price: 2599,
    originalPrice: 3999,
    rating: 4.6,
    image: "https://images.unsplash.com/photo-1617137968427-85924c800a22?auto=format&fit=crop&q=80&w=400",
    description: "Traditional mirror work kurta perfect for festive celebrations."
  },
  {
    id: "ind-15",
    name: "Premium Chikankari Kurta",
    brand: "Fabindia",
    category: "Indian Wear",
    price: 3299,
    originalPrice: 4999,
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?auto=format&fit=crop&q=80&w=400",
    description: "Handcrafted Chikankari kurta showcasing timeless Indian craftsmanship."
  },

   {
    id: "wes-1",
    name: "Oversized Cotton T-Shirt",
    brand: "H&M",
    category: "Western Wear",
    price: 999,
    originalPrice: 1499,
    rating: 4.6,
    image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=400&q=80",
    description: "Relaxed-fit oversized cotton t-shirt with soft fabric for everyday comfort."
  },
  {
    id: "wes-2",
    name: "Slim Fit Jeans",
    brand: "Levi's",
    category: "Western Wear",
    price: 2299,
    originalPrice: 3999,
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=400&q=80",
    description: "Classic slim-fit stretch denim jeans with five-pocket styling."
  },
  {
    id: "wes-3",
    name: "Casual Checked Shirt",
    brand: "Roadster",
    category: "Western Wear",
    price: 1299,
    originalPrice: 2499,
    rating: 4.5,
    image: "https://images.unsplash.com/photo-1602810319428-019690571b5b?auto=format&fit=crop&w=400&q=80",
    description: "Cotton checked shirt perfect for casual outings."
  },
  {
    id: "wes-4",
    name: "Ribbed Crop Top",
    brand: "ONLY",
    category: "Western Wear",
    price: 899,
    originalPrice: 1599,
    rating: 4.4,
    image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=400&q=80",
    description: "Soft ribbed crop top with a flattering slim fit."
  },
  {
    id: "wes-5",
    name: "Floral Summer Dress",
    brand: "Zara",
    category: "Western Wear",
    price: 3299,
    originalPrice: 4999,
    rating: 4.7,
    image: "https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=400&q=80",
    description: "Elegant floral midi dress crafted from lightweight fabric."
  },
  {
    id: "wes-6",
    name: "Straight Fit Trousers",
    brand: "Vero Moda",
    category: "Western Wear",
    price: 1899,
    originalPrice: 2999,
    rating: 4.6,
    image: "https://images.unsplash.com/photo-1493357335960-4583bfa6f8d9?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTV8fHRyb3VzZXJzfGVufDB8fDB8fHww",
    description: "Office-ready straight-fit trousers with premium finish."
  },
  {
    id: "wes-7",
    name: "Denim Jacket",
    brand: "Levi's",
    category: "Western Wear",
    price: 3499,
    originalPrice: 5499,
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&w=400&q=80",
    description: "Classic denim jacket with timeless styling."
  },
  {
    id: "wes-8",
    name: "Graphic Hoodie",
    brand: "HRX",
    category: "Western Wear",
    price: 1799,
    originalPrice: 2999,
    rating: 4.5,
    image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&w=400&q=80",
    description: "Warm fleece hoodie ideal for workouts and casual wear."
  },
  {
    id: "wes-9",
    name: "Polo T-Shirt",
    brand: "U.S. Polo Assn.",
    category: "Western Wear",
    price: 1599,
    originalPrice: 2499,
    rating: 4.7,
    image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=400&q=80",
    description: "Classic polo t-shirt made from breathable cotton."
  },
  {
    id: "wes-10",
    name: "Relaxed Fit Cargo Pants",
    brand: "Jack & Jones",
    category: "Western Wear",
    price: 2499,
    originalPrice: 3999,
    rating: 4.6,
    image: "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=400&q=80",
    description: "Trendy cargo pants with multiple utility pockets."
  },
  {
    id: "wes-11",
    name: "Linen Blend Shirt",
    brand: "H&M",
    category: "Western Wear",
    price: 1499,
    originalPrice: 2499,
    rating: 4.5,
    image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=400&q=80",
    description: "Breathable linen shirt ideal for warm weather."
  },
  {
    id: "wes-12",
    name: "High Waist Jeans",
    brand: "ONLY",
    category: "Western Wear",
    price: 2199,
    originalPrice: 3599,
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1551232864-3f0890e580d9?auto=format&fit=crop&w=400&q=80",
    description: "High-rise skinny jeans with stretch denim."
  },
  {
    id: "wes-13",
    name: "Satin Shirt",
    brand: "Zara",
    category: "Western Wear",
    price: 2799,
    originalPrice: 4299,
    rating: 4.7,
    image: "https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?auto=format&fit=crop&w=400&q=80",
    description: "Elegant satin shirt suitable for office and evening wear."
  },
  {
    id: "wes-14",
    name: "Knitted Sweater",
    brand: "Roadster",
    category: "Western Wear",
    price: 1699,
    originalPrice: 2799,
    rating: 4.5,
    image: "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=400&q=80",
    description: "Soft knitted sweater with comfortable regular fit."
  },
  {
    id: "wes-15",
    name: "Blazer Jacket",
    brand: "Tommy Hilfiger",
    category: "Western Wear",
    price: 5999,
    originalPrice: 8999,
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1598915850252-fb07ad1e6768?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjB8fGJsYXplciUyMGphY2tldHxlbnwwfHwwfHx8MA%3D%3D",
    description: "Premium tailored blazer designed for formal occasions."
  },

   {
    id: "bag-1",
    name: "Monogram Tote Bag",
    brand: "Lavie",
    category: "Accessories",
    price: 2499,
    originalPrice: 3999,
    rating: 4.7,
    image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=400&q=80",
    description: "Elegant tote bag with spacious compartments, perfect for office and daily use."
  },
  {
    id: "bag-2",
    name: "Classic Shoulder Bag",
    brand: "Caprese",
    category: "Accessories",
    price: 2799,
    originalPrice: 4299,
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1591561954557-26941169b49e?auto=format&fit=crop&w=400&q=80",
    description: "Premium faux leather shoulder bag with gold-tone hardware."
  },
  {
    id: "bag-3",
    name: "Leather Sling Bag",
    brand: "Hidesign",
    category: "Accessories",
    price: 4999,
    originalPrice: 6999,
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=400&q=80",
    description: "Genuine leather sling bag handcrafted with premium finish."
  },
  {
    id: "bag-4",
    name: "Travel Backpack",
    brand: "SkyAccessories",
    category: "Accessories",
    price: 1999,
    originalPrice: 2999,
    rating: 4.6,
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=400&q=80",
    description: "Lightweight travel backpack with padded laptop compartment."
  },
  {
    id: "bag-5",
    name: "Cabin Trolley",
    brand: "American Tourister",
    category: "Accessories",
    price: 5499,
    originalPrice: 7999,
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&w=400&q=80",
    description: "Durable cabin trolley with smooth spinner wheels."
  },
  {
    id: "bag-6",
    name: "Mini Crossbody Bag",
    brand: "Lavie",
    category: "Accessories",
    price: 1699,
    originalPrice: 2499,
    rating: 4.5,
    image: "https://images.unsplash.com/photo-1581605405669-fcdf81165afa?auto=format&fit=crop&w=400&q=80",
    description: "Compact crossbody bag perfect for casual outings."
  },
  {
    id: "bag-7",
    name: "Laptop Backpack",
    brand: "Wildcraft",
    category: "Accessories",
    price: 2499,
    originalPrice: 3499,
    rating: 4.7,
    image: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=400&q=80",
    description: "Water-resistant backpack with padded laptop sleeve."
  },
  {
    id: "bag-8",
    name: "Canvas Tote",
    brand: "Baggit",
    category: "Accessories",
    price: 1299,
    originalPrice: 1999,
    rating: 4.4,
    image: "https://images.unsplash.com/photo-1594223274512-ad4803739b7c?auto=format&fit=crop&w=400&q=80",
    description: "Eco-friendly canvas tote for shopping and daily essentials."
  },
  {
    id: "bag-9",
    name: "Party Clutch",
    brand: "Caprese",
    category: "Accessories",
    price: 1899,
    originalPrice: 2999,
    rating: 4.6,
    image: "https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?auto=format&fit=crop&w=400&q=80",
    description: "Elegant clutch embellished for festive occasions."
  },
  {
    id: "bag-10",
    name: "Duffel Bag",
    brand: "Puma",
    category: "Accessories",
    price: 2199,
    originalPrice: 3299,
    rating: 4.5,
    image: "https://images.unsplash.com/photo-1516826957135-700dedea698c?auto=format&fit=crop&w=400&q=80",
    description: "Sports duffel bag with spacious main compartment."
  },
  {
    id: "bag-11",
    name: "Office Messenger Bag",
    brand: "Tommy Hilfiger",
    category: "Accessories",
    price: 4599,
    originalPrice: 6499,
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1524499982521-1ffd58dd89ea?auto=format&fit=crop&w=400&q=80",
    description: "Professional messenger bag for office and business travel."
  },
  {
    id: "bag-12",
    name: "Everyday Handbag",
    brand: "Allen Solly",
    category: "Accessories",
    price: 2399,
    originalPrice: 3699,
    rating: 4.6,
    image: "https://images.unsplash.com/photo-1594633313593-bab3825d0caf?auto=format&fit=crop&w=400&q=80",
    description: "Stylish handbag with multiple zip compartments."
  },
  {
    id: "bag-13",
    name: "Weekend Backpack",
    brand: "Safari",
    category: "Accessories",
    price: 2799,
    originalPrice: 3999,
    rating: 4.7,
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=400&q=80",
    description: "Ideal backpack for weekend getaways and short trips."
  },
  {
    id: "bag-14",
    name: "Premium Leather Tote",
    brand: "Hidesign",
    category: "Accessories",
    price: 6999,
    originalPrice: 8999,
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1624687943971-e86af76d57de?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8bGVhdGhlciUyMHRvdGV8ZW58MHx8MHx8fDA%3D",
    description: "Luxury handcrafted leather tote for professionals."
  },
  {
    id: "bag-15",
    name: "Mini Bucket Bag",
    brand: "Accessorize",
    category: "Accessories",
    price: 1799,
    originalPrice: 2799,
    rating: 4.5,
    image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=400&q=80",
    description: "Fashionable bucket bag with adjustable shoulder strap."
  },

  {
  id: "acc-16",
  name: "Premium Leather Wallet",
  brand: "Tommy Hilfiger",
  category: "Accessories",
  price: 2499,
  originalPrice: 3499,
  rating: 4.7,
  image: "https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&w=400&q=80",
  description: "Premium leather wallet with multiple card slots and RFID protection."
},
{
  id: "acc-17",
  name: "Analog Leather Watch",
  brand: "Titan",
  category: "Accessories",
  price: 5999,
  originalPrice: 7999,
  rating: 4.8,
  image: "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?auto=format&fit=crop&w=400&q=80",
  description: "Elegant analog watch featuring genuine leather strap and quartz movement."
},
{
  id: "acc-18",
  name: "Vintage Digital Watch",
  brand: "Casio",
  category: "Accessories",
  price: 3499,
  originalPrice: 4999,
  rating: 4.8,
  image: "https://images.unsplash.com/photo-1542496658-e33a6d0d50f6?auto=format&fit=crop&w=400&q=80",
  description: "Retro-inspired digital watch with LED display and water resistance."
},
{
  id: "acc-19",
  name: "Polarized Aviator Sunglasses",
  brand: "Ray-Ban",
  category: "Accessories",
  price: 7999,
  originalPrice: 9999,
  rating: 4.9,
  image: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=400&q=80",
  description: "Classic aviator sunglasses with polarized UV protection lenses."
},
{
  id: "acc-20",
  name: "Leather Belt",
  brand: "Allen Solly",
  category: "Accessories",
  price: 1499,
  originalPrice: 2299,
  rating: 4.6,
  image: "https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?auto=format&fit=crop&w=400&q=80",
  description: "Premium genuine leather belt with brushed metal buckle."
},
{
  id: "acc-21",
  name: "Travel Backpack",
  brand: "Wildcraft",
  category: "Accessories",
  price: 2999,
  originalPrice: 4299,
  rating: 4.8,
  image: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=400&q=80",
  description: "Water-resistant backpack with laptop sleeve and ergonomic shoulder straps."
},
{
  id: "acc-22",
  name: "Mini Sling Bag",
  brand: "Lavie",
  category: "Accessories",
  price: 1899,
  originalPrice: 2999,
  rating: 4.5,
  image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=400&q=80",
  description: "Compact sling bag with adjustable strap and zip compartments."
},
{
  id: "acc-23",
  name: "Canvas Tote Bag",
  brand: "Caprese",
  category: "Accessories",
  price: 2299,
  originalPrice: 3499,
  rating: 4.6,
  image: "https://images.unsplash.com/photo-1594223274512-ad4803739b7c?auto=format&fit=crop&w=400&q=80",
  description: "Spacious canvas tote bag suitable for shopping and everyday use."
},
{
  id: "acc-24",
  name: "Sports Cap",
  brand: "Nike",
  category: "Accessories",
  price: 1199,
  originalPrice: 1699,
  rating: 4.5,
  image: "https://images.unsplash.com/photo-1521369909029-2afed882baee?auto=format&fit=crop&w=400&q=80",
  description: "Lightweight sports cap with breathable fabric and adjustable strap."
},
{
  id: "acc-25",
  name: "Silver Hoop Earrings",
  brand: "Accessorize",
  category: "Accessories",
  price: 899,
  originalPrice: 1499,
  rating: 4.4,
  image: "https://images.unsplash.com/photo-1617038220319-276d3cfab638?auto=format&fit=crop&w=400&q=80",
  description: "Minimalist silver hoop earrings perfect for everyday styling."
},
{
  id: "acc-26",
  name: "Smart Watch",
  brand: "Noise",
  category: "Accessories",
  price: 4499,
  originalPrice: 6999,
  rating: 4.7,
  image: "https://images.unsplash.com/photo-1434494878577-86c23bcb06b9?auto=format&fit=crop&w=400&q=80",
  description: "Bluetooth smartwatch with heart-rate monitoring and AMOLED display."
},
{
  id: "acc-27",
  name: "Laptop Messenger Bag",
  brand: "American Tourister",
  category: "Accessories",
  price: 3299,
  originalPrice: 4999,
  rating: 4.7,
  image: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=400&q=80",
  description: "Professional messenger bag with dedicated laptop compartment."
},
{
  id: "acc-28",
  name: "Bracelet Set",
  brand: "Zaveri Pearls",
  category: "Accessories",
  price: 999,
  originalPrice: 1699,
  rating: 4.5,
  image: "https://images.unsplash.com/photo-1617038220319-276d3cfab638?auto=format&fit=crop&w=400&q=80",
  description: "Elegant bracelet set suitable for festive and casual occasions."
},
{
  id: "acc-29",
  name: "Duffel Gym Bag",
  brand: "Puma",
  category: "Accessories",
  price: 2499,
  originalPrice: 3599,
  rating: 4.6,
  image: "https://images.unsplash.com/photo-1579202300724-1af1c9acffe3?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  description: "Spacious gym duffel bag with dedicated shoe compartment."
},
{
  id: "acc-30",
  name: "Wayfarer Sunglasses",
  brand: "Fastrack",
  category: "Accessories",
  price: 1799,
  originalPrice: 2799,
  rating: 4.5,
  image: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&w=400&q=80",
  description: "Trendy wayfarer sunglasses with UV400 protection."
}
];