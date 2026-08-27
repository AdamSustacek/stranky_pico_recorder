function switchTab(tab) {
    // Update buttons
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.toggle('tab-active', btn.dataset.tab === tab);
    });

    // Update panels
    document.querySelectorAll('.tab-panel').forEach(panel => {
        panel.classList.remove('active');
    });
    document.getElementById('panel-' + tab).classList.add('active');

    // Move indicator
    const activeBtn = document.querySelector(`.tab-btn[data-tab="${tab}"]`);
    const track = document.querySelector('.tab-track');
    const indicator = document.getElementById('tabIndicator');
    const trackRect = track.getBoundingClientRect();
    const btnRect = activeBtn.getBoundingClientRect();
    indicator.style.left = (btnRect.left - trackRect.left) + 'px';
    indicator.style.width = btnRect.width + 'px';
}

// Init indicator on load
document.addEventListener('DOMContentLoaded', () => {
    switchTab('download');

    // Download button animation
    document.querySelectorAll('.btn-download').forEach(btn => {
        btn.addEventListener('click', () => {
            btn.style.transform = 'scale(0.97)';
            setTimeout(() => btn.style.transform = '', 150);
        });
    });
});
