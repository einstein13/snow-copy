

function copy_to_clipboard(text){
    var textarea = document.createElement("textarea");
    textarea.value = text;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand("copy");
    document.body.removeChild(textarea);
    console.log("Copied to clipboard");
}


// function save_content_to_file(content, filename)
// {
//     console.log("w1");
//     var dlg = false;
//     console.log("w2");
//     with(document){
//         ir=createElement('iframe');
//         ir.id='ifr';
//         ir.location='about.blank';
//         console.log("w3");
//         ir.style.display='none';
//         body.appendChild(ir);
//         console.log("w4");
//         with(getElementById('ifr').contentWindow.document){
//             console.log("w5");
//             open("text/plain", "replace");
//             charset = "utf-8";
//             write(content);
//             close();
//             console.log("w6");
//             document.charset = "utf-8";
//             dlg = execCommand('SaveAs', false, filename+'.txt/js');
//             console.log("w7");
//         }
//         body.removeChild(ir);
//         console.log("w8");
//     }
//     console.log("w9");
//     return dlg;
// }

function check_textarea(textarea){
    var regex=/^[a-z_-]+\.[a-z_-]+$/i
    var name = textarea.name;
    if(name.search(regex)==0){
        if(textarea.value != ""){
            return true;
        }
    }
    return false;
}

function find_scripts(object){
    var scripts = [];

    var textareas = object.getElementsByTagName("textarea");
    if(textareas.length > 0){
        for(var i=0; i<textareas.length; i++){
            var one_textarea = textareas[i];
            if(check_textarea(one_textarea)){
                scripts.push(one_textarea);
            }
            scripts.push()
        }
    }

    var iframes = object.getElementsByTagName("iframe");
    if(iframes.length > 0){
        for(var i=0; i<iframes.length; i++){
            var one_iframe = iframes[i];
            scripts = scripts.concat(find_scripts(one_iframe.contentDocument));
        }
    }

    return scripts;
}

function find_all_scripts(){
    found_scripts = find_scripts(document);
    var error_message_2 = "Found more than 1 script!";
    var error_message_1 = "Found 0 scripts!"

    // Found one script
    if(found_scripts.length == 1){
        return {
            textarea_value: found_scripts[0].value,
            textarea_name: found_scripts[0].name,
            length: found_scripts.length,
            };
    }

    // Scripts not found
    if(found_scripts.length == 0){
        // console.log(error_message_1);
        return {
            errors: error_message_1,
            length: 0
        }
    }

    // Found more scripts
    else{
        // console.log(error_message_2);
        var all_scripts = {};
        found_scripts.forEach(function(element){
            all_scripts[element.name] = element.value;
        });

        return {
            errors: error_message_2,
            length: found_scripts.length,
            textarea_value: found_scripts[0].value,
            textarea_name: found_scripts[0].name,
            textareas: all_scripts
            };
    }
}

window.onload = function() {
    chrome.runtime.onMessage.addListener(function(msg, _, sendResponse) {
        switch(msg.action){
            case "getTextarea":
                var found_scripts = find_all_scripts();
                // save_content_to_file(document.URL, "C:/Users/jakub/Documents/ServiceNowTutorials/new");
                sendResponse({
                    scripts: found_scripts,
                    URL: document.URL
                });
                break;
            case "copyToClipboard":
                copy_to_clipboard(msg.text);
                sendResponse({copy: "copied"});
                break;
            default:
                sendResponse({response: "nothing"});
        }
    });
};