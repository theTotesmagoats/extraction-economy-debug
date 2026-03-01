// CRITICAL FIXES FOR v11.2

// Fix 1: Add proper GDP display element to HTML header (see fix-gdp-display.html)

// Fix 2: Enhanced array bounds checking in memo actions
function add_safe_segment_access() {
    // Replace direct access like state.segments[3] with safe version:
    
    // Instead of:
    // state.segments[3].sat -= 40;
    
    // Use:
    if (state.segments.length > 3) {
        state.segments[3].sat = Math.max(0, state.segments[3].sat - 40);
    }
}

// Fix 3: Enhanced acquire_competitor with better error handling
function acquire_competitor() {
    try {
        if(state.over || state.modal_active || state.comp_locked) return;
        
        let cost = Math.floor(state.comp_threat * 15000);
        if(state.profit >= cost) {
            state.profit -= cost; 
            
            // Safe access to competitors array
            let comp_name = "Unknown";
            if(state.comp_idx >= 0 && 
               state.comp_idx < competitors.length && 
               competitors[state.comp_idx] && 
               competitors[state.comp_idx].name) {
                comp_name = competitors[state.comp_idx].name;
            }
            
            log("ACQUISITION: " + comp_name + " purchased and deprecated.");
            
            state.comp_threat = 0;
            state.comp_locked = false; 
            
            // Safe increment with bounds check
            state.comp_idx = (state.comp_idx + 1) % competitors.length;
            
            let lbl = document.getElementById('threat_label');
            if(lbl && 
               state.comp_idx >= 0 && 
               state.comp_idx < competitors.length &&
               competitors[state.comp_idx] &&
               competitors[state.comp_idx].name) {
                lbl.innerText = competitors[state.comp_idx].name + " Threat";
                log("MARKET ALERT: New alternative '" + competitors[state.comp_idx].name + "' incubating...");
            } else {
                log("MARKET ALERT: New competitor threat detected.");
            }
            
            generate_news();
            update_ui();
        } else { 
            log("ACQUISITION FAILED: Insufficient capital. Cost: $" + cost.toLocaleString() + ", Available: $" + state.profit.toLocaleString()); 
        }
    } catch(e) {
        console.error("acquire_competitor error:", e);
        alert("Acquisition failed - see console for details");
    }
}

// Fix 4: Enhanced next_tick with proper bounds checking
function add_bounds_checking() {
    // Replace direct array access in memo actions:
    
    // Instead of:
    // state.segments[3].sat -= 40;
    
    // Use:
    if (state.segments.length > 3) {
        state.segments[3].sat = Math.max(0, state.segments[3].sat - 40);
    }
}

// Fix 5: Add try-catch around memo actions
function resolve_memo_safe(option_index) {
    try {
        let result_text = "DECISION: Acknowledged.";
        
        if (option_index >= 0 && 
            current_memo && 
            current_memo.options && 
            current_memo.options[option_index]) {
            
            // Execute action with error handling
            try {
                result_text = current_memo.options[option_index].action();
            } catch(action_error) {
                console.error("Memo action error:", action_error);
                result_text = "ERROR: Action failed - see console";
            }
        }
        
        state.inbox.unshift({ 
            title: current_memo ? current_memo.title : "Unknown Memo", 
            text: (current_memo?.text || "") + "\n\n---------------------------\n" + result_text, 
            read: false, date: "Month " + state.month 
        });
        state.unread++;
        state.inbox = state.inbox.slice(0, 50); 
        
        let modal_el = document.getElementById('modal');
        if (modal_el) modal_el.style.display = 'none';
        
        current_memo = null;
        
        if(state.last_speed > 0 && !state.over) { 
            set_speed(state.last_speed); 
        } else {
            console.log("Game remains paused after memo resolution");
        }
        
        update_ui();
    } catch(e) {
        console.error("resolve_memo error:", e);
        alert("Memo resolution failed - see console for details");
    }
}

// Fix 6: Add GDP display to update_ui
function update_ui_safe() {
    // ... existing code ...
    
    const els = {
        // ... existing elements ...
        g_disp: document.getElementById('g_disp'), // Now exists in HTML
        // ... rest of elements ...
    };
    
    if (els.g_disp && state.gdp !== undefined) {
        els.g_disp.innerText = state.gdp.toFixed(1) + "%";
    }
}