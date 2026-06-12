<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\HeroSlide;
use App\Models\Message;
use App\Models\Order;
use App\Models\PaymentMethod;
use App\Models\Product;
use App\Models\SiteImage;
use App\Models\Testimonial;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    public function run(): void
    {
        $this->seedUsers();
        $this->seedCategories();
        $this->seedProducts();
        $this->seedHeroSlides();
        $this->seedTestimonials();
        $this->seedPaymentMethods();
        $this->seedSiteImages();
        $this->seedDemoOrders();
        $this->seedDemoMessages();
    }

    private function seedUsers(): void
    {
        User::create(['name' => 'Site Administrator', 'email' => 'admin@de-ebrightmarn.com', 'password' => Hash::make('admin123'), 'role' => 'admin']);
        User::create(['name' => 'Content Editor', 'email' => 'editor@de-ebrightmarn.com', 'password' => Hash::make('editor123'), 'role' => 'editor']);
    }

    private function seedCategories(): void
    {
        $rows = [
            ['slug' => 'all', 'label' => 'All Products', 'icon' => 'ShoppingBag', 'description' => 'Show products from all categories', 'sort_order' => 0],
            ['slug' => 'smartphones', 'label' => 'Smartphones', 'icon' => 'Smartphone', 'description' => 'Mobile phones and accessories', 'sort_order' => 1],
            ['slug' => 'laptops', 'label' => 'Laptops', 'icon' => 'Laptop', 'description' => 'Portable computers and notebooks', 'sort_order' => 2],
            ['slug' => 'accessories', 'label' => 'Accessories', 'icon' => 'Keyboard', 'description' => 'Computer peripherals and accessories', 'sort_order' => 3],
            ['slug' => 'audio', 'label' => 'Audio', 'icon' => 'Headphones', 'description' => 'Headphones, speakers, and audio gear', 'sort_order' => 4],
            ['slug' => 'wearables', 'label' => 'Wearables', 'icon' => 'Watch', 'description' => 'Smart watches and fitness trackers', 'sort_order' => 5],
            ['slug' => 'smart-home', 'label' => 'Smart Home', 'icon' => 'Home', 'description' => 'Smart home devices and automation', 'sort_order' => 6],
        ];
        foreach ($rows as $row) {
            Category::create($row + ['active' => true]);
        }
    }

    private function seedProducts(): void
    {
        $cat = fn (string $slug) => Category::where('slug', $slug)->value('id');
        $px = fn (string $id) => "https://images.pexels.com/photos/{$id}?auto=compress&cs=tinysrgb&fit=crop&h=600&w=600";

        $rows = [
            ['name' => 'iPhone 15 Pro Max', 'category' => 'smartphones', 'price' => 1199, 'original_price' => 1299, 'image' => $px('5750001/pexels-photo-5750001.jpeg'), 'description' => 'Apple iPhone 15 Pro Max with A17 Pro chip, titanium design, and ProRAW camera system.', 'features' => ['6.7" Super Retina XDR', 'A17 Pro Chip', '48MP Main Camera', 'Titanium Body', 'USB-C'], 'in_stock' => true, 'rating' => 4.9, 'reviews' => 248, 'badge' => 'hot'],
            ['name' => 'Samsung Galaxy S24 Ultra', 'category' => 'smartphones', 'price' => 1099, 'image' => $px('404280/pexels-photo-404280.jpeg'), 'description' => 'Samsung Galaxy S24 Ultra with Galaxy AI, S Pen, and 200MP camera.', 'features' => ['6.8" Dynamic AMOLED 2X', 'Snapdragon 8 Gen 3', '200MP Camera', 'S Pen Included', '5000mAh'], 'in_stock' => true, 'rating' => 4.8, 'reviews' => 187, 'badge' => 'new'],
            ['name' => 'MacBook Pro 16" M3 Max', 'category' => 'laptops', 'price' => 3499, 'image' => $px('18105/pexels-photo.jpg'), 'description' => 'Apple MacBook Pro 16-inch with M3 Max chip for ultimate performance.', 'features' => ['16" Liquid Retina XDR', 'M3 Max Chip', '36GB Unified Memory', '1TB SSD', '22hr Battery'], 'in_stock' => true, 'rating' => 5.0, 'reviews' => 96, 'badge' => 'limited'],
            ['name' => 'Dell XPS 15', 'category' => 'laptops', 'price' => 1599, 'original_price' => 1799, 'image' => $px('205421/pexels-photo-205421.jpeg'), 'description' => 'Dell XPS 15 with InfinityEdge display and powerful Intel Core i7 processor.', 'features' => ['15.6" 4K OLED', 'Intel Core i7-13700H', '16GB DDR5 RAM', '512GB SSD', 'NVIDIA RTX 4050'], 'in_stock' => true, 'rating' => 4.6, 'reviews' => 142, 'badge' => 'sale'],
            ['name' => 'AirPods Pro (2nd Gen)', 'category' => 'audio', 'price' => 249, 'image' => $px('3825517/pexels-photo-3825517.jpeg'), 'description' => 'Apple AirPods Pro with active noise cancellation and spatial audio.', 'features' => ['Active Noise Cancellation', 'Adaptive Transparency', 'Spatial Audio', '6hr Battery + 30hr Case', 'MagSafe Case'], 'in_stock' => true, 'rating' => 4.8, 'reviews' => 312, 'badge' => 'hot'],
            ['name' => 'Sony WH-1000XM5', 'category' => 'audio', 'price' => 399, 'original_price' => 449, 'image' => $px('3587478/pexels-photo-3587478.jpeg'), 'description' => 'Sony WH-1000XM5 wireless noise-cancelling headphones with 30hr battery.', 'features' => ['Industry-leading ANC', '30hr Battery Life', 'Multi-point Connection', 'LDAC Hi-Res Audio', 'Speak-to-Chat'], 'in_stock' => true, 'rating' => 4.9, 'reviews' => 198, 'badge' => 'sale'],
            ['name' => 'Apple Watch Series 9', 'category' => 'wearables', 'price' => 449, 'image' => $px('437037/pexels-photo-437037.jpeg'), 'description' => 'Apple Watch Series 9 with new S9 chip and Double Tap gesture.', 'features' => ['45mm Case', 'S9 SiP Chip', 'Always-On Display', 'ECG + Blood Oxygen', 'GPS + Cellular'], 'in_stock' => true, 'rating' => 4.7, 'reviews' => 256, 'badge' => 'new'],
            ['name' => 'Samsung Galaxy Watch 6', 'category' => 'wearables', 'price' => 329, 'image' => $px('393047/pexels-photo-393047.jpeg'), 'description' => 'Samsung Galaxy Watch 6 Classic with rotating bezel and Wear OS.', 'features' => ['47mm Classic', 'Wear OS by Google', 'BioActive Sensor', 'Sapphire Crystal', '40hr Battery'], 'in_stock' => true, 'rating' => 4.5, 'reviews' => 89],
            ['name' => 'Logitech MX Master 3S', 'category' => 'accessories', 'price' => 99, 'image' => $px('2115256/pexels-photo-2115256.jpeg'), 'description' => 'Logitech MX Master 3S wireless performance mouse with quiet clicks.', 'features' => ['8K DPI Sensor', 'Quiet Clicks', '70-day Battery', 'Multi-device Flow', 'USB-C Charging'], 'in_stock' => true, 'rating' => 4.8, 'reviews' => 421, 'badge' => 'hot'],
            ['name' => 'Keychron K8 Pro', 'category' => 'accessories', 'price' => 169, 'image' => $px('1194713/pexels-photo-1194713.jpeg'), 'description' => 'Keychron K8 Pro QMK/VIA wireless mechanical keyboard with hot-swappable switches.', 'features' => ['QMK/VIA Customizable', 'Hot-swappable', 'Wireless & Wired', '75% Layout', 'Mac/Windows'], 'in_stock' => false, 'rating' => 4.7, 'reviews' => 156],
            ['name' => 'Google Nest Hub Max', 'category' => 'smart-home', 'price' => 229, 'original_price' => 279, 'image' => $px('4318841/pexels-photo-4318841.jpeg'), 'description' => 'Google Nest Hub Max with 10" HD display, Nest Cam, and Google Assistant.', 'features' => ['10" HD Smart Display', 'Built-in Nest Cam', 'Google Assistant', 'Stereo Speakers', 'Face Match'], 'in_stock' => true, 'rating' => 4.4, 'reviews' => 234, 'badge' => 'sale'],
            ['name' => 'Amazon Echo Show 8', 'category' => 'smart-home', 'price' => 149, 'image' => $px('318236/pexels-photo-318236.jpeg'), 'description' => 'Amazon Echo Show 8 with 8" HD display, Alexa, and built-in camera.', 'features' => ['8" HD Display', 'Alexa Voice Assistant', '13MP Camera', 'Stereo Sound', 'Smart Home Hub'], 'in_stock' => true, 'rating' => 4.5, 'reviews' => 178],
        ];

        foreach ($rows as $row) {
            $slug = $row['category'];
            unset($row['category']);
            Product::create($row + ['category_id' => $cat($slug)]);
        }
    }

    private function seedHeroSlides(): void
    {
        $hero = fn (string $id) => "https://images.pexels.com/photos/{$id}?auto=compress&cs=tinysrgb&fit=crop&h=900&w=1600";
        $rows = [
            ['title' => 'Revolutionizing Agriculture for a Sustainable Tomorrow', 'subtitle' => 'Empowering food security through smart animal farming, agri-tech innovation, and expert farm management solutions.', 'image' => $hero('10697911/pexels-photo-10697911.jpeg'), 'tag' => 'Agriculture', 'icon_name' => 'Wheat'],
            ['title' => 'Master the Markets. Build Wealth.', 'subtitle' => 'We offer expert-led forex education, strategic trading support, and financial risk management for long-term success.', 'image' => $hero('5831351/pexels-photo-5831351.jpeg'), 'tag' => 'Financial Markets', 'icon_name' => 'TrendingUp'],
            ['title' => 'Telling Stories That Inspire', 'subtitle' => 'From script to screen, we craft powerful visual narratives through expert cinematography, editing, and global media distribution.', 'image' => $hero('32292610/pexels-photo-32292610.jpeg'), 'tag' => 'Film Production', 'icon_name' => 'Film'],
            ['title' => 'Innovative Tech. Smarter Solutions.', 'subtitle' => 'Delivering cutting-edge ICT services, device sales, app development, and digital transformation strategies for the modern world.', 'image' => $hero('1181280/pexels-photo-1181280.jpeg'), 'tag' => 'Technology', 'icon_name' => 'Cpu'],
            ['title' => 'Websites That Convert. Brands That Shine.', 'subtitle' => 'From business websites to e-commerce platforms — we design, develop, and optimize digital experiences that grow your business.', 'image' => $hero('5385526/pexels-photo-5385526.jpeg'), 'tag' => 'Web Design & Development', 'icon_name' => 'Globe'],
            ['title' => 'Secure Properties. Smart Buildings.', 'subtitle' => 'CCTV, access control, smart security, and property technology solutions for modern homes and businesses.', 'image' => $hero('33481145/pexels-photo-33481145.jpeg'), 'tag' => 'Security Solutions', 'icon_name' => 'ShieldCheck'],
            ['title' => 'Clean Spaces. Professional Results.', 'subtitle' => 'We provide reliable, high-standard cleaning and disinfection services for homes, offices, and post-construction environments.', 'image' => $hero('5499416/pexels-photo-5499416.jpeg'), 'tag' => 'Cleaning Services', 'icon_name' => 'Sparkles'],
        ];
        foreach ($rows as $i => $row) {
            HeroSlide::create($row + ['sort_order' => $i]);
        }
    }

    private function seedTestimonials(): void
    {
        $rows = [
            ['name' => 'David Mensah', 'role' => 'CEO, GreenBridge Group', 'text' => "Partnering with De-ebrightmarn Limited has been one of the smartest business decisions we've made. Their innovative solutions and unwavering professionalism across multiple industries have made a tangible impact on our operations and community development goals.", 'rating' => 5],
            ['name' => 'Sarah Oduwale', 'role' => 'Creative Director, Global Voices Media', 'text' => 'Working with De-ebrightmarn on our documentary was nothing short of exceptional. From scripting to post-production, their creative team delivered a powerful story that captured hearts globally.', 'rating' => 5],
            ['name' => 'Ayodele Akinbiyi', 'role' => 'Commercial Farmer, Ogun State', 'text' => 'De-eFarm helped us transform our outdated farming processes into a sustainable, tech-driven operation. Their agri-tech solutions and expert consulting gave our farm a 40% boost in productivity within one season.', 'rating' => 5],
            ['name' => 'Chinwe Okeke', 'role' => 'Forex Trader & Alumni', 'text' => "As a young trader, I had limited knowledge of the financial markets. De-eFxacademy's training was a game-changer—clear, hands-on, and empowering. I now trade confidently with consistent results.", 'rating' => 5],
            ['name' => 'Ibrahim Lawal', 'role' => 'COO, SwiftAccess Logistics', 'text' => 'The De-eTech team developed and deployed a custom ICT solution that automated 70% of our business processes. Their support and attention to detail have made them our go-to tech partner.', 'rating' => 5],
        ];
        foreach ($rows as $row) {
            Testimonial::create($row);
        }
    }

    private function seedPaymentMethods(): void
    {
        $rows = [
            ['name' => 'Paystack', 'type' => 'paystack', 'enabled' => true, 'is_default' => true, 'description' => 'Secure online payments via Paystack — supports cards, bank transfer, and USSD.', 'icon' => '💳', 'public_key' => 'pk_test_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx', 'secret_key' => 'demo-secret-placeholder', 'sort_order' => 1],
            ['name' => 'Bank Transfer (Nigeria)', 'type' => 'bank_transfer', 'enabled' => true, 'is_default' => false, 'description' => 'Direct bank transfer to our corporate account.', 'icon' => '🏦', 'bank_name' => 'Guaranty Trust Bank (GTBank)', 'account_name' => 'De-Ebrightmarn Limited', 'account_number' => '0123456789', 'routing_number' => '058', 'swift_code' => 'GTBINGLA', 'bank_address' => 'Plot 123, Ahmadu Bello Way, Victoria Island, Lagos, Nigeria', 'sort_order' => 2],
            ['name' => 'Cash on Delivery', 'type' => 'cash_on_delivery', 'enabled' => true, 'is_default' => false, 'description' => 'Pay in cash when your order is delivered (Abuja only).', 'icon' => '💵', 'cod_instructions' => 'Available for orders within Abuja FCT. Please have exact amount ready. Inspection allowed before payment.', 'sort_order' => 3],
            ['name' => 'Flutterwave', 'type' => 'flutterwave', 'enabled' => false, 'is_default' => false, 'description' => 'Pan-African payment gateway — cards, mobile money, and bank transfers across Africa.', 'icon' => '🌍', 'sort_order' => 4],
            ['name' => 'Stripe', 'type' => 'stripe', 'enabled' => false, 'is_default' => false, 'description' => 'International credit/debit card payments powered by Stripe.', 'icon' => '💎', 'public_key' => 'pk_test_xxxxxxxxxxxxxxxxxxxxxxxx', 'secret_key' => 'demo-secret-placeholder', 'sort_order' => 5],
        ];
        foreach ($rows as $row) {
            PaymentMethod::create($row);
        }
    }

    private function seedSiteImages(): void
    {
        $rows = [
            'logoFull' => '/images/logo-full.png',
            'logoIcon' => '/images/logo-icon.png',
            'heroAgriculture' => 'https://images.pexels.com/photos/10697911/pexels-photo-10697911.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=900&w=1600',
            'heroFinance' => 'https://images.pexels.com/photos/5831351/pexels-photo-5831351.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=900&w=1600',
            'heroFilm' => 'https://images.pexels.com/photos/32292610/pexels-photo-32292610.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=900&w=1600',
            'heroTech' => 'https://images.pexels.com/photos/1181280/pexels-photo-1181280.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=900&w=1600',
            'heroCleaning' => 'https://images.pexels.com/photos/5499416/pexels-photo-5499416.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=900&w=1600',
            'heroWebDesign' => 'https://images.pexels.com/photos/5385526/pexels-photo-5385526.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=900&w=1600',
            'heroSecurity' => 'https://images.pexels.com/photos/33481145/pexels-photo-33481145.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=900&w=1600',
            'heroRealEstate' => 'https://images.pexels.com/photos/38020366/pexels-photo-38020366.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=900&w=1600',
            'aboutTeam' => 'https://images.pexels.com/photos/8547282/pexels-photo-8547282.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=700&w=900',
            'serviceFilm' => 'https://images.pexels.com/photos/32292610/pexels-photo-32292610.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=600&w=800',
            'serviceAgriculture' => 'https://images.pexels.com/photos/5303361/pexels-photo-5303361.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=600&w=800',
            'serviceFinance' => 'https://images.pexels.com/photos/5831347/pexels-photo-5831347.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=600&w=800',
            'serviceTech' => 'https://images.pexels.com/photos/1181280/pexels-photo-1181280.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=600&w=800',
            'serviceCleaning' => 'https://images.pexels.com/photos/6197107/pexels-photo-6197107.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=600&w=800',
            'serviceWebDesign' => 'https://images.pexels.com/photos/5385526/pexels-photo-5385526.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=600&w=800',
            'serviceMarketing' => 'https://images.pexels.com/photos/15595050/pexels-photo-15595050.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=600&w=800',
            'serviceContent' => 'https://images.pexels.com/photos/32957317/pexels-photo-32957317.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=600&w=800',
            'serviceSecurity' => 'https://images.pexels.com/photos/29866272/pexels-photo-29866272.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=600&w=800',
            'serviceElectrical' => 'https://images.pexels.com/photos/36085816/pexels-photo-36085816.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=600&w=800',
            'serviceRealEstate' => 'https://images.pexels.com/photos/4534504/pexels-photo-4534504.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=600&w=800',
            'cardFilm' => 'https://images.pexels.com/photos/32292610/pexels-photo-32292610.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=500&w=600',
            'cardAgriculture' => 'https://images.pexels.com/photos/10697911/pexels-photo-10697911.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=500&w=600',
            'cardFinance' => 'https://images.pexels.com/photos/5831351/pexels-photo-5831351.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=500&w=600',
            'cardTech' => 'https://images.pexels.com/photos/1181280/pexels-photo-1181280.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=500&w=600',
            'cardCleaning' => 'https://images.pexels.com/photos/5499416/pexels-photo-5499416.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=500&w=600',
            'cardWebDesign' => 'https://images.pexels.com/photos/37085302/pexels-photo-37085302.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=500&w=600',
            'cardMarketing' => 'https://images.pexels.com/photos/7970846/pexels-photo-7970846.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=500&w=600',
            'cardContent' => 'https://images.pexels.com/photos/33677293/pexels-photo-33677293.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=500&w=600',
            'cardSecurity' => 'https://images.pexels.com/photos/33481145/pexels-photo-33481145.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=500&w=600',
            'cardElectrical' => 'https://images.pexels.com/photos/13007854/pexels-photo-13007854.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=500&w=600',
            'cardRealEstate' => 'https://images.pexels.com/photos/38020366/pexels-photo-38020366.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=500&w=600',
            'partnerships' => 'https://images.pexels.com/photos/5439465/pexels-photo-5439465.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=900&w=1600',
            'testimonials' => 'https://images.pexels.com/photos/8549944/pexels-photo-8549944.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=700&w=600',
            'contactCta' => 'https://images.pexels.com/photos/7792841/pexels-photo-7792841.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=400&w=800',
        ];
        foreach ($rows as $key => $url) {
            SiteImage::create(['key' => $key, 'url' => $url]);
        }
    }

    private function seedDemoOrders(): void
    {
        $techImage = 'https://images.pexels.com/photos/1181280/pexels-photo-1181280.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=600&w=800';
        $productId = fn (string $name) => Product::where('name', $name)->value('id');

        $orders = [
            [
                'order' => ['order_number' => 'DEE-84736291', 'customer_name' => 'David Mensah', 'customer_email' => 'david@greenbridge.com', 'customer_phone' => '+234 803 456 7890', 'customer_address' => '24 Adetokunbo Ademola', 'customer_city' => 'Abuja', 'customer_state' => 'FCT', 'customer_zip' => '900001', 'customer_country' => 'Nigeria', 'subtotal' => 1697, 'shipping' => 0, 'tax' => 135.76, 'total' => 1832.76, 'status' => 'delivered', 'payment_method' => 'Card ending 3456', 'created_at' => '2025-01-15'],
                'items' => [['name' => 'iPhone 15 Pro Max', 'price' => 1199, 'quantity' => 1], ['name' => 'AirPods Pro (2nd Gen)', 'price' => 249, 'quantity' => 2]],
            ],
            [
                'order' => ['order_number' => 'DEE-29401736', 'customer_name' => 'Sarah Oduwale', 'customer_email' => 'sarah@gvm.com', 'customer_phone' => '+234 802 123 4567', 'customer_address' => '10 Bishop Aboyade Cole', 'customer_city' => 'Lagos', 'customer_state' => 'Lagos', 'customer_zip' => '101233', 'customer_country' => 'Nigeria', 'subtotal' => 3499, 'shipping' => 0, 'tax' => 279.92, 'total' => 3778.92, 'status' => 'shipped', 'payment_method' => 'Card ending 7821', 'created_at' => '2025-01-20'],
                'items' => [['name' => 'MacBook Pro 16" M3 Max', 'price' => 3499, 'quantity' => 1]],
            ],
            [
                'order' => ['order_number' => 'DEE-91827364', 'customer_name' => 'Ibrahim Lawal', 'customer_email' => 'ibrahim@swiftaccess.com', 'customer_phone' => '+234 805 999 1234', 'customer_address' => '5 Independence Ave', 'customer_city' => 'Port Harcourt', 'customer_state' => 'Rivers', 'customer_zip' => '500272', 'customer_country' => 'Nigeria', 'subtotal' => 328, 'shipping' => 25, 'tax' => 26.24, 'total' => 379.24, 'status' => 'processing', 'payment_method' => 'Bank Transfer', 'created_at' => '2025-01-22'],
                'items' => [['name' => 'Google Nest Hub Max', 'price' => 229, 'quantity' => 1], ['name' => 'Logitech MX Master 3S', 'price' => 99, 'quantity' => 1]],
            ],
        ];

        foreach ($orders as $data) {
            $order = Order::forceCreate($data['order']);
            foreach ($data['items'] as $item) {
                $order->items()->create($item + ['product_id' => $productId($item['name']), 'image' => $techImage]);
            }
        }
    }

    private function seedDemoMessages(): void
    {
        $rows = [
            ['name' => 'John Akinwale', 'email' => 'john@company.com', 'phone' => '+234 803 111 2222', 'subject' => 'Partnership Opportunity', 'message' => 'Hi, I would like to discuss a potential partnership for our fintech startup. Could we schedule a call this week?', 'read' => false, 'created_at' => '2025-01-23 10:30:00'],
            ['name' => 'Mary Ogun', 'email' => 'mary.o@gmail.com', 'subject' => 'Service Inquiry', 'message' => "Hello, I'm interested in your film production services for a corporate documentary. Please share your rates and availability.", 'read' => true, 'created_at' => '2025-01-22 14:15:00'],
            ['name' => 'Ahmed Bello', 'email' => 'ahmed@realestate.ng', 'phone' => '+234 802 333 4444', 'subject' => 'Security Installation', 'message' => 'We need CCTV and access control installation for our new estate in Lekki. Can you send a quote?', 'read' => false, 'created_at' => '2025-01-21 09:00:00'],
        ];
        foreach ($rows as $row) {
            Message::forceCreate($row);
        }
    }
}
