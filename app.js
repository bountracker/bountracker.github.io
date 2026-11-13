// Created by Enes Furkan Gözüdik
const isMobileDevice = () => window.innerWidth <= 900;

const FALL_TERM = "2026/2027-1";
const SPRING_TERM = "2025/2026-2";
const DEFAULT_TERM = FALL_TERM;

let isDashPinned = localStorage.getItem('boun_pin_dash_card') === 'true';

const GRADE_POINTS = {
  'AA': 4.0, 'BA': 3.5, 'BB': 3.0, 'CB': 2.5,
  'CC': 2.0, 'DC': 1.5, 'DD': 1.0, 'F': 0.0, 'P': null, 'EX': null
};

const LETTER_GRADED_PA_CODES = new Set([
  'PA368', 'PA369', 'PA393', 'PA395', 'PA396',
  'PA451', 'PA452', 'PA453', 'PA454', 'PA467', 'PA468', 'PA469'
]);

function isPassFailCourse(inst, course) {
  const rawCode = (inst && inst.catalogCourse && inst.catalogCourse.code)
    || (inst && inst.customText)
    || (course && course.code)
    || '';
  const norm = String(rawCode).trim().toUpperCase().replace(/\s+/g, '');
  if (!norm) return false;
  if (/^PE\d+/.test(norm)) return true;
  if (/^PA\d+/.test(norm)) {
    if (LETTER_GRADED_PA_CODES.has(norm)) return false;
    const catEntry = (typeof ELECTIVE_CATALOG_BY_CODE !== 'undefined') ? ELECTIVE_CATALOG_BY_CODE[norm] : null;
    const desc = (catEntry && catEntry.description) || (inst && inst.catalogCourse && inst.catalogCourse.description) || '';
    if (/letter-graded/i.test(desc)) return false;
    return true;
  }
  return false;
}

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
    minorModalRemoveBtn: "🗑️ Yandalı Kaldır",
    dmModalRemoveBtn: "🗑️ ÇAP'ı Kaldır",
    missingPrereqLabel: "Eksik Önkoşul",
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
    toastSupportThanks: "☕ Desteğiniz için teşekkürler!",
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
    minorModalRemoveBtn: "🗑️ Remove Minor",
    dmModalRemoveBtn: "🗑️ Remove Double Major",
    missingPrereqLabel: "Missing Prereq",
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
    toastSupportThanks: "☕ Thank you for your support!",
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
  const isEn = currentLang === 'en';
  setText('desktopToolsBtnLabel', isEn ? 'Tools' : 'Araçlar');
  setText('desktopToolsModalTitle', isEn ? '🎛️ Tools & Actions Catalog' : '🎛️ Araçlar & İşlemler Kataloğu');
  setText('dtSecAnalysis', isEn ? '📊 Academic Analysis & Planning' : '📊 Akademik Analiz & Planlama');
  setText('dtSecData', isEn ? '📥 Data & Sharing' : '📥 Veri & Paylaşım');
  setText('dtSecManage', isEn ? '⚙️ Management & Support' : '⚙️ Yönetim & Destek');
  setText('dtWhatIfLabel', isEn ? 'Target GPA & Repeat Simulator' : 'Hedef GNO & Repeat Simülatörü');
  setText('dtWhatIfDesc', isEn ? 'Calculate target GPA with remaining credits or simulate course repeats' : 'Kalan derslerle hedef ortalamayı hesapla veya ders tekrarı simüle et');
  setText('dtDiscoveryLabel', isEn ? 'Closest Double Major / Minor' : 'Bana En Yakın ÇAP / Yandal');
  setText('dtDiscoveryDesc', isEn ? 'Discover programs with the highest overlap with your courses' : 'Mevcut derslerinle en çok örtüşen programları keşfet');
  setText('dtPrereqLabel', isEn ? 'Prerequisite Tree' : 'Önkoşul Ağacı');
  setText('dtPrereqDesc', isEn ? 'Visualize course prerequisites and unlock chains' : 'Derslerin önkoşul ve kilit zincirlerini görselleştir');
  setText('dtAutoFillLabel', isEn ? 'Auto-Fill Plan' : 'Otomatik Doldur');
  setText('dtAutoFillDesc', isEn ? 'Distribute remaining courses by prerequisite order' : 'Kalan dersleri önkoşul sırasına göre dönemlere dağıt');
  setText('dtTranscriptLabel', isEn ? 'Upload Transcript' : 'Transkript Yükle');
  setText('dtTranscriptDesc', isEn ? 'Import your ÖBİKAS / transcript PDF file' : 'ÖBİKAS / transkript dosyanı içeri aktar');
  setText('dtPngLabel', isEn ? 'Download as Image' : 'Görsel Olarak İndir');
  setText('dtPngDesc', isEn ? 'Save your plan as PNG with theme & layout options' : 'Planını tema ve yön seçerek PNG kaydet');
  setText('dtLinkLabel', isEn ? 'Share Plan Link' : 'Plan Linkini Paylaş');
  setText('dtLinkDesc', isEn ? 'Copy your 4-year plan as a single shareable link' : '4 yıllık planını tek linkle kopyala');
  setText('dtShareLabel', isEn ? 'JSON Backup / Import' : 'JSON Yedekle / Yükle');
  setText('dtShareDesc', isEn ? 'Export or restore your full plan as a JSON file' : 'Tüm planını JSON dosyası olarak dışa aktar veya geri yükle');
  setText('dtGuideLabel', isEn ? 'Guide' : 'Rehber');
  setText('dtGuideDesc', isEn ? 'View quick start guide and tips' : 'Uygulama rehberi ve hızlı başlangıç ipuçları');
  setText('dtFeedbackLabel', isEn ? 'Report / Feedback' : 'Hata / Öneri');
  setText('dtFeedbackDesc', isEn ? 'Report an issue or suggest a new feature' : 'Hata bildir veya yeni özellik önerisi paylaş');
  setText('dtSupportLabel', isEn ? 'Support Us' : 'Destek Ol');
  setText('dtSupportDesc', isEn ? 'Support the development of Boğaziçi Tracker' : 'Boğaziçi Tracker\'ın gelişimine katkıda bulun');
  setText('dtResetLabel', isEn ? 'Reset Plan' : 'Planı Sıfırla');
  setText('dtResetDesc', isEn ? 'Restore all selections and semesters to initial state' : 'Tüm seçimleri ve dönemleri başlangıç haline döndür');
  setAttr('feedbackBtn', 'title', t('feedbackBtnTitle'));
  setAttr('shareBtn', 'title', t('shareBtnTitle'));
  setAttr('supportBtn', 'title', t('supportBtnTitle'));
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

  setText('addCustomCourseBtn', currentLang === 'en' ? '➕ Add Extra Course' : '➕ Ekstra Ders Ekle');
  setAttr('addCustomCourseBtn', 'title', currentLang === 'en' ? 'Add a new extra/custom course card to the pool' : 'Havuza yeni ekstra/özel ders kartı ekle');
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
  updateThemeToggleButtons();
}

const THEME_STORAGE_KEY = 'bountracker-theme';

function updateThemeToggleButtons(theme) {
  const activeTheme = theme || (document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light');
  const icon = activeTheme === 'dark' ? '☀️' : '🌙';
  const label = currentLang === 'en' ? 'Toggle Theme' : 'Temayı Değiştir';
  ['themeToggleBtn', 'mobileThemeToggleBtn'].forEach((id) => {
    const btn = document.getElementById(id);
    if (!btn) return;
    btn.textContent = icon;
    btn.setAttribute('aria-label', label);
    btn.setAttribute('title', label);
  });
}

function toggleTheme() {
  const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
  const nextTheme = isDark ? 'light' : 'dark';
  if (nextTheme === 'dark') {
    document.documentElement.setAttribute('data-theme', 'dark');
  } else {
    document.documentElement.removeAttribute('data-theme');
  }
  try {
    localStorage.setItem(THEME_STORAGE_KEY, nextTheme);
  } catch (_) {
    // Ignore storage errors
  }
  updateThemeToggleButtons(nextTheme);
}

document.addEventListener('DOMContentLoaded', () => {
  try {
    const saved = localStorage.getItem(THEME_STORAGE_KEY);
    if (saved === 'dark') {
      document.documentElement.setAttribute('data-theme', 'dark');
    } else if (saved === 'light') {
      document.documentElement.removeAttribute('data-theme');
    }
  } catch (_) {}
  updateThemeToggleButtons();
});

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

function refreshAllPrereqWarnings() {
  const state = getDeptState(currentDept);
  const instances = state.instances || [];
  instances.forEach(inst => {
    const card = document.getElementById(`inst-${inst.instanceId}`);
    if (!card) return;
    const course = getCourseForInstance(inst);
    if (!course) return;

    const effectivePrereq = resolveDynamicPrereqForInstance(inst, course);
    const missing = !inst.passed ? getMissingPrereqsForInstance(inst, effectivePrereq, instances) : [];

    card.classList.toggle('prereq-missing', missing.length > 0);
    let badgeEl = card.querySelector('.course-prereq-missing-badge');
    if (missing.length > 0) {
      if (!badgeEl) {
        badgeEl = document.createElement('div');
        badgeEl.className = 'course-prereq-missing-badge';
        const controlsEl = card.querySelector('.course-controls');
        if (controlsEl) {
          card.insertBefore(badgeEl, controlsEl);
        } else {
          card.appendChild(badgeEl);
        }
      }
      badgeEl.textContent = `⚠️ ${t('missingPrereqLabel')}: ${missing.join(', ')}`;
    } else if (badgeEl) {
      badgeEl.remove();
    }
  });
}

function refreshRepeatBadges() {
  refreshAllPrereqWarnings();
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
const PREQ_JSON_MAP = {};
const PREQ_JSON_COMPACT_MAP = {};

function formatRawPreqJsonPart(rawText, defaultDept) {
  if (!rawText) return '';
  let text = String(rawText).trim();
  if (!text) return '';

  // Uzun BUEPT / TOEFL / IELTS kalıplarını standart kısaltmaya indirge
  if (/\bBUEPT\b|\bTOEFL\b|\bIELTS\b/i.test(text) && !/\b[A-Z]{2,5}\s*\d{3}\b/.test(text.replace(/\b(AE|HUM|TK|HTR)\s*\d{3}\s+as\s+a\s+required\s+course[^,;)]*/gi, ''))) {
    return 'İngilizce Yeterlilik (BUEPT)';
  }

  // Departman içi spesifikasyon ve not şartı kalıplarını temizle
  text = text
    .replace(/\s+and\s+the\s+specification\s+of\s+[A-Z]{2,5}\s*\d{3}[A-Z]?\s+as\s+a\s+required\s+course[^,;]*/gi, '')
    .replace(/Grade\s*[“"']?[A-Z][+-]?[”"']?\s+on\s+BUEPT\s*\([^)]*\)/gi, 'İngilizce Yeterlilik (BUEPT)')
    .replace(/\b(with\s+(a\s+)?)?(minimum\s+)?grade\s*(of\s*)?[“"']?[A-Z]{1,2}[+-]?[”"']?(\s+(or\s+(above|higher|better)))?/gi, '')
    .replace(/\b(consent\s+of\s+(the\s+)?instructor|instructor'?s\s+consent|departmental\s+consent|consent\s+of\s+(the\s+)?department)\b/gi, 'Hoca Onayı')
    .replace(/\b(senior\s+standing|4th\s+year\s+standing|fourth\s+year\s+standing)(\s+in\s+[A-Z]{2,5})?/gi, 'Son Sınıf Şartı')
    .replace(/\b(junior\s+standing|3rd\s+year\s+standing|third\s+year\s+standing)(\s+in\s+[A-Z]{2,5})?/gi, '3. Sınıf Şartı')
    .replace(/\b(sophomore\s+standing|2nd\s+year\s+standing|second\s+year\s+standing)(\s+in\s+[A-Z]{2,5})?/gi, '2. Sınıf Şartı');

  // "ED 209/ED 211" veya "ED 200 / ED 415" gibi eğik çizgili alternatifleri "veya"ya çevir
  text = text.replace(/([A-Z]{2,5}\s*\d{3}[A-Z]?)\s*\/\s*([A-Z]{2,5}\s*\d{3}[A-Z]?)/gi, '$1 veya $2');

  // İngilizce bağlaçları curriculum.json standartlarına çevir
  text = text
    .replace(/\bor\b/gi, 'veya')
    .replace(/\band\b/gi, 've');

  // Eksik bölüm kodu olan yalın 3 haneli ders numaralarını (ör. "102") bir önceki veya dersin kendi bölüm koduyla tamamla
  let lastDept = defaultDept || '';
  text = text.replace(/\b(?:([A-Za-z]{2,5})\s*)?(\d{3}[A-Za-z]?)\b/g, (match, dept, num) => {
    if (dept) {
      lastDept = dept.toUpperCase();
      return `${lastDept} ${num.toUpperCase()}`;
    }
    if (lastDept) {
      return `${lastDept} ${num.toUpperCase()}`;
    }
    return match;
  });

  // Fazla boşluk ve noktalama temizliği
  text = text
    .replace(/\s+/g, ' ')
    .replace(/\(\s*\)/g, '')
    .replace(/^[,;:\s]+|[,;:\s]+$/g, '')
    .trim();

  return text;
}

function formatRawPreqJsonEntry(courseCode, prerequisites) {
  const spacedCode = String(courseCode || '').trim().toUpperCase().replace(/\s+/g, ' ');
  const deptMatch = spacedCode.match(/^([A-Z]{2,5})\b/);
  const defaultDept = deptMatch ? deptMatch[1] : '';

  const rawArr = Array.isArray(prerequisites)
    ? prerequisites.map(p => String(p || '').trim()).filter(Boolean)
    : (prerequisites ? [String(prerequisites).trim()] : []);
  if (rawArr.length === 0) return '';

  const prereqParts = [];
  const coreqParts = [];

  rawArr.forEach(rawItem => {
    const coreqMatch = rawItem.match(/^(?:co-?requisite|eş\s*koşul)\s*:\s*(.+)$/i);
    if (coreqMatch) {
      const cleanedCoreq = formatRawPreqJsonPart(coreqMatch[1], defaultDept);
      if (cleanedCoreq && !coreqParts.includes(cleanedCoreq)) coreqParts.push(cleanedCoreq);
    } else {
      const cleanedRaw = rawItem.replace(/^(?:pre-?requisite|önkoşul)\s*:\s*/i, '');
      const cleanedPreq = formatRawPreqJsonPart(cleanedRaw, defaultDept);
      if (cleanedPreq && !prereqParts.includes(cleanedPreq)) prereqParts.push(cleanedPreq);
    }
  });

  const sections = [];
  if (prereqParts.length > 0) {
    sections.push(`Önkoşul: ${prereqParts.join(' ve ')}`);
  }
  if (coreqParts.length > 0) {
    sections.push(`Eş koşul: ${coreqParts.join(' ve ')}`);
  }
  return sections.join('; ');
}

function initPreqJsonMap(preqList) {
  Object.keys(PREQ_JSON_MAP).forEach(k => delete PREQ_JSON_MAP[k]);
  Object.keys(PREQ_JSON_COMPACT_MAP).forEach(k => delete PREQ_JSON_COMPACT_MAP[k]);
  if (!Array.isArray(preqList)) return;

  preqList.forEach(entry => {
    if (!entry || !entry.course_code) return;
    const spaced = String(entry.course_code).trim().toUpperCase().replace(/\s+/g, ' ');
    const compact = spaced.replace(/\s+/g, '');
    const prereqStr = formatRawPreqJsonEntry(spaced, entry.prerequisites);
    if (!prereqStr) return;
    if (spaced) PREQ_JSON_MAP[spaced] = prereqStr;
    if (compact) PREQ_JSON_COMPACT_MAP[compact] = prereqStr;
  });
}

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

function extractAssignedElectiveCode(text) {
  if (!text) return '';
  const cleaned = String(text).trim().toUpperCase().replace(/\s+/g, ' ');
  const m = cleaned.match(/([A-Z]{2,5})\s*([0-9]{3}[A-Z]?)/);
  if (!m) return '';
  return normalizeCourseCodeStr(`${m[1]} ${m[2]}`);
}

function getPrereqFromMaps(code) {
  if (!code) return '';
  const spaced = String(code).trim().toUpperCase().replace(/\s+/g, ' ');
  const compact = spaced.replace(/\s+/g, '');
  const norm = normalizeCourseCodeStr(spaced);

  if (norm && PREQ_JSON_MAP[norm]) return PREQ_JSON_MAP[norm];
  if (spaced && PREQ_JSON_MAP[spaced]) return PREQ_JSON_MAP[spaced];
  if (compact && PREQ_JSON_COMPACT_MAP[compact]) return PREQ_JSON_COMPACT_MAP[compact];

  if (norm && DEPT_PREREQ_MAP[currentDept] && DEPT_PREREQ_MAP[currentDept][norm]) {
    return DEPT_PREREQ_MAP[currentDept][norm];
  }
  return (norm && GLOBAL_PREREQ_MAP[norm]) || '';
}

function resolveDynamicPrereqForInstance(inst, course) {
  if (!course) return '';
  if (course.isCustom) {
    return course.prereq || getPrereqFromMaps(course.code) || '';
  }
  const basePrereq = course.prereq ? course.prereq : '';
  if (!course.isElective || !inst || !inst.customText) return basePrereq;
  const assignedCode = extractAssignedElectiveCode(inst.customText);
  if (!assignedCode) return basePrereq;
  const assignedPrereq = getPrereqFromMaps(assignedCode);
  return assignedPrereq || basePrereq;
}

function getSemRankForPrereq(semId) {
  const m = String(semId || '').match(/^(\d+)\.(\d+)/);
  return m ? (parseInt(m[1], 10) * 10 + parseInt(m[2], 10)) : 9999;
}

function getMissingPrereqsForInstance(inst, prereqStr, allInstances) {
  if (!prereqStr || !inst || !inst.semId) return [];
  const andGroups = parsePrereqAndOrGroups(prereqStr);
  if (!andGroups || andGroups.length === 0) return [];

  const targetRank = getSemRankForPrereq(inst.semId);
  const satisfiedCodes = new Set();

  (allInstances || []).forEach(other => {
    if (!other || other.instanceId === inst.instanceId || other.grade === 'F') return;
    if (getSemRankForPrereq(other.semId) >= targetRank) return;
    const otherCourse = getCourseForInstance(other);
    if (!otherCourse) return;

    const baseNorm = normalizeCourseCodeStr(otherCourse.code);
    if (baseNorm) satisfiedCodes.add(baseNorm);
    String(otherCourse.code || '').split(/[\/,]/).forEach(part => {
      const pNorm = normalizeCourseCodeStr(part);
      if (pNorm) satisfiedCodes.add(pNorm);
    });
    if (otherCourse.isElective && other.customText) {
      const assigned = extractAssignedElectiveCode(other.customText);
      if (assigned) satisfiedCodes.add(assigned);
    }
  });

  const missing = [];
  andGroups.forEach(group => {
    const ok = group.some(reqCode => satisfiedCodes.has(reqCode));
    if (!ok && group.length > 0) {
      missing.push(group.join(' / '));
    }
  });
  return missing;
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
    const [currResp, minorsResp, dmResp, preqResp, electivesResp] = await Promise.all([
      fetch('./data/curriculum.json'),
      fetch('./data/minors.json'),
      fetch('./data/dm_curriculum.json').catch(() => ({ ok: false })),
      fetch('./data/preq.json').catch(() => ({ ok: false })),
      fetch('./data/bogazici_electives_all.json').catch(() => ({ ok: false }))
    ]);

    if (!currResp.ok) throw new Error(`HTTP Hata: ${currResp.status}`);
    departmentsData = await currResp.json();
    initPrereqMaps(departmentsData);

    if (preqResp && preqResp.ok) {
      try {
        const preqList = await preqResp.json();
        initPreqJsonMap(preqList);
      } catch (pErr) {
        console.warn("preq.json okunamadı:", pErr);
      }
    }

    if (electivesResp && electivesResp.ok) {
      try {
        const rawElectives = await electivesResp.json();
        initElectivesCatalog(rawElectives);
      } catch (eErr) {
        console.warn("bogazici_electives_all.json okunamadı:", eErr);
      }
    }

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
  if (!Array.isArray(globalState[deptKey].customCourses)) {
    globalState[deptKey].customCourses = [];
  }
  return globalState[deptKey];
}

function findCourseById(courseId) {
  if (!courseId) return null;
  const customList = getDeptState(currentDept).customCourses || [];
  const customCourse = customList.find(c => c.id === courseId);
  if (customCourse) return customCourse;
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
  const baseCourse = findCourseById(inst.courseId) || inst.customCourse || null;
  if (inst.catalogCourse) {
    return {
      ...(baseCourse || {}),
      id: inst.courseId,
      code: inst.catalogCourse.code,
      name: inst.catalogCourse.name,
      crd: Number(inst.catalogCourse.crd) || 0,
      prereq: inst.catalogCourse.prereq || (baseCourse ? baseCourse.prereq : '') || '',
      isElective: true,
      isSplitChild: !!inst.splitGroupId,
      slotCode: baseCourse ? baseCourse.code : '',
      slotName: baseCourse ? baseCourse.name : ''
    };
  }
  return baseCourse;
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

  const splitGroupsStatus = {};
  sortedInstances.forEach(inst => {
    if (inst.splitSlotCourseId) {
      if (!splitGroupsStatus[inst.splitSlotCourseId]) splitGroupsStatus[inst.splitSlotCourseId] = [];
      splitGroupsStatus[inst.splitSlotCourseId].push(inst);
    }
  });

  sortedInstances.forEach(inst => {
    if (inst.passed) {
      if (inst.splitSlotCourseId) {
        const siblings = splitGroupsStatus[inst.splitSlotCourseId] || [];
        const allSiblingsPassed = siblings.length >= 2 && siblings.every(s => s.passed === true && s.grade !== 'F');
        if (allSiblingsPassed) {
          passedCourseIds.add(inst.splitSlotCourseId);
        }
      } else {
        passedCourseIds.add(inst.courseId);
      }
      const course = getCourseForInstance(inst);
      if (course) {
        if (course.code) passedCourseCodes.add(course.code.replace(/\s+/g, '').toUpperCase());
        const isErasmusTerm = erasmusSet.has(inst.semId);
        const isPF = isPassFailCourse(inst, course);
        const rawGrade = inst.grade || (isPF ? 'P' : 'AA');
        const resolvedGrade = (isErasmusTerm || rawGrade === 'EX')
          ? 'EX'
          : (isPF && !['P', 'F'].includes(rawGrade) ? 'P' : rawGrade);
        latestPassedByCourse[inst.courseId] = {
          grade: resolvedGrade,
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
  const customBtnRow = document.getElementById('customCourseBtnRow');
  if (poolActionBar && poolActionBar.parentNode === pool) {
    poolActionBar.remove();
  }
  if (customBtnRow && customBtnRow.parentNode === pool) {
    customBtnRow.remove();
  }
  if (dashCardWrapper && dashCardWrapper.parentNode === pool) {
    dashCardWrapper.remove();
  }
  pool.innerHTML = '';
  if (poolActionBar) {
    pool.appendChild(poolActionBar);
  }
  if (customBtnRow) {
    pool.appendChild(customBtnRow);
  }

  const customCourses = state.customCourses || [];
  if (customCourses.length > 0) {
    const customGroup = document.createElement('div');
    customGroup.className = 'pool-sem-group pool-custom-group';
    const customHeader = document.createElement('div');
    customHeader.className = 'pool-sem-header';
    const customGroupTitle = currentLang === 'en' ? '✨ Custom / Extra Courses' : '✨ Özel / Ekstra Dersler';
    customHeader.innerHTML = `
      <span>${escapeHTML(customGroupTitle)}</span>
      <span>${customCourses.length} ${escapeHTML(t('courseUnit'))}</span>
    `;
    customGroup.appendChild(customHeader);

    customCourses.forEach(course => {
      const placedInst = state.instances.find(inst => inst.courseId === course.id);
      const isPlaced = !!placedInst;
      const isPassed = !!(placedInst && placedInst.passed);

      const poolCard = document.createElement('div');
      const stateClass = isPlaced ? (isPassed ? 'status-passed' : 'status-failed') : '';
      poolCard.className = `course-card custom-course-card ${stateClass}`.trim();
      poolCard.draggable = !isMobileDevice();
      poolCard.dataset.courseId = course.id;
      poolCard.dataset.customPoolId = course.id;

      const safePrereq = course.prereq ? escapeHTML(translatePrereq(course.prereq)) : '';
      let badgeHtml = `<span class="status-badge pending">${escapeHTML(t('notTaken'))}</span>`;
      if (isPlaced) {
        if (isPassed) {
          const gradeStr = placedInst.grade ? ` (${escapeHTML(placedInst.grade)})` : '';
          badgeHtml = `<span class="status-badge locked">${escapeHTML(currentLang === 'en' ? '✓ Passed' : '✓ Verildi')}${gradeStr}</span>`;
        } else {
          badgeHtml = `<span class="status-badge failed">${escapeHTML(currentLang === 'en' ? '✕ Not Taken' : '✕ Verilmedi')}</span>`;
        }
      }

      poolCard.innerHTML = `
        <div class="custom-course-edit-row">
          <input type="text"
                 class="custom-course-input code-input"
                 draggable="false"
                 value="${escapeHTML(course.code)}"
                 placeholder="${escapeHTML(currentLang === 'en' ? 'Course Code (e.g. PE 101)' : 'Ders Kodu (örn. PE 101)')}"
                 aria-label="${escapeHTML(currentLang === 'en' ? 'Course Code' : 'Ders Kodu')}"
                 onmousedown="event.stopPropagation()"
                 onclick="event.stopPropagation()"
                 oninput="updateCustomCourseField('${escapeHTML(course.id)}', 'code', this.value)" onchange="updateCustomCourseField('${escapeHTML(course.id)}', 'code', this.value)">
          <label class="custom-course-crd-wrap" onmousedown="event.stopPropagation()" onclick="event.stopPropagation()">
            <input type="number"
                   class="custom-course-crd-input"
                   draggable="false"
                   step="0.5"
                   min="0"
                   max="30"
                   value="${course.crd}"
                   aria-label="${escapeHTML(currentLang === 'en' ? 'Credits' : 'Kredi')}"
                   title="${escapeHTML(currentLang === 'en' ? 'Credits' : 'Kredi')}"
                   oninput="updateCustomCourseField('${escapeHTML(course.id)}', 'crd', this.value)">
            <span>Cr</span>
          </label>
          <button type="button"
                  class="custom-course-delete-btn"
                  onclick="deleteCustomCourse('${escapeHTML(course.id)}', event)"
                  title="${currentLang === 'en' ? 'Delete custom course' : 'Özel dersi sil'}">✕</button>
        </div>
        <div class="custom-course-edit-row">
          <input type="text"
                 class="custom-course-input name-input"
                 draggable="false"
                 value="${escapeHTML(course.name)}"
                 placeholder="${currentLang === 'en' ? 'Course Name' : 'Ders Adı'}"
                 aria-label="${currentLang === 'en' ? 'Course Name' : 'Ders Adı'}"
                 onmousedown="event.stopPropagation()"
                 onclick="event.stopPropagation()"
                 oninput="updateCustomCourseField('${escapeHTML(course.id)}', 'name', this.value)">
        </div>
        <div class="course-prereq" style="${safePrereq ? '' : 'display:none;'}">${safePrereq}</div>
        <div class="course-controls" style="margin-top: 4px;">
          ${badgeHtml}
          <button type="button" class="mobile-term-pick-btn" onclick="openTermPickerModal('${escapeHTML(course.id)}'); event.stopPropagation();">
            ${escapeHTML(t('addToTermBtn'))}
          </button>
        </div>
      `;

      if (isPlaced) {
        poolCard.style.cursor = 'pointer';
        poolCard.addEventListener('click', (e) => {
          if (e.target && e.target.closest('input, select, button, label, a')) return;
          toggleInstancePassed(placedInst.instanceId, !placedInst.passed);
        });
      }

      if (!isMobileDevice()) {
        poolCard.addEventListener('dragstart', handlePoolDragStart);
        poolCard.addEventListener('dragend', handleDragEnd);
      }
      customGroup.appendChild(poolCard);
    });

    pool.appendChild(customGroup);
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
      const splitChildren = state.instances
        .filter(inst => inst.splitSlotCourseId === course.id && inst.catalogCourse)
        .sort((a, b) => (a.splitIndex || 1) - (b.splitIndex || 1));

      if (splitChildren.length >= 1) {
        const allSplitPassed = splitChildren.length >= 2 && splitChildren.every(ch => ch.passed === true && ch.grade !== 'F');
        const splitCard = document.createElement('div');
        splitCard.className = `course-card pool-split-card ${allSplitPassed ? 'status-passed pool-locked' : 'status-failed'}`;

        const halves = [0, 1].map(idx => {
          const ch = splitChildren[idx];
          if (!ch) {
            const firstInstId = splitChildren[0] ? splitChildren[0].instanceId : '';
            return `
              <div class="split-half status-failed"
                   onclick="openElectiveCatalogModal('${escapeHTML(firstInstId)}'); event.stopPropagation();">
                <div class="split-half-code">+ ${currentLang === 'en' ? 'Select 2nd' : '2. Dersi Seç'}</div>
                <div class="split-half-meta">${currentLang === 'en' ? '1 course missing' : '1 ders eksik'}</div>
              </div>
            `;
          }
          const stCls = ch.passed ? 'status-passed' : 'status-failed';
          const stTxt = ch.passed ? `✓ ${escapeHTML(ch.grade || (isPassFailCourse(ch, ch.catalogCourse) ? 'P' : 'AA'))}` : (currentLang === 'en' ? '✕ Not Taken' : '✕ Verilmedi');
          const displayCode = (ch.customText && ch.customText.trim()) ? ch.customText.trim() : (ch.catalogCourse.code || '');
          return `
            <div class="split-half ${stCls}"
                 onclick="toggleInstancePassed('${escapeHTML(ch.instanceId)}', ${!ch.passed}); event.stopPropagation();"
                 title="${escapeHTML(displayCode)} — ${escapeHTML(ch.catalogCourse.name)}">
              <div class="split-half-code" data-split-code-inst-id="${escapeHTML(ch.instanceId)}">${escapeHTML(displayCode)}</div>
              <div class="split-half-meta">${ch.catalogCourse.crd} Cr • ${escapeHTML(stTxt)}</div>
            </div>
          `;
        }).join('');

        const overallLabel = allSplitPassed
          ? (currentLang === 'en' ? '✓ Passed (2/2)' : '✓ Verildi (2/2)')
          : (currentLang === 'en' ? '✕ Incomplete' : '✕ Verilmedi');

        splitCard.innerHTML = `
          <div class="pool-split-header">
            <span>${escapeHTML(course.code)}</span>
            <span class="split-slot-badge">${escapeHTML(overallLabel)}</span>
          </div>
          <div class="pool-split-halves">${halves}</div>
        `;
        groupContainer.appendChild(splitCard);
        return;
      }

      const normCourseCode = course.code ? course.code.replace(/\s+/g, '').toUpperCase() : '';
      const courseInstances = state.instances.filter(inst => {
        if (inst.courseId === course.id) return true;
        if (inst.isCustom || (inst.courseId && String(inst.courseId).startsWith('custom'))) return false;
        const instCourse = getCourseForInstance(inst);
        if (instCourse && instCourse.isCustom) return false;
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
        ${course.isCustom ? `
      <div class="custom-course-edit-row" style="margin-top:4px;">
        <input type="text"
               class="custom-course-input"
               draggable="false"
               value="${safeCode}"
               placeholder="${escapeHTML(currentLang === 'en' ? 'Course Code (e.g. PE 101)' : 'Ders Kodu (örn. PE 101)')}"
               onmousedown="event.stopPropagation()"
               onclick="event.stopPropagation()"
               oninput="updateCustomCourseField('${escapeHTML(course.id)}', 'code', this.value)" onchange="updateCustomCourseField('${escapeHTML(course.id)}', 'code', this.value)">
        <label class="custom-course-crd-wrap" onmousedown="event.stopPropagation()" onclick="event.stopPropagation()">
          <input type="number"
                 class="custom-course-crd-input"
                 draggable="false"
                 step="0.5"
                 min="0"
                 max="30"
                 value="${course.crd}"
                 oninput="updateCustomCourseField('${escapeHTML(course.id)}', 'crd', this.value)">
          <span>Cr</span>
        </label>
      </div>
      <div class="custom-course-edit-row">
        <input type="text"
               class="custom-course-input name-input"
               draggable="false"
               value="${safeName}"
               placeholder="${currentLang === 'en' ? 'Course Name' : 'Ders Adı'}"
               onmousedown="event.stopPropagation()"
               onclick="event.stopPropagation()"
               oninput="updateCustomCourseField('${escapeHTML(course.id)}', 'name', this.value)">
      </div>
    ` : `<div class="course-name">${safeName}</div>`}
        ${(course.isElective && courseInstances.length > 0 && courseInstances[0] && courseInstances[0].customText) ? `
          <div class="course-prereq" data-pool-code-inst-id="${escapeHTML(courseInstances[0].instanceId)}" style="font-weight:700; color: var(--info-color);">${escapeHTML(courseInstances[0].customText)}</div>
        ` : ''}
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
  const isCustom = !!course.isCustom;

  if (isCustom) {
    const prevInst = state.instances.find(i => i.courseId === course.id);
    if (prevInst) {
      const oldCard = document.getElementById(`inst-${prevInst.instanceId}`);
      if (oldCard) oldCard.remove();
      state.instances = state.instances.filter(i => i.courseId !== course.id);
    }
  }

  const newInst = {
    instanceId: 'inst_' + (isMinor ? 'user_minor_' : (isDm ? 'user_dm_' : (isCustom ? 'custom_' : ''))) + Date.now() + '_' + Math.random().toString(36).substr(2, 5),
    courseId: courseId,
    semId: targetSem,
    passed: false,
    grade: 'AA',
    customText: '',
    isMinor: isMinor,
    minorCourse: isMinor ? course : undefined,
    isDoubleMajor: isDm,
    dmCourse: isDm ? course : undefined,
    isCustom: isCustom,
    customCourse: isCustom ? course : undefined
  };

  if (isCustom) {
    state.instances.unshift(newInst);
  } else {
    state.instances.push(newInst);
  }
  saveGlobalState();

  const card = createSemesterCourseCard(newInst, course);
  const targetBox = document.querySelector(`[data-sem-id="${targetSem}"]`);
  if (targetBox) {
    if (isCustom) {
      const firstCard = targetBox.querySelector('.course-card');
      if (firstCard) {
        targetBox.insertBefore(card, firstCard);
      } else {
        targetBox.appendChild(card);
      }
    } else {
      targetBox.appendChild(card);
    }
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

  const isPF = isPassFailCourse(inst, course);
  let currentGrade = inst.grade || (isPF ? 'P' : 'AA');
  if (isPF && !['P', 'F', 'EX'].includes(currentGrade)) {
    currentGrade = 'P';
    inst.grade = 'P';
  }
  const allowedGrades = isPF ? ['P', 'F'] : Object.keys(GRADE_POINTS);
  if (isPF && currentGrade === 'EX' && !allowedGrades.includes('EX')) {
    allowedGrades.push('EX');
  }

  const gradeOptions = allowedGrades.map(g => {
    const valText = GRADE_POINTS[g] !== null ? `(${GRADE_POINTS[g].toFixed(1)})` : (g === 'EX' ? '(Transfer)' : '(Pass)');
    return `<option value="${g}" ${currentGrade === g ? 'selected' : ''}>${g} ${valText}</option>`;
  }).join('');

  const isCustomElective = Boolean(course.isElective && inst.customText);
  const effectiveCode = isCustomElective ? inst.customText : course.code;
  const courseUrl = getBounCourseUrl(effectiveCode, resolveCourseTerm(isCustomElective ? null : course, effectiveCode));

  const safeCode = escapeHTML(course.code);
  const safeName = escapeHTML(course.name);
  const effectivePrereq = resolveDynamicPrereqForInstance(inst, course);
  const safePrereq = effectivePrereq ? escapeHTML(translatePrereq(effectivePrereq)) : '';
  const stateForPrereq = getDeptState(currentDept);
  const missingPrereqs = !isPassed ? getMissingPrereqsForInstance(inst, effectivePrereq, stateForPrereq.instances) : [];
  if (missingPrereqs.length > 0) {
    card.classList.add('prereq-missing');
  }
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
    ${missingPrereqs.length > 0 ? `<div class="course-prereq-missing-badge">⚠️ ${escapeHTML(t('missingPrereqLabel'))}: ${escapeHTML(missingPrereqs.join(', '))}</div>` : ''}

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
      ${getElectiveCatalogCategories(findCourseById(inst.splitSlotCourseId || inst.courseId) || course) ? `
        <button type="button"
                class="elective-catalog-btn"
                onclick="openElectiveCatalogModal('${escapeHTML(inst.instanceId)}'); event.stopPropagation();">
          📚 ${escapeHTML(currentLang === 'en' ? 'Choose from Catalog' : 'Katalogdan Seç')}
        </button>
      ` : ''}
    ` : ''}

    <div class="course-controls">
      <label style="cursor:pointer; display:flex; align-items:center; gap:5px; font-weight:600;">
        <input type="checkbox" ${isPassed ? 'checked' : ''} onchange="toggleInstancePassed('${inst.instanceId}', this.checked)">
        ${escapeHTML(t('passedCheck'))}
      </label>
      <span class="status-badge ${isPassed ? 'locked' : 'failed'}">
        ${escapeHTML(course.isCustom
          ? (isPassed ? (currentLang === 'en' ? '✓ Passed' : '✓ Verildi') : (currentLang === 'en' ? '✕ Not Taken' : '✕ Verilmedi'))
          : (isPassed ? t('completedBadge') : t('failedStatus')))}
      </span>
    </div>
  `;

  if (!isPassed && !isMobile) {
    card.addEventListener('dragstart', handleInstanceDragStart);
    card.addEventListener('dragend', handleDragEnd);
  }

  if (course.isCustom) {
    card.style.cursor = 'pointer';
    card.addEventListener('click', (e) => {
      if (e.target && e.target.closest('input, select, button, label, a')) return;
      toggleInstancePassed(inst.instanceId, !inst.passed);
    });
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
    const isCustom = !!course.isCustom;

    let preservedPassed = false;
    let preservedGrade = 'AA';
    if (isCustom) {
      const prevInst = state.instances.find(i => i.courseId === draggedId);
      if (prevInst) {
        preservedPassed = !!prevInst.passed;
        preservedGrade = prevInst.grade || 'AA';
        const oldCard = document.getElementById(`inst-${prevInst.instanceId}`);
        if (oldCard) oldCard.remove();
        state.instances = state.instances.filter(i => i.courseId !== draggedId);
      }
    }

    const newInst = {
      instanceId: 'inst_' + (isMinor ? 'user_minor_' : (isDm ? 'user_dm_' : (isCustom ? 'custom_' : ''))) + Date.now() + '_' + Math.random().toString(36).substr(2, 5),
      courseId: draggedId,
      semId: semId,
      passed: preservedPassed,
      grade: preservedGrade,
      customText: '',
      isMinor: isMinor,
      minorCourse: isMinor ? course : undefined,
      isDoubleMajor: isDm,
      dmCourse: isDm ? course : undefined,
      isCustom: isCustom,
      customCourse: isCustom ? course : undefined
    };

    if (isCustom) {
      state.instances.unshift(newInst);
    } else {
      const targetIndex = afterElement
        ? state.instances.findIndex(i => i.instanceId === afterElement.dataset.instanceId)
        : state.instances.length;

      if (targetIndex > -1 && targetIndex < state.instances.length) {
        state.instances.splice(targetIndex, 0, newInst);
      } else {
        state.instances.push(newInst);
      }
    }

    saveGlobalState();

    const card = createSemesterCourseCard(newInst, course);
    if (isCustom) {
      const firstCard = this.querySelector('.course-card');
      if (firstCard) {
        this.insertBefore(card, firstCard);
      } else {
        this.appendChild(card);
      }
    } else if (afterElement) {
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
    const courseForGrade = getCourseForInstance(inst);
    if (isChecked) {
      if (isPassFailCourse(inst, courseForGrade)) {
        if (!inst.grade || !['P', 'F', 'EX'].includes(inst.grade) || inst.grade === 'F') {
          inst.grade = 'P';
        }
      } else if (!inst.grade || inst.grade === 'F') {
        inst.grade = 'AA';
      }
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
    refreshRepeatBadges();
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
    const trimmed = String(text || '').trim();
    if (inst.splitSlotCourseId && inst.catalogCourse) {
      inst.catalogCourse.code = trimmed;
    }
    const poolSplitStatic = document.querySelector(`[data-split-code-inst-id="${CSS.escape(instanceId)}"]`);
    if (poolSplitStatic) {
      const fallbackCourse = findCourseById(inst.splitSlotCourseId || inst.courseId);
      poolSplitStatic.textContent = trimmed || (fallbackCourse ? fallbackCourse.code : '');
    }
    const poolSingleStatic = document.querySelector(`[data-pool-code-inst-id="${CSS.escape(instanceId)}"]`);
    if (poolSingleStatic) {
      poolSingleStatic.textContent = trimmed;
      poolSingleStatic.style.display = trimmed ? '' : 'none';
    }
    saveGlobalState();

    const card = document.getElementById(`inst-${instanceId}`);
    if (card) {
      const linkWrap = card.querySelector('.course-desc-link-wrap');
      if (linkWrap) {
        const course = getCourseForInstance(inst);
        const isCustomElective = Boolean(course && course.isElective && text.trim());
        const effectiveCode = isCustomElective ? text.trim() : (course ? course.code : text.trim());
        const effectivePrereq = resolveDynamicPrereqForInstance(inst, course);
        const missingPrereqs = !inst.passed ? getMissingPrereqsForInstance(inst, effectivePrereq, state.instances) : [];
        card.classList.toggle('prereq-missing', missingPrereqs.length > 0);
        let prereqEl = card.querySelector('.course-prereq');
        if (effectivePrereq) {
          if (!prereqEl) {
            prereqEl = document.createElement('div');
            prereqEl.className = 'course-prereq';
            const nameEl = card.querySelector('.course-name');
            if (nameEl) nameEl.insertAdjacentElement('afterend', prereqEl);
          }
          prereqEl.innerText = translatePrereq(effectivePrereq);
        } else if (prereqEl) {
          prereqEl.remove();
        }
        let warnEl = card.querySelector('.course-prereq-missing-badge');
        if (missingPrereqs.length > 0) {
          if (!warnEl) {
            warnEl = document.createElement('div');
            warnEl.className = 'course-prereq-missing-badge';
            const anchor = card.querySelector('.course-prereq') || card.querySelector('.course-name');
            if (anchor) anchor.insertAdjacentElement('afterend', warnEl);
          }
          warnEl.innerText = `⚠️ ${t('missingPrereqLabel')}: ${missingPrereqs.join(', ')}`;
        } else if (warnEl) {
          warnEl.remove();
        }
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
    refreshAllPrereqWarnings();
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
      customCourses: state.customCourses || [],
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

let pngExportState = {
  theme: 'light',
  layout: 'horizontal'
};

function setPngExportTheme(theme) {
  pngExportState.theme = theme === 'dark' ? 'dark' : 'light';
  const lightBtn = document.getElementById('pngThemeLightBtn');
  const darkBtn = document.getElementById('pngThemeDarkBtn');
  if (lightBtn) lightBtn.classList.toggle('active', pngExportState.theme === 'light');
  if (darkBtn) darkBtn.classList.toggle('active', pngExportState.theme === 'dark');
}

function setPngExportLayout(layout) {
  pngExportState.layout = layout === 'vertical' ? 'vertical' : 'horizontal';
  const horizBtn = document.getElementById('pngLayoutHorizBtn');
  const vertBtn = document.getElementById('pngLayoutVertBtn');
  if (horizBtn) horizBtn.classList.toggle('active', pngExportState.layout === 'horizontal');
  if (vertBtn) vertBtn.classList.toggle('active', pngExportState.layout === 'vertical');
}

function openPngExportModal() {
  const modal = document.getElementById('pngExportModal');
  if (!modal) {
    exportPlanAsPng();
    return;
  }

  const activeTheme = document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
  setPngExportTheme(activeTheme);
  setPngExportLayout(pngExportState.layout || 'horizontal');

  const isEn = currentLang === 'en';
  const setText = (id, text) => {
    const el = document.getElementById(id);
    if (el) el.textContent = text;
  };
  setText('pngExportModalTitle', isEn ? '🖼️ Export as Image (PNG)' : '🖼️ Görsel Dışa Aktar (PNG)');
  setText('pngThemeLabel', isEn ? 'Theme' : 'Tema Seçimi');
  setText('pngThemeLightBtn', isEn ? '☀️ Light Theme' : '☀️ Açık Tema');
  setText('pngThemeDarkBtn', isEn ? '🌙 Dark Theme' : '🌙 Koyu Tema');
  setText('pngLayoutLabel', isEn ? 'Layout Orientation' : 'Yerleşim Yönü');
  setText('pngLayoutHorizBtn', isEn ? '↔️ Horizontal (Wide)' : '↔️ Yatay (Geniş)');
  setText('pngLayoutVertBtn', isEn ? '↕️ Vertical (Story)' : '↕️ Dikey (Story)');
  setText('pngShowGradesLabel', isEn ? 'Show Letter Grades & GPA' : 'Harf Notları & GPA Bilgisini Göster');
  setText('pngExportCancelBtn', isEn ? 'Cancel' : 'Vazgeç');
  setText('pngExportConfirmBtn', isEn ? '📥 Download as PNG' : '📥 PNG Olarak İndir');

  modal.classList.add('open');
}

function closePngExportModal() {
  const modal = document.getElementById('pngExportModal');
  if (modal) modal.classList.remove('open');
}

function handlePngExportBackdropClick(event) {
  if (event.target && event.target.id === 'pngExportModal') {
    closePngExportModal();
  }
}

function confirmPngExport() {
  const showGradesEl = document.getElementById('pngShowGradesCheck');
  const showGrades = showGradesEl ? showGradesEl.checked : true;
  closePngExportModal();
  exportPlanAsPng({
    theme: pngExportState.theme,
    layout: pngExportState.layout,
    showGrades
  });
}

function createShareExportBoard(options = {}) {
  const theme = options.theme === 'dark' ? 'dark' : 'light';
  const layout = options.layout === 'vertical' ? 'vertical' : 'horizontal';
  const showGrades = options.showGrades !== false;
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
  board.className = `share-export-board export-theme-${theme} export-layout-${layout}`;
  board.id = 'shareExportBoard';
  board.setAttribute('data-theme', theme);

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

      const isPF = isPassFailCourse(inst, course);
      const rawGrade = inst.grade || (isPF ? 'P' : 'AA');
      const effectiveGrade = isErasmus ? 'EX' : (isPF && !['P', 'F', 'EX'].includes(rawGrade) ? 'P' : rawGrade);
      const gradeBadge = isPassed
        ? (showGrades
          ? `<span class="export-course-grade">${escapeHTML(effectiveGrade)}</span>`
          : `<span class="export-course-grade">✓</span>`)
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
            ${showGrades ? `<span class="export-spa-badge ${spaStr !== '-' ? 'active' : ''}">SPA: ${spaStr}</span>` : ''}
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
        ${showGrades ? `
        <div class="export-stat-card gpa-card">
          <div class="export-stat-label">GPA / GNO</div>
          <div class="export-stat-val gpa">${gpa}</div>
        </div>` : ''}
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

async function exportPlanAsPng(options = {}) {
  if (typeof html2canvas === 'undefined') {
    alert("html2canvas kütüphanesi henüz yüklenmedi.");
    return;
  }

  const activeTheme = options.theme || (document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light');
  const resolvedOptions = {
    theme: activeTheme,
    layout: options.layout || 'horizontal',
    showGrades: options.showGrades !== false
  };

  const board = createShareExportBoard(resolvedOptions);
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
      backgroundColor: resolvedOptions.theme === 'dark' ? '#0b1120' : '#f8fafc',
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
      selectedDmId: payload.dm || null,
      customCourses: Array.isArray(payload.customCourses) ? payload.customCourses : []
    };

    updateSandboxBannerUI();
  updateThemeToggleButtons();
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
  updateThemeToggleButtons();
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
  updateThemeToggleButtons();
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

  const hasMinor = Boolean(minorId && minorsData[minorId]);
  const catMinorRemoveBtn = document.getElementById('catalogMinorRemoveBtn');
  if (catMinorRemoveBtn) {
    catMinorRemoveBtn.classList.toggle('is-hidden', !hasMinor);
    catMinorRemoveBtn.title = t('minorRemoveTooltip');
    catMinorRemoveBtn.setAttribute('aria-label', t('minorRemoveTooltip'));
  }
  const minorModalRemoveBtn = document.getElementById('minorModalRemoveBtn');
  if (minorModalRemoveBtn) {
    minorModalRemoveBtn.classList.toggle('is-hidden', !hasMinor);
    minorModalRemoveBtn.innerText = t('minorModalRemoveBtn');
  }

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
    <div style="margin-top: 8px; font-size: 0.82rem; color: var(--text-color);">
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

  const hasDm = Boolean(dmId && dmData[dmId]);
  const catDmRemoveBtn = document.getElementById('catalogDmRemoveBtn');
  if (catDmRemoveBtn) {
    catDmRemoveBtn.classList.toggle('is-hidden', !hasDm);
    catDmRemoveBtn.title = t('dmRemoveTooltip');
    catDmRemoveBtn.setAttribute('aria-label', t('dmRemoveTooltip'));
  }
  const dmModalRemoveBtn = document.getElementById('dmModalRemoveBtn');
  if (dmModalRemoveBtn) {
    dmModalRemoveBtn.classList.toggle('is-hidden', !hasDm);
    dmModalRemoveBtn.innerText = t('dmModalRemoveBtn');
  }

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
      <div style="color: var(--badge-warn-text); background: var(--badge-warn-bg); padding: 10px 12px; border-radius: 8px; border: 1px solid var(--badge-warn-border);">
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
    <div style="margin-top: 8px; font-size: 0.82rem; color: var(--text-color);">
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

const FEEDBACK_API_URL = "https://bountracker-api.vercel.app/api/issue";

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
    sheet.style.height = '';
    sheet.style.maxHeight = '';
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

(function initMobileDraggableBottomSheets() {
  const bindDraggableSheet = (modalId, sheetSelector, handleSelector, headerSelector, closeFn) => {
    const modal = document.getElementById(modalId);
    const sheet = modal ? modal.querySelector(sheetSelector) : null;
    if (!modal || !sheet) return;

    const handleEl = sheet.querySelector(handleSelector);
    const headerEl = sheet.querySelector(headerSelector);
    const dragZones = [handleEl, headerEl].filter(Boolean);
    if (dragZones.length === 0) return;

    let isDragging = false;
    let startY = 0;
    let lastY = 0;
    let startTime = 0;
    let startHeight = 0;

    const onTouchStart = (e) => {
      if (!modal.classList.contains('open') || e.touches.length !== 1) return;
      if (e.target && e.target.closest('button, a, input, select')) return;

      isDragging = true;
      startY = e.touches[0].clientY;
      lastY = startY;
      startTime = Date.now();
      startHeight = sheet.getBoundingClientRect().height;
      sheet.style.transition = 'none';
      sheet.style.maxHeight = '88vh';
    };

    const onTouchMove = (e) => {
      if (!isDragging || e.touches.length !== 1) return;
      const clientY = e.touches[0].clientY;
      lastY = clientY;
      const deltaY = clientY - startY;
      const vh = window.innerHeight || document.documentElement.clientHeight;
      const minH = Math.round(vh * 0.14);
      const maxH = Math.round(vh * 0.88);
      const nextH = Math.max(minH, Math.min(maxH, Math.round(startHeight - deltaY)));

      sheet.style.height = `${nextH}px`;
      if (e.cancelable) e.preventDefault();
    };

    const onTouchEnd = () => {
      if (!isDragging) return;
      isDragging = false;

      const vh = window.innerHeight || document.documentElement.clientHeight;
      const currentH = sheet.getBoundingClientRect().height;
      const dy = lastY - startY;
      const dt = Date.now() - startTime;
      const isFastDown = dy > 55 && dt < 260;

      sheet.style.transition = 'height 0.2s ease, transform 0.2s ease';

      if (currentH < vh * 0.22 || isFastDown) {
        sheet.style.height = '0px';
        setTimeout(() => {
          closeFn();
          sheet.style.height = '';
          sheet.style.maxHeight = '';
          sheet.style.transition = '';
        }, 190);
      } else {
        setTimeout(() => {
          if (modal.classList.contains('open')) {
            sheet.style.transition = '';
          }
        }, 210);
      }
    };

    dragZones.forEach(zone => {
      zone.addEventListener('touchstart', onTouchStart, { passive: true });
      zone.addEventListener('touchmove', onTouchMove, { passive: false });
      zone.addEventListener('touchend', onTouchEnd, { passive: true });
      zone.addEventListener('touchcancel', onTouchEnd, { passive: true });
    });
  };

  document.addEventListener('DOMContentLoaded', () => {
    bindDraggableSheet('mobileCatalogModal', '.catalog-sheet', '.bottom-sheet-handle', '.catalog-header', closeMobileCatalog);
    bindDraggableSheet('termPickerModal', '.bottom-sheet-dialog', '.bottom-sheet-handle', '.bottom-sheet-header', closeTermPickerModal);
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
  showToast(t('toastSupportThanks'));
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

let lastLayoutWidth = window.innerWidth;
const mobileBreakpointMq = window.matchMedia('(max-width: 900px)');

function resetMobileLayoutState(isMobileView) {
  const sidebar = document.getElementById('sidebarContainer');
  const main = document.getElementById('years-grid');
  const btnPool = document.getElementById('tabBtnPool');
  const btnSem = document.getElementById('tabBtnSemesters');

  [sidebar, main, document.body, document.documentElement].forEach(el => {
    if (!el) return;
    el.style.transform = '';
    el.style.overflow = '';
    if (el === sidebar || el === main) {
      el.style.display = '';
    }
  });

  if (!isMobileView) {
    closeToolsDropdown();
    const mobileCatalogModal = document.getElementById('mobileCatalogModal');
    if (mobileCatalogModal) mobileCatalogModal.classList.remove('open');
    const termPickerModal = document.getElementById('termPickerModal');
    if (termPickerModal) termPickerModal.classList.remove('open');
  } else if (sidebar && main) {
    const hasActive = sidebar.classList.contains('active-tab') || main.classList.contains('active-tab');
    if (!hasActive) {
      main.classList.add('active-tab');
      if (btnSem) btnSem.classList.add('active');
      if (btnPool) btnPool.classList.remove('active');
    }
  }
}

function handleBreakpointChange(e) {
  lastLayoutWidth = window.innerWidth;
  resetMobileLayoutState(e.matches);
  initUI();
  const ptModal = document.getElementById('prereqTreeModal');
  if (ptModal && ptModal.classList.contains('open')) {
    requestAnimationFrame(() => drawPrereqTreeArrows());
  }
}

if (typeof mobileBreakpointMq.addEventListener === 'function') {
  mobileBreakpointMq.addEventListener('change', handleBreakpointChange);
} else if (typeof mobileBreakpointMq.addListener === 'function') {
  mobileBreakpointMq.addListener(handleBreakpointChange);
}

window.addEventListener('resize', () => {
  const activeEl = document.activeElement;
  const isEditingField = activeEl && /^(INPUT|TEXTAREA|SELECT)$/i.test(activeEl.tagName);
  const currentWidth = window.innerWidth;
  const widthChanged = Math.abs(currentWidth - lastLayoutWidth) > 1;

  // iPadOS/iOS sanal klavye açılışında yalnızca innerHeight değişir; DOM'u yeniden çizme
  if (!widthChanged) {
    if (isEditingField) return;
    const ptModal = document.getElementById('prereqTreeModal');
    if (ptModal && ptModal.classList.contains('open')) {
      requestAnimationFrame(() => drawPrereqTreeArrows());
    }
    return;
  }

  lastLayoutWidth = currentWidth;
  if (isEditingField) return;

  if (currentWidth > 900) {
    resetMobileLayoutState(false);
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
  const treeState = getDeptState(currentDept);
  const customTreeCourses = (treeState.instances || []).filter(i => i.isCustom && i.customCourse).map(i => i.customCourse);
  const allCourses = [...getActiveCurriculumCourses(), ...customTreeCourses];

  const codeToCourses = {};
  const nodesById = {};
  const prereqsOf = {};
  const unlocksOf = {};

  const assignedByCourseId = {};
  (state.instances || []).forEach(inst => {
    if (!inst || !inst.customText || !inst.customText.trim()) return;
    const instCourse = getCourseForInstance(inst);
    if (!instCourse || !instCourse.isElective) return;
    if (!assignedByCourseId[instCourse.id]) {
      assignedByCourseId[instCourse.id] = {
        customText: inst.customText.trim(),
        code: extractAssignedElectiveCode(inst.customText),
        inst
      };
    }
  });

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

    const assigned = assignedByCourseId[c.id];
    if (assigned && assigned.code && assigned.code !== norm) {
      if (!codeToCourses[assigned.code]) codeToCourses[assigned.code] = [];
      codeToCourses[assigned.code].push(c);
    }
  });

  const edges = [];
  const edgeKeys = new Set();

  allCourses.forEach(course => {
    const assigned = assignedByCourseId[course.id];
    const effectivePrereq = assigned
      ? resolveDynamicPrereqForInstance(assigned.inst, course)
      : (course.prereq || getPrereqFromMaps(course.code));
    if (!effectivePrereq) return;
    const reqNormCodes = extractAllPrereqCodes(effectivePrereq);
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

  const passedCodesSet = new Set();
  (state.instances || []).forEach(inst => {
    if (inst.passed === true && inst.grade !== 'F') {
      const c = getCourseForInstance(inst);
      if (c && c.code) passedCodesSet.add(normalizeCourseCodeStr(c.code));
      const assigned = extractAssignedElectiveCode(inst.customText);
      if (assigned) passedCodesSet.add(assigned);
    }
  });

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
        if (!course.isCustom && (inst.isCustom || (inst.courseId && String(inst.courseId).startsWith('custom')))) return false;
        const instCourse = getCourseForInstance(inst);
        if (!course.isCustom && instCourse && instCourse.isCustom) return false;
        return instCourse && instCourse.code && normCode && normalizeCourseCodeStr(instCourse.code) === normCode;
      });

      const hasPassed = courseInstances.some(inst => inst.passed === true && inst.grade !== 'F');
      const isPlaced = !hasPassed && courseInstances.length > 0;

      const assignedInfo = assignedByCourseId[course.id];
      const statusClass = hasPassed ? 'pt-node-passed' : (isPlaced ? 'pt-node-planned' : 'pt-node-pending');
      let lockStateClass = '';
      if (!hasPassed) {
        const effPrereq = assignedInfo
          ? resolveDynamicPrereqForInstance(assignedInfo.inst, course)
          : (course.prereq || getPrereqFromMaps(course.code));
        const andGroups = parsePrereqAndOrGroups(effPrereq);
        const isUnlocked = andGroups.every(orGroup => orGroup.some(reqCode => passedCodesSet.has(reqCode)));
        lockStateClass = isUnlocked ? 'pt-node-unlocked' : 'pt-node-locked';
      }

      const nodeEl = document.createElement('div');
      nodeEl.className = `pt-node ${statusClass}${lockStateClass ? ' ' + lockStateClass : ''}`;
      nodeEl.dataset.nodeId = course.id;
      const displayNodeName = assignedInfo ? `${course.name} — ${assignedInfo.customText}` : course.name;
      nodeEl.innerHTML = `
        <div class="pt-node-top">
          <span class="pt-node-code">${escapeHTML(course.code)}</span>
          <span class="pt-node-crd">${course.crd} Cr</span>
        </div>
        <div class="pt-node-name" title="${escapeHTML(displayNodeName)}">${escapeHTML(displayNodeName)}</div>
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
        <path d="M 0 1.5 L 9 5 L 0 8.5 z" fill="var(--pt-edge-default, #94a3b8)"></path>
      </marker>
      <marker id="pt-arrow-prereq" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
        <path d="M 0 1.5 L 9 5 L 0 8.5 z" fill="var(--pt-edge-prereq, #f97316)"></path>
      </marker>
      <marker id="pt-arrow-unlock" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
        <path d="M 0 1.5 L 9 5 L 0 8.5 z" fill="var(--pt-edge-unlock, #8b5cf6)"></path>
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


(function initPrereqTreeDragToPan() {
  const wrap = document.getElementById('prereqTreeCanvasWrap');
  if (!wrap || wrap.dataset.panInit) return;
  wrap.dataset.panInit = '1';

  let isMouseDown = false;
  let hasDragged = false;
  let suppressNextClick = false;
  let startX = 0;
  let startY = 0;
  let startScrollLeft = 0;
  let startScrollTop = 0;

  const isDesktop = () => window.matchMedia('(min-width: 769px)').matches;

  const stopPan = () => {
    if (!isMouseDown) return;
    isMouseDown = false;
    wrap.classList.remove('is-panning');
    if (hasDragged) {
      suppressNextClick = true;
      setTimeout(() => {
        suppressNextClick = false;
      }, 0);
    }
    hasDragged = false;
  };

  wrap.addEventListener('mousedown', (e) => {
    if (!isDesktop() || e.button !== 0) return;
    if (e.target && e.target.closest('button, a, input, select, textarea')) return;

    isMouseDown = true;
    hasDragged = false;
    startX = e.clientX;
    startY = e.clientY;
    startScrollLeft = wrap.scrollLeft;
    startScrollTop = wrap.scrollTop;
  });

  wrap.addEventListener('mousemove', (e) => {
    if (!isMouseDown) return;
    const dx = e.clientX - startX;
    const dy = e.clientY - startY;

    if (!hasDragged && (Math.abs(dx) > 4 || Math.abs(dy) > 4)) {
      hasDragged = true;
      wrap.classList.add('is-panning');
    }

    if (hasDragged) {
      e.preventDefault();
      wrap.scrollLeft = startScrollLeft - dx;
      wrap.scrollTop = startScrollTop - dy;
    }
  });

  wrap.addEventListener('mouseup', stopPan);
  wrap.addEventListener('mouseleave', stopPan);

  wrap.addEventListener('click', (e) => {
    if (suppressNextClick) {
      e.preventDefault();
      e.stopPropagation();
      suppressNextClick = false;
    }
  }, true);
})();


// =========================================================
// What-If GPA & Repeat Simülatörü
// =========================================================
let whatIfActiveTab = 'target';
let whatIfRepeatOverrides = {};

function computeWhatIfBaseline() {
  const state = getDeptState(currentDept);
  const erasmusSet = new Set(state.erasmusSemesters || []);
  const sortedInstances = [...(state.instances || [])].sort((a, b) => compareSemesters(a.semId, b.semId));

  const latestPassedByCourse = {};
  const latestInstanceByCourse = {};

  sortedInstances.forEach(inst => {
    const course = getCourseForInstance(inst);
    if (!course) return;
    const isErasmusTerm = erasmusSet.has(inst.semId);
    const effectiveGrade = (isErasmusTerm || inst.grade === 'EX') ? 'EX' : (inst.grade || '');
    latestInstanceByCourse[inst.courseId] = {
      courseId: inst.courseId,
      code: (inst.customText && inst.customText.trim()) ? inst.customText.trim() : (course.code || ''),
      name: course.name || '',
      crd: Number(course.crd) || 0,
      passed: !!inst.passed,
      grade: effectiveGrade
    };
    if (inst.passed) {
      latestPassedByCourse[inst.courseId] = {
        grade: effectiveGrade || 'AA',
        crd: Number(course.crd) || 0,
        code: (inst.customText && inst.customText.trim()) ? inst.customText.trim() : (course.code || ''),
        name: course.name || ''
      };
    }
  });

  let cumPoints = 0;
  let cumCredits = 0;
  Object.keys(latestPassedByCourse).forEach(cId => {
    const item = latestPassedByCourse[cId];
    if (item.grade !== 'P' && item.grade !== 'EX' && GRADE_POINTS[item.grade] !== null && GRADE_POINTS[item.grade] !== undefined) {
      cumPoints += GRADE_POINTS[item.grade] * item.crd;
      cumCredits += item.crd;
    }
  });

  // Plandaki henüz geçilmemiş / not girilmemiş kalan dersler
  const remainingCourses = [];
  const seenRemainingIds = new Set();
  Object.values(latestInstanceByCourse).forEach(item => {
    if (!item.passed && !latestPassedByCourse[item.courseId] && item.crd > 0) {
      remainingCourses.push({ courseId: item.courseId, code: item.code, name: item.name, crd: item.crd });
      seenRemainingIds.add(item.courseId);
    }
  });

  // Eğer planda henüz notsuz/planlanan ders yoksa müfredattaki alınmamış zorunlu derslerden oku
  if (remainingCourses.length === 0) {
    getActiveCurriculumCourses().forEach(c => {
      const crd = Number(c.crd) || 0;
      if (crd > 0 && !latestPassedByCourse[c.id] && !seenRemainingIds.has(c.id)) {
        remainingCourses.push({ courseId: c.id, code: c.code || '', name: c.name || '', crd });
        seenRemainingIds.add(c.id);
      }
    });
  }

  // Repeat edilebilir dersler (CC, DC, DD veya F)
  const repeatableCourses = [];
  const repeatGrades = new Set(['CC', 'DC', 'DD', 'F']);
  Object.values(latestInstanceByCourse).forEach(item => {
    const g = item.passed ? (latestPassedByCourse[item.courseId]?.grade || item.grade) : item.grade;
    if (item.crd > 0 && repeatGrades.has(g)) {
      repeatableCourses.push({
        courseId: item.courseId,
        code: item.code,
        name: item.name,
        crd: item.crd,
        oldGrade: g,
        inCurrentGpa: !!latestPassedByCourse[item.courseId] && GRADE_POINTS[g] !== null && GRADE_POINTS[g] !== undefined
      });
    }
  });

  const remainingCredits = remainingCourses.reduce((sum, c) => sum + c.crd, 0);
  return {
    cumPoints,
    cumCredits,
    currentGpa: cumCredits > 0 ? (cumPoints / cumCredits) : 0,
    remainingCourses,
    remainingCredits,
    repeatableCourses
  };
}

function computeRepeatAdjustedBaseline(baseline) {
  let simPoints = baseline.cumPoints;
  let simCredits = baseline.cumCredits;
  let reducedRemainingCredits = 0;

  baseline.repeatableCourses.forEach(rc => {
    const targetGrade = whatIfRepeatOverrides[rc.courseId];
    if (!targetGrade || GRADE_POINTS[targetGrade] === undefined || GRADE_POINTS[targetGrade] === null) return;
    const newPts = GRADE_POINTS[targetGrade];
    if (rc.inCurrentGpa) {
      const oldPts = GRADE_POINTS[rc.oldGrade] || 0;
      simPoints += (newPts - oldPts) * rc.crd;
    } else {
      simPoints += newPts * rc.crd;
      simCredits += rc.crd;
      reducedRemainingCredits += rc.crd;
    }
  });

  const simGpa = simCredits > 0 ? (simPoints / simCredits) : 0;
  return {
    simPoints,
    simCredits,
    simGpa,
    reducedRemainingCredits
  };
}

function buildBalancedGradePlan(courses, requiredPoints) {
  const gradeScale = [
    { g: 'DD', p: 1.0 },
    { g: 'DC', p: 1.5 },
    { g: 'CC', p: 2.0 },
    { g: 'CB', p: 2.5 },
    { g: 'BB', p: 3.0 },
    { g: 'BA', p: 3.5 },
    { g: 'AA', p: 4.0 }
  ];

  const totalCrd = courses.reduce((s, c) => s + c.crd, 0);
  if (totalCrd <= 0) return null;

  const avgNeeded = requiredPoints / totalCrd;
  let startIdx = 0;
  for (let i = 0; i < gradeScale.length; i++) {
    if (gradeScale[i].p <= avgNeeded) startIdx = i;
  }

  const assignments = courses.map(c => ({ crd: c.crd, idx: startIdx }));
  let currentPts = assignments.reduce((s, a) => s + a.crd * gradeScale[a.idx].p, 0);

  // En düşük nottan başlayarak dengeli biçimde birer kademe yükselt
  let safety = 0;
  while (currentPts + 1e-6 < requiredPoints && safety < 500) {
    safety++;
    let minIdx = 99;
    let pick = -1;
    for (let i = 0; i < assignments.length; i++) {
      if (assignments[i].idx < gradeScale.length - 1 && assignments[i].idx < minIdx) {
        minIdx = assignments[i].idx;
        pick = i;
      }
    }
    if (pick === -1) break;
    assignments[pick].idx += 1;
    currentPts = assignments.reduce((s, a) => s + a.crd * gradeScale[a.idx].p, 0);
  }

  const counts = {};
  assignments.forEach(a => {
    const g = gradeScale[a.idx].g;
    counts[g] = (counts[g] || 0) + 1;
  });

  return { counts, achievedPoints: currentPts, totalCrd };
}

function openWhatIfModal() {
  const modal = document.getElementById('whatIfModal');
  if (!modal) return;
  updateWhatIfLocalizedLabels();
  switchWhatIfTab(whatIfActiveTab || 'target');
  renderWhatIfTargetResult();
  renderWhatIfRepeatList();
  modal.classList.add('open');
}

function closeWhatIfModal() {
  const modal = document.getElementById('whatIfModal');
  if (modal) modal.classList.remove('open');
}

function handleWhatIfBackdropClick(event) {
  if (event.target && event.target.id === 'whatIfModal') {
    closeWhatIfModal();
  }
}

function updateWhatIfLocalizedLabels() {
  const isEn = currentLang === 'en';
  const setText = (id, txt) => {
    const el = document.getElementById(id);
    if (el) el.textContent = txt;
  };
  setText('whatIfModalTitle', isEn ? '🎯 Target GPA & Repeat Simulator' : '🎯 Hedef GNO & Repeat Simülatörü');
  setText('whatIfTabTargetBtn', isEn ? '🎯 Reverse Target GPA' : '🎯 Tersine Hedef GNO');
  setText('whatIfTabRepeatBtn', isEn ? '🔄 Course Repeat' : '🔄 Ders Tekrarı (Repeat)');
  setText('whatIfTargetInputLabel', isEn ? 'Target Cumulative GPA:' : 'Hedeflediğin GNO:');
  setText('whatIfResetBtn', isEn ? '↺ Reset' : '↺ Sıfırla');
  setText('whatIfCloseBtn', isEn ? 'Close' : 'Kapat');
}

function switchWhatIfTab(tab) {
  whatIfActiveTab = tab === 'repeat' ? 'repeat' : 'target';
  const targetBtn = document.getElementById('whatIfTabTargetBtn');
  const repeatBtn = document.getElementById('whatIfTabRepeatBtn');
  const targetPane = document.getElementById('whatIfTargetPane');
  const repeatPane = document.getElementById('whatIfRepeatPane');

  if (targetBtn) targetBtn.classList.toggle('active', whatIfActiveTab === 'target');
  if (repeatBtn) repeatBtn.classList.toggle('active', whatIfActiveTab === 'repeat');
  if (targetPane) targetPane.classList.toggle('active', whatIfActiveTab === 'target');
  if (repeatPane) repeatPane.classList.toggle('active', whatIfActiveTab === 'repeat');
}

function setWhatIfTarget(val) {
  const input = document.getElementById('whatIfTargetInput');
  if (input) input.value = Number(val).toFixed(2);
  renderWhatIfTargetResult();
}

function renderWhatIfTargetResult() {
  const statsEl = document.getElementById('whatIfCurrentStats');
  const resultEl = document.getElementById('whatIfTargetResult');
  const inputEl = document.getElementById('whatIfTargetInput');
  if (!statsEl || !resultEl || !inputEl) return;

  const isEn = currentLang === 'en';
  const baseline = computeWhatIfBaseline();
  const sim = computeRepeatAdjustedBaseline(baseline);
  const effectiveRemainingCourses = baseline.remainingCourses.filter(c => !(whatIfRepeatOverrides[c.courseId] && c.code));
  const remCredits = Math.max(0, baseline.remainingCredits - sim.reducedRemainingCredits);
  const activeGpa = sim.simGpa;

  statsEl.innerHTML = `
    <div class="whatif-stat-box">
      <span class="whatif-stat-label">${isEn ? 'Current GPA' : 'Mevcut GNO'}</span>
      <span class="whatif-stat-val">${activeGpa.toFixed(2)}</span>
    </div>
    <div class="whatif-stat-box">
      <span class="whatif-stat-label">${isEn ? 'GPA Credits' : 'Tamamlanan Kredi'}</span>
      <span class="whatif-stat-val">${sim.simCredits} Cr</span>
    </div>
    <div class="whatif-stat-box">
      <span class="whatif-stat-label">${isEn ? 'Remaining Planned' : 'Kalan Kredi'}</span>
      <span class="whatif-stat-val">${remCredits} Cr (${effectiveRemainingCourses.length})</span>
    </div>
  `;

  let targetGpa = parseFloat(inputEl.value);
  if (isNaN(targetGpa)) targetGpa = 3.0;
  targetGpa = Math.max(0, Math.min(4.0, targetGpa));

  resultEl.className = 'whatif-result-box';

  if (remCredits <= 0) {
    resultEl.classList.add('warn');
    resultEl.innerHTML = isEn
      ? 'No ungraded/planned remaining courses found. Add upcoming courses to your plan or use the <strong>Course Repeat</strong> tab.'
      : 'Planında henüz notu girilmemiş veya planlanan kalan ders bulunamadı. Dönemlere ders ekleyebilir veya <strong>Ders Tekrarı (Repeat)</strong> sekmesini kullanabilirsin.';
    return;
  }

  const totalCreditsAfter = sim.simCredits + remCredits;
  const requiredPoints = targetGpa * totalCreditsAfter - sim.simPoints;
  const requiredAvg = requiredPoints / remCredits;

  if (requiredAvg > 4.0) {
    resultEl.classList.add('warn');
    resultEl.innerHTML = `
      <div>${isEn
        ? `Target GPA <strong>${targetGpa.toFixed(2)}</strong> requires an average of <strong>${requiredAvg.toFixed(2)}</strong> over your remaining ${remCredits} credits (> 4.00).`
        : `<strong>${targetGpa.toFixed(2)}</strong> hedefi için kalan ${remCredits} kredide <strong>${requiredAvg.toFixed(2)}</strong> ortalama gerekiyor (4.00 üzeri).`}</div>
      <div style="margin-top:6px;">${isEn
        ? 'With current remaining credits this target is unreachable; try repeating older courses in the <strong>Course Repeat</strong> tab.'
        : 'Mevcut kalan krediyle bu hedefe ulaşılamıyor; <strong>Ders Tekrarı (Repeat)</strong> sekmesinden eski dersleri tekrar etmeyi deneyin.'}</div>
      <button type="button" class="whatif-preset-btn" style="margin-top:10px;" onclick="switchWhatIfTab('repeat')">🔄 ${isEn ? 'Open Repeat Simulator' : 'Repeat Simülasyonuna Git'}</button>
    `;
    return;
  }

  if (requiredAvg <= 0) {
    resultEl.classList.add('success');
    resultEl.innerHTML = isEn
      ? `Your current GPA (<strong>${activeGpa.toFixed(2)}</strong>) already secures <strong>${targetGpa.toFixed(2)}</strong> easily with passing grades.`
      : `Mevcut GNO'n (<strong>${activeGpa.toFixed(2)}</strong>) ile kalan dersleri geçmen hedef <strong>${targetGpa.toFixed(2)}</strong> için şimdiden fazlasıyla yeterli!`;
    return;
  }

  const plan = buildBalancedGradePlan(effectiveRemainingCourses, requiredPoints);
  const chipsHtml = plan ? Object.keys(plan.counts).map(g => {
    const cnt = plan.counts[g];
    return `<span class="whatif-grade-chip">${cnt}× ${g}</span>`;
  }).join('') : '';

  const projectedGpa = plan ? ((sim.simPoints + plan.achievedPoints) / totalCreditsAfter).toFixed(2) : targetGpa.toFixed(2);
  const summaryPhrase = plan
    ? Object.keys(plan.counts).map(g => isEn ? `${plan.counts[g]} ${g}` : `${plan.counts[g]}'inden ${g}`).join(', ')
    : '';

  resultEl.classList.add('success');
  resultEl.innerHTML = `
    <div>${isEn
      ? `Minimum average needed in remaining <strong>${remCredits} credits</strong>: <strong>${requiredAvg.toFixed(2)}</strong>`
      : `Kalan <strong>${remCredits} kredide</strong> gereken minimum ortalama: <strong>${requiredAvg.toFixed(2)}</strong>`}</div>
    ${plan ? `<div style="margin-top:6px;">${isEn
      ? `Realistic mix across ${effectiveRemainingCourses.length} courses: <strong>${summaryPhrase}</strong> → Projected GPA: <strong>${projectedGpa}</strong>`
      : `Kalan ${effectiveRemainingCourses.length} ders için dengeli dağılım: <strong>${summaryPhrase}</strong> alırsan GNO'n <strong>${projectedGpa}</strong> oluyor.`}</div>` : ''}
    <div class="whatif-grade-chips">${chipsHtml}</div>
  `;
}

function handleWhatIfRepeatChange(courseId, newGrade) {
  if (!newGrade) {
    delete whatIfRepeatOverrides[courseId];
  } else {
    whatIfRepeatOverrides[courseId] = newGrade;
  }
  renderWhatIfRepeatList();
  renderWhatIfTargetResult();
}

function resetWhatIfRepeat() {
  whatIfRepeatOverrides = {};
  renderWhatIfRepeatList();
  renderWhatIfTargetResult();
}

function renderWhatIfRepeatList() {
  const bannerEl = document.getElementById('whatIfRepeatBanner');
  const listEl = document.getElementById('whatIfRepeatList');
  if (!bannerEl || !listEl) return;

  const isEn = currentLang === 'en';
  const baseline = computeWhatIfBaseline();
  const sim = computeRepeatAdjustedBaseline(baseline);
  const diff = sim.simGpa - baseline.currentGpa;
  const diffStr = diff > 0.0001 ? `+${diff.toFixed(2)}` : diff.toFixed(2);

  bannerEl.innerHTML = `
    <div>
      <div style="font-size:0.75rem; color:var(--text-muted); font-weight:700;">${isEn ? 'Simulated GPA Change' : 'Simüle Edilen GNO Değişimi'}</div>
      <div style="font-size:1.1rem; font-weight:800; color:var(--text-primary);">
        ${baseline.currentGpa.toFixed(2)} → <span style="color:${diff > 0.001 ? '#10b981' : 'inherit'};">${sim.simGpa.toFixed(2)}</span>
        <span style="font-size:0.85rem; color:${diff > 0.001 ? '#10b981' : 'var(--text-muted)'};">(${diffStr})</span>
      </div>
    </div>
    <div style="font-size:0.75rem; color:var(--text-muted);">${isEn ? 'Isolated simulation — does not alter your plan' : 'İzole simülasyon — gerçek planını değiştirmez'}</div>
  `;

  if (baseline.repeatableCourses.length === 0) {
    listEl.innerHTML = `<div class="whatif-result-box">${isEn
      ? 'No courses with CC, DC, DD, or F grades found in your plan.'
      : 'Planında veya transkriptinde harf notu CC, DC, DD veya F olan ders bulunamadı.'}</div>`;
    return;
  }

  listEl.innerHTML = '';
  baseline.repeatableCourses.forEach(rc => {
    const selected = whatIfRepeatOverrides[rc.courseId] || '';
    const row = document.createElement('div');
    row.className = 'whatif-repeat-row';
    row.innerHTML = `
      <div class="whatif-repeat-info">
        <span class="whatif-repeat-code">${escapeHTML(rc.code)} (${rc.crd} Cr)</span>
        <span class="whatif-repeat-sub">${escapeHTML(rc.name)}</span>
      </div>
      <div class="whatif-repeat-controls">
        <span class="whatif-old-grade">${escapeHTML(rc.oldGrade)}</span>
        <span>→</span>
        <select class="whatif-repeat-select" aria-label="Hedef Not" onchange="handleWhatIfRepeatChange('${escapeHTML(rc.courseId)}', this.value)">
          <option value="" ${selected === '' ? 'selected' : ''}>${isEn ? 'No Repeat' : 'Tekrar Yok'}</option>
          <option value="AA" ${selected === 'AA' ? 'selected' : ''}>AA (4.0)</option>
          <option value="BA" ${selected === 'BA' ? 'selected' : ''}>BA (3.5)</option>
          <option value="BB" ${selected === 'BB' ? 'selected' : ''}>BB (3.0)</option>
        </select>
      </div>
    `;
    listEl.appendChild(row);
  });
}

// =========================================================
// ÇAP / Yandal "En Yakın Program" Keşif Motoru
// =========================================================
let discoveryFilter = 'all';

function computeClosestPrograms() {
  const state = getDeptState(currentDept);
  const userCodes = new Set();
  (state.instances || []).forEach(inst => {
    const c = getCourseForInstance(inst);
    if (c && c.code) {
      userCodes.add(c.code.replace(/\s+/g, '').toUpperCase());
    }
    const assigned = extractAssignedElectiveCode(inst.customText);
    if (assigned) userCodes.add(assigned);
  });

  const results = [];

  // 1. Yandal Programları (minorsData)
  if (minorsData && typeof minorsData === 'object') {
    Object.keys(minorsData).forEach(minorKey => {
      if (minorKey === currentDept || minorKey.startsWith(`${currentDept}_`)) return;
      const minorCourses = getMinorCourseList(minorKey);
      if (!minorCourses || minorCourses.length === 0) return;

      let matchedCount = 0;
      minorCourses.forEach(mc => {
        if (!mc.isElective && mc.code) {
          const norm = mc.code.replace(/\s+/g, '').toUpperCase();
          if (userCodes.has(norm)) matchedCount++;
        }
      });

      const totalCount = minorCourses.length;
      const remainingCount = Math.max(0, totalCount - matchedCount);
      const pct = totalCount > 0 ? Math.round((matchedCount / totalCount) * 100) : 0;

      results.push({
        type: 'minor',
        key: minorKey,
        name: getLocalizedMinorName(minorKey),
        matchedCount,
        remainingCount,
        totalCount,
        pct
      });
    });
  }

  // 2. ÇAP Programları (dmData)
  if (dmData && typeof dmData === 'object') {
    const dmKeys = Object.keys(dmData);
    const matchingMajorKeys = dmKeys.filter(k => dmData[k]?.majorKey === currentDept && dmData[k]?.doubleMajorKey !== currentDept);
    const keysToScan = matchingMajorKeys.length > 0
      ? matchingMajorKeys
      : dmKeys.filter(k => dmData[k]?.doubleMajorKey && dmData[k]?.doubleMajorKey !== currentDept);

    const seenTargets = new Set();
    keysToScan.forEach(dmKey => {
      const prog = dmData[dmKey];
      if (!prog || !Array.isArray(prog.courses) || prog.courses.length === 0) return;
      if (matchingMajorKeys.length === 0) {
        if (seenTargets.has(prog.doubleMajorKey)) return;
        seenTargets.add(prog.doubleMajorKey);
      }

      let matchedCount = 0;
      prog.courses.forEach(c => {
        if (c && c.code && !c.isElective) {
          const norm = c.code.replace(/\s+/g, '').toUpperCase();
          if (userCodes.has(norm)) matchedCount++;
        }
      });

      const totalCount = prog.courses.length;
      const remainingCount = Math.max(0, totalCount - matchedCount);
      const pct = totalCount > 0 ? Math.round((matchedCount / totalCount) * 100) : 0;

      results.push({
        type: 'dm',
        key: dmKey,
        name: getDmLocalizedName(prog),
        matchedCount,
        remainingCount,
        totalCount,
        pct
      });
    });
  }

  results.sort((a, b) => {
    if (b.pct !== a.pct) return b.pct - a.pct;
    if (a.remainingCount !== b.remainingCount) return a.remainingCount - b.remainingCount;
    return b.matchedCount - a.matchedCount;
  });

  return results;
}

function openDiscoveryModal() {
  const modal = document.getElementById('discoveryModal');
  if (!modal) return;
  const isEn = currentLang === 'en';
  const titleEl = document.getElementById('discoveryModalTitle');
  const introEl = document.getElementById('discoveryIntro');
  const closeBtn = document.getElementById('discoveryCloseBtn');
  if (titleEl) titleEl.textContent = isEn ? '🧭 Closest Double Major / Minor Programs' : '🧭 Bana En Yakın ÇAP / Yandal Programları';
  if (introEl) {
    introEl.textContent = isEn
      ? 'Programs are ranked by how many courses in your current plan already match their curriculum.'
      : 'Mevcut planındaki dersler tüm ÇAP ve Yandal müfredatlarıyla eşleştirilerek tamamlanma oranına göre sıralandı.';
  }
  if (closeBtn) closeBtn.textContent = isEn ? 'Close' : 'Kapat';

  setDiscoveryFilter(discoveryFilter || 'all');
  modal.classList.add('open');
}

function closeDiscoveryModal() {
  const modal = document.getElementById('discoveryModal');
  if (modal) modal.classList.remove('open');
}

function handleDiscoveryBackdropClick(event) {
  if (event.target && event.target.id === 'discoveryModal') {
    closeDiscoveryModal();
  }
}

function setDiscoveryFilter(filter) {
  discoveryFilter = filter || 'all';
  document.querySelectorAll('#discoveryFilterRow [data-disc-filter]').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.discFilter === discoveryFilter);
  });
  renderDiscoveryList();
}

function applyDiscoveredProgram(type, key) {
  if (type === 'minor') {
    applyMinor(key);
  } else if (type === 'dm') {
    applyDm(key);
  }
  closeDiscoveryModal();
}

function renderDiscoveryList() {
  const listEl = document.getElementById('discoveryList');
  if (!listEl) return;

  const isEn = currentLang === 'en';
  const all = computeClosestPrograms().filter(item => discoveryFilter === 'all' || item.type === discoveryFilter);

  if (all.length === 0) {
    listEl.innerHTML = `<div class="whatif-result-box">${isEn
      ? 'No matching Double Major or Minor programs found for this department.'
      : 'Bu bölüm için eşleşen ÇAP veya Yandal programı bulunamadı.'}</div>`;
    return;
  }

  listEl.innerHTML = '';
  all.forEach(item => {
    const card = document.createElement('div');
    card.className = 'discovery-card';
    const typeLabel = item.type === 'dm' ? (isEn ? 'Double Major' : 'ÇAP') : (isEn ? 'Minor' : 'Yandal');
    const summaryText = isEn
      ? `${item.matchedCount} of your courses count — ${item.remainingCount} extra courses left`
      : `Aldığın ${item.matchedCount} ders sayılıyor — ekstra ${item.remainingCount} ders kaldı`;
    const pctText = isEn ? `${item.pct}% Completed` : `%${item.pct} Tamamlandı`;
    const btnText = isEn ? 'Apply This Program' : 'Bu Programı Uygula';

    card.innerHTML = `
      <div class="discovery-card-top">
        <div class="discovery-card-title-wrap">
          <span class="discovery-type-badge ${item.type}">${escapeHTML(typeLabel)}</span>
          <span class="discovery-card-title">${escapeHTML(item.name)}</span>
        </div>
        <span class="discovery-pct-badge">${escapeHTML(pctText)}</span>
      </div>
      <div class="discovery-progress-track">
        <div class="discovery-progress-fill" style="width: ${item.pct}%;"></div>
      </div>
      <div class="discovery-card-bottom">
        <span class="discovery-card-summary">${escapeHTML(summaryText)}</span>
        <button type="button" class="discovery-apply-btn" onclick="applyDiscoveredProgram('${item.type}', '${escapeHTML(item.key)}')">${escapeHTML(btnText)}</button>
      </div>
    `;
    listEl.appendChild(card);
  });
}


// =========================================================
// Ekstra / Özel Ders Ekleme & Düzenleme Yardımcıları
// =========================================================
function addCustomCourse() {
  const state = getDeptState(currentDept);
  if (!Array.isArray(state.customCourses)) state.customCourses = [];
  const newCourse = {
    id: `custom-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    code: 'EKSTRA 101',
    name: currentLang === 'en' ? 'Custom Course' : 'Özel Ders',
    crd: 3,
    isCustom: true,
    isElective: false,
    wasAutoFilled: false
  };
  state.customCourses.unshift(newCourse);
  saveGlobalState();
  updateSidebarPool();

  const poolEl = document.getElementById('course-pool');
  if (poolEl) poolEl.scrollTop = 0;
}

function lookupCourseMetadataByCode(rawCode) {
  if (!rawCode || typeof rawCode !== 'string') return null;
  const spaced = rawCode.trim().toUpperCase().replace(/\s+/g, ' ');
  const compact = spaced.replace(/\s+/g, '');
  if (!compact || compact.length < 3) return null;

  let englishCandidate = null;
  let fallbackCandidate = null;

  // 1. Öncelik: İngilizce ders adlarını içeren ÇAP ve Yandal veri kaynakları
  if (dmData && typeof dmData === 'object') {
    for (const dmKey of Object.keys(dmData)) {
      const list = dmData[dmKey]?.courses || [];
      const found = list.find(c => c && c.code && c.code.replace(/\s+/g, '').toUpperCase() === compact);
      if (found) {
        englishCandidate = found;
        break;
      }
    }
  }

  if (!englishCandidate && minorsData && typeof minorsData === 'object') {
    for (const mKey of Object.keys(minorsData)) {
      const list = minorsData[mKey]?.compulsoryCourses || [];
      const found = list.find(c => c && c.code && c.code.replace(/\s+/g, '').toUpperCase() === compact);
      if (found) {
        englishCandidate = found;
        break;
      }
    }
  }

  // 2. Bölüm müfredatları (name_en / englishName / title varsa öncelikli, yoksa fallback)
  if (departmentsData && typeof departmentsData === 'object') {
    for (const dKey of Object.keys(departmentsData)) {
      const list = departmentsData[dKey]?.courses || [];
      const found = list.find(c => c && c.code && c.code.replace(/\s+/g, '').toUpperCase() === compact);
      if (found) {
        fallbackCandidate = found;
        break;
      }
    }
  }

  const matchedCourse = englishCandidate || fallbackCandidate;
  const resolvedName = (englishCandidate && (englishCandidate.name_en || englishCandidate.englishName || englishCandidate.title || englishCandidate.name))
    || (fallbackCandidate && (fallbackCandidate.name_en || fallbackCandidate.englishName || fallbackCandidate.title || fallbackCandidate.name))
    || null;

  const resolvedCrdSource = englishCandidate || fallbackCandidate;
  const resolvedCrd = (resolvedCrdSource && resolvedCrdSource.crd !== undefined && resolvedCrdSource.crd !== null && !isNaN(Number(resolvedCrdSource.crd)))
    ? Number(resolvedCrdSource.crd)
    : null;

  const mapPrereq = getPrereqFromMaps(spaced);
  const prereqStr = (fallbackCandidate && fallbackCandidate.prereq)
    || (englishCandidate && englishCandidate.prereq)
    || mapPrereq
    || '';

  if (!matchedCourse && !prereqStr) return null;

  return {
    code: (matchedCourse && matchedCourse.code) ? matchedCourse.code : spaced,
    name: resolvedName,
    crd: resolvedCrd,
    prereq: prereqStr
  };
}

function updateCustomCourseField(courseId, field, value) {
  const state = getDeptState(currentDept);
  const poolCourse = (state.customCourses || []).find(c => c.id === courseId);
  const placedInst = !poolCourse
    ? (state.instances || []).find(inst => inst.courseId === courseId && inst.customCourse)
    : null;
  const course = poolCourse || (placedInst ? placedInst.customCourse : null);
  if (!course) return;

  let codeChanged = false;
  let autoMeta = null;

  if (field === 'code') {
    codeChanged = true;
    course.code = String(value || '').slice(0, 28) || 'EKSTRA 101';
    autoMeta = lookupCourseMetadataByCode(value);

    if (autoMeta) {
      course.name = autoMeta.name || (currentLang === 'en' ? 'Custom Course' : 'Özel Ders');
      course.crd = autoMeta.crd !== null ? autoMeta.crd : 3;
      course.prereq = autoMeta.prereq || '';
      course.wasAutoFilled = true;
    } else if (course.wasAutoFilled) {
      course.name = currentLang === 'en' ? 'Custom Course' : 'Özel Ders';
      course.crd = 3;
      course.prereq = '';
      course.wasAutoFilled = false;
    } else {
      course.prereq = '';
    }
  } else if (field === 'name') {
    course.name = String(value || '').slice(0, 80) || (currentLang === 'en' ? 'Custom Course' : 'Özel Ders');
    course.wasAutoFilled = false;
  } else if (field === 'crd') {
    const parsed = parseFloat(String(value).replace(',', '.'));
    course.crd = (!isNaN(parsed) && parsed >= 0) ? Math.round(parsed * 10) / 10 : 0;
    course.wasAutoFilled = false;
  }

  // Havuzdaki kartın alanlarını (odak kaybetmeden) senkronize et
  const poolCardEl = document.querySelector(`[data-custom-pool-id="${courseId}"]`);
  if (poolCardEl) {
    const codeInput = poolCardEl.querySelector('.code-input');
    if (codeInput && document.activeElement !== codeInput) codeInput.value = course.code;
    const nameInput = poolCardEl.querySelector('.name-input');
    if (nameInput && document.activeElement !== nameInput) nameInput.value = course.name;
    const crdInput = poolCardEl.querySelector('.custom-course-crd-input');
    if (crdInput && document.activeElement !== crdInput) crdInput.value = course.crd;
    if (codeChanged) {
      const prereqEl = poolCardEl.querySelector('.course-prereq');
      if (prereqEl) {
        const translated = course.prereq ? translatePrereq(course.prereq) : '';
        prereqEl.textContent = translated;
        prereqEl.style.display = translated ? '' : 'none';
      }
    }
  }

  // Dönemlere yerleştirilmiş örneklerin DOM ve önkoşul durumunu güncelle
  (state.instances || []).forEach(inst => {
    if (inst.courseId === courseId) {
      inst.isCustom = true;
      inst.customCourse = { ...course };
      const cardEl = document.getElementById(`inst-${inst.instanceId}`);
      if (cardEl) {
        const titleEl = cardEl.querySelector('.course-title');
        if (titleEl && codeChanged) titleEl.textContent = course.code;
        const crdEl = cardEl.querySelector('.course-credits');
        if (crdEl) crdEl.textContent = `${course.crd} Cr`;
        if (codeChanged) {
          const nameInput = cardEl.querySelector('.name-input');
          if (nameInput) nameInput.value = course.name;
          const crdInput = cardEl.querySelector('.custom-course-crd-input');
          if (crdInput) crdInput.value = course.crd;

          let prereqEl = cardEl.querySelector('.course-prereq');
          const translated = course.prereq ? translatePrereq(course.prereq) : '';
          if (translated) {
            if (!prereqEl) {
              prereqEl = document.createElement('div');
              prereqEl.className = 'course-prereq';
              const controlsEl = cardEl.querySelector('.course-controls');
              if (controlsEl) cardEl.insertBefore(prereqEl, controlsEl);
            }
            prereqEl.textContent = translated;
            prereqEl.style.display = '';
          } else if (prereqEl) {
            prereqEl.textContent = '';
            prereqEl.style.display = 'none';
          }
        }
      }
    }
  });

  saveGlobalState();
  refreshAllPrereqWarnings();
  updateDashboard();
}

function deleteCustomCourse(courseId, event) {
  if (event) {
    event.stopPropagation();
    event.preventDefault();
  }
  const state = getDeptState(currentDept);
  state.customCourses = (state.customCourses || []).filter(c => c.id !== courseId);
  state.instances = (state.instances || []).filter(inst => inst.courseId !== courseId && inst.templateId !== courseId);
  saveGlobalState();
  initUI();
}


// =========================================================
// Masaüstü Merkezi Araçlar & İşlemler Kataloğu Modalı
// =========================================================
function openDesktopToolsModal() {
  const modal = document.getElementById('desktopToolsModal');
  if (!modal) return;
  modal.classList.add('open');
}

function closeDesktopToolsModal() {
  const modal = document.getElementById('desktopToolsModal');
  if (modal) modal.classList.remove('open');
}

function handleDesktopToolsBackdropClick(event) {
  if (event.target && event.target.id === 'desktopToolsModal') {
    closeDesktopToolsModal();
  }
}

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    closeDesktopToolsModal();
  }
});


// =========================================================
// Boğaziçi Seçmeli Ders Kataloğu & PA/PE Eşdeğerlik Sistemi
// =========================================================
let electivesCatalogData = [];
const ELECTIVE_CATALOG_BY_CODE = {};
let ecModalState = {
  instanceId: null,
  slotCourseId: null,
  allowedCategories: ['HSS', 'MLE', 'PA', 'PE'],
  activeCategory: 'ALL',
  pendingFirstPick: null,
  persistedFirstInstId: null
};

function initElectivesCatalog(list) {
  electivesCatalogData = Array.isArray(list) ? list : [];
  Object.keys(ELECTIVE_CATALOG_BY_CODE).forEach(k => delete ELECTIVE_CATALOG_BY_CODE[k]);
  electivesCatalogData.forEach(item => {
    if (!item || !item.code) return;
    const norm = String(item.code).trim().toUpperCase().replace(/\s+/g, '');
    ELECTIVE_CATALOG_BY_CODE[norm] = item;
  });
}

function getElectiveCatalogCategories(course) {
  if (!course || !course.isElective) return null;
  const txt = `${course.code || ''} ${course.name || ''}`.toLowerCase();

  if (/unrestr|serbest\s*seçmeli|free\s*elective/i.test(txt)) {
    return ['HSS', 'MLE', 'PA', 'PE'];
  }

  if (/\bhss\b|\bmle\b|humanities\s+and\s+social/i.test(txt)) {
    return ['HSS', 'MLE'];
  }

  return null;
}

function countTwoCreditPaCourses(state) {
  let count = 0;
  (state.instances || []).forEach(inst => {
    if (inst.catalogCourse && inst.catalogCourse.category === 'PA' && Number(inst.catalogCourse.crd) === 2) {
      count++;
      return;
    }
    const assignedCode = extractAssignedElectiveCode(inst.customText);
    if (assignedCode && ELECTIVE_CATALOG_BY_CODE[assignedCode]) {
      const catItem = ELECTIVE_CATALOG_BY_CODE[assignedCode];
      if (catItem.category === 'PA' && Number(catItem.credits) === 2) {
        count++;
      }
    }
  });
  return count;
}

function formatCatalogItemPrereq(item) {
  if (!item) return '';
  if (item.prerequisites && String(item.prerequisites).trim().toLowerCase() !== 'none') {
    return formatRawPreqJsonEntry(item.code, [item.prerequisites]);
  }
  return getPrereqFromMaps(item.code) || '';
}

function getLocalizedCatalogDescription(item) {
  if (!item || !item.description) return '';
  if (currentLang === 'en') return item.description;
  const catTr = {
    HSS: 'İnsan ve Toplum Bilimleri',
    MLE: 'Modern Diller',
    PA: 'Güzel Sanatlar / Uygulamalı Sanat',
    PE: 'Beden Eğitimi'
  }[item.category] || item.category;
  return `[${catTr} • ${item.credits} Kr / ${item.ects || item.credits} AKTS] ${item.description}`;
}

function getSlotSelectedInstances(state, slotCourseId, fallbackInstId) {
  const splitMatches = (state.instances || []).filter(i => i.splitSlotCourseId === slotCourseId && i.catalogCourse);
  if (splitMatches.length > 0) return splitMatches;
  const single = (state.instances || []).find(i => i.instanceId === fallbackInstId);
  if (single && (single.catalogCourse || (single.customText && single.customText.trim()))) {
    return [single];
  }
  return [];
}

function handleSplitHalfInput(instanceId, val) {
  const state = getDeptState(currentDept);
  const inst = (state.instances || []).find(i => i.instanceId === instanceId);
  if (!inst) return;
  const trimmed = String(val || '').trim();
  inst.customText = val;
  if (inst.catalogCourse) {
    inst.catalogCourse.code = trimmed;
  }
  saveGlobalState();
  const semCard = document.getElementById(`inst-${instanceId}`);
  if (semCard) {
    const inp = semCard.querySelector('.custom-input');
    if (inp && document.activeElement !== inp) inp.value = val;
    const titleEl = semCard.querySelector('.course-title');
    if (titleEl) {
      const fallbackCourse = findCourseById(inst.splitSlotCourseId || inst.courseId);
      titleEl.textContent = trimmed || (fallbackCourse ? fallbackCourse.code : '');
    }
  }
  updateDashboard();
}

function handleEmptySplitSecondInput(slotCourseId, val) {
  const trimmed = String(val || '').trim();
  if (!trimmed) return;
  const state = getDeptState(currentDept);
  const first = (state.instances || []).find(i => i.splitSlotCourseId === slotCourseId && i.catalogCourse);
  if (!first) return;
  const norm = trimmed.toUpperCase().replace(/\s+/g, '');
  const catItem = ELECTIVE_CATALOG_BY_CODE[norm];
  const isPF = isPassFailCourse({ customText: trimmed, catalogCourse: catItem }, null);
  const splitGroupId = first.splitGroupId || `split_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
  first.splitGroupId = splitGroupId;
  first.splitIndex = 1;
  const inst2 = {
    instanceId: `inst_split2_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
    courseId: `${slotCourseId}_split2_${Date.now()}`,
    semId: first.semId,
    passed: false,
    grade: isPF ? 'P' : 'AA',
    customText: catItem ? catItem.code : trimmed,
    splitGroupId,
    splitSlotCourseId: slotCourseId,
    splitIndex: 2,
    catalogCourse: {
      code: catItem ? catItem.code : trimmed,
      name: catItem ? catItem.name : trimmed,
      crd: catItem ? (Number(catItem.credits) || 0) : (Number(first.catalogCourse.crd) || 1),
      ects: catItem ? (Number(catItem.ects) || 0) : 0,
      category: catItem ? catItem.category : (first.catalogCourse.category || 'PA'),
      prereq: catItem ? formatCatalogItemPrereq(catItem) : ''
    }
  };
  const idx = state.instances.findIndex(i => i.instanceId === first.instanceId);
  if (idx > -1) state.instances.splice(idx + 1, 0, inst2);
  else state.instances.push(inst2);
  saveGlobalState();
  initUI();
}

function openElectiveCatalogModal(instanceId) {
  const modal = document.getElementById('electiveCatalogModal');
  if (!modal) return;
  const state = getDeptState(currentDept);
  const inst = (state.instances || []).find(i => i.instanceId === instanceId);
  if (!inst) return;

  const slotCourseId = inst.splitSlotCourseId || inst.courseId;
  const baseCourse = findCourseById(slotCourseId) || getCourseForInstance(inst);
  const allowed = getElectiveCatalogCategories(baseCourse);
  if (!allowed || allowed.length === 0) return;

  const currentSelections = getSlotSelectedInstances(state, slotCourseId, instanceId);
  let pendingFirst = null;
  let persistedFirstId = null;

  // Eğer split slotta yalnızca 1 ders kalmışsa otomatik olarak 2. dersi tamamlama moduna gir
  if (currentSelections.length === 1 && currentSelections[0].splitSlotCourseId) {
    const rem = currentSelections[0];
    pendingFirst = {
      code: rem.catalogCourse.code,
      name: rem.catalogCourse.name,
      credits: Number(rem.catalogCourse.crd) || 0,
      ects: Number(rem.catalogCourse.ects) || 0,
      category: rem.catalogCourse.category,
      prerequisites: rem.catalogCourse.prereq || ''
    };
    persistedFirstId = rem.instanceId;
  }

  ecModalState = {
    instanceId,
    slotCourseId,
    allowedCategories: allowed,
    activeCategory: 'ALL',
    pendingFirstPick: pendingFirst,
    persistedFirstInstId: persistedFirstId
  };

  const isEn = currentLang === 'en';
  const titleEl = document.getElementById('ecModalTitle');
  const searchEl = document.getElementById('ecSearchInput');
  const closeBtn = document.getElementById('ecCloseBtn');
  if (titleEl) titleEl.textContent = isEn ? '📚 Elective Course Catalog' : '📚 Seçmeli Ders Kataloğu';
  if (searchEl) {
    searchEl.value = '';
    searchEl.placeholder = isEn ? 'Search by code, name, or description...' : 'Ders kodu, adı veya açıklama ara...';
  }
  if (closeBtn) closeBtn.textContent = isEn ? 'Close' : 'Kapat';

  hideEcWarning();
  renderEcSelectedBox();
  updateEcProgressBanner();
  renderElectiveCatalogTabs();
  renderElectiveCatalogList();
  modal.classList.add('open');
}

function closeElectiveCatalogModal() {
  const modal = document.getElementById('electiveCatalogModal');
  if (modal) modal.classList.remove('open');
  ecModalState.pendingFirstPick = null;
  ecModalState.persistedFirstInstId = null;
}

function handleElectiveCatalogBackdropClick(event) {
  if (event.target && event.target.id === 'electiveCatalogModal') {
    closeElectiveCatalogModal();
  }
}

function showEcWarning(msg) {
  const el = document.getElementById('ecWarningBanner');
  if (!el) return;
  el.textContent = msg;
  el.classList.remove('is-hidden');
}

function hideEcWarning() {
  const el = document.getElementById('ecWarningBanner');
  if (el) el.classList.add('is-hidden');
}

function cancelPendingSplitPick() {
  if (ecModalState.persistedFirstInstId) {
    removeSelectedElectiveFromSlot(ecModalState.persistedFirstInstId);
    return;
  }
  ecModalState.pendingFirstPick = null;
  hideEcWarning();
  updateEcProgressBanner();
  renderElectiveCatalogList();
}

function renderEcSelectedBox() {
  const box = document.getElementById('ecSelectedBox');
  if (!box) return;
  const state = getDeptState(currentDept);
  const selected = getSlotSelectedInstances(state, ecModalState.slotCourseId, ecModalState.instanceId);

  if (selected.length === 0) {
    box.classList.add('is-hidden');
    box.innerHTML = '';
    return;
  }

  const isEn = currentLang === 'en';
  const titleText = isEn ? 'Selected Courses for This Slot:' : 'Mevcut Seçimleriniz:';
  const chipsHtml = selected.map(sel => {
    const codeStr = sel.catalogCourse ? sel.catalogCourse.code : (sel.customText || '');
    const crdStr = sel.catalogCourse ? ` (${sel.catalogCourse.crd} ${isEn ? 'Cr' : 'Kr'})` : '';
    return `
      <span class="ec-selected-chip">
        <span>${escapeHTML(codeStr)}${escapeHTML(crdStr)}</span>
        <button type="button"
                class="ec-selected-remove"
                onclick="removeSelectedElectiveFromSlot('${escapeHTML(sel.instanceId)}')"
                title="${isEn ? 'Remove' : 'Kaldır'}">✕</button>
      </span>
    `;
  }).join('');

  box.innerHTML = `
    <div class="ec-selected-title">${escapeHTML(titleText)}</div>
    <div class="ec-selected-chips">${chipsHtml}</div>
  `;
  box.classList.remove('is-hidden');
}

function removeSelectedElectiveFromSlot(targetInstanceId) {
  const state = getDeptState(currentDept);
  const targetIdx = (state.instances || []).findIndex(i => i.instanceId === targetInstanceId);
  if (targetIdx === -1) return;

  const targetInst = state.instances[targetIdx];
  const slotCourseId = ecModalState.slotCourseId;

  if (targetInst.splitSlotCourseId) {
    const siblings = state.instances.filter(i => i.splitSlotCourseId === slotCourseId && i.instanceId !== targetInstanceId);
    if (siblings.length > 0) {
      // 2. ders kaldı: boş yer için slotu 1 ders eksik durumuna getir
      state.instances.splice(targetIdx, 1);
      const rem = siblings[0];
      rem.courseId = slotCourseId;
      rem.splitIndex = 1;
      ecModalState.instanceId = rem.instanceId;
      ecModalState.persistedFirstInstId = rem.instanceId;
      ecModalState.pendingFirstPick = rem.catalogCourse ? {
        code: rem.catalogCourse.code,
        name: rem.catalogCourse.name,
        credits: Number(rem.catalogCourse.crd) || 0,
        ects: Number(rem.catalogCourse.ects) || 0,
        category: rem.catalogCourse.category,
        prerequisites: rem.catalogCourse.prereq || ''
      } : null;
    } else {
      // Son ders de silindi: boş slot instance'ını koru
      targetInst.courseId = slotCourseId;
      targetInst.customText = '';
      targetInst.passed = false;
      delete targetInst.catalogCourse;
      delete targetInst.splitGroupId;
      delete targetInst.splitSlotCourseId;
      delete targetInst.splitIndex;
      ecModalState.instanceId = targetInst.instanceId;
      ecModalState.persistedFirstInstId = null;
      ecModalState.pendingFirstPick = null;
    }
  } else {
    targetInst.customText = '';
    delete targetInst.catalogCourse;
    ecModalState.persistedFirstInstId = null;
    ecModalState.pendingFirstPick = null;
  }

  saveGlobalState();
  initUI();
  hideEcWarning();
  renderEcSelectedBox();
  updateEcProgressBanner();
  renderElectiveCatalogList();
}

function updateEcProgressBanner() {
  const banner = document.getElementById('ecProgressBanner');
  if (!banner) return;
  const pick = ecModalState.pendingFirstPick;
  if (!pick) {
    banner.classList.add('is-hidden');
    banner.innerHTML = '';
    return;
  }

  const isEn = currentLang === 'en';
  const msg = ecModalState.persistedFirstInstId
    ? (isEn
      ? `1 course missing — select 1 more 2-credit PA (or PE) course to pair with <strong>${escapeHTML(pick.code)} (${pick.credits} Cr)</strong>.`
      : `1 ders eksik — <strong>${escapeHTML(pick.code)} (${pick.credits} Kr)</strong> ile eşleştirmek için 1 adet daha 2 kredili PA (veya PE) dersi seçin.`)
    : (isEn
      ? `1st course selected: <strong>${escapeHTML(pick.code)} (${pick.credits} Cr)</strong>. Select 1 more 2-credit PA (or PE) course to complete this slot.`
      : `1. ders seçildi: <strong>${escapeHTML(pick.code)} (${pick.credits} Kr)</strong>. Bu slotu tamamlamak için 1 adet daha 2 kredili PA (veya PE) dersi seçin.`);

  banner.innerHTML = `
    <span>${msg}</span>
    <button type="button" class="whatif-preset-btn" onclick="cancelPendingSplitPick()">${isEn ? 'Cancel' : 'İptal'}</button>
  `;
  banner.classList.remove('is-hidden');
}

function renderElectiveCatalogTabs() {
  const tabsEl = document.getElementById('ecCategoryTabs');
  if (!tabsEl) return;
  const isEn = currentLang === 'en';
  const cats = ['ALL', ...ecModalState.allowedCategories];
  tabsEl.innerHTML = cats.map(c => {
    const label = c === 'ALL' ? (isEn ? 'All' : 'Tümü') : c;
    const activeCls = ecModalState.activeCategory === c ? 'active' : '';
    return `<button type="button" class="ec-cat-tab ${activeCls}" onclick="setElectiveCatalogCategory('${c}')">${escapeHTML(label)}</button>`;
  }).join('');
}

function setElectiveCatalogCategory(cat) {
  ecModalState.activeCategory = cat || 'ALL';
  renderElectiveCatalogTabs();
  renderElectiveCatalogList();
}

function renderElectiveCatalogList() {
  const listEl = document.getElementById('ecCourseList');
  if (!listEl) return;

  const isEn = currentLang === 'en';
  const searchEl = document.getElementById('ecSearchInput');
  const q = searchEl ? searchEl.value.trim().toLowerCase() : '';
  const allowedSet = new Set(ecModalState.allowedCategories);

  const state = getDeptState(currentDept);
  const currentSelected = getSlotSelectedInstances(state, ecModalState.slotCourseId, ecModalState.instanceId);
  const selectedCodesSet = new Set(
    currentSelected.map(s => String(s.catalogCourse ? s.catalogCourse.code : s.customText).trim().toUpperCase().replace(/\s+/g, ''))
  );
  if (ecModalState.pendingFirstPick && ecModalState.pendingFirstPick.code) {
    selectedCodesSet.add(String(ecModalState.pendingFirstPick.code).trim().toUpperCase().replace(/\s+/g, ''));
  }

  const filtered = electivesCatalogData.filter(item => {
    if (!item || !allowedSet.has(item.category)) return false;
    if (ecModalState.activeCategory !== 'ALL' && item.category !== ecModalState.activeCategory) return false;
    if (ecModalState.pendingFirstPick) {
      const isPairable = (item.category === 'PA' && Number(item.credits) === 2) || item.category === 'PE';
      if (!isPairable) return false;
    }
    if (q) {
      const hay = `${item.code || ''} ${item.name || ''} ${item.description || ''}`.toLowerCase();
      if (!hay.includes(q)) return false;
    }
    return true;
  });

  if (filtered.length === 0) {
    listEl.innerHTML = `<div class="whatif-result-box">${isEn ? 'No matching elective courses found.' : 'Eşleşen seçmeli ders bulunamadı.'}</div>`;
    return;
  }

  const groups = {};
  ecModalState.allowedCategories.forEach(c => { groups[c] = []; });
  filtered.forEach(item => {
    if (!groups[item.category]) groups[item.category] = [];
    groups[item.category].push(item);
  });

  const catTitles = {
    HSS: isEn ? 'HSS — Humanities & Social Sciences' : 'HSS — İnsan ve Toplum Bilimleri',
    MLE: isEn ? 'MLE — Modern Languages' : 'MLE — Modern Diller',
    PA: isEn ? 'PA — Performing & Fine Arts (2 Cr = 1/2 Slot)' : 'PA — Güzel Sanatlar (2 Kr = 1/2 Slot)',
    PE: isEn ? 'PE — Physical Education (2 PE = 1 Slot)' : 'PE — Beden Eğitimi (2 PE = 1 Slot)'
  };

  let html = '';
  Object.keys(groups).forEach(cat => {
    const items = groups[cat];
    if (!items || items.length === 0) return;

    html += `<div class="ec-group-header"><span>${escapeHTML(catTitles[cat] || cat)}</span><span>${items.length}</span></div>`;
    items.forEach(item => {
      const normItemCode = String(item.code || '').trim().toUpperCase().replace(/\s+/g, '');
      const isAlreadySelected = selectedCodesSet.has(normItemCode);
      const prereqRaw = formatCatalogItemPrereq(item);
      const prereqText = prereqRaw ? translatePrereq(prereqRaw) : '';
      const descText = getLocalizedCatalogDescription(item);
      const crdLabel = `${item.credits} ${isEn ? 'Cr' : 'Kr'} / ${item.ects || item.credits} ${isEn ? 'ECTS' : 'AKTS'}`;
      html += `
        <div class="ec-course-row">
          <div class="ec-course-main">
            <div class="ec-course-head">
              <span class="ec-course-title">${escapeHTML(item.code)} — ${escapeHTML(item.name)}</span>
              <span class="ec-crd-pill">${escapeHTML(crdLabel)}</span>
              ${prereqText ? `<span class="ec-prereq-pill">${escapeHTML(prereqText)}</span>` : ''}
            </div>
            ${descText ? `<div class="ec-course-desc">${escapeHTML(descText)}</div>` : ''}
          </div>
          ${isAlreadySelected
            ? `<button type="button" class="ec-add-btn selected" disabled>${isEn ? 'Selected ✓' : 'Seçili ✓'}</button>`
            : `<button type="button" class="ec-add-btn" onclick="selectElectiveFromCatalog('${escapeHTML(item.code)}')">${isEn ? 'Add (+)' : 'Ekle (+)'}</button>`}
        </div>
      `;
    });
  });

  listEl.innerHTML = html;
}

function selectElectiveFromCatalog(courseCode) {
  const norm = String(courseCode || '').trim().toUpperCase().replace(/\s+/g, '');
  const item = ELECTIVE_CATALOG_BY_CODE[norm];
  if (!item) return;

  const state = getDeptState(currentDept);
  let inst = (state.instances || []).find(i => i.instanceId === ecModalState.instanceId);
  if (!inst) return;

  const isEn = currentLang === 'en';
  const slotCourseId = ecModalState.slotCourseId;
  const isTwoCreditPa = item.category === 'PA' && Number(item.credits) === 2;
  const isPairable = isTwoCreditPa || item.category === 'PE';
  const formattedPrereq = formatCatalogItemPrereq(item);

  // Kural 3A: Tek başına 3+ kredili ders (HSS, MLE veya 3 kredili PA) seçildiğinde
  // eski split seçimleri (2'li PA/PE) hem sol slottan hem sağ dönemden tamamen silinir.
  if (!isPairable) {
    hideEcWarning();
    state.instances = state.instances.filter(i => !(i.splitSlotCourseId === slotCourseId && i.instanceId !== inst.instanceId));
    inst.courseId = slotCourseId;
    inst.customText = item.code;
    inst.passed = false;
    inst.grade = 'AA';
    inst.catalogCourse = {
      code: item.code,
      name: item.name,
      crd: Number(item.credits) || 0,
      ects: Number(item.ects) || 0,
      category: item.category,
      prereq: formattedPrereq
    };
    delete inst.splitGroupId;
    delete inst.splitSlotCourseId;
    delete inst.splitIndex;

    saveGlobalState();
    closeElectiveCatalogModal();
    initUI();
    showToast(`${item.code} — ${item.name}`);
    return;
  }

  // Kural 3B: Slot zaten 2 split dersle doluysa ve kullanıcı yeni bir 2-kr PA / PE seçerse
  // önceki 2 dersi temizle, yeni 1. ders olarak başlat ve 2. dersi seçmesini iste.
  if (!ecModalState.persistedFirstInstId && !ecModalState.pendingFirstPick) {
    const existingSplit = (state.instances || []).filter(i => i.splitSlotCourseId === slotCourseId && i.catalogCourse);
    if (existingSplit.length >= 2) {
      const baseInst = existingSplit.find(i => i.instanceId === inst.instanceId) || existingSplit[0];
      state.instances = state.instances.filter(i => !(i.splitSlotCourseId === slotCourseId && i.instanceId !== baseInst.instanceId));
      baseInst.courseId = slotCourseId;
      baseInst.customText = '';
      baseInst.passed = false;
      baseInst.grade = 'AA';
      delete baseInst.catalogCourse;
      delete baseInst.splitGroupId;
      delete baseInst.splitSlotCourseId;
      delete baseInst.splitIndex;
      inst = baseInst;
      ecModalState.instanceId = baseInst.instanceId;
      saveGlobalState();
      initUI();
    }
  }

  if (isTwoCreditPa) {
    const existingCount = countTwoCreditPaCourses(state);
    const pendingUnsavedPa = (!ecModalState.persistedFirstInstId && ecModalState.pendingFirstPick && ecModalState.pendingFirstPick.category === 'PA' && Number(ecModalState.pendingFirstPick.credits) === 2) ? 1 : 0;
    if (existingCount + pendingUnsavedPa >= 3) {
      const warnMsg = isEn
        ? 'At most 3 two-credit PA courses can count as electives.'
        : 'En fazla 3 adet 2 kredili PA dersi seçmeli olarak sayılabilir.';
      showEcWarning(warnMsg);
      showToast(warnMsg);
      return;
    }
  }

  hideEcWarning();

  // 2 kredili PA veya PE eşleştirme (1. seçim -> modal açık kalır)
  if (!ecModalState.pendingFirstPick) {
    ecModalState.pendingFirstPick = item;
    renderEcSelectedBox();
    updateEcProgressBanner();
    renderElectiveCatalogList();
    return;
  }

  // 2. seçim tamamlandı -> Sağdaki döneme 2 ayrı kart, soldaki slota Split Card!
  const item1 = ecModalState.pendingFirstPick;
  const item2 = item;
  const splitGroupId = inst.splitGroupId || `split_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
  const preserveFirstPassed = !!ecModalState.persistedFirstInstId;

  inst.courseId = slotCourseId;
  inst.customText = item1.code;
  if (!preserveFirstPassed) {
    inst.passed = false;
    inst.grade = 'AA';
  }
  inst.splitGroupId = splitGroupId;
  inst.splitSlotCourseId = slotCourseId;
  inst.splitIndex = 1;
  inst.catalogCourse = {
    code: item1.code,
    name: item1.name,
    crd: Number(item1.credits) || 0,
    ects: Number(item1.ects) || 0,
    category: item1.category,
    prereq: formatCatalogItemPrereq(item1)
  };

  const inst2 = {
    instanceId: `inst_split2_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
    courseId: `${slotCourseId}_split2_${Date.now()}`,
    semId: inst.semId,
    passed: false,
    grade: 'AA',
    customText: item2.code,
    splitGroupId,
    splitSlotCourseId: slotCourseId,
    splitIndex: 2,
    catalogCourse: {
      code: item2.code,
      name: item2.name,
      crd: Number(item2.credits) || 0,
      ects: Number(item2.ects) || 0,
      category: item2.category,
      prereq: formattedPrereq
    }
  };

  const idx = state.instances.findIndex(i => i.instanceId === inst.instanceId);
  if (idx > -1) {
    state.instances.splice(idx + 1, 0, inst2);
  } else {
    state.instances.push(inst2);
  }

  saveGlobalState();
  closeElectiveCatalogModal();
  initUI();
  showToast(`${item1.code} + ${item2.code}`);
}
