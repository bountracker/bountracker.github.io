<div align="center">

# 🎓 Boğaziçi Tracker

**Boğaziçi Üniversitesi öğrencileri için akıllı 4 yıllık ders planlayıcı, GPA/SPA hesaplama ve ÇAP/Yandal takip platformu.**

[![Canlı Uygulama](https://img.shields.io/badge/Canlı_Uygulama-bountracker.github.io-0f172a?style=for-the-badge&logo=google-chrome&logoColor=white)](https://bountracker.github.io/)
[![Lisans](https://img.shields.io/badge/Erişim-Ücretsiz_&_Reklamsız-10b981?style=for-the-badge)]()

[![Kreosus](https://kreosus.com/badge/bountracker.svg)](https://kreosus.com/bountracker?utm_source=kreosus_embed&utm_medium=badge&utm_campaign=bountracker)

[Uygulamayı Aç](https://bountracker.github.io/) • [Hata & Öneri Bildir](https://github.com/bountracker/bountracker.github.io/issues) • [Destek Ol](https://kreosus.com/bountracker?utm_source=kreosus_embed&utm_medium=badge&utm_campaign=bountracker)

</div>

---

## ✨ Öne Çıkan Özellikler

- 📅 **4 Yıllık Dönem Planlayıcı:** Dersleri dönemlere sürükleyip bırakarak veya katalogdan tek tıkla ekleyerek tüm lisans eğitimini görsel olarak planla.
- 📊 **Anlık DNO (SPA) & GNO (GPA) Hesaplama:** Harf notlarını girerek dönemlik ve genel not ortalamanı anında simüle et.
- 📄 **e-Devlet Transkript PDF İçe Aktarma:** e-Devlet üzerinden aldığın resmi transkript PDF dosyasını yükle; aldığın tüm dersler, krediler ve harf notları otomatik olarak dönemlerine yerleşsin.
- 🔗 **Görsel Önkoşul ve Zincir Ağacı:** Hangi dersin hangi dersi açtığını ve eksik önkoşullarını tek bakışta gör.
- 🎯 **ÇAP & Yandal Müfredat Takibi:** Ana dalının yanında Çift Anadal (ÇAP) veya Yandal programlarını ekleyerek ortak dersleri ve kalan kredi yükünü takip et.
- 🔒 **Tam Gizlilik (Local-First):** Transkript ve ders verilerin hiçbir sunucuya gönderilmez; tamamen kendi tarayıcında (`localStorage`) saklanır.

---

## 🛠️ Kullanılan Teknolojiler

- **Frontend:** HTML5, CSS3 (Responsive & Mobile Bottom Sheet), Vanilla JavaScript (ES6+)
- **PDF İşleme:** İstemci taraflı (Client-Side) PDF ayrıştırma altyapısı
- **Geri Bildirim API:** Serverless Node.js (`Vercel`) + GitHub Issues REST API
- **Barındırma:** GitHub Pages

---

## 🗂️ Proje Yapısı

```text
bountracker.github.io/
├── index.html          # Ana uygulama arayüzü ve SEO/Schema.org meta yapısı
├── style.css           # Masaüstü ve mobil (Bottom Sheet) responsive stiller
├── app.js              # Ders planlama, GPA motoru, PDF parser ve önkoşul mantığı
├── data/               # Bölüm, ÇAP ve Yandal müfredat ve önkoşul veri setleri
├── robots.txt          # Arama motoru tarama kuralları
└── sitemap.xml         # Google Search Console site haritası
```

---

> **Yasal Uyarı:** Boğaziçi Tracker öğrenciler tarafından geliştirilmiş bağımsız bir açık erişimli araçtır; Boğaziçi Üniversitesi ile resmi bir kurumsal bağı bulunmamaktadır. Yer alan ders, müfredat ve önkoşul verileri bilgilendirme amaçlıdır; kesin akademik işlemler için resmi üniversite kayıt sistemleri esas alınmalıdır.

Created by Enes Furkan Gözüdik
