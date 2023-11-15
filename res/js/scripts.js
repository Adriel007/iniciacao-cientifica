
const textarea = document.getElementById("textarea");
const result = document.getElementById("result");
window.onload = async function () {
    const naiveBayes = await NaiveBayes.loadModel('./model.json');
    const send = document.getElementById('send');
    const clearBtn = document.getElementById("clear");

    clearBtn.onclick = clear;
    send.onclick = classify;
    textarea.oninput = () => control("");

    function classify() {
        if (!textarea.value) {
            return;
        }

        showResult(naiveBayes.classify(textarea.value));
    }

    control("");
};

function showResult(probability) {
    if (probability.toxic * 100 < 90) {
        control("success");
    } else {
        control("danger");
    }
}

function showInfo() {
    Swal.fire({
        icon: 'info',
        title: 'Como usar',
        html: 'Escreva o texto e clique em "Detectar" para obter a classificação do texto.<br><img src="res/img/qrcode.jpeg">',
        footer: '<h6>Este aplicativo está em desenvolvimento e não possui funcionalidades completas.</h6>'
    });
}

function clear() {
    textarea.value = "";
    control("");
}

function control(state) {
    switch (state) {
        case "success":
            textarea.classList.add("border-success");
            textarea.classList.remove("border-danger");
            result.classList.add("bi-check-circle-fill", "text-success");
            result.classList.remove("bi-question-circle-fill", "text-dark");
            result.classList.remove("bi-exclamation-triangle-fill", "text-danger");
            result.title = "Texto seguro";
            result.onclick = () => {
                Swal.fire({
                    icon: 'success',
                    title: 'Texto seguro',
                    text: 'O texto foi classificado como seguro.',
                });
            };
            break;
        case "danger":
            textarea.classList.add("border-danger");
            textarea.classList.remove("border-success");
            result.classList.remove("bi-check-circle-fill", "text-success");
            result.classList.remove("bi-question-circle-fill", "text-dark");
            result.classList.add("bi-exclamation-triangle-fill", "text-danger");
            result.title = "Texto tóxico";
            result.onclick = () => {
                Swal.fire({
                    icon: 'error',
                    title: 'Texto tóxico',
                    text: 'O texto foi classificado como tóxico.',
                });
            };
            break;
        default:
            textarea.classList.remove("border-success");
            textarea.classList.remove("border-danger");
            result.classList.remove("bi-check-circle-fill", "text-success");
            result.classList.add("bi-question-circle-fill", "text-dark");
            result.classList.remove("bi-exclamation-triangle-fill", "text-danger");
            result.title = "Texto não classificado";
            result.onclick = () => {
                Swal.fire({
                    icon: 'question',
                    title: 'Não classificado',
                    text: 'O texto ainda não foi classificado.',
                });
            };
            break;
    }
}