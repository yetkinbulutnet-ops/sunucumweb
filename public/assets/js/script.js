/** XHOSTNET MAIN JS **/
document.addEventListener('DOMContentLoaded', function() {
    // ===== MENU JS =====
    // Menü elemanlarını seç
    const mainNav = document.querySelector('.xhostmenu-main-nav');
    const spacer = document.getElementById('xhostmenu-spacer');
    const megaWrapper = document.querySelector('.xhostmenu-mega-wrapper');
    const overlay = document.getElementById('xhostmenu-overlay');
    const scrollTopBtn = document.getElementById('xhostmenu-scroll-top');
    const scrollProgress = document.getElementById('xhostmenu-scroll-progress');
    const rocketWrapper = document.querySelector('.xhostmenu-rocket-wrapper');
    let navHeight = mainNav ? mainNav.offsetHeight : 0;
    let lastScrollTop = 0;
    let isFixed = false;
    let activeMegaMenu = null;
    let isScrolling = false;
    
    // CSS değişkeni olarak menü yüksekliğini ayarla
    if (mainNav) {
        document.documentElement.style.setProperty('--menu-height', navHeight + 'px');
        
        // Scroll olayını dinle
        window.addEventListener('scroll', function() {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            const scrollHeight = document.documentElement.scrollHeight;
            const clientHeight = document.documentElement.clientHeight;
            const scrollPercent = (scrollTop / (scrollHeight - clientHeight)) * 100;
            
            // Scroll pozisyonu top bar'ın altına geldiğinde
            if (scrollTop > 50) {
                if (!isFixed) {
                    // Menüyü sabit pozisyona getir
                    mainNav.classList.add('fixed');
                    if (spacer) {
                        spacer.classList.add('active');
                        spacer.style.height = navHeight + 'px';
                    }
                    isFixed = true;
                    
                    // Menü yüksekliğini güncelle (fixed durumunda farklı olabilir)
                    navHeight = mainNav.offsetHeight;
                    document.documentElement.style.setProperty('--menu-height', navHeight + 'px');
                }
                
                // Yukarı çıkma butonunu göster
                if (scrollTopBtn) {
                    scrollTopBtn.classList.add('active');
                }
                
                // Scroll ilerleme çubuğunu güncelle
                if (scrollProgress) {
                    scrollProgress.style.height = scrollPercent + '%';
                }
                
            } else {
                // Scroll pozisyonu top bar'ın üstünde ise menüyü normal pozisyona getir
                mainNav.classList.remove('fixed');
                if (spacer) {
                    spacer.classList.remove('active');
                }
                isFixed = false;
                
                // Yukarı çıkma butonunu gizle
                if (scrollTopBtn) {
                    scrollTopBtn.classList.remove('active');
                }
            }
            
            lastScrollTop = scrollTop;
        });
    }
    
    // Yukarı çıkma butonuna tıklandığında
    if (scrollTopBtn) {
        scrollTopBtn.addEventListener('click', function() {
            if (isScrolling) return;
            
            // Animasyon sınıfını ekle
            scrollTopBtn.classList.add('scrolling');
            isScrolling = true;
            
            // Sayfayı yumuşak bir şekilde yukarı kaydır
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
            
            // Animasyon tamamlandığında sınıfı kaldır
            setTimeout(function() {
                scrollTopBtn.classList.remove('scrolling');
                isScrolling = false;
            }, 1500);
        });
    }
    
    // Pencere boyutu değiştiğinde menü yüksekliğini güncelle
    if (mainNav) {
        window.addEventListener('resize', function() {
            navHeight = mainNav.offsetHeight;
            document.documentElement.style.setProperty('--menu-height', navHeight + 'px');
            if (isFixed && spacer) {
                spacer.style.height = navHeight + 'px';
            }
        });
    }

    // Döviz kuru güncelleme fonksiyonu
    async function xhostmenuUpdateExchangeRate() {
        const rateElement = document.getElementById('xhostmenu-current-rate');
        if (!rateElement) return;

        try {
            const xhosttronse = await fetch('https://api.exchangerate-api.com/v4/latest/USD');
            const data = await xhosttronse.json();
            const rate = data.rates.TRY.toFixed(2);
            rateElement.textContent = rate + ' ₺';
            rateElement.classList.add('xhostmenu-animate-fadeIn');
        } catch (error) {
            console.error('Kur bilgisi alınamadı:', error);
            rateElement.textContent = 'Hata';
        }
    }

    // İlk yükleme
    xhostmenuUpdateExchangeRate();

    // Her 5 dakikada bir güncelle
    setInterval(xhostmenuUpdateExchangeRate, 300000);

    // Lucide ikonlarını yükle
    if (typeof lucide !== 'undefined' && typeof lucide.createIcons === 'function') {
        lucide.createIcons();
    } else {
        console.error('Lucide kütüphanesi yüklenemedi');
    }

    // Mobile menu toggle
    const mobileMenuButton = document.getElementById('xhostmenu-mobile-menu-button');
    const menuItems = document.getElementById('xhostmenu-menu-items');
    const menuIcon = document.getElementById('xhostmenu-menu-icon');
    const closeIcon = document.getElementById('xhostmenu-close-icon');

    if (mobileMenuButton && menuItems && menuIcon && closeIcon) {
        mobileMenuButton.addEventListener('click', () => {
            menuItems.classList.toggle('hidden');
            menuIcon.classList.toggle('hidden');
            closeIcon.classList.toggle('hidden');
        });
    }

    // Overlay'e tıklandığında menüleri kapat
    if (overlay) {
        overlay.addEventListener('click', () => {
            closeAllMegaMenus();
        });
    }

    // Tüm mega menüleri kapat
    function closeAllMegaMenus() {
        const allMegaMenus = document.querySelectorAll('.xhostmenu-mega');
        allMegaMenus.forEach(menu => {
            menu.classList.remove('active');
        });
        
        // Tüm ikonları eski haline getir
        if (typeof megaMenus !== 'undefined') {
            megaMenus.forEach(({ iconId }) => {
                const icon = document.getElementById(iconId);
                if (icon) {
                    icon.classList.remove('xhostmenu-icon-rotate');
                }
            });
        }
        
        // Overlay'i kapat
        if (overlay) {
            overlay.classList.remove('active');
        }
        activeMegaMenu = null;
    }

    // Mega menüler için güncellenen kod
    const megaMenus = [
        { menuId: 'xhostmenu-domain-menu', megaMenuId: 'xhostmenu-domain-mega-menu', iconId: 'xhostmenu-domain-icon' },
        { menuId: 'xhostmenu-hosting-menu', megaMenuId: 'xhostmenu-hosting-mega-menu', iconId: 'xhostmenu-hosting-icon' },
        { menuId: 'xhostmenu-sunucu-menu', megaMenuId: 'xhostmenu-sunucu-mega-menu', iconId: 'xhostmenu-sunucu-icon' },
        { menuId: 'xhostmenu-veri-merkezi-menu', megaMenuId: 'xhostmenu-veri-merkezi-mega-menu', iconId: 'xhostmenu-veri-merkezi-icon' },
        { menuId: 'xhostmenu-kurumsal-menu', megaMenuId: 'xhostmenu-kurumsal-mega-menu', iconId: 'xhostmenu-kurumsal-icon' }
    ];

    megaMenus.forEach(({ menuId, megaMenuId, iconId }) => {
        const menu = document.getElementById(menuId);
        if (!menu) return;
        
        const megaMenu = document.getElementById(megaMenuId);
        const icon = document.getElementById(iconId);
        const submenu = menu.querySelector('.xhostmenu-submenu');
        
        if (!megaMenu || !submenu) return;

        menu.addEventListener('click', (e) => {
            e.preventDefault();
            const isMobile = window.innerWidth < 1024;

            if (isMobile) {
                submenu.classList.toggle('active');
                if (icon) {
                    icon.classList.toggle('xhostmenu-icon-rotate');
                }
            } else {
                const isActive = megaMenu.classList.contains('active');
                
                // Önce tüm menüleri kapat
                closeAllMegaMenus();
                
                // Eğer tıklanan menü zaten aktif değilse, aç
                if (!isActive) {
                    megaMenu.classList.add('active');
                    if (icon) {
                        icon.classList.add('xhostmenu-icon-rotate');
                    }
                    if (overlay) {
                        overlay.classList.add('active');
                    }
                    activeMegaMenu = megaMenuId;
                }
            }
        });

        // Mobil görünümde mega menü içeriğini submenu'ye taşı
        function updateSubmenuContent() {
            if (window.innerWidth < 1024 && megaMenu && submenu) {
                submenu.innerHTML = megaMenu.innerHTML;
            }
        }

        // Sayfa yüklendiğinde ve yeniden boyutlandırıldığında içeriği güncelle
        updateSubmenuContent();
        window.addEventListener('resize', updateSubmenuContent);
    });

    // Menü dışına tıklandığında menüleri kapat
    document.addEventListener('click', (e) => {
        const isMobile = window.innerWidth < 1024;
        let clickedOnMenu = false;
        
        megaMenus.forEach(({ menuId, megaMenuId }) => {
            const menu = document.getElementById(menuId);
            const megaMenu = document.getElementById(megaMenuId);
            
            // Menü veya mega menüye tıklandı mı kontrol et
            if (menu && megaMenu && (menu.contains(e.target) || megaMenu.contains(e.target))) {
                clickedOnMenu = true;
            }
        });
        
        // Eğer menü dışına tıklandıysa ve mobil görünümde değilse, tüm menüleri kapat
        if (!clickedOnMenu && !isMobile && overlay && !overlay.contains(e.target)) {
            closeAllMegaMenus();
        }
    });

    // Pencere boyutu değiştiğinde menü durumunu güncelle
    window.addEventListener('resize', () => {
        const isMobile = window.innerWidth < 1024;
        if (menuItems && menuIcon && closeIcon) {
            if (!isMobile) {
                menuItems.classList.remove('hidden');
                menuIcon.classList.remove('hidden');
                closeIcon.classList.add('hidden');
            } else {
                menuItems.classList.add('hidden');
                menuIcon.classList.remove('hidden');
                closeIcon.classList.add('hidden');
                
                // Mobil görünüme geçildiğinde overlay'i kapat
                if (overlay) {
                    overlay.classList.remove('active');
                }
            }
        }

        megaMenus.forEach(({ menuId, megaMenuId, iconId }) => {
            const menu = document.getElementById(menuId);
            const megaMenu = document.getElementById(megaMenuId);
            const icon = document.getElementById(iconId);
            const submenu = menu?.querySelector('.xhostmenu-submenu');

            if (menu && megaMenu && icon && submenu) {
                if (isMobile) {
                    megaMenu.classList.remove('active');
                } else {
                    submenu.classList.remove('active');
                }
                icon.classList.remove('xhostmenu-icon-rotate');
            }
        });
    });

    // ===== FOOTER JS =====
    const footerSections = document.querySelectorAll('.xhosttrfooter-section');

    function toggleFooterSection(section) {
        const button = section.querySelector('button');
        const nav = section.querySelector('nav');
        if (!button || !nav) return;
        
        const expanded = button.getAttribute('aria-expanded') === 'true';
        
        button.setAttribute('aria-expanded', !expanded);
        if (expanded) {
            nav.style.maxHeight = '0';
            setTimeout(() => {
                nav.classList.add('hidden');
            }, 300);
        } else {
            nav.classList.remove('hidden');
            nav.style.maxHeight = nav.scrollHeight + 'px';
        }
        
        const icon = button.querySelector('svg');
        if (icon) {
            icon.style.transform = expanded ? 'rotate(0deg)' : 'rotate(180deg)';
        }
    }

    function handleFooterResize() {
        const isMobile = window.innerWidth < 1024; // lg breakpoint
        footerSections.forEach(section => {
            const button = section.querySelector('button');
            const nav = section.querySelector('nav');
            if (!button || !nav) return;
            
            if (isMobile) {
                // Önce eski event listener'ı kaldır
                button.removeEventListener('click', footerClickHandler);
                // Yeni event listener ekle
                button.addEventListener('click', footerClickHandler);
                
                nav.classList.add('hidden');
                nav.style.maxHeight = '0';
                button.setAttribute('aria-expanded', 'false');
            } else {
                // Event listener'ı kaldır
                button.removeEventListener('click', footerClickHandler);
                
                nav.classList.remove('hidden');
                nav.style.maxHeight = 'none';
                button.setAttribute('aria-expanded', 'true');
            }
        });
    }

    // Footer için click handler
    function footerClickHandler() {
        const section = this.closest('.xhosttrfooter-section');
        if (section) {
            toggleFooterSection(section);
        }
    }

    if (footerSections.length > 0) {
        handleFooterResize();
        window.addEventListener('resize', handleFooterResize);
    }

    // ===== HOSTING PAKETLERI TABLO JS =====
    // Açılır-kapanır bölümler için işlevsellik
    document.querySelectorAll('.section-header').forEach(item => {
        item.addEventListener('click', event => {
            item.classList.toggle('active');

            const content = item.nextElementSibling;
            if (content && content.classList.contains('hosting-features')) {
                // Animasyon sınıflarını ekle/kaldır
                if (content.classList.contains('hidden')) {
                    content.classList.remove('hidden');
                    content.classList.remove('hide');
                    content.classList.add('show');
                } else {
                    content.classList.add('hide');
                    content.classList.remove('show');
                    // Animasyon tamamlandıktan sonra hidden sınıfını ekle
                    setTimeout(() => {
                        content.classList.add('hidden');
                    }, 300); // Animasyon süresi ile aynı
                }
                
                // İkon rotasyonunu ayarla
                const icon = item.querySelector('.icon');
                if (icon) {
                    icon.style.transform = content.classList.contains('hidden') ? 'rotate(0deg)' : 'rotate(90deg)';
                }
            }
        });
    });

    // Özellik açıklamaları için işlevsellik
    document.querySelectorAll('.feature-name').forEach(item => {
        item.addEventListener('click', event => {
            // Aktif sınıfını ekle/kaldır
            item.classList.toggle('active');

            // ARIA durumunu güncelle
            const expanded = item.getAttribute('aria-expanded') === 'true' || false;
            item.setAttribute('aria-expanded', !expanded);

            // İlgili açıklama satırını bul ve göster/gizle
            const featureRow = item.closest('.feature-row');
            if (featureRow) {
                const featureId = featureRow.getAttribute('data-feature');
                const descRow = document.getElementById(featureId + '-desc');

                if (descRow) {
                    descRow.classList.toggle('active');
                }
            }
        });

        // Klavye erişilebilirliği için
        item.addEventListener('keydown', event => {
            if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                item.click();
            }
        });
    });

    // Debounce fonksiyonu - performans için
    function debounce(func, wait) {
        let timeout;
        return function() {
            const context = this, args = arguments;
            clearTimeout(timeout);
            timeout = setTimeout(() => {
                func.apply(context, args);
            }, wait);
        };
    }

    // Fiyat tablosu ve özellik tablosu sütun genişliklerini eşitle
    function equalizeColumnWidths() {
        // Tablo sütun genişliklerini eşitle
        const pricingTable = document.getElementById('pricing-table');
        const featuresTable = document.getElementById('features-table');

        if (pricingTable && featuresTable) {
            // Mobil görünüm kontrolü
            const isMobile = window.innerWidth < 768;

            if (isMobile) {
                // Mobil görünümde tablo genişliklerini sıfırla
                document.documentElement.style.setProperty('--feature-col-width', '0px');
                
                // Mobil görünümde tabloları tam genişlikte göster
                pricingTable.style.width = '100%';
                pricingTable.style.marginLeft = '0';
                
                const pricingTableContainer = document.querySelector('.pricing-table-container');
                if (pricingTableContainer) {
                    pricingTableContainer.style.width = '100%';
                    pricingTableContainer.style.marginLeft = '0';
                }
                
                return;
            }

            // Masaüstü görünüm için normal hizalama
            // Özellik tablosundaki sütun genişliklerini al
            const featureCol = document.getElementById('feature-col');
            const featureColWidth = featureCol ? featureCol.getBoundingClientRect().width : 200;

            // CSS değişkenini güncelle
            document.documentElement.style.setProperty('--feature-col-width', featureColWidth + 'px');

            // Özellik tablosundaki paket sütunlarının genişliklerini al
            const featureColWidths = [];
            for (let i = 1; i <= 4; i++) {
                const featureCol = document.getElementById('feature-col-' + i);
                if (featureCol) {
                    const width = featureCol.getBoundingClientRect().width;
                    featureColWidths.push(width);
                }
            }

            // Fiyat tablosundaki sütunları ayarla
            for (let i = 0; i < 4; i++) {
                const pricingCol = document.getElementById('col-' + (i+1));
                if (pricingCol && featureColWidths[i]) {
                    pricingCol.style.width = featureColWidths[i] + 'px';
                }
            }

            // Fiyat tablosunun toplam genişliğini ayarla
            const totalWidth = featuresTable.getBoundingClientRect().width;
            pricingTable.style.width = (totalWidth - featureColWidth) + 'px';

            // Pricing table container genişliğini ayarla
            const pricingTableContainer = document.querySelector('.pricing-table-container');
            if (pricingTableContainer) {
                pricingTableContainer.style.width = (totalWidth - featureColWidth) + 'px';
                pricingTableContainer.style.marginLeft = featureColWidth + 'px';
            }

            // Tablo çizgilerinin tam hizalanması için ek ayarlamalar
            const pricingCells = pricingTable.querySelectorAll('td');
            const featureCells = featuresTable.querySelectorAll('td:not(:first-child)');

            // Tüm hücrelerin padding değerlerini eşitle
            pricingCells.forEach(cell => {
                cell.style.padding = '12px 16px';
            });

            featureCells.forEach(cell => {
                cell.style.padding = '12px 16px';
            });
        }
    }

    // Sayfa yüklendiğinde ve pencere boyutu değiştiğinde sütun genişliklerini eşitle
    const pricingTable = document.getElementById('pricing-table');
    const featuresTable = document.getElementById('features-table');
    if (pricingTable && featuresTable) {
        window.addEventListener('load', equalizeColumnWidths);
        window.addEventListener('resize', debounce(equalizeColumnWidths, 150));
    }

    // Dokunmatik cihazlar için ek işlevsellik
    if ('ontouchstart' in window) {
        document.querySelectorAll('.feature-name').forEach(item => {
            item.addEventListener('touchstart', function() {
                this.classList.add('touch-active');
            }, {passive: true});

            item.addEventListener('touchend', function() {
                this.classList.remove('touch-active');
            }, {passive: true});
        });
    }

    // Tüm butonlara ripple efekti ekle
    document.querySelectorAll('.btn').forEach(button => {
        button.addEventListener('click', function(e) {
            const rect = button.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const ripple = document.createElement('span');
            ripple.style.left = `${x}px`;
            ripple.style.top = `${y}px`;
            ripple.className = 'ripple';
            
            button.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });

    // Mobil cihazlarda tablo görünümünü iyileştir
    if (window.innerWidth < 768) {
        // Mobil cihazlarda tablo hizalamasını düzelt
        if (pricingTable) {
            pricingTable.style.width = '100%';
            pricingTable.style.marginLeft = '0';
        }

        const pricingTableContainer = document.querySelector('.pricing-table-container');
        if (pricingTableContainer) {
            pricingTableContainer.style.width = '100%';
            pricingTableContainer.style.marginLeft = '0';
        }

        // Mobil cihazlarda kaydırma göstergesini görünür yap
        const mobileScrollIndicator = document.querySelector('.mobile-scroll-indicator');
        if (mobileScrollIndicator) {
            mobileScrollIndicator.style.display = 'flex';
        }
    }

    // Sayfa yüklendiğinde animasyon için sınıf ekle
    const bgWhite = document.querySelector('.bg-white');
    if (bgWhite) {
        bgWhite.classList.add('loaded');
    }

    // Intersection Observer API ile lazy loading benzeri davranış
    if ('IntersectionObserver' in window) {
        const options = {
            root: null,
            rootMargin: '0px',
            threshold: 0.1
        };

        const observer = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('in-view');
                    observer.unobserve(entry.target);
                }
            });
        }, options);

        document.querySelectorAll('.feature-row').forEach(row => {
            observer.observe(row);
        });
    }

    // Mobil cihazlarda kaydırma işlevselliğini iyileştir
    if ('scrollBehavior' in document.documentElement.style) {
        // Smooth scroll desteği varsa
        document.querySelectorAll('.table-container').forEach(container => {
            container.style.scrollBehavior = 'smooth';
        });
    } else {
        // Smooth scroll desteği yoksa polyfill ekle
        document.querySelectorAll('.table-container').forEach(container => {
            container.addEventListener('scroll', function() {
                // Kaydırma göstergesini gizle/göster
                const mobileScrollIndicator = document.querySelector('.mobile-scroll-indicator');
                if (mobileScrollIndicator) {
                    if (this.scrollLeft > 0) {
                        mobileScrollIndicator.style.opacity = '0.5';
                    } else {
                        mobileScrollIndicator.style.opacity = '1';
                    }
                }
            });
        });
    }
    
    /** Hosting Sayfası Premium Hosting Hizmetleri Başlangıç **/
    // Ekran boyutu değiştiğinde kartların yüksekliklerini eşitleme
    function equalizeCardHeights() {
        const cards = document.querySelectorAll('.rsphizmet-feature-card');
        if (cards.length === 0) return;
        
        let maxHeight = 0;
        
        // Önce tüm kartların yüksekliklerini sıfırla
        cards.forEach(card => {
            card.style.height = 'auto';
        });
        
        // En yüksek kartı bul
        cards.forEach(card => {
            if (card.offsetHeight > maxHeight) {
                maxHeight = card.offsetHeight;
            }
        });
        
        // Tüm kartları aynı yüksekliğe ayarla
        if (window.innerWidth >= 768) { // Sadece tablet ve üstü ekranlarda uygula
            cards.forEach(card => {
                card.style.height = maxHeight + 'px';
            });
        }
    }
    
    // Sayfa yüklendiğinde ve ekran boyutu değiştiğinde çalıştır
    if (document.querySelectorAll('.rsphizmet-feature-card').length > 0) {
        window.addEventListener('load', equalizeCardHeights);
        window.addEventListener('resize', debounce(equalizeCardHeights, 150));
    }
    /** Hosting Sayfası Premium Hosting Hizmetleri Bitiş **/
    
    /** Hosting Slider V2 Başlangıç **/
    // Copy functionality
    const copyButton = document.getElementById('copyButton');
    const promoCode = document.getElementById('promoCode');
    const copyNotificationOverlay = document.getElementById('copyNotificationOverlay');
    
    if (copyButton && promoCode && copyNotificationOverlay) {
        copyButton.addEventListener('click', function() {
            // Create a temporary textarea element to copy text
            const tempTextArea = document.createElement('textarea');
            tempTextArea.value = promoCode.textContent;
            document.body.appendChild(tempTextArea);
            
            // Select and copy the text
            tempTextArea.select();
            document.execCommand('copy');
            
            // Remove the temporary element
            document.body.removeChild(tempTextArea);
            
            // Show success notification overlay
            copyNotificationOverlay.classList.add('show');
            
            // Hide success notification after 1.5 seconds
            setTimeout(function() {
                copyNotificationOverlay.classList.remove('show');
            }, 1500);
        });
    }
    
    // Countdown Timer functionality
    const daysElement = document.getElementById('days');
    const hoursElement = document.getElementById('hours');
    const minutesElement = document.getElementById('minutes');
    const secondsElement = document.getElementById('seconds');
    const datePickerContainer = document.getElementById('datePickerContainer');
    const endDatePicker = document.getElementById('endDatePicker');
    const setDateButton = document.getElementById('setDateButton');
    const countdownTimer = document.getElementById('countdownTimer');
    const countdownExpired = document.getElementById('countdownExpired');
    
    // Check if countdown elements exist
    if (daysElement && hoursElement && minutesElement && secondsElement && 
        datePickerContainer && endDatePicker && setDateButton && 
        countdownTimer && countdownExpired) {
        
        // Get end date from localStorage or set default
        let endDate;
        const savedEndDate = localStorage.getItem('reshostpEndDate');
        
        if (savedEndDate) {
            // Use the saved end date
            endDate = new Date(parseInt(savedEndDate));
            
            // If the saved date is invalid or in the past, set a new default
            if (isNaN(endDate) || endDate <= new Date()) {
                setDefaultEndDate();
            }
        } else {
            // No saved date, set default
            setDefaultEndDate();
        }
        
        // Function to set default end date (7 days from now)
        function setDefaultEndDate() {
            endDate = new Date();
            endDate.setDate(endDate.getDate() + 7);
            // Save to localStorage
            localStorage.setItem('reshostpEndDate', endDate.getTime());
        }
        
        // Format for datetime-local input
        const formatDateForInput = (date) => {
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');
            const hours = String(date.getHours()).padStart(2, '0');
            const minutes = String(date.getMinutes()).padStart(2, '0');
            
            return `${year}-${month}-${day}T${hours}:${minutes}`;
        };
        
        // Set value for date picker
        endDatePicker.value = formatDateForInput(endDate);
        
        // Update countdown timer
        function updateCountdown() {
            const now = new Date().getTime();
            const timeLeft = endDate.getTime() - now;
            
            if (timeLeft <= 0) {
                // Countdown finished
                daysElement.textContent = '00';
                hoursElement.textContent = '00';
                minutesElement.textContent = '00';
                secondsElement.textContent = '00';
                
                // Show expired message
                countdownTimer.style.display = 'none';
                countdownExpired.classList.add('show');
                return;
            }
            
            // Hide expired message and show countdown
            countdownTimer.style.display = 'flex';
            countdownExpired.classList.remove('show');
            
            // Calculate time units
            const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
            const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);
            
            // Update DOM elements
            daysElement.textContent = String(days).padStart(2, '0');
            hoursElement.textContent = String(hours).padStart(2, '0');
            minutesElement.textContent = String(minutes).padStart(2, '0');
            secondsElement.textContent = String(seconds).padStart(2, '0');
        }
        
        // Set date button click handler
        setDateButton.addEventListener('click', function() {
            const selectedDate = new Date(endDatePicker.value);
            if (!isNaN(selectedDate) && selectedDate > new Date()) {
                endDate = selectedDate;
                updateCountdown();
                datePickerContainer.classList.remove('show');
                
                // Save to localStorage
                localStorage.setItem('reshostpEndDate', endDate.getTime());
            } else {
                alert('Lütfen geçerli bir gelecek tarih seçin!');
            }
        });
        
        // Show date picker with keyboard shortcut (Ctrl+Shift+D)
        document.addEventListener('keydown', function(e) {
            if (e.ctrlKey && e.shiftKey && e.key === 'D') {
                datePickerContainer.classList.toggle('show');
                e.preventDefault();
            }
        });
        
        // Update countdown every second
        updateCountdown();
        setInterval(updateCountdown, 1000);
    }
    /** Hosting Slider V2 Bitiş **/
    
    /** xHost Sıkca Sorulan Sorular Başlangıç **/
    const faqItems = document.querySelectorAll('.xhostsss-faq-item');
    
    if (faqItems.length > 0) {
        faqItems.forEach(item => {
            const header = item.querySelector('.cursor-pointer');
            
            if (header) {
                header.addEventListener('click', () => {
                    // Toggle active class on the clicked item
                    const isActive = item.classList.contains('active');
                    
                    // Close all items first
                    faqItems.forEach(otherItem => {
                        if (otherItem !== item && otherItem.classList.contains('active')) {
                            otherItem.classList.remove('active');
                        }
                    });
                    
                    // Toggle the clicked item
                    item.classList.toggle('active');
                });
            }
        });
        
        // Mobil cihazlar için dokunma alanını genişlet
        if ('ontouchstart' in window) {
            const faqHeaders = document.querySelectorAll('.xhostsss-faq-item .cursor-pointer');
            faqHeaders.forEach(header => {
                header.style.padding = '0.75rem 0.5rem';
            });
        }
        
        // Check for URL hash to open specific FAQ item
        if (window.location.hash) {
            const id = window.location.hash.substring(1);
            const targetItem = document.getElementById(id);
            if (targetItem && targetItem.classList.contains('xhostsss-faq-item')) {
                targetItem.classList.add('active');
                setTimeout(() => {
                    targetItem.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }, 100);
            }
        }
        
        // Add resize handler for xhosttronsive behavior
        window.addEventListener('resize', debounce(function() {
            const activeItems = document.querySelectorAll('.xhostsss-faq-item.active');
            activeItems.forEach(item => {
                const answer = item.querySelector('.xhostsss-faq-answer');
                if (answer) {
                    // Force recalculation of max-height on resize
                    answer.style.maxHeight = 'none';
                    answer.style.maxHeight = answer.scrollHeight + 'px';
                }
            });
        }, 150));
    }
    /** xHost Sıkca Sorulan Sorular Bitiş **/
});
/** XHOSTNET MAIN JS Bitiş **/