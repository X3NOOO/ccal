function setTheme(theme) {
    localStorage.setItem('theme', theme);

    if (theme === 'auto') {
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            document.documentElement.setAttribute('data-theme', 'dark');
        } else {
            document.documentElement.setAttribute('data-theme', 'light');
        }
    } else {
        document.documentElement.setAttribute('data-theme', theme);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const savedTheme = localStorage.getItem('theme') || 'auto';

    document.getElementById(`theme_${savedTheme}`).checked = true;

    // Apply the theme
    setTheme(savedTheme);

    document.querySelectorAll('input[name="theme"]').forEach(input => {
        input.addEventListener('change', function () {
            setTheme(this.value);
        });
    });

    if (window.matchMedia) {
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
            if (localStorage.getItem('theme') === 'auto') {
                document.documentElement.setAttribute('data-theme', e.matches ? 'dark' : 'light');
            }
        });
    }
});