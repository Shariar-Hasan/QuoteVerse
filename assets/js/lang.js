 // Initialize i18next
const langUrl = '/assets/lang';  // Adjust path to your language files

i18next
  .use(i18nextHttpBackend)
  .use(i18nextBrowserLanguageDetector)
  .init({
    lng: 'en',
    fallbackLng: 'en',
    debug: true,
    detection: {
        // Disable detection options
        order: [],
        caches: [] // Do not cache language preferences
    },
    backend: {
      loadPath: `${langUrl}/{{lng}}.json`,  // Path to your JSON language files
    }
  }, function (err, t) {
    if (err) return console.error(err);

    // Optional: initialize jQuery i18next for translation with data-i18n attributes
    jqueryI18next.init(i18next, $, {
      useOptionsAttr: true  // Use 'data-i18n' attributes for translation
    });

    // Apply the translation to the entire body (if using jQuery)
    $('body').localize();
  });



// Language switcher
document.getElementById('languageSwitcher').addEventListener('change', function () {
    const selectedLanguage = $(this).val();
    console.log("lang",selectedLanguage);
    i18next.changeLanguage(selectedLanguage,function(err,t){
        if (err) return console.error(err);
        $('body').localize();
    });
});
