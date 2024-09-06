export default {
    mounted(el) {
        const months = [
            "Января", "Февраля", "Марта", "Апреля", "Мая", "Июня",
            "Июля", "Августа", "Сентября", "Октября", "Ноября", "Декабря"
        ];

        let dateText = el.textContent.trim();

        let [year, month, day] = dateText.split("-");

        if (year && month && day) {
            let monthName = months[parseInt(month, 10) - 1];
            el.textContent = `${day} ${monthName} ${year}`;
        }
    }
};
