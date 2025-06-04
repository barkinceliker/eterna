/* global __app_id, __firebase_config, __initial_auth_token */
import React, { useState, useEffect, createContext, useContext } from 'react';
// Firebase importları kaldırıldı
// import { initializeApp } from 'firebase/app';
// import { getAuth, signInAnonymously, signInWithCustomToken, onAuthStateChanged } from 'firebase/auth';
// import { getFirestore, collection, getDocs, addDoc, serverTimestamp, doc, setDoc } from 'firebase/firestore';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';


// Global variables provided by the Canvas environment (Firebase kaldırıldığı için artık kullanılmıyor ama uyumluluk için bırakıldı)
const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';
// const firebaseConfig = JSON.parse(typeof __firebase_config !== 'undefined' ? __firebase_config : '{}'); // Firebase kaldırıldığı için kaldırıldı
// const initialAuthToken = typeof __initial_auth_token !== 'undefined' ? __initial_auth_token : null; // Firebase kaldırıldığı için kaldırıldı

// FirebaseContext ve FirebaseProvider kaldırıldı, çünkü Firebase artık kullanılmıyor.
// const FirebaseContext = createContext(null);
// const useFirebase = () => useContext(FirebaseContext);
// const FirebaseProvider = ({ children }) => { /* ... */ };

// --- Components ---

// Product Card Component
const ProductCard = ({ product, onAddToCart }) => (
    <div style={productCardStyle}>
        <img
            src={product.imageUrl || `https://placehold.co/150x150/F3F4F6/1F2937?text=${encodeURIComponent(product.name)}`}
            alt={product.name}
            style={productImageStyle}
            onError={(e) => { e.target.onerror = null; e.target.src = `https://placehold.co/150x150/F3F4F6/1F2937?text=${encodeURIComponent(product.name)}`; }}
        />
        <div style={productBodyStyle}>
            <h3 style={productTitleStyle}>{product.name}</h3>
            <p style={productDescriptionStyle}>{product.description}</p>
            <p style={productPriceStyle}>₺{product.price.toFixed(2)}</p>
            <button
                onClick={() => onAddToCart(product)}
                style={addToCartButtonStyle}
            >
                Sepete Ekle
            </button>
        </div>
    </div>
);

// Product List Component
const ProductList = ({ products, onAddToCart }) => (
    <div style={productListContainerStyle}>
        {products.map((product) => (
            <div key={product.id} style={productListItemStyle}>
                <ProductCard product={product} onAddToCart={onAddToCart} />
            </div>
        ))}
    </div>
);

// Cart Component
const Cart = ({ cart, onUpdateQuantity, onRemoveItem, onCheckout, onClearCart, screenWidth }) => {
    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

    // Dynamic style for cart action buttons based on screen width
    const dynamicCartActionButtonsStyle = {
        ...cartActionButtonsBaseStyle,
        flexDirection: screenWidth < 576 ? 'column' : 'row', // Column on small screens, row on larger
        gap: '1rem',
    };

    return (
        <div style={cartContainerStyle}>
            <h2 style={cartTitleStyle}>Sepetiniz</h2>
            {cart.length === 0 ? (
                <p style={emptyCartMessageStyle}>Sepetiniz boş.</p>
            ) : (
                <>
                    <ul style={cartListStyle}>
                        {cart.map((item) => (
                            <li key={item.id} style={cartItemStyle}>
                                <div style={cartItemDetailsStyle}>
                                    <img
                                        src={item.imageUrl || `https://placehold.co/60x60/F3F4F6/1F2937?text=${encodeURIComponent(item.name)}`}
                                        alt={item.name}
                                        style={cartItemImageStyle}
                                        onError={(e) => { e.target.onerror = null; e.target.src = `https://placehold.co/60x60/F3F4F6/1F2937?text=${encodeURIComponent(item.name)}`; }}
                                    />
                                    <div>
                                        <h3 style={cartItemNameStyle}>{item.name}</h3>
                                        <p style={cartItemPriceStyle}>₺{item.price.toFixed(2)}</p>
                                    </div>
                                </div>
                                <div style={cartItemActionsStyle}>
                                    <button
                                        onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                                        disabled={item.quantity <= 1}
                                        style={quantityButtonStyle}
                                    >
                                        -
                                    </button>
                                    <span style={quantitySpanStyle}>{item.quantity}</span>
                                    <button
                                        onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                                        style={quantityButtonStyle}
                                    >
                                        +
                                    </button>
                                    <button
                                        onClick={() => onRemoveItem(item.id)}
                                        style={removeItemButtonStyle}
                                    >
                                        Kaldır
                                    </button>
                                </div>
                            </li>
                        ))}
                    </ul>
                    <div style={cartTotalStyle}>
                        <p style={{ fontWeight: 'bold' }}>Toplam:</p>
                        <p style={{ fontWeight: 'bold', color: '#28a745', fontSize: '1.5rem' }}>₺{total.toFixed(2)}</p>
                    </div>
                    <div style={dynamicCartActionButtonsStyle}>
                        <button
                            onClick={onCheckout}
                            style={checkoutButtonStyle}
                        >
                            Ödemeye Geç
                        </button>
                        <button
                            onClick={onClearCart}
                            style={clearCartButtonStyle}
                        >
                            Sepeti Temizle
                        </button>
                    </div>
                </>
            )}
        </div>
    );
};

// Checkout Component
const Checkout = ({ cart, onPlaceOrder, onBackToCart }) => {
    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const [message, setMessage] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);

    // handlePlaceOrderClick doğrudan simüle edilmiş ödeme işlemine geçiyor
    const handlePlaceOrderClick = async () => {
        setIsProcessing(true);
        setMessage('Ödeme işleniyor...');
        // Ödeme işlemini simüle et
        await new Promise(resolve => setTimeout(resolve, 2000));

        try {
            await onPlaceOrder();
            setMessage('Ödeme başarılı! Siparişiniz alındı.');
        } catch (error) {
            console.error("Sipariş verme hatası:", error);
            setMessage('Ödeme başarısız oldu. Lütfen tekrar deneyin.');
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <div style={checkoutContainerStyle}>
            <h2 style={checkoutTitleStyle}>Ödeme Bilgileri</h2>
            <ul style={checkoutListStyle}>
                {cart.map((item) => (
                    <li key={item.id} style={checkoutItemStyle}>
                        <span>{item.name} (x{item.quantity})</span>
                        <span>₺{(item.price * item.quantity).toFixed(2)}</span>
                    </li>
                ))}
            </ul>
            <div style={checkoutTotalStyle}>
                <span>Toplam Tutar:</span>
                <span style={{ color: '#28a745', fontWeight: 'bold' }}>₺{total.toFixed(2)}</span>
            </div>

            <div style={checkoutActionsStyle}>
                <p style={checkoutMessageStyle}>
                    Bu bir ödeme simülasyonudur. Gerçek bir uygulama için güvenli bir ödeme ağ geçidi entegrasyonu gereklidir.
                </p>
                <button
                    onClick={handlePlaceOrderClick}
                    disabled={isProcessing}
                    style={{ ...checkoutPayButtonStyle, opacity: isProcessing ? 0.7 : 1, cursor: isProcessing ? 'not-allowed' : 'pointer' }}
                >
                    {isProcessing ? 'Ödeme İşleniyor...' : 'Şimdi Öde (Simülasyon)'}
                </button>

                {message && (
                    <div style={{ ...paymentMessageStyle, backgroundColor: message.includes('başarılı') ? '#d4edda' : '#f8d7da', color: message.includes('başarılı') ? '#155724' : '#721c24' }}>
                        {message}
                    </div>
                )}
                <button
                    onClick={onBackToCart}
                    style={checkoutBackButtonStyle}
                >
                    Sepete Geri Dön
                </button>
            </div>
        </div>
    );
};

// Order Confirmation Component
const OrderConfirmation = ({ orderDetails, onContinueShopping }) => (
    <div style={orderConfirmationContainerStyle}>
        <h2 style={orderConfirmationTitleStyle}>Siparişiniz Alındı!</h2>
        <p style={orderConfirmationMessageStyle}>Teşekkür ederiz! Siparişiniz başarıyla oluşturuldu.</p>
        {orderDetails && (
            <div style={orderDetailsBoxStyle}>
                <p style={orderDetailItemStyle}>Sipariş ID: <span style={{ fontWeight: 'normal', color: '#6c757d' }}>{orderDetails.id}</span></p>
                <p style={orderDetailItemStyle}>Toplam Tutar: <span style={{ fontWeight: 'normal', color: '#28a745' }}>₺{orderDetails.totalAmount.toFixed(2)}</span></p>
                <p style={orderDetailItemStyle}>Sipariş Tarihi: <span style={{ fontWeight: 'normal', color: '#6c757d' }}>{new Date(orderDetails.orderDate).toLocaleString('tr-TR')}</span></p> {/* serverTimestamp yerine Date nesnesi */}
                <p style={orderDetailItemStyle}>Müşteri ID: <span style={{ fontWeight: 'normal', color: '#6c757d' }}>{orderDetails.userId}</span></p>
                <h4 style={orderItemsTitleStyle}>Ürünler:</h4>
                <ul style={orderItemsListStyle}>
                    {orderDetails.items.map((item, index) => (
                        <li key={index}>{item.name} (x{item.quantity}) - ₺{(item.price * item.quantity).toFixed(2)}</li>
                    ))}
                </ul>
            </div>
        )}
        <button
            onClick={onContinueShopping}
            style={continueShoppingButtonStyle}
        >
            Alışverişe Devam Et
        </button>
    </div>
);

// Admin Login Component
const AdminLogin = ({ onLoginSuccess, onMessage }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    // Demo amaçlı hardcoded yönetici kimlik bilgileri.
    // Gerçek bir uygulamada bu bilgiler güvenli bir şekilde yönetilmelidir.
    const ADMIN_EMAIL = 'admin@kafe.com';
    const ADMIN_PASSWORD = 'adminpassword';

    const handleLogin = async () => {
        setLoading(true);
        onMessage(''); // Önceki mesajı temizle
        try {
            if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
                // Başarılı giriş simülasyonu
                onLoginSuccess();
                onMessage('Yönetici girişi başarılı!', 'success');
            } else {
                onMessage('Geçersiz e-posta veya şifre.', 'error');
            }
        } catch (error) {
            // Hata yakalama (bu senaryoda daha az olası, ancak yine de iyi bir pratik)
            console.error("Admin login error:", error);
            onMessage(`Giriş sırasında bir hata oluştu.`, 'error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={adminLoginContainerStyle}>
            <h2 style={adminLoginTitleStyle}>Yönetici Girişi</h2>
            <input
                type="email"
                placeholder="E-posta"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={inputStyle}
                disabled={loading}
            />
            <input
                type="password"
                placeholder="Şifre"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={inputStyle}
                disabled={loading}
            />
            <button
                onClick={handleLogin}
                style={{ ...primaryButtonStyle, width: '100%' }}
                disabled={loading}
            >
                {loading ? 'Giriş Yapılıyor...' : 'Giriş Yap'}
            </button>
        </div>
    );
};


// --- Analytics Dashboard Component ---
const AnalyticsDashboard = () => {
    // const { db, isAuthReady } = useFirebase(); // Firebase kaldırıldığı için kaldırıldı
    const [analysisResult, setAnalysisResult] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [chartData, setChartData] = useState(null); // State to hold chart specific data
    const [chartType, setChartType] = useState(null); // State to hold chart type (e.g., 'dailySales', 'profitability')


    // Function to call the LLM API
    const callLLM = async (promptText, jsonData) => {
        setLoading(true);
        setError('');
        setAnalysisResult('');

        let chatHistory = [];
        const fullPrompt = `${promptText}\n\nVERİ:\n${JSON.stringify(jsonData, null, 2)}`;
        chatHistory.push({ role: "user", parts: [{ text: fullPrompt }] });

        const payload = { contents: chatHistory };
        const apiKey = ""; // Canvas will automatically provide this
        const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

        try {
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            const result = await response.json();

            if (result.candidates && result.candidates.length > 0 &&
                result.candidates[0].content && result.candidates[0].content.parts &&
                result.candidates[0].content.parts.length > 0) {
                const text = result.candidates[0].content.parts[0].text;
                setAnalysisResult(text);
            } else {
                setError("LLM'den yanıt alınamadı veya yanıt yapısı beklenmedik.");
                console.error("LLM response error:", result);
            }
        } catch (err) {
            setError(`LLM çağrısı sırasında hata oluştu: ${err.message}`);
            console.error("LLM fetch error:", err);
        } finally {
            setLoading(false);
        }
    };

    // --- Analytics Functions ---

    const analyzeDailySales = async () => {
        // if (!db || !isAuthReady) { // Firebase kaldırıldığı için kaldırıldı
        //     setError("Veritabanı hazır değil.");
        //     return;
        // }
        setAnalysisResult('');
        setLoading(true);
        setChartData(null);
        setChartType(null);
        try {
            // const ordersCollectionRef = collection(db, `artifacts/${appId}/public/data/orders`); // Firebase kaldırıldığı için kaldırıldı
            // const orderSnapshot = await getDocs(ordersCollectionRef); // Firebase kaldırıldığı için kaldırıldı
            // const orders = orderSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })); // Firebase kaldırıldığı için kaldırıldı

            // Simüle edilmiş sipariş verisi
            const orders = [
                { id: 'order1', totalAmount: 150, orderDate: new Date('2024-05-28T10:00:00Z'), items: [{ name: 'Espresso', quantity: 2 }, { name: 'Kruvasan', quantity: 1 }] },
                { id: 'order2', totalAmount: 200, orderDate: new Date('2024-05-28T14:30:00Z'), items: [{ name: 'Latte', quantity: 1 }, { name: 'Cheesecake', quantity: 1 }] },
                { id: 'order3', totalAmount: 180, orderDate: new Date('2024-05-29T11:00:00Z'), items: [{ name: 'Türk Kahvesi', quantity: 3 }, { name: 'Brownie', quantity: 1 }] },
                { id: 'order4', totalAmount: 250, orderDate: new Date('2024-05-29T16:00:00Z'), items: [{ name: 'Espresso', quantity: 1 }, { name: 'Sandviç', quantity: 1 }, { name: 'Latte', quantity: 1 }] },
                { id: 'order5', totalAmount: 100, orderDate: new Date('2024-05-30T09:00:00Z'), items: [{ name: 'Macaron', quantity: 4 }] },
            ];


            // Aggregate sales data by date and product
            const dailySales = {};
            orders.forEach(order => {
                const orderDate = order.orderDate?.toISOString().split('T')[0]; // Date nesnesi olduğu için toISOString() kullanıldı
                if (!dailySales[orderDate]) {
                    dailySales[orderDate] = { totalRevenue: 0, productSales: {}, hourlySales: {} };
                }
                dailySales[orderDate].totalRevenue += order.totalAmount || 0;

                const orderHour = order.orderDate?.getHours(); // Date nesnesi olduğu için getHours() kullanıldı
                if (!dailySales[orderDate].hourlySales[orderHour]) {
                    dailySales[orderDate].hourlySales[orderHour] = 0;
                }
                dailySales[orderDate].hourlySales[orderHour] += order.totalAmount || 0;

                order.items.forEach(item => {
                    if (!dailySales[orderDate].productSales[item.name]) {
                        dailySales[orderDate].productSales[item.name] = 0;
                    }
                    dailySales[orderDate].productSales[item.name] += item.quantity || 0;
                });
            });

            const formattedSalesData = Object.keys(dailySales).map(date => ({
                date: date,
                totalRevenue: dailySales[date].totalRevenue,
                productSales: dailySales[date].productSales,
                hourlySales: dailySales[date].hourlySales
            }));

            // Prepare data for chart: Top 5 products
            const allProductSales = {};
            formattedSalesData.forEach(day => {
                for (const product in day.productSales) {
                    if (!allProductSales[product]) {
                        allProductSales[product] = 0;
                    }
                    allProductSales[product] += day.productSales[product];
                }
            });

            const topProductsChartData = Object.keys(allProductSales)
                .map(product => ({ name: product, sales: allProductSales[product] }))
                .sort((a, b) => b.sales - a.sales)
                .slice(0, 5);

            setChartData({
                dailyRevenue: formattedSalesData.map(d => ({ date: d.date, revenue: d.totalRevenue })),
                topProducts: topProductsChartData
            });
            setChartType('dailySales');

            const prompt = `Aşağıda bir kafenin gün içindeki satış kayıtları yer alıyor. Bu verilere göre:
- Toplam ciro nedir?
- En çok satılan 5 ürün hangileridir?
- Saat aralıklarına göre satış yoğunlukları nasıldır?
- Bugünkü satış performansı önceki güne kıyasla artmış mı, azalmış mı?

SATIŞ_VERİLERİ:`;
            await callLLM(prompt, formattedSalesData);
        } catch (err) {
            setError(`Günlük satış analizi sırasında hata oluştu: ${err.message}`);
            console.error("Daily sales analysis error:", err);
        } finally {
            setLoading(false);
        }
    };

    const analyzeProductProfitability = async () => {
        // if (!db || !isAuthReady) { // Firebase kaldırıldığı için kaldırıldı
        //     setError("Veritabanı hazır değil.");
        //     return;
        // }
        setAnalysisResult('');
        setLoading(true);
        setChartData(null);
        setChartType(null);
        try {
            // Simüle edilmiş ürün ve sipariş verisi
            const products = [
                { name: "Espresso", price: 25.00, cost: 10.00 },
                { name: "Latte", price: 35.00, cost: 15.00 },
                { name: "Kruvasan", price: 20.00, cost: 8.00 },
                { name: "Cheesecake", price: 45.00, cost: 20.00 },
                { name: "Türk Kahvesi", price: 28.00, cost: 12.00 },
                { name: "Sandviç", price: 40.00, cost: 18.00 },
                { name: "Macaron", price: 30.00, cost: 12.00 },
                { name: "Brownie", price: 32.00, cost: 14.00 },
            ];
            const orders = [
                { id: 'order1', totalAmount: 150, items: [{ name: 'Espresso', quantity: 2 }, { name: 'Kruvasan', quantity: 1 }] },
                { id: 'order2', totalAmount: 200, items: [{ name: 'Latte', quantity: 1 }, { name: 'Cheesecake', quantity: 1 }] },
                { id: 'order3', totalAmount: 180, items: [{ name: 'Türk Kahvesi', quantity: 3 }, { name: 'Brownie', quantity: 1 }] },
                { id: 'order4', totalAmount: 250, items: [{ name: 'Espresso', quantity: 1 }, { name: 'Sandviç', quantity: 1 }, { name: 'Latte', quantity: 1 }] },
                { id: 'order5', totalAmount: 100, items: [{ name: 'Macaron', quantity: 4 }] },
            ];


            const productSalesData = {};
            products.forEach(p => {
                productSalesData[p.name] = {
                    salesPrice: p.price,
                    cost: p.cost || p.price * 0.4, // Simulate cost if not present (40% of price)
                    quantitySold: 0
                };
            });

            orders.forEach(order => {
                order.items.forEach(item => {
                    if (productSalesData[item.name]) {
                        productSalesData[item.name].quantitySold += item.quantity;
                    }
                });
            });

            const formattedProductData = Object.keys(productSalesData).map(name => ({
                productName: name,
                salesPrice: productSalesData[name].salesPrice,
                cost: productSalesData[name].cost,
                quantitySold: productSalesData[name].quantitySold,
                profit: (productSalesData[name].salesPrice - productSalesData[name].cost) * productSalesData[name].quantitySold
            }));

            // Sort by profit for chart
            const profitabilityChartData = formattedProductData.sort((a, b) => b.profit - a.profit);
            setChartData(profitabilityChartData);
            setChartType('profitability');

            const prompt = `Aşağıda ürünlerin satış fiyatı, maliyeti ve satış adedi yer almakta. Buna göre:
- En çok kâr edilen ilk 5 ürün hangisi?
- Zarar ettiren veya düşük kâr getiren ürünler hangileri?
- Menüyü nasıl yeniden düzenlememi önerirsin?

ÜRÜN_VERİSİ:`;
            await callLLM(prompt, formattedProductData);
        } catch (err) {
            setError(`Ürün kârlılık analizi sırasında hata oluştu: ${err.message}`);
            console.error("Product profitability analysis error:", err);
        } finally {
            setLoading(false);
        }
    };

    const analyzeCustomerBehavior = async () => {
        // if (!db || !isAuthReady) { // Firebase kaldırıldığı için kaldırıldı
        //     setError("Veritabanı hazır değil.");
        //     return;
        // }
        setAnalysisResult('');
        setLoading(true);
        setChartData(null);
        setChartType(null);
        try {
            // Simüle edilmiş sipariş verisi
            const orders = [
                { id: 'order1', totalAmount: 150, orderDate: new Date('2024-05-28T10:00:00Z'), userId: 'user1' },
                { id: 'order2', totalAmount: 200, orderDate: new Date('2024-05-28T14:30:00Z'), userId: 'user2' },
                { id: 'order3', totalAmount: 180, orderDate: new Date('2024-05-29T11:00:00Z'), userId: 'user1' },
                { id: 'order4', totalAmount: 250, orderDate: new Date('2024-05-29T16:00:00Z'), userId: 'user3' },
                { id: 'order5', totalAmount: 100, orderDate: new Date('2024-05-30T09:00:00Z'), userId: 'user2' },
                { id: 'order6', totalAmount: 300, orderDate: new Date('2024-05-30T12:00:00Z'), userId: 'user1' },
            ];

            const customerData = {};
            orders.forEach(order => {
                const userId = order.userId || 'unknown';
                if (!customerData[userId]) {
                    customerData[userId] = { totalSpent: 0, visitCount: 0, lastVisitDate: null };
                }
                customerData[userId].totalSpent += order.totalAmount || 0;
                customerData[userId].visitCount += 1;
                const currentVisitDate = order.orderDate; // Date nesnesi olduğu için toDate() kaldırıldı
                if (!customerData[userId].lastVisitDate || currentVisitDate > customerData[userId].lastVisitDate) {
                    customerData[userId].lastVisitDate = currentVisitDate;
                }
            });

            const formattedCustomerData = Object.keys(customerData).map(userId => ({
                customerId: userId,
                totalSpent: customerData[userId].totalSpent,
                visitCount: customerData[userId].visitCount,
                lastVisitDate: customerData[userId].lastVisitDate ? customerData[userId].lastVisitDate.toISOString().split('T')[0] : 'N/A'
            }));

            // Prepare data for chart: Top 10 customers by total spent
            const customerChartData = formattedCustomerData
                .sort((a, b) => b.totalSpent - a.totalSpent)
                .slice(0, 10); // Top 10 customers

            setChartData(customerChartData);
            setChartType('customerBehavior');

            const prompt = `Aşağıda müşteri verileri yer almakta. Her bir müşteri için ziyaret sayısı, toplam harcama ve son alışveriş tarihi verilmiştir. Buna göre:
- Müşterileri A (sadık), B (ara sıra gelen), C (tek seferlik) gruplarına ayır.
- En değerli müşterileri listele.
- Hangi müşterilere kampanya yapılmalı?

MÜŞTERİ_VERİSİ:`;
            await callLLM(prompt, formattedCustomerData);
        } catch (err) {
            setError(`Müşteri davranış analizi sırasında hata oluştu: ${err.message}`);
            console.error("Customer behavior analysis error:", err);
        } finally {
            setLoading(false);
        }
    };

    const analyzeStockAndAlert = async () => {
        setAnalysisResult('');
        setError('');
        setChartData(null);
        setChartType(null);
        // This requires actual stock data and consumption history.
        // For demonstration, we'll use a placeholder.
        const dummyStockData = [
            { productName: "Espresso Beans", currentStockKg: 5, consumptionLast30DaysKg: 10, reorderThresholdKg: 7 },
            { productName: "Milk (L)", currentStockL: 20, consumptionLast30DaysL: 40, reorderThresholdL: 30 },
            { productName: "Croissant Dough (pcs)", currentStockPcs: 15, consumptionLast30DaysPcs: 60, reorderThresholdPcs: 30 },
            { productName: "Sugar (Kg)", currentStockKg: 50, consumptionLast30DaysKg: 5, reorderThresholdKg: 10 },
        ];

        const prompt = `Aşağıda bir kafenin mevcut stok durumu ve son 30 gündeki ürün tüketim verisi yer almakta. Buna göre:
- Hangi ürünler kritik seviyede?
- Ne zaman bitecekler?
- Ne kadarlık stok siparişi öneriyorsun?

STOK_VERİSİ:`;
        await callLLM(prompt, dummyStockData);
        setError("Not: Bu analiz için Firebase'e stok verisi eklemeniz gerekmektedir. Şu anki veri simülasyondur.");
    };

    const analyzeSalesForecast = async () => {
        setAnalysisResult('');
        setError('');
        setChartData(null);
        setChartType(null);
        // This requires historical sales data, preferably daily, for at least 60 days.
        // For demonstration, we'll use a placeholder.
        const dummySalesHistory = [
            { date: "2024-05-01", dailyRevenue: 1500, productSalesCount: 120 },
            { date: "2024-05-02", dailyRevenue: 1650, productSalesCount: 135 },
            { date: "2024-05-03", dailyRevenue: 2000, productSalesCount: 180 },
            // ... more historical data
            { date: "2024-05-30", dailyRevenue: 1800, productSalesCount: 150 },
            { date: "2024-05-31", dailyRevenue: 2200, productSalesCount: 200 },
        ];

        const prompt = `Aşağıdaki geçmiş 60 günlük satış verilerine bakarak:
- Önümüzdeki 7 gün ve 30 gün için günlük satış tahmininde bulun.
- Tahmini yoğun günleri belirt.
- Hava durumu ya da özel gün etkisi varsa tahmine yansıt.

SATIŞ_VERİLERİ:`;
        await callLLM(prompt, dummySalesHistory);
        setError("Not: Bu analiz için Firebase'e yeterli geçmiş satış verisi eklemeniz gerekmektedir. Şu anki veri simülasyondur.");
    };

    const suggestCampaignAndMenu = async () => {
        // if (!db || !isAuthReady) { // Firebase kaldırıldığı için kaldırıldı
        //     setError("Veritabanı hazır değil.");
        //     return;
        // }
        setAnalysisResult('');
        setLoading(true);
        setChartData(null);
        setChartType(null);
        try {
            // Simüle edilmiş ürün ve sipariş verisi
            const products = [
                { name: "Espresso", price: 25.00, cost: 10.00 },
                { name: "Latte", price: 35.00, cost: 15.00 },
                { name: "Kruvasan", price: 20.00, cost: 8.00 },
                { name: "Cheesecake", price: 45.00, cost: 20.00 },
                { name: "Türk Kahvesi", price: 28.00, cost: 12.00 },
                { name: "Sandviç", price: 40.00, cost: 18.00 },
                { name: "Macaron", price: 30.00, cost: 12.00 },
                { name: "Brownie", price: 32.00, cost: 14.00 },
            ];
            const orders = [
                { id: 'order1', totalAmount: 150, items: [{ name: 'Espresso', quantity: 2 }, { name: 'Kruvasan', quantity: 1 }] },
                { id: 'order2', totalAmount: 200, items: [{ name: 'Latte', quantity: 1 }, { name: 'Cheesecake', quantity: 1 }] },
                { id: 'order3', totalAmount: 180, items: [{ name: 'Türk Kahvesi', quantity: 3 }, { name: 'Brownie', quantity: 1 }] },
                { id: 'order4', totalAmount: 250, items: [{ name: 'Espresso', quantity: 1 }, { name: 'Sandviç', quantity: 1 }, { name: 'Latte', quantity: 1 }] },
                { id: 'order5', totalAmount: 100, items: [{ name: 'Macaron', quantity: 4 }] },
            ];


            const productPerformance = {};
            products.forEach(p => {
                productPerformance[p.name] = {
                    quantitySold: 0,
                    profitMargin: (p.price - (p.cost || p.price * 0.4)) / p.price // Simulate profit margin
                };
            });

            orders.forEach(order => {
                order.items.forEach(item => {
                    if (productPerformance[item.name]) {
                        productPerformance[item.name].quantitySold += item.quantity;
                    }
                });
            });

            const formattedProductPerformance = Object.keys(productPerformance).map(name => ({
                productName: name,
                quantitySold: productPerformance[name].quantitySold,
                profitMargin: productPerformance[name].profitMargin
            }));

            const prompt = `Aşağıda ürünlerin son 30 günlük satış performansı ve kâr marjı yer almakta. Düşük satan ama yüksek kâr potansiyeli olan ürünler için kampanya önerileri sun. Ayrıca menüde sadeleştirme gerekiyorsa belirt.

ÜRÜN_SATIS_VERISI:`;
            await callLLM(prompt, formattedProductPerformance);
        } catch (err) {
            setError(`Kampanya ve menü önerisi sırasında hata oluştu: ${err.message}`);
            console.error("Campaign and menu suggestion error:", err);
        } finally {
            setLoading(false);
        }
    };

    const analyzeLocation = async () => {
        setAnalysisResult('');
        setError('');
        setChartData(null);
        setChartType(null);
        // Demirköprü Anadolu Caddesi'ne özel dummy veriler
        const dummyLocationData = {
            locationName: "Demirköprü Anadolu Caddesi",
            averageDailyRevenue: 4200, // Yüksek cadde trafiği nedeniyle yüksek ciro
            averageCustomerCount: 300,
            competitionDensity: "Orta-Yüksek", // Ana cadde üzerinde rekabet olabilir
            demographics: "Karma (Öğrenci, Çalışan, Yerel Halk)", // Üniversite ve işyerlerine yakınlık
            footTraffic: "Çok Yüksek", // Ana cadde üzerinde olması
            nearbyAttractions: ["Demirköprü Metro İstasyonu", "Yerel İşletmeler", "Konut Alanları", "Okul/Üniversite Yakınlığı"]
        };

        const prompt = `Aşağıda "Demirköprü Anadolu Caddesi" lokasyonuna ait satış ve müşteri verisi yer almakta. Buna göre:
- Bu bölgede yeni bir kafe açmak mantıklı mı?
- Satış potansiyeli nedir?
- Hedef müşteri kitlesi kimdir?
- Rekabet durumu ve riskler nelerdir?
- Bu lokasyon için özel pazarlama stratejileri veya menü önerileri neler olabilir?

LOKASYON_VERİSİ:`;
        await callLLM(prompt, dummyLocationData);
        setError("Not: Bu analiz için lokasyon bazlı detaylı veriye ihtiyacınız vardır. Şu anki veri simülasyondur.");
    };


    return (
        <div style={analyticsContainerStyle}>
            <h2 style={analyticsTitleStyle}>Yapay Zeka Destekli Analizler</h2> {/* Eski Başlık */}
            <p style={analyticsDescriptionStyle}>
                Aşağıdaki butonlara tıklayarak kafe verileriniz üzerinde farklı analizler yapabilirsiniz.
                Analizler, Firebase'deki sipariş ve ürün verilerinizi kullanarak LLM'ye gönderilir.
            </p>

            <div style={analyticsButtonGridStyle}>
                <button
                    onClick={analyzeDailySales}
                    disabled={loading}
                    style={analyticsButtonStyle}
                >
                    Günlük Satış Analizi
                </button>
                <button
                    onClick={analyzeProductProfitability}
                    disabled={loading}
                    style={analyticsButtonStyle}
                >
                    Ürün Kârlılık Analizi
                </button>
                <button
                    onClick={analyzeCustomerBehavior}
                    disabled={loading}
                    style={analyticsButtonStyle}
                >
                    Müşteri Davranış Analizi
                </button>
                <button
                    onClick={analyzeStockAndAlert}
                    disabled={loading}
                    style={analyticsButtonStyle}
                >
                    Stok Takibi ve Otomatik Uyarı
                </button>
                <button
                    onClick={analyzeSalesForecast}
                    disabled={loading}
                    style={analyticsButtonStyle}
                >
                    Satış Tahmini (7-30 Gün)
                </button>
                <button
                    onClick={suggestCampaignAndMenu}
                    disabled={loading}
                    style={analyticsButtonStyle}
                >
                    Kampanya ve Menü Önerisi
                </button>
                <button
                    onClick={analyzeLocation}
                    disabled={loading}
                    style={analyticsButtonStyle}
                >
                    Lokasyon Analizi
                </button>
            </div>

            {loading && (
                <div style={loadingMessageStyle}>
                    Analiz yapılıyor, lütfen bekleyin...
                </div>
            )}

            {error && (
                <div style={errorMessageStyle}>
                    {error}
                </div>
            )}

            {chartData && chartType === 'dailySales' && (
                <div style={chartBoxStyle}>
                    <h3 style={chartTitleStyle}>Günlük Ciro</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={chartData.dailyRevenue} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="date" angle={-45} textAnchor="end" height={60} />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="revenue" fill="#8884d8" name="Ciro (₺)" />
                        </BarChart>
                    </ResponsiveContainer>

                    <h3 style={chartTitleStyle}>En Çok Satan 5 Ürün</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={chartData.topProducts} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" angle={-45} textAnchor="end" height={60} />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="sales" fill="#82ca9d" name="Satış Adedi" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            )}

            {chartData && chartType === 'profitability' && (
                <div style={chartBoxStyle}>
                    <h3 style={chartTitleStyle}>Ürün Kârlılığı</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="productName" angle={-45} textAnchor="end" height={60} />
                            <YAxis />
                            <Tooltip formatter={(value) => `₺${value.toFixed(2)}`} />
                            <Legend />
                            <Bar dataKey="profit" fill="#ffc658" name="Toplam Kar (₺)" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            )}

            {chartData && chartType === 'customerBehavior' && (
                <div style={chartBoxStyle}>
                    <h3 style={chartTitleStyle}>Müşteri Harcama Davranışları (En Çok Harcayan 10 Müşteri)</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="customerId" angle={-45} textAnchor="end" height={60} />
                            <YAxis />
                            <Tooltip formatter={(value) => `₺${value.toFixed(2)}`} />
                            <Legend />
                            <Bar dataKey="totalSpent" fill="#8884d8" name="Toplam Harcama (₺)" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            )}


            {analysisResult && (
                <div style={analysisResultBoxStyle}>
                    <h3 style={analysisResultTitleStyle}>Analiz Sonucu:</h3>
                    <pre style={analysisResultPreStyle}>
                        {analysisResult}
                    </pre>
                </div>
            )}
        </div>
    );
};


// --- Inline Styles ---
const baseButtonStyle = {
    padding: '12px 25px', // Daha büyük padding
    borderRadius: '30px', // Daha yuvarlak köşeler
    border: 'none',
    fontWeight: 'bold',
    cursor: 'pointer',
    transition: 'all 0.3s ease', // Tüm özelliklere geçiş efekti
    fontSize: '1.05rem', // Biraz daha büyük font
    boxSizing: 'border-box',
    boxShadow: '0 4px 10px rgba(0,0,0,0.2)', // Daha belirgin gölge
    position: 'relative',
    overflow: 'hidden',
    zIndex: 1,
};

const primaryButtonStyle = {
    ...baseButtonStyle,
    background: 'linear-gradient(45deg, #007bff, #0056b3)', // Mavi gradyan
    color: 'white',
    ':hover': {
        background: 'linear-gradient(45deg, #0056b3, #007bff)', // Hover'da gradyan değişimi
        transform: 'translateY(-3px)', // Hafif yukarı hareket
        boxShadow: '0 6px 15px rgba(0,0,0,0.3)', // Daha büyük gölge
    },
};

const successButtonStyle = {
    ...baseButtonStyle,
    background: 'linear-gradient(45deg, #28a745, #1e7e34)', // Yeşil gradyan
    color: 'white',
    ':hover': {
        background: 'linear-gradient(45deg, #1e7e34, #28a745)',
        transform: 'translateY(-3px)',
        boxShadow: '0 6px 15px rgba(0,0,0,0.3)',
    },
};

const secondaryButtonStyle = {
    ...baseButtonStyle,
    background: 'linear-gradient(45deg, #6c757d, #5a6268)', // Gri gradyan
    color: 'white',
    ':hover': {
        background: 'linear-gradient(45deg, #5a6268, #6c757d)',
        transform: 'translateY(-3px)',
        boxShadow: '0 6px 15px rgba(0,0,0,0.3)',
    },
};

const dangerButtonStyle = {
    ...baseButtonStyle,
    background: 'linear-gradient(45deg, #dc3545, #c82333)', // Kırmızı gradyan
    color: 'white',
    ':hover': {
        background: 'linear-gradient(45deg, #c82333, #dc3545)',
        transform: 'translateY(-3px)',
        boxShadow: '0 6px 15px rgba(0,0,0,0.3)',
    },
};

const infoButtonStyle = {
    ...baseButtonStyle,
    background: 'linear-gradient(45deg, #17a2b8, #138496)', // Turkuaz gradyan
    color: 'white',
    ':hover': {
        background: 'linear-gradient(45deg, #138496, #17a2b8)',
        transform: 'translateY(-3px)',
        boxShadow: '0 6px 15px rgba(0,0,0,0.3)',
    },
};

// Layout styles
const appContainerStyle = {
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100vh',
    // Daha dinamik ve zengin bir arka plan gradyanı
    background: 'linear-gradient(135deg, #f0f4f8 0%, #d9e2ec 50%, #c1d1e0 100%)', // Açık mavi-gri tonlarında gradyan
    fontFamily: 'Inter, sans-serif',
    color: '#343a40', // Varsayılan metin rengi
};

// Updated Header Style for a more vibrant and lively look
const headerStyle = {
    background: 'linear-gradient(90deg, #4CAF50 0%, #8BC34A 100%)', // Daha canlı yeşil gradyan
    color: 'white',
    padding: '1.5rem 2rem', // Daha fazla padding
    boxShadow: '0 8px 20px rgba(0,0,0,0.15)', // Daha belirgin ve yumuşak gölge
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    position: 'sticky', // Make it sticky
    top: 0,
    zIndex: 1000, // Ensure it stays on top
    borderBottomLeftRadius: '20px', // Alt köşeleri yuvarlat
    borderBottomRightRadius: '20px', // Alt köşeleri yuvarlat
};

const headerTitleStyle = {
    fontSize: '3rem', // Daha büyük font boyutu
    fontWeight: '900', // Daha kalın
    cursor: 'pointer',
    margin: 0,
    textShadow: '3px 3px 6px rgba(0,0,0,0.3)', // Daha belirgin metin gölgesi
};

const headerNavStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '1.5rem', // Butonlar arasında daha fazla boşluk
    flexWrap: 'wrap', // Allow wrapping on very small screens if necessary
    justifyContent: 'flex-end', // Align items to the right
    flexGrow: 1, // Allow nav to take available space
};

const navButtonStyle = {
    ...baseButtonStyle,
    background: 'rgba(255,255,255,0.2)', // Biraz daha şeffaf beyaz arka plan
    border: '1px solid rgba(255,255,255,0.6)', // Daha belirgin bir kenarlık
    color: 'white',
    padding: '12px 25px', // Daha büyük padding
    fontSize: '1.05rem',
    borderRadius: '30px', // Daha yuvarlak
    boxShadow: '0 3px 8px rgba(0,0,0,0.15)', // Daha belirgin gölge
    ':hover': {
        background: 'rgba(255,255,255,0.35)', // Hover'da daha opak
        transform: 'scale(1.05) translateY(-2px)', // Hafif büyüme ve yukarı hareket
        boxShadow: '0 5px 12px rgba(0,0,0,0.25)', // Gelişmiş hover gölgesi
    },
};

const cartBadgeStyle = {
    position: 'absolute',
    top: '-10px', // Biraz daha yukarı
    right: '-10px', // Biraz daha sağa
    backgroundColor: '#FF5722', // Orange-red for attention
    color: 'white',
    fontSize: '0.85rem', // Biraz daha büyük
    fontWeight: 'bold',
    borderRadius: '50%',
    height: '25px', // Biraz daha büyük
    width: '25px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 3px 6px rgba(0,0,0,0.25)', // Gölge
};

const messageBoxStyle = {
    backgroundColor: '#e2f0fb',
    border: '1px solid #b8daff',
    color: '#004085',
    padding: '15px 25px', // Daha fazla padding
    borderRadius: '10px', // Daha yuvarlak köşeler
    margin: '1.5rem auto', // Daha fazla margin
    width: 'fit-content',
    textAlign: 'center',
    position: 'relative',
    boxShadow: '0 3px 8px rgba(0,0,0,0.15)', // Daha belirgin gölge
    fontSize: '1.1rem', // Daha büyük font
};

const messageCloseButtonStyle = {
    position: 'absolute',
    top: '8px', // Biraz daha aşağı
    right: '12px', // Biraz daha sağa
    backgroundColor: 'transparent',
    border: 'none',
    fontSize: '1.5rem', // Daha büyük
    cursor: 'pointer',
    color: '#004085',
};

const mainContentStyle = {
    flexGrow: 1,
    padding: '2rem', // Daha fazla padding
    maxWidth: '1200px',
    margin: '0 auto',
    width: '100%',
};

const footerStyle = {
    background: 'linear-gradient(90deg, #343a40 0%, #495057 100%)', // Koyu gri gradyan
    color: 'white',
    padding: '1.5rem', // Daha fazla padding
    textAlign: 'center',
    boxShadow: '0 -6px 15px rgba(0,0,0,0.1)', // Üstte gölge
    borderTopLeftRadius: '20px', // Üst köşeleri yuvarlat
    borderTopRightRadius: '20px', // Üst köşeleri yuvarlat
};

// Product Card Specific Styles
const productCardStyle = {
    backgroundColor: 'white',
    padding: '2rem', // Daha fazla padding
    borderRadius: '15px', // Daha yuvarlak köşeler
    boxShadow: '0 10px 25px rgba(0,0,0,0.15)', // Daha belirgin ve yumuşak gölge
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
    marginBottom: '1.5rem', // Daha fazla boşluk
    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
    ':hover': {
        transform: 'translateY(-5px)', // Hafif yukarı hareket
        boxShadow: '0 15px 35px rgba(0,0,0,0.25)', // Daha büyük gölge
    },
};

const productImageStyle = {
    width: '180px', // Daha büyük resim
    height: '180px', // Daha büyük resim
    objectFit: 'cover',
    borderRadius: '10px',
    marginBottom: '1.5rem',
    boxShadow: '0 4px 10px rgba(0,0,0,0.1)', // Resim için gölge
};

const productBodyStyle = {
    width: '100%',
};

const productTitleStyle = {
    fontSize: '1.5rem', // Daha büyük font
    fontWeight: '700', // Daha kalın
    marginBottom: '0.75rem',
    color: '#343a40',
};

const productDescriptionStyle = {
    color: '#6c757d',
    marginBottom: '1.25rem',
    fontSize: '0.95rem',
};

const productPriceStyle = {
    fontSize: '1.8rem', // Daha büyük font
    fontWeight: 'bold',
    color: '#28a745',
    marginBottom: '1.8rem',
};

const addToCartButtonStyle = {
    ...successButtonStyle,
    padding: '14px 28px', // Daha büyük buton
    borderRadius: '9999px', // rounded-full equivalent
};

const productListContainerStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', // Daha büyük kartlar için min genişlik
    gap: '2rem', // Daha fazla boşluk
    padding: '2rem',
};

const productListItemStyle = {
    display: 'flex',
    justifyContent: 'center',
};

// Cart Specific Styles
const cartContainerStyle = {
    backgroundColor: 'white',
    padding: '2.5rem', // Daha fazla padding
    borderRadius: '15px', // Daha yuvarlak
    boxShadow: '0 12px 30px rgba(0,0,0,0.15)', // Daha belirgin gölge
    maxWidth: '800px', // Daha geniş
    margin: '2.5rem auto', // Daha fazla boşluk
};

const cartTitleStyle = {
    fontSize: '2.2rem', // Daha büyük
    fontWeight: 'bold',
    color: '#343a40',
    marginBottom: '2rem', // Daha fazla boşluk
    textAlign: 'center',
};

const emptyCartMessageStyle = {
    textAlign: 'center',
    color: '#6c757d',
    fontSize: '1.25rem', // Daha büyük font
};

const cartListStyle = {
    listStyle: 'none',
    padding: 0,
    margin: 0,
};

const cartItemStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: '1.2rem', // Daha fazla padding
    marginBottom: '1.2rem',
    borderBottom: '1px solid #e9ecef',
};

const cartItemDetailsStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '1.2rem', // Daha fazla boşluk
};

const cartItemImageStyle = {
    width: '70px', // Daha büyük resim
    height: '70px', // Daha büyük resim
    objectFit: 'cover',
    borderRadius: '8px',
};

const cartItemNameStyle = {
    fontSize: '1.25rem', // Daha büyük font
    fontWeight: '600',
    color: '#343a40',
    margin: 0,
};

const cartItemPriceStyle = {
    color: '#6c757d',
    margin: 0,
    fontSize: '1.05rem',
};

const cartItemActionsStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem', // Daha fazla boşluk
};

const quantityButtonStyle = {
    backgroundColor: '#e9ecef',
    color: '#495057',
    border: 'none',
    padding: '0.5rem 1rem', // Daha büyük padding
    borderRadius: '8px', // Daha yuvarlak
    cursor: 'pointer',
    transition: 'background-color 0.3s ease, transform 0.2s ease',
    fontSize: '1.1rem', // Daha büyük font
    ':hover': {
        backgroundColor: '#dee2e6',
        transform: 'scale(1.05)',
    },
    ':disabled': {
        opacity: 0.5,
        cursor: 'not-allowed',
    },
};

const quantitySpanStyle = {
    fontSize: '1.25rem', // Daha büyük font
    fontWeight: '500',
};

const removeItemButtonStyle = {
    ...dangerButtonStyle,
    padding: '0.5rem 1rem', // Daha büyük padding
    borderRadius: '8px',
    marginLeft: '0.75rem', // Daha fazla boşluk
};

const cartTotalStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTop: '1px solid #e9ecef',
    paddingTop: '1.5rem', // Daha fazla padding
    marginTop: '2rem', // Daha fazla boşluk
    fontSize: '1.6rem', // Daha büyük font
};

// Base style for cart action buttons, responsive logic will be applied dynamically
const cartActionButtonsBaseStyle = {
    display: 'flex',
    marginTop: '2rem', // Daha fazla boşluk
    justifyContent: 'center',
};

const checkoutButtonStyle = {
    ...primaryButtonStyle,
    padding: '1.2rem 2.5rem', // Daha büyük
    borderRadius: '9999px',
};

const clearCartButtonStyle = {
    ...secondaryButtonStyle,
    padding: '1.2rem 2.5rem', // Daha büyük
    borderRadius: '9999px',
};

// Checkout Specific Styles
const checkoutContainerStyle = {
    backgroundColor: 'white',
    padding: '2.5rem', // Daha fazla padding
    borderRadius: '15px', // Daha yuvarlak
    boxShadow: '0 12px 30px rgba(0,0,0,0.15)', // Daha belirgin gölge
    maxWidth: '600px', // Daha geniş
    margin: '2.5rem auto', // Daha fazla boşluk
};

const checkoutTitleStyle = {
    fontSize: '2.2rem', // Daha büyük
    fontWeight: 'bold',
    color: '#343a40',
    marginBottom: '2rem', // Daha fazla boşluk
    textAlign: 'center',
};

const checkoutListStyle = {
    listStyle: 'none',
    padding: 0,
    margin: 0,
    marginBottom: '2rem', // Daha fazla boşluk
};

const checkoutItemStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '0.75rem 0', // Daha fazla padding
    borderBottom: '1px dashed #e9ecef',
    color: '#495057',
    fontSize: '1.1rem', // Daha büyük font
};

const checkoutTotalStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTop: '1px solid #e9ecef',
    paddingTop: '1.5rem', // Daha fazla padding
    fontSize: '1.8rem', // Daha büyük font
    fontWeight: 'bold',
    color: '#343a40',
};

const checkoutActionsStyle = {
    textAlign: 'center',
    marginTop: '2rem', // Daha fazla boşluk
};

const checkoutMessageStyle = {
    color: '#6c757d',
    marginBottom: '1.5rem', // Daha fazla boşluk
    fontSize: '1rem', // Daha büyük font
};

const checkoutPayButtonStyle = {
    ...successButtonStyle,
    padding: '1.2rem 2.5rem', // Daha büyük
    borderRadius: '9999px',
    width: '100%',
    marginBottom: '1.5rem', // Daha fazla boşluk
};

const paymentMessageStyle = {
    padding: '1rem 1.5rem', // Daha fazla padding
    borderRadius: '0.5rem', // Daha yuvarlak
    border: '1px solid transparent',
    marginTop: '1.5rem', // Daha fazla boşluk
    fontSize: '1rem', // Daha büyük font
};

const checkoutBackButtonStyle = {
    ...secondaryButtonStyle,
    padding: '1rem 2rem', // Daha büyük
    borderRadius: '9999px',
    width: '100%',
};

// New styles for phone verification inputs (re-added for general input styling)
const inputStyle = {
    width: '100%',
    padding: '15px 20px', // Daha büyük padding
    marginBottom: '1.2rem', // Daha fazla boşluk
    border: '1px solid #ced4da',
    borderRadius: '10px', // Daha yuvarlak
    fontSize: '1.15rem', // Daha büyük font
    boxSizing: 'border-box',
    boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.1)', // İç gölge
    ':focus': {
        borderColor: '#007bff',
        boxShadow: '0 0 0 3px rgba(0,123,255,0.25)', // Focus efekti
        outline: 'none',
    },
};

// Order Confirmation Specific Styles
const orderConfirmationContainerStyle = {
    backgroundColor: 'white',
    padding: '2.5rem', // Daha fazla padding
    borderRadius: '15px', // Daha yuvarlak
    boxShadow: '0 12px 30px rgba(0,0,0,0.15)', // Daha belirgin gölge
    maxWidth: '600px', // Daha geniş
    margin: '2.5rem auto', // Daha fazla boşluk
    textAlign: 'center',
};

const orderConfirmationTitleStyle = {
    fontSize: '2.2rem', // Daha büyük
    fontWeight: 'bold',
    color: '#28a745',
    marginBottom: '1.5rem',
};

const orderConfirmationMessageStyle = {
    color: '#495057',
    fontSize: '1.25rem', // Daha büyük
    marginBottom: '2rem', // Daha fazla boşluk
};

const orderDetailsBoxStyle = {
    textAlign: 'left',
    backgroundColor: '#f8f9fa',
    padding: '1.5rem', // Daha fazla padding
    borderRadius: '10px', // Daha yuvarlak
    marginBottom: '2rem', // Daha fazla boşluk
    border: '1px solid #e9ecef',
};

const orderDetailItemStyle = {
    fontWeight: '600',
    color: '#343a40',
    marginBottom: '0.75rem', // Daha fazla boşluk
    fontSize: '1.05rem',
};

const orderItemsTitleStyle = {
    fontSize: '1.15rem', // Daha büyük
    fontWeight: '600',
    color: '#343a40',
    marginTop: '1.5rem', // Daha fazla boşluk
    marginBottom: '0.75rem', // Daha fazla boşluk
};

const orderItemsListStyle = {
    listStyle: 'disc',
    paddingLeft: '2rem', // Daha fazla padding
    color: '#495057',
    fontSize: '1rem',
};

const continueShoppingButtonStyle = {
    ...primaryButtonStyle,
    padding: '1.2rem 2.5rem', // Daha büyük
    borderRadius: '9999px',
};

// Analytics Dashboard Specific Styles
const analyticsContainerStyle = {
    backgroundColor: 'white',
    padding: '2.5rem', // Daha fazla padding
    borderRadius: '15px', // Daha yuvarlak
    boxShadow: '0 12px 30px rgba(0,0,0,0.15)', // Daha belirgin gölge
    maxWidth: '950px', // Daha geniş
    margin: '2.5rem auto', // Daha fazla boşluk
};

const analyticsTitleStyle = {
    fontSize: '2.2rem', // Daha büyük
    fontWeight: 'bold',
    color: '#343a40',
    marginBottom: '2rem', // Daha fazla boşluk
    textAlign: 'center',
};

const analyticsDescriptionStyle = {
    color: '#6c757d',
    marginBottom: '2.5rem', // Daha fazla boşluk
    textAlign: 'center',
    fontSize: '1.1rem',
};

const analyticsButtonGridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', // Daha büyük butonlar için min genişlik
    gap: '1.5rem', // Daha fazla boşluk
};

const analyticsButtonStyle = {
    ...infoButtonStyle,
    padding: '1.2rem 1.8rem', // Daha büyük
    borderRadius: '9999px',
};

const loadingMessageStyle = {
    textAlign: 'center',
    color: '#007bff',
    fontSize: '1.25rem', // Daha büyük font
    marginTop: '2.5rem', // Daha fazla boşluk
};

const errorMessageStyle = {
    backgroundColor: '#f8d7da',
    border: '1px solid #f5c6cb',
    color: '#721c24',
    padding: '15px 25px', // Daha fazla padding
    borderRadius: '10px', // Daha yuvarlak
    marginTop: '2.5rem', // Daha fazla boşluk
    fontSize: '1.1rem', // Daha büyük font
};

const analysisResultBoxStyle = {
    backgroundColor: '#f8f9fa',
    padding: '2rem', // Daha fazla padding
    borderRadius: '10px', // Daha yuvarlak
    border: '1px solid #e9ecef',
    marginTop: '2.5rem', // Daha fazla boşluk
};

const analysisResultTitleStyle = {
    fontSize: '1.35rem', // Daha büyük
    fontWeight: '600',
    color: '#343a40',
    marginBottom: '1.2rem', // Daha fazla boşluk
};

const analysisResultPreStyle = {
    whiteSpace: 'pre-wrap',
    fontFamily: 'monospace',
    color: '#495057',
    fontSize: '0.95rem', // Biraz daha büyük
    backgroundColor: 'white',
    padding: '1.5rem', // Daha fazla padding
    borderRadius: '8px', // Daha yuvarlak
    border: '1px solid #dee2e6',
    overflowX: 'auto',
};

const chartBoxStyle = {
    backgroundColor: '#ffffff',
    padding: '2rem', // Daha fazla padding
    borderRadius: '12px', // Daha yuvarlak
    boxShadow: '0 6px 15px rgba(0,0,0,0.1)', // Daha belirgin gölge
    marginTop: '2.5rem', // Daha fazla boşluk
    marginBottom: '2.5rem', // Daha fazla boşluk
};

const chartTitleStyle = {
    fontSize: '1.6rem', // Daha büyük
    fontWeight: 'bold',
    color: '#343a40',
    marginBottom: '1.5rem', // Daha fazla boşluk
    textAlign: 'center',
};

// Recharts Pie Chart Colors
const PIE_COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#AF19FF', '#FF1942'];

// Admin Login Specific Styles
const adminLoginContainerStyle = {
    backgroundColor: 'white',
    padding: '2.5rem', // Daha fazla padding
    borderRadius: '15px', // Daha yuvarlak
    boxShadow: '0 12px 30px rgba(0,0,0,0.15)', // Daha belirgin gölge
    maxWidth: '450px', // Daha geniş
    margin: '2.5rem auto', // Daha fazla boşluk
    textAlign: 'center',
};

const adminLoginTitleStyle = {
    fontSize: '2rem', // Daha büyük
    fontWeight: 'bold',
    color: '#343a40',
    marginBottom: '2rem', // Daha fazla boşluk
};


// Main App Component
function App() {
    // Firebase bağımlılıkları kaldırıldı
    // const { db, auth, userId, isAuthReady, firebaseError } = useFirebase();
    const [products, setProducts] = useState([]);
    const [cart, setCart] = useState([]);
    const [currentView, setCurrentView] = useState('products'); // 'products', 'cart', 'checkout', 'confirmation', 'analytics', 'adminLogin'
    const [orderDetails, setOrderDetails] = useState(null);
    const [message, setMessage] = useState('');
    const [screenWidth, setScreenWidth] = useState(window.innerWidth); // State to track screen width
    const [adminLoggedIn, setAdminLoggedIn] = useState(false); // New state for admin login status

    // Firebase kaldırıldığı için userId direkt burada oluşturuldu
    const [userId, setUserId] = useState(crypto.randomUUID());

    // Effect to update screenWidth on resize
    useEffect(() => {
        const handleResize = () => {
            setScreenWidth(window.innerWidth);
        };
        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    // Yönetici oturum durumu artık Firebase'e bağlı değil
    useEffect(() => {
        // if (!isAuthReady) { // Firebase kaldırıldığı için kaldırıldı
        //     setAdminLoggedIn(false);
        // }
    }, []);


    // Ürünleri Firebase yerine doğrudan dummy veri ile yükle
    useEffect(() => {
        const dummyProducts = [
            { id: 'prod1', name: "Espresso", price: 25.00, description: "Yoğun ve aromatik kahve.", imageUrl: "https://images.unsplash.com/photo-1517256037142-23f2f704870f?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", cost: 10.00 },
            { id: 'prod2', name: "Latte", price: 35.00, description: "Sütlü ve köpüklü kahve.", imageUrl: "https://images.unsplash.com/photo-1580614064563-02f4f2f4f5a3?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", cost: 15.00 },
            { id: 'prod3', name: "Kruvasan", price: 20.00, description: "Çıtır çıtır taze kruvasan.", imageUrl: "https://images.unsplash.com/photo-1626804868221-5079a4216892?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", cost: 8.00 },
            { id: 'prod4', name: "Cheesecake", price: 45.00, description: "Ev yapımı enfes cheesecake.", imageUrl: "https://images.unsplash.com/photo-1567117189182-44754719d35f?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", cost: 20.00 },
            { id: 'prod5', name: "Türk Kahvesi", price: 28.00, description: "Geleneksel Türk kahvesi.", imageUrl: "https://images.unsplash.com/photo-1614777934661-3a0c5c3b1e7c?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", cost: 12.00 },
            { id: 'prod6', name: "Sandviç", price: 40.00, description: "Taze ve doyurucu sandviç.", imageUrl: "https://images.unsplash.com/photo-1528735602780-2552fd46c7fe?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", cost: 18.00 },
            { id: 'prod7', name: "Macaron", price: 30.00, description: "Renkli ve lezzetli Fransız kurabiyesi.", imageUrl: "https://images.unsplash.com/photo-1558327914-f06b9a9c2b9f?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", cost: 12.00 },
            { id: 'prod8', name: "Brownie", price: 32.00, description: "Yoğun çikolatalı, nemli brownie.", imageUrl: "https://images.unsplash.com/photo-1596700075532-6b9b3e1b0b0f?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", cost: 14.00 },
        ];
        setProducts(dummyProducts);
    }, []); // Boş bağımlılık dizisi, sadece bir kez çalışmasını sağlar.

    // Add item to cart
    const handleAddToCart = (product) => {
        setCart((prevCart) => {
            const existingItem = prevCart.find((item) => item.id === product.id);
            if (existingItem) {
                return prevCart.map((item) =>
                    item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
                );
            } else {
                return [...prevCart, { ...product, quantity: 1 }];
            }
        });
        setMessage(`${product.name} sepete eklendi!`);
        setTimeout(() => setMessage(''), 2000); // Clear message after 2 seconds
    };

    // Update item quantity in cart
    const handleUpdateQuantity = (id, quantity) => {
        setCart((prevCart) => {
            if (quantity <= 0) {
                return prevCart.filter((item) => item.id !== id);
            }
            return prevCart.map((item) =>
                item.id === id ? { ...item, quantity: quantity } : item
            );
        });
    };

    // Remove item from cart
    const handleRemoveItem = (id) => {
        setCart((prevCart) => prevCart.filter((item) => item.id !== id));
        setMessage("Ürün sepetten kaldırıldı.");
        setTimeout(() => setMessage(''), 2000);
    };

    // Clear the entire cart
    const handleClearCart = () => {
        setCart([]);
        setMessage("Sepet temizlendi.");
        setTimeout(() => setMessage(''), 2000);
    };

    // Place order (Firebase etkileşimleri kaldırıldı, sadece simülasyon)
    const handlePlaceOrder = async () => {
        if (cart.length === 0) {
            setMessage("Sepetiniz boş, sipariş verilemez.");
            return;
        }

        try {
            const totalAmount = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
            const orderItems = cart.map(item => ({
                productId: item.id,
                name: item.name,
                price: item.price,
                quantity: item.quantity
            }));

            // Firebase yerine simüle edilmiş sipariş detayı oluştur
            const simulatedOrderId = `order_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
            setOrderDetails({
                id: simulatedOrderId,
                userId: userId,
                items: orderItems,
                totalAmount: totalAmount,
                orderDate: new Date(), // Anlık tarih
            });

            setCart([]); // Clear cart after successful order
            setCurrentView('confirmation');
            setMessage("Siparişiniz başarıyla alındı!");
        } catch (error) {
            console.error("Sipariş verilirken hata oluştu:", error);
            setMessage("Sipariş verilirken bir sorun oluştu. Lütfen tekrar deneyin.");
        }
    };

    const handleAdminLoginSuccess = () => {
        setAdminLoggedIn(true);
        setCurrentView('analytics'); // Başarılı giriş sonrası analizlere yönlendir
    };

    const handleAdminLogout = () => {
        setAdminLoggedIn(false);
        setCurrentView('products'); // Çıkış sonrası ürünlere yönlendir
        setMessage('Yönetici oturumu kapatıldı.');
    };

    // Render different views based on currentView state
    const renderView = () => {
        // Firebase hata kontrolü kaldırıldı
        // if (firebaseError) { /* ... */ }

        switch (currentView) {
            case 'products':
                return <ProductList products={products} onAddToCart={handleAddToCart} />;
            case 'cart':
                return (
                    <Cart
                        cart={cart}
                        onUpdateQuantity={handleUpdateQuantity}
                        onRemoveItem={handleRemoveItem}
                        onCheckout={() => setCurrentView('checkout')}
                        onClearCart={handleClearCart}
                        screenWidth={screenWidth} // Pass screenWidth to Cart
                    />
                );
            case 'checkout':
                return (
                    <Checkout
                        cart={cart}
                        onPlaceOrder={handlePlaceOrder}
                        onBackToCart={() => setCurrentView('cart')}
                    />
                );
            case 'confirmation':
                return (
                    <OrderConfirmation
                        orderDetails={orderDetails}
                        onContinueShopping={() => setCurrentView('products')}
                    />
                );
            case 'analytics':
                return adminLoggedIn ? <AnalyticsDashboard /> : <AdminLogin onLoginSuccess={handleAdminLoginSuccess} onMessage={setMessage} />;
            case 'adminLogin':
                return <AdminLogin onLoginSuccess={handleAdminLoginSuccess} onMessage={setMessage} />;
            default:
                return <ProductList products={products} onAddToCart={handleAddToCart} />;
        }
    };

    return (
        <div style={appContainerStyle}>
            <header style={headerStyle}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', flexWrap: 'wrap' }}>
                    <h1 style={headerTitleStyle} onClick={() => setCurrentView('products')}>
                        <span style={{ color: '#FFD700' }}>Eterna</span> Bakery
                    </h1>
                    <nav style={headerNavStyle}>
                        <button
                            onClick={() => setCurrentView('products')}
                            style={navButtonStyle}
                            // Apply hover style dynamically
                            onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.35)'}
                            onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.2)'}
                        >
                            Ürünler
                        </button>
                        <div style={{ position: 'relative' }}>
                            <button
                                onClick={() => setCurrentView('cart')}
                                style={navButtonStyle}
                                // Apply hover style dynamically
                                onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.35)'}
                                onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.2)'}
                            >
                                Sepet ({cart.length})
                            </button>
                            {cart.length > 0 && (
                                <span style={cartBadgeStyle}>
                                    {cart.reduce((sum, item) => sum + item.quantity, 0)}
                                </span>
                            )}
                        </div>
                        {adminLoggedIn ? (
                            <> {/* Admin giriş yaptığında hem çıkış hem de analiz butonu görünsün */}
                                <button
                                    onClick={handleAdminLogout}
                                    style={navButtonStyle}
                                    onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.35)'}
                                    onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.2)'}
                                >
                                    Admin Çıkışı
                                </button>
                                <button
                                    onClick={() => setCurrentView('analytics')}
                                    style={navButtonStyle}
                                    onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.35)'}
                                    onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.2)'}
                                >
                                    Analizler
                                </button>
                            </>
                        ) : (
                            <button
                                onClick={() => setCurrentView('adminLogin')}
                                style={navButtonStyle}
                                onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.35)'}
                                onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.2)'}
                            >
                                Admin Girişi
                            </button>
                        )}
                    </nav>
                </div>
            </header>

            {message && (
                <div style={messageBoxStyle}>
                    <span>{message}</span>
                    <button style={messageCloseButtonStyle} onClick={() => setMessage('')}>&times;</button>
                </div>
            )}

            <main style={mainContentStyle}>
                {/* isAuthReady kontrolü kaldırıldı, çünkü Firebase yok */}
                {renderView()}
            </main>

            <footer style={footerStyle}>
                <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                    <p style={{ margin: 0 }}>&copy; {new Date().getFullYear()} Eterna Bakery. Tüm Hakları Saklıdır.</p>
                    <p style={{ fontSize: '0.875rem', color: '#adb5bd', margin: 0 }}>Müşteri ID: {userId}</p>
                </div>
            </footer>
        </div>
    );
}

export default function AppWrapper() {
    // FirebaseProvider kaldırıldığı için App direkt döndürüldü
    return (
        <App />
    );
}
