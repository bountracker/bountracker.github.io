const isMobileDevice = () => window.innerWidth <= 900;

const FALL_TERM = "2026/2027-1";
const SPRING_TERM = "2025/2026-2";
const DEFAULT_TERM = FALL_TERM;

let isDashPinned = localStorage.getItem('boun_pin_dash_card') === 'true';

const GRADE_POINTS = {
  'AA': 4.0, 'BA': 3.5, 'BB': 3.0, 'CB': 2.5,
  'CC': 2.0, 'DC': 1.5, 'DD': 1.0, 'F': 0.0, 'P': null, 'EX': null
};

const savedLang = localStorage.getItem('boun_lang');
let currentLang = (savedLang === 'tr' || savedLang === 'en')
  ? savedLang
  : ((navigator.language || '').toLowerCase().startsWith('tr') ? 'tr' : 'en');

const translations = {
  tr: {
    appSubtitle: "| Ders & GPA Takip",
    deptLabel: "Bölüm:",
    addMinor: "🎓 Yandal Ekle",
    minorBtnTitle: "Yandal Programı Seç / Düzenle",
    minorLabelPrefix: "Yandal",
    minorRemoveTooltip: "Yandalı Kaldır",
    minorHasTitleSuffix: "(Kaldırmak için ✕ butonuna tıklayın)",
    exportBtn: "📥 JSON İndir",
    exportBtnTitle: "Mevcut ders planınızı ve notlarınızı JSON dosyası olarak indirin",
    importBtn: "📤 JSON Yükle",
    importBtnTitle: "Daha önce indirdiğiniz JSON planını yükleyin",
    feedbackBtn: "💬 Hata / Öneri",
    feedbackBtnTitle: "Hata Bildir veya Öneri Paylaş",
    supportBtn: "☕ Destek Ol",
    supportBtnTitle: "Projeye Destek Ol",
    toastSupportSoon: "☕ Destek bağlantısı yakında eklenecek!",
    resetBtn: "Sıfırla",
    resetBtnTitle: "Bölüm planını sıfırla",
    tabPool: "📋 Ders Havuzu",
    tabSemesters: "📅 Dönemler & Plan",
    remainingTotal: "Kalan / Toplam",
    selectedCourses: "Seçilen Ders",
    selectedCredits: "Seçilen Kredi",
    completed: "Tamamlanan",
    targetCredits: "Hedef Kredi",
    courseUnit: "Ders",
    coursePool: "Ders Havuzu",
    termBlocks: "Dönem Blokları",
    termPrefix: "Dönem",
    summerLabel: "Yaz",
    notTaken: "• Alınmadı",
    passedStatus: "🔒 Verildi",
    failedStatus: "✕ Verilmedi",
    plannedStatus: "• Döneme Eklendi",
    passedCheck: "Verdim",
    completedBadge: "✓ Geçildi",
    repeatBadge: "🔁 Tekrar",
    minorBadge: "🎓 Yandal",
    openCoursePage: "🔗 Ders Sayfasını Aç",
    coursePageTooltip: "için Boğaziçi BUIS ders arama sayfası (yeni sekmede açılır)",
    addToTermPlaceholder: "➕ Döneme Ekle...",
    addToTermBtn: "➕ Döneme Ekle",
    selectTermPrompt: "Eklemek istediğiniz dönemi seçin",
    mobileMenuTitle: "Araçlar",
    electiveInputPlaceholder: "Seçilen Ders Adı/Kodu...",
    gradeTooltip: "Harf Notu",
    removeMinorCourseTitle: "Bu yandal dersini kaldır",
    removeFromTermTitle: "Bu dönemden kaldır",
    otherFaculties: "Diğer Fakülteler",
    otherPrograms: "Diğer Lisans Programları",
    remainingTooltip: (rem, tot) => `Kalan: ${rem} Ders, Toplam: ${tot} Ders`,
    toastAddedToTerm: (code, semLabel) => `✓ ${code} → ${semLabel} eklendi`,
    toastExportSuccess: "✓ Plan başarıyla JSON olarak indirildi!",
    toastImportSuccess: "✓ Plan başarıyla yüklendi!",
    toastMinorApplied: (name, count) => `✓ ${name} seçildi (${count} ders). Dersler sol paneldeki ilgili dönem bloklarına eklendi!`,
    toastMinorRemoved: "Yandal programı kaldırıldı.",
    toastFeedbackSuccess: "✓ Bildiriminiz başarıyla iletildi, teşekkürler!",
    confirmReset: (deptName) => `Yalnızca "${deptName}" bölümü planlamanız sıfırlanacak. Emin misiniz?`,
    confirmOverwriteImport: "Yüklemek istediğiniz plan mevcut planınızın üzerine yazılacak. Devam etmek istiyor musunuz?",
    confirmRemoveMinor: "Mevcut yandal programını ve dönemlerdeki yandal derslerini kaldırmak istediğinize emin misiniz?",
    alertExportError: "Dışa aktarma sırasında bir hata oluştu: ",
    alertImportError: "Hata: JSON dosyası yüklenemedi!\n",
    alertFileReadError: "Dosya okunamadı. Lütfen tekrar deneyin.",
    alertFeedbackRequired: "Lütfen başlık ve açıklama alanlarını eksiksiz doldurun.",
    alertFeedbackError: "Bildirim gönderilirken bir hata oluştu: ",
    tryAgain: "Lütfen tekrar deneyin.",
    serverError: "Sunucu hatası",
    errInvalidJson: "Dosya geçerli bir JSON formatında değil.",
    errEmptyData: "Geçersiz veya boş veri formatı.",
    errNoPlanFound: "JSON dosyasında geçerli bir ders planı veya dönem kaydı bulunamadı.",
    feedbackModalTitle: "💬 Hata / Öneri Bildir",
    feedbackTitleLabel: "Başlık",
    feedbackTitlePlaceholder: "Örn: CMPE 250 önkoşulu hatalı",
    feedbackCategoryLabel: "Kategori",
    feedbackCategories: {
      "Hatalı Ders/Önkoşul": "Hatalı Ders/Önkoşul",
      "Yeni Özellik Önerisi": "Yeni Özellik Önerisi",
      "Arayüz/Hesaplama Hatası": "Arayüz/Hesaplama Hatası",
      "Diğer": "Diğer"
    },
    feedbackDescLabel: "Açıklama",
    feedbackDescPlaceholder: "Detaylı açıklama...",
    cancel: "İptal",
    submit: "Gönder",
    submitting: "Gönderiliyor...",
    minorModalTitle: "🎓 Yandal Programı Seçimi",
    minorSelectLabel: "Yandal Programı Seçin",
    minorNoSelectionOption: "(Yandal Yok / İptal Et)",
    minorPreviewPlaceholder: "Lütfen incelemek istediğiniz bir yandal programı seçin.",
    minorPreviewRemoved: "(Yandal seçilmedi veya mevcut yandal iptal edilecek.)",
    minorTotalCourses: "Toplam Ders:",
    minorCredits: "Kredi:",
    minorAppGpa: "Başvuru GPA:",
    minorPrereq: "Önkoşul:",
    minorSampleDist: "Örnek Ders Dağılımı:",
    minorElectiveLabel: "Seçmeli",
    minorElectiveCourseSuffix: "Seçmeli Dersi",
    minorElectiveTag: "(Yandal Seçmeli)",
    minorPoolDefaultName: "Yandal Seçmeli Dersi",
    minorCancelBtn: "Vazgeç",
    minorApplyBtn: "Yandalı Uygula",
    dmBtn: "🎓 ÇAP Ekle",
    addDm: "🎓 ÇAP Ekle",
    dmBtnTitle: "Çift Anadal Programı (ÇAP) Seç / Düzenle",
    dmLabelPrefix: "ÇAP",
    dmActivePrefix: "🎓 ÇAP: ",
    dmRemoveTooltip: "ÇAP'ı Kaldır",
    dmHasTitleSuffix: "(Kaldırmak için ✕ butonuna tıklayın)",
    dmBadge: "🎓 ÇAP",
    removeDmCourseTitle: "Bu ÇAP dersini kaldır",
    confirmRemoveDm: "Mevcut ÇAP programını ve eklenen ÇAP derslerini kaldırmak istediğinize emin misiniz?",
    dmRemoveConfirm: "Seçili ÇAP programını kaldırmak istediğinize emin misiniz? (Dönemlere eklediğiniz dersler korunacaktır.)",
    toastDmApplied: (name, count) => `✓ ${name} seçildi (${count} ders). Ek ÇAP dersleri sol paneldeki ilgili dönem bloklarına eklendi!`,
    toastDmRemoved: "ÇAP programı kaldırıldı.",
    dmModalTitle: "🎓 Çift Anadal Programı (ÇAP) Seç",
    dmDataNotice: "ℹ️ Bilgi: Mevcut veri eksikliği nedeniyle bazı bölümlerin ÇAP programları sisteme henüz yüklenmemiştir. Aradığınız ÇAP programını listede göremiyorsanız \"Hata / Öneri Bildir\" üzerinden bize iletebilirsiniz.",
    dmSelectLabel: "İkinci Anadal Programı:",
    dmSelectPlaceholder: "-- ÇAP Programı Seçiniz --",
    dmNoSelectionOption: "-- ÇAP Programı Seçiniz --",
    dmPreviewPlaceholder: "Lütfen incelemek istediğiniz bir ÇAP programı seçin.",
    dmPreviewRemoved: "(ÇAP seçilmedi veya mevcut ÇAP iptal edilecek.)",
    dmNoAvailable: "Bu bölüm için ÇAP müfredat verisi yakında eklenecektir.",
    dmNoPrograms: "Bu bölüm için ÇAP müfredat verisi yakında eklenecektir.",
    dmMinGpa: "Taban GNO:",
    dmBaseGpa: "Taban GNO:",
    dmMinExtraCredits: "Minimum Ek Kredi:",
    dmExtraCredits: "Minimum Ek Kredi:",
    dmTotalCredits: "Toplam Mezuniyet Kredisi:",
    dmCancelBtn: "İptal",
    dmApplyBtn: "ÇAP Müfredatını Uygula",
    semGroupLabels: {
      '1.1': '1. Dönem (1. Yıl Güz)',
      '1.2': '2. Dönem (1. Yıl Bahar)',
      '2.1': '3. Dönem (2. Yıl Güz)',
      '2.2': '4. Dönem (2. Yıl Bahar)',
      '3.1': '5. Dönem (3. Yıl Güz)',
      '3.2': '6. Dönem (3. Yıl Bahar)',
      '4.1': '7. Dönem (4. Yıl Güz)',
      '4.2': '8. Dönem (4. Yıl Bahar)',
      'other': 'Diğer / Genel Seçmeliler'
    },
    yearLabels: {
      '0. Yıl (Hazırlık / Erken Dönem)': '0. Yıl (Hazırlık / Erken Dönem)',
      '1. Yıl': '1. Yıl',
      '2. Yıl': '2. Yıl',
      '3. Yıl': '3. Yıl',
      '4. Yıl (Normal Mezuniyet)': '4. Yıl (Normal Mezuniyet)',
      '5. Yıl (1. Uzatma)': '5. Yıl (1. Uzatma)',
      '6. Yıl (2. Uzatma)': '6. Yıl (2. Uzatma)',
      '7. Yıl (3. Uzatma)': '7. Yıl (3. Uzatma)',
      '7. Yıl (Azami Yasal Süre)': '7. Yıl (Azami Yasal Süre)',
      '8. Yıl (Azami Yasal Süre)': '8. Yıl (Azami Yasal Süre)'
    },
    limitTag: "YÖK Sınır",
    loadErrorTitle: "Müfredat Verisi Yüklenemedi!",
    loadErrorDesc: "<code>data/curriculum.json</code> dosyasının doğru konumda olduğundan ve sayfayı yerel bir sunucu (Live Server vb.) üzerinden açtığınızdan emin olun.",
    loadErrorDetail: "Hata detayı:",
    pinCardTitle: "Kartı Üste Sabitle",
    unpinCardTitle: "Sabitlemeyi Kaldır",
    shareBtn: "📤 Paylaş & Aktar",
    shareBtnTitle: "Planınızı paylaşın, görsel/JSON indirin veya transkript/yedek aktarın",
    shareModalTitle: "📤 Paylaş & Aktar",
    shareExportSectionTitle: "📤 Dışa Aktar & Paylaş",
    shareImportSectionTitle: "📥 İçe Aktar",
    sharePngBtn: "Görsel Olarak İndir (PNG)",
    sharePngDesc: "Dönemleri ve ders planınızı yüksek çözünürlüklü özet görseli olarak indirin.",
    shareLinkBtn: "Paylaşılabilir Plan Linki Kopyala",
    shareLinkDesc: "Arkadaşın kendi verileri bozulmadan planını önizleyebilir",
    shareJsonExportBtn: "Yedek İndir (JSON)",
    shareJsonExportDesc: "Tüm planınızı ve notlarınızı JSON yedek dosyası olarak kaydedin.",
    shareTranscriptBtn: "BÜ / e-Devlet Transkripti Aktar (PDF / Metin)",
    shareTranscriptDesc: "Transkript PDF dosyanızı yükleyin veya metni yapıştırarak derslerinizi otomatik aktarın.",
    shareJsonImportBtn: "Yedek Dosyası Yükle (JSON)",
    shareJsonImportDesc: "Daha önce indirdiğiniz JSON plan yedeğini geri yükleyin.",
    mobileCatalogTitle: "⊞ Uygulama Kataloğu",
    catSecAcademic: "Akademik Programlar",
    catSecSmart: "Akıllı Araçlar",
    catSecData: "Veri & Paylaşım",
    catSecSystem: "Sistem",
    catMinorTitle: "Yandal Ekle / Yönet",
    catMinorSubDefault: "Yandal programı seç",
    catDmTitle: "ÇAP Ekle / Yönet",
    catDmSubDefault: "Çift anadal seç",
    catPrereqTitle: "Önkoşul Ağacı",
    catPrereqSub: "Kilit zincirlerini gör",
    catAutoFillSub: "Dönemlere akıllı dağıt",
    catUndoTitle: "Doldurmayı Geri Al",
    catUndoSub: "Önceki plana dön",
    catTranscriptTitle: "Transkript Aktar (PDF)",
    catTranscriptSub: "e-Devlet / BUIS yükle",
    catPngTitle: "Görsel İndir (PNG)",
    catPngSub: "Planı resim kaydet",
    catLinkTitle: "Paylaşılabilir Plan Linki Kopyala",
    catLinkSub: "Arkadaşın kendi verileri bozulmadan planını önizleyebilir",
    catExportJsonTitle: "JSON İndir",
    catExportJsonSub: "Yedek dosyası al",
    catImportJsonTitle: "JSON Yükle",
    catImportJsonSub: "Yedeği geri yükle",
    catFeedbackTitle: "Hata / Öneri",
    catFeedbackSub: "Geri bildirim gönder",
    catResetTitle: "Planı Sıfırla",
    catResetSub: "Tüm dönemleri temizle",
    guideBtn: "❓ Rehber",
    guideBtnTitle: "Uygulama Rehberi ve Hızlı Başlangıç",
    catGuideTitle: "Rehber",
    catGuideSub: "İlk açılış kılavuzu",
    welcomeTitle: "👋 Boğaziçi Tracker'a Hoş Geldin!",
    welcomeSubtitle: "4 yıllık ders planını, GPA hedeflerini, Yandal ve ÇAP süreçlerini tek yerden yönet.",
    welcomeFeat1Title: "Sürükle-Bırak & GPA Takibi",
    welcomeFeat1Desc: "Dersleri dönemlere yerleştir, tahmini harf notlarıyla anlık dönem ve genel ortalamanı (GPA) hesapla.",
    welcomeFeat2Title: "Yandal & ÇAP Desteği",
    welcomeFeat2Desc: "Ana dalının yanına Yandal veya Çift Anadal ekle; ortak sayılan dersleri ve kalan kredileri otomatik gör.",
    welcomeFeat3Title: "PDF Transkript & Otomatik Doldur",
    welcomeFeat3Desc: "BÜ / e-Devlet transkriptini saniyeler içinde aktar veya kalan derslerini önkoşullara göre otomatik planla.",
    welcomeFeat4Title: "Önkoşul Ağacı & Güvenli Paylaşım",
    welcomeFeat4Desc: "Hangi dersin neleri kilitlediğini görselleştir; planını link, PNG veya JSON yedeği olarak paylaş.",
    welcomeWarningHtml: "<strong>Önemli Not:</strong> Müfredat ve önkoşul verileri bölüm sayfalarından derlenmiştir; dönemlik güncellemeler nedeniyle nadir de olsa farklılıklar bulunabilir. Eksik veya hatalı bir ders/önkoşul fark ederseniz <strong>Hata / Öneri Bildir</strong> butonundan bize iletebilirsiniz.",
    welcomeFeedbackBtn: "🐞 Hata / Öneri Bildir",
    welcomeStartBtn: "🚀 Planlamaya Başla",
    shareLinkCopied: "✅ Paylaşım linki panoya kopyalandı!",
    shareExporting: "Görsel hazırlanıyor...",
    shareExportSuccess: "✓ Görsel başarıyla indirildi!",
    shareExportError: "Görsel oluşturulurken bir hata oluştu.",
    shareLoadedSuccess: "✓ Paylaşılan ders planı başarıyla yüklendi!",
    shareLoadConfirm: "Paylaşılan ders planı yüklensin mi? Mevcut planınızın üzerine yazılacaktır.",
    shareCancelBtn: "Kapat",
    shareEmptyPlan: "Görsel oluşturmak için dönemlere en az bir ders eklemelisiniz.",
    plannedStatus: "Plan",
    sandboxBannerText: "👀 Önizleme Modu — Paylaşılan planı inceliyorsunuz; yaptığınız değişiklikler kaydedilmez.",
    sandboxSaveBtn: "💾 Kendi Planıma Aktar",
    sandboxExitBtn: "↩️ Kendi Planıma Dön",
    sandboxSaveConfirm: "Bu plan kendi kayıtlı planınızın üzerine yazılsın mı?",
    sandboxSavedSuccess: "✓ Plan başarıyla kendi tarayıcınıza kaydedildi!",
    sandboxExitSuccess: "✓ Kendi kayıtlı planınıza dönüldü.",
    sandboxDeptDisabledTooltip: "Önizleme modunda bölüm değiştirilemez.",
    transcriptBtn: "📥 Transkript Aktar",
    transcriptBtnTitle: "e-Devlet veya BUIS'ten kopyaladığınız transkripti otomatik aktarın",
    transcriptModalTitle: "📥 BÜ / e-Devlet Transkript Otomatik İçe Aktarıcı",
    transcriptGuide: "📌 <strong>e-Devlet</strong> (YÖKSİS Transkript Belgesi) veya <strong>BUIS</strong> transkript PDF dosyanızı yükleyin ya da sayfadaki tüm metni <code>Ctrl+A</code> ve <code>Ctrl+C</code> ile kopyalayıp aşağıdaki kutuya yapıştırın.",
    transcriptUploadTitle: "PDF Transkript Dosyasını Yükleyin",
    transcriptUploadSubtitle: "veya dosyayı buraya sürükleyip bırakın (e-Devlet / BUIS PDF)",
    transcriptUploadBtnText: "Dosya Seç",
    transcriptDividerText: "VEYA METİN OLARAK YAPIŞTIRIN",
    transcriptReadingPdf: "📄 PDF dosyası okunuyor ve ayrıştırılıyor...",
    transcriptPdfError: "PDF dosyası okunamadı. Lütfen geçerli bir transkript PDF dosyası yükleyin veya metni kopyalayıp yapıştırın.",
    transcriptInputLabel: "Transkript Metni:",
    transcriptInputPlaceholder: "e-Devlet Not Döküm Belgesi veya BUIS transkript metnini buraya yapıştırın...\nÖrn:\n2021-2022 Güz Dönemi\n*PHYS 121 GENERAL PHYSICS I\nZ İng. 3 2 4 6 BB 12 G\nCMPE150 INTRODUCTION TO COMPUTING\nZ İng. 3 0 3 5 BA 10.5 G...",
    transcriptPreviewBtn: "🔍 Önizle ve Ayrıştır",
    transcriptApplyBtn: "✅ Seçilenleri Plana Aktar",
    transcriptNoCoursesFound: "Transkript metninde ders bulunamadı. Lütfen e-Devlet veya BUIS transkript sayfasından kopyaladığınızdan emin olun.",
    transcriptSummary: (termsCount, coursesCount) => `🎯 ${termsCount} Dönem, ${coursesCount} Ders Başarıyla Ayrıştırıldı`,
    transcriptMatchedCurriculum: "Müfredat",
    transcriptMatchedElective: "Seçmeli Slotu",
    transcriptCustomCourse: "Yeni Seçmeli Ders Olarak Ekle",
    transcriptPassed: "Geçti",
    transcriptFailed: "Kaldı",
    transcriptApplyConfirm: "Mevcut planınızın üzerine aktarılsın mı? (Dönemlerdeki dersler transkript verileriyle güncellenecektir.)",
    transcriptAppliedSuccess: (count) => `✓ Transkript başarıyla aktarıldı! (${count} ders yerleştirildi)`,
    transcriptShiftDown: "◀ -1 Dönem Kaydır",
    transcriptShiftUp: "+1 Dönem Kaydır ▶",
    transcriptGroupShiftDown: "⬅️ -1 Dönem",
    transcriptGroupShiftUp: "+1 Dönem ➡️",
    transcriptTotalCredits: (crd) => `Toplam: ${crd} Cr`,
    transcriptTargetTerm: "Hedef",
    transcriptColCourse: "Ders",
    transcriptColTerm: "Dönem",
    transcriptColMatch: "Müfredat Eşleşmesi",
    transcriptColGrade: "Harf Notu",
    transcriptColStatus: "Verdim",
    transcriptColAction: "Sil",
    transcriptGradeNone: "-- (Not Yok)",
    transcriptNewElectiveOpt: "➕ Yeni Seçmeli Ders Olarak Ekle",
    erasmusBtn: "Erasmus",
    erasmusActive: "Erasmus",
    erasmusTag: "🇪🇺 Erasmus / Exchange",
    erasmusActiveTitle: "Erasmus/Exchange dönemini kaldır",
    erasmusInactiveTitle: "Bu dönemi Erasmus/Exchange dönemi olarak işaretle (Notlar EX sayılır, GPA etkilenmez)",
    prereqTreeBtn: "🕸️ Önkoşul Ağacı",
    prereqTreeBtnTitle: "Derslerin önkoşul ağacını ve kilit zincirlerini görüntüleyin",
    prereqTreeModalTitle: "🕸️ İnteraktif Önkoşul Ağacı",
    ptLegPassed: "Geçildi",
    ptLegPlanned: "Planlandı",
    ptLegPending: "Alınmadı",
    ptLegPrereq: "Önkoşul",
    ptLegUnlock: "Kilitlediği",
    ptInfoDefault: "💡 Bir ders kutusunun üzerine gelin veya tıklayın; önkoşullarını ve kilitlediği tüm zincirleme dersleri görün.",
    ptInfoLocked: (code, unlockCount, prereqCount) => unlockCount > 0
      ? `🔒 ${code} geçilmezse doğrudan/dolaylı ${unlockCount} ders kilitlenir (Önkoşul: ${prereqCount} ders)`
      : `✅ ${code} başka bir dersin önkoşulu değildir (Önkoşul: ${prereqCount} ders)`,
    ptOtherCol: "Diğer / Seçmeli",
    autoFillBtnEmpty: "⚡ Otomatik Doldur",
    autoFillBtnRemaining: "⚡ Kalanı Doldur",
    autoFillBtnTitle: "Kalan dersleri önkoşul sırasına göre dönemlere otomatik yerleştirin",
    undoAutoFillBtn: "↩️ Doldurmayı Geri Al",
    undoAutoFillBtnTitle: "Son otomatik doldurma işlemini geri al",
    autoFillModalTitle: "⚡ Kalan Dersleri Otomatik Doldur",
    autoFillDesc: "Mevcut geçtiğiniz ve dönemlere yerleştirdiğiniz dersler korunur; yalnızca sol havuzda kalan dersler önkoşul sırasına ve açılış dönemine göre gelecek dönemlere dağıtılır.",
    autoFillSummerLabel: "☀️ Yaz okullarına (1.3, 2.3, 3.3...) ders yerleştirilsin (Öncelik: TK, AE ve seçmeli dersler)",
    summerMaxCreditsLabel: "Yaz Maks. Kredi:",
    summerMaxCoursesLabel: "Yaz Maks. Ders:",
    summerMaxCoursesUnlimitedOpt: "Sınırsız (Krediye göre)",
    autoFillMaxCreditsLabel: "Dönemlik Maksimum Kredi Hedefi:",
    autoFillConfirmBtn: "⚡ Otomatik Doldur",
    autoFillSuccess: (count) => `⚡ ${count} kalan ders önkoşul sırasına göre dönemlere yerleştirildi!`,
    autoFillNoneLeft: "✓ Havuzda yerleştirilecek kalan ders bulunmuyor.",
    autoFillUndone: "↩️ Otomatik doldurma geri alındı; önceki planınız yüklendi."
  },
  en: {
    appSubtitle: "| Course & GPA Tracker",
    deptLabel: "Department:",
    addMinor: "🎓 Add Minor",
    minorBtnTitle: "Select / Edit Minor Program",
    minorLabelPrefix: "Minor",
    minorRemoveTooltip: "Remove Minor",
    minorHasTitleSuffix: "(Click ✕ to remove)",
    exportBtn: "📥 Export JSON",
    exportBtnTitle: "Download your current course plan and grades as a JSON file",
    importBtn: "📤 Import JSON",
    importBtnTitle: "Load a previously exported JSON plan",
    feedbackBtn: "💬 Feedback",
    feedbackBtnTitle: "Report an Issue or Share Feedback",
    supportBtn: "☕ Support",
    supportBtnTitle: "Support the Project",
    toastSupportSoon: "☕ Support link coming soon!",
    resetBtn: "Reset",
    resetBtnTitle: "Reset department plan",
    tabPool: "📋 Course Pool",
    tabSemesters: "📅 Semesters & Plan",
    remainingTotal: "Remaining / Total",
    selectedCourses: "Selected Courses",
    selectedCredits: "Selected Credits",
    completed: "Completed",
    targetCredits: "Target Credits",
    courseUnit: "Courses",
    coursePool: "Course Pool",
    termBlocks: "Term Blocks",
    termPrefix: "Term",
    summerLabel: "Summer",
    notTaken: "• Not Taken",
    passedStatus: "🔒 Passed",
    failedStatus: "✕ Failed",
    plannedStatus: "• Planned",
    passedCheck: "Passed",
    completedBadge: "✓ Completed",
    repeatBadge: "🔁 Repeat",
    minorBadge: "🎓 Minor",
    openCoursePage: "🔗 Open Course Page",
    coursePageTooltip: "Boğaziçi BUIS course search page (opens in new tab)",
    addToTermPlaceholder: "➕ Add to Term...",
    addToTermBtn: "➕ Add to Term",
    selectTermPrompt: "Select a term to add",
    mobileMenuTitle: "Tools",
    electiveInputPlaceholder: "Selected Course Name/Code...",
    gradeTooltip: "Letter Grade",
    removeMinorCourseTitle: "Remove this minor course",
    removeFromTermTitle: "Remove from this term",
    otherFaculties: "Other Faculties",
    otherPrograms: "Other Undergraduate Programs",
    remainingTooltip: (rem, tot) => `Remaining: ${rem} Courses, Total: ${tot} Courses`,
    toastAddedToTerm: (code, semLabel) => `✓ ${code} → Added to ${semLabel}`,
    toastExportSuccess: "✓ Plan successfully exported as JSON!",
    toastImportSuccess: "✓ Plan successfully imported!",
    toastMinorApplied: (name, count) => `✓ ${name} selected (${count} courses). Courses added to the corresponding term blocks on the left!`,
    toastMinorRemoved: "Minor program removed.",
    toastFeedbackSuccess: "✓ Your feedback has been submitted, thank you!",
    confirmReset: (deptName) => `Only your "${deptName}" department plan will be reset. Are you sure?`,
    confirmOverwriteImport: "The plan you are importing will overwrite your current plan. Do you want to continue?",
    confirmRemoveMinor: "Are you sure you want to remove the current minor program and its courses from your terms?",
    alertExportError: "An error occurred while exporting: ",
    alertImportError: "Error: Could not import JSON file!\n",
    alertFileReadError: "Could not read file. Please try again.",
    alertFeedbackRequired: "Please fill in both title and description fields.",
    alertFeedbackError: "An error occurred while submitting feedback: ",
    tryAgain: "Please try again.",
    serverError: "Server error",
    errInvalidJson: "The file is not in valid JSON format.",
    errEmptyData: "Invalid or empty data format.",
    errNoPlanFound: "No valid course plan or term records found in the JSON file.",
    feedbackModalTitle: "💬 Report Issue / Feedback",
    feedbackTitleLabel: "Title",
    feedbackTitlePlaceholder: "e.g., CMPE 250 prerequisite is incorrect",
    feedbackCategoryLabel: "Category",
    feedbackCategories: {
      "Hatalı Ders/Önkoşul": "Course / Prerequisite Error",
      "Yeni Özellik Önerisi": "Feature Request",
      "Arayüz/Hesaplama Hatası": "UI / Calculation Bug",
      "Diğer": "Other"
    },
    feedbackDescLabel: "Description",
    feedbackDescPlaceholder: "Detailed description...",
    cancel: "Cancel",
    submit: "Submit",
    submitting: "Submitting...",
    minorModalTitle: "🎓 Minor Program Selection",
    minorSelectLabel: "Select Minor Program",
    minorNoSelectionOption: "(No Minor / Remove)",
    minorPreviewPlaceholder: "Please select a minor program to preview.",
    minorPreviewRemoved: "(No minor selected or current minor will be removed.)",
    minorTotalCourses: "Total Courses:",
    minorCredits: "Credits:",
    minorAppGpa: "Min. Application GPA:",
    minorPrereq: "Prerequisites:",
    minorSampleDist: "Sample Course Distribution:",
    minorElectiveLabel: "Elective",
    minorElectiveCourseSuffix: "Elective Course",
    minorElectiveTag: "(Minor Elective)",
    minorPoolDefaultName: "Minor Elective Course",
    minorCancelBtn: "Cancel",
    minorApplyBtn: "Apply Minor",
    addDm: "🎓 Add Double Major",
    dmBtn: "🎓 Add Double Major",
    dmBtnTitle: "Select / Edit Double Major (ÇAP) Program",
    dmLabelPrefix: "DM",
    dmActivePrefix: "🎓 DM: ",
    dmRemoveTooltip: "Remove Double Major",
    dmHasTitleSuffix: "(Click ✕ to remove)",
    dmBadge: "🎓 Double Major",
    removeDmCourseTitle: "Remove this double major course",
    confirmRemoveDm: "Are you sure you want to remove the selected Double Major? (Courses already placed in terms will be preserved.)",
    dmRemoveConfirm: "Are you sure you want to remove the selected Double Major? (Courses already placed in terms will be preserved.)",
    toastDmApplied: (name, count) => `✓ ${name} selected (${count} courses). Extra DM courses added to course pool!`,
    toastDmRemoved: "Double Major program removed.",
    dmModalTitle: "🎓 Select Double Major Program",
    dmDataNotice: "ℹ️ Note: Due to incomplete curriculum data, Double Major (DM) programs for some departments have not been uploaded yet. If you cannot find your target DM program, please let us know via \"Report Bug / Suggestion\".",
    dmSelectLabel: "Second Major Program:",
    dmSelectPlaceholder: "-- Select Double Major Program --",
    dmNoSelectionOption: "-- Select Double Major Program --",
    dmPreviewPlaceholder: "Please select a double major program to preview.",
    dmPreviewRemoved: "(No double major selected or current program will be removed.)",
    dmNoAvailable: "Double major curriculum data for this department will be added soon.",
    dmNoPrograms: "Double major curriculum data for this department will be added soon.",
    dmMinGpa: "Min. GPA:",
    dmBaseGpa: "Min. GPA:",
    dmMinExtraCredits: "Min. Extra Credits:",
    dmExtraCredits: "Min. Extra Credits:",
    dmTotalCredits: "Total Graduation Credits:",
    dmCancelBtn: "Cancel",
    dmApplyBtn: "Apply Double Major",
    semGroupLabels: {
      '1.1': 'Term 1 (Year 1 Fall)',
      '1.2': 'Term 2 (Year 1 Spring)',
      '2.1': 'Term 3 (Year 2 Fall)',
      '2.2': 'Term 4 (Year 2 Spring)',
      '3.1': 'Term 5 (Year 3 Fall)',
      '3.2': 'Term 6 (Year 3 Spring)',
      '4.1': 'Term 7 (Year 4 Fall)',
      '4.2': 'Term 8 (Year 4 Spring)',
      'other': 'Other / General Electives'
    },
    yearLabels: {
      '0. Yıl (Hazırlık / Erken Dönem)': 'Year 0 (Prep / Early Term)',
      '1. Yıl': 'Year 1',
      '2. Yıl': 'Year 2',
      '3. Yıl': 'Year 3',
      '4. Yıl (Normal Mezuniyet)': 'Year 4 (Regular Graduation)',
      '5. Yıl (1. Uzatma)': 'Year 5 (Extension 1)',
      '6. Yıl (2. Uzatma)': 'Year 6 (Extension 2)',
      '7. Yıl (3. Uzatma)': 'Year 7 (Extension 3)',
      '7. Yıl (Azami Yasal Süre)': 'Year 7 (Max Legal Duration)',
      '8. Yıl (Azami Yasal Süre)': 'Year 8 (Max Legal Limit)'
    },
    limitTag: "YÖK Limit",
    loadErrorTitle: "Failed to Load Curriculum Data!",
    loadErrorDesc: "Make sure <code>data/curriculum.json</code> is in place and that you are serving the page over a local HTTP server (e.g., Live Server).",
    loadErrorDetail: "Error details:",
    pinCardTitle: "Pin Card",
    unpinCardTitle: "Unpin Card",
    shareBtn: "📤 Share & Import",
    shareBtnTitle: "Share your plan, export PNG/JSON, or import transcript/backup",
    shareModalTitle: "📤 Share & Import",
    shareExportSectionTitle: "📤 Export & Share",
    shareImportSectionTitle: "📥 Import",
    sharePngBtn: "Download as Image (PNG)",
    sharePngDesc: "Download your semesters and course plan as a clean, high-resolution summary image.",
    shareLinkBtn: "Copy Shareable Plan Link",
    shareLinkDesc: "Friends can preview your plan without affecting their own data",
    shareJsonExportBtn: "Download Backup (JSON)",
    shareJsonExportDesc: "Save your full course plan and grades as a JSON backup file.",
    shareTranscriptBtn: "Import BOUN / e-Devlet Transcript (PDF / Text)",
    shareTranscriptDesc: "Upload your transcript PDF or paste text to auto-import your courses.",
    shareJsonImportBtn: "Upload Backup File (JSON)",
    shareJsonImportDesc: "Restore a previously downloaded JSON plan backup.",
    mobileCatalogTitle: "⊞ App Catalog",
    catSecAcademic: "Academic Programs",
    catSecSmart: "Smart Tools",
    catSecData: "Data & Sharing",
    catSecSystem: "System",
    catMinorTitle: "Add / Manage Minor",
    catMinorSubDefault: "Select a minor program",
    catDmTitle: "Add / Manage Double Major",
    catDmSubDefault: "Select double major",
    catPrereqTitle: "Prereq Tree",
    catPrereqSub: "View unlock chains",
    catAutoFillSub: "Smart term scheduling",
    catUndoTitle: "Undo Auto-Fill",
    catUndoSub: "Restore previous plan",
    catTranscriptTitle: "Import Transcript (PDF)",
    catTranscriptSub: "Upload e-Devlet / BUIS",
    catPngTitle: "Download Image (PNG)",
    catPngSub: "Save plan as image",
    catLinkTitle: "Copy Shareable Plan Link",
    catLinkSub: "Friends can preview your plan without affecting their own data",
    catExportJsonTitle: "Download JSON",
    catExportJsonSub: "Export backup file",
    catImportJsonTitle: "Upload JSON",
    catImportJsonSub: "Restore from backup",
    catFeedbackTitle: "Bug / Feedback",
    catFeedbackSub: "Send us feedback",
    catResetTitle: "Reset Plan",
    catResetSub: "Clear all semesters",
    guideBtn: "❓ Guide",
    guideBtnTitle: "App Guide & Quick Start",
    catGuideTitle: "Guide",
    catGuideSub: "Quick start walkthrough",
    welcomeTitle: "👋 Welcome to Boğaziçi Tracker!",
    welcomeSubtitle: "Manage your 4-year course plan, GPA goals, Minor, and Double Major paths in one place.",
    welcomeFeat1Title: "Drag-Drop & GPA Tracking",
    welcomeFeat1Desc: "Place courses into semesters and calculate your live semester & cumulative GPA with estimated letter grades.",
    welcomeFeat2Title: "Minor & Double Major Support",
    welcomeFeat2Desc: "Add a Minor or Double Major alongside your major; automatically track shared courses and remaining credits.",
    welcomeFeat3Title: "PDF Transcript & Auto-Fill",
    welcomeFeat3Desc: "Import your BU / e-Devlet transcript in seconds or auto-plan remaining courses respecting prerequisites.",
    welcomeFeat4Title: "Prereq Tree & Safe Sharing",
    welcomeFeat4Desc: "Visualize which courses unlock others; share your plan via link, PNG export, or JSON backup.",
    welcomeWarningHtml: "<strong>Important Note:</strong> Curriculum and prerequisite data are compiled from department pages; minor differences may rarely occur due to semesterly updates. If you spot a missing or incorrect course/prerequisite, let us know via the <strong>Report Bug / Suggestion</strong> button.",
    welcomeFeedbackBtn: "🐞 Report Bug / Suggestion",
    welcomeStartBtn: "🚀 Start Planning",
    shareLinkCopied: "✅ Share link copied to clipboard!",
    shareExporting: "Generating image...",
    shareExportSuccess: "✓ Image downloaded successfully!",
    shareExportError: "An error occurred while generating the image.",
    shareLoadedSuccess: "✓ Shared course plan loaded successfully!",
    shareLoadConfirm: "Load the shared course plan? Your current plan for this department will be overwritten.",
    shareCancelBtn: "Close",
    shareEmptyPlan: "You need to add at least one course to semesters to generate an image.",
    plannedStatus: "Planned",
    sandboxBannerText: "👀 Preview Mode — Viewing a shared plan; changes you make are not saved.",
    sandboxSaveBtn: "💾 Save to My Plan",
    sandboxExitBtn: "↩️ Return to My Plan",
    sandboxSaveConfirm: "Do you want to overwrite your saved plan with this one?",
    sandboxSavedSuccess: "✓ Plan saved to your browser successfully!",
    sandboxExitSuccess: "✓ Returned to your saved plan.",
    sandboxDeptDisabledTooltip: "Department cannot be changed in Preview mode.",
    transcriptBtn: "📥 Import Transcript",
    transcriptBtnTitle: "Import your transcript copied from e-Devlet or BUIS automatically",
    transcriptModalTitle: "📥 BOUN / e-Devlet Transcript Auto Importer",
    transcriptGuide: "📌 Upload your <strong>e-Devlet</strong> (YÖKSİS Transcript) or <strong>BUIS</strong> transcript PDF, or copy the whole page text with <code>Ctrl+A</code> and <code>Ctrl+C</code> and paste below.",
    transcriptUploadTitle: "Upload PDF Transcript File",
    transcriptUploadSubtitle: "or drag and drop file here (e-Devlet / BUIS PDF)",
    transcriptUploadBtnText: "Choose File",
    transcriptDividerText: "OR PASTE AS TEXT",
    transcriptReadingPdf: "📄 Reading and parsing PDF file...",
    transcriptPdfError: "Failed to read PDF file. Please upload a valid transcript PDF or copy-paste text.",
    transcriptInputLabel: "Transcript Text:",
    transcriptInputPlaceholder: "Paste e-Devlet Transcript or BUIS transcript text here...\nEx:\n2021-2022 Güz Dönemi\n*PHYS 121 GENERAL PHYSICS I\nZ İng. 3 2 4 6 BB 12 G\nCMPE150 INTRODUCTION TO COMPUTING\nZ İng. 3 0 3 5 BA 10.5 G...",
    transcriptPreviewBtn: "🔍 Preview & Parse",
    transcriptApplyBtn: "✅ Apply Selected to Plan",
    transcriptNoCoursesFound: "No courses detected in transcript text. Please make sure you copied from e-Devlet or BUIS transcript page.",
    transcriptSummary: (termsCount, coursesCount) => `🎯 ${termsCount} Terms, ${coursesCount} Courses Successfully Parsed`,
    transcriptMatchedCurriculum: "Curriculum",
    transcriptMatchedElective: "Elective Slot",
    transcriptCustomCourse: "Add as New Elective Course",
    transcriptPassed: "Passed",
    transcriptFailed: "Failed",
    transcriptApplyConfirm: "Apply transcript to current plan? (Courses will be updated with transcript data.)",
    transcriptAppliedSuccess: (count) => `✓ Transcript successfully imported! (${count} courses placed)`,
    transcriptShiftDown: "◀ Shift -1 Term",
    transcriptShiftUp: "Shift +1 Term ▶",
    transcriptGroupShiftDown: "⬅️ -1 Term",
    transcriptGroupShiftUp: "+1 Term ➡️",
    transcriptTotalCredits: (crd) => `Total: ${crd} Cr`,
    transcriptTargetTerm: "Target",
    transcriptColCourse: "Course",
    transcriptColTerm: "Semester",
    transcriptColMatch: "Curriculum Match",
    transcriptColGrade: "Grade",
    transcriptColStatus: "Passed",
    transcriptColAction: "Remove",
    transcriptGradeNone: "-- (No Grade)",
    transcriptNewElectiveOpt: "➕ Add as New Elective Course",
    erasmusBtn: "Erasmus",
    erasmusActive: "Erasmus",
    erasmusTag: "🇪🇺 Erasmus / Exchange",
    erasmusActiveTitle: "Remove Erasmus/Exchange semester",
    erasmusInactiveTitle: "Mark as Erasmus/Exchange semester (Grades count as EX, GPA unaffected)",
    prereqTreeBtn: "🕸️ Prereq Tree",
    prereqTreeBtnTitle: "View the prerequisite graph and unlock chains for all courses",
    prereqTreeModalTitle: "🕸️ Interactive Prerequisite Tree",
    ptLegPassed: "Passed",
    ptLegPlanned: "Planned",
    ptLegPending: "Pending",
    ptLegPrereq: "Prerequisite",
    ptLegUnlock: "Unlocks",
    ptInfoDefault: "💡 Hover or click any course node to highlight its prerequisites and all chained courses it unlocks.",
    ptInfoLocked: (code, unlockCount, prereqCount) => unlockCount > 0
      ? `🔒 If ${code} is not passed, ${unlockCount} course(s) are directly/indirectly locked (Prerequisites: ${prereqCount})`
      : `✅ ${code} is not a prerequisite for any other course (Prerequisites: ${prereqCount})`,
    ptOtherCol: "Other / Electives",
    autoFillBtnEmpty: "⚡ Auto-Fill Plan",
    autoFillBtnRemaining: "⚡ Fill Remaining",
    autoFillBtnTitle: "Automatically distribute remaining courses across future semesters",
    undoAutoFillBtn: "↩️ Undo Fill",
    undoAutoFillBtnTitle: "Undo the last auto-fill operation",
    autoFillModalTitle: "⚡ Auto-Fill Remaining Courses",
    autoFillDesc: "Your passed and already planned courses stay untouched; only remaining courses in the left pool are scheduled into future terms respecting prerequisites and term parity.",
    autoFillSummerLabel: "☀️ Place courses in Summer terms (1.3, 2.3, 3.3...) (Priority: TK, AE & electives)",
    summerMaxCreditsLabel: "Summer Max Credits:",
    summerMaxCoursesLabel: "Summer Max Courses:",
    summerMaxCoursesUnlimitedOpt: "Unlimited (By credits)",
    autoFillMaxCreditsLabel: "Target Max Credits per Semester:",
    autoFillConfirmBtn: "⚡ Auto-Fill",
    autoFillSuccess: (count) => `⚡ ${count} remaining course(s) automatically placed into semesters!`,
    autoFillNoneLeft: "✓ No remaining courses left in the pool to place.",
    autoFillUndone: "↩️ Auto-fill undone; your previous plan has been restored."
  }
};

function t(key) {
  return translations[currentLang][key] ?? translations.tr[key] ?? key;
}

function formatSemLabel(semId) {
  const displaySem = currentLang === 'en'
    ? String(semId).replace('(Yaz)', `(${t('summerLabel')})`)
    : String(semId);
  return `${t('termPrefix')} ${displaySem}`;
}

function translatePrereq(prereqStr) {
  if (!prereqStr || currentLang === 'tr') return prereqStr;
  return String(prereqStr)
    .replace(/Önkoşul:/g, 'Prerequisite:')
    .replace(/Eş koşul:/g, 'Corequisite:')
    .replace(/Hoca Onayı/g, 'Instructor Consent')
    .replace(/Son Sınıf Şartı/g, 'Senior Standing')
    .replace(/İngilizce Yeterlilik \(BUEPT\)/g, 'English Proficiency (BUEPT)')
    .replace(/ veya /g, ' or ')
    .replace(/ ve /g, ' and ');
}

function applyStaticTranslations() {
  document.documentElement.lang = currentLang;

  const setText = (id, text) => {
    const el = document.getElementById(id);
    if (el) el.innerText = text;
  };
  const setAttr = (id, attr, val) => {
    const el = document.getElementById(id);
    if (el) el.setAttribute(attr, val);
  };

  setText('appSubtitle', t('appSubtitle'));
  setText('deptLabel', t('deptLabel'));
  setText('feedbackBtn', t('feedbackBtn'));
  setAttr('feedbackBtn', 'title', t('feedbackBtnTitle'));
  setText('shareBtn', t('shareBtn'));
  setAttr('shareBtn', 'title', t('shareBtnTitle'));
  setText('supportBtn', t('supportBtn'));
  setAttr('supportBtn', 'title', t('supportBtnTitle'));
  setText('resetBtn', t('resetBtn'));
  setAttr('resetBtn', 'title', t('resetBtnTitle'));

  const langHtml = currentLang === 'tr'
    ? '<span class="lang-active">TR</span> <span class="lang-muted">| EN</span>'
    : '<span class="lang-muted">TR |</span> <span class="lang-active">EN</span>';
  const langLabel = document.getElementById('langToggleLabel');
  if (langLabel) langLabel.innerHTML = langHtml;
  const mobileLangLabel = document.getElementById('mobileLangToggleLabel');
  if (mobileLangLabel) mobileLangLabel.innerHTML = langHtml;
  setAttr('mobileMenuBtn', 'title', t('mobileMenuTitle'));
  setText('termPickerSubtitle', t('selectTermPrompt'));

  setText('tabBtnPool', t('tabPool'));
  setText('tabBtnSemesters', t('tabSemesters'));
  setText('labelRemainingTotal', t('remainingTotal'));
  setText('labelSelectedCourses', t('selectedCourses'));
  setText('labelSelectedCredits', t('selectedCredits'));
  setText('labelCompleted', t('completed'));
  setText('labelTargetCredits', t('targetCredits'));
  setText('sidebarPoolSubtitle', t('termBlocks'));

  setText('feedbackModalTitle', t('feedbackModalTitle'));
  setText('feedbackTitleLabel', t('feedbackTitleLabel'));
  setAttr('feedbackTitle', 'placeholder', t('feedbackTitlePlaceholder'));
  setText('feedbackCategoryLabel', t('feedbackCategoryLabel'));
  setText('feedbackDescLabel', t('feedbackDescLabel'));
  setAttr('feedbackDesc', 'placeholder', t('feedbackDescPlaceholder'));
  setText('feedbackCancelBtn', t('cancel'));
  const fbSubmitBtn = document.getElementById('feedbackSubmitBtn');
  if (fbSubmitBtn && !fbSubmitBtn.disabled) {
    fbSubmitBtn.innerHTML = `<span>${escapeHTML(t('submit'))}</span>`;
  }
  const catSelect = document.getElementById('feedbackCategory');
  if (catSelect) {
    const catMap = t('feedbackCategories');
    Array.from(catSelect.options).forEach(opt => {
      if (catMap[opt.value]) opt.textContent = catMap[opt.value];
    });
  }

  setText('minorModalTitle', t('minorModalTitle'));
  setText('minorSelectLabel', t('minorSelectLabel'));
  setText('minorCancelBtn', t('minorCancelBtn'));
  const minorApplyBtn = document.getElementById('minorApplyBtn');
  if (minorApplyBtn) {
    minorApplyBtn.innerHTML = `<span>${escapeHTML(t('minorApplyBtn'))}</span>`;
  }

  setText('dmModalTitle', t('dmModalTitle'));
  setText('dmDataNotice', t('dmDataNotice'));
  setText('dmSelectLabel', t('dmSelectLabel'));
  setText('dmCancelBtn', t('dmCancelBtn'));
  const dmApplyBtn = document.getElementById('dmApplyBtn');
  if (dmApplyBtn) {
    dmApplyBtn.innerHTML = `<span>${escapeHTML(t('dmApplyBtn'))}</span>`;
  }

  setText('shareModalTitle', t('shareModalTitle'));
  setText('shareExportSectionTitle', t('shareExportSectionTitle'));
  setText('shareImportSectionTitle', t('shareImportSectionTitle'));
  setText('sharePngBtn', t('sharePngBtn'));
  setText('sharePngDesc', t('sharePngDesc'));
  setText('shareLinkBtn', t('shareLinkBtn'));
  setText('shareLinkDesc', t('shareLinkDesc'));
  setText('shareJsonExportBtn', t('shareJsonExportBtn'));
  setText('shareJsonExportDesc', t('shareJsonExportDesc'));
  setText('shareTranscriptBtn', t('shareTranscriptBtn'));
  setText('shareTranscriptDesc', t('shareTranscriptDesc'));
  setText('shareJsonImportBtn', t('shareJsonImportBtn'));
  setText('shareJsonImportDesc', t('shareJsonImportDesc'));
  setText('shareCancelBtn', t('shareCancelBtn'));

  setText('mobileCatalogTitle', t('mobileCatalogTitle'));
  setText('catSecAcademic', t('catSecAcademic'));
  setText('catSecSmart', t('catSecSmart'));
  setText('catSecData', t('catSecData'));
  setText('catSecSystem', t('catSecSystem'));
  setText('catMinorTitle', t('catMinorTitle'));
  setText('catDmTitle', t('catDmTitle'));
  setText('catPrereqTitle', t('catPrereqTitle'));
  setText('catPrereqSub', t('catPrereqSub'));
  setText('catAutoFillSub', t('catAutoFillSub'));
  setText('catUndoTitle', t('catUndoTitle'));
  setText('catUndoSub', t('catUndoSub'));
  setText('catTranscriptTitle', t('catTranscriptTitle'));
  setText('catTranscriptSub', t('catTranscriptSub'));
  setText('catPngTitle', t('catPngTitle'));
  setText('catPngSub', t('catPngSub'));
  setText('catLinkTitle', t('catLinkTitle'));
  setText('catLinkSub', t('catLinkSub'));
  setText('catExportJsonTitle', t('catExportJsonTitle'));
  setText('catExportJsonSub', t('catExportJsonSub'));
  setText('catImportJsonTitle', t('catImportJsonTitle'));
  setText('catImportJsonSub', t('catImportJsonSub'));
  setText('catFeedbackTitle', t('catFeedbackTitle'));
  setText('catFeedbackSub', t('catFeedbackSub'));
  setText('catResetTitle', t('catResetTitle'));
  setText('catResetSub', t('catResetSub'));

  setText('guideBtn', t('guideBtn'));
  setAttr('guideBtn', 'title', t('guideBtnTitle'));
  setText('catGuideTitle', t('catGuideTitle'));
  setText('catGuideSub', t('catGuideSub'));
  setText('welcomeTitle', t('welcomeTitle'));
  setText('welcomeSubtitle', t('welcomeSubtitle'));
  setText('welcomeFeat1Title', t('welcomeFeat1Title'));
  setText('welcomeFeat1Desc', t('welcomeFeat1Desc'));
  setText('welcomeFeat2Title', t('welcomeFeat2Title'));
  setText('welcomeFeat2Desc', t('welcomeFeat2Desc'));
  setText('welcomeFeat3Title', t('welcomeFeat3Title'));
  setText('welcomeFeat3Desc', t('welcomeFeat3Desc'));
  setText('welcomeFeat4Title', t('welcomeFeat4Title'));
  setText('welcomeFeat4Desc', t('welcomeFeat4Desc'));
  const welcomeWarningEl = document.getElementById('welcomeWarningText');
  if (welcomeWarningEl) welcomeWarningEl.innerHTML = t('welcomeWarningHtml');
  setText('welcomeFeedbackBtn', t('welcomeFeedbackBtn'));
  setText('welcomeStartBtn', t('welcomeStartBtn'));

  setText('prereqTreeBtn', t('prereqTreeBtn'));
  setAttr('prereqTreeBtn', 'title', t('prereqTreeBtnTitle'));
  updateAutoFillButtonLabel();
  setAttr('autoFillBtn', 'title', t('autoFillBtnTitle'));
  setAttr('undoAutoFillBtn', 'title', t('undoAutoFillBtnTitle'));
  setText('prereqTreeModalTitle', t('prereqTreeModalTitle'));
  setText('ptLegPassed', t('ptLegPassed'));
  setText('ptLegPlanned', t('ptLegPlanned'));
  setText('ptLegPending', t('ptLegPending'));
  setText('ptLegPrereq', t('ptLegPrereq'));
  setText('ptLegUnlock', t('ptLegUnlock'));
  if (!prereqTreeSelectedNodeId) {
    setText('prereqTreeInfoBar', t('ptInfoDefault'));
  }
  setText('autoFillModalTitle', t('autoFillModalTitle'));
  setText('autoFillDesc', t('autoFillDesc'));
  setText('autoFillSummerLabel', t('autoFillSummerLabel'));
  setText('summerMaxCreditsLabel', t('summerMaxCreditsLabel'));
  setText('summerMaxCoursesLabel', t('summerMaxCoursesLabel'));
  setText('summerMaxCoursesUnlimitedOpt', t('summerMaxCoursesUnlimitedOpt'));
  setText('autoFillMaxCreditsLabel', t('autoFillMaxCreditsLabel'));
  setText('autoFillCancelBtn', t('cancel'));
  const autoFillConfirmBtn = document.getElementById('autoFillConfirmBtn');
  if (autoFillConfirmBtn) {
    autoFillConfirmBtn.innerHTML = `<span>${escapeHTML(t('autoFillConfirmBtn'))}</span>`;
  }

  setText('transcriptModalTitle', t('transcriptModalTitle'));
  const trGuideEl = document.getElementById('transcriptGuide');
  if (trGuideEl) trGuideEl.innerHTML = t('transcriptGuide');
  setText('transcriptUploadTitle', t('transcriptUploadTitle'));
  setText('transcriptUploadSubtitle', t('transcriptUploadSubtitle'));
  setText('transcriptUploadBtnText', t('transcriptUploadBtnText'));
  setText('transcriptDividerText', t('transcriptDividerText'));
  setText('transcriptInputLabel', t('transcriptInputLabel'));
  setAttr('transcriptInput', 'placeholder', t('transcriptInputPlaceholder'));
  setText('transcriptPreviewBtn', t('transcriptPreviewBtn'));
  setText('transcriptCancelBtn', t('shareCancelBtn'));
  const trApplyBtn = document.getElementById('transcriptApplyBtn');
  if (trApplyBtn) {
    trApplyBtn.innerHTML = `<span>${escapeHTML(t('transcriptApplyBtn'))}</span>`;
  }

  updateMinorButtonUI();
  updateDmButtonUI();
  updatePinButtonUI();
  updateSandboxBannerUI();
}

function toggleLanguage() {
  currentLang = currentLang === 'tr' ? 'en' : 'tr';
  localStorage.setItem('boun_lang', currentLang);
  applyStaticTranslations();
  populateDepartmentSelect();
  populateMinorModalOptions();
  populateDmModalOptions();
  const minorSelect = document.getElementById('minorSelect');
  if (minorSelect) {
    const state = getDeptState(currentDept);
    minorSelect.value = state.selectedMinorId || '';
    handleMinorSelectChange(minorSelect.value);
  }
  const dmSelect = document.getElementById('dmSelect');
  if (dmSelect) {
    const state = getDeptState(currentDept);
    dmSelect.value = state.selectedDmId || '';
    handleDmSelectChange(dmSelect.value);
  }
  initUI();
}

function escapeHTML(str) {
  if (str === null || str === undefined) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

const BOUN_BOLUM_MAP = {
  PHYS: "PHYSICS",
  CHEM: "CHEMISTRY",
  MATH: "MATHEMATICS",
  BIO: "MOLECULAR+BIOLOGY+AND+GENETICS",
  CET: "COMPUTER+EDUCATION+AND+EDUCATIONAL+TECHNOLOGY",
  ED: "EDUCATIONAL+SCIENCES",
  PRED: "PRIMARY+EDUCATION",
  SCED: "MATHEMATICS+AND+SCIENCE+EDUCATION",
  FLED: "FOREIGN+LANGUAGE+EDUCATION",
  LAW: "LAW",
  EC: "ECONOMICS",
  AD: "MANAGEMENT",
  POLS: "POLITICAL+SCIENCE+AND+INTERNATIONAL+RELATIONS",
  TRM: "TOURISM+ADMINISTRATION",
  INTT: "INTERNATIONAL+TRADE",
  MIS: "MANAGEMENT+INFORMATION+SYSTEMS",
  CMPE: "COMPUTER+ENGINEERING",
  EE: "ELECTRICAL+AND+ELECTRONICS+ENGINEERING",
  IE: "INDUSTRIAL+ENGINEERING",
  CE: "CIVIL+ENGINEERING",
  CHE: "CHEMICAL+ENGINEERING",
  ME: "MECHANICAL+ENGINEERING",
  SOC: "SOCIOLOGY",
  PSY: "PSYCHOLOGY",
  HIST: "HISTORY",
  TKL: "TURKISH+LANGUAGE+AND+LITERATURE",
  TR: "TRANSLATION+AND+INTERPRETING+STUDIES",
  INT: "TRANSLATION+AND+INTERPRETING+STUDIES",
  LING: "LINGUISTICS",
  PHIL: "PHILOSOPHY",
  EL: "WESTERN+LANGUAGES+AND+LITERATURES",
  AL: "WESTERN+LANGUAGES+AND+LITERATURES",
  CL: "WESTERN+LANGUAGES+AND+LITERATURES",
  DRA: "WESTERN+LANGUAGES+AND+LITERATURES",
  ENGL: "WESTERN+LANGUAGES+AND+LITERATURES",
  HUM: "HUMANITIES+COURSES+COORDINATORSHIP",
  HTR: "ATATURK+INSTITUTE+FOR+MODERN+TURKISH+HISTORY",
  TK: "TURKISH+COURSES+COORDINATOR",
  AE: { bolum: "SCHOOL+OF+FOREIGN+LANGUAGES", kisaadi: "YADYOK" },
  ESC: "ENVIRONMENTAL+SCIENCES",
  ENGG: "ENGINEERING",
  OHS: "OCCUPATIONAL+HEALTH+AND+SAFETY",
  STS: "SCIENCE+TECHNOLOGY+AND+SOCIETY",
  TID: "TURKISH+SIGN+LANGUAGE",
  TKF: "TURKISH+COURSES+COORDINATOR",
  ARB: "MODERN+LANGUAGES+UNIT",
  ARM: "MODERN+LANGUAGES+UNIT",
  CHIN: "MODERN+LANGUAGES+UNIT",
  FR: "MODERN+LANGUAGES+UNIT",
  GER: "MODERN+LANGUAGES+UNIT",
  GR: "MODERN+LANGUAGES+UNIT",
  HUNG: "MODERN+LANGUAGES+UNIT",
  ITA: "MODERN+LANGUAGES+UNIT",
  JP: "MODERN+LANGUAGES+UNIT",
  KR: "MODERN+LANGUAGES+UNIT",
  LAT: "WESTERN+LANGUAGES+AND+LITERATURES",
  PER: "MODERN+LANGUAGES+UNIT",
  POR: "MODERN+LANGUAGES+UNIT",
  RUS: "MODERN+LANGUAGES+UNIT",
  SPA: "MODERN+LANGUAGES+UNIT",
  CAU: "CAUCASIAN+LANGUAGES+AND+CULTURES"
};

function resolveCourseTerm(courseOrSem, courseCode) {
  let sem = '';
  if (typeof courseOrSem === 'string') {
    sem = courseOrSem.trim();
  } else if (courseOrSem && typeof courseOrSem === 'object' && courseOrSem.sem) {
    sem = String(courseOrSem.sem).trim();
  }

  if (sem.endsWith('.2')) return SPRING_TERM;
  if (sem.endsWith('.1')) return FALL_TERM;

  const normalizedCode = (courseCode || (courseOrSem && typeof courseOrSem === 'object' ? courseOrSem.code : '') || '')
    .trim()
    .toUpperCase()
    .replace(/\s+/g, ' ');

  if (normalizedCode) {
    const matched = findCourseByCode(normalizedCode);
    if (matched && matched.sem) {
      const matchedSem = String(matched.sem).trim();
      if (matchedSem.endsWith('.2')) return SPRING_TERM;
      if (matchedSem.endsWith('.1')) return FALL_TERM;
    }

    // Aşama 2: Ders numarası teklik / çiftlik çıkarımı (Heuristic Fallback)
    const numMatch = normalizedCode.match(/(\d{3})/) || normalizedCode.match(/(\d+)/);
    if (numMatch) {
      const digits = numMatch[1];
      const lastDigit = parseInt(digits.charAt(digits.length - 1), 10);
      return lastDigit % 2 === 0 ? SPRING_TERM : FALL_TERM;
    }
  }

  return FALL_TERM;
}

function getBounCourseUrl(courseCode, term = FALL_TERM) {
  if (!courseCode || typeof courseCode !== 'string') return null;
  const sanitized = courseCode.trim().toUpperCase();

  if (sanitized.includes('/') || sanitized.includes('\\') || sanitized.includes('|') ||
      sanitized.includes('--') || sanitized.includes('*') || sanitized.includes('?') ||
      /\b(OR|VEYA)\b/.test(sanitized) ||
      sanitized.includes('SEÇMELİ') || sanitized.includes('SECMELI') ||
      sanitized.includes('ELECTIVE') || sanitized.includes('ELECT')) {
    return null;
  }

  const match = sanitized.match(/^([A-Z]{2,4})\s*(\d{3}[A-Z0-9\.]*)$/);
  if (!match) return null;

  const prefix = match[1];
  const number = match[2];
  const compactCode = `${prefix}${number}`;
  const focusCourse = prefix.length <= 2 ? `${prefix}+${number}.01` : `${prefix}${number}.01`;
  const encodedTerm = encodeURIComponent(term);
  const entry = BOUN_BOLUM_MAP[prefix];

  if (entry) {
    const bolumName = typeof entry === "string" ? entry : entry.bolum;
    const kisaAdi = (typeof entry === "object" && entry.kisaadi) ? entry.kisaadi : prefix;
    return `https://registration.bogazici.edu.tr/login/?page=course-search&semester=${encodedTerm}&q=${compactCode.toLowerCase()}&term=${encodedTerm}&kisaadi=${kisaAdi}&bolum=${bolumName}&focus=${focusCourse}`;
  }

  return `https://registration.bogazici.edu.tr/login/?page=course-search&semester=${encodedTerm}&q=${compactCode.toLowerCase()}`;
}

const BASE_YEAR_STRUCTURE = [
  { yearLabel: '0. Yıl (Hazırlık / Erken Dönem)', isExtended: false, sems: ['0.1', '0.2', '0.3 (Yaz)'] },
  { yearLabel: '1. Yıl', isExtended: false, sems: ['1.1', '1.2', '1.3 (Yaz)'] },
  { yearLabel: '2. Yıl', isExtended: false, sems: ['2.1', '2.2', '2.3 (Yaz)'] },
  { yearLabel: '3. Yıl', isExtended: false, sems: ['3.1', '3.2', '3.3 (Yaz)'] },
  { yearLabel: '4. Yıl (Normal Mezuniyet)', isExtended: false, sems: ['4.1', '4.2', '4.3 (Yaz)'] },
  { yearLabel: '5. Yıl (1. Uzatma)', isExtended: true, sems: ['5.1', '5.2', '5.3 (Yaz)'] },
  { yearLabel: '6. Yıl (2. Uzatma)', isExtended: true, sems: ['6.1', '6.2', '6.3 (Yaz)'] },
  { yearLabel: '7. Yıl (Azami Yasal Süre)', isExtended: true, tag: 'YÖK Sınır', sems: ['7.1', '7.2', '7.3 (Yaz)'] }
];

function getEffectiveYearStructure() {
  const state = getDeptState(currentDept);
  const hasDm = Boolean(state && state.selectedDmId && dmData && dmData[state.selectedDmId]);
  if (!hasDm) {
    return BASE_YEAR_STRUCTURE;
  }
  return [
    { yearLabel: '0. Yıl (Hazırlık / Erken Dönem)', isExtended: false, sems: ['0.1', '0.2', '0.3 (Yaz)'] },
    { yearLabel: '1. Yıl', isExtended: false, sems: ['1.1', '1.2', '1.3 (Yaz)'] },
    { yearLabel: '2. Yıl', isExtended: false, sems: ['2.1', '2.2', '2.3 (Yaz)'] },
    { yearLabel: '3. Yıl', isExtended: false, sems: ['3.1', '3.2', '3.3 (Yaz)'] },
    { yearLabel: '4. Yıl (Normal Mezuniyet)', isExtended: false, sems: ['4.1', '4.2', '4.3 (Yaz)'] },
    { yearLabel: '5. Yıl (1. Uzatma)', isExtended: true, sems: ['5.1', '5.2', '5.3 (Yaz)'] },
    { yearLabel: '6. Yıl (2. Uzatma)', isExtended: true, sems: ['6.1', '6.2', '6.3 (Yaz)'] },
    { yearLabel: '7. Yıl (3. Uzatma)', isExtended: true, sems: ['7.1', '7.2', '7.3 (Yaz)'] },
    { yearLabel: '8. Yıl (Azami Yasal Süre)', isExtended: true, tag: 'YÖK Sınır', sems: ['8.1', '8.2', '8.3 (Yaz)'] }
  ];
}

const yearStructure = BASE_YEAR_STRUCTURE;

const SEMESTER_ORDER = [
  '0.1', '0.2', '0.3 (Yaz)',
  '1.1', '1.2', '1.3 (Yaz)',
  '2.1', '2.2', '2.3 (Yaz)',
  '3.1', '3.2', '3.3 (Yaz)',
  '4.1', '4.2', '4.3 (Yaz)',
  '5.1', '5.2', '5.3 (Yaz)',
  '6.1', '6.2', '6.3 (Yaz)',
  '7.1', '7.2', '7.3 (Yaz)',
  '8.1', '8.2', '8.3 (Yaz)'
];

function getSemesterOrderIndex(semId) {
  const idx = SEMESTER_ORDER.indexOf(semId);
  if (idx !== -1) return idx;
  const match = String(semId || '').match(/^(\d+)\.(\d+)/);
  if (match) {
    return parseInt(match[1], 10) * 3 + (parseInt(match[2], 10) - 1);
  }
  return Number.MAX_SAFE_INTEGER;
}

function compareSemesters(semA, semB) {
  return getSemesterOrderIndex(semA) - getSemesterOrderIndex(semB);
}

function isRepeatInstance(inst, instances) {
  if (!inst || !Array.isArray(instances)) return false;
  const sameCourse = instances.filter(i => i.courseId === inst.courseId);
  if (sameCourse.length <= 1) return false;

  const sortedSame = [...sameCourse].sort((a, b) => {
    const cmp = compareSemesters(a.semId, b.semId);
    if (cmp !== 0) return cmp;
    return instances.indexOf(a) - instances.indexOf(b);
  });

  return sortedSame[0].instanceId !== inst.instanceId;
}

function refreshRepeatBadges() {
  const state = getDeptState(currentDept);
  const instances = state.instances || [];
  instances.forEach(inst => {
    const card = document.getElementById(`inst-${inst.instanceId}`);
    if (!card) return;
    const titleGroup = card.querySelector('.course-header > div:first-child');
    if (!titleGroup) return;

    const shouldShowRepeat = isRepeatInstance(inst, instances);
    let badge = titleGroup.querySelector('.repeat-badge');
    if (shouldShowRepeat && !badge) {
      badge = document.createElement('span');
      badge.className = 'repeat-badge';
      badge.textContent = t('repeatBadge');
      titleGroup.appendChild(badge);
    } else if (shouldShowRepeat && badge) {
      badge.textContent = t('repeatBadge');
    } else if (!shouldShowRepeat && badge) {
      badge.remove();
    }
  });
}

let departmentsData = {};
let minorsData = {};
let dmData = {};
let currentDept = localStorage.getItem('boun_active_dept') || 'math';
let globalState = JSON.parse(localStorage.getItem('boun_multi_dept_gpa_state')) || {};

let isSandboxMode = false;
let realUserGlobalStateBackup = null;
let realUserDeptBackup = null;

let prereqTreeSelectedNodeId = null;
let prereqTreeGraphData = { nodesById: {}, prereqsOf: {}, unlocksOf: {}, edges: [] };
let lastAutoFillBackup = null;

const GLOBAL_PREREQ_MAP = {};
const DEPT_PREREQ_MAP = {};

function initPrereqMaps(currData) {
  if (!currData || typeof currData !== 'object') return;
  Object.keys(GLOBAL_PREREQ_MAP).forEach(k => delete GLOBAL_PREREQ_MAP[k]);
  Object.keys(DEPT_PREREQ_MAP).forEach(k => delete DEPT_PREREQ_MAP[k]);

  Object.keys(currData).forEach(dKey => {
    DEPT_PREREQ_MAP[dKey] = {};
    const courses = currData[dKey]?.courses || [];
    courses.forEach(c => {
      if (c && c.code && c.prereq) {
        const codeKey = String(c.code).trim().toUpperCase();
        DEPT_PREREQ_MAP[dKey][codeKey] = c.prereq;
        if (!GLOBAL_PREREQ_MAP[codeKey]) {
          GLOBAL_PREREQ_MAP[codeKey] = c.prereq;
        }
      }
    });
  });
}

const DEPT_TO_DM_MAJOR = {
  'sced_sec_math': 'maed',
  'sced_math': 'maed',
  'tour': 'trm',
  'transint': 'tr',
  'ec': 'econ',
  'mgmt_a': 'mgmt',
  'mgmt_b': 'mgmt'
};

const DM_MAJOR_TO_CURR_DEPT = {
  'maed': 'sced_sec_math',
  'trm': 'tour',
  'tr': 'transint',
  'econ': 'econ',
  'mgmt': 'mgmt_a'
};

function getDmTargetKey(deptKey) {
  return DEPT_TO_DM_MAJOR[deptKey] || deptKey;
}

async function loadCurriculum() {
  try {
    const [currResp, minorsResp, dmResp] = await Promise.all([
      fetch('./data/curriculum.json'),
      fetch('./data/minors.json'),
      fetch('./data/dm_curriculum.json').catch(() => ({ ok: false }))
    ]);

    if (!currResp.ok) throw new Error(`HTTP Hata: ${currResp.status}`);
    departmentsData = await currResp.json();
    initPrereqMaps(departmentsData);

    if (minorsResp.ok) {
      try {
        minorsData = await minorsResp.json();
      } catch (mErr) {
        console.warn("minors.json okunamadı:", mErr);
      }
    }

    if (dmResp && dmResp.ok) {
      try {
        dmData = await dmResp.json();
      } catch (dErr) {
        console.warn("dm_curriculum.json okunamadı:", dErr);
        dmData = {};
      }
    } else {
      dmData = {};
    }

    const availableKeys = Object.keys(departmentsData);
    if (!departmentsData[currentDept]) {
      currentDept = availableKeys[0] || 'math';
    }

    const LEGACY_CLEANUP_KEY = 'boun_legacy_auto_minor_cleaned_v1';
    if (!localStorage.getItem(LEGACY_CLEANUP_KEY)) {
      let cleanedAutoMinors = false;
      Object.keys(globalState).forEach(k => {
        if (globalState[k] && Array.isArray(globalState[k].instances)) {
          const beforeCount = globalState[k].instances.length;
          globalState[k].instances = globalState[k].instances.filter(inst => {

            const isLegacyAuto = inst.instanceId && String(inst.instanceId).startsWith('inst_minor_') && !inst.passed;
            return !isLegacyAuto;
          });
          if (globalState[k].instances.length !== beforeCount) {
            cleanedAutoMinors = true;
          }
        }
      });
      if (cleanedAutoMinors) {
        saveGlobalState();
      }
      localStorage.setItem(LEGACY_CLEANUP_KEY, 'true');
    }

    loadSharedPlanFromHash();
    applyStaticTranslations();
    populateDepartmentSelect();
    populateMinorModalOptions();
    populateDmModalOptions();
    initUI();
    checkAndShowWelcomeModal();
  } catch (err) {
    console.error("Müfredat JSON dosyası yüklenemedi:", err);
    document.body.innerHTML = `
      <div style="padding: 24px; font-family: sans-serif; color: #b91c1c; text-align: center;">
        <h2>${t('loadErrorTitle')}</h2>
        <p>${t('loadErrorDesc')}</p>
        <p style="color: #64748b; font-size: 0.85rem;">${escapeHTML(t('loadErrorDetail'))} ${escapeHTML(err.message)}</p>
      </div>
    `;
  }
}

const WELCOME_STORAGE_KEY = 'boun_tracker_welcomed_v1';

function openWelcomeModal() {
  const modal = document.getElementById('welcomeModal');
  if (!modal) return;
  modal.style.display = 'flex';
  modal.classList.add('open');
}

function closeWelcomeModal(markWelcomed = true) {
  if (markWelcomed) {
    try {
      localStorage.setItem(WELCOME_STORAGE_KEY, 'true');
    } catch (_) {
      // Ignore storage errors (e.g. private mode)
    }
  }
  const modal = document.getElementById('welcomeModal');
  if (modal) {
    modal.classList.remove('open', 'active', 'show');
    modal.style.display = 'none';
  }
}

function handleWelcomeBackdropClick(event) {
  if (event.target && event.target.id === 'welcomeModal') {
    closeWelcomeModal(true);
  }
}

function openFeedbackFromWelcome() {
  closeWelcomeModal(true);
  if (typeof openFeedbackModal === 'function') {
    openFeedbackModal();
  }
}

function checkAndShowWelcomeModal() {
  const hasHashPlan = Boolean(window.location.hash && window.location.hash.includes('#plan='));
  if (isSandboxMode || hasHashPlan) return;
  try {
    if (!localStorage.getItem(WELCOME_STORAGE_KEY)) {
      openWelcomeModal();
    }
  } catch (_) {
    // Ignore storage errors
  }
}

const FACULTY_EN_MAP = {
  "Fen Fakültesi": "Faculty of Arts and Sciences",
  "Eğitim Fakültesi": "Faculty of Education",
  "Hukuk Fakültesi": "Faculty of Law",
  "İktisadi ve İdari Bilimler Fakültesi": "Faculty of Economics and Administrative Sciences",
  "Mühendislik Fakültesi": "Faculty of Engineering",
  "İnsan ve Toplum Bilimleri Fakültesi": "Faculty of Humanities and Social Sciences",
  "Uygulamalı Bilimler Fakültesi": "School of Applied Disciplines",
  "Diğer Lisans Programları": "Other Undergraduate Programs",
  "Diğer Fakülteler": "Other Faculties"
};

const DEPT_EN_MAP = {
  phys: "Physics (PHYS)",
  chem: "Chemistry (CHEM)",
  math: "Mathematics (MATH)",
  mbg: "Molecular Biology and Genetics (MBG)",
  cet: "Computer Education and Educational Technology (CET)",
  ed: "Guidance and Psychological Counseling (ED)",
  pred: "Early Childhood Education (PRED)",
  sced_sci: "Science Education (SCED_SCI)",
  sced_sec_math: "Secondary School Mathematics Education (SCED_SEC_MATH)",
  sced_math: "Primary Mathematics Education (SCED_MATH)",
  sced_chem: "Chemistry Education (SCED_CHEM)",
  sced_phy: "Physics Education (SCED_PHY)",
  fled: "English Language Teaching (FLED)",
  law: "Law (LAW)",
  econ: "Economics (ECON)",
  mgmt_a: "Management - Program A (MGMT_A)",
  mgmt_b: "Management - Program B (MGMT_B)",
  pols: "Political Science and International Relations (POLS)",
  tour: "Tourism Administration (TOUR)",
  intt: "International Trade (INTT)",
  mis: "Management Information Systems (MIS)",
  cmpe: "Computer Engineering (CMPE)",
  ee: "Electrical and Electronics Engineering (EE)",
  ie: "Industrial Engineering (IE)",
  ce: "Civil Engineering (CE)",
  che: "Chemical Engineering (CHE)",
  me: "Mechanical Engineering (ME)",
  soc: "Sociology (SOC)",
  psy: "Psychology (PSY)",
  hist: "History (HIST)",
  tkl: "Turkish Language and Literature (TKL)",
  transint: "Translation and Interpreting Studies (TRANSINT)",
  ling: "Linguistics (LING)",
  phil: "Philosophy (PHIL)",
  wll: "Western Languages and Literatures (WLL)"
};

const MINOR_EN_MAP = {
  wll_minor: "Western Languages and Literatures (WLL) Minor",
  cmpe_minor: "Computer Engineering (CMPE) Minor",
  cet_minor: "Information and Communication Technologies in Education (CET) Minor",
  ee_minor: "Electrical and Electronics Engineering (EE) Minor",
  ie_prod_minor: "Industrial Engineering: Production and Service Systems Minor",
  ie_or_minor: "Industrial Engineering: Operations Research (OR) Minor",
  econ_minor: "Economics (EC) Minor",
  mgmt_minor: "Management (AD) Minor",
  chem_minor: "Chemistry (CHEM) Minor",
  me_minor: "Mechanical Engineering (ME) Minor",
  mbg_minor: "Molecular Biology and Genetics (MBG) Minor",
  pols_minor: "Political Science and International Relations (POLS) Minor",
  trm_minor: "Tourism Administration (TRM) Minor",
  tkl_minor: "Turkish Language and Literature (TKL) Minor",
  intt_minor: "International Trade (INTT) Minor",
  mis_minor: "Management Information Systems (MIS) Minor"
};

function getLocalizedFacultyName(trFaculty) {
  if (!trFaculty) return '';
  if (currentLang !== 'en') return trFaculty;
  if (FACULTY_EN_MAP[trFaculty]) return FACULTY_EN_MAP[trFaculty];

  if (trFaculty.includes('&')) {
    return trFaculty
      .split('&')
      .map(part => {
        const trimmed = part.trim();
        return FACULTY_EN_MAP[trimmed] || trimmed;
      })
      .join(' & ');
  }
  return trFaculty;
}

const DEPT_NAME_EN = {
  phys: "Physics",
  chem: "Chemistry",
  math: "Mathematics",
  mbg: "Molecular Biology and Genetics",
  cet: "Computer Education and Educational Technology",
  ed: "Guidance and Psychological Counseling",
  pred: "Early Childhood Education",
  sced_sci: "Science Education",
  sced_sec_math: "Secondary School Mathematics Education",
  sced_math: "Primary Mathematics Education",
  sced_chem: "Chemistry Education",
  sced_phy: "Physics Education",
  fled: "English Language Teaching",
  law: "Law",
  econ: "Economics",
  mgmt: "Management",
  mgmt_a: "Management",
  mgmt_b: "Management",
  pols: "Political Science and International Relations",
  tour: "Tourism Administration",
  trm: "Tourism Administration",
  intt: "International Trade",
  mis: "Management Information Systems",
  cmpe: "Computer Engineering",
  ee: "Electrical and Electronics Engineering",
  ie: "Industrial Engineering",
  ce: "Civil Engineering",
  che: "Chemical Engineering",
  me: "Mechanical Engineering",
  soc: "Sociology",
  psy: "Psychology",
  hist: "History",
  tkl: "Turkish Language and Literature",
  transint: "Translation and Interpreting Studies",
  tr: "Translation and Interpreting Studies",
  ling: "Linguistics",
  phil: "Philosophy",
  wll: "Western Languages and Literatures",
  maed: "Mathematics Education"
};

const DEPT_CODE_MAP = {
  phys: "PHYS", chem: "CHEM", math: "MATH", mbg: "MBG", cet: "CET", ed: "ED", pred: "PRED",
  sced_sci: "SCED", sced_sec_math: "SCED", sced_math: "SCED", sced_chem: "SCED", sced_phy: "SCED",
  fled: "FLED", law: "LAW", econ: "ECON", mgmt: "MGMT", mgmt_a: "MGMT", mgmt_b: "MGMT",
  pols: "POLS", tour: "TOUR", trm: "TRM", intt: "INTT", mis: "MIS", cmpe: "CMPE", ee: "EE",
  ie: "IE", ce: "CE", che: "CHE", me: "ME", soc: "SOC", psy: "PSY", hist: "HIST", tkl: "TKL",
  transint: "TRANSINT", tr: "TR", ling: "LING", phil: "PHIL", wll: "WLL", maed: "MAED"
};

function getDmLocalizedName(dmObj) {
  if (!dmObj) return '';
  if (currentLang !== 'en') return dmObj.name || '';
  const mKey = (dmObj.majorKey || '').toLowerCase();
  const dmKey = (dmObj.doubleMajorKey || '').toLowerCase();
  const majorName = DEPT_NAME_EN[mKey] || mKey.toUpperCase();
  const dmName = DEPT_NAME_EN[dmKey] || dmKey.toUpperCase();
  const mCode = DEPT_CODE_MAP[mKey] || mKey.toUpperCase();
  const dmCode = DEPT_CODE_MAP[dmKey] || dmKey.toUpperCase();
  return `${majorName} – ${dmName} Double Major (${mCode} - ${dmCode})`;
}

function getDmLocalizedFaculty(dmObj) {
  if (!dmObj) return '';
  return getLocalizedFacultyName(dmObj.faculty || '');
}

function getLocalizedDeptName(deptKey) {
  if (currentLang === 'en' && DEPT_EN_MAP[deptKey]) {
    return DEPT_EN_MAP[deptKey];
  }
  return departmentsData[deptKey]?.name || deptKey;
}

function getLocalizedMinorName(minorKey) {
  if (currentLang === 'en' && MINOR_EN_MAP[minorKey]) {
    return MINOR_EN_MAP[minorKey];
  }
  return minorsData[minorKey]?.name || minorKey;
}

function populateDepartmentSelect() {
  const select = document.getElementById('deptSelect');
  select.innerHTML = '';

  const faculties = {};
  Object.keys(departmentsData).forEach(deptKey => {
    const dept = departmentsData[deptKey];
    const facultyName = dept.faculty ? getLocalizedFacultyName(dept.faculty) : t('otherPrograms');
    if (!faculties[facultyName]) {
      faculties[facultyName] = [];
    }
    faculties[facultyName].push({ key: deptKey, name: getLocalizedDeptName(deptKey) });
  });

  Object.keys(faculties).forEach(facultyName => {
    const group = document.createElement('optgroup');
    group.label = facultyName;

    faculties[facultyName].forEach(dept => {
      const opt = document.createElement('option');
      opt.value = dept.key;
      opt.textContent = dept.name;
      if (dept.key === currentDept) opt.selected = true;
      group.appendChild(opt);
    });

    select.appendChild(group);
  });

  select.disabled = isSandboxMode;
  select.title = isSandboxMode ? t('sandboxDeptDisabledTooltip') : '';
}

function populateMinorModalOptions() {
  const select = document.getElementById('minorSelect');
  if (!select) return;
  select.innerHTML = `<option value="">${escapeHTML(t('minorNoSelectionOption'))}</option>`;

  const faculties = {};
  Object.keys(minorsData).forEach(minorKey => {
    const m = minorsData[minorKey];
    const fac = m.faculty ? getLocalizedFacultyName(m.faculty) : t('otherFaculties');
    if (!faculties[fac]) faculties[fac] = [];
    faculties[fac].push({ key: minorKey, name: getLocalizedMinorName(minorKey) });
  });

  Object.keys(faculties).forEach(facultyName => {
    const group = document.createElement('optgroup');
    group.label = facultyName;
    faculties[facultyName].forEach(m => {
      const opt = document.createElement('option');
      opt.value = m.key;
      opt.textContent = m.name;
      group.appendChild(opt);
    });
    select.appendChild(group);
  });
}

function getDeptState(deptKey) {
  if (!globalState[deptKey]) {
    globalState[deptKey] = { instances: [], selectedMinorId: null, selectedDmId: null, erasmusSemesters: [] };
  }
  if (globalState[deptKey].selectedMinorId === undefined) {
    globalState[deptKey].selectedMinorId = null;
  }
  if (globalState[deptKey].selectedDmId === undefined) {
    globalState[deptKey].selectedDmId = null;
  }
  if (!Array.isArray(globalState[deptKey].erasmusSemesters)) {
    globalState[deptKey].erasmusSemesters = [];
  }
  return globalState[deptKey];
}

function findCourseById(courseId) {
  if (!courseId) return null;
  const dmCourses = getActiveDmCourseList();
  if (dmCourses.length > 0) {
    const dmCourse = dmCourses.find(c => c.id === courseId);
    if (dmCourse) return dmCourse;
  }
  const majorCourse = departmentsData[currentDept]?.courses?.find(c => c.id === courseId);
  if (majorCourse) return majorCourse;
  const minorCourses = getActiveMinorCourseList();
  const minorCourse = minorCourses.find(c => c.id === courseId);
  if (minorCourse) return minorCourse;
  for (const dKey of Object.keys(departmentsData)) {
    const c = departmentsData[dKey].courses?.find(c => c.id === courseId);
    if (c) return c;
  }
  return null;
}

function getCourseForInstance(inst) {
  if (!inst) return null;
  if (inst.minorCourse) return inst.minorCourse;
  if (inst.dmCourse) return inst.dmCourse;
  return findCourseById(inst.courseId);
}

function saveGlobalState() {
  if (isSandboxMode) {
    // RAM tabanlı Sandbox modu: Asla localStorage'a yazma!
    return;
  }
  localStorage.setItem('boun_multi_dept_gpa_state', JSON.stringify(globalState));
  localStorage.setItem('boun_active_dept', currentDept);
}

function changeDepartment(newDept) {
  if (isSandboxMode) return;
  currentDept = newDept;
  saveGlobalState();
  initUI();
}

function switchMobileTab(tab) {
  const sidebar = document.getElementById('sidebarContainer');
  const main = document.getElementById('years-grid');
  const btnPool = document.getElementById('tabBtnPool');
  const btnSem = document.getElementById('tabBtnSemesters');

  if (tab === 'pool') {
    sidebar.classList.add('active-tab');
    main.classList.remove('active-tab');
    btnPool.classList.add('active');
    btnSem.classList.remove('active');
  } else {
    sidebar.classList.remove('active-tab');
    main.classList.add('active-tab');
    btnPool.classList.remove('active');
    btnSem.classList.add('active');
  }
}

let toastTimeout;
function showToast(msg) {
  const toast = document.getElementById('toast');
  toast.innerText = msg;
  toast.classList.add('show');
  clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => {
    toast.classList.remove('show');
  }, 1800);
}

function attachGlobalTooltip(el, htmlContent) {
  const tooltip = document.getElementById('global-tooltip');
  el.addEventListener('mouseenter', () => {
    tooltip.innerHTML = htmlContent;
    tooltip.style.display = 'block';

    const rect = el.getBoundingClientRect();
    const tooltipWidth = 260;
    let left = rect.left + (rect.width / 2) - (tooltipWidth / 2);
    let top = rect.top - tooltip.offsetHeight - 8;

    if (left < 10) left = 10;
    if (left + tooltipWidth > window.innerWidth - 10) {
      left = window.innerWidth - tooltipWidth - 10;
    }

    if (top < 10) {
      top = rect.bottom + 8;
    }

    tooltip.style.left = `${left}px`;
    tooltip.style.top = `${top}px`;
  });

  el.addEventListener('mouseleave', () => {
    tooltip.style.display = 'none';
  });
}

function calculateAverages() {
  const state = getDeptState(currentDept);
  const erasmusSet = new Set(state.erasmusSemesters || []);
  const activeDmCourses = getActiveDmCourseList();
  const majorCourses = departmentsData[currentDept]?.courses || [];
  const baseProgramCourses = activeDmCourses.length > 0 ? activeDmCourses : majorCourses;
  const activeMinorCourses = getActiveMinorCourseList();
  const allRequiredCourses = [...baseProgramCourses, ...activeMinorCourses];

  const semesterStats = {};
  const allSems = [];
  const activeYearStructure = getEffectiveYearStructure();
  activeYearStructure.forEach(y => y.sems.forEach(s => allSems.push(s)));
  allSems.forEach(s => {
    semesterStats[s] = { totalPoints: 0, totalCredits: 0, earnedCredits: 0, scheduledCredits: 0 };
  });

  const selectedCourseIds = new Set();
  let selectedCreditsTotal = 0;

  state.instances.forEach(inst => {
    const course = getCourseForInstance(inst);
    if (course) {
      selectedCourseIds.add(inst.courseId);
      selectedCreditsTotal += (Number(course.crd) || 0);

      if (semesterStats[inst.semId]) {
        semesterStats[inst.semId].scheduledCredits += (Number(course.crd) || 0);
      }
    }

    if (inst.passed && semesterStats[inst.semId]) {
      if (course) {
        const crd = Number(course.crd) || 0;
        semesterStats[inst.semId].earnedCredits += crd;

        const isErasmusTerm = erasmusSet.has(inst.semId);
        const isExGrade = (inst.grade === 'EX' || isErasmusTerm);

        if (!isExGrade && inst.grade && GRADE_POINTS[inst.grade] !== null && GRADE_POINTS[inst.grade] !== undefined) {
          const pts = GRADE_POINTS[inst.grade];
          semesterStats[inst.semId].totalPoints += (pts * crd);
          semesterStats[inst.semId].totalCredits += crd;
        }
      }
    }
  });

  allSems.forEach(s => {
    const safeSemId = s.replace(/[^a-zA-Z0-9]/g, '_');
    const badge = document.getElementById(`spa-${safeSemId}`);
    const crdBadge = document.getElementById(`crd-${safeSemId}`);

    const stat = semesterStats[s];
    if (crdBadge && stat) {
      if (stat.scheduledCredits > 0) {
        crdBadge.innerText = `${stat.scheduledCredits} Cr`;
        crdBadge.className = 'sem-crd-badge has-courses';
      } else {
        crdBadge.innerText = `0 Cr`;
        crdBadge.className = 'sem-crd-badge';
      }
    }

    if (badge && stat) {
      if (stat.earnedCredits > 0) {
        const spaStr = stat.totalCredits > 0
          ? (stat.totalPoints / stat.totalCredits).toFixed(2)
          : (erasmusSet.has(s) ? 'EX' : 'P');
        badge.innerText = `SPA: ${spaStr}`;
        badge.className = 'spa-badge active';
      } else {
        badge.innerText = `SPA: -`;
        badge.className = 'spa-badge';
      }
    }
  });

  const sortedInstances = [...state.instances].sort((a, b) => compareSemesters(a.semId, b.semId));
  const latestPassedByCourse = {};
  const passedCourseIds = new Set();
  const passedCourseCodes = new Set();
  let completedCreditsTotal = 0;

  sortedInstances.forEach(inst => {
    if (inst.passed) {
      passedCourseIds.add(inst.courseId);
      const course = getCourseForInstance(inst);
      if (course) {
        if (course.code) passedCourseCodes.add(course.code.replace(/\s+/g, '').toUpperCase());
        const isErasmusTerm = erasmusSet.has(inst.semId);
        latestPassedByCourse[inst.courseId] = {
          grade: (isErasmusTerm || inst.grade === 'EX') ? 'EX' : (inst.grade || 'AA'),
          crd: Number(course.crd) || 0
        };
      }
    }
  });

  let cumPoints = 0;
  let cumCredits = 0;

  Object.keys(latestPassedByCourse).forEach(cId => {
    const item = latestPassedByCourse[cId];
    completedCreditsTotal += item.crd;

    if (item.grade !== 'P' && item.grade !== 'EX' && GRADE_POINTS[item.grade] !== null && GRADE_POINTS[item.grade] !== undefined) {
      cumPoints += (GRADE_POINTS[item.grade] * item.crd);
      cumCredits += item.crd;
    }
  });

  const gpa = cumCredits > 0 ? (cumPoints / cumCredits).toFixed(2) : "0.00";
  document.getElementById('gpa-display').innerText = gpa;

  document.getElementById('selected-courses-count').innerText = `${selectedCourseIds.size} ${t('courseUnit')}`;
  document.getElementById('selected-credits').innerText = `${selectedCreditsTotal} Cr`;
  document.getElementById('completed-credits').innerText = `${completedCreditsTotal} Cr (${passedCourseIds.size} ${t('courseUnit')})`;
  updateAutoFillButtonLabel();
  updateUndoAutoFillButtonState();

  let totalRequiredCredits = 0;
  const dmKey = state.selectedDmId;
  const dmProgram = (dmKey && dmData) ? dmData[dmKey] : null;
  if (dmProgram && dmProgram.requirements && dmProgram.requirements.totalCredits !== null && dmProgram.requirements.totalCredits !== undefined && !isNaN(Number(dmProgram.requirements.totalCredits))) {
    totalRequiredCredits = Number(dmProgram.requirements.totalCredits);
  } else {
    totalRequiredCredits = allRequiredCourses.reduce((sum, c) => sum + (Number(c.crd) || 0), 0);
  }
  document.getElementById('total-credits').innerText = `${totalRequiredCredits} Cr`;

  const passedRequiredCount = allRequiredCourses.filter(c => {
    if (passedCourseIds.has(c.id)) return true;
    if (c.code) {
      const norm = c.code.replace(/\s+/g, '').toUpperCase();
      if (passedCourseCodes.has(norm)) return true;
    }
    return false;
  }).length;
  const remaining = Math.max(0, allRequiredCourses.length - passedRequiredCount);
  const remainingEl = document.getElementById('remaining-count');
  if (remainingEl) {
    remainingEl.innerHTML = `${remaining} <span style="font-size: 0.72rem; font-weight: 600; opacity: 0.85;">/ ${allRequiredCourses.length}</span>`;
    remainingEl.title = t('remainingTooltip')(remaining, allRequiredCourses.length);
  }
}

function updateSidebarPool() {
  const state = getDeptState(currentDept);
  const activeDmCourses = getActiveDmCourseList();
  const majorCourses = departmentsData[currentDept]?.courses || [];
  const baseProgramCourses = activeDmCourses.length > 0 ? activeDmCourses : majorCourses;
  const activeMinorCourses = getActiveMinorCourseList();
  const allRequiredCourses = [...baseProgramCourses, ...activeMinorCourses];

  const poolTitleEl = document.getElementById('sidebarPoolTitle');
  if (poolTitleEl) {
    poolTitleEl.innerText = `${t('coursePool')} (${allRequiredCourses.length} ${t('courseUnit')})`;
  }

  const pool = document.getElementById('course-pool');
  const poolActionBar = document.getElementById('poolActionBar');
  if (poolActionBar && poolActionBar.parentNode === pool) {
    poolActionBar.remove();
  }
  if (dashCardWrapper && dashCardWrapper.parentNode === pool) {
    dashCardWrapper.remove();
  }
  pool.innerHTML = '';
  if (poolActionBar) {
    pool.appendChild(poolActionBar);
  }

  const groups = {
    '1.1': [], '1.2': [],
    '2.1': [], '2.2': [],
    '3.1': [], '3.2': [],
    '4.1': [], '4.2': [],
    'other': []
  };

  baseProgramCourses.forEach(course => {
    if (course.sem && groups[course.sem]) {
      groups[course.sem].push(course);
    } else {
      groups['other'].push(course);
    }
  });

  activeMinorCourses.forEach(course => {
    if (course.sem && groups[course.sem]) {
      groups[course.sem].push(course);
    } else {
      groups['other'].push(course);
    }
  });

  const semesterLabels = t('semGroupLabels');
  const isMobile = isMobileDevice();

  Object.keys(groups).forEach(semKey => {
    const groupCourses = groups[semKey];
    if (!groupCourses || groupCourses.length === 0) return;

    const groupContainer = document.createElement('div');
    const colorClass = semKey === 'other' ? 'pool-sem-other' : `pool-sem-${semKey.replace('.', '-')}`;
    groupContainer.className = `pool-sem-group ${colorClass}`;

    const groupHeader = document.createElement('div');
    groupHeader.className = 'pool-sem-header';
    groupHeader.innerHTML = `
      <span>${escapeHTML(semesterLabels[semKey] || formatSemLabel(semKey))}</span>
      <span>${groupCourses.length} ${escapeHTML(t('courseUnit'))}</span>
    `;
    groupContainer.appendChild(groupHeader);

    groupCourses.forEach(course => {
      const normCourseCode = course.code ? course.code.replace(/\s+/g, '').toUpperCase() : '';
      const courseInstances = state.instances.filter(inst => {
        if (inst.courseId === course.id) return true;
        const instCourse = getCourseForInstance(inst);
        if (instCourse && instCourse.code && normCourseCode) {
          return instCourse.code.replace(/\s+/g, '').toUpperCase() === normCourseCode;
        }
        return false;
      });

      const hasPassed = courseInstances.some(inst => inst.passed === true && inst.grade !== 'F');
      const hasFailedOnly = courseInstances.length > 0 && !hasPassed;
      const isPlaced = courseInstances.length > 0 && !hasPassed && !hasFailedOnly;
      const isMinor = !!course.isMinor;
      const isDm = !!course.isDoubleMajor;

      const poolCard = document.createElement('div');
      const isLocked = hasPassed;
      poolCard.className = `course-card ${isMinor ? 'minor-card' : ''} ${isDm ? 'dm-card' : ''} ${hasPassed ? 'status-passed pool-locked' : (hasFailedOnly ? 'status-failed' : '')}`;
      poolCard.draggable = !isLocked && !isMobile;
      poolCard.dataset.courseId = course.id;

      let statusBadge = `<span class="status-badge pending">${escapeHTML(t('notTaken'))}</span>`;
      if (hasPassed) {
        const sortedPassed = [...courseInstances]
          .filter(inst => inst.passed && inst.grade !== 'F')
          .sort((a, b) => compareSemesters(a.semId, b.semId));
        const passedInst = sortedPassed[sortedPassed.length - 1];
        const gradeText = passedInst ? `(${escapeHTML(passedInst.grade || 'AA')})` : '';
        statusBadge = `<span class="status-badge locked">${escapeHTML(t('passedStatus'))} ${gradeText}</span>`;
      } else if (hasFailedOnly) {
        statusBadge = `<span class="status-badge failed">${escapeHTML(t('failedStatus'))}</span>`;
      } else if (isPlaced) {
        statusBadge = `<span class="status-badge pending" style="color: #0284c7; font-weight: 600;">${escapeHTML(t('plannedStatus'))}</span>`;
      }

      const poolCourseUrl = getBounCourseUrl(course.code, resolveCourseTerm(course, course.code));
      const safeCode = escapeHTML(course.code);
      const safeName = escapeHTML(course.name);
      const safePrereq = course.prereq ? escapeHTML(translatePrereq(course.prereq)) : '';

      poolCard.innerHTML = `
        <div class="course-header">
          <div style="display: flex; align-items: center; gap: 6px; min-width: 0;">
            <span class="course-title">${safeCode}</span>
            ${isMinor ? `<span class="minor-badge">${escapeHTML(t('minorBadge'))}</span>` : ''}
            ${isDm ? `<span class="dm-badge">${escapeHTML(t('dmBadge'))}</span>` : ''}
          </div>
          <span class="course-credits">${course.crd} Cr</span>
        </div>
        <div class="course-name">${safeName}</div>
        ${safePrereq ? `<div class="course-prereq">${safePrereq}</div>` : ''}
        ${poolCourseUrl ? `
          <div class="course-desc-link-wrap">
            <a href="${escapeHTML(poolCourseUrl)}"
               target="_blank"
               rel="noopener noreferrer"
               class="course-desc-link"
               draggable="false"
               onclick="event.stopPropagation();"
               title="${safeCode} ${escapeHTML(t('coursePageTooltip'))}">
              ${escapeHTML(t('openCoursePage'))}
            </a>
          </div>
        ` : ''}
        <div class="course-controls" style="margin-top: 4px;">
          ${statusBadge}
          ${!isLocked ? `
            <button type="button" class="mobile-term-pick-btn" onclick="openTermPickerModal('${escapeHTML(course.id)}'); event.stopPropagation();">
              ${escapeHTML(t('addToTermBtn'))}
            </button>
          ` : ''}
        </div>
      `;

      if (!isLocked && !isMobile) {
        poolCard.addEventListener('dragstart', handlePoolDragStart);
        poolCard.addEventListener('dragend', handleDragEnd);
      }

      groupContainer.appendChild(poolCard);
    });

    pool.appendChild(groupContainer);
  });

  applyDashCardPosition();
  calculateAverages();
}

function handleMobileAddCourse(courseId, targetSem, selectEl) {
  if (!targetSem) return;

  const state = getDeptState(currentDept);
  const course = findCourseById(courseId);
  if (!course) return;

  const isMinor = !!course.isMinor;
  const isDm = !!course.isDoubleMajor;
  const newInst = {
    instanceId: 'inst_' + (isMinor ? 'user_minor_' : (isDm ? 'user_dm_' : '')) + Date.now() + '_' + Math.random().toString(36).substr(2, 5),
    courseId: courseId,
    semId: targetSem,
    passed: false,
    grade: 'AA',
    customText: '',
    isMinor: isMinor,
    minorCourse: isMinor ? course : undefined,
    isDoubleMajor: isDm,
    dmCourse: isDm ? course : undefined
  };

  state.instances.push(newInst);
  saveGlobalState();

  const card = createSemesterCourseCard(newInst, course);
  const targetBox = document.querySelector(`[data-sem-id="${targetSem}"]`);
  if (targetBox) {
    targetBox.appendChild(card);
  }

  if (selectEl) selectEl.value = "";

  refreshRepeatBadges();
  updateSidebarPool();
  showToast(t('toastAddedToTerm')(course.code, formatSemLabel(targetSem)));
}

function initUI() {
  document.getElementById('deptSelect').value = currentDept;

  const activeDeptData = departmentsData[currentDept];
  if (!activeDeptData) return;

  const state = getDeptState(currentDept);
  const yearsGrid = document.getElementById('years-grid');
  yearsGrid.innerHTML = '';

  const yearLabelMap = t('yearLabels');
  const activeYearStructure = getEffectiveYearStructure();

  activeYearStructure.forEach(y => {
    const row = document.createElement('div');
    row.className = `year-row ${y.isExtended ? 'extended' : ''}`;

    const title = document.createElement('div');
    title.className = 'year-title';
    title.innerHTML = `
      <span>${escapeHTML(yearLabelMap[y.yearLabel] || y.yearLabel)}</span>
      ${y.tag ? `<span class="limit-tag">${escapeHTML(t('limitTag'))}</span>` : ''}
    `;
    row.appendChild(title);

    const semsContainer = document.createElement('div');
    semsContainer.className = 'semesters-container';

    y.sems.forEach(semId => {
      const isErasmus = Array.isArray(state.erasmusSemesters) && state.erasmusSemesters.includes(semId);
      const box = document.createElement('div');
      box.className = `semester-box ${isErasmus ? 'is-erasmus' : ''}`;
      box.dataset.semId = semId;

      const safeSemId = semId.replace(/[^a-zA-Z0-9]/g, '_');
      const curriculumInfo = activeDeptData.curriculumMap ? activeDeptData.curriculumMap[semId] : null;
      const semDisplay = formatSemLabel(semId);

      box.innerHTML = `
        <div class="semester-header">
          <div style="display:flex; align-items:center; gap:5px; flex-wrap:wrap; min-width:0;">
            <span>${escapeHTML(semDisplay)}</span>
            ${curriculumInfo ? `<span class="info-btn" id="info-btn-${safeSemId}">i</span>` : ''}
            ${isErasmus ? `<span class="erasmus-tag">${escapeHTML(t('erasmusTag'))}</span>` : ''}
          </div>
          <div class="sem-header-badges">
            <button type="button" class="sem-erasmus-btn ${isErasmus ? 'active' : ''}" onclick="toggleErasmusSemester('${escapeHTML(semId)}')" title="${escapeHTML(isErasmus ? t('erasmusActiveTitle') : t('erasmusInactiveTitle'))}">
              🇪🇺 ${escapeHTML(isErasmus ? t('erasmusActive') : t('erasmusBtn'))}
            </button>
            <span id="crd-${safeSemId}" class="sem-crd-badge">0 Cr</span>
            <span id="spa-${safeSemId}" class="spa-badge">SPA: -</span>
          </div>
        </div>
      `;

      if (curriculumInfo) {
        const listStr = curriculumInfo.map(c => `• ${escapeHTML(c)}`).join('<br>');
        const tooltipContent = `<strong>${escapeHTML(getLocalizedDeptName(currentDept))} (${escapeHTML(semDisplay)}):</strong><br>${listStr}`;
        const infoBtn = box.querySelector(`#info-btn-${safeSemId}`);
        if (infoBtn) attachGlobalTooltip(infoBtn, tooltipContent);
      }

      box.addEventListener('dragover', handleDragOver);
      box.addEventListener('dragleave', handleDragLeave);
      box.addEventListener('drop', handleDrop);

      semsContainer.appendChild(box);
    });

    row.appendChild(semsContainer);
    yearsGrid.appendChild(row);
  });

  state.instances.forEach(inst => {
    const course = getCourseForInstance(inst);
    if (course) {
      const semBox = document.querySelector(`[data-sem-id="${inst.semId}"]`);
      if (semBox) {
        const card = createSemesterCourseCard(inst, course);
        semBox.appendChild(card);
      }
    }
  });

  refreshRepeatBadges();
  updateSidebarPool();
  updateMinorButtonUI();
  updateDmButtonUI();
}

function createSemesterCourseCard(inst, course) {
  const card = document.createElement('div');
  const isPassed = !!inst.passed;
  const isMobile = isMobileDevice();
  const isMinor = !!inst.isMinor || !!course.isMinor;
  const isDm = !!inst.isDoubleMajor || !!course.isDoubleMajor;
  const state = getDeptState(currentDept);
  const isRepeat = isRepeatInstance(inst, state.instances);

  card.className = `course-card ${isMinor ? 'minor-card' : ''} ${isDm ? 'dm-card' : ''} ${isPassed ? 'status-passed locked' : 'status-failed'}`;
  card.id = `inst-${inst.instanceId}`;
  card.draggable = !isPassed && !isMobile;
  card.dataset.instanceId = inst.instanceId;

  const currentGrade = inst.grade || 'AA';

  const gradeOptions = Object.keys(GRADE_POINTS).map(g => {
    const valText = GRADE_POINTS[g] !== null ? `(${GRADE_POINTS[g].toFixed(1)})` : (g === 'EX' ? '(Transfer)' : '(Pass)');
    return `<option value="${g}" ${currentGrade === g ? 'selected' : ''}>${g} ${valText}</option>`;
  }).join('');

  const isCustomElective = Boolean(course.isElective && inst.customText);
  const effectiveCode = isCustomElective ? inst.customText : course.code;
  const courseUrl = getBounCourseUrl(effectiveCode, resolveCourseTerm(isCustomElective ? null : course, effectiveCode));

  const safeCode = escapeHTML(course.code);
  const safeName = escapeHTML(course.name);
  const safePrereq = course.prereq ? escapeHTML(translatePrereq(course.prereq)) : '';
  const safeCustomText = escapeHTML(inst.customText || '');
  const safeEffectiveCode = escapeHTML(effectiveCode);

  card.innerHTML = `
    <div class="course-header">
      <div style="display:flex; align-items:center; gap:6px; flex-wrap:wrap; min-width:0;">
        <span class="course-title">${safeCode}</span>
        ${isMinor ? `<span class="minor-badge">${escapeHTML(t('minorBadge'))}</span>` : ''}
        ${isDm ? `<span class="dm-badge">${escapeHTML(t('dmBadge'))}</span>` : ''}
        ${isRepeat ? `<span class="repeat-badge">${escapeHTML(t('repeatBadge'))}</span>` : ''}
      </div>
      <div style="display:flex; align-items:center; gap:6px;">
        ${isPassed ? `
          <div class="grade-selector-wrap" title="${escapeHTML(t('gradeTooltip'))}">
            <select class="grade-select" onchange="handleGradeChange('${inst.instanceId}', this.value)">
              ${gradeOptions}
            </select>
          </div>
        ` : ''}
        <span class="course-credits">${course.crd} Cr</span>
        ${!isPassed ? `
          <button class="delete-btn" onclick="removeInstance('${inst.instanceId}')" title="${escapeHTML(isMinor ? t('removeMinorCourseTitle') : (isDm ? t('removeDmCourseTitle') : t('removeFromTermTitle')))}">✕</button>
        ` : ''}
      </div>
    </div>
    <div class="course-name">${safeName}</div>
    ${safePrereq ? `<div class="course-prereq">${safePrereq}</div>` : ''}

    <div class="course-desc-link-wrap" style="${courseUrl ? '' : 'display:none;'}">
      ${courseUrl ? `
        <a href="${escapeHTML(courseUrl)}"
           target="_blank"
           rel="noopener noreferrer"
           class="course-desc-link"
           draggable="false"
           onclick="event.stopPropagation();"
           title="${safeEffectiveCode} ${escapeHTML(t('coursePageTooltip'))}">
          ${escapeHTML(t('openCoursePage'))}
        </a>
      ` : ''}
    </div>

    ${course.isElective ? `
      <input type="text"
             class="custom-input"
             placeholder="${escapeHTML(t('electiveInputPlaceholder'))}"
             value="${safeCustomText}"
             oninput="handleInstanceInput('${inst.instanceId}', this.value)">
    ` : ''}

    <div class="course-controls">
      <label style="cursor:pointer; display:flex; align-items:center; gap:5px; font-weight:600;">
        <input type="checkbox" ${isPassed ? 'checked' : ''} onchange="toggleInstancePassed('${inst.instanceId}', this.checked)">
        ${escapeHTML(t('passedCheck'))}
      </label>
      <span class="status-badge ${isPassed ? 'locked' : 'failed'}">
        ${escapeHTML(isPassed ? t('completedBadge') : t('failedStatus'))}
      </span>
    </div>
  `;

  if (!isPassed && !isMobile) {
    card.addEventListener('dragstart', handleInstanceDragStart);
    card.addEventListener('dragend', handleDragEnd);
  }

  return card;
}

let dragType = null;
let draggedId = null;
let dragGhostNode = null;

function createCustomDragImage(sourceEl, e) {
  if (window.getSelection) {
    window.getSelection().removeAllRanges();
  }

  dragGhostNode = sourceEl.cloneNode(true);
  dragGhostNode.style.width = `${sourceEl.offsetWidth}px`;
  dragGhostNode.style.position = 'fixed';
  dragGhostNode.style.top = '-9999px';
  dragGhostNode.style.left = '-9999px';
  dragGhostNode.style.zIndex = '999999';
  dragGhostNode.style.opacity = '0.98';
  dragGhostNode.style.boxShadow = '0 12px 28px rgba(0, 51, 102, 0.25)';
  dragGhostNode.style.transform = 'scale(1.02)';
  dragGhostNode.style.pointerEvents = 'none';
  document.body.appendChild(dragGhostNode);

  e.dataTransfer.effectAllowed = 'move';
  e.dataTransfer.setDragImage(dragGhostNode, sourceEl.offsetWidth / 2, 25);
}

function handlePoolDragStart(e) {
  dragType = 'pool';
  draggedId = this.dataset.courseId;
  this.classList.add('is-dragging');
  e.dataTransfer.setData('text/plain', this.dataset.courseId);
  createCustomDragImage(this, e);
}

function handleInstanceDragStart(e) {
  dragType = 'instance';
  draggedId = this.dataset.instanceId;
  this.classList.add('is-dragging');
  e.dataTransfer.setData('text/plain', this.dataset.instanceId);
  createCustomDragImage(this, e);
}

function handleDragEnd() {
  this.classList.remove('is-dragging');
  document.querySelectorAll('.course-card').forEach(c => c.classList.remove('drop-indicator'));
  document.querySelectorAll('.semester-box').forEach(b => b.classList.remove('drag-over'));
  if (dragGhostNode && dragGhostNode.parentNode) {
    dragGhostNode.parentNode.removeChild(dragGhostNode);
    dragGhostNode = null;
  }
}

function getDragAfterElement(container, y) {
  const draggableElements = [...container.querySelectorAll('.course-card:not(.is-dragging)')];

  return draggableElements.reduce((closest, child) => {
    const box = child.getBoundingClientRect();
    const offset = y - box.top - box.height / 2;
    if (offset < 0 && offset > closest.offset) {
      return { offset: offset, element: child };
    } else {
      return closest;
    }
  }, { offset: Number.NEGATIVE_INFINITY }).element;
}

function handleDragOver(e) {
  e.preventDefault();
  e.dataTransfer.dropEffect = 'move';
  this.classList.add('drag-over');

  const afterElement = getDragAfterElement(this, e.clientY);
  document.querySelectorAll('.course-card').forEach(c => c.classList.remove('drop-indicator'));
  if (afterElement) {
    afterElement.classList.add('drop-indicator');
  }
}

function handleDragLeave() {
  this.classList.remove('drag-over');
  this.querySelectorAll('.course-card').forEach(c => c.classList.remove('drop-indicator'));
}

function handleDrop(e) {
  e.preventDefault();
  this.classList.remove('drag-over');
  document.querySelectorAll('.course-card').forEach(c => c.classList.remove('drop-indicator'));

  if (!draggedId) return;

  const semId = this.dataset.semId;
  const state = getDeptState(currentDept);
  const afterElement = getDragAfterElement(this, e.clientY);

  if (dragType === 'pool') {
    const course = findCourseById(draggedId);
    if (!course) return;

    const isMinor = !!course.isMinor;
    const isDm = !!course.isDoubleMajor;
    const newInst = {
      instanceId: 'inst_' + (isMinor ? 'user_minor_' : (isDm ? 'user_dm_' : '')) + Date.now() + '_' + Math.random().toString(36).substr(2, 5),
      courseId: draggedId,
      semId: semId,
      passed: false,
      grade: 'AA',
      customText: '',
      isMinor: isMinor,
      minorCourse: isMinor ? course : undefined,
      isDoubleMajor: isDm,
      dmCourse: isDm ? course : undefined
    };

    const targetIndex = afterElement
      ? state.instances.findIndex(i => i.instanceId === afterElement.dataset.instanceId)
      : state.instances.length;

    if (targetIndex > -1 && targetIndex < state.instances.length) {
      state.instances.splice(targetIndex, 0, newInst);
    } else {
      state.instances.push(newInst);
    }

    saveGlobalState();

    const card = createSemesterCourseCard(newInst, course);
    if (afterElement) {
      this.insertBefore(card, afterElement);
    } else {
      this.appendChild(card);
    }

  } else if (dragType === 'instance') {
    const instIndex = state.instances.findIndex(i => i.instanceId === draggedId);
    if (instIndex > -1) {
      const inst = state.instances[instIndex];
      if (!inst.passed) {
        inst.semId = semId;

        state.instances.splice(instIndex, 1);
        const targetIndex = afterElement
          ? state.instances.findIndex(i => i.instanceId === afterElement.dataset.instanceId)
          : state.instances.length;

        if (targetIndex > -1 && targetIndex <= state.instances.length) {
          state.instances.splice(targetIndex, 0, inst);
        } else {
          state.instances.push(inst);
        }

        saveGlobalState();

        const card = document.getElementById(`inst-${draggedId}`);
        if (card) {
          if (afterElement) {
            this.insertBefore(card, afterElement);
          } else {
            this.appendChild(card);
          }
        }
      }
    }
  }

  refreshRepeatBadges();
  updateSidebarPool();
  draggedId = null;
  dragType = null;
}

function toggleInstancePassed(instanceId, isChecked) {
  const state = getDeptState(currentDept);
  const inst = state.instances.find(i => i.instanceId === instanceId);
  if (inst) {
    inst.passed = isChecked;
    if (isChecked && !inst.grade) {
      inst.grade = 'AA';
    }
    saveGlobalState();

    const oldCard = document.getElementById(`inst-${instanceId}`);
    const course = getCourseForInstance(inst);
    const newCard = createSemesterCourseCard(inst, course);
    oldCard.parentElement.replaceChild(newCard, oldCard);

    refreshRepeatBadges();
    updateSidebarPool();
  }
}

function handleGradeChange(instanceId, newGrade) {
  const state = getDeptState(currentDept);
  const inst = state.instances.find(i => i.instanceId === instanceId);
  if (inst) {
    inst.grade = newGrade;
    saveGlobalState();
    updateSidebarPool();
  }
}

function toggleErasmusSemester(semId) {
  const state = getDeptState(currentDept);
  if (!Array.isArray(state.erasmusSemesters)) {
    state.erasmusSemesters = [];
  }
  const idx = state.erasmusSemesters.indexOf(semId);
  if (idx > -1) {
    state.erasmusSemesters.splice(idx, 1);
  } else {
    state.erasmusSemesters.push(semId);
  }
  saveGlobalState();
  initUI();
}

function handleInstanceInput(instanceId, text) {
  const state = getDeptState(currentDept);
  const inst = state.instances.find(i => i.instanceId === instanceId);
  if (inst) {
    inst.customText = text;
    saveGlobalState();

    const card = document.getElementById(`inst-${instanceId}`);
    if (card) {
      const linkWrap = card.querySelector('.course-desc-link-wrap');
      if (linkWrap) {
        const course = getCourseForInstance(inst);
        const isCustomElective = Boolean(course && course.isElective && text.trim());
        const effectiveCode = isCustomElective ? text.trim() : (course ? course.code : text.trim());
        const newUrl = getBounCourseUrl(effectiveCode, resolveCourseTerm(isCustomElective ? null : course, effectiveCode));
        if (newUrl) {
          const safeEffectiveCode = escapeHTML(effectiveCode);
          linkWrap.innerHTML = `
            <a href="${escapeHTML(newUrl)}"
               target="_blank"
               rel="noopener noreferrer"
               class="course-desc-link"
               draggable="false"
               onclick="event.stopPropagation();"
               title="${safeEffectiveCode} ${escapeHTML(t('coursePageTooltip'))}">
              ${escapeHTML(t('openCoursePage'))}
            </a>
          `;
          linkWrap.style.display = 'block';
        } else {
          linkWrap.innerHTML = '';
          linkWrap.style.display = 'none';
        }
      }
    }
  }
}

function removeInstance(instanceId) {
  const state = getDeptState(currentDept);
  state.instances = state.instances.filter(i => i.instanceId !== instanceId);
  saveGlobalState();

  const card = document.getElementById(`inst-${instanceId}`);
  if (card) card.remove();

  refreshRepeatBadges();
  updateSidebarPool();
}

function resetCurrentDept() {
  const deptName = getLocalizedDeptName(currentDept);
  if (confirm(t('confirmReset')(deptName))) {
    globalState[currentDept] = { instances: [], selectedMinorId: null, selectedDmId: null };
    saveGlobalState();
    initUI();
  }
}

function exportDataAsJSON() {
  try {
    const activeDeptData = departmentsData[currentDept];
    const currentDeptState = getDeptState(currentDept);

    const exportPayload = {
      app: "boun-program-tracker",
      version: 1,
      exportedAt: new Date().toISOString(),
      activeDept: currentDept,
      activeDeptName: activeDeptData?.name || currentDept,
      selectedMinorId: currentDeptState.selectedMinorId || null,
      selectedDmId: currentDeptState.selectedDmId || null,
      summary: {
        plannedCoursesCount: currentDeptState.instances.length,
        passedCoursesCount: currentDeptState.instances.filter(i => i.passed).length,
        selectedMinorId: currentDeptState.selectedMinorId || null,
        selectedDmId: currentDeptState.selectedDmId || null
      },
      globalState: globalState
    };

    const jsonString = JSON.stringify(exportPayload, null, 2);
    const blob = new Blob([jsonString], { type: "application/json;charset=utf-8" });
    const url = URL.createObjectURL(blob);

    const safeDept = currentDept.replace(/[^a-zA-Z0-9_-]/g, '_');
    const dateStr = new Date().toISOString().slice(0, 10);
    const link = document.createElement("a");
    link.href = url;
    link.download = `boun_plan_${safeDept}_${dateStr}.json`;
    document.body.appendChild(link);
    link.click();

    setTimeout(() => {
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }, 200);

    showToast(t('toastExportSuccess'));
  } catch (err) {
    console.error("Dışa aktarma hatası:", err);
    alert(t('alertExportError') + err.message);
  }
}

function importDataFromJSON(event) {
  const file = event.target.files && event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function(e) {
    try {
      const rawText = e.target.result;
      let parsed;
      try {
        parsed = JSON.parse(rawText);
      } catch (jsonErr) {
        throw new Error(t('errInvalidJson'));
      }

      if (!parsed || typeof parsed !== 'object') {
        throw new Error(t('errEmptyData'));
      }

      let candidateState = null;
      let targetDept = null;

      const stateObj = parsed.globalState || parsed.state;
      if (stateObj && typeof stateObj === 'object' && !Array.isArray(stateObj)) {
        candidateState = stateObj;
        if (parsed.activeDept && departmentsData[parsed.activeDept]) {
          targetDept = parsed.activeDept;
        }
      }

      else if (Array.isArray(parsed.instances)) {
        candidateState = { ...globalState };
        candidateState[currentDept] = {
          instances: parsed.instances,
          selectedMinorId: parsed.selectedMinorId || null,
          selectedDmId: parsed.selectedDmId || null
        };
      }

      else if (Array.isArray(parsed)) {
        candidateState = { ...globalState };
        candidateState[currentDept] = { instances: parsed, selectedMinorId: null, selectedDmId: null };
      }

      else if (typeof parsed === 'object') {
        const hasDeptInstances = Object.keys(parsed).some(k => parsed[k] && Array.isArray(parsed[k].instances));
        if (hasDeptInstances) {
          candidateState = parsed;
          if (parsed.activeDept && departmentsData[parsed.activeDept]) {
            targetDept = parsed.activeDept;
          }
        }
      }

      if (!candidateState) {
        throw new Error(t('errNoPlanFound'));
      }

      Object.keys(candidateState).forEach(k => {
        if (!candidateState[k] || !Array.isArray(candidateState[k].instances)) {
          candidateState[k] = {
            instances: [],
            selectedMinorId: candidateState[k]?.selectedMinorId || null,
            selectedDmId: candidateState[k]?.selectedDmId || null
          };
        } else {
          candidateState[k].instances = candidateState[k].instances.filter(inst => inst && inst.courseId && inst.semId);
          if (candidateState[k].selectedMinorId === undefined) {
            candidateState[k].selectedMinorId = null;
          }
          if (candidateState[k].selectedDmId === undefined) {
            candidateState[k].selectedDmId = null;
          }
        }
      });

      if (parsed.selectedMinorId !== undefined && candidateState[targetDept || currentDept]) {
        candidateState[targetDept || currentDept].selectedMinorId = parsed.selectedMinorId;
      }
      if (parsed.selectedDmId !== undefined && candidateState[targetDept || currentDept]) {
        candidateState[targetDept || currentDept].selectedDmId = parsed.selectedDmId;
      }

      const activeCurrentInstances = (globalState[currentDept]?.instances || []).length;
      if (activeCurrentInstances > 0) {
        const confirmOverwrite = confirm(t('confirmOverwriteImport'));
        if (!confirmOverwrite) {
          event.target.value = '';
          return;
        }
      }

      globalState = candidateState;
      if (targetDept && departmentsData[targetDept]) {
        currentDept = targetDept;
      }

      saveGlobalState();

      const deptSelect = document.getElementById('deptSelect');
      if (deptSelect) deptSelect.value = currentDept;

      initUI();
      showToast(t('toastImportSuccess'));
    } catch (err) {
      console.error("İçe aktarma hatası:", err);
      alert(t('alertImportError') + err.message);
    } finally {
      event.target.value = '';
    }
  };

  reader.onerror = function() {
    alert(t('alertFileReadError'));
    event.target.value = '';
  };

  reader.readAsText(file, "UTF-8");
}

function openShareModal() {
  closeToolsDropdown();
  const modal = document.getElementById('shareModal');
  if (modal) {
    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
}

function closeShareModal() {
  const modal = document.getElementById('shareModal');
  if (modal) {
    modal.classList.remove('open');
    document.body.style.overflow = '';
  }
}

function handleShareBackdropClick(event) {
  if (event.target && event.target.id === 'shareModal') {
    closeShareModal();
  }
}

function fallbackCopyText(text) {
  const textArea = document.createElement("textarea");
  textArea.value = text;
  textArea.style.position = "fixed";
  textArea.style.left = "-9999px";
  textArea.style.top = "0";
  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();
  try {
    document.execCommand('copy');
    showToast(t('shareLinkCopied'));
  } catch (err) {
    prompt("Paylaşım linki:", text);
  }
  document.body.removeChild(textArea);
}

function copyShareLink() {
  closeShareModal();
  try {
    const state = getDeptState(currentDept);
    const payload = {
      v: 1,
      dept: currentDept,
      minor: state.selectedMinorId || null,
      dm: state.selectedDmId || null,
      plan: state.instances || []
    };

    if (typeof LZString === 'undefined') {
      alert("LZ-String kütüphanesi henüz yüklenemedi.");
      return;
    }

    const compressed = LZString.compressToEncodedURIComponent(JSON.stringify(payload));
    const shareUrl = window.location.origin + window.location.pathname + '#plan=' + compressed;

    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(shareUrl).then(() => {
        showToast(t('shareLinkCopied'));
      }).catch(() => {
        fallbackCopyText(shareUrl);
      });
    } else {
      fallbackCopyText(shareUrl);
    }
  } catch (err) {
    console.error("Link kopyalanırken hata:", err);
    showToast("Hata: Link kopyalanamadı.");
  }
}

function createShareExportBoard() {
  const state = getDeptState(currentDept);
  const deptName = getLocalizedDeptName(currentDept);

  const gpaEl = document.getElementById('gpa-display');
  const gpa = gpaEl ? gpaEl.innerText.trim() : '0.00';
  const completedEl = document.getElementById('completed-credits');
  const completedText = completedEl ? completedEl.innerText.trim() : '0 Cr';
  const selectedEl = document.getElementById('selected-credits');
  const selectedText = selectedEl ? selectedEl.innerText.trim() : '0 Cr';

  let minorBadgeHtml = '';
  if (state.selectedMinorId && minorsData && minorsData[state.selectedMinorId]) {
    const minorName = getLocalizedMinorName(state.selectedMinorId);
    minorBadgeHtml = `<span class="export-tag minor">🎓 ${escapeHTML(t('minorLabelPrefix'))}: ${escapeHTML(minorName)}</span>`;
  }
  let dmBadgeHtml = '';
  if (state.selectedDmId && dmData && dmData[state.selectedDmId]) {
    const dmProg = dmData[state.selectedDmId];
    const dmName = getDmLocalizedName(dmProg);
    dmBadgeHtml = `<span class="export-tag dm">🎓 ${escapeHTML(t('dmLabelPrefix'))}: ${escapeHTML(dmName)}</span>`;
  }

  const activeYearStructure = getEffectiveYearStructure();
  const allSems = [];
  activeYearStructure.forEach(y => y.sems.forEach(s => allSems.push(s)));
  const erasmusSet = new Set(state.erasmusSemesters || []);

  const nonEmptys = allSems.filter(semId => {
    return state.instances.some(inst => inst.semId === semId);
  });

  if (nonEmptys.length === 0) {
    return null;
  }

  const semesterStats = {};
  nonEmptys.forEach(s => {
    semesterStats[s] = { totalPoints: 0, totalCredits: 0, earnedCredits: 0, scheduledCredits: 0 };
  });

  state.instances.forEach(inst => {
    if (!semesterStats[inst.semId]) return;
    const course = getCourseForInstance(inst);
    if (course) {
      const crd = Number(course.crd) || 0;
      semesterStats[inst.semId].scheduledCredits += crd;
      if (inst.passed) {
        semesterStats[inst.semId].earnedCredits += crd;
        const isErasmusTerm = erasmusSet.has(inst.semId);
        const isExGrade = (inst.grade === 'EX' || isErasmusTerm);
        if (!isExGrade && inst.grade && GRADE_POINTS[inst.grade] !== null && GRADE_POINTS[inst.grade] !== undefined) {
          semesterStats[inst.semId].totalPoints += (GRADE_POINTS[inst.grade] * crd);
          semesterStats[inst.semId].totalCredits += crd;
        }
      }
    }
  });

  const board = document.createElement('div');
  board.className = 'share-export-board';
  board.id = 'shareExportBoard';

  let semsGridHtml = '';
  nonEmptys.forEach(semId => {
    const semStat = semesterStats[semId];
    const isErasmus = erasmusSet.has(semId);
    const spaStr = semStat.earnedCredits > 0
      ? (semStat.totalCredits > 0 ? (semStat.totalPoints / semStat.totalCredits).toFixed(2) : (isErasmus ? 'EX' : 'P'))
      : '-';

    const semInstances = state.instances.filter(inst => inst.semId === semId);

    let coursesHtml = '';
    semInstances.forEach(inst => {
      const course = getCourseForInstance(inst);
      if (!course) return;

      const isPassed = !!inst.passed;
      const isMinor = !!inst.isMinor;
      const isDm = !!inst.isDoubleMajor;
      const crd = Number(course.crd) || 0;

      let codeDisplay = escapeHTML(course.code || '');
      if (inst.customText && inst.customText.trim()) {
        codeDisplay = `${escapeHTML(inst.customText.trim())} <span class="export-sub-code">(${escapeHTML(course.code || '')})</span>`;
      }

      const effectiveGrade = isErasmus ? 'EX' : (inst.grade || 'AA');
      const gradeBadge = isPassed
        ? `<span class="export-course-grade">${escapeHTML(effectiveGrade)}</span>`
        : `<span class="export-course-status">⏳ ${escapeHTML(t('plannedStatus'))}</span>`;

      coursesHtml += `
        <div class="export-course-item ${isPassed ? 'passed' : 'planned'}">
          <div class="export-course-left">
            <div class="export-course-code-line">
              <span class="export-course-code">${codeDisplay}</span>
              ${isMinor ? `<span class="export-mini-badge minor">${escapeHTML(t('minorBadge'))}</span>` : ''}
              ${isDm ? `<span class="export-mini-badge dm">${escapeHTML(t('dmBadge'))}</span>` : ''}
            </div>
            <div class="export-course-name">${escapeHTML(course.name || '')}</div>
          </div>
          <div class="export-course-right">
            <span class="export-course-crd">${crd} Cr</span>
            ${gradeBadge}
          </div>
        </div>
      `;
    });

    semsGridHtml += `
      <div class="export-sem-box ${isErasmus ? 'is-erasmus' : ''}">
        <div class="export-sem-header">
          <div style="display:flex; align-items:center; gap:5px; flex-wrap:wrap;">
            <span class="export-sem-title">${escapeHTML(formatSemLabel(semId))}</span>
            ${isErasmus ? `<span class="erasmus-tag">🇪🇺 Erasmus</span>` : ''}
          </div>
          <div class="export-sem-badges">
            <span class="export-crd-badge">${semStat.scheduledCredits} Cr</span>
            <span class="export-spa-badge ${spaStr !== '-' ? 'active' : ''}">SPA: ${spaStr}</span>
          </div>
        </div>
        <div class="export-sem-courses">
          ${coursesHtml}
        </div>
      </div>
    `;
  });

  board.innerHTML = `
    <div class="export-board-header">
      <div class="export-header-left">
        <div class="export-logo">🎓 Boğaziçi Tracker</div>
        <div class="export-dept-title">${escapeHTML(deptName)}</div>
        <div class="export-badges-row">
          ${minorBadgeHtml}
          ${dmBadgeHtml}
        </div>
      </div>
      <div class="export-header-right">
        <div class="export-stat-card gpa-card">
          <div class="export-stat-label">GPA / GNO</div>
          <div class="export-stat-val gpa">${gpa}</div>
        </div>
        <div class="export-stat-card">
          <div class="export-stat-label">${escapeHTML(t('completed'))}</div>
          <div class="export-stat-val">${escapeHTML(completedText)}</div>
        </div>
        <div class="export-stat-card">
          <div class="export-stat-label">${escapeHTML(t('selectedCredits'))}</div>
          <div class="export-stat-val">${escapeHTML(selectedText)}</div>
        </div>
      </div>
    </div>
    <div class="export-sems-grid">
      ${semsGridHtml}
    </div>
    <div class="export-board-footer">
      <span>Boğaziçi Tracker • Ders & GPA Takip</span>
      <span>${new Date().toLocaleDateString()}</span>
    </div>
  `;

  return board;
}

async function exportPlanAsPng() {
  if (typeof html2canvas === 'undefined') {
    alert("html2canvas kütüphanesi henüz yüklenmedi.");
    return;
  }

  const board = createShareExportBoard();
  if (!board) {
    showToast(t('shareEmptyPlan'));
    return;
  }

  closeShareModal();
  showToast(t('shareExporting'));

  document.body.appendChild(board);

  try {
    await new Promise(resolve => setTimeout(resolve, 150));

    const canvas = await html2canvas(board, {
      scale: 2,
      useCORS: true,
      backgroundColor: '#f8fafc',
      logging: false
    });

    const dataUrl = canvas.toDataURL('image/png');
    const cleanDept = (currentDept || 'Plan').replace(/[^a-zA-Z0-9_-]/g, '_');
    const a = document.createElement('a');
    a.href = dataUrl;
    a.download = `${cleanDept}_Ders_Plani.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    showToast(t('shareExportSuccess'));
  } catch (err) {
    console.error("Görsel dışa aktarılırken hata:", err);
    showToast(t('shareExportError'));
  } finally {
    if (board && board.parentNode) {
      board.parentNode.removeChild(board);
    }
  }
}

function updateSandboxBannerUI() {
  const banner = document.getElementById('sandboxBanner');
  const bannerText = document.getElementById('sandboxBannerText');
  const saveBtn = document.getElementById('sandboxSaveBtn');
  const exitBtn = document.getElementById('sandboxExitBtn');
  const deptSelect = document.getElementById('deptSelect');

  if (deptSelect) {
    deptSelect.disabled = isSandboxMode;
    deptSelect.title = isSandboxMode ? t('sandboxDeptDisabledTooltip') : '';
  }

  if (!banner) return;

  if (isSandboxMode) {
    banner.style.display = 'block';
    if (bannerText) bannerText.innerText = t('sandboxBannerText');
    if (saveBtn) saveBtn.innerHTML = `<span>${escapeHTML(t('sandboxSaveBtn'))}</span>`;
    if (exitBtn) exitBtn.innerHTML = `<span>${escapeHTML(t('sandboxExitBtn'))}</span>`;
  } else {
    banner.style.display = 'none';
  }
}

function loadSharedPlanFromHash() {
  if (!window.location.hash) return false;
  const hash = window.location.hash;
  const match = hash.match(/#plan=([^&]+)/);
  if (!match) return false;

  const rawCompressed = match[1];
  if (!rawCompressed || typeof LZString === 'undefined') return false;

  try {
    const decompressed = LZString.decompressFromEncodedURIComponent(rawCompressed);
    if (!decompressed) return false;
    const payload = JSON.parse(decompressed);
    if (!payload || !payload.dept) return false;

    const targetDept = payload.dept;
    if (!departmentsData || !departmentsData[targetDept]) {
      console.warn("Paylaşılan bölüm sistemde bulunamadı:", targetDept);
      return false;
    }

    if (!isSandboxMode) {
      realUserGlobalStateBackup = JSON.parse(JSON.stringify(globalState));
      realUserDeptBackup = currentDept;
    }

    isSandboxMode = true;
    currentDept = targetDept;
    const incomingInstances = Array.isArray(payload.instances)
      ? payload.instances
      : (Array.isArray(payload.plan) ? payload.plan : (payload.plan?.instances || []));

    // Deep copy ile RAM'de izole et; localStorage'a yazılmaz
    globalState = JSON.parse(JSON.stringify(globalState));
    globalState[targetDept] = {
      instances: incomingInstances,
      selectedMinorId: payload.minor || null,
      selectedDmId: payload.dm || null
    };

    updateSandboxBannerUI();
    return true;
  } catch (err) {
    console.warn("Paylaşılan plan çözümlenirken hata:", err);
    return false;
  }
}

function saveSandboxToMyPlan() {
  if (!isSandboxMode) return;
  if (!confirm(t('sandboxSaveConfirm'))) {
    return;
  }

  isSandboxMode = false;
  realUserGlobalStateBackup = null;
  realUserDeptBackup = null;

  saveGlobalState();
  updateSandboxBannerUI();
  history.replaceState(null, '', window.location.pathname + window.location.search);
  showToast(t('sandboxSavedSuccess'));
}

function exitSandboxMode() {
  history.replaceState(null, '', window.location.pathname + window.location.search);
  isSandboxMode = false;

  if (realUserGlobalStateBackup) {
    globalState = realUserGlobalStateBackup;
    currentDept = realUserDeptBackup || Object.keys(departmentsData)[0] || 'math';
    realUserGlobalStateBackup = null;
    realUserDeptBackup = null;
  } else {
    globalState = JSON.parse(localStorage.getItem('boun_multi_dept_gpa_state')) || {};
    currentDept = localStorage.getItem('boun_active_dept') || Object.keys(departmentsData)[0] || 'math';
  }

  updateSandboxBannerUI();
  populateDepartmentSelect();
  populateMinorModalOptions();
  populateDmModalOptions();
  initUI();
  showToast(t('sandboxExitSuccess'));
}

window.addEventListener('hashchange', () => {
  if (window.location.hash && window.location.hash.includes('#plan=')) {
    if (loadSharedPlanFromHash()) {
      populateDepartmentSelect();
      initUI();
    }
  }
});

let parsedTranscriptTerms = [];
let transcriptPreviewRows = [];

function openTranscriptModal() {
  closeToolsDropdown();
  const modal = document.getElementById('transcriptModal');
  if (!modal) return;

  const input = document.getElementById('transcriptInput');
  const previewArea = document.getElementById('transcriptPreviewArea');
  const applyBtn = document.getElementById('transcriptApplyBtn');

  if (input) {
    input.value = '';
    input.classList.remove('collapsed');
  }
  if (previewArea) {
    previewArea.innerHTML = '';
    previewArea.style.display = 'none';
  }
  if (applyBtn) applyBtn.disabled = true;
  parsedTranscriptTerms = [];
  transcriptPreviewRows = [];

  modal.classList.remove('has-preview');
  modal.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeTranscriptModal() {
  const modal = document.getElementById('transcriptModal');
  if (modal) {
    modal.classList.remove('open');
    document.body.style.overflow = '';
  }
}

function handleTranscriptBackdropClick(event) {
  if (event.target && event.target.id === 'transcriptModal') {
    closeTranscriptModal();
  }
}

async function extractTextFromTranscriptPdf(file) {
  const arrayBuffer = await file.arrayBuffer();
  const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
  const pdfDoc = await loadingTask.promise;
  let fullText = '';

  for (let pageNum = 1; pageNum <= pdfDoc.numPages; pageNum++) {
    const page = await pdfDoc.getPage(pageNum);
    const textContent = await page.getTextContent();

    // Satır gruplama toleransı: ±6px (e-Devlet PDF tablosundaki dikey kaymaları dengeler)
    const lineBuckets = [];

    textContent.items.forEach(item => {
      const str = item.str;
      if (!str || !str.trim()) return;
      const x = item.transform[4];
      const y = item.transform[5];

      let bucket = lineBuckets.find(b => Math.abs(b.y - y) <= 6);
      if (!bucket) {
        bucket = { y: y, items: [] };
        lineBuckets.push(bucket);
      }
      bucket.items.push({ x: x, str: str });
    });

    // Satırları dikeyde yukarıdan aşağıya (PDF'te Y alttan yukarıya artar, bu yüzden azalan sırada sıralanır)
    lineBuckets.sort((a, b) => b.y - a.y);

    const pageLines = lineBuckets.map(bucket => {

      bucket.items.sort((a, b) => a.x - b.x);

      return bucket.items.map(it => it.str.trim()).filter(s => s.length > 0).join(' ');
    }).filter(line => line.length > 0);

    fullText += pageLines.join('\n') + '\n\n';
  }

  return fullText;
}

async function handleTranscriptFileSelected(event) {
  const file = event.target.files && event.target.files[0];
  if (!file) return;

  const uploadBox = document.getElementById('transcriptUploadBox');
  const input = document.getElementById('transcriptInput');
  const previewBtn = document.getElementById('transcriptPreviewBtn');
  const fileInput = document.getElementById('transcriptFileInput');

  if (file.type !== 'application/pdf' && !file.name.toLowerCase().endsWith('.pdf')) {
    alert(t('transcriptPdfError'));
    if (fileInput) fileInput.value = '';
    return;
  }

  if (typeof pdfjsLib === 'undefined') {
    alert('PDF okuyucu kütüphanesi yüklenemedi. Lütfen internet bağlantınızı kontrol edin veya metin olarak yapıştırın.');
    return;
  }

  showToast(t('transcriptReadingPdf'));

  try {
    const fullText = await extractTextFromTranscriptPdf(file);

    if (!fullText.trim()) {
      throw new Error("Boş PDF");
    }

    if (input) {
      input.value = fullText.trim();
    }

    previewTranscript();
    showToast('✓ PDF başarıyla okundu!');
  } catch (err) {
    console.error("PDF okuma hatası:", err);
    alert(t('transcriptPdfError'));
  } finally {
    if (fileInput) fileInput.value = '';
  }
}

(function initTranscriptDragAndDrop() {
  document.addEventListener('DOMContentLoaded', () => {
    const uploadBox = document.getElementById('transcriptUploadBox');
    if (!uploadBox) return;

    ['dragenter', 'dragover'].forEach(eventName => {
      uploadBox.addEventListener(eventName, (e) => {
        e.preventDefault();
        e.stopPropagation();
        uploadBox.classList.add('drag-over');
      }, false);
    });

    ['dragleave', 'drop'].forEach(eventName => {
      uploadBox.addEventListener(eventName, (e) => {
        e.preventDefault();
        e.stopPropagation();
        uploadBox.classList.remove('drag-over');
      }, false);
    });

    uploadBox.addEventListener('drop', (e) => {
      const dt = e.dataTransfer;
      const files = dt.files;
      if (files && files.length > 0) {
        handleTranscriptFileSelected({ target: { files: files } });
      }
    }, false);
  });
})();

function handleTranscriptInputChange() {
  const modal = document.getElementById('transcriptModal');
  const input = document.getElementById('transcriptInput');
  const applyBtn = document.getElementById('transcriptApplyBtn');
  const previewArea = document.getElementById('transcriptPreviewArea');
  if (!input || !input.value.trim()) {
    if (modal) modal.classList.remove('has-preview');
    if (input) input.classList.remove('collapsed');
    if (applyBtn) applyBtn.disabled = true;
    if (previewArea) {
      previewArea.innerHTML = '';
      previewArea.style.display = 'none';
    }
    transcriptPreviewRows = [];
  }
}

function parseBounTranscript(rawText) {
  if (!rawText || typeof rawText !== 'string') return [];

  const stopIndex = rawText.search(/\b(?:AÇIKLAMALAR|Açıklamalar|EXPLANATIONS|Explanations|NOT BAREM[İI]|Not Barem[İi]|GRADE SCALE|Grade Scale)\b/i);
  const textToProcess = (stopIndex !== -1) ? rawText.substring(0, stopIndex) : rawText;

  const lines = textToProcess.split(/\r?\n/);
  const terms = [];
  let currentTerm = null;

  const termHeaderRegex = /(?:Academic Year\s*:\s*)?(\b20\d{2})(?:\s*[\/\-]\s*20\d{2})?\s*[\/\-]?\s*(?:Semester\s*:\s*)?([123]|Güz(?:\s+Dönemi)?|Bahar(?:\s+Dönemi)?|Yaz(?:\s+Okulu)?|Fall|Spring|Summer)\b/i;

  const courseCodeRegex = /\*?\b([A-Z]{2,5})\s*(\d{3}[A-Z]?)\b/;

  // e-Devlet istatistik satırı regex:

  const edevletStatRegex = /\b[ZS]\s+(?:İng\.|Tür\.|[A-Za-zÇĞİÖŞÜçğıöşü\.]+)\s+\d+(?:\.\d+)?\s+\d+(?:\.\d+)?\s+(\d+(?:\.\d+)?)\s+\d+(?:\.\d+)?\s+(?:(AA|BA|BB|CB|CC|DC|DD|F|FF|P|S|U|W|EX|I|NP)\s+)?(?:[\d.]+\s+)?(G|K|HAZ|--)(?:\b|(?<=--))/i;

  const EXCLUDED_PREFIXES = new Set(['SFL', 'YOKTR', 'YADYOK', 'PREP', 'HAZ']);
  const VALID_GRADES = new Set(['AA', 'BA', 'BB', 'CB', 'CC', 'DC', 'DD', 'F', 'FF', 'P', 'S', 'U', 'W', 'EX', 'I', 'NP']);
  const PASSING_GRADES = new Set(['AA', 'BA', 'BB', 'CB', 'CC', 'DC', 'DD', 'P', 'S', 'EX']);
  const FAILING_GRADES = new Set(['F', 'FF', 'U', 'W']);

  for (let i = 0; i < lines.length; i++) {
    const trimmed = lines[i].trim();
    if (!trimmed) continue;

    const termMatch = trimmed.match(termHeaderRegex);
    if (termMatch) {
      const yearStart = parseInt(termMatch[1], 10);
      const semStr = termMatch[2].toLowerCase();
      let semNum = 1;
      if (semStr.includes('bahar') || semStr.includes('spring') || semStr === '2') semNum = 2;
      else if (semStr.includes('yaz') || semStr.includes('summer') || semStr === '3') semNum = 3;

      currentTerm = {
        raw: trimmed,
        year: yearStart,
        semNum: semNum,
        courses: []
      };
      terms.push(currentTerm);
      continue;
    }

    if (!currentTerm) continue;

    if (/bu\s+dönem\s+ders\s+almamıştır/i.test(trimmed)) {
      continue;
    }

    const cMatch = trimmed.match(courseCodeRegex);
    if (cMatch) {
      const prefix = cMatch[1].toUpperCase();
      const codeNum = cMatch[2].toUpperCase();

      if (EXCLUDED_PREFIXES.has(prefix)) {
        continue;
      }

      const fullCode = `${prefix} ${codeNum}`;

      let blockText = trimmed;
      let consumedLines = 0;
      let statMatch = trimmed.match(edevletStatRegex);

      if (!statMatch) {
        const blockLines = [trimmed];
        for (let j = 1; j <= 3 && (i + j) < lines.length; j++) {
          const nextLine = lines[i + j].trim();
          if (!nextLine) continue;
          if (nextLine.match(termHeaderRegex)) break;
          const nextCMatch = nextLine.match(courseCodeRegex);
          if (nextCMatch && !EXCLUDED_PREFIXES.has(nextCMatch[1].toUpperCase()) && !nextLine.match(edevletStatRegex)) {
            break;
          }
          blockLines.push(nextLine);
          consumedLines = j;
          if (nextLine.match(edevletStatRegex)) {
            break;
          }
        }
        blockText = blockLines.join(' ');
        statMatch = blockText.match(edevletStatRegex);
      }

      if (statMatch) {

        const ukCredit = parseFloat(statMatch[1]);
        const gradeCandidate = (statMatch[2] || '').toUpperCase();
        const durum = (statMatch[3] || '').toUpperCase();

        let foundGrade = '';
        if (VALID_GRADES.has(gradeCandidate)) {
          foundGrade = gradeCandidate;
        }

        if (durum === '--' || !foundGrade) {
          foundGrade = '';
        }

        let isPassed = false;
        if (FAILING_GRADES.has(foundGrade) || durum === '--' || durum === 'K' || !foundGrade) {
          isPassed = false;
        } else if (PASSING_GRADES.has(foundGrade) || durum === 'G') {
          isPassed = true;
        }

        let title = '';
        const codePos = blockText.indexOf(cMatch[0]);
        if (codePos !== -1 && statMatch.index > codePos) {
          title = blockText.substring(codePos + cMatch[0].length, statMatch.index).trim();
        }

        currentTerm.courses.push({
          code: fullCode,
          title: title,
          grade: foundGrade,
          credit: !isNaN(ukCredit) ? ukCredit : 3,
          passed: isPassed
        });

        i += consumedLines;
        continue;
      }

      const tokens = trimmed.split(/[\s\t]+/);
      let foundGrade = '';
      let gradeIdx = -1;

      for (let k = tokens.length - 1; k >= 1; k--) {
        const tok = tokens[k].toUpperCase();
        if (tok === 'I' && k > 1 && !tokens[k - 1].match(/^\d(?:\.\d)?$/)) {
          continue;
        }
        if (VALID_GRADES.has(tok)) {
          foundGrade = tok;
          gradeIdx = k;
          break;
        }
      }

      let foundCredit = null;
      let crdIdx = -1;
      for (let k = (gradeIdx !== -1 ? gradeIdx - 1 : tokens.length - 1); k >= 1; k--) {
        const num = parseFloat(tokens[k]);
        if (!isNaN(num) && num >= 0 && num <= 10 && tokens[k].match(/^\d(?:\.\d)?$/)) {
          foundCredit = num;
          crdIdx = k;
          if (k > 1 && tokens[k - 1].match(/^\d(?:\.\d)?$/)) {
            foundCredit = parseFloat(tokens[k - 1]);
            crdIdx = k - 1;
          }
          break;
        }
      }

      let titleTokens = [];
      const codeTokenCount = (tokens[0].includes(codeNum)) ? 1 : 2;
      const endTitleIdx = (crdIdx !== -1) ? crdIdx : (gradeIdx !== -1 ? gradeIdx : tokens.length);
      if (endTitleIdx > codeTokenCount) {
        titleTokens = tokens.slice(codeTokenCount, endTitleIdx);
      }
      const courseTitle = titleTokens.length > 0 ? titleTokens.join(' ').trim() : '';

      let isPassed = false;
      if (PASSING_GRADES.has(foundGrade)) {
        isPassed = true;
      }

      currentTerm.courses.push({
        code: fullCode,
        title: courseTitle,
        grade: foundGrade,
        credit: foundCredit !== null ? foundCredit : 3,
        passed: isPassed
      });
    }
  }

  const validTerms = terms.filter(t => t.courses.length > 0);
  if (validTerms.length === 0) return [];

  validTerms.sort((a, b) => {
    if (a.year !== b.year) return a.year - b.year;
    return a.semNum - b.semNum;
  });

  const firstTerm = validTerms[0];

  if (firstTerm.semNum === 3) {
    firstTerm.targetSem = '0.3 (Yaz)';

    const firstFall = validTerms.find(t => t.semNum === 1);
    const startYear = firstFall ? firstFall.year : (firstTerm.year + 1);

    validTerms.slice(1).forEach(t => {
      const yearIndex = (t.year - startYear) + 1;
      if (t.semNum === 3) {
        t.targetSem = `${yearIndex}.3 (Yaz)`;
      } else {
        t.targetSem = `${yearIndex}.${t.semNum}`;
      }
    });
  } else {
    const startYear = firstTerm.year;
    validTerms.forEach(t => {
      const yearIndex = (t.year - startYear) + 1;
      if (t.semNum === 3) {
        t.targetSem = `${yearIndex}.3 (Yaz)`;
      } else {
        t.targetSem = `${yearIndex}.${t.semNum}`;
      }
    });
  }

  return validTerms;
}

function getAllAvailableSemKeys() {
  const allSems = [];
  const activeYearStructure = getEffectiveYearStructure();
  activeYearStructure.forEach(y => {
    y.sems.forEach(s => {
      if (!allSems.includes(s)) allSems.push(s);
    });
  });
  if (allSems.length === 0) {
    allSems.push('0.1', '0.2', '0.3 (Yaz)');
    for (let yr = 1; yr <= 6; yr++) {
      allSems.push(`${yr}.1`, `${yr}.2`, `${yr}.3 (Yaz)`);
    }
  }
  return allSems;
}

function previewTranscript() {
  const modal = document.getElementById('transcriptModal');
  const input = document.getElementById('transcriptInput');
  const previewArea = document.getElementById('transcriptPreviewArea');
  const applyBtn = document.getElementById('transcriptApplyBtn');
  if (!input || !previewArea) return;

  const rawText = input.value.trim();
  if (!rawText) {
    if (modal) modal.classList.remove('has-preview');
    if (input) input.classList.remove('collapsed');
    previewArea.style.display = 'block';
    previewArea.innerHTML = `<div class="transcript-guide-box" style="background:#fef2f2;border-color:#fecaca;color:#991b1b;">⚠️ ${escapeHTML(t('transcriptNoCoursesFound'))}</div>`;
    if (applyBtn) applyBtn.disabled = true;
    transcriptPreviewRows = [];
    return;
  }

  parsedTranscriptTerms = parseBounTranscript(rawText);

  if (parsedTranscriptTerms.length === 0) {
    if (modal) modal.classList.remove('has-preview');
    if (input) input.classList.remove('collapsed');
    previewArea.style.display = 'block';
    previewArea.innerHTML = `<div class="transcript-guide-box" style="background:#fef2f2;border-color:#fecaca;color:#991b1b;">⚠️ ${escapeHTML(t('transcriptNoCoursesFound'))}</div>`;
    if (applyBtn) applyBtn.disabled = true;
    transcriptPreviewRows = [];
    return;
  }

  if (modal) modal.classList.add('has-preview');
  if (input) input.classList.add('collapsed');

  const activeDmCourses = getActiveDmCourseList();
  const majorCourses = departmentsData[currentDept]?.courses || [];
  const baseProgramCourses = activeDmCourses.length > 0 ? activeDmCourses : majorCourses;
  const minorCourses = getActiveMinorCourseList();
  const allEligible = [...baseProgramCourses, ...minorCourses];

  const PASSING_GRADES = new Set(['AA', 'BA', 'BB', 'CB', 'CC', 'DC', 'DD', 'P', 'S', 'EX']);
  const usedIds = new Set();
  const rows = [];
  let rowSeq = 0;

  parsedTranscriptTerms.forEach(term => {
    term.courses.forEach(c => {
      rowSeq++;
      const normCode = c.code.replace(/\s+/g, '').toUpperCase();
      const rawGrade = (c.grade || '').toUpperCase();

      let isPassed = false;
      let effectiveGrade = '';

      if (c.passed !== undefined) {
        isPassed = !!c.passed;
        effectiveGrade = c.grade || '';
      } else if (PASSING_GRADES.has(rawGrade)) {
        isPassed = true;
        effectiveGrade = rawGrade;
      } else if (rawGrade === 'F' || rawGrade === 'FF' || rawGrade === 'U') {
        isPassed = false;
        effectiveGrade = 'F';
      } else {
        isPassed = false;
        effectiveGrade = '';
      }

      let matchType = 'extra';
      let matchedCourseId = '__NEW_ELECTIVE__';

      const directMatch = allEligible.find(curC => {
        if (!curC.code || usedIds.has(curC.id)) return false;
        const curNorm = curC.code.replace(/\s+/g, '').toUpperCase();
        if (curNorm === normCode) return true;
        return curC.code.split(/[\/,]/).some(part => {
          const p = part.trim().replace(/\s+/g, '').toUpperCase();
          return p === normCode || (normCode.startsWith(p) && p.length >= 4);
        });
      });

      if (directMatch) {
        usedIds.add(directMatch.id);
        matchType = 'curriculum';
        matchedCourseId = directMatch.id;
      } else {

        const electiveSlot = allEligible.find(curC => curC.isElective && !usedIds.has(curC.id) && curC.sem === term.targetSem)
          || allEligible.find(curC => curC.isElective && !usedIds.has(curC.id));
        if (electiveSlot) {
          usedIds.add(electiveSlot.id);
          matchType = 'elective';
          matchedCourseId = electiveSlot.id;
        } else {
          matchType = 'extra';
          matchedCourseId = '__NEW_ELECTIVE__';
        }
      }

      rows.push({
        id: `tr_row_${rowSeq}`,
        termKey: term.targetSem,
        termRaw: term.raw,
        code: c.code,
        title: c.title,
        credit: c.credit,
        matchedCourseId: matchedCourseId,
        matchType: matchType,
        grade: effectiveGrade,
        passed: isPassed,
        ignored: false
      });
    });
  });

  transcriptPreviewRows = rows;
  renderTranscriptPreviewTable();
}

function renderTranscriptPreviewTable() {
  const previewArea = document.getElementById('transcriptPreviewArea');
  const applyBtn = document.getElementById('transcriptApplyBtn');
  if (!previewArea) return;

  if (!transcriptPreviewRows || transcriptPreviewRows.length === 0) {
    const modal = document.getElementById('transcriptModal');
    if (modal) modal.classList.remove('has-preview');
    previewArea.style.display = 'none';
    if (applyBtn) applyBtn.disabled = true;
    return;
  }

  const activeDmCourses = getActiveDmCourseList();
  const majorCourses = departmentsData[currentDept]?.courses || [];
  const baseProgramCourses = activeDmCourses.length > 0 ? activeDmCourses : majorCourses;
  const minorCourses = getActiveMinorCourseList();
  const allEligible = [...baseProgramCourses, ...minorCourses];

  const allAvailableSems = getAllAvailableSemKeys();
  const activeCount = transcriptPreviewRows.filter(r => !r.ignored).length;
  const uniqueTerms = new Set(transcriptPreviewRows.filter(r => !r.ignored).map(r => r.termKey)).size;

  const summaryHtml = `
    <div class="transcript-summary-badge">
      <span>${escapeHTML(t('transcriptSummary')(uniqueTerms, activeCount))}</span>
      <div class="transcript-toolbar">
        <button type="button" class="transcript-shift-btn" onclick="shiftAllTranscriptTerms(-1)" title="-1 Dönem Kaydır">
          ${escapeHTML(t('transcriptShiftDown'))}
        </button>
        <button type="button" class="transcript-shift-btn" onclick="shiftAllTranscriptTerms(1)" title="+1 Dönem Kaydır">
          ${escapeHTML(t('transcriptShiftUp'))}
        </button>
      </div>
    </div>
  `;

  const GRADE_OPTIONS_LIST = ['', 'AA', 'BA', 'BB', 'CB', 'CC', 'DC', 'DD', 'F', 'P', 'EX'];

  const regularCourses = allEligible.filter(c => !c.isElective);
  const electiveSlots = allEligible.filter(c => !!c.isElective);

  const groupOrder = [];
  const groupsMap = {};

  transcriptPreviewRows.forEach(row => {
    const rawKey = row.termRaw || row.termKey;
    if (!groupsMap[rawKey]) {
      groupsMap[rawKey] = {
        termRaw: rawKey,
        currentSemKey: row.termKey,
        rows: []
      };
      groupOrder.push(rawKey);
    }
    groupsMap[rawKey].rows.push(row);
  });

  const groupsHtml = groupOrder.map(rawKey => {
    const group = groupsMap[rawKey];
    const groupRows = group.rows;
    const activeGroupRows = groupRows.filter(r => !r.ignored);
    const totalGroupCredits = activeGroupRows.reduce((sum, r) => sum + (Number(r.credit) || 0), 0);
    const currentGroupSem = groupRows[0]?.termKey || group.currentSemKey;

    const groupSemSelectOptions = allAvailableSems.map(s => {
      const isSel = (s === currentGroupSem);
      return `<option value="${escapeHTML(s)}" ${isSel ? 'selected' : ''}>${escapeHTML(formatSemLabel(s))}</option>`;
    }).join('');

    const groupRowsHtml = groupRows.map(row => {

      const semOptionsHtml = allAvailableSems.map(s => {
        const isSel = (s === row.termKey);
        return `<option value="${escapeHTML(s)}" ${isSel ? 'selected' : ''}>${escapeHTML(formatSemLabel(s))}</option>`;
      }).join('');

      let matchOptionsHtml = `<option value="__NEW_ELECTIVE__" ${row.matchedCourseId === '__NEW_ELECTIVE__' ? 'selected' : ''}>${escapeHTML(t('transcriptNewElectiveOpt'))}</option>`;

      if (regularCourses.length > 0) {
        matchOptionsHtml += `<optgroup label="── Müfredat Dersleri ──">`;
        regularCourses.forEach(c => {
          const isSel = (c.id === row.matchedCourseId);
          matchOptionsHtml += `<option value="${escapeHTML(c.id)}" ${isSel ? 'selected' : ''}>${escapeHTML(c.code)} - ${escapeHTML(c.name)}</option>`;
        });
        matchOptionsHtml += `</optgroup>`;
      }

      if (electiveSlots.length > 0) {
        matchOptionsHtml += `<optgroup label="── Seçmeli Slotları ──">`;
        electiveSlots.forEach(c => {
          const isSel = (c.id === row.matchedCourseId);
          matchOptionsHtml += `<option value="${escapeHTML(c.id)}" ${isSel ? 'selected' : ''}>⚡ ${escapeHTML(c.code)} (${formatSemLabel(c.sem)})</option>`;
        });
        matchOptionsHtml += `</optgroup>`;
      }

      const gradeOptionsHtml = GRADE_OPTIONS_LIST.map(g => {
        const isSel = (g === row.grade);
        const label = g === '' ? t('transcriptGradeNone') : (g === 'EX' ? 'EX (Transfer)' : g);
        return `<option value="${escapeHTML(g)}" ${isSel ? 'selected' : ''}>${escapeHTML(label)}</option>`;
      }).join('');

      const rowClass = row.ignored ? 'row-ignored' : '';

      return `
        <tr class="${rowClass}" data-row-id="${escapeHTML(row.id)}">
          <td>
            <span class="tr-course-badge">${escapeHTML(row.code)}</span>
            <span class="tr-course-title-sub" title="${escapeHTML(row.title || '')}">${escapeHTML(row.title || row.code)}</span>
            <span style="font-size:0.72rem;color:#64748b;font-weight:600;">${row.credit} Cr</span>
          </td>
          <td>
            <select class="tr-select tr-sem-select" onchange="handleTranscriptRowFieldChange('${row.id}', 'termKey', this.value)" ${row.ignored ? 'disabled' : ''}>
              ${semOptionsHtml}
            </select>
          </td>
          <td>
            <select class="tr-select tr-match-select" onchange="handleTranscriptRowFieldChange('${row.id}', 'matchedCourseId', this.value)" ${row.ignored ? 'disabled' : ''}>
              ${matchOptionsHtml}
            </select>
          </td>
          <td>
            <select class="tr-select tr-grade-select" onchange="handleTranscriptRowGradeChange('${row.id}', this.value)" ${row.ignored ? 'disabled' : ''}>
              ${gradeOptionsHtml}
            </select>
          </td>
          <td style="text-align: center;">
            <label class="tr-check-label">
              <input type="checkbox" ${row.passed ? 'checked' : ''} onchange="handleTranscriptRowFieldChange('${row.id}', 'passed', this.checked)" ${row.ignored ? 'disabled' : ''}>
            </label>
          </td>
          <td style="text-align: center;">
            <button type="button" class="tr-del-btn" onclick="toggleTranscriptRowIgnored('${row.id}')" title="${row.ignored ? 'Geri Al' : t('transcriptColAction')}">
              ${row.ignored ? '↩️' : '✕'}
            </button>
          </td>
        </tr>
      `;
    }).join('');

    const safeRawKey = escapeHTML(rawKey).replace(/'/g, "\\'");

    return `
      <div class="transcript-term-card">
        <div class="transcript-term-header">
          <div class="transcript-term-info">
            <span class="transcript-term-title">📅 ${escapeHTML(rawKey)}</span>
            <span class="transcript-crd-pill">${escapeHTML(t('transcriptTotalCredits')(totalGroupCredits))}</span>
          </div>
          <div class="transcript-term-controls">
            <span style="font-size:0.75rem;font-weight:700;color:#475569;">${escapeHTML(t('transcriptTargetTerm'))}:</span>
            <select class="tr-group-sem-select" onchange="handleTranscriptGroupTermChange('${safeRawKey}', this.value)">
              ${groupSemSelectOptions}
            </select>
            <button type="button" class="tr-group-shift-btn" onclick="shiftTranscriptGroupTerms('${safeRawKey}', -1)" title="-1 Dönem Kaydır">
              ${escapeHTML(t('transcriptGroupShiftDown'))}
            </button>
            <button type="button" class="tr-group-shift-btn" onclick="shiftTranscriptGroupTerms('${safeRawKey}', 1)" title="+1 Dönem Kaydır">
              ${escapeHTML(t('transcriptGroupShiftUp'))}
            </button>
          </div>
        </div>
        <div class="transcript-table-wrap">
          <table class="transcript-table">
            <thead>
              <tr>
                <th>${escapeHTML(t('transcriptColCourse'))}</th>
                <th>${escapeHTML(t('transcriptColTerm'))}</th>
                <th>${escapeHTML(t('transcriptColMatch'))}</th>
                <th>${escapeHTML(t('transcriptColGrade'))}</th>
                <th style="text-align:center;">${escapeHTML(t('transcriptColStatus'))}</th>
                <th style="text-align:center;">${escapeHTML(t('transcriptColAction'))}</th>
              </tr>
            </thead>
            <tbody>
              ${groupRowsHtml}
            </tbody>
          </table>
        </div>
      </div>
    `;
  }).join('');

  previewArea.innerHTML = `
    ${summaryHtml}
    <div class="transcript-groups-container">
      ${groupsHtml}
    </div>
  `;
  previewArea.style.display = 'flex';
  if (applyBtn) applyBtn.disabled = (activeCount === 0);
}

function handleTranscriptGroupTermChange(termRaw, newSemKey) {
  transcriptPreviewRows.forEach(row => {
    if ((row.termRaw || row.termKey) === termRaw) {
      row.termKey = newSemKey;
    }
  });
  renderTranscriptPreviewTable();
}

function shiftTranscriptGroupTerms(termRaw, direction) {
  const allAvailableSems = getAllAvailableSemKeys();
  const groupRows = transcriptPreviewRows.filter(row => (row.termRaw || row.termKey) === termRaw);
  if (groupRows.length === 0) return;

  const currentSem = groupRows[0].termKey;
  const currentIdx = allAvailableSems.indexOf(currentSem);
  if (currentIdx !== -1) {
    const newIdx = currentIdx + direction;
    if (newIdx >= 0 && newIdx < allAvailableSems.length) {
      const newSemKey = allAvailableSems[newIdx];
      groupRows.forEach(row => {
        row.termKey = newSemKey;
      });
      renderTranscriptPreviewTable();
    }
  }
}

function handleTranscriptRowFieldChange(rowId, field, value) {
  const row = transcriptPreviewRows.find(r => r.id === rowId);
  if (!row) return;
  row[field] = value;
}

function handleTranscriptRowGradeChange(rowId, newGrade) {
  const row = transcriptPreviewRows.find(r => r.id === rowId);
  if (!row) return;
  row.grade = newGrade;
  const PASSING_GRADES = new Set(['AA', 'BA', 'BB', 'CB', 'CC', 'DC', 'DD', 'P', 'S', 'EX']);
  if (PASSING_GRADES.has(newGrade.toUpperCase())) {
    row.passed = true;
  } else {
    row.passed = false;
  }
  renderTranscriptPreviewTable();
}

function toggleTranscriptRowIgnored(rowId) {
  const row = transcriptPreviewRows.find(r => r.id === rowId);
  if (!row) return;
  row.ignored = !row.ignored;
  renderTranscriptPreviewTable();
}

function shiftAllTranscriptTerms(direction) {
  if (!transcriptPreviewRows || transcriptPreviewRows.length === 0) return;
  const allAvailableSems = getAllAvailableSemKeys();

  transcriptPreviewRows.forEach(row => {
    const currentIdx = allAvailableSems.indexOf(row.termKey);
    if (currentIdx !== -1) {
      const newIdx = currentIdx + direction;
      if (newIdx >= 0 && newIdx < allAvailableSems.length) {
        row.termKey = allAvailableSems[newIdx];
      }
    }
  });

  renderTranscriptPreviewTable();
}

function applyParsedTranscript() {
  if (!transcriptPreviewRows || transcriptPreviewRows.length === 0) return;
  const activeRows = transcriptPreviewRows.filter(r => !r.ignored);
  if (activeRows.length === 0) return;

  const state = getDeptState(currentDept);
  if (state.instances && state.instances.length > 0) {
    if (!confirm(t('transcriptApplyConfirm'))) {
      return;
    }
  }

  const activeDmCourses = getActiveDmCourseList();
  const majorCourses = departmentsData[currentDept]?.courses || [];
  const baseProgramCourses = activeDmCourses.length > 0 ? activeDmCourses : majorCourses;
  const minorCourses = getActiveMinorCourseList();
  const allEligible = [...baseProgramCourses, ...minorCourses];

  const newInstances = [];

  activeRows.forEach(row => {
    const targetSem = row.termKey;
    const isPassed = !!row.passed;
    const grade = row.grade || (isPassed ? 'AA' : '');
    const cleanNormCode = row.code.replace(/\s+/g, '').toUpperCase();

    if (row.matchedCourseId && row.matchedCourseId !== '__NEW_ELECTIVE__') {
      const matchedCourse = allEligible.find(c => c.id === row.matchedCourseId);
      if (matchedCourse) {
        const isElectiveSlot = !!matchedCourse.isElective;

        const customText = isElectiveSlot ? row.code : '';

        newInstances.push({
          instanceId: 'inst_tr_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5),
          courseId: matchedCourse.id,
          semId: targetSem,
          passed: isPassed,
          grade: grade,
          customText: customText,
          isMinor: !!matchedCourse.isMinor,
          isDoubleMajor: !!matchedCourse.isDoubleMajor
        });
        return;
      }
    }

    const customCourseObj = {
      id: 'tr_extra_' + cleanNormCode,
      code: row.code,
      name: row.title || row.code,
      crd: row.credit || 3,
      isElective: true
    };

    newInstances.push({
      instanceId: 'inst_tr_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5),
      courseId: customCourseObj.id,
      semId: targetSem,
      passed: isPassed,
      grade: grade,
      customText: row.code,
      minorCourse: customCourseObj,
      isMinor: false,
      isDoubleMajor: false
    });
  });

  state.instances = newInstances;
  saveGlobalState();
  initUI();
  closeTranscriptModal();
  showToast(t('transcriptAppliedSuccess')(newInstances.length));
}

function findCourseByCode(code) {
  if (!code) return null;
  const clean = code.replace(/\s+/g, '').toUpperCase();
  for (const dKey of Object.keys(departmentsData)) {
    const list = departmentsData[dKey].courses || [];
    const found = list.find(c => c.code && c.code.replace(/\s+/g, '').toUpperCase() === clean);
    if (found) return found;
  }
  return null;
}

function getMinorCourseList(minorKey) {
  if (!minorKey || !minorsData[minorKey]) return [];
  const minor = minorsData[minorKey];
  const result = [];
  const addedCodes = new Set();

  if (Array.isArray(minor.compulsoryCourses)) {
    minor.compulsoryCourses.forEach(c => {
      const cleanCode = (c.code || '').trim();
      if (!cleanCode || addedCodes.has(cleanCode.toUpperCase())) return;
      addedCodes.add(cleanCode.toUpperCase());
      const ref = findCourseByCode(cleanCode);
      result.push({
        id: `minor_${minorKey}_${cleanCode.replace(/[^a-zA-Z0-9]/g, '_')}`,
        code: cleanCode,
        name: c.name || (ref ? ref.name : cleanCode),
        crd: Number(c.crd) || (ref ? Number(ref.crd) : 3),
        isMinor: true,
        isElective: false
      });
    });
  }

  if (Array.isArray(minor.electivePools)) {
    minor.electivePools.forEach(pool => {
      const firstOpt = (pool.options || []).find(opt => !addedCodes.has(opt.trim().toUpperCase()));
      const optCode = firstOpt || (pool.poolName || 'Seçmeli');
      addedCodes.add(optCode.toUpperCase());
      const ref = findCourseByCode(optCode);
      result.push({
        id: `minor_${minorKey}_${optCode.replace(/[^a-zA-Z0-9]/g, '_')}`,
        code: optCode,
        name: (ref ? ref.name : `${pool.poolName || 'Yandal Seçmeli Dersi'}`),
        crd: (ref ? Number(ref.crd) : 3),
        isMinor: true,
        isElective: true
      });
    });
  }

  const targetTotal = minor.requirements?.totalCourses || 6;
  if (Array.isArray(minor.electiveOptions)) {
    for (const optCode of minor.electiveOptions) {
      if (result.length >= targetTotal) break;
      const cleanCode = (optCode || '').trim();
      if (!cleanCode || addedCodes.has(cleanCode.toUpperCase())) continue;
      addedCodes.add(cleanCode.toUpperCase());
      const ref = findCourseByCode(cleanCode);
      result.push({
        id: `minor_${minorKey}_${cleanCode.replace(/[^a-zA-Z0-9]/g, '_')}`,
        code: cleanCode,
        name: ref ? ref.name : `${cleanCode} (Yandal Seçmeli)`,
        crd: ref ? Number(ref.crd) : 3,
        isMinor: true,
        isElective: true
      });
    }
  }

  let tagMatch = minor.name.match(/\(([A-Z]+)\)/);
  let tag = tagMatch ? tagMatch[1] : (minorKey.split('_')[0] || 'Yandal').toUpperCase();
  let elecCounter = 1;
  while (result.length < targetTotal) {
    const codeName = `${tag} Seçmeli ${elecCounter}`;
    result.push({
      id: `minor_${minorKey}_elec_${elecCounter}`,
      code: codeName,
      name: `${minor.name} Seçmeli Dersi`,
      crd: 3,
      isMinor: true,
      isElective: true
    });
    elecCounter++;
  }

  return result;
}

function getActiveMinorCourseList() {
  const state = getDeptState(currentDept);
  const minorKey = state.selectedMinorId;
  if (!minorKey || !minorsData[minorKey]) return [];
  const allMinorCourses = getMinorCourseList(minorKey);

  const majorCourses = departmentsData[currentDept]?.courses || [];
  const majorCodes = new Set();
  majorCourses.forEach(c => {
    if (c.code) majorCodes.add(c.code.replace(/\s+/g, '').toUpperCase());
  });

  const filtered = allMinorCourses.filter(mc => {
    const normalized = mc.code.replace(/\s+/g, '').toUpperCase();
    return !majorCodes.has(normalized);
  });

  const targetSemesters = ['2.1', '2.2', '3.1', '3.2', '4.1', '4.2'];
  filtered.forEach((course, idx) => {
    course.sem = idx < targetSemesters.length ? targetSemesters[idx] : '4.2';
    course.isMinor = true;
  });

  return filtered;
}

function applyMinor(minorKey) {
  if (!minorKey || !minorsData[minorKey]) {
    removeCurrentMinor(true);
    return;
  }

  removeCurrentMinor(false);

  const state = getDeptState(currentDept);
  const minor = minorsData[minorKey];

  state.selectedMinorId = minorKey;
  saveGlobalState();
  initUI();

  const minorCourses = getActiveMinorCourseList();
  showToast(t('toastMinorApplied')(getLocalizedMinorName(minorKey), minorCourses.length));
}

function removeCurrentMinor(shouldSave = true) {
  const state = getDeptState(currentDept);
  state.instances = (state.instances || []).filter(inst => {
    const isMinorInst = inst.isMinor || inst.minorCourse ||
      (inst.courseId && String(inst.courseId).startsWith('minor_')) ||
      (inst.instanceId && String(inst.instanceId).startsWith('inst_minor_'));
    return !isMinorInst;
  });
  state.selectedMinorId = null;
  if (shouldSave) {
    saveGlobalState();
    initUI();
    showToast(t('toastMinorRemoved'));
  }
}

function removeMinor(event) {
  if (event) {
    event.stopPropagation();
    event.preventDefault();
  }
  closeToolsDropdown();
  if (confirm(t('confirmRemoveMinor'))) {
    removeCurrentMinor(true);
  }
}

function updateMinorButtonUI() {
  const minorBtn = document.getElementById('minorBtn');
  const mobileMinorBtn = document.getElementById('mobileMinorBtn');
  const state = getDeptState(currentDept);
  const minorId = state.selectedMinorId;

  const defaultMinorText = (translations[currentLang] && translations[currentLang].addMinor)
    ? translations[currentLang].addMinor
    : (currentLang === 'en' ? '🎓 Add Minor' : '🎓 Yandal Ekle');

  const updateBtn = (btn, isMobile = false) => {
    if (!btn) return;
    if (minorId && minorsData[minorId]) {
      const localizedMinorName = getLocalizedMinorName(minorId);
      const match = localizedMinorName.match(/\(([^)]+)\)/);
      const shortName = match ? match[1] : localizedMinorName.replace(/Yandalı?|Minor/gi, '').trim();
      btn.className = isMobile ? 'topbar-btn mobile-minor-btn has-minor' : 'minor-btn has-minor';
      btn.innerHTML = `🎓 ${escapeHTML(t('minorLabelPrefix'))}: ${escapeHTML(shortName)} <span class="minor-remove-btn" onclick="removeMinor(event)" title="${escapeHTML(t('minorRemoveTooltip'))}">✕</span>`;
      btn.title = `${localizedMinorName} ${t('minorHasTitleSuffix')}`;
    } else {
      btn.className = isMobile ? 'topbar-btn mobile-minor-btn' : 'minor-btn';
      btn.innerHTML = escapeHTML(defaultMinorText);
      btn.title = t('minorBtnTitle');
    }
  };

  updateBtn(minorBtn, false);
  updateBtn(mobileMinorBtn, true);

  const catMinorSub = document.getElementById('catMinorSub');
  if (catMinorSub) {
    catMinorSub.innerText = (minorId && minorsData[minorId])
      ? getLocalizedMinorName(minorId)
      : t('catMinorSubDefault');
  }
}

function openMinorModal() {
  closeToolsDropdown();
  const modal = document.getElementById('minorModal');
  if (!modal) return;
  const select = document.getElementById('minorSelect');
  const state = getDeptState(currentDept);
  if (select) {
    select.value = state.selectedMinorId || "";
    handleMinorSelectChange(select.value);
  }
  modal.classList.remove('has-preview');
  modal.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeMinorModal() {
  const modal = document.getElementById('minorModal');
  if (modal) {
    modal.classList.remove('open');
    document.body.style.overflow = '';
  }
}

function handleMinorBackdropClick(event) {
  if (event.target && event.target.id === 'minorModal') {
    closeMinorModal();
  }
}

function handleMinorSelectChange(minorKey) {
  const previewBox = document.getElementById('minorPreviewBox');
  if (!previewBox) return;

  if (!minorKey || !minorsData[minorKey]) {
    previewBox.innerHTML = `
      <div style="color: #64748b; font-style: italic;">
        ${escapeHTML(t('minorPreviewRemoved'))}
      </div>
    `;
    return;
  }

  const minor = minorsData[minorKey];
  const req = minor.requirements || {};
  let reqHtml = '';
  if (req.totalCourses) reqHtml += `<span>📚 ${escapeHTML(t('minorTotalCourses'))} <strong>${req.totalCourses}</strong></span>`;
  if (req.totalCredits) reqHtml += `<span>🎯 ${escapeHTML(t('minorCredits'))} <strong>${req.totalCredits} Cr</strong></span>`;
  if (req.gpa) reqHtml += `<span>⭐ ${escapeHTML(t('minorAppGpa'))} <strong>${req.gpa.toFixed(2)}</strong></span>`;
  if (req.applicationPrereq && req.applicationPrereq.length > 0) {
    reqHtml += `<span>📋 ${escapeHTML(t('minorPrereq'))} <strong>${escapeHTML(req.applicationPrereq.join(', '))}</strong></span>`;
  }

  const courseList = getMinorCourseList(minorKey);
  const coursesPreview = courseList.map(c => `<code>${escapeHTML(c.code)}</code> (${c.crd} Cr)`).join(', ');

  previewBox.innerHTML = `
    <div class="minor-preview-title">${escapeHTML(getLocalizedMinorName(minorKey))}</div>
    <div style="font-size: 0.8rem; color: #64748b; margin-bottom: 8px;">🏛️ ${escapeHTML(getLocalizedFacultyName(minor.faculty || ''))}</div>
    ${reqHtml ? `<div class="minor-preview-reqs">${reqHtml}</div>` : ''}
    <div style="margin-top: 8px; font-size: 0.82rem; color: #334155;">
      <strong>${escapeHTML(t('minorSampleDist'))}</strong><br>
      <span style="font-size: 0.78rem; color: #475569;">${coursesPreview}</span>
    </div>
    ${minor.notes ? `<div style="margin-top: 6px; font-size: 0.75rem; color: #94a3b8; font-style: italic;">ℹ️ ${escapeHTML(minor.notes)}</div>` : ''}
  `;
}

function handleApplyMinorFromModal() {
  const select = document.getElementById('minorSelect');
  const selectedKey = select ? select.value : "";

  if (!selectedKey) {
    removeCurrentMinor(true);
    closeMinorModal();
    return;
  }

  applyMinor(selectedKey);
  closeMinorModal();
}

function getAvailableDmKeysForDept(deptKey) {
  if (!dmData || typeof dmData !== 'object') return [];
  const targetKey = getDmTargetKey(deptKey);
  return Object.keys(dmData).filter(dmKey => {
    const prog = dmData[dmKey];
    return prog && prog.majorKey === targetKey;
  });
}

function getDmCourseList(dmKey) {
  if (!dmKey || !dmData[dmKey]) return [];
  const prog = dmData[dmKey];
  const courses = prog.courses || [];
  const secondMajorRawKey = (prog.doubleMajorKey || '').toLowerCase();
  const secondMajorMappedKey = getDmTargetKey(secondMajorRawKey);

  const candidateSecondDeptKeys = [
    secondMajorRawKey,
    secondMajorMappedKey,
    DM_MAJOR_TO_CURR_DEPT[secondMajorRawKey],
    DM_MAJOR_TO_CURR_DEPT[secondMajorMappedKey]
  ].filter(Boolean);

  return courses.map((c, idx) => {
    const cleanCode = (c.code || '').trim();
    const upperCode = cleanCode.toUpperCase();

    let crd = 3;
    if (c.crd !== null && c.crd !== undefined && !isNaN(Number(c.crd))) {
      crd = Number(c.crd);
    } else {
      const ref = findCourseByCode(cleanCode);
      if (ref && ref.crd !== null && ref.crd !== undefined && !isNaN(Number(ref.crd))) {
        crd = Number(ref.crd);
      }
    }

    let resolvedPrereq = '';
    if (c.prereq) {
      resolvedPrereq = c.prereq;
    } else if (DEPT_PREREQ_MAP[currentDept] && DEPT_PREREQ_MAP[currentDept][upperCode]) {
      resolvedPrereq = DEPT_PREREQ_MAP[currentDept][upperCode];
    } else {
      for (const sKey of candidateSecondDeptKeys) {
        if (DEPT_PREREQ_MAP[sKey] && DEPT_PREREQ_MAP[sKey][upperCode]) {
          resolvedPrereq = DEPT_PREREQ_MAP[sKey][upperCode];
          break;
        }
      }
      if (!resolvedPrereq && GLOBAL_PREREQ_MAP[upperCode]) {
        resolvedPrereq = GLOBAL_PREREQ_MAP[upperCode];
      }
    }

    const safeIdCode = cleanCode ? cleanCode.replace(/[^a-zA-Z0-9]/g, '_') : 'course';
    const isDmSource = c.source === 'double_major';

    return {
      id: c.id ? String(c.id) : `dm_${dmKey}_${idx}_${safeIdCode}`,
      code: cleanCode || (c.name || 'Ders'),
      name: c.name || cleanCode,
      crd: crd,
      sem: c.sem || 'other',
      prereq: resolvedPrereq || '',
      isElective: Boolean(c.isElective),
      source: c.source || 'major',
      isDoubleMajor: isDmSource
    };
  });
}

function getActiveDmCourseList() {
  const state = getDeptState(currentDept);
  const dmKey = state.selectedDmId;
  if (!dmKey || !dmData[dmKey]) return [];
  return getDmCourseList(dmKey);
}

function applyDm(dmKey) {
  if (!dmKey || !dmData[dmKey]) {
    removeCurrentDm(true);
    return;
  }

  removeCurrentDm(false);

  const state = getDeptState(currentDept);
  const prog = dmData[dmKey];

  state.selectedDmId = dmKey;
  saveGlobalState();
  initUI();

  const dmCourses = getActiveDmCourseList();
  showToast(t('toastDmApplied')(prog.name, dmCourses.length));
}

function removeCurrentDm(shouldSave = true) {
  const state = getDeptState(currentDept);
  state.instances = (state.instances || []).filter(inst => {
    const isDmInst = inst.isDoubleMajor || inst.dmCourse ||
      (inst.courseId && String(inst.courseId).startsWith('dm_')) ||
      (inst.instanceId && String(inst.instanceId).startsWith('inst_user_dm_'));
    return !isDmInst;
  });
  state.selectedDmId = null;
  if (shouldSave) {
    saveGlobalState();
    initUI();
    showToast(t('toastDmRemoved'));
  }
}

function removeDm(event) {
  if (event) {
    event.stopPropagation();
    event.preventDefault();
  }
  closeToolsDropdown();
  if (confirm(t('dmRemoveConfirm'))) {
    removeCurrentDm(true);
  }
}

function updateDmButtonUI() {
  const dmBtn = document.getElementById('dmBtn');
  const mobileDmBtn = document.getElementById('mobileDmBtn');
  const state = getDeptState(currentDept);
  const dmId = state.selectedDmId;

  const defaultDmText = (translations[currentLang] && translations[currentLang].dmBtn)
    ? translations[currentLang].dmBtn
    : (currentLang === 'en' ? '🎓 Add Double Major' : '🎓 ÇAP Ekle');

  const updateBtn = (btn, isMobile = false) => {
    if (!btn) return;
    if (dmId && dmData[dmId]) {
      const prog = dmData[dmId];
      const localizedName = getDmLocalizedName(prog);
      const match = localizedName.match(/\(([^)]+)\)/);
      const shortName = match ? match[1] : localizedName.replace(/ÇAP|Double Major|Programı/gi, '').trim();
      const prefix = t('dmActivePrefix') || (currentLang === 'en' ? '🎓 DM: ' : '🎓 ÇAP: ');
      btn.className = isMobile ? 'topbar-btn mobile-dm-btn has-dm' : 'minor-btn dm-btn has-dm';
      btn.innerHTML = `${escapeHTML(prefix)}${escapeHTML(shortName)} <span class="minor-remove-btn dm-remove-btn" onclick="removeDm(event)" title="${escapeHTML(t('dmRemoveTooltip'))}">✕</span>`;
      btn.title = `${localizedName} ${t('dmHasTitleSuffix')}`;
    } else {
      btn.className = isMobile ? 'topbar-btn mobile-dm-btn' : 'minor-btn dm-btn';
      btn.innerHTML = escapeHTML(defaultDmText);
      btn.title = t('dmBtnTitle');
    }
  };

  updateBtn(dmBtn, false);
  updateBtn(mobileDmBtn, true);

  const catDmSub = document.getElementById('catDmSub');
  if (catDmSub) {
    catDmSub.innerText = (dmId && dmData[dmId])
      ? getDmLocalizedName(dmData[dmId])
      : t('catDmSubDefault');
  }
}

function populateDmModalOptions() {
  const select = document.getElementById('dmSelect');
  if (!select) return;
  select.innerHTML = `<option value="">${escapeHTML(t('dmSelectPlaceholder'))}</option>`;

  const availableKeys = getAvailableDmKeysForDept(currentDept);
  const faculties = {};

  availableKeys.forEach(dmKey => {
    const prog = dmData[dmKey];
    const fac = prog.faculty ? getDmLocalizedFaculty(prog) : t('otherFaculties');
    if (!faculties[fac]) faculties[fac] = [];
    faculties[fac].push({ key: dmKey, name: getDmLocalizedName(prog) });
  });

  Object.keys(faculties).forEach(facultyName => {
    const group = document.createElement('optgroup');
    group.label = facultyName;
    faculties[facultyName].forEach(p => {
      const opt = document.createElement('option');
      opt.value = p.key;
      opt.textContent = p.name;
      group.appendChild(opt);
    });
    select.appendChild(group);
  });
}

function openDmModal() {
  closeToolsDropdown();
  const modal = document.getElementById('dmModal');
  if (!modal) return;
  populateDmModalOptions();
  const select = document.getElementById('dmSelect');
  const state = getDeptState(currentDept);
  if (select) {
    select.value = state.selectedDmId || "";
    handleDmSelectChange(select.value);
  }
  modal.classList.remove('has-preview');
  modal.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeDmModal() {
  const modal = document.getElementById('dmModal');
  if (modal) {
    modal.classList.remove('open');
    document.body.style.overflow = '';
  }
}

function handleDmBackdropClick(event) {
  if (event.target && event.target.id === 'dmModal') {
    closeDmModal();
  }
}

function handleDmSelectChange(dmKey) {
  const previewBox = document.getElementById('dmPreviewBox');
  if (!previewBox) return;

  const availableKeys = getAvailableDmKeysForDept(currentDept);
  if (availableKeys.length === 0) {
    previewBox.innerHTML = `
      <div style="color: #b45309; background: #fffbeb; padding: 10px 12px; border-radius: 8px; border: 1px solid #fde68a;">
        ℹ️ ${escapeHTML(t('dmNoAvailable'))}
      </div>
    `;
    return;
  }

  if (!dmKey || !dmData[dmKey]) {
    previewBox.innerHTML = `
      <div style="color: #64748b; font-style: italic;">
        ${escapeHTML(t('dmPreviewRemoved'))}
      </div>
    `;
    return;
  }

  const prog = dmData[dmKey];
  const req = prog.requirements || {};
  let reqHtml = '';
  if (req.gpa !== undefined && req.gpa !== null) {
    reqHtml += `<span>⭐ ${escapeHTML(t('dmMinGpa'))} <strong>${Number(req.gpa).toFixed(2)}</strong></span>`;
  }
  if (req.minExtraCredits !== undefined && req.minExtraCredits !== null) {
    reqHtml += `<span>🎯 ${escapeHTML(t('dmExtraCredits'))} <strong>${req.minExtraCredits} Cr</strong></span>`;
  }
  if (req.totalCredits !== undefined && req.totalCredits !== null) {
    reqHtml += `<span>📚 ${escapeHTML(t('dmTotalCredits'))} <strong>${req.totalCredits} Cr</strong></span>`;
  }

  const dmCourses = getDmCourseList(dmKey);
  const coursesPreview = dmCourses.length > 0
    ? dmCourses.map(c => `<code>${escapeHTML(c.code)}</code> (${c.crd} Cr)`).join(', ')
    : `<span style="color: #64748b; font-style: italic;">${escapeHTML(t('otherPrograms'))}</span>`;

  let notesHtml = '';
  if (prog.notes) {
    let localizedNotes = prog.notes;
    if (currentLang === 'en') {
      const summaryItems = [];
      if (req.gpa !== undefined && req.gpa !== null) summaryItems.push(`Min. GPA: ${Number(req.gpa).toFixed(2)}`);
      if (req.minExtraCredits !== undefined && req.minExtraCredits !== null) summaryItems.push(`Min. Extra Credits: ${req.minExtraCredits} Cr`);
      if (req.totalCredits !== undefined && req.totalCredits !== null) summaryItems.push(`Total Graduation Credits: ${req.totalCredits} Cr`);
      const summaryStr = summaryItems.join(' • ');

      let translated = prog.notes
        .replace(/Toplam\s+(\d+)\s+kredi/gi, 'Total $1 credits')
        .replace(/Toplam\s+(\d+)-(\d+)\s+kredi/gi, 'Total $1-$2 credits')
        .replace(/ek\s+(kredi|yük)\s+(\d+)(\s*kredi)?/gi, 'extra load $2 credits')
        .replace(/günlük\s+zorunlu\s+staj/gi, 'days mandatory internship')
        .replace(/gün\s+stajı?\s+zorunludur/gi, 'days mandatory internship')
        .replace(/gün\s+([A-Z]+)\s+stajı/gi, 'days $1 internship')
        .replace(/zorunludur/gi, 'is mandatory')
        .replace(/alınmalıdır/gi, 'must be taken')
        .replace(/muaf\s+tutulur|muaf\s+sayılır|muaftır/gi, 'is exempted')
        .replace(/yerine\s+geçer/gi, 'substitutes')
        .replace(/önceden\s+alınmışsa/gi, 'if taken previously')
        .replace(/ders\s+bazlı\s+kredi[^.]+null\s+bırakılmıştır\.?/gi, 'Course credits not specified in the official PDF; standard department defaults applied.')
        .replace(/kaynak\s+PDF'te[^\.]+\./gi, '');

      localizedNotes = summaryStr ? `${summaryStr}. ${translated}` : translated;
    }
    notesHtml = `<div style="margin-top: 6px; font-size: 0.75rem; color: #94a3b8; font-style: italic;">ℹ️ ${escapeHTML(localizedNotes)}</div>`;
  }

  previewBox.innerHTML = `
    <div class="minor-preview-title" style="color: #0f766e;">${escapeHTML(getDmLocalizedName(prog))}</div>
    <div style="font-size: 0.8rem; color: #64748b; margin-bottom: 8px;">🏛️ ${escapeHTML(getDmLocalizedFaculty(prog))}</div>
    ${reqHtml ? `<div class="minor-preview-reqs">${reqHtml}</div>` : ''}
    <div style="margin-top: 8px; font-size: 0.82rem; color: #334155;">
      <strong>${escapeHTML(t('minorSampleDist'))} (${dmCourses.length} ${escapeHTML(t('courseUnit'))})</strong><br>
      <span style="font-size: 0.78rem; color: #475569;">${coursesPreview}</span>
    </div>
    ${notesHtml}
  `;
}

function handleApplyDmFromModal() {
  const select = document.getElementById('dmSelect');
  const selectedKey = select ? select.value : "";

  if (!selectedKey) {
    removeCurrentDm(true);
    closeDmModal();
    return;
  }

  applyDm(selectedKey);
  closeDmModal();
}

const FEEDBACK_API_URL = "https://takip-phi.vercel.app/api/issue";

function openFeedbackModal() {
  const modal = document.getElementById('feedbackModal');
  if (modal) {
    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
    setTimeout(() => {
      const titleInput = document.getElementById('feedbackTitle');
      if (titleInput) titleInput.focus();
    }, 120);
  }
}

function closeFeedbackModal() {
  const modal = document.getElementById('feedbackModal');
  if (modal) {
    modal.classList.remove('open');
    document.body.style.overflow = '';
  }
}

function handleFeedbackBackdropClick(event) {
  if (event.target && event.target.id === 'feedbackModal') {
    closeFeedbackModal();
  }
}

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    const feedbackModal = document.getElementById('feedbackModal');
    if (feedbackModal && feedbackModal.classList.contains('open')) {
      closeFeedbackModal();
    }
    const minorModal = document.getElementById('minorModal');
    if (minorModal && minorModal.classList.contains('open')) {
      closeMinorModal();
    }
    const dmModal = document.getElementById('dmModal');
    if (dmModal && dmModal.classList.contains('open')) {
      closeDmModal();
    }
  }
});

async function handleFeedbackSubmit(event) {
  event.preventDefault();

  const titleInput = document.getElementById('feedbackTitle');
  const categorySelect = document.getElementById('feedbackCategory');
  const descInput = document.getElementById('feedbackDesc');
  const submitBtn = document.getElementById('feedbackSubmitBtn');

  const title = (titleInput ? titleInput.value : "").trim();
  const category = (categorySelect ? categorySelect.value : "Diğer");
  const description = (descInput ? descInput.value : "").trim();

  if (!title || !description) {
    alert(t('alertFeedbackRequired'));
    return;
  }

  const originalBtnHtml = `<span>${escapeHTML(t('submit'))}</span>`;

  if (submitBtn) {
    submitBtn.disabled = true;
    submitBtn.innerHTML = `
      <span class="issue-spinner"></span>
      <span>${escapeHTML(t('submitting'))}</span>
    `;
  }

  try {
    const response = await fetch(FEEDBACK_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        title: title,
        category: category,
        description: description
      })
    });

    if (!response.ok) {
      let errorMsg = `${t('serverError')} (${response.status})`;
      try {
        const data = await response.json();
        if (data && (data.error || data.message)) {
          errorMsg = data.error || data.message;
        }
      } catch (_) {}
      throw new Error(errorMsg);
    }

    if (titleInput) titleInput.value = '';
    if (descInput) descInput.value = '';
    closeFeedbackModal();
    showToast(t('toastFeedbackSuccess'));
  } catch (err) {
    console.error("Geri bildirim hatası:", err);
    alert(`${t('alertFeedbackError')}${err.message || t('tryAgain')}`);
  } finally {
    if (submitBtn) {
      submitBtn.disabled = false;
      submitBtn.innerHTML = `<span>${escapeHTML(t('submit'))}</span>`;
    }
  }
}

const dashCardWrapper = document.getElementById('dashCardWrapper');

function updatePinButtonUI() {
  const btn = document.getElementById('pinDashBtn');
  if (!btn) return;
  btn.classList.toggle('pinned', isDashPinned);
  const titleText = isDashPinned ? t('unpinCardTitle') : t('pinCardTitle');
  btn.title = titleText;
  btn.setAttribute('aria-label', titleText);
  btn.setAttribute('aria-pressed', isDashPinned ? 'true' : 'false');
}

function applyDashCardPosition() {
  if (!dashCardWrapper) return;
  const fixedTop = document.getElementById('sidebarFixedTop');
  const pool = document.getElementById('course-pool');
  const poolActionBar = document.getElementById('poolActionBar');

  if (isDashPinned) {
    if (fixedTop && dashCardWrapper.parentNode !== fixedTop) {
      fixedTop.prepend(dashCardWrapper);
    } else if (fixedTop && fixedTop.firstElementChild !== dashCardWrapper) {
      fixedTop.prepend(dashCardWrapper);
    }
  } else {
    if (pool) {
      if (poolActionBar && poolActionBar.parentNode === pool) {
        if (poolActionBar.nextElementSibling !== dashCardWrapper) {
          poolActionBar.insertAdjacentElement('afterend', dashCardWrapper);
        }
      } else if (dashCardWrapper.parentNode !== pool || pool.firstElementChild !== dashCardWrapper) {
        pool.prepend(dashCardWrapper);
      }
    }
  }
}

function toggleDashPin() {
  isDashPinned = !isDashPinned;
  localStorage.setItem('boun_pin_dash_card', isDashPinned ? 'true' : 'false');
  updatePinButtonUI();
  applyDashCardPosition();
}

function toggleToolsDropdown(event) {
  if (event) event.stopPropagation();
  const dropdown = document.getElementById('toolsDropdown');
  const menuBtn = document.getElementById('mobileMenuBtn');
  if (!dropdown) return;
  const willOpen = !dropdown.classList.contains('open');
  dropdown.classList.toggle('open', willOpen);
  if (menuBtn) menuBtn.setAttribute('aria-expanded', willOpen ? 'true' : 'false');
}

function closeToolsDropdown() {
  const dropdown = document.getElementById('toolsDropdown');
  const menuBtn = document.getElementById('mobileMenuBtn');
  if (dropdown) dropdown.classList.remove('open');
  if (menuBtn) menuBtn.setAttribute('aria-expanded', 'false');
  closeMobileCatalog();
}

function openMobileCatalog() {
  const modal = document.getElementById('mobileCatalogModal');
  const menuBtn = document.getElementById('mobileMenuBtn');
  if (!modal) return;
  const sheet = modal.querySelector('.catalog-sheet');
  if (sheet) {
    sheet.style.transition = '';
    sheet.style.transform = '';
  }
  updateAutoFillButtonLabel();
  updateUndoAutoFillButtonState();
  modal.classList.add('open');
  if (menuBtn) menuBtn.setAttribute('aria-expanded', 'true');
  document.body.style.overflow = 'hidden';
}

function closeMobileCatalog() {
  const modal = document.getElementById('mobileCatalogModal');
  const menuBtn = document.getElementById('mobileMenuBtn');
  if (modal) {
    const sheet = modal.querySelector('.catalog-sheet');
    if (sheet) {
      sheet.style.transition = '';
      sheet.style.transform = '';
    }
    if (modal.classList.contains('open')) {
      modal.classList.remove('open');
      document.body.style.overflow = '';
    }
  }
  if (menuBtn) menuBtn.setAttribute('aria-expanded', 'false');
}

(function initMobileCatalogSwipe() {
  let startY = 0;
  let currentDeltaY = 0;
  let isSwiping = false;

  document.addEventListener('DOMContentLoaded', () => {
    const modal = document.getElementById('mobileCatalogModal');
    const sheet = modal ? modal.querySelector('.catalog-sheet') : null;
    if (!sheet) return;
    const bodyEl = sheet.querySelector('.catalog-body');

    sheet.addEventListener('touchstart', (e) => {
      if (!modal.classList.contains('open') || e.touches.length !== 1) return;
      const touchingBodyScrolled = bodyEl && bodyEl.contains(e.target) && bodyEl.scrollTop > 0;
      if (touchingBodyScrolled) {
        isSwiping = false;
        return;
      }
      startY = e.touches[0].clientY;
      currentDeltaY = 0;
      isSwiping = true;
    }, { passive: true });

    sheet.addEventListener('touchmove', (e) => {
      if (!isSwiping || e.touches.length !== 1) return;
      const deltaY = e.touches[0].clientY - startY;
      if (deltaY > 0) {
        currentDeltaY = deltaY;
        sheet.style.transition = 'none';
        sheet.style.transform = `translateY(${deltaY}px)`;
        if (e.cancelable) e.preventDefault();
      } else {
        currentDeltaY = 0;
      }
    }, { passive: false });

    const finishSwipe = () => {
      if (!isSwiping) return;
      isSwiping = false;
      sheet.style.transition = '';
      if (currentDeltaY > 70) {
        closeMobileCatalog();
      } else {
        sheet.style.transform = '';
      }
      currentDeltaY = 0;
    };

    sheet.addEventListener('touchend', finishSwipe, { passive: true });
    sheet.addEventListener('touchcancel', finishSwipe, { passive: true });
  });
})();

function handleMobileCatalogBackdropClick(event) {
  if (event.target && event.target.id === 'mobileCatalogModal') {
    closeMobileCatalog();
  }
}

document.addEventListener('click', (e) => {
  const dropdown = document.getElementById('toolsDropdown');
  const menuBtn = document.getElementById('mobileMenuBtn');
  if (!dropdown || !dropdown.classList.contains('open')) return;
  if (dropdown.contains(e.target) || (menuBtn && menuBtn.contains(e.target))) return;
  closeToolsDropdown();
});

function handleSupportClick(event) {
  const el = event ? event.currentTarget : document.getElementById('supportBtn');
  const href = el ? (el.getAttribute('href') || '').trim() : '';
  if (!href || href === '#') {
    if (event) event.preventDefault();
    showToast(t('toastSupportSoon'));
    return;
  }
  if (event) event.preventDefault();
  window.open(href, '_blank', 'noopener,noreferrer');
}

const toolsDropdownEl = document.getElementById('toolsDropdown');
if (toolsDropdownEl) {
  toolsDropdownEl.addEventListener('click', (e) => {
    if (e.target.closest('button, a')) {
      closeToolsDropdown();
    }
  });
}

let selectedTermPickerCourseId = null;

function openTermPickerModal(courseId) {
  const modal = document.getElementById('termPickerModal');
  const titleEl = document.getElementById('termPickerTitle');
  const subtitleEl = document.getElementById('termPickerSubtitle');
  const bodyEl = document.getElementById('termPickerBody');
  const course = findCourseById(courseId);
  if (!modal || !bodyEl || !course) return;

  selectedTermPickerCourseId = courseId;
  if (subtitleEl) subtitleEl.textContent = t('selectTermPrompt');
  if (titleEl) titleEl.textContent = `${course.code} - ${course.name}`;

  const yearLabelMap = t('yearLabels');
  const activeYearStructure = getEffectiveYearStructure();
  bodyEl.innerHTML = activeYearStructure.map(y => `
    <div class="term-picker-year-group">
      <div class="term-picker-year-label">${escapeHTML(yearLabelMap[y.yearLabel] || y.yearLabel)}</div>
      <div class="term-picker-grid">
        ${y.sems.map(semId => `
          <button type="button" class="term-picker-btn" onclick="selectTermFromPicker('${escapeHTML(semId)}')">
            ${escapeHTML(formatSemLabel(semId))}
          </button>
        `).join('')}
      </div>
    </div>
  `).join('');

  modal.classList.remove('has-preview');
  modal.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeTermPickerModal() {
  const modal = document.getElementById('termPickerModal');
  if (modal) {
    modal.classList.remove('open');
    document.body.style.overflow = '';
  }
  selectedTermPickerCourseId = null;
}

function handleTermPickerBackdropClick(event) {
  if (event.target && event.target.id === 'termPickerModal') {
    closeTermPickerModal();
  }
}

function selectTermFromPicker(semId) {
  if (selectedTermPickerCourseId && semId) {
    handleMobileAddCourse(selectedTermPickerCourseId, semId, null);
  }
  closeTermPickerModal();
}

(function initMobileSwipeTabs() {
  const appMain = document.querySelector('.app-main');
  if (!appMain) return;

  let swipeStartX = 0;
  let swipeStartY = 0;
  let swipeValid = false;

  const isHorizontallyScrollable = (target) => {
    let el = target;
    while (el && el !== appMain) {
      const style = window.getComputedStyle(el);
      const overflowX = style ? style.overflowX : '';
      if ((overflowX === 'auto' || overflowX === 'scroll') && el.scrollWidth > el.clientWidth + 2) {
        return true;
      }
      el = el.parentElement;
    }
    return false;
  };

  appMain.addEventListener('touchstart', (e) => {
    if (window.innerWidth > 900 || e.touches.length !== 1) {
      swipeValid = false;
      return;
    }
    const target = e.target;
    if (target.closest('select, input, textarea') || isHorizontallyScrollable(target)) {
      swipeValid = false;
      return;
    }
    swipeStartX = e.touches[0].clientX;
    swipeStartY = e.touches[0].clientY;
    swipeValid = true;
  }, { passive: true });

  appMain.addEventListener('touchend', (e) => {
    if (!swipeValid || window.innerWidth > 900 || !e.changedTouches || e.changedTouches.length === 0) {
      swipeValid = false;
      return;
    }
    swipeValid = false;
    const touch = e.changedTouches[0];
    const deltaX = touch.clientX - swipeStartX;
    const deltaY = touch.clientY - swipeStartY;

    if (Math.abs(deltaX) > 65 && Math.abs(deltaX) > Math.abs(deltaY) * 1.5) {
      if (deltaX < 0) {
        switchMobileTab('semesters');
      } else {
        switchMobileTab('pool');
      }
    }
  }, { passive: true });
})();

window.addEventListener('resize', () => {
  if (window.innerWidth > 900) {
    closeToolsDropdown();
  }
  initUI();
  const ptModal = document.getElementById('prereqTreeModal');
  if (ptModal && ptModal.classList.contains('open')) {
    requestAnimationFrame(() => drawPrereqTreeArrows());
  }
});

function normalizeCourseCodeStr(code) {
  return String(code || '').replace(/\s+/g, '').toUpperCase();
}

function formatNormalizedCode(prefix, num) {
  return `${prefix.toUpperCase()} ${num.toUpperCase()}`;
}

function extractAllPrereqCodes(prereqStr) {
  if (!prereqStr || typeof prereqStr !== 'string') return [];
  const matches = [];
  const regex = /\b([A-Z]{2,5})\s*(\d{3}[A-Z]?)\b/g;
  let m;
  while ((m = regex.exec(prereqStr.toUpperCase())) !== null) {
    const norm = `${m[1]}${m[2]}`;
    if (!matches.includes(norm)) {
      matches.push(norm);
    }
  }
  return matches;
}

function parsePrereqAndOrGroups(prereqStr) {
  if (!prereqStr || typeof prereqStr !== 'string') return [];

  let cleaned = prereqStr.replace(/Önkoşul\s*:/gi, '').replace(/Prerequisite\s*:/gi, '').trim();
  // "Eş koşul:" kısmını ayır (strict önkoşul değil, aynı döneme konabilir)
  const coreqIdx = cleaned.search(/Eş\s*koşul\s*:|Co-?requisite\s*:/i);
  if (coreqIdx !== -1) {
    cleaned = cleaned.substring(0, coreqIdx).trim();
  }
  if (!cleaned) return [];

  const andParts = cleaned.split(/\s+ve\s+|\s+and\s+|,|;/i);
  const groups = [];
  andParts.forEach(part => {
    const orParts = part.split(/\s+veya\s+|\s+or\s+/i);
    const groupCodes = [];
    orParts.forEach(op => {
      const codes = extractAllPrereqCodes(op);
      codes.forEach(c => {
        if (!groupCodes.includes(c)) groupCodes.push(c);
      });
    });
    if (groupCodes.length > 0) {
      groups.push(groupCodes);
    }
  });
  return groups;
}

function getActiveCurriculumCourses() {
  const activeDmCourses = getActiveDmCourseList();
  const majorCourses = departmentsData[currentDept]?.courses || [];
  const baseProgramCourses = activeDmCourses.length > 0 ? activeDmCourses : majorCourses;
  const minorCourses = getActiveMinorCourseList();
  return [...baseProgramCourses, ...minorCourses];
}

function openPrereqTreeModal() {
  const modal = document.getElementById('prereqTreeModal');
  if (!modal) return;
  prereqTreeSelectedNodeId = null;
  renderPrereqTree();
  modal.classList.add('open');
  document.body.style.overflow = 'hidden';
  requestAnimationFrame(() => {
    drawPrereqTreeArrows();
  });
}

function closePrereqTreeModal() {
  const modal = document.getElementById('prereqTreeModal');
  if (modal) {
    modal.classList.remove('open');
    document.body.style.overflow = '';
  }
  prereqTreeSelectedNodeId = null;
}

function handlePrereqTreeBackdropClick(event) {
  if (event.target && event.target.id === 'prereqTreeModal') {
    closePrereqTreeModal();
  }
}

function renderPrereqTree() {
  const colsContainer = document.getElementById('prereqTreeColumns');
  const infoBar = document.getElementById('prereqTreeInfoBar');
  if (!colsContainer) return;

  const state = getDeptState(currentDept);
  const allCourses = getActiveCurriculumCourses();

  const codeToCourses = {};
  const nodesById = {};
  const prereqsOf = {};
  const unlocksOf = {};

  allCourses.forEach(c => {
    nodesById[c.id] = c;
    prereqsOf[c.id] = new Set();
    unlocksOf[c.id] = new Set();

    const norm = normalizeCourseCodeStr(c.code);
    if (norm) {
      if (!codeToCourses[norm]) codeToCourses[norm] = [];
      codeToCourses[norm].push(c);
    }

    String(c.code || '').split(/[\/,]/).forEach(part => {
      const pNorm = normalizeCourseCodeStr(part);
      if (pNorm && pNorm !== norm) {
        if (!codeToCourses[pNorm]) codeToCourses[pNorm] = [];
        codeToCourses[pNorm].push(c);
      }
    });
  });

  const edges = [];
  const edgeKeys = new Set();

  allCourses.forEach(course => {
    if (!course.prereq) return;
    const reqNormCodes = extractAllPrereqCodes(course.prereq);
    reqNormCodes.forEach(reqCode => {
      const matchedParents = codeToCourses[reqCode] || [];
      matchedParents.forEach(parent => {
        if (parent.id === course.id) return;
        const eKey = `${parent.id}=>${course.id}`;
        if (!edgeKeys.has(eKey)) {
          edgeKeys.add(eKey);
          edges.push({ from: parent.id, to: course.id });
          prereqsOf[course.id].add(parent.id);
          unlocksOf[parent.id].add(course.id);
        }
      });
    });
  });

  prereqTreeGraphData = { nodesById, prereqsOf, unlocksOf, edges };

  const semGroups = {};
  const semKeysOrder = ['0.1', '0.2', '0.3 (Yaz)', '1.1', '1.2', '1.3 (Yaz)', '2.1', '2.2', '2.3 (Yaz)', '3.1', '3.2', '3.3 (Yaz)', '4.1', '4.2', '4.3 (Yaz)', 'other'];
  semKeysOrder.forEach(k => { semGroups[k] = []; });

  allCourses.forEach(c => {
    const s = (c.sem && semGroups[c.sem]) ? c.sem : 'other';
    semGroups[s].push(c);
  });

  colsContainer.innerHTML = '';

  semKeysOrder.forEach(semKey => {
    const list = semGroups[semKey];
    if (!list || list.length === 0) return;

    const colEl = document.createElement('div');
    colEl.className = 'pt-col';

    const colHeader = document.createElement('div');
    colHeader.className = 'pt-col-header';
    colHeader.innerText = semKey === 'other' ? t('ptOtherCol') : formatSemLabel(semKey);
    colEl.appendChild(colHeader);

    list.forEach(course => {
      const normCode = normalizeCourseCodeStr(course.code);
      const courseInstances = (state.instances || []).filter(inst => {
        if (inst.courseId === course.id) return true;
        const instCourse = getCourseForInstance(inst);
        return instCourse && instCourse.code && normCode && normalizeCourseCodeStr(instCourse.code) === normCode;
      });

      const hasPassed = courseInstances.some(inst => inst.passed === true && inst.grade !== 'F');
      const isPlaced = !hasPassed && courseInstances.length > 0;

      const statusClass = hasPassed ? 'pt-node-passed' : (isPlaced ? 'pt-node-planned' : 'pt-node-pending');

      const nodeEl = document.createElement('div');
      nodeEl.className = `pt-node ${statusClass}`;
      nodeEl.dataset.nodeId = course.id;

      nodeEl.innerHTML = `
        <div class="pt-node-top">
          <span class="pt-node-code">${escapeHTML(course.code)}</span>
          <span class="pt-node-crd">${course.crd} Cr</span>
        </div>
        <div class="pt-node-name" title="${escapeHTML(course.name)}">${escapeHTML(course.name)}</div>
        ${(course.isMinor || course.isDoubleMajor) ? `
          <div class="pt-node-badges">
            ${course.isMinor ? `<span class="pt-badge minor">${escapeHTML(t('minorBadge'))}</span>` : ''}
            ${course.isDoubleMajor ? `<span class="pt-badge dm">${escapeHTML(t('dmBadge'))}</span>` : ''}
          </div>
        ` : ''}
      `;

      nodeEl.addEventListener('mouseenter', () => {
        if (!prereqTreeSelectedNodeId) {
          highlightPrereqChain(course.id);
        }
      });

      nodeEl.addEventListener('mouseleave', () => {
        if (!prereqTreeSelectedNodeId) {
          clearPrereqHighlight();
        }
      });

      nodeEl.addEventListener('click', (e) => {
        e.stopPropagation();
        if (prereqTreeSelectedNodeId === course.id) {
          prereqTreeSelectedNodeId = null;
          clearPrereqHighlight();
        } else {
          prereqTreeSelectedNodeId = course.id;
          highlightPrereqChain(course.id);
        }
      });

      colEl.appendChild(nodeEl);
    });

    colsContainer.appendChild(colEl);
  });

  const stage = document.getElementById('prereqTreeStage');
  if (stage) {
    stage.onclick = () => {
      if (prereqTreeSelectedNodeId) {
        prereqTreeSelectedNodeId = null;
        clearPrereqHighlight();
      }
    };
  }

  if (infoBar) {
    infoBar.classList.remove('active-info');
    infoBar.innerText = t('ptInfoDefault');
  }
}

function drawPrereqTreeArrows() {
  const svg = document.getElementById('prereqTreeSvg');
  const stage = document.getElementById('prereqTreeStage');
  if (!svg || !stage) return;

  const stageRect = stage.getBoundingClientRect();
  if (stageRect.width === 0 || stageRect.height === 0) return;

  svg.setAttribute('width', stage.scrollWidth);
  svg.setAttribute('height', stage.scrollHeight);

  const nodeRects = {};
  stage.querySelectorAll('.pt-node').forEach(el => {
    const id = el.dataset.nodeId;
    const r = el.getBoundingClientRect();
    nodeRects[id] = {
      left: r.left - stageRect.left,
      right: r.right - stageRect.left,
      top: r.top - stageRect.top,
      bottom: r.bottom - stageRect.top,
      midY: (r.top + r.bottom) / 2 - stageRect.top,
      midX: (r.left + r.right) / 2 - stageRect.left
    };
  });

  let pathsHtml = `
    <defs>
      <marker id="pt-arrow-default" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
        <path d="M 0 1.5 L 9 5 L 0 8.5 z" fill="#94a3b8"></path>
      </marker>
      <marker id="pt-arrow-prereq" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
        <path d="M 0 1.5 L 9 5 L 0 8.5 z" fill="#f97316"></path>
      </marker>
      <marker id="pt-arrow-unlock" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
        <path d="M 0 1.5 L 9 5 L 0 8.5 z" fill="#8b5cf6"></path>
      </marker>
    </defs>
  `;

  prereqTreeGraphData.edges.forEach(edge => {
    const fromR = nodeRects[edge.from];
    const toR = nodeRects[edge.to];
    if (!fromR || !toR) return;

    let d = '';
    if (toR.left >= fromR.right - 4) {

      const x1 = fromR.right;
      const y1 = fromR.midY;
      const x2 = toR.left - 2;
      const y2 = toR.midY;
      const dx = Math.max(24, (x2 - x1) * 0.48);
      d = `M ${x1} ${y1} C ${x1 + dx} ${y1}, ${x2 - dx} ${y2}, ${x2} ${y2}`;
    } else {

      const x1 = fromR.right;
      const y1 = fromR.midY;
      const x2 = toR.right + 2;
      const y2 = toR.midY;
      const arcOffset = Math.max(28, Math.abs(y2 - y1) * 0.25);
      d = `M ${x1} ${y1} C ${x1 + arcOffset} ${y1}, ${x2 + arcOffset} ${y2}, ${x2} ${y2}`;
    }

    pathsHtml += `<path class="pt-edge" data-from="${escapeHTML(edge.from)}" data-to="${escapeHTML(edge.to)}" d="${d}" marker-end="url(#pt-arrow-default)"></path>`;
  });

  svg.innerHTML = pathsHtml;

  if (prereqTreeSelectedNodeId) {
    highlightPrereqChain(prereqTreeSelectedNodeId);
  }
}

function collectGraphReachable(startId, adjMap) {
  const visited = new Set();
  const queue = [startId];
  while (queue.length > 0) {
    const curr = queue.shift();
    const neighbors = adjMap[curr];
    if (!neighbors) continue;
    neighbors.forEach(nextId => {
      if (!visited.has(nextId) && nextId !== startId) {
        visited.add(nextId);
        queue.push(nextId);
      }
    });
  }
  return visited;
}

function highlightPrereqChain(nodeId) {
  const stage = document.getElementById('prereqTreeStage');
  const infoBar = document.getElementById('prereqTreeInfoBar');
  if (!stage) return;

  const { nodesById, prereqsOf, unlocksOf } = prereqTreeGraphData;
  const ancestors = collectGraphReachable(nodeId, prereqsOf);
  const descendants = collectGraphReachable(nodeId, unlocksOf);

  stage.querySelectorAll('.pt-node').forEach(el => {
    const id = el.dataset.nodeId;
    el.classList.remove('pt-node-active', 'pt-node-prereq', 'pt-node-unlock', 'pt-node-dimmed');
    if (id === nodeId) {
      el.classList.add('pt-node-active');
    } else if (ancestors.has(id)) {
      el.classList.add('pt-node-prereq');
    } else if (descendants.has(id)) {
      el.classList.add('pt-node-unlock');
    } else {
      el.classList.add('pt-node-dimmed');
    }
  });

  stage.querySelectorAll('.pt-edge').forEach(path => {
    const fromId = path.dataset.from;
    const toId = path.dataset.to;
    path.classList.remove('pt-edge-prereq', 'pt-edge-unlock', 'pt-edge-dimmed');

    const isPrereqEdge = (ancestors.has(fromId) || fromId === nodeId) && (ancestors.has(toId) || toId === nodeId) && toId !== fromId && !descendants.has(toId);
    const isUnlockEdge = (fromId === nodeId || descendants.has(fromId)) && descendants.has(toId);

    if (isPrereqEdge) {
      path.classList.add('pt-edge-prereq');
      path.setAttribute('marker-end', 'url(#pt-arrow-prereq)');
    } else if (isUnlockEdge) {
      path.classList.add('pt-edge-unlock');
      path.setAttribute('marker-end', 'url(#pt-arrow-unlock)');
    } else {
      path.classList.add('pt-edge-dimmed');
      path.setAttribute('marker-end', 'url(#pt-arrow-default)');
    }
  });

  const course = nodesById[nodeId];
  if (infoBar && course) {
    infoBar.classList.add('active-info');
    infoBar.innerText = t('ptInfoLocked')(course.code, descendants.size, ancestors.size);
  }
}

function clearPrereqHighlight() {
  const stage = document.getElementById('prereqTreeStage');
  const infoBar = document.getElementById('prereqTreeInfoBar');
  if (!stage) return;

  stage.querySelectorAll('.pt-node').forEach(el => {
    el.classList.remove('pt-node-active', 'pt-node-prereq', 'pt-node-unlock', 'pt-node-dimmed');
  });

  stage.querySelectorAll('.pt-edge').forEach(path => {
    path.classList.remove('pt-edge-prereq', 'pt-edge-unlock', 'pt-edge-dimmed');
    path.setAttribute('marker-end', 'url(#pt-arrow-default)');
  });

  if (infoBar) {
    infoBar.classList.remove('active-info');
    infoBar.innerText = t('ptInfoDefault');
  }
}

function toggleAutoFillSummerOptions() {
  const summerCheck = document.getElementById('autoFillSummerCheck');
  const optionsBox = document.getElementById('autoFillSummerOptions');
  const maxCrdEl = document.getElementById('autoFillSummerMaxCredits');
  const maxCourseEl = document.getElementById('autoFillSummerMaxCourses');
  const isEnabled = summerCheck ? summerCheck.checked : true;

  if (optionsBox) {
    optionsBox.classList.toggle('hidden', !isEnabled);
  }
  if (maxCrdEl) maxCrdEl.disabled = !isEnabled;
  if (maxCourseEl) maxCourseEl.disabled = !isEnabled;
}

function openAutoFillModal() {
  const modal = document.getElementById('autoFillModal');
  if (!modal) return;
  toggleAutoFillSummerOptions();
  modal.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeAutoFillModal() {
  const modal = document.getElementById('autoFillModal');
  if (modal) {
    modal.classList.remove('open');
    document.body.style.overflow = '';
  }
}

function handleAutoFillBackdropClick(event) {
  if (event.target && event.target.id === 'autoFillModal') {
    closeAutoFillModal();
  }
}

function isSummerPriorityCourse(course) {
  if (!course) return false;
  const norm = normalizeCourseCodeStr(course.code);
  if (
    norm.startsWith('TK221') ||
    norm.startsWith('TK222') ||
    norm.startsWith('HTR311') ||
    norm.startsWith('HTR312') ||
    norm.startsWith('AE') ||
    norm.startsWith('HSS') ||
    norm.startsWith('HUM')
  ) {
    return true;
  }
  const label = `${course.code || ''} ${course.name || ''}`.toLowerCase();
  if (
    label.includes('hss') ||
    label.includes('unrestricted') ||
    label.includes('complementary') ||
    label.includes('area elective') ||
    label.includes('alan seçmeli') ||
    label.includes('serbest') ||
    label.includes('tamamlayıcı') ||
    label.includes('general elective') ||
    label.includes('genel seçmeli')
  ) {
    return true;
  }
  return !!course.isElective;
}

function updateAutoFillButtonLabel() {
  const state = getDeptState(currentDept);
  const hasAnyPlaced = Boolean(state && Array.isArray(state.instances) && state.instances.length > 0);
  const label = hasAnyPlaced ? t('autoFillBtnRemaining') : t('autoFillBtnEmpty');

  const btn = document.getElementById('autoFillBtn');
  if (btn) btn.innerText = label;

  const catAutoFillTitle = document.getElementById('catAutoFillTitle');
  if (catAutoFillTitle) {
    catAutoFillTitle.innerText = label.replace(/^⚡\s*/, '');
  }
}

function updateUndoAutoFillButtonState() {
  const hasUndo = Boolean(lastAutoFillBackup && lastAutoFillBackup.dept === currentDept);
  const btn = document.getElementById('undoAutoFillBtn');
  if (btn) {
    btn.disabled = !hasUndo;
    btn.classList.toggle('is-hidden', !hasUndo);
  }
  const catUndoCard = document.getElementById('catalogUndoCard');
  if (catUndoCard) {
    catUndoCard.classList.toggle('is-hidden', !hasUndo);
  }
}

function executeAutoFillRemainingCourses() {
  const summerCheck = document.getElementById('autoFillSummerCheck');
  const maxCrdInput = document.getElementById('autoFillMaxCredits');
  const summerMaxCrdInput = document.getElementById('autoFillSummerMaxCredits');
  const summerMaxCoursesInput = document.getElementById('autoFillSummerMaxCourses');

  const useSummer = summerCheck ? summerCheck.checked : true;
  const parsedMax = maxCrdInput ? parseInt(maxCrdInput.value, 10) : 20;
  const maxCredits = Math.max(12, Math.min(35, isNaN(parsedMax) ? 20 : parsedMax));

  const parsedSummerMaxCrd = summerMaxCrdInput ? parseInt(summerMaxCrdInput.value, 10) : 8;
  const summerMaxCredits = Math.max(3, Math.min(12, isNaN(parsedSummerMaxCrd) ? 8 : parsedSummerMaxCrd));

  const parsedSummerMaxCourses = summerMaxCoursesInput ? parseInt(summerMaxCoursesInput.value, 10) : 2;
  const summerMaxCourses = (isNaN(parsedSummerMaxCourses) || parsedSummerMaxCourses <= 0)
    ? Number.POSITIVE_INFINITY
    : Math.max(1, Math.min(4, parsedSummerMaxCourses));

  const state = getDeptState(currentDept);
  const allCourses = getActiveCurriculumCourses();

  const backupSnapshot = JSON.parse(JSON.stringify(state.instances || []));

  const activeStructure = getEffectiveYearStructure();
  const allTargetSems = [];
  activeStructure.forEach(y => {
    y.sems.forEach(s => {
      if (!allTargetSems.includes(s)) allTargetSems.push(s);
    });
  });

  const semCredits = {};
  const semCourseCounts = {};
  allTargetSems.forEach(s => {
    semCredits[s] = 0;
    semCourseCounts[s] = 0;
  });

  const placedSemIdxByCode = {};
  const handledCourseIds = new Set();
  const handledNormCodes = new Set();

  let lastPassedIdx = -1;
  let firstOngoingIdx = -1;

  (state.instances || []).forEach(inst => {
    const c = getCourseForInstance(inst);
    const crd = c ? (Number(c.crd) || 0) : 0;
    if (semCredits[inst.semId] === undefined) semCredits[inst.semId] = 0;
    if (semCourseCounts[inst.semId] === undefined) semCourseCounts[inst.semId] = 0;
    semCredits[inst.semId] += crd;
    semCourseCounts[inst.semId] += 1;

    const semIdx = getSemesterOrderIndex(inst.semId);
    const isFailed = (inst.grade === 'F');

    if (inst.passed && !isFailed) {
      if (semIdx > lastPassedIdx) lastPassedIdx = semIdx;
    } else if (!isFailed) {
      if (firstOngoingIdx === -1 || semIdx < firstOngoingIdx) {
        firstOngoingIdx = semIdx;
      }
    }

    if (!isFailed) {
      handledCourseIds.add(inst.courseId);
      if (c && c.code) {
        const norm = normalizeCourseCodeStr(c.code);
        handledNormCodes.add(norm);
        if (placedSemIdxByCode[norm] === undefined || semIdx > placedSemIdxByCode[norm]) {
          placedSemIdxByCode[norm] = semIdx;
        }
      }
    }
  });

  const remainingCourses = allCourses.filter(c => {
    if (handledCourseIds.has(c.id)) return false;
    const norm = normalizeCourseCodeStr(c.code);
    if (norm && handledNormCodes.has(norm)) return false;
    return true;
  });

  if (remainingCourses.length === 0) {
    closeAutoFillModal();
    showToast(t('autoFillNoneLeft'));
    return;
  }

  lastAutoFillBackup = { dept: currentDept, instances: backupSnapshot };
  updateUndoAutoFillButtonState();

  const sem11Idx = getSemesterOrderIndex('1.1');
  let minGlobalSemIdx = sem11Idx;
  if (firstOngoingIdx !== -1) {
    minGlobalSemIdx = Math.max(sem11Idx, firstOngoingIdx);
  } else if (lastPassedIdx !== -1) {
    minGlobalSemIdx = Math.max(sem11Idx, lastPassedIdx + 1);
  }

  const remainingCodesSet = new Set(remainingCourses.map(c => normalizeCourseCodeStr(c.code)));

  const evaluatePrereqMinIdx = (course, ignoreUnplacedRemaining) => {
    if (!course.prereq) return 0;
    const andGroups = parsePrereqAndOrGroups(course.prereq);
    let maxPrereqIdx = -1;

    for (const orGroup of andGroups) {
      let satisfiedIdx = null;
      let hasUnplacedCandidate = false;

      for (const reqCode of orGroup) {
        if (placedSemIdxByCode[reqCode] !== undefined) {
          const idx = placedSemIdxByCode[reqCode];
          if (satisfiedIdx === null || idx < satisfiedIdx) {
            satisfiedIdx = idx;
          }
        } else if (remainingCodesSet.has(reqCode)) {
          hasUnplacedCandidate = true;
        }
      }

      if (satisfiedIdx !== null) {
        if (satisfiedIdx > maxPrereqIdx) maxPrereqIdx = satisfiedIdx;
      } else if (hasUnplacedCandidate && !ignoreUnplacedRemaining) {
        return null;
      }
    }

    return maxPrereqIdx === -1 ? 0 : (maxPrereqIdx + 1);
  };

  const isSummerSem = (semId) => semId.includes('.3');
  const getSemParity = (semId) => {
    const m = semId.match(/^\d+\.(\d+)/);
    return m ? parseInt(m[1], 10) : 0;
  };

  const getSummerPriorityTier = (course) => {
    if (!course) return 0;
    const norm = normalizeCourseCodeStr(course.code);
    if (
      norm.startsWith('TK221') ||
      norm.startsWith('TK222') ||
      norm.startsWith('HTR311') ||
      norm.startsWith('HTR312') ||
      norm.startsWith('AE')
    ) {
      return 1;
    }
    if (norm.startsWith('HSS') || norm.startsWith('HUM')) {
      return 2;
    }
    const label = `${course.code || ''} ${course.name || ''}`.toLowerCase();
    if (
      label.includes('hss') ||
      label.includes('unrestricted') ||
      label.includes('complementary') ||
      label.includes('area elective') ||
      label.includes('alan seçmeli') ||
      label.includes('serbest') ||
      label.includes('tamamlayıcı') ||
      label.includes('general elective') ||
      label.includes('genel seçmeli')
    ) {
      return 2;
    }
    return course.isElective ? 2 : 0;
  };

  const unplaced = new Set(remainingCourses.map(c => c.id));
  let placedCount = 0;

  const placeCourseIntoSem = (course, chosenSem) => {
    const crd = Number(course.crd) || 0;
    state.instances.push({
      instanceId: 'inst_af_' + Date.now() + '_' + Math.random().toString(36).substr(2, 6),
      courseId: course.id,
      semId: chosenSem,
      passed: false,
      grade: '',
      customText: '',
      isMinor: !!course.isMinor,
      isDoubleMajor: !!course.isDoubleMajor
    });

    semCredits[chosenSem] = (semCredits[chosenSem] || 0) + crd;
    semCourseCounts[chosenSem] = (semCourseCounts[chosenSem] || 0) + 1;
    const norm = normalizeCourseCodeStr(course.code);
    if (norm) {
      const chosenIdx = getSemesterOrderIndex(chosenSem);
      if (placedSemIdxByCode[norm] === undefined || chosenIdx > placedSemIdxByCode[norm]) {
        placedSemIdxByCode[norm] = chosenIdx;
      }
      remainingCodesSet.delete(norm);
    }
    unplaced.delete(course.id);
    placedCount++;
  };

  if (useSummer) {
    const sem13Idx = getSemesterOrderIndex('1.3 (Yaz)');
    const sem43Idx = getSemesterOrderIndex('4.3 (Yaz)');
    const minSummerIdx = Math.max(sem13Idx, minGlobalSemIdx);

    const summerSems = allTargetSems.filter(semId => {
      if (!isSummerSem(semId)) return false;
      const idx = getSemesterOrderIndex(semId);
      return idx >= minSummerIdx && idx <= sem43Idx;
    });

    if (summerSems.length > 0) {
      const summerCandidates = remainingCourses
        .filter(c => getSummerPriorityTier(c) > 0)
        .sort((a, b) => {
          const tierA = getSummerPriorityTier(a);
          const tierB = getSummerPriorityTier(b);
          if (tierA !== tierB) return tierA - tierB;
          const idxA = (a.sem && a.sem !== 'other') ? getSemesterOrderIndex(a.sem) : 999;
          const idxB = (b.sem && b.sem !== 'other') ? getSemesterOrderIndex(b.sem) : 999;
          if (idxA !== idxB) return idxA - idxB;
          return normalizeCourseCodeStr(a.code).localeCompare(normalizeCourseCodeStr(b.code));
        });

      const summerCodeSet = new Set(summerCandidates.map(c => normalizeCourseCodeStr(c.code)));
      const SEQ_PREDECESSORS = {
        TK222: 'TK221',
        HTR312: 'HTR311',
        AE112: 'AE111',
        AE102: 'AE101'
      };

      for (let pass = 0; pass < 3; pass++) {
        let progress = false;
        for (const course of summerCandidates) {
          if (!unplaced.has(course.id)) continue;

          const prereqMinIdx = evaluatePrereqMinIdx(course, false);
          if (prereqMinIdx === null) continue;

          const norm = normalizeCourseCodeStr(course.code);
          let seqMinIdx = 0;
          let waitForSeq = false;
          for (const [succ, pred] of Object.entries(SEQ_PREDECESSORS)) {
            if (norm.startsWith(succ)) {
              if (placedSemIdxByCode[pred] !== undefined) {
                seqMinIdx = Math.max(seqMinIdx, placedSemIdxByCode[pred] + 1);
              } else if (remainingCodesSet.has(pred) && summerCodeSet.has(pred)) {
                waitForSeq = true;
              }
            }
          }
          if (waitForSeq) continue;

          const crd = Number(course.crd) || 0;
          const minAllowedSummerIdx = Math.max(minSummerIdx, prereqMinIdx, seqMinIdx);

          const validSummerSems = summerSems.filter(semId => {
            const sIdx = getSemesterOrderIndex(semId);
            if (sIdx < minAllowedSummerIdx) return false;
            const currentCount = semCourseCounts[semId] || 0;
            const currentCredits = semCredits[semId] || 0;
            return (currentCount + 1) <= summerMaxCourses && (currentCredits + crd) <= summerMaxCredits;
          });

          if (validSummerSems.length > 0) {
            validSummerSems.sort((a, b) => {
              const countDiff = (semCourseCounts[a] || 0) - (semCourseCounts[b] || 0);
              if (countDiff !== 0) return countDiff;
              const crdDiff = (semCredits[a] || 0) - (semCredits[b] || 0);
              if (crdDiff !== 0) return crdDiff;
              return getSemesterOrderIndex(a) - getSemesterOrderIndex(b);
            });
            placeCourseIntoSem(course, validSummerSems[0]);
            progress = true;
          }
        }
        if (!progress) break;
      }
    }
  }

  const queue = remainingCourses
    .filter(c => unplaced.has(c.id))
    .sort((a, b) => {
      const idxA = (a.sem && a.sem !== 'other') ? getSemesterOrderIndex(a.sem) : 999;
      const idxB = (b.sem && b.sem !== 'other') ? getSemesterOrderIndex(b.sem) : 999;
      return idxA - idxB;
    });

  const maxPasses = queue.length + 3;
  for (let pass = 0; pass < maxPasses && unplaced.size > 0; pass++) {
    let progressInPass = false;
    const ignoreWait = (pass >= maxPasses - 2);

    for (const course of queue) {
      if (!unplaced.has(course.id)) continue;

      const prereqMinIdx = evaluatePrereqMinIdx(course, ignoreWait);
      if (prereqMinIdx === null) continue;

      const crd = Number(course.crd) || 0;
      const hasOfficialSem = Boolean(course.sem && course.sem !== 'other' && allTargetSems.includes(course.sem) && !isSummerSem(course.sem));
      const origSemIdx = (course.sem && course.sem !== 'other') ? getSemesterOrderIndex(course.sem) : sem11Idx;
      const minAllowedIdx = Math.max(minGlobalSemIdx, prereqMinIdx, origSemIdx);
      const prefParity = (course.sem && course.sem !== 'other') ? getSemParity(course.sem) : 0;

      let chosenSem = null;

      if (
        hasOfficialSem &&
        origSemIdx >= minGlobalSemIdx &&
        origSemIdx >= prereqMinIdx &&
        (semCredits[course.sem] + crd) <= maxCredits
      ) {
        chosenSem = course.sem;
      }

      if (!chosenSem && (prefParity === 1 || prefParity === 2)) {
        chosenSem = allTargetSems.find(semId => {
          if (isSummerSem(semId)) return false;
          const sIdx = getSemesterOrderIndex(semId);
          if (sIdx < minAllowedIdx) return false;
          if (getSemParity(semId) !== prefParity) return false;
          return (semCredits[semId] + crd) <= maxCredits;
        });
      }

      if (!chosenSem) {
        chosenSem = allTargetSems.find(semId => {
          if (isSummerSem(semId)) return false;
          const sIdx = getSemesterOrderIndex(semId);
          if (sIdx < minAllowedIdx) return false;
          return (semCredits[semId] + crd) <= maxCredits;
        });
      }

      if (!chosenSem) {
        const candidates = allTargetSems.filter(semId => !isSummerSem(semId) && getSemesterOrderIndex(semId) >= minAllowedIdx);
        if (candidates.length > 0) {
          candidates.sort((a, b) => (semCredits[a] || 0) - (semCredits[b] || 0));
          chosenSem = candidates[0];
        } else {
          chosenSem = allTargetSems[allTargetSems.length - 1] || '4.2';
        }
      }

      placeCourseIntoSem(course, chosenSem);
      progressInPass = true;
    }

    if (!progressInPass && !ignoreWait) {
      continue;
    }
  }

  saveGlobalState();
  initUI();
  closeAutoFillModal();
  showToast(t('autoFillSuccess')(placedCount));
}

function undoAutoFillCourses() {
  if (!lastAutoFillBackup || lastAutoFillBackup.dept !== currentDept) return;
  const state = getDeptState(currentDept);
  state.instances = JSON.parse(JSON.stringify(lastAutoFillBackup.instances));
  lastAutoFillBackup = null;
  updateUndoAutoFillButtonState();
  saveGlobalState();
  initUI();
  showToast(t('autoFillUndone'));
}

updatePinButtonUI();
applyDashCardPosition();
loadCurriculum();
