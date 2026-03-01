// DEBUG SCRIPT: Add this to your HTML before the game code runs

<script>
    // Add debugging overlay
    function addDebugOverlay() {
        const debugDiv = document.createElement('div');
        debugDiv.id = 'game-debug-overlay';
        debugDiv.style.cssText = `
            position: fixed; top: 10px; left: 10px; z-index: 9999;
            background: rgba(0,0,0,0.8); color: lime; font-family: monospace;
            padding: 10px; border-radius: 5px; max-width: 300px;
        `;
        debugDiv.innerHTML = `
            <strong>GAME DEBUG INFO</strong><br>
            modal_active: <span id="debug-modal">unknown</span><br>
            over: <span id="debug-over">unknown</span><br>
            current_speed: <span id="debug-speed">unknown</span><br>
            last_speed: <span id="debug-last">unknown</span><br>
            <div style="margin-top:10px; font-size: 12px;">Check browser console for detailed logs</div>
        `;
        document.body.appendChild(debugDiv);
        
        // Update debug display every second
        setInterval(() => {
            if (state) {
                document.getElementById('debug-modal').textContent = state.modal_active;
                document.getElementById('debug-over').textContent = state.over;
                document.getElementById('debug-speed').textContent = current_speed;
                document.getElementById('debug-last').textContent = state.last_speed;
            }
        }, 1000);
    }

    // Override set_speed with debugging
    const originalSetSpeed = window.set_speed;
    if (originalSetSpeed) {
        window.set_speed = function(ms) {
            console.log(`[DEBUG] set_speed called: ms=${ms}, modal_active=${state.modal_active}, over=${state.over}`);
            return originalSetSpeed.apply(this, arguments);
        };
    }

    // Override resolve_memo with debugging
    const originalResolveMemo = window.resolve_memo;
    if (originalResolveMemo) {
        window.resolve_memo = function(option_index) {
            console.log(`[DEBUG] resolve_memo called: option=${option_index}, modal_active=${state.modal_active}`);
            return originalResolveMemo.apply(this, arguments);
        };
    }

    // Initialize debug overlay when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', addDebugOverlay);
    } else {
        addDebugOverlay();
    }
</script>