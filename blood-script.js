// 1. إعداد الخريطة في جهة اليسار
var map = L.map('map').setView([30.0444, 31.2357], 14); 

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap'
}).addTo(map);

// إضافة علامة لموقع تبرع افتراضي
L.marker([30.0444, 31.2357]).addTo(map)
    .bindPopup('مركز تبرع نشط حالياً')
    .openPopup();

// 2. تفعيل المربعات التي بنضغط عليها
document.getElementById('searchDonors').onclick = function() {
    alert("جاري البحث عن متبرعين متوافقين...");
};

document.getElementById('urgentRequest').onclick = function() {
    alert("تم إرسال طلب استغاثة لجميع المتبرعين القريبين!");
};

document.getElementById('activeDonation').onclick = function() {
    alert("تفاصيل طلب تبرع مستشفى الشفاء...");
};

document.getElementById('nearestBlood').onclick = function() {
    alert("تحديد المسار إلى المركز الإقليمي على الخريطة...");
};