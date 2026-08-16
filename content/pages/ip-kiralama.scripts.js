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

}catch(e){console.warn('[ip-kiralama]',e)}
try{
(function(){function c(){var b=a.contentDocument||(a.contentWindow&&a.contentWindow.document);if(b){var d=b.createElement('script');d.innerHTML="window.__CF$cv$params={r:'a2b9702dcbc6f4c8',t:'MTc4NjgwOTg5OQ=='};var a=document.createElement('script');a.src='cdn-cgi/challenge-platform/scripts/jsd/main.js';document.getElementsByTagName('head')[0].appendChild(a);";b.getElementsByTagName('head')[0].appendChild(d)}}if(document.body){var a=document.createElement('iframe');a.height=1;a.width=1;a.style.position='absolute';a.style.top=0;a.style.left=0;a.style.border='none';a.style.visibility='hidden';document.body.appendChild(a);if('loading'!==document.readyState)c();else if(window.addEventListener)document.addEventListener('DOMContentLoaded',c);else{var e=document.onreadystatechange||function(){};document.onreadystatechange=function(b){e(b);'loading'!==document.readyState&&(document.onreadystatechange=e,c())}}}})();
}catch(e){console.warn('[ip-kiralama]',e)}
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


}catch(e){console.warn('[ip-kiralama]',e)}
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
    
}catch(e){console.warn('[ip-kiralama]',e)}
try{

document.addEventListener('DOMContentLoaded', function() {
  // Kopyalama işlemi
  const copyButton = document.getElementById('copyButton');
  const notification = document.getElementById('copyNotification');
  
  if (copyButton) {
    copyButton.addEventListener('click', function() {
      const promoCode = 'DEDICATEDOZEL40';
      
      // Modern tarayıcılar için clipboard API kullanımı
      if (navigator.clipboard) {
        navigator.clipboard.writeText(promoCode)
          .then(() => {
            showNotification();
          })
          .catch(err => {
            console.error('Kopyalama başarısız oldu:', err);
            fallbackCopyTextToClipboard(promoCode);
          });
      } else {
        // Eski tarayıcılar için alternatif yöntem
        fallbackCopyTextToClipboard(promoCode);
      }
    });
  }
  
  function fallbackCopyTextToClipboard(text) {
    // Geçici bir textarea elementi oluştur
    const textArea = document.createElement("textarea");
    textArea.value = text;
    
    // Textarea'yı görünmez yap
    textArea.style.position = "fixed";
    textArea.style.top = "0";
    textArea.style.left = "0";
    textArea.style.width = "2em";
    textArea.style.height = "2em";
    textArea.style.padding = "0";
    textArea.style.border = "none";
    textArea.style.outline = "none";
    textArea.style.boxShadow = "none";
    textArea.style.background = "transparent";
    
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    
    try {
      const successful = document.execCommand('copy');
      if (successful) {
        showNotification();
      } else {
        console.error('Kopyalama başarısız oldu');
      }
    } catch (err) {
      console.error('Kopyalama hatası:', err);
    }
    
    document.body.removeChild(textArea);
  }
  
  function showNotification() {
    // Bildirimi göster
    notification.style.opacity = '1';
    notification.style.transform = 'translateY(0)';
    
    // 3 saniye sonra bildirimi kapat
    setTimeout(() => {
      notification.style.opacity = '0';
      notification.style.transform = 'translateY(-20px)';
    }, 3000);
  }
  
  // Geri sayım fonksiyonu
  // Geri sayım için bitiş tarihi (5 gün sonrası)
  const endDate = new Date();
  endDate.setDate(endDate.getDate() + 5);
  
  const daysElement = document.querySelector('.countdown-days');
  const hoursElement = document.querySelector('.countdown-hours');
  const minutesElement = document.querySelector('.countdown-minutes');
  const secondsElement = document.querySelector('.countdown-seconds');
  
  function updateCountdown() {
    const now = new Date();
    const diff = endDate - now;
    
    if (diff <= 0) {
      // Kampanya süresi doldu
      daysElement.textContent = "00";
      hoursElement.textContent = "00";
      minutesElement.textContent = "00";
      secondsElement.textContent = "00";
      return;
    }
    
    // Kalan süreyi hesapla
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);
    
    // Ekranı güncelle
    daysElement.textContent = days < 10 ? "0" + days : days;
    hoursElement.textContent = hours < 10 ? "0" + hours : hours;
    minutesElement.textContent = minutes < 10 ? "0" + minutes : minutes;
    secondsElement.textContent = seconds < 10 ? "0" + seconds : seconds;
  }
  
  // İlk güncelleme
  if (daysElement && hoursElement && minutesElement && secondsElement) {
    updateCountdown();
    
    // Her saniye güncelle
    setInterval(updateCountdown, 1000);
  }
});

}catch(e){console.warn('[ip-kiralama]',e)}
try{

    function toggleAccordion(id) {
      const content = document.getElementById(id);
      const iconId = 'icon' + id.substring(3);
      const icon = document.getElementById(iconId);
      
      if (content.classList.contains('hidden')) {
        content.classList.remove('hidden');
        icon.classList.add('rotate-45');
      } else {
        content.classList.add('hidden');
        icon.classList.remove('rotate-45');
      }
    }
  
}catch(e){console.warn('[ip-kiralama]',e)}
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
  
}catch(e){console.warn('[ip-kiralama]',e)}