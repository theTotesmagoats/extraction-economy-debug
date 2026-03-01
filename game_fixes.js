// FIXED: Enhanced set_speed with better error handling and state management
function set_speed(ms) {
    try {
        console.log(`set_speed called with ms=${ms}, modal_active=${state.modal_active}, over=${state.over}`);
        
        if(state.over || state.modal_active) {
            console.warn("Game cannot start - state check failed");
            return;
        }
        
        // Always clear any existing timer first
        if(sim_timer) { 
            clearInterval(sim_timer); 
            sim_timer = null; 
        }
        current_speed = ms;
        
        // Update button classes consistently
        const btn_pause = document.getElementById('btn_p_pause');
        const btn_1x    = document.getElementById('btn_p_1x');
        const btn_2x    = document.getElementById('btn_p_2x');
        const status    = document.getElementById('clock_status');
        
        if (!btn_pause || !btn_1x || !btn_2x || !status) {
            console.error("set_speed: Missing DOM elements!");
            return;
        }
        
        // Reset all buttons
        btn_pause.className = "ctrl-btn";
        btn_1x.className    = "ctrl-btn";
        btn_2x.className    = "ctrl-btn";
        
        if (ms === 0) {
            btn_pause.className = "ctrl-btn ctrl-active";
            status.innerText = "HALTED"; 
            status.className = "status-halted";
            log("CLOCK: Execution paused.");
        } else {
            if (ms === 2500) btn_1x.className = "ctrl-btn ctrl-active";
            if (ms === 1250) btn_2x.className = "ctrl-btn ctrl-active";
            
            sim_timer = setInterval(next_tick, ms);
            status.innerText = "RUNNING"; 
            status.className = "status-running";
            log(`CLOCK: Engine engaged at ${ms}ms.`);
        }
    } catch(e) {
        console.error("set_speed error:", e);
        alert("Error setting speed - see console for details");
    }
}