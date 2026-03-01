// FIXED: Enhanced resolve_memo to properly restore game state
function resolve_memo(option_index) {
    try {
        let result_text = "DECISION: Acknowledged.";
        if (option_index >= 0 && current_memo.options[option_index]) {
            result_text = current_memo.options[option_index].action();
        }
        
        state.inbox.unshift({ 
            title: current_memo.title, 
            text: current_memo.text + "\n\n---------------------------\n" + result_text, 
            read: false, date: `Month ${state.month}` 
        });
        state.unread++;
        state.inbox = state.inbox.slice(0, 50); // Bound array
        
        // CRITICAL FIX: Always reset modal_active to false
        state.modal_active = false;
        
        document.getElementById('modal').style.display = 'none';
        current_memo = null;
        
        console.log(`resolve_memo completed. last_speed=${state.last_speed}, over=${state.over}`);
        
        // Only resume speed if we had one before the modal
        if(state.last_speed > 0 && !state.over) { 
            set_speed(state.last_speed); 
        } else {
            console.log("Game remains paused - no previous speed to restore");
        }
        
        update_ui();
    } catch(e) {
        console.error("resolve_memo error:", e);
        alert("Error resolving memo - see console for details");
    }
}