try{


$(document).ready(function(){

    $('#mobmenu_wrap .toggle').click(function(e)

    {

        var $this = $(this);



        if ($this.next().hasClass('show')) {

            $this.next().removeClass('show');

            $this.next().slideUp(350);

        } else {

            $this.parent().parent().find('li .inner').removeClass('show');

            $this.parent().parent().find('li .inner').slideUp(350);

            $this.next().toggleClass('show');

            $this.next().slideToggle(350);

        }

    });

});



function read_all_notifications(btn_el){

    var request = MioAjax({

        button_element:btn_el,

        waiting_text:'<i class="loadingicon fa fa-spinner" aria-hidden="true"></i> Lütfen bekleyiniz.',

        action: "https://my.sunucumweb.com/hesabim",

        method: "POST",

        data:{operation:"read_all_notifications"},

    },true,true);

    request.done(function(result){

        if(result){

            result = getJson(result);

            if(result !== "false"){

                if(result.status == "successful"){

                    $("#read_all_notifications").css("display","none");

                    $(".notification-item").not(".read").addClass("read");

                    $("#notification_bubble_count").css("display","none");

                    $("#notifications_count").html('0');

                }

            }else

                console.log(result);

        }

    });

}


}catch(e){console.warn('[transfer]',e)}
try{

    var disabled_style = "background:none; color:#333; cursor:no-drop; opacity:0.3;";
    var situations = [],loading_template;
    situations['unknown'] = 'Bilinmiyor.';
    situations['premium'] = 'Premium';
    situations['available'] = 'Müsait';
    situations['unavailable'] = 'Müsait Değil';
    var contact_button            = '<a href="https://my.sunucumweb.com/iletisim" class="incelebtn green" style="display: unset;">Bize Ulaşın</a>';
    var epp_code_support = {"world":false,"wtf":false,"ws":false,"cam":false,"camera":false,"camp":false,"capetown":false,"web.tr":false,"webcam":false,"website":false,"wedding":false,"wf":false,"wien":false,"wang":false,"watch":false,"watches":false,"works":false,"work":false,"wine":false,"win":false,"wiki":false,"wales":false,"voyage":false,"vu":false,"voto":false,"voting":false,"vote":false,"vodka":false,"vlaanderen":false,"vision":false,"vip":false,"vin":false,"villas":false,"video":false,"viajes":false,"vet":false,"vg":false,"versicherung":false,"ventures":false,"vegas":false,"vacations":false,"vc":false,"us.org":false,"us.com":false,"us":false,"uno":false,"uk.net":false,"university":false,"uk.com":false,"uk":false,"tw":false,"tv.tr":false,"tv":false,"tube":false,"travel":false,"trading":false,"training":false,"trade":false,"tr":false,"toys":false,"town":false,"tours":false,"top":false,"tools":false,"tokyo":false,"today":false,"to":false,"tm":false,"tl":false,"tirol":false,"tk":false,"tires":false,"tips":false,"tienda":false,"tickets":false,"theatre":false,"theater":false,"tf":false,"tennis":false,"tel":false,"tech":false,"technology":false,"team":false,"tc":false,"taxi":false,"tax":false,"tattoo":false,"taipei":false,"systems":false,"sydney":false,"sx":false,"surgery":false,"swiss":false,"surf":false,"support":false,"supplies":false,"supply":false,"sucks":false,"style":false,"su":false,"study":false,"studio":false,"stream":false,"store":false,"storage":false,"srl":false,"space":false,"soy":false,"spa":false,"solutions":false,"solar":false,"software":false,"soccer":false,"social":false,"so":false,"skin":false,"ski":false,"site":false,"singles":false,"show":false,"shopping":false,"shop":false,"shoes":false,"shiksha":false,"sg":false,"sh":false,"sexy":false,"sex":false,"services":false,"security":false,"se.net":false,"se":false,"scot":false,"science":false,"schule":false,"school.ge":false,"school":false,"sc":false,"sbs":false,"sb":false,"sarl":false,"salon":false,"sale":false,"saarland":false,"sa.com":false,"run":false,"ruhr":false,"ru.com":false,"ru":false,"rocks":false,"rodeo":false,"ro":false,"rip":false,"rich":false,"reviews":false,"review":false,"restaurant":false,"rest":false,"republican":false,"report":false,"repair":false,"rentals":false,"rent":false,"reit":false,"reisen":false,"reise":false,"rehab":false,"red":false,"recipes":false,"recht.pro":false,"realty":false,"re":false,"radio.fm":false,"radio.am":false,"racing":false,"quest":false,"quebec":false,"qpon":false,"qa":false,"pw":false,"pvt.ge":false,"pub":false,"pt":false,"ps":false,"protection":false,"property":false,"properties":false,"promo":false,"productions":false,"pro.tc":false,"pro.ec":false,"pro":false,"press":false,"pp.ru":false,"pol.tr":false,"porn":false,"poker":false,"pm":false,"plus":false,"plumbing":false,"place":false,"pl":false,"pizza":false,"pink":false,"pictures":false,"pics":false,"photos":false,"photography":false,"photo":false,"ph":false,"pet":false,"persiangulf":false,"pe":false,"party":false,"parts":false,"partners":false,"pars":false,"paris":false,"osaka":false,"organic":false,"org.za":false,"org.ve":false,"org.vc":false,"org.tr":false,"org.uk":false,"org.tc":false,"org.sc":false,"org.ru":false,"org.ps":false,"org.lc":false,"org.je":false,"org.in":false,"org.ge":false,"org.dm":false,"org.cn":false,"org.au":false,"org.bh":false,"org.ag":false,"org":false,"or.at":false,"opr":false,"ooo":false,"online":false,"onl":false,"ong":false,"okinawa":false,"one":false,"observer":false,"nz":false,"nyc":false,"nu":false,"nowruz":false,"nom.ro":false,"nom.pe":false,"nom.es":false,"nom.co":false,"nom.ag":false,"no":false,"ninja":false,"nl":false,"ngo":false,"nf":false,"news":false,"network":false,"net.za":false,"net.ve":false,"net.vc":false,"net.tr":false,"net.tc":false,"net.so":false,"net.sc":false,"net.sb":false,"net.ru":false,"net.ps":false,"net.pl":false,"net.ph":false,"net.pe":false,"net.nz":false,"net.mu":false,"net.my":false,"net.mg":false,"net.lc":false,"net.ki":false,"net.je":false,"net.in":false,"net.ht":false,"net.im":false,"net.hn":false,"net.gl":false,"net.gy":false,"net.gg":false,"net.ge":false,"net.ec":false,"net.dm":false,"net.cn":false,"net.co":false,"net.cm":false,"net.bz":false,"net.bh":false,"net.au":false,"net.am":false,"net.ag":false,"net":false,"navy":false,"name.tr":false,"name.bh":false,"name":false,"my":false,"nagoya":false,"mx":false,"mw":false,"ms":false,"mu":false,"movie":false,"motorcycles":false,"mortgage":false,"money":false,"monster":false,"mom":false,"moe":false,"moda":false,"mobi":false,"mn":false,"miami":false,"mg":false,"menu":false,"mex.com":false,"men":false,"memorial":false,"media":false,"melbourne":false,"med.pro":false,"med.ec":false,"me.bh":false,"me.uk":false,"me":false,"md":false,"mba":false,"markets":false,"marketing":false,"market":false,"management":false,"makeup":false,"maison":false,"lv":false,"luxury":false,"lu":false,"ltda":false,"ltd":false,"lt":false,"love":false,"lotto":false,"london":false,"lol":false,"loans":false,"llc":false,"loan":false,"live":false,"link":false,"limo":false,"limited":false,"lighting":false,"li":false,"life":false,"lgbt":false,"legal":false,"lease":false,"lc":false,"lawyer":false,"law.pro":false,"law":false,"lat":false,"land":false,"la":false,"kyoto":false,"koeln":false,"kiwi.nz":false,"kiwi":false,"kitchen":false,"kim":false,"kep.tr":false,"k12.tr":false,"kaufen":false,"jur.pro":false,"juegos":false,"jpn.com":false,"jp.net":false,"joburg":false,"jp":false,"jobs":false,"jewelry":false,"jetzt":false,"je":false,"istanbul":false,"it":false,"ist":false,"islam":false,"is":false,"irish":false,"ir":false,"io":false,"investments":false,"international":false,"insure":false,"institute":false,"info.ve":false,"ink":false,"info.tr":false,"info.pl":false,"info.nf":false,"info.ki":false,"info.ht":false,"info.ec":false,"info.bh":false,"industries":false,"info":false,"ind.in":false,"inc":false,"in.net":false,"immobilien":false,"in":false,"immo":false,"im":false,"ie":false,"idv.tw":false,"id.au":false,"icu":false,"id":false,"hu.net":false,"hu":false,"how":false,"ht":false,"house":false,"hosting":false,"host":false,"hospital":false,"horse":false,"homes":false,"holiday":false,"hockey":false,"holdings":false,"hn":false,"hk":false,"hiv":false,"help":false,"hiphop":false,"healthcare":false,"health":false,"haus":false,"hamburg":false,"halal":false,"hair":false,"gy":false,"guru":false,"guitars":false,"guide":false,"gs":false,"group":false,"gripe":false,"green":false,"gratis":false,"graphics":false,"gr":false,"gr.com":false,"gov.tr":false,"golf":false,"gold":false,"gmbh":false,"global":false,"glass":false,"gl":false,"giving":false,"gives":false,"gift":false,"gifts":false,"gg":false,"gen.in":false,"gen.tr":false,"ge":false,"gd":false,"gb.net":false,"gay":false,"garden":false,"game":false,"games":false,"gallery":false,"fyi":false,"furniture":false,"futbol":false,"fund":false,"fun":false,"fr":false,"frl":false,"foundation":false,"forum":false,"forsale":false,"forex":false,"football":false,"fm":false,"fo":false,"flowers":false,"florist":false,"fitness":false,"flights":false,"fit":false,"fishing":false,"firm.in":false,"fish":false,"financial":false,"finance":false,"film":false,"fi":false,"fashion":false,"feedback":false,"farm":false,"fans":false,"fan":false,"family":false,"fail":false,"faith":false,"express":false,"exposed":false,"expert":false,"events":false,"exchange":false,"eu.com":false,"eu":false,"es":false,"estate":false,"equipment":false,"engineering":false,"enterprises":false,"engineer":false,"eng.pro":false,"energy":false,"email":false,"education":false,"edu.tr":false,"edu.ge":false,"edu.bh":false,"eco":false,"ebiz.tw":false,"ec":false,"earth":false,"dr.tr":false,"durban":false,"download":false,"domains":false,"dog":false,"doctor":false,"dm":false,"discount":false,"dk":false,"direct":false,"directory":false,"digital":false,"diet":false,"diamonds":false,"dev":false,"design":false,"desi":false,"dentist":false,"democrat":false,"dental":false,"delivery":false,"degree":false,"deals":false,"de.com":false,"de":false,"dating":false,"date":false,"cz":false,"dance":false,"cyou":false,"cymru":false,"cx":false,"cruises":false,"creditcard":false,"cricket":false,"credit":false,"cpa.pro":false,"courses":false,"coupons":false,"coop":false,"country":false,"cool":false,"cooking":false,"contact":false,"contractors":false,"consulting":false,"construction":false,"computer":false,"condos":false,"company":false,"community":false,"com.vc":false,"com.ve":false,"com.tw":false,"com.tr":false,"com.tc":false,"com.so":false,"com.sg":false,"com.se":false,"com.sc":false,"com.ru":false,"com.sb":false,"com.ro":false,"com.pt":false,"com.ps":false,"com.pl":false,"com.ph":false,"com.pe":false,"com.my":false,"com.mx":false,"com.mu":false,"com.ms":false,"com.mg":false,"com.lv":false,"com.lc":false,"com.im":false,"com.ht":false,"com.hn":false,"com.hk":false,"com.gy":false,"com.gr":false,"com.gl":false,"com.es":false,"com.ge":false,"com.ec":false,"com.dm":false,"com.de":false,"com.co":false,"com.cm":false,"com.cn":false,"com.bz":false,"com.au":false,"com.bh":false,"com.ar":false,"com.am":false,"com.ag":false,"cologne":false,"com":false,"college":false,"coffee":false,"codes":false,"coach":false,"co.za":false,"co.uk":false,"co.ve":false,"co.nz":false,"co.no":false,"co.nl":false,"co.mu":false,"co.lc":false,"co.it":false,"co.in":false,"co.gy":false,"co.dm":false,"co.com":false,"co.cm":false,"co.bz":false,"co.bh":false,"co.at":false,"co.am":false,"co":false,"co.ag":false,"cn.com":false,"cn":false,"club":false,"cm":false,"cloud":false,"clothing":false,"clinic":false,"click":false,"cleaning":false,"claims":false,"cl":false,"city":false,"church":false,"christmas":false,"cheap":false,"charity":false,"chat":false,"ch":false,"cfd":false,"center":false,"ceo":false,"cc.bh":false,"catering":false,"cc":false,"cat":false,"casino":false,"casa":false,"cash":false,"cars":false,"careers":false,"care":false,"cards":false,"capital":false,"car":false,"cafe":false,"cab":false,"ca":false,"bz":false,"buzz":false,"business":false,"builders":false,"build":false,"brussels":false,"broker":false,"br.com":false,"boutique":false,"boston":false,"bond":false,"boats":false,"blue":false,"blog":false,"blackfriday":false,"black":false,"biz.tr":false,"biz.pl":false,"biz.ki":false,"biz.bh":false,"biz":false,"bio":false,"bingo":false,"bike":false,"bid":false,"bible":false,"bh":false,"bet":false,"berlin":false,"bel.tr":false,"beer":false,"beauty":false,"be":false,"bbs.tr":false,"bayern":false,"bargains":false,"bar.pro":false,"bar":false,"bank":false,"band":false,"baby":false,"avocat.pro":false,"av.tr":false,"autos":false,"auto":false,"audio":false,"auction":false,"au":false,"attorney":false,"at":false,"associates":false,"asia":false,"as":false,"art":false,"army":false,"archi":false,"app":false,"apartments":false,"amsterdam":false,"am":false,"airforce":false,"ai":false,"agency":false,"ag":false,"africa":false,"aero":false,"ae.org":false,"ae":false,"adult":false,"actor":false,"acct.pro":false,"accountants":false,"accountant":false,"academy":false,"aca.pro":false,"ac.nz":false,"ac.mu":false,"ac":false,"abogado":false,"aaa.pro":false,"xxx":false,"xyz":false,"yachts":false,"yoga":false,"yokohama":false,"yt":false,"za.com":false,"zone":false,"орг":false,"البحرين":false,"فلسطين":false,"संगठन":false,"机构":false,"africa.com":false,"best":false,"com.br":false,"com.ng":false,"diy":false,"edu.pl":false,"food":false,"lifestyle":false,"living":false,"luxe":false,"music":false,"net.ng":false,"ng":false,"nrw":false,"org.ng":false,"si":false,"af":false,"com.af":false,"net.af":false,"org.af":false,"com.nf":false,"net.nf":false,"org.tw":false,"org.hn":false,"plc.co.im":false,"net.lv":false,"org.lv":false,"no.com":false,"ar.com":false,"qc.com":false,"gb.com":false,"kr.com":false,"se.com":false,"uy.com":false,"hu.com":false,"tel.tr":false,"career":false,"rurniture":false,".at":false,"jm":false,".city":false,"рф":false,"com.ua":false,"med.bh":false,"cv":false,"org.ms":false,"select":false,"compare":false,"com.ai":false,"co.id":false,"mk":false,"com.mk":false};
    var tlds             = ["world","wtf","ws","cam","camera","camp","capetown","web.tr","webcam","website","wedding","wf","wien","wang","watch","watches","works","work","wine","win","wiki","wales","voyage","vu","voto","voting","vote","vodka","vlaanderen","vision","vip","vin","villas","video","viajes","vet","vg","versicherung","ventures","vegas","vacations","vc","us.org","us.com","us","uno","uk.net","university","uk.com","uk","tw","tv.tr","tv","tube","travel","trading","training","trade","tr","toys","town","tours","top","tools","tokyo","today","to","tm","tl","tirol","tk","tires","tips","tienda","tickets","theatre","theater","tf","tennis","tel","tech","technology","team","tc","taxi","tax","tattoo","taipei","systems","sydney","sx","surgery","swiss","surf","support","supplies","supply","sucks","style","su","study","studio","stream","store","storage","srl","space","soy","spa","solutions","solar","software","soccer","social","so","skin","ski","site","singles","show","shopping","shop","shoes","shiksha","sg","sh","sexy","sex","services","security","se.net","se","scot","science","schule","school.ge","school","sc","sbs","sb","sarl","salon","sale","saarland","sa.com","run","ruhr","ru.com","ru","rocks","rodeo","ro","rip","rich","reviews","review","restaurant","rest","republican","report","repair","rentals","rent","reit","reisen","reise","rehab","red","recipes","recht.pro","realty","re","radio.fm","radio.am","racing","quest","quebec","qpon","qa","pw","pvt.ge","pub","pt","ps","protection","property","properties","promo","productions","pro.tc","pro.ec","pro","press","pp.ru","pol.tr","porn","poker","pm","plus","plumbing","place","pl","pizza","pink","pictures","pics","photos","photography","photo","ph","pet","persiangulf","pe","party","parts","partners","pars","paris","osaka","organic","org.za","org.ve","org.vc","org.tr","org.uk","org.tc","org.sc","org.ru","org.ps","org.lc","org.je","org.in","org.ge","org.dm","org.cn","org.au","org.bh","org.ag","org","or.at","opr","ooo","online","onl","ong","okinawa","one","observer","nz","nyc","nu","nowruz","nom.ro","nom.pe","nom.es","nom.co","nom.ag","no","ninja","nl","ngo","nf","news","network","net.za","net.ve","net.vc","net.tr","net.tc","net.so","net.sc","net.sb","net.ru","net.ps","net.pl","net.ph","net.pe","net.nz","net.mu","net.my","net.mg","net.lc","net.ki","net.je","net.in","net.ht","net.im","net.hn","net.gl","net.gy","net.gg","net.ge","net.ec","net.dm","net.cn","net.co","net.cm","net.bz","net.bh","net.au","net.am","net.ag","net","navy","name.tr","name.bh","name","my","nagoya","mx","mw","ms","mu","movie","motorcycles","mortgage","money","monster","mom","moe","moda","mobi","mn","miami","mg","menu","mex.com","men","memorial","media","melbourne","med.pro","med.ec","me.bh","me.uk","me","md","mba","markets","marketing","market","management","makeup","maison","lv","luxury","lu","ltda","ltd","lt","love","lotto","london","lol","loans","llc","loan","live","link","limo","limited","lighting","li","life","lgbt","legal","lease","lc","lawyer","law.pro","law","lat","land","la","kyoto","koeln","kiwi.nz","kiwi","kitchen","kim","kep.tr","k12.tr","kaufen","jur.pro","juegos","jpn.com","jp.net","joburg","jp","jobs","jewelry","jetzt","je","istanbul","it","ist","islam","is","irish","ir","io","investments","international","insure","institute","info.ve","ink","info.tr","info.pl","info.nf","info.ki","info.ht","info.ec","info.bh","industries","info","ind.in","inc","in.net","immobilien","in","immo","im","ie","idv.tw","id.au","icu","id","hu.net","hu","how","ht","house","hosting","host","hospital","horse","homes","holiday","hockey","holdings","hn","hk","hiv","help","hiphop","healthcare","health","haus","hamburg","halal","hair","gy","guru","guitars","guide","gs","group","gripe","green","gratis","graphics","gr","gr.com","gov.tr","golf","gold","gmbh","global","glass","gl","giving","gives","gift","gifts","gg","gen.in","gen.tr","ge","gd","gb.net","gay","garden","game","games","gallery","fyi","furniture","futbol","fund","fun","fr","frl","foundation","forum","forsale","forex","football","fm","fo","flowers","florist","fitness","flights","fit","fishing","firm.in","fish","financial","finance","film","fi","fashion","feedback","farm","fans","fan","family","fail","faith","express","exposed","expert","events","exchange","eu.com","eu","es","estate","equipment","engineering","enterprises","engineer","eng.pro","energy","email","education","edu.tr","edu.ge","edu.bh","eco","ebiz.tw","ec","earth","dr.tr","durban","download","domains","dog","doctor","dm","discount","dk","direct","directory","digital","diet","diamonds","dev","design","desi","dentist","democrat","dental","delivery","degree","deals","de.com","de","dating","date","cz","dance","cyou","cymru","cx","cruises","creditcard","cricket","credit","cpa.pro","courses","coupons","coop","country","cool","cooking","contact","contractors","consulting","construction","computer","condos","company","community","com.vc","com.ve","com.tw","com.tr","com.tc","com.so","com.sg","com.se","com.sc","com.ru","com.sb","com.ro","com.pt","com.ps","com.pl","com.ph","com.pe","com.my","com.mx","com.mu","com.ms","com.mg","com.lv","com.lc","com.im","com.ht","com.hn","com.hk","com.gy","com.gr","com.gl","com.es","com.ge","com.ec","com.dm","com.de","com.co","com.cm","com.cn","com.bz","com.au","com.bh","com.ar","com.am","com.ag","cologne","com","college","coffee","codes","coach","co.za","co.uk","co.ve","co.nz","co.no","co.nl","co.mu","co.lc","co.it","co.in","co.gy","co.dm","co.com","co.cm","co.bz","co.bh","co.at","co.am","co","co.ag","cn.com","cn","club","cm","cloud","clothing","clinic","click","cleaning","claims","cl","city","church","christmas","cheap","charity","chat","ch","cfd","center","ceo","cc.bh","catering","cc","cat","casino","casa","cash","cars","careers","care","cards","capital","car","cafe","cab","ca","bz","buzz","business","builders","build","brussels","broker","br.com","boutique","boston","bond","boats","blue","blog","blackfriday","black","biz.tr","biz.pl","biz.ki","biz.bh","biz","bio","bingo","bike","bid","bible","bh","bet","berlin","bel.tr","beer","beauty","be","bbs.tr","bayern","bargains","bar.pro","bar","bank","band","baby","avocat.pro","av.tr","autos","auto","audio","auction","au","attorney","at","associates","asia","as","art","army","archi","app","apartments","amsterdam","am","airforce","ai","agency","ag","africa","aero","ae.org","ae","adult","actor","acct.pro","accountants","accountant","academy","aca.pro","ac.nz","ac.mu","ac","abogado","aaa.pro","xxx","xyz","yachts","yoga","yokohama","yt","za.com","zone","орг","البحرين","فلسطين","संगठन","机构","africa.com","best","com.br","com.ng","diy","edu.pl","food","lifestyle","living","luxe","music","net.ng","ng","nrw","org.ng","si","af","com.af","net.af","org.af","com.nf","net.nf","org.tw","org.hn","plc.co.im","net.lv","org.lv","no.com","ar.com","qc.com","gb.com","kr.com","se.com","uy.com","hu.com","tel.tr","career","rurniture",".at","jm",".city","рф","com.ua","med.bh","cv","org.ms","select","compare","com.ai","co.id","mk","com.mk"];
    var xbtn             = false;
    var xbtn_be          = false;

    var psl_script = document.createElement('script');
    psl_script.src = "assets/_external/my.sunucumweb.com/resources/assets/plugins/psl/psl.min.js";
    document.head.appendChild(psl_script);


    $(document).ready(function(){
        loading_template = $("#loading-template").html();

        var gDomain     = gGET("domain");
        var gTransfer   = gGET("transfer");

        if(gDomain != null && gDomain != '' && gDomain != undefined){
            $("#domainInput").val(gDomain);

            if(gTransfer != null && gTransfer != '' && gTransfer !== undefined)
            {
                $(".transfercode").slideToggle();
                $(".transfercode input").focus();
            }
            else {
                let button = document.getElementById("checkButton");
                let gCaptchaInput = document.getElementById("grecaptcha-hidden-input-1");

                if(gCaptchaInput) {
                    let captchaInterval = setInterval(() => {
                        if(gCaptchaInput.value.length > 0) {
                            checkButton(button);
                            clearInterval(captchaInterval);
                        }
                    },100);
                }
                else
                    checkButton(button);
            }
        }

        $("#transferbtn").click(function(){
            var  btn = $(this);

            var domainInput = $("#domainInput").val();

            if(domainInput != '')
            {
                $(".transfercode input").val('');

                var epp_code_st = true;

                var parsed = psl.parse(domainInput);

                if(tlds.includes(parsed.tld))
                    epp_code_st = epp_code_support[parsed.tld];

                if(!epp_code_st)
                {
                    $(".transfercode").slideUp();

                    $(".transfercode input").val('N/A');

                    $("#transferButton").trigger("click");
                    xbtn    = btn;
                    xbtn_be = btn.html();

                    xbtn.html("Bekleyiniz...");

                    return false;
                }
            }
            $(".transfercode").slideToggle();

        });

        $("#checkButton").click(function(){
            checkButton(this);
        });

        $("#transferButton").click(function(){
            transferButton(this);
        });

        $("#OrderForm").on("change","input[type=checkbox]",function(){
            var count = $("#OrderForm input[type=checkbox]:checked").length;
            if(count>0)
                $("#ContinueButton").removeAttr("style");
            else
                $("#ContinueButton").attr("style",disabled_style);
        });

    });

    function transfer_handler(result){
        if(result != ''){
            var solve = getJson(result);
            if(solve !== false){
                if(solve.status == "error"){
                    if(solve.for != undefined && solve.for != ''){
                        $(solve.for).focus();
                        $(solve.for).attr("style","border-bottom:2px solid red; color:red;");
                        $(solve.for).change(function(){
                            $(this).removeAttr("style");
                        });
                    }
                    if(solve.message != undefined && solve.message != '')
                        alert_error(solve.message,{timer:5000});
                    if(xbtn) xbtn.html(xbtn_be);
                }else if(solve.status == "successful"){
                    if(solve.message != undefined) alert_success(solve.message,{timer:2000});
                    if(solve.redirect != undefined && solve.redirect != '')
                        window.location.href = solve.redirect;
                }
            }else
                console.log(result);
        }
    }

    function scrollDown(){
        $("html, body").animate({ scrollTop: $('.popuzantilar').offset().top + 20  },1000);
    }

    function scrollUp(){
        $("html, body").animate({ scrollTop: - ($('.popuzantilar').offset().top + 20)  },1000);
    }

    function get_spotlight_results(tld){
        if(tld != false) $(".lookcolumlist[data-name='"+tld+"']:not(#domainResult)").remove();

        $("#checkForm input[name=type]").val("spotlight");

        var request  = MioAjax({
            action:"https://my.sunucumweb.com/alan-adi",
            form:$("#checkForm"),
            method:"POST",
        },true,true);


        request.done(function(result){
            if(result != ''){
                var solve = getJson(result);
                if(solve !== false){
                    if(solve.status == "successful"){
                        if(solve.data != undefined && solve.data.length>0){
                            $(solve.data).each(function(key,item){

                                (function(i) {
                                    var t = setTimeout(function() {
                                        var price_to_year  = " - ";
                                        var select_content = " - ";
                                        if(item.status == "available"){
                                            select_content = '<input id="selected-'+key+'" class="checkbox-custom" name="select['+item.sld+'.'+item.tld+']" value="1" type="checkbox" onchange="if($(\'#LookupList input[type=checkbox]:not(:checked)\').length>0) $(\'#selectAll\').prop(\'checked\',false); else $(\'#selectAll\').prop(\'checked\',true);">' +
                                                '<label for="selected-'+key+'" style="border-radius:0px;" class="checkbox-custom-label"></label>';
                                            if(item.premium !== undefined && item.premium) select_content = contact_button;


                                            if(item.reg_price != undefined && item.reg_price.length>0){
                                                price_to_year = "";
                                                price_to_year += '<select id="tesclsure" name="period['+item.sld+'.'+item.tld+']">';
                                                $(item.reg_price).each(function(k,r){
                                                    price_to_year += '<option value="'+r.year+'">'+r.price+' ('+r.year+' Yıl)</option>';
                                                });
                                                price_to_year += '</select>';
                                            }
                                        }
                                        else
                                        {
                                            select_content = '<a href="javascript:void 0;" onclick="transferModal(\''+item.domain+'\',this)" class="lbtn transfer-btn">TRANSFER</a> <a href="javascript:void 0;" onclick="openWhois(\''+item.domain+'\');" class="lbtn whois-btn">WHOIS</a> ';
                                        }

                                        $(".lookcolumlist[data-name='"+item.tld+"'] .tld-name").addClass("tldhere").html('<strong>'+item.sld+'.'+item.tld+'</strong>');
                                        $(".lookcolumlist[data-name='"+item.tld+"'] .tld-status").fadeOut(300,function(){
                                            if(item.premium !== undefined && item.premium)
                                                $(this).attr("id","tldok").html(situations['premium']);
                                            else if(item.status == "available")
                                                $(this).attr("id","tldok").html(situations[item.status]);
                                            else
                                                $(this).attr("id","tldno").html(situations[item.status]);

                                            $(this).fadeIn(300);
                                        });

                                        $(".lookcolumlist[data-name='"+item.tld+"'] .tld-prices").fadeOut(300,function(){
                                            $(this)
                                                .html(price_to_year)
                                                .fadeIn(300);
                                        });
                                        $(".lookcolumlist[data-name='"+item.tld+"'] .tld-select").fadeOut(function(){
                                            $(this).html(select_content).fadeIn(300);
                                        });
                                    }, 200 * i);
                                })(key);


                            });
                        }
                    }
                }else
                    console.log(result);
            }
        });
    }

    function checkButton(elem){

        var button = $(elem);

        if(button.attr("data-pending") == "true") return false;
        button.attr("data-pending","true");

        var domain = $("#domainInput").val();
        $("#checkForm input[name=domain]").val(domain);
        $("#checkForm input[name=tcode]").val('');

        if(domain != ''){
            scrollDown();
            $("#LookupResults").css("display","block");
            $("#showTLDStatusLoader").css("display","block");
            $("#OrderForm").fadeIn(300);

            $("#LookupList .lookcolumlist:not(#domainResult)").remove();
            var count = $(".spotlight-tlds").length,content;
            if(count>0){
                count -=1;
                for(var i=0;i<=count;i++){
                    var name  = $(".spotlight-tlds:eq("+i+")").data("name");
                    content = '<div class="lookcolumlist" data-name="'+name+'">';
                    content += '<div class="lookcolum tld-name">'+loading_template+'</div>';
                    content += '<div class="lookcolum tld-status">'+loading_template+'</div>';
                    content += '<div class="lookcolum tld-prices">'+loading_template+'</div>';
                    content += '<div class="lookcolum tld-select"> - </div>';
                    content += '</div>';
                    $("#LookupList").append(content);
                }
            }

        }

        
        $("#checkForm input[name=type]").val("domain");

        $("#selectAll").prop('checked',false);
        $("#transfercode").slideUp(200);
        $("#ContinueButton").attr("style",disabled_style);
        $("#showTLDStatusUnavailable").css("display","none");
        $("#showTLDStatusAvailable").css("display","none");


        $("#domainResult").removeAttr("data-name");
        $("#domainResult .tld-name").removeClass("tldhere").html(loading_template);
        $("#domainResult .tld-status").removeAttr("id").html(loading_template);
        $("#domainResult .tld-prices").html(loading_template);
        $("#domainResult .tld-select").html(" - ");


        var request  = MioAjax({
            action:"https://my.sunucumweb.com/alan-adi",
            form:$("#checkForm"),
            method:"POST",
        },true,true);

        request.done(function(result){
            
            button.removeAttr("data-pending");

            $("#showTLDStatusLoader").css("display","none");

            if(result != ''){
                var solve = getJson(result);
                if(solve !== false){
                    if(solve.status == "error"){

                        $("#LookupResults").css("display","none");

                        scrollUp();
                        $("#domainInput").attr("style","border-bottom:2px solid red; color:red;")
                            .focus()
                            .change(function(){
                                $(this).removeAttr("style");
                            });



                        if(solve.for != undefined && solve.for != ''){
                            $(solve.for).focus();
                            $(solve.for).attr("style","border-bottom:2px solid red; color:red;");
                            $(solve.for).change(function(){
                                $(this).removeAttr("style");
                            });
                        }
                        if(solve.message != undefined && solve.message != '')
                            alert_error(solve.message,{timer:2000});
                    }else if(solve.status == "successful"){

                        if(solve.data != undefined && solve.data.length>0){

                            $(solve.data).each(function(key,item){
                                var price_to_year  = " - ";
                                var select_content = " - ";
                                if(item.status == "available"){
                                    select_content = '<input checked id="selected-x0" class="checkbox-custom" name="select['+item.sld+'.'+item.tld+']" value="1" type="checkbox" onchange="if($(\'#LookupList input[type=checkbox]:not(:checked)\').length>0) $(\'#selectAll\').prop(\'checked\',false); else $(\'#selectAll\').prop(\'checked\',true);">' +
                                        '<label for="selected-x0" style="border-radius:0px;" class="checkbox-custom-label"></label>';

                                    if(item.premium !== undefined && item.premium) select_content = contact_button;

                                    if(item.reg_price != undefined && item.reg_price.length>0){
                                        price_to_year = "";
                                        price_to_year += '<select id="tesclsure" name="period['+item.sld+'.'+item.tld+']">';
                                        $(item.reg_price).each(function(k,r){
                                            price_to_year += '<option value="'+r.year+'">'+r.price+' ('+r.year+' Yıl)</option>';
                                        });
                                        price_to_year += '</select>';
                                    }
                                }
                                else
                                {
                                    select_content = '<a href="javascript:void 0;" onclick="transferModal(\''+item.domain+'\',this)" class="lbtn transfer-btn">TRANSFER</a> <a href="javascript:void 0;" onclick="openWhois(\''+item.domain+'\');" class="lbtn whois-btn">WHOIS</a> ';
                                }

                                $("#domainResult").attr("data-name",item.tld);

                                $("#domainResult .tld-name").fadeOut(300,function(){
                                    $(this).addClass("tldhere").attr("data-name",item.tld).html('<strong>'+item.sld+'.'+item.tld+'</strong>').fadeIn(300);
                                });

                                $("#domainResult .tld-status").fadeOut(300,function(){
                                    if(item.premium !== undefined && item.premium) {
                                        $(this).attr("id", "tldok").html(situations['premium']);
                                        $("#ContinueButton").removeAttr("style");
                                    }
                                    else if(item.status == "available"){
                                        $(this).attr("id", "tldok").html(situations[item.status]);
                                        $("#ContinueButton").removeAttr("style");
                                    }else
                                        $(this).attr("id","tldno").html(situations[item.status]);
                                    $(this).fadeIn(300);
                                });

                                $("#domainResult .tld-prices").fadeOut(300,function(){
                                    $(this).html(price_to_year).fadeIn(300);
                                });
                                $("#domainResult .tld-select").fadeOut(300,function(){
                                    $(this).html(select_content).fadeIn(300);
                                });

                                if(item.status == "available")
                                    var LookupDomainStatus = 'Tebrikler! <strong>{domain}</strong> Müsait Durumda.';
                                else if(item.status == "unknown")
                                    var LookupDomainStatus = situations["unknown"];
                                else
                                    var LookupDomainStatus = 'Malesef <strong>{domain}</strong> Müsait Değil.';

                                LookupDomainStatus = LookupDomainStatus.replace("{domain}",item.domain);
                                if(item.status == "available"){
                                    $("#showTLDStatusUnavailable").fadeOut(300,function(){
                                        $("#showTLDStatusAvailable").fadeIn(300).html(LookupDomainStatus);
                                    });
                                }else{
                                    $("#showTLDStatusAvailable").fadeOut(300,function(){
                                        $("#showTLDStatusUnavailable").fadeIn(300).html(LookupDomainStatus);
                                    });
                                }

                                if(count>0) get_spotlight_results(item.tld);                            });
                        }
                    }
                }else
                    console.log(result);
            }
        });

    }

    function transferButton(elem)
    {
        $("#checkForm input[name=domain]").val($("#domainInput").val());
        $("#checkForm input[name=tcode]").val($("#transfer_code").val());
        $("#checkForm input[name=type]").val("transfer");
        MioAjaxElement($(elem),{
            form:$("#checkForm"),
            waiting_text: 'BEKLEYİNİZ',
            result:"transfer_handler",
        });
    }

    function OrderForm_before_submit(){
        var count = $("#OrderForm input[type=checkbox]:checked").length;
        return count>0 ? true : false;
    }
    function OrderForm_submit(result) {
        if(result != ''){
            var solve = getJson(result);
            if(solve !== false){
                if(solve.status == "error"){
                    if(solve.for != undefined && solve.for != ''){
                        $("#OrderForm "+solve.for).focus();
                        $("#OrderForm "+solve.for).attr("style","");
                        $("#OrderForm "+solve.for).change(function(){
                            $(this).removeAttr("style");
                        });
                    }
                    if(solve.message != undefined && solve.message != '')
                        alert_error(solve.message,{timer:3000});

                }else if(solve.status == "successful"){
                    $("#OrderForm #result").fadeOut(300).html('');
                    if(solve.redirect != undefined && solve.redirect != '') window.location.href = solve.redirect;
                }
            }else
                console.log(result);
        }

    }

    function openWhois(domain)
    {
        var title = 'WHOIS';
        var url = 'https://my.sunucumweb.com/alan-adi?whois='+domain+"&token=f9005f9a079046209c9736122ed3f91e4c4282d7233ac14cc81b973e44630272";
        var w   = 1090;
        var h   = 600;
        var dualScreenLeft = window.screenLeft != undefined ? window.screenLeft : screen.left;
        var dualScreenTop = window.screenTop != undefined ? window.screenTop : screen.top;
        var width = window.innerWidth ? window.innerWidth : document.documentElement.clientWidth ? document.documentElement.clientWidth : screen.width;
        var height = window.innerHeight ? window.innerHeight : document.documentElement.clientHeight ? document.documentElement.clientHeight : screen.height;
        var left = ((width / 2) - (w / 2)) + dualScreenLeft;
        var top = ((height / 2) - (h / 2)) + dualScreenTop;
        /*--------------*/
        window.open(url, title, 'scrollbars=yes, width=' + w + ', height=' + h + ', top=' + top + ', left=' + left);
    }

    function transferModal(domain,btn)
    {
        $("#domainInput").val(domain);

        xbtn    = $(btn);
        xbtn_be = $(btn).html();

        xbtn.html("BEKLEYİNİZ");

        var epp_code_st = true;

        var parsed = psl.parse(domain);

        if(tlds.includes(parsed.tld))
            epp_code_st = epp_code_support[parsed.tld];

        if(!epp_code_st)
        {
            $(".transfercode").slideUp();

            $(".transfercode input").val('N/A');
            $("#transferButton").trigger("click");
            return false;
        }

        $(".transfercode").slideDown();
        $(".transfercode input").val('').focus();

        scrollUp();
    }

}catch(e){console.warn('[transfer]',e)}
try{

        $(document).ready(function(){
            $( "#accordion" ).accordion({
                heightStyle: "content"
            });
        });
    
}catch(e){console.warn('[transfer]',e)}
try{


  window.dataLayer = window.dataLayer || [];

  function gtag(){dataLayer.push(arguments);}

  gtag('js', new Date());



  gtag('config', 'AW-16720149220');


}catch(e){console.warn('[transfer]',e)}
try{


var Tawk_API=Tawk_API||{}, Tawk_LoadStart=new Date();

(function(){

var s1=document.createElement("script"),s0=document.getElementsByTagName("script")[0];

s1.async=true;

s1.src='https://embed.tawk.to/66b732520cca4f8a7a742f23/1i4tpp5dm';

s1.charset='UTF-8';

s1.setAttribute('crossorigin','*');

s0.parentNode.insertBefore(s1,s0);

})();


}catch(e){console.warn('[transfer]',e)}
try{
(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':

new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],

j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=

'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);

})(window,document,'script','dataLayer','GTM-WCHTVJPG');
}catch(e){console.warn('[transfer]',e)}
try{


  window.dataLayer = window.dataLayer || [];

  function gtag(){dataLayer.push(arguments);}

  gtag('js', new Date());



  gtag('config', 'G-5Q4DXNVM9N');


}catch(e){console.warn('[transfer]',e)}
try{


      AOS.init({

        duration: 1500

      });

    
}catch(e){console.warn('[transfer]',e)}
try{
(function(){function c(){var b=a.contentDocument||(a.contentWindow&&a.contentWindow.document);if(b){var d=b.createElement('script');d.innerHTML="window.__CF$cv$params={r:'a2b97013fb17e4b7',t:'MTc4NjgwOTg5NQ=='};var a=document.createElement('script');a.src='cdn-cgi/challenge-platform/scripts/jsd/main.js';document.getElementsByTagName('head')[0].appendChild(a);";b.getElementsByTagName('head')[0].appendChild(d)}}if(document.body){var a=document.createElement('iframe');a.height=1;a.width=1;a.style.position='absolute';a.style.top=0;a.style.left=0;a.style.border='none';a.style.visibility='hidden';document.body.appendChild(a);if('loading'!==document.readyState)c();else if(window.addEventListener)document.addEventListener('DOMContentLoaded',c);else{var e=document.onreadystatechange||function(){};document.onreadystatechange=function(b){e(b);'loading'!==document.readyState&&(document.onreadystatechange=e,c())}}}})();
}catch(e){console.warn('[transfer]',e)}