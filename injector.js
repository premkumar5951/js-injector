function CreateWhatsappChatWidget(option = {
    brandSetting: {
        brandName: "SBNRI",
        brandSubTitle: "Typically replies within 10 minutes",
        brandImg: "https://s3.ap-south-1.amazonaws.com/sbnri.com/round-logo.svg",
        messageText: "Hey,%0a%0aI am an NRI and I want to know about {{slug}}.%0aSource: {{page_title}}",
        welcomeText: "Hi 👋\nWelcome to India’s largest NRI Platform.\nPlease, select from any of the below options:",
        backgroundColor: "#151E43",
        ctaText: "Other query ? Ask Here",
        borderRadius: "25",
        autoShow: true,
        phoneNumber: "919907111411"
    },
    chatButtonSetting: {
        backgroundColor: "#4dc247",
        ctaText: "Chat with US",
        borderRadius: "25",
        marginLeft: "0",
        marginBottom: "50",
        marginRight: "30",
        position: "right"
    },
    enabled: true
}) {
    if (option.enabled == false){
        return;
    }
    var has_user_clicked = false;
    try {
        fetch("https://ipinfo.io/?token=662cc68e268440")
        .then(r => r.json())
        .then(
            function(ip_data) {
                if (!ip_data.country) return;

                fetch(`https://restcountries.com/v3.1/alpha/${ip_data.country}?fields=name`)
                .then(r => r.json())
                .then(
                    function(country_data) {
                        if (!country_data.name) return;
                        country = country_data.name.common;
                        let user_location = `${ip_data.city}, ${country}`;
                        a_elements = jQuery("#chat-container").children('a');
                        a_elements.each(function(index, element) {
                            href = jQuery(element).attr('href');
                            href = href + '%0aLocation: ' + user_location;
                            jQuery(element).attr('href', href);
                        });
                        cta_href = jQuery('#cta-button').attr('href');
                        cta_href = cta_href + '%0aLocation: ' + user_location;
                        jQuery('#cta-button').attr('href', cta_href);
                });
        });
    }
    catch (e) {
        console.log("failed to get user location");
    }
    url = window.location.href;
    endpoint = `https://prod.sbnri.com/api/chatbox-config?url=${url}`;
    // async function getConfig() {
    // return 
    fetch(endpoint)
    .then(r => r.json())
    .then(
        function(data) {
            api_data = data.data;

            if (api_data.is_hidden === true) {
                jQuery('#whatsapp_chat_widget').remove();
                option.enabled = false;
                return;
            }

            welcome_text = api_data.welcome_message;
            welcome_text = welcome_text.replaceAll("\\n", "<br/>").replaceAll("\n", "<br/>");
            cta_text = api_data.cta_text;
            jQuery('#welcome-text').html(welcome_text);
            jQuery('#cta-text').html(cta_text);
            jQuery('.action-item').remove();
            buttons = api_data.buttons;
            buttons.forEach(function(button, index) {
                child = document.createElement('a');
                link = button.url || `https://api.whatsapp.com/send?phone=${option.brandSetting.phoneNumber.replace(/\+/g, "")}&text=${option.brandSetting.messageText?option.brandSetting.messageText.replaceAll("{{slug}}", button.text):""}`;
                child.setAttribute('href', link);
                child.setAttribute('target', '_blank');
                child_css = `
                    <style type="text/css">
                        #chatbox-button-${index} {
                            background-color: ${button.background_color};
                            color: ${button.text_color};
                        }
                        #chatbox-button-${index}:hover {
                            background-color: ${button.hover_background_color};
                            color: ${button.hover_text_color};
                        }
                        #chatbox-button-${index}:focus {
                            background-color: ${button.hover_background_color};
                            color: ${button.hover_text_color};
                        }
                    </style>
                `
                jQuery(child_css).appendTo("head");
                child.innerHTML = `
                <div class='wa-chat-box-content-chat-action' id="chatbox-button-${index}">
                    ${button.text}
                </div>
                `;
                jQuery('#chat-container').append(child);
            });
    })
    .catch(
        function(error) {
            console.log(error);
        }
    );
    // }
    // await getConfig();
    // if (option.enabled == false){
    //     return;
    // }
    if(!option.chatButtonSetting.position){
        option.chatButtonSetting.position = "right";
        option.chatButtonSetting.marginBottom = "20";
        option.chatButtonSetting.marginLeft = "0";
        option.chatButtonSetting.marginRight = "20";
    }
    var css = document.createElement("STYLE");
    if(window.jQuery){
        initWidget();
    }else{
        var script = document.createElement("SCRIPT");
        script.src = 'https://ajax.googleapis.com/ajax/libs/jquery/1.7.1/jquery.min.js';
        script.type = 'text/javascript';
        script.onload = function() {
            initWidget();
        };
        document.getElementsByTagName("head")[0].appendChild(script);
    }
    function initWidget(){
        if (option.brandSetting.messageText) {
            option.brandSetting.messageText = option.brandSetting.messageText.replaceAll("{{page_link}}", encodeURIComponent(window.location.href));
            option.brandSetting.messageText = option.brandSetting.messageText.replaceAll("{{page_title}}", jQuery("title").text());
        }
        jQuery('body').append(`<div id="whatsapp_chat_widget">
            <div id="wa-widget-send-button">
                <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 32 32" class="wa-messenger-svg-whatsapp wh-svg-icon"><path d=" M19.11 17.205c-.372 0-1.088 1.39-1.518 1.39a.63.63 0 0 1-.315-.1c-.802-.402-1.504-.817-2.163-1.447-.545-.516-1.146-1.29-1.46-1.963a.426.426 0 0 1-.073-.215c0-.33.99-.945.99-1.49 0-.143-.73-2.09-.832-2.335-.143-.372-.214-.487-.6-.487-.187 0-.36-.043-.53-.043-.302 0-.53.115-.746.315-.688.645-1.032 1.318-1.06 2.264v.114c-.015.99.472 1.977 1.017 2.78 1.23 1.82 2.506 3.41 4.554 4.34.616.287 2.035.888 2.722.888.817 0 2.15-.515 2.478-1.318.13-.33.244-.73.244-1.088 0-.058 0-.144-.03-.215-.1-.172-2.434-1.39-2.678-1.39zm-2.908 7.593c-1.747 0-3.48-.53-4.942-1.49L7.793 24.41l1.132-3.337a8.955 8.955 0 0 1-1.72-5.272c0-4.955 4.04-8.995 8.997-8.995S25.2 10.845 25.2 15.8c0 4.958-4.04 8.998-8.998 8.998zm0-19.798c-5.96 0-10.8 4.842-10.8 10.8 0 1.964.53 3.898 1.546 5.574L5 27.176l5.974-1.92a10.807 10.807 0 0 0 16.03-9.455c0-5.958-4.842-10.8-10.802-10.8z" fill-rule="evenodd"></path></svg>
                <div id="cta-text" style="color: white; font-size: 18px">${option.chatButtonSetting.ctaText}</div>
            </div>
        </div>`);
        jQuery('#whatsapp_chat_widget').append(`
            <div class='wa-chat-box'>
                <div class="wa-chat-bubble-close-btn"><img src="https://di8fe63pyr9j5.cloudfront.net/chatbox/close-button.png" width="25" height="25"></div>
                <div class='wa-chat-box-content' id="chat-container">
                    <div class='wa-chat-box-content-chat'>                            
                        <div id="welcome-text" class='wa-chat-box-content-chat-welcome'>${option.brandSetting.welcomeText.replace(/\n/g, "<br/>")}</div>
                        <div class='wa-chat-box-content-chat-brand'>${option.brandSetting.brandName}</div>
                    </div>
                    <a class="action-item" target="_blank" href="https://api.whatsapp.com/send?phone=${option.brandSetting.phoneNumber.replace(/\+/g, "")}&text=${option.brandSetting.messageText?option.brandSetting.messageText.replaceAll("{{slug}}", "Banking"):""}"><div class='wa-chat-box-content-chat-action'>
                        Banking
                    </div></a>
                    <a class="action-item" target="_blank" href="https://api.whatsapp.com/send?phone=${option.brandSetting.phoneNumber.replace(/\+/g, "")}&text=${option.brandSetting.messageText?option.brandSetting.messageText.replaceAll("{{slug}}", "Investment"):""}"><div class='wa-chat-box-content-chat-action'>
                        Investment
                    </div></a>
                    <a class="action-item" target="_blank" href="https://api.whatsapp.com/send?phone=${option.brandSetting.phoneNumber.replace(/\+/g, "")}&text=${option.brandSetting.messageText?option.brandSetting.messageText.replaceAll("{{slug}}", "Visa"):""}"><div class='wa-chat-box-content-chat-action'>
                        VISA
                    </div></a>
                    <a class="action-item" target="_blank" href="https://api.whatsapp.com/send?phone=${option.brandSetting.phoneNumber.replace(/\+/g, "")}&text=${option.brandSetting.messageText?option.brandSetting.messageText.replaceAll("{{slug}}", "Real Estate"):""}"><div class='wa-chat-box-content-chat-action'>
                        Real Estate
                    </div></a>
                    <a class="action-item" target="_blank" href="https://api.whatsapp.com/send?phone=${option.brandSetting.phoneNumber.replace(/\+/g, "")}&text=${option.brandSetting.messageText?option.brandSetting.messageText.replaceAll("{{slug}}", "Taxation"):""}"><div class='wa-chat-box-content-chat-action'>
                        Taxation
                    </div></a>
                    <a class="action-item" target="_blank" href="https://api.whatsapp.com/send?phone=${option.brandSetting.phoneNumber.replace(/\+/g, "")}&text=${option.brandSetting.messageText?option.brandSetting.messageText.replaceAll("{{slug}}", "SBNRI Services"):""}"><div class='wa-chat-box-content-chat-action' id="other-query">
                        Other Query
                    </div></a>
                </div>

            </div>
        `);
        function toggleWidget(){
            has_user_clicked = true;
            if (jQuery(".wa-chat-box").css("display") === 'block') {
                jQuery(".wa-chat-box").css("display", "none");
            }
            else {
                jQuery(".wa-chat-box").css("display", "block");
            }
        }
        function autoShow(){
            if (!has_user_clicked) {
                jQuery(".wa-chat-box").css("display", "block");
            }
        }
        if(option.brandSetting.autoShow){
            setTimeout(autoShow, 5000);
        }else{
            jQuery(".wa-chat-box").css("display", "none");
        }
        jQuery("#whatsapp_chat_widget").on('click', '.wa-chat-bubble-close-btn', function(){                
            has_user_clicked = true;
            jQuery(".wa-chat-box").css("display", "none");
        })
        jQuery("#whatsapp_chat_widget").on('click', '#wa-widget-send-button', function(){                
            toggleWidget()
        })
    }
    var styles = `
        #whatsapp_chat_widget{
            display: ${option.enabled?"block":"none"}
        }
        .wa-chat-box-content-send-btn-text{
            margin-left: 8px;
            margin-right: 8px;
            z-index: 1;
            color: rgb(255, 255, 255);
        }
        .wa-chat-box-content-send-btn-icon{
            width: 16px;
            height: 16px;
            fill: rgb(255, 255, 255);
            z-index: 1;
            flex: 0 0 16px;
        }
        .wa-chat-box-content-send-btn{
            text-decoration: none;
            color: rgb(255, 255, 255);
            font-size: 15px;
            font-weight: 700;
            line-height: 20px;
            cursor: pointer;
            position: relative;
            display: flex;
            -webkit-box-pack: center;
            justify-content: center;
            -webkit-box-align: center;
            align-items: center;
            -webkit-appearance: none;
            padding: 8px 12px;
            border-radius: ${option.brandSetting.borderRadius}px;
            border-width: initial;
            border-style: none;
            border-color: initial;
            border-image: initial;
            background-color: ${option.chatButtonSetting.backgroundColor};
            margin: 20px;
            overflow: hidden;
        }
        .wa-chat-box-send{
            background-color:white;

        }
        .wa-chat-box-content-chat-brand{        
            font-size: 13px;
            font-weight: 700;
            line-height: 18px;
            color: rgba(0, 0, 0, 0.4);
        }
        .wa-chat-box-content-chat-welcome{
            font-size: 14px;
            line-height: 19px;
            margin-top: 4px;
            color: rgb(17, 17, 17);
            white-space: normal;
        }
        .wa-chat-box-content-chat{
            background-color: white;
            // display: inline-block;
            white-space: nowrap;
            // margin: 20px;
            // margin: 0px;
            margin-top: 8px;
            margin-bottom: 8px;
            width: auto;
            padding: 10px;
            border-radius: 10px;
            text-align: right;
        }

        .wa-chat-box-content-chat-action{
            color: #3E88FA;
            text-align: center;
            display: inline-block;
            margin-left: 10px;
            margin-right: 0px;
            margin-top: 8px;
            margin-bottom: 1px;
            // box-sizing: border-box;
            // width: 35%;
            padding: 8px;
            padding-left: 10px;
            padding-right: 10px;
            border-radius: 8px;
            font-weight: 600;
            font-size: 14px;
            line-height: 15px;
            float: right;
            background-color: white;
            transition: 0.3s;
        }

        #other-query{
            background-color: #4CC147;
            color: white;
        }

        .wa-chat-box-content-chat-action:hover, #other-query:hover{
            background-color: #3E88FA;
            color: white;
        }

        .wa-chat-box-content-chat-action:focus, #other-query:focus{
            background-color: #3E88FA;
            color: white;
        }

        .wa-chat-box-content{
            background: url('https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png');
            max-height: 300px;
            overflow-y: scroll;
            padding-top: 10px;
            padding-bottom: 10px;
            padding-left: 20px;
            padding-right: 20px;
            border-radius: 10px;
        }
        .wa-chat-bubble-close-btn{
            cursor: pointer;
            position: absolute;
            left: 0px;
            top: -30px;
        }
        .wa-chat-box-brand-text{
            margin-left: 20px;
        }
        .wa-chat-box-brand-name{
            font-size: 16px;
            font-weight: 700;
            line-height: 20px;
        }
        .wa-chat-box-brand-subtitle{
            font-size: 13px;
            line-height: 18px;
            margin-top: 4px;
        }
        
        .wa-chat-box-header{
            padding-top: 14px;
            padding-bottom: 14px;
            // height: 100px;
            // max-height: 100px;
            // min-height: 100px;
            background-color: ${option.brandSetting.backgroundColor};
            color: white;
            border-radius: 10px 10px 0px 0px;
            display:flex;
            align-items: center;
        }
        .wa-chat-box-brand{
            margin-left: 20px;
            width: 40px;
            height: 40px;
            border-radius: 25px;
            box-shadow: 2px 2px 6px rgba(0,0,0,0.4);
        }
        .wa-chat-box{
            display: none;
            background-color:white;
            z-index: 16000160 !important;
            margin-bottom: 60px;
            width: 360px;
            position: fixed !important;
            bottom: ${option.chatButtonSetting.marginBottom}px !important;
            ${option.chatButtonSetting.position == "left" ? "left : "+option.chatButtonSetting.marginLeft+"px" : "right : "+option.chatButtonSetting.marginRight+"px"};
            border-radius: 10px;
            box-shadow: 2px 2px 6px rgba(0,0,0,0.4);
            font: 400 normal 15px/1.3 -apple-system, BlinkMacSystemFont, Roboto, Open Sans, Helvetica Neue, sans-serif;
        }
        #wa-widget-send-button {
            margin: 0 0 ${option.chatButtonSetting.marginBottom}px 0 !important;      
            padding-left: ${option.chatButtonSetting.ctaText?"15px":"0px"};
            padding-right: ${option.chatButtonSetting.ctaText?"15px":"0px"};
            position: fixed !important;
            z-index: 16000160 !important;
            bottom: 0 !important;
            text-align: center !important;
            height: 50px;
            min-width: 50px;
            border-radius: ${option.chatButtonSetting.borderRadius}px;
            visibility: visible;
            transition: none !important;
            background-color: ${option.chatButtonSetting.backgroundColor};
            box-shadow: 2px 2px 6px rgba(0,0,0,0.4);
            ${option.chatButtonSetting.position == "left" ? "left : "+option.chatButtonSetting.marginLeft+"px" : "right : "+option.chatButtonSetting.marginRight+"px"};
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content:center;
        }
        .wa-messenger-svg-whatsapp{
            fill: white;
            width: 41px;
            height: 50px;
        }
        .wa-chat-box-poweredby{
            text-align: center;
            font: 400 normal 15px/1.3 -apple-system, BlinkMacSystemFont, Roboto, Open Sans, Helvetica Neue, sans-serif;
            margin-bottom: 15px;
            margin-top: -10px;
            font-style: italic;
            font-size: 12px;
            color: lightgray;
        }
        @media only screen and (max-width: 600px) {
            .wa-chat-box
            {
                width: auto;
                position: fixed !important;
                right: 20px!important;
                left: 20px!important;
            }
        }
    `

    var styleSheet = document.createElement("style")
    styleSheet.type = "text/css"
    styleSheet.innerText = styles
    document.getElementsByTagName("head")[0].appendChild(styleSheet);
}
