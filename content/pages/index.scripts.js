try{

document.addEventListener("DOMContentLoaded", function () {
    fetch("/api/cart-mini.php")
        .then(res => res.json())
        .then(cart => {
            const badge = document.querySelector(".sunucumweb2023-cart-badge");
            const price = document.querySelector(".sunucumweb2023-cart-price");

            if (!badge || !price) return;

            badge.textContent = cart.count;

            if (cart.count > 0) {
                price.textContent = cart.total;
            } else {
                price.textContent = "Sepet boş";
            }
        });
});

}catch(e){console.warn('[index]',e)}
try{
(function(){function c(){var b=a.contentDocument||(a.contentWindow&&a.contentWindow.document);if(b){var d=b.createElement('script');d.innerHTML="window.__CF$cv$params={r:'a2b970032a86f4c8',t:'MTc4NjgwOTg5Mg=='};var a=document.createElement('script');a.src='cdn-cgi/challenge-platform/scripts/jsd/main.js';document.getElementsByTagName('head')[0].appendChild(a);";b.getElementsByTagName('head')[0].appendChild(d)}}if(document.body){var a=document.createElement('iframe');a.height=1;a.width=1;a.style.position='absolute';a.style.top=0;a.style.left=0;a.style.border='none';a.style.visibility='hidden';document.body.appendChild(a);if('loading'!==document.readyState)c();else if(window.addEventListener)document.addEventListener('DOMContentLoaded',c);else{var e=document.onreadystatechange||function(){};document.onreadystatechange=function(b){e(b);'loading'!==document.readyState&&(document.onreadystatechange=e,c())}}}})();
}catch(e){console.warn('[index]',e)}
try{

    /**
 * sunucumweb.com 2023 Header JavaScript
 * Bu dosya, sunucumweb.com 2023 header bileşeninin JavaScript fonksiyonlarını içerir.
 * Tamamen izole edilmiş ve benzersiz isimlerle oluşturulmuştur.
 */

// Tamamen izole edilmiş bir IIFE (Immediately Invoked Function Expression) içinde çalışır
;(() => {
  // Benzersiz bir namespace oluşturarak çakışmaları önleyelim
  window.sunucumweb2023HeaderModule = {}

  // Özel değişkenler - tamamen izole
  var _sunucumweb2023_initialized = false
  var _sunucumweb2023_mobileMenuBtn = null
  var _sunucumweb2023_mobileMenu = null
  var _sunucumweb2023_mobileMenuLinks = []
  var _sunucumweb2023_blurOverlay = null
  var _sunucumweb2023_topbar = null
  var _sunucumweb2023_header = null
  var _sunucumweb2023_headerContainer = null
  var _sunucumweb2023_lastScrollTop = 0

  // Mobil menü işlemleri
  function _sunucumweb2023_toggleMobileMenu(event) {
    event.preventDefault() // Tarayıcı varsayılan davranışını engelle
    console.log("sunucumweb2023HeaderModule: Mobil menü butonuna tıklandı")

    if (_sunucumweb2023_mobileMenu) {
      _sunucumweb2023_mobileMenu.style.display = _sunucumweb2023_mobileMenu.style.display === "block" ? "none" : "block"
    }
  }

  // Mobil alt menü işlemleri
  function _sunucumweb2023_handleMobileSubmenu(event) {
    event.preventDefault() // Tarayıcı varsayılan davranışını engelle

    var megaMenuId = this.getAttribute("data-mega")
    console.log("sunucumweb2023HeaderModule: Tıklanan menü link data-mega:", megaMenuId)

    var megaMenu = document.getElementById(megaMenuId)

    if (megaMenu) {
      console.log("sunucumweb2023HeaderModule: Mega menü bulundu:", megaMenuId)

      // Tüm diğer açık menüleri kapat
      var allMobileMenus = document.querySelectorAll(".sunucumweb2023-mobile-menu .sunucumweb2023-mega-menu-wrapper")
      for (var i = 0; i < allMobileMenus.length; i++) {
        if (allMobileMenus[i].id !== megaMenuId) {
          allMobileMenus[i].style.display = "none"
        }
      }

      // Tüm linklerdeki active sınıfını kaldır
      var allMobileLinks = document.querySelectorAll(".sunucumweb2023-mobile-menu-link")
      for (var j = 0; j < allMobileLinks.length; j++) {
        allMobileLinks[j].classList.remove("active")
      }

      // Tıklanan menüyü aç/kapat
      if (megaMenu.style.display === "block") {
        megaMenu.style.display = "none"
        this.classList.remove("active")
        console.log("sunucumweb2023HeaderModule: Menü kapatıldı:", megaMenuId)
      } else {
        megaMenu.style.display = "block"
        this.classList.add("active")
        console.log("sunucumweb2023HeaderModule: Menü açıldı:", megaMenuId)
      }
    } else {
      console.error("sunucumweb2023HeaderModule: Mega menü bulunamadı:", megaMenuId)
    }
  }

  // Masaüstü mega menü kurulumu
  function _sunucumweb2023_setupDesktopMegaMenu(linkId, menuId) {
    var link = document.getElementById(linkId)
    var menu = document.getElementById(menuId)

    if (!link || !menu) {
      console.error("sunucumweb2023HeaderModule: Mega menü kurulumu başarısız:", {
        linkId: linkId,
        menuId: menuId,
        linkFound: !!link,
        menuFound: !!menu,
      })
      return
    }

    console.log("sunucumweb2023HeaderModule: Mega menü kurulumu başarılı:", { linkId: linkId, menuId: menuId })

    // mouseenter olayı
    link.addEventListener("mouseenter", () => {
      // Hide all mega menus first
      var allMegaMenus = document.querySelectorAll(".sunucumweb2023-mega-menu-wrapper")
      for (var i = 0; i < allMegaMenus.length; i++) {
        allMegaMenus[i].style.display = "none"
      }

      // Remove active class from all links
      var allNavLinks = document.querySelectorAll(".sunucumweb2023-nav-link")
      for (var j = 0; j < allNavLinks.length; j++) {
        allNavLinks[j].classList.remove("sunucumweb2023-active-mega-menu")
      }

      // Show this mega menu
      menu.style.display = "block"
      // Add active class to this link
      link.classList.add("sunucumweb2023-active-mega-menu")
      // Show blur overlay
      if (_sunucumweb2023_blurOverlay) _sunucumweb2023_blurOverlay.style.display = "block"

      // Mega menü yüksekliğini ve grid yapısını ayarla
      _sunucumweb2023_adjustMegaMenuHeight(menu)
    })

    // mouseleave olayı
    link.addEventListener("mouseleave", (e) => {
      // Check if the mouse is moving to the mega menu
      var toElement = e.relatedTarget
      if (!menu.contains(toElement)) {
        menu.style.display = "none"
        link.classList.remove("sunucumweb2023-active-mega-menu")
        // Hide blur overlay if not hovering any mega menu
        if (_sunucumweb2023_blurOverlay) {
          var hoveredMegaMenu = document.querySelector(".sunucumweb2023-mega-menu-wrapper:hover")
          if (!hoveredMegaMenu) {
            _sunucumweb2023_blurOverlay.style.display = "none"
          }
        }
      }
    })

    // mouseenter olayı (menü için)
    menu.addEventListener("mouseenter", () => {
      menu.style.display = "block"
      link.classList.add("sunucumweb2023-active-mega-menu")
      // Show blur overlay
      if (_sunucumweb2023_blurOverlay) _sunucumweb2023_blurOverlay.style.display = "block"
    })

    // mouseleave olayı (menü için)
    menu.addEventListener("mouseleave", () => {
      menu.style.display = "none"
      link.classList.remove("sunucumweb2023-active-mega-menu")
      // Hide blur overlay
      if (_sunucumweb2023_blurOverlay) _sunucumweb2023_blurOverlay.style.display = "none"
    })
  }

  // Mega menü yüksekliğini ve grid yapısını ayarlama fonksiyonu
  function _sunucumweb2023_adjustMegaMenuHeight(megaMenu) {
    if (!megaMenu) return

    // Mega menü içindeki kart sayısını bul
    var container = megaMenu.querySelector(".sunucumweb2023-mega-menu-container")
    if (!container) return

    var cards = container.querySelectorAll(".sunucumweb2023-hosting-card")
    var cardCount = cards.length

    console.log("sunucumweb2023HeaderModule: Mega menü kart sayısı:", cardCount, "Menü ID:", megaMenu.id)

    // Kart sayısına göre grid yapısını ve yüksekliği ayarla
    if (cardCount <= 3) {
      // 3 veya daha az kart varsa, tek satır olarak göster
      container.style.gridTemplateColumns = "repeat(3, 1fr)"
      container.style.gridTemplateRows = "auto"
      megaMenu.style.height = "140px" // Tek satır için daha az yükseklik
    } else if (cardCount == 4) {
      // 4 kart varsa, tek satırda 4 sütun olarak göster
      container.style.gridTemplateColumns = "repeat(4, 1fr)"
      container.style.gridTemplateRows = "auto"
      megaMenu.style.height = "140px" // Tek satır için daha az yükseklik

      // 4 kart için özel stil - daha dar kartlar
      for (var i = 0; i < cards.length; i++) {
        cards[i].style.height = "90px" // Normal kart yüksekliği
      }
    } else {
      // 5 veya daha fazla kart varsa, 3x2 grid olarak göster (varsayılan)
      container.style.gridTemplateColumns = "repeat(3, 1fr)"
      container.style.gridTemplateRows = "repeat(2, auto)"
      megaMenu.style.height = "260px" // Tam yükseklik

      // Normal kart yüksekliği
      for (var i = 0; i < cards.length; i++) {
        cards[i].style.height = "90px" // Normal kart yüksekliği
      }
    }
  }

  // Tüm mega menülerin yüksekliğini ayarla
  function _sunucumweb2023_adjustAllMegaMenus() {
    var allMegaMenus = document.querySelectorAll(".sunucumweb2023-mega-menu-wrapper")
    for (var i = 0; i < allMegaMenus.length; i++) {
      _sunucumweb2023_adjustMegaMenuHeight(allMegaMenus[i])
    }
  }

  // Scroll olayını yönetme fonksiyonu
  function _sunucumweb2023_handleScroll() {
    var scrollTop = window.pageYOffset || document.documentElement.scrollTop

    // Sticky header sınıfını ekle/kaldır
    if (scrollTop > 0) {
      document.body.classList.add("sunucumweb2023-sticky-active")
    } else {
      document.body.classList.remove("sunucumweb2023-sticky-active")
    }

    _sunucumweb2023_lastScrollTop = scrollTop
  }

  // Başlatma fonksiyonu - public
  function sunucumweb2023_initHeader() {
    if (_sunucumweb2023_initialized) {
      console.log("sunucumweb2023HeaderModule: Zaten başlatılmış, tekrar başlatılmıyor")
      return
    }

    console.log("sunucumweb2023HeaderModule: Başlatılıyor...")

    try {
      // DOM elementlerini al
      _sunucumweb2023_mobileMenuBtn = document.getElementById("sunucumweb2023-mobile-menu-btn")
      _sunucumweb2023_mobileMenu = document.getElementById("sunucumweb2023-mobile-menu")
      _sunucumweb2023_mobileMenuLinks = document.querySelectorAll(".sunucumweb2023-mobile-menu-link")
      _sunucumweb2023_blurOverlay = document.querySelector(".sunucumweb2023-blur-overlay")
      _sunucumweb2023_topbar = document.querySelector(".sunucumweb2023-topbar")
      _sunucumweb2023_header = document.querySelector(".sunucumweb2023-main-header")
      _sunucumweb2023_headerContainer = document.querySelector(".sunucumweb2023-header-container")

      // Mobil menü butonuna tıklama olayı ekle
      if (_sunucumweb2023_mobileMenuBtn && _sunucumweb2023_mobileMenu) {
        console.log("sunucumweb2023HeaderModule: Mobil menü butonları bulundu")

        // Önceki event listener'ları temizle (eğer varsa)
        _sunucumweb2023_mobileMenuBtn.removeEventListener("click", _sunucumweb2023_toggleMobileMenu)

        // Yeni event listener ekle
        _sunucumweb2023_mobileMenuBtn.addEventListener("click", _sunucumweb2023_toggleMobileMenu)
      } else {
        console.error("sunucumweb2023HeaderModule: Mobil menü elemanları bulunamadı:", {
          mobileMenuBtn: _sunucumweb2023_mobileMenuBtn ? "Bulundu" : "Bulunamadı",
          mobileMenu: _sunucumweb2023_mobileMenu ? "Bulundu" : "Bulunamadı",
        })
      }

      // Mobil menü linklerine tıklama olayı ekle
      console.log("sunucumweb2023HeaderModule: Mobil menü linkleri bulundu:", _sunucumweb2023_mobileMenuLinks.length)

      for (let i = 0; i < _sunucumweb2023_mobileMenuLinks.length; i++) {
        var link = _sunucumweb2023_mobileMenuLinks[i]

        // Önceki event listener'ları temizle (eğer varsa)
        link.removeEventListener("click", _sunucumweb2023_handleMobileSubmenu)

        // Yeni event listener ekle
        link.addEventListener("click", _sunucumweb2023_handleMobileSubmenu)
      }

      // Masaüstü mega menüleri kur
      _sunucumweb2023_setupDesktopMegaMenu("sunucumweb2023-domain-link", "sunucumweb2023-domain-mega-menu")
      _sunucumweb2023_setupDesktopMegaMenu("sunucumweb2023-hosting-link", "sunucumweb2023-hosting-mega-menu")
      _sunucumweb2023_setupDesktopMegaMenu("sunucumweb2023-sunucu-link", "sunucumweb2023-sunucu-mega-menu")
      _sunucumweb2023_setupDesktopMegaMenu("sunucumweb2023-veri-merkezi-link", "sunucumweb2023-veri-merkezi-mega-menu")
      _sunucumweb2023_setupDesktopMegaMenu("sunucumweb2023-gre-tunnel-link", "sunucumweb2023-gre-tunnel-mega-menu")
      _sunucumweb2023_setupDesktopMegaMenu("sunucumweb2023-hakkimizda-link", "sunucumweb2023-hakkimizda-mega-menu")

      // Sayfa yüklendiğinde tüm mega menülerin yüksekliğini ayarla
      _sunucumweb2023_adjustAllMegaMenus()

      // Scroll olayını dinle
      window.addEventListener("scroll", _sunucumweb2023_handleScroll)

      // Başlangıçta scroll durumunu kontrol et
      _sunucumweb2023_handleScroll()

      // Pencere boyutu değiştiğinde mega menüleri yeniden ayarla
      window.addEventListener("resize", _sunucumweb2023_adjustAllMegaMenus)

      _sunucumweb2023_initialized = true
      console.log("sunucumweb2023HeaderModule: Başlatma tamamlandı")
    } catch (error) {
      console.error("sunucumweb2023HeaderModule: Başlatma sırasında hata oluştu:", error)
    }
  }

  // Public API'yi dışa aktar
  window.sunucumweb2023HeaderModule.init = sunucumweb2023_initHeader

  // Mega menü öğelerini dinamik olarak ayarlama fonksiyonunu da dışa aktar
  window.sunucumweb2023HeaderModule.adjustMegaMenus = _sunucumweb2023_adjustAllMegaMenus

  // DOM yüklendiğinde otomatik başlatma
  function sunucumweb2023_domReadyHandler() {
    console.log("DOM yüklendi, sunucumweb2023HeaderModule başlatılıyor")
    sunucumweb2023_initHeader()
  }

  // DOMContentLoaded olayını dinle
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", sunucumweb2023_domReadyHandler)
  } else {
    // DOMContentLoaded zaten tetiklendi
    sunucumweb2023_domReadyHandler()
  }
})()


}catch(e){console.warn('[index]',e)}
try{

        document.addEventListener('DOMContentLoaded', function() {
            const banner = document.getElementById('xhosttrpromo-banner');
            const closeButton = document.getElementById('xhosttrpromo-close');

            closeButton.addEventListener('click', function() {
                banner.classList.add('opacity-0');
                setTimeout(() => {
                    banner.classList.add('hidden');
                }, 500); // This matches the transition duration in the banner class
            });
        });
    
}catch(e){console.warn('[index]',e)}
try{

  // Ana tablar
  const tabs = {
    domain: document.getElementById('tab-domain'),
    bulk: document.getElementById('tab-bulk'),
    whois: document.getElementById('tab-whois'),
    transfer: document.getElementById('tab-transfer')
  };

  // Butonlar
  const btnBulk = document.getElementById('btnBulk');
  const btnTransfer = document.getElementById('btnTransfer');

  function activateTab(tab) {
    // Tüm tabları sıfırla
    Object.values(tabs).forEach(t => {
      t.classList.remove('text-blue-700', 'border-blue-700');
      t.classList.add('text-gray-500', 'border-transparent');
    });

    // Seçilen tabı aktif yap
    tab.classList.add('text-blue-700', 'border-blue-700');
    tab.classList.remove('text-gray-500', 'border-transparent');
  }

  // Event listenerlar
  btnBulk.addEventListener('click', () => activateTab(tabs.bulk));
  btnTransfer.addEventListener('click', () => activateTab(tabs.transfer));

}catch(e){console.warn('[index]',e)}
try{

      function goToWhois() {
        var domainInput = document.getElementById('domainInput').value.trim();
        var selectedTLD = document.getElementById('domainTLD').value;

        if (domainInput === '') {
          alert('Lütfen bir alan adı girin.');
          return;
        }

        var finalDomain = domainInput;

        if (domainInput.includes('.')) {
          // Kullanıcı bir nokta koyduysa mevcut uzantıyı ayır
          var parts = domainInput.split('.');
          var namePart = parts[0];
          var inputTLD = '.' + parts.slice(1).join('.');

          // Eğer inputtaki uzantı ile seçili uzantı farklıysa, inputtakini kullan
          finalDomain = namePart + inputTLD;

        } else {
          // Nokta yoksa seçili TLD ekle
          finalDomain = domainInput + selectedTLD;
        }

        window.location.href = 'https://my.sunucumweb.com/alan-adi?domain=' + encodeURIComponent(finalDomain);
      }
    
}catch(e){console.warn('[index]',e)}
try{

document.addEventListener("DOMContentLoaded", () => {

  const bulkInput = document.getElementById("bulk-input");
  const bulkFilter = document.getElementById("bulk-filter");
  const bulkBtn = document.getElementById("bulk-btn");
  const bulkResult = document.getElementById("bulk-result");

  let isLoading = false;

  // Uzantı filtre kontrolü
  bulkFilter.addEventListener("change", () => {
    const filter = bulkFilter.value;
    let lines = bulkInput.value.split("\n").map(l => l.trim());
    if (filter !== "all") {
      lines = lines.map(line => line.replace(/\..*$/, ""));
      bulkInput.value = lines.join("\n");
    }
  });

  // Kullanıcı yazarken kontrol
  bulkInput.addEventListener("input", () => {
    const filter = bulkFilter.value;
    if (filter === "all") return;

    let lines = bulkInput.value.split("\n").map(line => {
      if (line.includes(".")) {
        bulkResult.innerHTML = `<p class="text-red-600 text-sm mb-2">Hata: Belirli bir uzantı seçilmişken sadece isim yazabilirsiniz. ".${filter}" dışında bir şey yazmayın.</p>`;
        return line.split(".")[0];
      }
      return line;
    });
    bulkInput.value = lines.join("\n");
  });

  // Toplu sorgulama butonu
  bulkBtn.addEventListener("click", async () => {
    if (isLoading) return;
    isLoading = true;

    bulkBtn.disabled = true;
    bulkBtn.classList.add("opacity-50", "cursor-not-allowed");
    bulkBtn.innerHTML = `
      <svg class="animate-spin h-5 w-5 mr-2 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
      </svg>
      <span>Sorgulanıyor...</span>
    `;

    bulkResult.innerHTML = `<p class="text-gray-600">Sorgulanıyor, lütfen bekleyin...</p>`;

    const filter = bulkFilter.value;
    let domains = bulkInput.value
      .split("\n")
      .map(d => d.trim().toLowerCase())
      .filter(d => d.length > 0);

    if (filter !== "all") {
      domains = domains.map(d => `${d}.${filter}`);
    }

    if (domains.length === 0) {
      bulkResult.innerHTML = `<p class="text-red-600">Lütfen en az 1 alan adı girin.</p>`;
      isLoading = false;
      bulkBtn.disabled = false;
      bulkBtn.classList.remove("opacity-50", "cursor-not-allowed");
      bulkBtn.innerHTML = `<span>TOPLU SORGULA</span>`;
      return;
    }

    const results = [];
    for (let domain of domains) {
      try {
        const res = await fetch(`https://api.api-ninjas.com/v1/whois?domain=${domain}`, {
          headers: { 'X-Api-Key': 'E/tb95KrqpqlsHuSrGdPBA==sfzuQqS3RLi6f4oE' }
        });

        const data = await res.json();

        let status = "";
        let whoisData = null;
        if (data.registrar || data.creation_date) {
          status = "Dolu";
          whoisData = data;
        } else if (Object.keys(data).length === 0) {
          status = "Bilgi alınamadı";
        } else {
          status = "Müsait";
        }

        results.push({ domain, status, whoisData });
      } catch (err) {
        console.error(err);
        results.push({ domain, status: "Hata", whoisData: null });
      }
    }

    bulkResult.innerHTML = `
      <div class="bg-white border border-gray-200 rounded-xl p-6">
        <h3 class="font-semibold text-gray-800 mb-4">
          Toplu Sorgulama Sonuçları (${results.length})
        </h3>
        <ul class="space-y-3">
          ${results.map((r, index) => {
            const domainLower = r.domain.toLowerCase();

            if(r.status === "Müsait") {
              return `
                <li class="flex justify-between items-center border rounded-lg px-4 py-3">
                  <span class="font-medium">${r.domain}</span>
                  <a href="https://my.sunucumweb.com/alan-adi?domain=${domainLower}" target="_blank" class="bg-green-600 text-white px-4 py-1 rounded-lg hover:bg-green-700 transition-colors font-semibold">
                    Satın Al
                  </a>
                </li>
              `;
            } else if(r.status === "Dolu") {
              const whoisId = `whois-${index}`;
              const whoisHtml = r.whoisData ? `
                <div id="${whoisId}" class="hidden mt-2 p-3 bg-gray-50 rounded text-gray-700 text-sm space-y-1">
                  <p><strong>Registrar:</strong> ${r.whoisData.registrar || '-'}</p>
                  <p><strong>Oluşturulma Tarihi:</strong> ${r.whoisData.creation_date || '-'}</p>
                  <p><strong>Sona Erme Tarihi:</strong> ${r.whoisData.expiration_date || '-'}</p>
                  <p><strong>Transfer Kilidi:</strong> ${r.whoisData.locked ? 'Kapalı' : 'Açık'}</p>
                </div>
              ` : `<div id="${whoisId}" class="hidden mt-2 p-3 bg-gray-50 rounded text-gray-700 text-sm">WHOIS bilgisi alınamadı</div>`;

              return `
                <li class="border rounded-lg px-4 py-3">
                  <div class="flex justify-between items-center cursor-pointer" onclick="document.getElementById('${whoisId}').classList.toggle('hidden')">
                    <span class="font-medium text-red-600">${r.domain} - Dolu</span>
                    <svg class="h-4 w-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
                    </svg>
                  </div>
                  ${whoisHtml}
                </li>
              `;
            } else {
              return `
                <li class="flex justify-between items-center border rounded-lg px-4 py-3">
                  <span class="font-medium">${r.domain}</span>
                  <span class="${r.status === "Hata" ? "text-yellow-600" : "text-gray-500"} font-semibold">${r.status}</span>
                </li>
              `;
            }
          }).join("")}
        </ul>
      </div>
    `;

    isLoading = false;
    bulkBtn.disabled = false;
    bulkBtn.classList.remove("opacity-50", "cursor-not-allowed");
    bulkBtn.innerHTML = `<span>TOPLU SORGULA</span>`;
  });

});

}catch(e){console.warn('[index]',e)}
try{

    const whoisBtn = document.getElementById('whois-btn');
    const whoisInput = document.getElementById('whois-input');
    const whoisResult = document.getElementById('whois-result');

    whoisBtn.addEventListener('click', () => {
      const domain = whoisInput.value.trim();

      if (!domain) {
        whoisResult.innerHTML = '<p>Lütfen bir alan adı girin.</p>';
        return;
      }

      whoisResult.innerHTML = '<p>Sorgulanıyor...</p>';

      fetch(`https://api.api-ninjas.com/v1/whois?domain=${domain}`, {
          headers: {
            'X-Api-Key': 'E/tb95KrqpqlsHuSrGdPBA==sfzuQqS3RLi6f4oE'
          }
        })
        .then(response => response.json())
        .then(data => {
          let creationDateTR = '-';
          let expirationDateTR = '-';

          // Epoch timestamp mi kontrol et
          if (data.creation_date) {
            const ts = Number(data.creation_date);
            if (!isNaN(ts)) {
              creationDateTR = new Date(ts * 1000).toLocaleString('tr-TR', {
                timeZone: 'Europe/Istanbul'
              });
            } else {
              creationDateTR = new Date(data.creation_date).toLocaleString('tr-TR', {
                timeZone: 'Europe/Istanbul'
              });
            }
          }

          if (data.expiration_date) {
            const ts = Number(data.expiration_date);
            if (!isNaN(ts)) {
              expirationDateTR = new Date(ts * 1000).toLocaleString('tr-TR', {
                timeZone: 'Europe/Istanbul'
              });
            } else {
              expirationDateTR = new Date(data.expiration_date).toLocaleString('tr-TR', {
                timeZone: 'Europe/Istanbul'
              });
            }
          }

          whoisResult.innerHTML = `
    <p><strong>Alan Adı:</strong> ${data.domain_name || '-'}</p>
    <p><strong>Kayıt Edilen Firma:</strong> ${data.registrar || '-'}</p>
    <p><strong>Kayıt Tarihi:</strong> ${creationDateTR}</p>
    <p><strong>Bitiş Tarihi:</strong> ${expirationDateTR}</p>
    <p><strong>Nameserver:</strong> ${data.name_servers ? data.name_servers.join(', ') : '-'}</p>
  `;
        })
        .catch(error => {
          console.error(error);
          whoisResult.innerHTML = '<p>Bir hata oluştu. Lütfen tekrar deneyin.</p>';
        });
    });
  
}catch(e){console.warn('[index]',e)}
try{

  document.addEventListener('DOMContentLoaded', function() {
    // Get all tab buttons and content sections
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabContents = document.querySelectorAll('.tab-content');

    // Add click event to each tab button
    tabButtons.forEach(button => {
      button.addEventListener('click', function() {
        // Remove active class from all buttons
        tabButtons.forEach(btn => {
          btn.classList.remove('text-blue-700', 'border-blue-700');
          btn.classList.add('text-gray-500', 'border-transparent');
        });

        // Add active class to clicked button
        this.classList.remove('text-gray-500', 'border-transparent');
        this.classList.add('text-blue-700', 'border-blue-700');

        // Hide all tab contents
        tabContents.forEach(content => {
          content.classList.add('hidden');
        });

        // Show the corresponding tab content
        const tabId = this.id.replace('tab-', 'content-');
        document.getElementById(tabId).classList.remove('hidden');
      });
    });
  });

}catch(e){console.warn('[index]',e)}
try{

        lucide.createIcons();
    
}catch(e){console.warn('[index]',e)}
try{

    // Accordion functionality for mobile view - Optimize for performance
    document.addEventListener('DOMContentLoaded', function() {
      const accordionButtons = document.querySelectorAll('.accordion-btn');
      
      accordionButtons.forEach(button => {
        button.addEventListener('click', function() {
          const expanded = this.getAttribute('aria-expanded') === 'true';
          this.setAttribute('aria-expanded', !expanded);
          
          const content = document.getElementById(this.getAttribute('aria-controls'));
          if (expanded) {
            content.classList.remove('open');
          } else {
            content.classList.add('open');
          }
        });
      });
    });
  
}catch(e){console.warn('[index]',e)}