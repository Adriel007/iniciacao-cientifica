window.onload = async function () {
    const send = document.getElementById('send');
    const dataset = [
        await fetch('./dataset/swearword.json').then(response => response.json()),
        './saved_model',
    ];

    send.onclick = classify;

    //`Result: ${probability > 65 ? "Toxic" : "Normal"}`;

    async function classify() {
        const text = document.getElementById('textarea').value;
        if (!text) {
            return;
        }
        const searchLogic = new SearchLogic(...dataset);
        const probability = await searchLogic.softSearch(text); // await is necessary
        alert(probability);
    }
};