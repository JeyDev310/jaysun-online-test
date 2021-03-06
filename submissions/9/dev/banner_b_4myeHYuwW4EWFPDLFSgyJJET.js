
(function (d) {
  //Initial object preparation & message events
  var pp = window.presspatron;
  var host_url = "https://dashboard.presspatron.com";
  var currentOrigin = window.location.origin || window.location.protocol + "//"
  + window.location.hostname
  + (window.location.port ? ':' + window.location.port : '');

  var donationParameters = ['frequency', 'amount', 'page', 'metadata', 'recaptcha-v2'];

  if(pp == null){
    pp = window.presspatron = {};
    pp.receiveMessage = handleIframeMessages;
    window.addEventListener("message", pp.receiveMessage, false);
  }

  function handleIframeMessages(event){
      if (extractDomain(event.origin) !== extractDomain(host_url)){
        return;
      }
      else{
        var msgData = event.data;
        var action = msgData.action, payload = msgData.payload;
        switch (action) {
          case "modal":
            toggleDonationModal();
            break;
          case "updateBanner":
            var bannerFrame = document.querySelector("iframe[name=banner-frame]");
            bannerFrame.contentWindow.postMessage({ action: "update" },host_url);
            break;
          case "hide":
            var banner = document.getElementById("pp-banner");
            if(banner) {
              banner.style.display = "none";
              setHideCookie();
            }
            break;
          case "event":
            var callback = window.presspatron_handleCheckoutEvent;
            callback && callback({
              eventName: msgData.eventName,
              payload: payload
            });
            break;
          default:
            return;
        }
      }
  }

  function toggleDonationModal(opts) {
    if(typeof opts == 'undefined') opts = {};

    var modal = d.getElementById("pp-modal");
    if(modal == null) {
      setupDonationModal(opts);
      document.documentElement.classList.add("pp-modal-open");
    }
    else{
      document.documentElement.classList.remove("pp-modal-open");
      tearDownDonationModal();
    }
  }

  function setHideCookie() {
      var date = new Date(),
          days = 7;
      date.setTime(date.getTime() + (days*24*60*60*1000));
      var expires = "expires="+ date.toUTCString();
      document.cookie = "_presspatron-hide_banner=true;" + expires + ";path=/";
  }

  function checkHideCookie() {
    var value = "; " + document.cookie;
    var parts = value.split("; " + "_presspatron-hide_banner" + "=");
    return (parts.length >= 2);
  }

  function createStyles() {
    var styles = document.createElement("style");
    styles.id = "pp-styles";
    styles.innerText = "html.pp-modal-open,.pp-modal-open body {overflow:hidden;}"
    document.body.appendChild(styles);
  };

  function createButton(buttonCont){
      var button = d.createElement("iframe"), bStyle = button.style;;
      button.name = button.id = "button-frame";
      button.frameborder = "0";
      button.scrolling = "no";
      button.allowtransparency="true";
      bStyle.width = "180px"; bStyle.height="34px"; bStyle.border="none";
      button.src = "https://dashboard.presspatron.com/websites/282/get_button?origin="+encodeURIComponent(currentOrigin);
      buttonCont.appendChild(button);

      return button;
  }

  function showModal(){
    presspatron.receiveMessage({ 'data': 'modal', 'origin': host_url });
  }

  function addTracking(element){
    var analyticsFrame = d.createElement("iframe"), aStyle = analyticsFrame.style;
    analyticsFrame.frameborder = "0";
    analyticsFrame.scrolling = "no";
    analyticsFrame.allowtransparency= "true";
    aStyle.width = "1px"; aStyle.height = "1px"; aStyle.border = "none";
    analyticsFrame.src = "https://dashboard.presspatron.com/websites/282/custom_button";
    element.appendChild(analyticsFrame);
  }

  function setupComponents() {
    //create the required styles
    createStyles();
    //banner iframe setup
    var banner, bannerCont = d.getElementById("pp-banner");
    if(bannerCont && !(checkHideCookie())){

      banner = d.createElement("iframe");
      banner.className = "pp-banner-cont";
      banner.src = "https://dashboard.presspatron.com/websites/282?origin="+encodeURIComponent(currentOrigin);
      banner.frameborder="0";
      banner.scrolling = "no";
      banner.name = "banner-frame";
      s = banner.style
      var elStyle = banner.style;
      elStyle.width = "100%"; elStyle.height = "44px"; elStyle.display = "block";
      elStyle.border = "none";
      bannerCont.appendChild(banner);

    }

    //button iframe setup
    var deprecatedReference=d.getElementById("pp-donate-button");
    var references = d.getElementsByClassName("pp-donate-button");
    if(deprecatedReference)createButton(deprecatedReference);
    for(var i = 0; i < references.length ; i++){
      var ref = references[i];
      if(ref !== deprecatedReference)createButton(ref);
    }

    //create calbacks to open modal manually
    var elements = d.querySelectorAll('.pp-trigger-modal');
    for (var i = 0; i < elements.length; i++) {
      addTracking(elements[i]);
      if (document.addEventListener) {                // For all major browsers, except IE 8 and earlier
        elements[i].addEventListener("click", showModal);
      } else if (document.attachEvent) {              // For IE 8 and earlier versions
        elements[i].attachEvent("click", showModal);
      }
    }

    // add tracking for custom buttons present on DOM load
    var customButtonLinks=d.querySelectorAll("a[href*='presspatron.com/donations/new']")
    for (var i = 0; i < customButtonLinks.length; i++) {
      addTracking(customButtonLinks[i]);
    }

    // check for a hrefs that contain a link to the donation form and capture their click event
    function handleLinkClickEvents(e) {
      // begin by normalising tag names and finding a `a` element
      var target = e.target,
        tagName = target.tagName;

      tagName = normaliseTagName(tagName);

      // check if they have clicked on a child element of 'A' element
      if(tagName !== "A"){
        var ancestorLink = target.closest('a');
        if(ancestorLink){
          target = ancestorLink;
          tagName = normaliseTagName(target.tagName);
        }
      }

      // if it is an `a` element
      if(tagName === "A"){
        var url = target.href,
          ppRe = /(presspatron.com\/donations\/new)|(#pp-custom-element)/;

        // open the modal if the href matches the donation link
        if(url && ppRe.test(url)){
          e.preventDefault();
          toggleDonationModal({targetEl: target});
        }
        else if(target.hasAttribute("data-pp-append-referrer")){
          // help by appending a referrer to a link
          var referrerUrl = window.location.href,
            urlObj = new URL(target.href),
            searchParams = urlObj.searchParams;

          if(!searchParams.has('utm_url')){
            searchParams.append("utm_url", referrerUrl);
          }
          target.href = urlObj.toString();
        }
      }
    }

    if (document.addEventListener) {                // For all major browsers, except IE 8 and earlier
      document.addEventListener('click', handleLinkClickEvents);
    } else if (document.attachEvent) {              // For IE 8 and earlier versions
      document.attachEvent('click', handleLinkClickEvents);
    }
  }

  function normaliseTagName(tagName){
    if(tagName && typeof tagName.toUpperCase === "function"){
      tagName = tagName.toUpperCase();
    }
    return tagName;
  }

  function setupDonationModal(opts) {
    // Basic iframe modal setup
    var donationParams = {}, searchParams='';
    var modalContainer = d.createElement("div");
    modalContainer.classList.add("pp-modal-container");
    var modalContainerStyle = "width: 100%; height: 100%; position: fixed; z-index: 9999; top: 0; left: 0;";
    modalContainerStyle += "background: rgba(0, 0, 0, 0.82) no-repeat 50% 25% url(v1.6.1-34-g5385ac56/assets/loading-modal-e2fcf6d7f5457ff58e9cca9631daef16fedb9a3523d5dbe139cd2605443f2fdf.gif);";
    modalContainer.setAttribute("style", modalContainerStyle);

    var modal = d.createElement("iframe"), s = modal.style;
    modal.id = "pp-modal";
    modal.name = "donation-frame";

    if(opts.targetEl){
      donationParams = gatherDonationParameters(opts.targetEl);
      var metadata = donationParams.metadata;
      donationParams.metadata = metadata ? btoa(metadata) : "";
    }
    donationParams.frame = 1;
    donationParams.t = "4myeHYuwW4EWFPDLFSgyJJET";
    donationParams.referral_url = prepareReferralUrl();
    donationParams.origin = encodeURIComponent(currentOrigin);
    searchParams = constructSearchParams(donationParams);

    modal.src = "https://dashboard.presspatron.com/donations/new?"+searchParams;
    var modalStyle = "width: 100%; height: 100%; position: fixed; z-index: 9999; top: 0; left: 0;";
    modalStyle += "border: none; opacity: 0; transition: opacity 0.2s ease-out;";
    modal.setAttribute("style", modalStyle);
    modal.allowtransparency="true";
    modal.scrolling = "no";

    modalContainer.appendChild(modal);
    modal.addEventListener("load", function() {
      modal.style.opacity = 1;
    });
    d.body.appendChild(modalContainer);
  }

  function tearDownDonationModal() {
    var donationFrame = document.querySelector(".pp-modal-container");
    d.body.removeChild(donationFrame);
  }

  function extractDomain(url) {
    urlParts = url.match(/^https?:\/\/(.*)$/);
    return urlParts.length >= 1 ? urlParts[1] : null;
  }

  // Given an element it'll return an object with all registered PP parameters
  function gatherDonationParameters(element) {
    var params, param, attributeValue;
    params = {};
    for (var index = 0; index < donationParameters.length; index++) {
      param = donationParameters[index];
      attributeValue = element.getAttribute('data-pp-'+param);
      attributeValue && (params[param] = attributeValue);
    }
    return params;
  }

  function prepareReferralUrl() {
    return encodeURIComponent(window.location.href);
  }

  // Given an object of search params will output a formed string like `key1=value1&key2=value2`
  function constructSearchParams(params) {
    var paramList = [], searchKey, searchValue;
    for (searchKey in params) {
      if (params.hasOwnProperty(searchKey)) {
        searchValue = params[searchKey];
        paramList.push(searchKey+'='+searchValue);
      }
    }
    return paramList.join("&");
  }

  // if both divs are ready, ELSE if the whole DOM is ready, ELSE wait until DOM loads
  // the first check is for speed, the second catches this script loading after DOM,
  // the final catches everything else

 if (document.readyState.match(/^(ready|loaded|interactive|complete)$/)) {
    setupComponents();
  } else {
    document.addEventListener('DOMContentLoaded', function () {
      setupComponents();
    });
  }

  // Polyfill for `Element.closest`
  if (window.Element && !Element.prototype.closest) {
    Element.prototype.closest =
    function(s) {
      var matches = (this.document || this.ownerDocument).querySelectorAll(s),
          i,
          el = this;
      do {
        i = matches.length;
        while (--i >= 0 && matches.item(i) !== el) {};
      } while ((i < 0) && (el = el.parentElement));
      return el;
    };
  }
}(document));
