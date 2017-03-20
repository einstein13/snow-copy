function save_content_to_file(content, filename)
{
    console.log("w1");
    var dlg = false;
    console.log("w2");
    with(document){
        ir=createElement('iframe');
        ir.id='ifr';
        ir.location='about.blank';
        console.log("w3");
        ir.style.display='none';
        body.appendChild(ir);
        console.log("w4");
        with(getElementById('ifr').contentWindow.document){
            console.log("w5");
            open("text/plain", "replace");
            charset = "utf-8";
            write(content);
            close();
            console.log("w6");
            document.charset = "utf-8";
            dlg = execCommand('SaveAs', false, filename+'.txt/js');
            console.log("w7");
        }
        body.removeChild(ir);
        console.log("w8");
    }
    console.log("w9");
    return dlg;
}

function simplify_script_text(text){
    tekst_do_uproszczenia = text;
    return text;
}

function create_html_table(objects){
    // variables
    var table;
    var head;
    var body;
    var row;
    var cell;

    table = document.createElement("table");
    // header
    head = document.createElement("thead");
    row = document.createElement("tr");
    cell = document.createElement("th");
    cell.innerText = "name";
    cell.classList.add("smooth-table-th");
    row.appendChild(cell);
    cell = document.createElement("th");
    cell.innerText = "script";
    cell.classList.add("smooth-table-th");
    row.appendChild(cell);
    head.appendChild(row);
    table.appendChild(head);
    // body
    body = document.createElement("tbody");
    for(var name in objects){
        row = document.createElement("tr");
        cell = document.createElement("td");
        cell.innerText = name;
        cell.classList.add("smooth-table-strong");
        cell.classList.add("smooth-table-td");
        row.appendChild(cell)
        cell = document.createElement("td");
        var inner_text = objects[name];
        // inner_text = inner_text.replaceAll(" ", "&nbsp;");
        cell.innerText = simplify_script_text(inner_text);
        cell.innerHtml = inner_text;
        cell.classList.add("smooth-table-td");
        cell.classList.add("smooth-table-script-content")
        row.appendChild(cell);
        row.classList.add("smooth-table-tr");
        row.classList.add("smooth-table-pointer");
        body.appendChild(row);
    }
    table.appendChild(body);
    table.classList.add("smooth-table");
    // put table in div
    element = document.getElementById("table-info");
    element.innerText = "";
    element.appendChild(table);
    element.classList.remove("object-hidden");
}

function show_debug_info(info_text){
    element = document.getElementById("debug");
    element.innerText = info_text;
    element.classList.remove("object-hidden");
}

function hide_debug_info(){
    element = document.getElementById("debug");
    element.innerText = "";
    element.classList.add("object-hidden");

    element = document.getElementById("table-info");
    element.innerHtml = "";
    element.classList.add("object-hidden");
}

response = "";

function copy_to_clipboard(text){
    hide_debug_info();
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        var tab = tabs[0];
        chrome.tabs.getSelected(null, function(tab) {
            chrome.tabs.sendMessage(tab.id, {action: "copyToClipboard", text: text}, function(msg) {
                copy_response = msg;
            });
        });
    });
}

function add_listeners_to_table(){
    var rows = document.getElementsByClassName("smooth-table-pointer");
    for(var i=0; i<rows.length; i++){
        var row = rows[i];
        row.addEventListener("click", function(event){
            // get row
            var target = event.target;
            if(target.tagName == "TD"){
                target = target.parentElement;
            }
            // find correct cell
            var cells = target.getElementsByClassName("smooth-table-script-content");
            if(cells.length > 0){
                target = cells[0];
                inner_text = target.innerHtml;
                // inner_text = inner_text.replaceAll("&nbsp;"," ");
                copy_to_clipboard(inner_text);
                show_debug_info("Successfully copied");
            }
            else{
                show_debug_info("Script not found!");
            }
        });
    }
}

function my_copy_function_script(){
    hide_debug_info();
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        var tab = tabs[0];
        chrome.tabs.getSelected(null, function(tab) {
            chrome.tabs.sendMessage(tab.id, {action: "getTextarea"}, function(msg) {
                response = msg;
                // console.log(msg);
                msg = msg || {};
                scripts = msg.scripts;
                URL = msg.URL;
                // save_content_to_file(URL, "C:/Users/jakub/Documents/ServiceNowTutorials/new");
                if(scripts){
                    if(scripts.errors){
                        if(scripts.length == 0){
                            show_debug_info(scripts.errors);
                        }
                        else{
                            show_debug_info(scripts.errors);
                            create_html_table(scripts.textareas);
                            add_listeners_to_table();
                        }
                    }
                    else{
                        copy_to_clipboard(scripts.textarea_value);
                        show_debug_info("Successfully copied");
                    }
                }
                else{
                    show_debug_info("No correct response - please try again");
                }
            });
        });
    });
}

document.getElementById("copy-script-button").onclick = function() {my_copy_function_script()};
