export default {
    mounted(el, binding) {

        const instructionEl = document.createElement('div');
        instructionEl.textContent = binding.value || 'Базовый текст';
        instructionEl.style.position = 'absolute';
        instructionEl.style.backgroundColor = 'grey';
        instructionEl.style.border = '1px solid #ddd';
        instructionEl.style.padding = '8px';
        instructionEl.style.borderRadius = '4px';
        instructionEl.style.marginTop = '8px';
        instructionEl.style.boxShadow = '0px 2px 8px rgba(0, 0, 0, 0.1)';
        instructionEl.style.display = 'none';
        instructionEl.style.zIndex = '1000';
        instructionEl.style.pointerEvents = 'none';

        document.body.appendChild(instructionEl);

        let hideTimeout;

        const showInstruction = (event) => {
            clearTimeout(hideTimeout);
            instructionEl.style.left = `${event.clientX}px`;
            instructionEl.style.top = `${event.clientY - 50}px`;
            instructionEl.style.display = 'block';

            hideTimeout = setTimeout(() => {
                instructionEl.style.display = 'none';
            }, 1000);
        };

        const hideInstruction = () => {
            clearTimeout(hideTimeout);
            instructionEl.style.display = 'none';
        };

        el.addEventListener('mouseenter', showInstruction);
        el.addEventListener('mousemove', showInstruction);
        el.addEventListener('mouseleave', hideInstruction);

        el._destroyInstruction = () => {
            el.removeEventListener('mouseenter', showInstruction);
            el.removeEventListener('mousemove', showInstruction);
            el.removeEventListener('mouseleave', hideInstruction);
            document.body.removeChild(instructionEl);
        };
    },
    unmounted(el) {
        el._destroyInstruction();
    },
};
